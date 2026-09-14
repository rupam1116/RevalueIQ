import logging
import time
import sys
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger("revalueiq.api")


class LoggingMiddleware(BaseHTTPMiddleware):
    """Middleware to log request details, response status codes, and execution latency."""
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        path = request.url.path
        method = request.method
        
        try:
            response = await call_next(request)
            duration_ms = round((time.time() - start_time) * 1000, 2)
            logger.info(f"{method} {path} - Status: {response.status_code} - Latency: {duration_ms}ms")
            return response
        except Exception as exc:
            duration_ms = round((time.time() - start_time) * 1000, 2)
            logger.error(f"{method} {path} - Status: 500 FAILED - Latency: {duration_ms}ms - Error: {exc.__class__.__name__}")
            from fastapi.responses import JSONResponse
            from fastapi import status
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content={
                    "error": True,
                    "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                    "message": "An internal server error occurred. Please try again later.",
                    "path": request.url.path
                }
            )
