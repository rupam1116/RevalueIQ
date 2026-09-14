import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from pymongo.asynchronous.database import AsyncDatabase
from bson import ObjectId

from app.api.deps import get_db, get_current_user, AuthenticatedUser
from app.schemas.repair_advisory import (
    RepairAdvisoryRequest,
    RepairAdvisoryResponse,
)
from app.services.repair_advisory_service import (
    analyze_and_create_advisory,
    list_user_advisories,
    get_user_advisory,
    delete_user_advisory,
)

logger = logging.getLogger("revalueiq.api.repair_advisory")

router = APIRouter(prefix="/repair-advisory", tags=["Repair Advisory & AI Diagnostics"])


@router.post(
    "/analyze",
    response_model=RepairAdvisoryResponse,
    status_code=status.HTTP_200_OK,
    summary="Analyze Device Repair & Diagnostic Issue via Gemini AI",
    description=(
        "Performs comprehensive AI repair analysis on consumer electronics using confirmed specifications, "
        "reported problem symptoms, and optional visual evidence. Enforces strict IDOR ownership checks on registered devices. "
        "Estimates required components and repair costs in INR, provides safety warnings for battery/electrical hazards, "
        "and persists the diagnostic audit into MongoDB."
    ),
    responses={
        200: {"description": "Repair analysis successfully executed and saved."},
        400: {"description": "Invalid repair image or malformed input payload."},
        401: {"description": "Unauthenticated request / Invalid Firebase Bearer token."},
        404: {"description": "Referenced device or valuation not found or belongs to another user."},
        429: {"description": "AI repair service usage limit exceeded."},
        502: {"description": "Gemini AI API upstream failure."},
        503: {"description": "AI service temporarily experiencing high demand."},
        504: {"description": "AI diagnostic analysis request timed out."}
    }
)
async def analyze_repair(
    body: RepairAdvisoryRequest,
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db)
) -> RepairAdvisoryResponse:
    """
    Protected endpoint: POST /api/v1/repair-advisory/analyze
    """
    try:
        user_id = ObjectId(current_user.id)
        result = await analyze_and_create_advisory(db, user_id, body)
        return RepairAdvisoryResponse(**result)
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Failed to analyze repair advisory for user_id={current_user.id}: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to perform AI repair analysis."
        )


@router.get(
    "",
    response_model=List[RepairAdvisoryResponse],
    summary="List Authenticated User Repair Advisories",
    description="Retrieves the history of repair diagnostic reports belonging to the authenticated user."
)
async def list_advisories(
    device_id: Optional[str] = Query(None, description="Filter by registered device ID"),
    severity: Optional[str] = Query(None, description="Filter by severity e.g. LOW, MEDIUM, HIGH, CRITICAL"),
    search: Optional[str] = Query(None, description="Search term for model, diagnosis, or code"),
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db)
) -> List[RepairAdvisoryResponse]:
    """
    Protected endpoint: GET /api/v1/repair-advisory
    """
    try:
        user_id = ObjectId(current_user.id)
        advisories = await list_user_advisories(
            db, user_id, device_id=device_id, severity=severity, search=search
        )
        return [RepairAdvisoryResponse(**a) for a in advisories]
    except Exception as exc:
        logger.error(f"Failed to list repair advisories for user_id={current_user.id}: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to retrieve repair advisory history."
        )


@router.get(
    "/{advisory_id}",
    response_model=RepairAdvisoryResponse,
    summary="Get Specific Repair Advisory",
    description="Retrieves details for a specific diagnostic audit record. Enforces strict IDOR ownership checks."
)
async def get_advisory(
    advisory_id: str,
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db)
) -> RepairAdvisoryResponse:
    """
    Protected endpoint: GET /api/v1/repair-advisory/{advisory_id}
    """
    user_id = ObjectId(current_user.id)
    advisory = await get_user_advisory(db, user_id, advisory_id)
    if not advisory:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Repair advisory not found."
        )
    return RepairAdvisoryResponse(**advisory)


@router.delete(
    "/{advisory_id}",
    summary="Delete Specific Repair Advisory",
    description="Deletes a repair diagnostic audit record belonging to the authenticated user."
)
async def delete_advisory(
    advisory_id: str,
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db)
):
    """
    Protected endpoint: DELETE /api/v1/repair-advisory/{advisory_id}
    """
    try:
        user_id = ObjectId(current_user.id)
        deleted = await delete_user_advisory(db, user_id, advisory_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Repair advisory not found."
            )
        return {"message": "Repair advisory deleted successfully."}
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Failed to delete repair advisory {advisory_id} for user_id={current_user.id}: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to delete the repair advisory record."
        )
