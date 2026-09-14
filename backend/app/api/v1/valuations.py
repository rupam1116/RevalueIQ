import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from pymongo.asynchronous.database import AsyncDatabase
from bson import ObjectId

from app.api.deps import get_db, get_current_user, AuthenticatedUser
from app.schemas.valuations import (
    CreateValuationRequest,
    ValuationResponse,
    ValuationStatusResponse,
    ValuationListResponse,
    DeviceDetectionRequest,
    DeviceDetectionResponse,
    ValuationCertificateResponse,
    RegisterDeviceFromValuationResponse,
)
from app.services.valuation_service import (
    create_valuation,
    list_user_valuations,
    get_user_valuation,
    delete_user_valuation,
    get_user_valuation_status,
    analyze_user_valuation,
    get_valuation_certificate,
    register_device_from_valuation,
)
from app.services.gemini_service import detect_device_from_image

logger = logging.getLogger("revalueiq.api.valuations")

router = APIRouter(prefix="/valuations", tags=["Device Valuations & Appraisals"])


@router.post(
    "/detect-device",
    response_model=DeviceDetectionResponse,
    status_code=status.HTTP_200_OK,
    summary="Detect Device Specifications from Image",
    description="Analyzes an uploaded device photo via backend Gemini Vision SDK to auto-detect category, brand, model, and condition."
)
async def detect_device(
    body: DeviceDetectionRequest,
    current_user: AuthenticatedUser = Depends(get_current_user)
) -> DeviceDetectionResponse:
    """
    Protected endpoint: POST /api/v1/valuations/detect-device
    """
    try:
        detection_result = await detect_device_from_image(body.image_reference)
        return DeviceDetectionResponse(device_detection=detection_result)
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Failed to perform device detection for user_id={current_user.id}: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to perform AI device detection."
        )



@router.post(
    "",
    response_model=ValuationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create New Device Valuation",
    description="Creates a new pending device appraisal for the authenticated user."
)
async def create_new_valuation(
    body: CreateValuationRequest,
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db)
) -> ValuationResponse:
    """
    Protected endpoint: POST /api/v1/valuations
    """
    try:
        user_id = ObjectId(current_user.id)
        created_val = await create_valuation(db, user_id, body)
        return ValuationResponse(**created_val)
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Failed to create valuation for user_id={current_user.id}: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to create appraisal. Please try again."
        )


@router.get(
    "",
    response_model=List[ValuationResponse],
    summary="List Authenticated User Valuations",
    description="Retrieves the history of device appraisals belonging to the authenticated user with optional filtering."
)
async def list_valuations(
    category: Optional[str] = Query(None, description="Filter by device category e.g. Smartphone, Laptop"),
    val_status: Optional[str] = Query(None, alias="status", description="Filter by status e.g. completed, pending"),
    search: Optional[str] = Query(None, description="Search term for device model, brand, or valuation code"),
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db)
) -> List[ValuationResponse]:
    """
    Protected endpoint: GET /api/v1/valuations
    """
    try:
        user_id = ObjectId(current_user.id)
        valuations = await list_user_valuations(
            db, user_id, category=category, status=val_status, search=search
        )
        return [ValuationResponse(**v) for v in valuations]
    except Exception as exc:
        logger.error(f"Failed to list valuations for user_id={current_user.id}: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to retrieve valuation history."
        )


@router.get(
    "/{valuation_id}",
    response_model=ValuationResponse,
    summary="Get Specific User Valuation",
    description="Retrieves details for a specific appraisal. Enforces strict ownership checks."
)
async def get_valuation(
    valuation_id: str,
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db)
) -> ValuationResponse:
    """
    Protected endpoint: GET /api/v1/valuations/{valuation_id}
    """
    user_id = ObjectId(current_user.id)
    valuation = await get_user_valuation(db, user_id, valuation_id)
    if not valuation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Valuation not found."
        )
    return ValuationResponse(**valuation)


