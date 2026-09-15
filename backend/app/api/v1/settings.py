import logging
from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId
from pymongo.asynchronous.database import AsyncDatabase

from app.api.deps import get_db, get_current_user, AuthenticatedUser
from app.schemas.settings import (
    UserSettingsResponse,
    UserSettingsUpdateRequest,
    AccountExportResponse,
    SupportTicketCreateRequest,
    SupportTicketResponse,
)
from app.services.settings_service import (
    get_or_create_user_settings,
    update_user_settings,
)
from app.services.account_service import (
    export_user_data,
    deactivate_user_account,
    delete_user_account,
    purge_user_activity,
)
from app.services.support_service import create_support_ticket

logger = logging.getLogger("revalueiq.api.settings")

router = APIRouter(tags=["Settings & Account Management"])


# -------------------------------------------------------------
# Settings GET & PATCH
# -------------------------------------------------------------
@router.get(
    "/settings",
    response_model=UserSettingsResponse,
    summary="Get Authenticated User Settings",
    description="Returns notification preferences, privacy rules, app preferences, and AI engine preferences from MongoDB."
)
async def get_settings_endpoint(
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db)
) -> UserSettingsResponse:
    try:
        user_id = ObjectId(current_user.id)
        return await get_or_create_user_settings(db, user_id)
    except Exception as exc:
        logger.error(f"Failed to fetch settings for user_id={current_user.id}: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to load your settings at this time."
        )


@router.patch(
    "/settings",
    response_model=UserSettingsResponse,
    summary="Update Authenticated User Settings",
    description="Updates whitelisted preferences for notifications, privacy, app layout, and AI engine."
)
async def update_settings_endpoint(
    body: UserSettingsUpdateRequest,
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db)
) -> UserSettingsResponse:
    try:
        user_id = ObjectId(current_user.id)
        return await update_user_settings(db, user_id, body)
    except Exception as exc:
        logger.error(f"Failed to update settings for user_id={current_user.id}: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to save your settings. Please try again."
        )


# -------------------------------------------------------------
# Account Data Export
# -------------------------------------------------------------
@router.get(
    "/account/export",
    response_model=AccountExportResponse,
    summary="Export My Data (GDPR / Privacy Compliance)",
    description="Exports complete structured JSON archive containing only the authenticated user's records across all collections."
)
async def export_my_data_endpoint(
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db)
) -> AccountExportResponse:
    try:
        user_id = ObjectId(current_user.id)
        return await export_user_data(
            db=db,
            user_id=user_id,
            user_doc=current_user.user_doc,
            profile_doc=current_user.profile_doc,
        )
    except Exception as exc:
        logger.error(f"Failed to export data for user_id={current_user.id}: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to generate your data export archive."
        )


# -------------------------------------------------------------
# Cache / Activity Purge
# -------------------------------------------------------------
@router.post(
    "/account/clear-history",
    summary="Purge Activity History & Cached Notifications",
    description="Purges non-financial activity logs and notifications belonging to authenticated user."
)
async def clear_history_endpoint(
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db)
):
    try:
        user_id = ObjectId(current_user.id)
        cleared_count = await purge_user_activity(db, user_id)
        return {
            "success": True,
            "message": "Activity history and notifications cleared.",
            "cleared_count": cleared_count,
        }
    except Exception as exc:
        logger.error(f"Failed to purge history for user_id={current_user.id}: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to clear activity history."
        )


# -------------------------------------------------------------
# Deactivation & Deletion
# -------------------------------------------------------------
@router.post(
    "/account/deactivate",
    summary="Deactivate Account",
    description="Soft-freezes user profile and listings. Account can be reactivated on next login."
)
async def deactivate_account_endpoint(
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db)
):
    try:
        user_id = ObjectId(current_user.id)
        success = await deactivate_user_account(db, user_id, current_user.firebase_uid)
        return {
            "success": success,
            "message": "Your account has been deactivated."
        }
    except Exception as exc:
        logger.error(f"Failed to deactivate account for user_id={current_user.id}: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to deactivate account."
        )


@router.post(
    "/account/delete",
    summary="Delete Account Permanently (Soft Delete)",
    description="Soft-deletes account, revokes sessions, and locks login while preserving required transaction records."
)
async def delete_account_endpoint(
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db)
):
    try:
        user_id = ObjectId(current_user.id)
        success = await delete_user_account(db, user_id, current_user.firebase_uid)
        return {
            "success": success,
            "message": "Your account has been closed and marked for permanent deletion."
        }
    except Exception as exc:
        logger.error(f"Failed to delete account for user_id={current_user.id}: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete account."
        )


# -------------------------------------------------------------
# Support Ticket Submission
# -------------------------------------------------------------
@router.post(
    "/support/ticket",
    response_model=SupportTicketResponse,
    summary="Submit Support Ticket / Bug Report / Feature Request",
    description="Persists real customer support inquiry in MongoDB."
)
async def submit_support_ticket_endpoint(
    body: SupportTicketCreateRequest,
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db)
) -> SupportTicketResponse:
    try:
        user_id = ObjectId(current_user.id)
        return await create_support_ticket(
            db=db,
            user_id=user_id,
            user_email=current_user.email,
            ticket_in=body
        )
    except Exception as exc:
        logger.error(f"Failed to submit support ticket for user_id={current_user.id}: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to submit your support request. Please try again."
        )
