from fastapi import APIRouter, Response, status
from app.schemas.health import (
    HealthResponse,
    DatabaseHealthResponse,
    FirebaseHealthResponse,
    GeminiHealthResponse,
    GeminiTestResponse,
    SystemServicesHealthResponse
)
from app.db.mongo import check_database_connection
from app.core.firebase import check_firebase_connection
from app.core.gemini import check_gemini_connection, run_gemini_test_prompt
from app.core.config import settings

router = APIRouter(tags=["Health & System Verification"])


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="API Health Check"
)
async def health_check():
    """Returns basic service availability status."""
    return HealthResponse(
        status="ok",
        service=settings.PROJECT_NAME
    )


@router.get(
    "/health/db",
    response_model=DatabaseHealthResponse,
    summary="Database Connection Health Check"
)
async def database_health_check(response: Response):
    """Performs a REAL MongoDB ping to verify live database connectivity."""
    is_connected = await check_database_connection()
    if is_connected:
        return DatabaseHealthResponse(
            status="ok",
            database="connected"
        )
    else:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
        return DatabaseHealthResponse(
            status="error",
            database="disconnected"
        )


@router.get(
    "/health/firebase",
    response_model=FirebaseHealthResponse,
    summary="Firebase Admin SDK Health Check"
)
async def firebase_health_check(response: Response):
    """Verifies Firebase Admin SDK initialization and real service account credentials."""
    result = await check_firebase_connection()
    if result.get("status") == "ok":
        return FirebaseHealthResponse(
            status="ok",
            firebase="connected",
            project_id=result.get("project_id", settings.FIREBASE_PROJECT_ID)
        )
    else:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
        return FirebaseHealthResponse(
            status="error",
            firebase="disconnected",
            project_id=result.get("project_id", settings.FIREBASE_PROJECT_ID)
        )


@router.get(
    "/health/gemini",
    response_model=GeminiHealthResponse,
    summary="Google Gemini AI API Health Check"
)
async def gemini_health_check(response: Response):
    """Verifies Google Gemini AI API connection and key validity."""
    result = await check_gemini_connection()
    if result.get("status") == "ok":
        return GeminiHealthResponse(
            status="ok",
            service="gemini",
            configured=True,
            reachable=True
        )
    elif result.get("status") == "unconfigured":
        return GeminiHealthResponse(
            status="unconfigured",
            service="gemini",
            configured=False,
            reachable=False,
            message=result.get("message")
        )
    else:
        reason = result.get("reason", "")
        if reason == "authentication_failed":
            response.status_code = status.HTTP_401_UNAUTHORIZED
        elif reason == "rate_limit_exceeded":
            response.status_code = status.HTTP_429_TOO_MANY_REQUESTS
        else:
            response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE

        return GeminiHealthResponse(
            status="error",
            service="gemini",
            configured=True,
            reachable=False,
            reason=reason,
            message=result.get("message")
        )


@router.get(
    "/health/gemini/test",
    response_model=GeminiTestResponse,
    summary="Google Gemini AI Test Connectivity Prompt"
)
async def gemini_test_prompt_endpoint(response: Response):
    """Development connectivity test endpoint executing one minimal Gemini prompt."""
    result = await run_gemini_test_prompt()
    if result.get("status") == "ok":
        return GeminiTestResponse(
            status="ok",
            service="gemini",
            model=result.get("model", settings.GEMINI_MODEL),
            response=result.get("response")
        )
    else:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
        return GeminiTestResponse(
            status="error",
            service="gemini",
            model=settings.GEMINI_MODEL,
            message=result.get("message")
        )


@router.get(
    "/health/services",
    response_model=SystemServicesHealthResponse,
    summary="Full System Services Health Check"
)
async def system_services_health_check(response: Response):
    """Performs end-to-end connectivity check across MongoDB, Firebase, and Gemini AI."""
    db_connected = await check_database_connection()
    firebase_status = await check_firebase_connection()
    gemini_status = await check_gemini_connection()

    all_healthy = db_connected and firebase_status.get("status") == "ok" and gemini_status.get("status") == "ok"
    if not all_healthy:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE

    return SystemServicesHealthResponse(
        status="ok" if all_healthy else "degraded",
        environment=settings.ENVIRONMENT,
        api={
            "status": "ok",
            "service": settings.PROJECT_NAME
        },
        mongodb={
            "status": "connected" if db_connected else "disconnected",
            "database": settings.MONGODB_DATABASE_NAME
        },
        firebase=firebase_status,
        gemini=gemini_status
    )
