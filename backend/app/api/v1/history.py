import logging
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pymongo.asynchronous.database import AsyncDatabase
from bson import ObjectId

from app.api.deps import get_db, get_current_user, AuthenticatedUser
from app.schemas.history import (
    ActivityTimelineResponse,
    HistoryAnalyticsResponse,
    LogLifecycleEventRequest,
    ConfirmCompletionRequest,
    RecentAuditedDeviceItem,
    AuditReportItem,
    ActivityItemResponse,
)
from app.services.history_service import (
    get_user_timeline,
    get_user_analytics,
    log_lifecycle_event,
    confirm_event_completion,
    get_recent_audited_devices,
    get_audit_reports,
)

logger = logging.getLogger("revalueiq.api.history")

router = APIRouter(prefix="/history", tags=["User Activity History & Lifecycle Audit"])


@router.get(
    "/timeline",
    response_model=ActivityTimelineResponse,
    summary="Get User Lifecycle Activity Timeline",
    description=(
        "Retrieves chronological unified activity ledger strictly from persistent MongoDB collections. "
        "Enforces truthful 3-tier classification: recommendations generated, actions initiated, and "
        "externally completed actions. Zero dummy data."
    )
)
async def get_timeline_endpoint(
    q: Optional[str] = Query(None, description="Free text search on title, device name, or description"),
    type: Optional[str] = Query(None, description="Domain filter: valuation, repair, marketplace, donation"),
    tier: Optional[str] = Query(None, description="Tier filter: recommendation_generated, action_initiated, externally_completed"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db)
) -> ActivityTimelineResponse:
    """
    Protected Endpoint: GET /api/v1/history/timeline
    """
    try:
        user_id = ObjectId(current_user.id)
        items, total = await get_user_timeline(
            db,
            user_id=user_id,
            search=q,
            activity_type=type,
            tier=tier,
            page=page,
            limit=limit,
        )

        return ActivityTimelineResponse(
            items=items,
            total=total,
            page=page,
            limit=limit,
            has_more=(page * limit) < total
        )
    except Exception as exc:
        logger.error(f"Error fetching user history timeline: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while loading your activity history."
        )


@router.get(
    "/analytics",
    response_model=HistoryAnalyticsResponse,
    summary="Get User Lifecycle Analytics & Environmental Metrics",
    description=(
        "Computes real-time verified CO2 savings, e-waste diversion, and financial impacts "
        "strictly from real persistent MongoDB records. Distinguishes verified savings from "
        "potential opportunities."
    )
)
async def get_analytics_endpoint(
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db)
) -> HistoryAnalyticsResponse:
    """
    Protected Endpoint: GET /api/v1/history/analytics
    """
    try:
        user_id = ObjectId(current_user.id)
        return await get_user_analytics(db, user_id=user_id)
    except Exception as exc:
        logger.error(f"Error computing history analytics: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while calculating your lifecycle analytics."
        )


@router.get(
    "/recent-devices",
    response_model=List[RecentAuditedDeviceItem],
    summary="Get Recent User Devices for Audit",
    description="Returns actual electronic assets appraised or registered by the authenticated user."
)
async def get_recent_devices_endpoint(
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db)
) -> List[RecentAuditedDeviceItem]:
    """
    Protected Endpoint: GET /api/v1/history/recent-devices
    """
    try:
        user_id = ObjectId(current_user.id)
        return await get_recent_audited_devices(db, user_id=user_id)
    except Exception as exc:
        logger.error(f"Error fetching recent devices for history: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to load your recently audited devices."
        )


@router.get(
    "/reports",
    response_model=List[AuditReportItem],
    summary="Get User Audit Reports & Certificates",
    description="Compiles genuine downloadable audit summaries and certificates from user's persistent assets."
)
async def get_reports_endpoint(
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db)
) -> List[AuditReportItem]:
    """
    Protected Endpoint: GET /api/v1/history/reports
    """
    try:
        user_id = ObjectId(current_user.id)
        return await get_audit_reports(db, user_id=user_id)
    except Exception as exc:
        logger.error(f"Error compiling audit reports: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to retrieve your audit reports."
        )


@router.post(
    "/events",
    status_code=status.HTTP_201_CREATED,
    summary="Log Lifecycle Event (Initiated or Completed)",
    description="Persists a user-initiated action or external completion to MongoDB."
)
async def log_event_endpoint(
    body: LogLifecycleEventRequest,
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db)
) -> Dict[str, Any]:
    """
    Protected Endpoint: POST /api/v1/history/events
    """
    try:
        user_id = ObjectId(current_user.id)
        created_doc = await log_lifecycle_event(db, user_id, body)
        return {
            "message": "Lifecycle event logged successfully.",
            "event_id": str(created_doc["_id"]),
            "event_code": created_doc["event_code"],
            "tier": created_doc["tier"]
        }
    except Exception as exc:
        logger.error(f"Error logging lifecycle event: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to record lifecycle event."
        )


@router.patch(
    "/events/{event_id}/complete",
    summary="Confirm External Completion of an Action",
    description="Transitions an initiated action into an externally verified completed action with persistent proof."
)
async def complete_event_endpoint(
    event_id: str,
    body: ConfirmCompletionRequest,
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db)
) -> Dict[str, Any]:
    """
    Protected Endpoint: PATCH /api/v1/history/events/{event_id}/complete
    """
    try:
        user_id = ObjectId(current_user.id)
        updated_doc = await confirm_event_completion(db, user_id, event_id, body)
        return {
            "message": "External completion successfully confirmed and verified.",
            "event_id": str(updated_doc.get("_id", event_id)),
            "tier": updated_doc.get("tier"),
            "verified_co2_saved_kg": updated_doc.get("verified_co2_saved_kg", 0.0),
            "verified_ewaste_prevented_kg": updated_doc.get("verified_ewaste_prevented_kg", 0.0)
        }
    except ValueError as val_err:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(val_err))
    except LookupError as lookup_err:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(lookup_err))
    except Exception as exc:
        logger.error(f"Error confirming completion: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to verify action completion."
        )
