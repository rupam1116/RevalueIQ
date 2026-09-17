from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Applies production-grade HTTP security and cache headers to all responses.
    - Mitigates MIME sniffing, framing/clickjacking, referrer leakage.
    - Ensures API responses containing private user data are never cached by intermediaries or browsers.
    """

    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)

        # Standard HTTP security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "SAMEORIGIN"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=(self)"

        # Sensitive API data must not be publicly cached
        if request.url.path.startswith("/api/"):
            response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, private"
            response.headers["Pragma"] = "no-cache"

        return response
