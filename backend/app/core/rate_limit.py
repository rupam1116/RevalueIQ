import time
import os
import threading
from typing import Dict, List, Tuple
from fastapi import Request, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.logging import logger


class SlidingWindowRateLimiter:
    """
    Thread-safe, process-local in-memory sliding-window rate limiter.
    Enforces per-client IP / user request quotas across configurable time windows.
    Documented for horizontal scaling: Single-instance / sticky-session compatible;
    for distributed multi-replica deployments, backing by an external store (e.g. Redis)
    can be plugged in without changing the middleware contract.
    """

    def __init__(self):
        self._lock = threading.Lock()
        # Maps client_identifier -> list of timestamp floats
        self._requests: Dict[str, List[float]] = {}
        # Cleanup tracker
        self._last_cleanup = time.time()

    def _cleanup_old_entries(self, now: float, max_age: float = 120.0) -> None:
        """Periodically cleans up expired client records to prevent memory growth."""
        if now - self._last_cleanup < 60.0:
            return
        self._last_cleanup = now
        expired_keys = []
        for key, timestamps in self._requests.items():
            valid = [ts for ts in timestamps if now - ts < max_age]
            if valid:
                self._requests[key] = valid
            else:
                expired_keys.append(key)
        for k in expired_keys:
            del self._requests[k]

    def is_allowed(
        self, client_id: str, max_requests: int, window_seconds: float = 60.0
    ) -> Tuple[bool, int, float]:
        """
        Returns (is_allowed, remaining_requests, retry_after_seconds).
        """
        now = time.time()
        with self._lock:
            self._cleanup_old_entries(now, max_age=window_seconds * 2)

            timestamps = self._requests.get(client_id, [])
            cutoff = now - window_seconds
            # Filter timestamps within current window
            recent = [ts for ts in timestamps if ts > cutoff]

            if len(recent) >= max_requests:
                earliest = recent[0]
                retry_after = max(1.0, round(window_seconds - (now - earliest), 1))
                self._requests[client_id] = recent
                return False, 0, retry_after

            recent.append(now)
            self._requests[client_id] = recent
            remaining = max_requests - len(recent)
            return True, remaining, 0.0


limiter = SlidingWindowRateLimiter()

# Route sensitivity configuration: (path_prefix, method, max_requests_per_min)
SENSITIVE_LIMITS = [
    ("/api/v1/valuations/detect-device", "POST", 20),
    ("/api/v1/valuations", "POST", 25),
    ("/api/v1/repair-advisory", "POST", 25),
    ("/api/v1/payments/orders", "POST", 30),
    ("/api/v1/payments/verify", "POST", 30),
    ("/api/v1/marketplace/upload-image", "POST", 30),
    ("/api/v1/marketplace/listings", "POST", 30),
    ("/api/v1/account/delete", "POST", 10),
    ("/api/v1/account/export", "GET", 10),
    # Map & Location Services (protect against proxy abuse of upstream OSM/Nominatim/Overpass/OSRM)
    ("/api/v1/repair-centers/route", "GET", 30),
    ("/api/v1/repair-centers/recommend", "POST", 30),
    ("/api/v1/repair-centers", "GET", 60),
    ("/api/v1/donation-organizations/route", "GET", 30),
    ("/api/v1/donation-organizations/recommend", "POST", 30),
    ("/api/v1/donation-organizations", "GET", 60),
]

DEFAULT_API_LIMIT = 180  # Default requests per minute for general endpoints


class RateLimitMiddleware(BaseHTTPMiddleware):
    """FastAPI Middleware that enforces sliding-window rate limits per client IP."""

    async def dispatch(self, request: Request, call_next):
        # Skip rate limiting for static docs and unit tests unless explicit test header present
        if (
            os.getenv("PYTEST_CURRENT_TEST")
            and request.headers.get("X-Test-Rate-Limit") != "enforce"
        ):
            return await call_next(request)

        path = request.url.path
        method = request.method

        # Only apply rate limiting to /api/ routes, exempt docs/openapi
        if not path.startswith("/api/"):
            return await call_next(request)

        # Derive client key from X-Forwarded-For or client IP
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            client_ip = forwarded.split(",")[0].strip()
        else:
            client_ip = request.client.host if request.client else "unknown"

        # Determine limit for this path/method
        max_limit = DEFAULT_API_LIMIT
        limit_key = f"{client_ip}:{path}"

        for prefix, req_method, limit_val in SENSITIVE_LIMITS:
            if path.startswith(prefix) and (req_method == "*" or method == req_method):
                max_limit = limit_val
                limit_key = f"{client_ip}:{prefix}:{method}"
                break

        allowed, remaining, retry_after = limiter.is_allowed(
            client_id=limit_key,
            max_requests=max_limit,
            window_seconds=60.0
        )

        if not allowed:
            logger.warning(f"Rate limit exceeded for client '{client_ip}' on {method} {path}")
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={
                    "error": True,
                    "status_code": 429,
                    "message": "Rate limit exceeded. Please slow down your requests and try again.",
                    "path": path,
                    "retry_after_seconds": int(retry_after)
                },
                headers={
                    "Retry-After": str(int(retry_after)),
                    "X-RateLimit-Limit": str(max_limit),
                    "X-RateLimit-Remaining": "0"
                }
            )

        response = await call_next(request)
        response.headers["X-RateLimit-Limit"] = str(max_limit)
        response.headers["X-RateLimit-Remaining"] = str(remaining)
        return response
