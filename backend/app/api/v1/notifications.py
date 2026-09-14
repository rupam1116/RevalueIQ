import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pymongo.asynchronous.database import AsyncDatabase

from app.api.deps import get_db, get_current_user, AuthenticatedUser
from app.schemas.notifications import (
    NotificationResponse,
    NotificationListResponse,
    UnreadCountResponse,
)
from app.services.notification_service import (
    get_user_notifications,
    get_unread_count,
    mark_notification_read,
    mark_all_notifications_read,
    delete_notification,
)

logger = logging.getLogger("revalueiq.api.notifications")

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get(
    "",
    response_model=NotificationListResponse,
    summary="List Notifications",
    description="Retrieves paginated notifications for the authenticated user."
)
async def list_notifications_endpoint(
    unread_only: bool = Query(False, alias="unread_only", description="Filter only unread notifications"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db)
) -> NotificationListResponse:
    """
    Protected Endpoint: GET /api/v1/notifications
    """
    try:
        items, total, unread_count = await get_user_notifications(
            db=db,
            user_id=current_user.id,
            unread_only=unread_only,
            page=page,
            limit=limit,
        )
        has_more = (page * limit) < total
        return NotificationListResponse(
            items=items,
            total=total,
            unread_count=unread_count,
            page=page,
            limit=limit,
            has_more=has_more,
        )
    except Exception as exc:
        logger.error(f"Error fetching notifications: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to fetch notifications."
        )


@router.get(
    "/unread-count",
    response_model=UnreadCountResponse,
    summary="Get Unread Notification Count",
    description="Fast lightweight endpoint for polling header badge unread notification count."
)
async def get_unread_count_endpoint(
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db)
) -> UnreadCountResponse:
    """
    Protected Endpoint: GET /api/v1/notifications/unread-count
    """
    try:
        count = await get_unread_count(db=db, user_id=current_user.id)
        return UnreadCountResponse(unread_count=count)
    except Exception as exc:
        logger.error(f"Error fetching unread count: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to fetch unread count."
        )


@router.patch(
    "/{notification_id}/read",
    response_model=NotificationResponse,
    summary="Mark Single Notification as Read",
    description="Updates read status for a specific notification after ownership check."
)
async def mark_read_endpoint(
    notification_id: str,
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db)
) -> NotificationResponse:
    """
    Protected Endpoint: PATCH /api/v1/notifications/{id}/read
    """
    return await mark_notification_read(
        db=db,
        user_id=current_user.id,
        notification_id=notification_id
    )


@router.patch(
    "/read-all",
    summary="Mark All Notifications as Read",
    description="Marks all unread notifications for current authenticated user as read."
)
async def mark_all_read_endpoint(
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db)
):
    """
    Protected Endpoint: PATCH /api/v1/notifications/read-all
    """
    modified_count = await mark_all_notifications_read(
        db=db,
        user_id=current_user.id
    )
    return {"message": "All notifications marked as read", "updated_count": modified_count}


@router.delete(
    "/{notification_id}",
    summary="Delete Notification",
    description="Deletes a notification record belonging to the authenticated user."
)
async def delete_notification_endpoint(
    notification_id: str,
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db)
):
    """
    Protected Endpoint: DELETE /api/v1/notifications/{id}
    """
    deleted = await delete_notification(
        db=db,
        user_id=current_user.id,
        notification_id=notification_id
    )
    return {"success": deleted, "id": notification_id}