@router.get(
    "/{valuation_id}/status",
    response_model=ValuationStatusResponse,
    summary="Get Valuation Status",
    description="Retrieves only the appraisal status information for a specific valuation."
)
async def get_valuation_status_info(
    valuation_id: str,
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db)
) -> ValuationStatusResponse:
    """
    Protected endpoint: GET /api/v1/valuations/{valuation_id}/status
    """
    user_id = ObjectId(current_user.id)
    val_status = await get_user_valuation_status(db, user_id, valuation_id)
    if not val_status:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Valuation not found."
        )
    return ValuationStatusResponse(**val_status)


@router.get(
    "/{valuation_id}/certificate",
    response_model=ValuationCertificateResponse,
    summary="Get Official Valuation Certificate",
    description="Generates an official digital valuation certificate with SHA-256 digital fingerprint and circular metrics."
)
async def get_valuation_certificate_endpoint(
    valuation_id: str,
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db)
) -> ValuationCertificateResponse:
    """
    Protected endpoint: GET /api/v1/valuations/{valuation_id}/certificate
    """
    user_id = ObjectId(current_user.id)
    cert = await get_valuation_certificate(db, user_id, valuation_id)
    return ValuationCertificateResponse(**cert)


@router.post(
    "/{valuation_id}/register-device",
    response_model=RegisterDeviceFromValuationResponse,
    status_code=status.HTTP_200_OK,
    summary="Register Device from Valuation into User Portfolio",
    description="Converts an appraised valuation into a registered device item in the user's registered devices collection."
)
async def register_device_from_valuation_endpoint(
    valuation_id: str,
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db)
) -> RegisterDeviceFromValuationResponse:
    """
    Protected endpoint: POST /api/v1/valuations/{valuation_id}/register-device
    """
    try:
        user_id = ObjectId(current_user.id)
        result = await register_device_from_valuation(db, user_id, valuation_id)
        return RegisterDeviceFromValuationResponse(**result)
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Failed to register device from valuation {valuation_id} for user_id={current_user.id}: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to register device from valuation."
        )


@router.delete(
    "/{valuation_id}",
    summary="Delete Specific User Valuation",
    description="Deletes a device appraisal record belonging to the authenticated user."
)
async def delete_valuation(
    valuation_id: str,
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db)
):
    """
    Protected endpoint: DELETE /api/v1/valuations/{valuation_id}
    """
    try:
        user_id = ObjectId(current_user.id)
        deleted = await delete_user_valuation(db, user_id, valuation_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Valuation not found."
            )
        return {"message": "Valuation deleted successfully."}
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Failed to delete valuation {valuation_id} for user_id={current_user.id}: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to delete the valuation record."
        )


@router.post(
    "/{valuation_id}/analyze",
    response_model=ValuationResponse,
    status_code=status.HTTP_200_OK,
    summary="Analyze Valuation Image via Gemini AI",
    description=(
        "Triggers backend Google Gemini AI device image vision analysis for the specified valuation. "
        "Enforces strict user ownership checks (IDOR protection). "
        "Transitions status through lifecycle: pending -> analyzing -> completed (or failed). "
        "Persists structured AI observations, damage report, repair estimate, resale valuation, "
        "confidence score, and reasoning into the MongoDB device_valuations document."
    ),
    responses={
        200: {"description": "Image analysis successfully executed and saved."},
        400: {"description": "Missing image reference or unsupported image format."},
        401: {"description": "Unauthenticated request / Invalid Firebase Bearer token."},
        404: {"description": "Valuation not found or belongs to another user."},
        429: {"description": "Gemini AI rate limit or quota exceeded."},
        502: {"description": "Gemini AI API failure or malformed response."},
        504: {"description": "Gemini AI request timeout."}
    }
)
async def analyze_valuation(
    valuation_id: str,
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db)
) -> ValuationResponse:
    """
    Protected endpoint: POST /api/v1/valuations/{valuation_id}/analyze
    """
    try:
        user_id = ObjectId(current_user.id)
        analyzed_val = await analyze_user_valuation(db, user_id, valuation_id)
        return ValuationResponse(**analyzed_val)
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Failed to analyze valuation {valuation_id} for user_id={current_user.id}: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to perform AI valuation image analysis."
        )

