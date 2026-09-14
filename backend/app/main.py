from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.config import settings
from app.core.logging import LoggingMiddleware, logger
from app.core.firebase import init_firebase
from app.db.mongo import connect_to_mongo, close_mongo_connection, init_mongo_indexes
from app.core.exceptions import (
    custom_http_exception_handler,
    validation_exception_handler,
    generic_exception_handler,
)
from app.api.v1.router import api_v1_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan event handler for startup and shutdown actions."""
    logger.info(f"Starting {settings.PROJECT_NAME} v{settings.VERSION} [{settings.ENVIRONMENT}]")
    init_firebase()
    await connect_to_mongo()
    await init_mongo_indexes()
    yield
    logger.info(f"Shutting down {settings.PROJECT_NAME}")
    await close_mongo_connection()


def create_application() -> FastAPI:
    """FastAPI Application Factory."""
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        description="RevalueIQ AI-Powered Circular Economy API",
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
        lifespan=lifespan,
    )

    # 1. Production Logging Middleware
    app.add_middleware(LoggingMiddleware)

    # 2. CORS Configuration (Added after LoggingMiddleware so CORSMiddleware wraps all responses on the outside)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # 3. Centralized Exception Handlers
    app.add_exception_handler(StarletteHTTPException, custom_http_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(Exception, generic_exception_handler)

    # 4. Mount API v1 Routers
    app.include_router(api_v1_router, prefix="/api/v1")

    return app


app = create_application()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=settings.DEBUG)
