import logging
from fastapi import APIRouter, Depends, HTTPException, status
from pymongo.asynchronous.database import AsyncDatabase
from bson import ObjectId

from app.api.deps import get_db, get_current_user, AuthenticatedUser
from app.schemas.users import UserProfileResponse, UserProfileUpdateRequest, UserStatsResponse
from app.services.users_service import build_profile_dict, update_user_profile, get_user_stats

logger = logging.getLogger("revalueiq.api.users")

router = APIRouter(prefix="/users", tags=["Users & Profile"])


@router.get(
    "/me/profile",
    response_model=UserProfileResponse,
    summary="Get Authenticated User Profile",
    description="Returns current authenticated user profile and sustainability metrics verified via Firebase Bearer token."
)
async def get_my_profile(
    current_user: AuthenticatedUser = Depends(get_current_user)
) -> UserProfileResponse:
    """
    Protected endpoint: GET /api/v1/users/me/profile
    """
    profile_data = build_profile_dict(current_user.user_doc, current_user.profile_doc)
    return UserProfileResponse(**profile_data)


@router.patch(
    "/me/profile",
    response_model=UserProfileResponse,
    summary="Update Authenticated User Profile",
    description="Allows authenticated user to update display name, bio, location, contact, and social links. Protected business fields cannot be modified."
)
async def update_my_profile(
    body: UserProfileUpdateRequest,
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db)
) -> UserProfileResponse:
    """
    Protected endpoint: PATCH /api/v1/users/me/profile
    """
    try:
        user_id = ObjectId(current_user.id)
        update_dict = body.model_dump(exclude_unset=True)
        user_doc, profile_doc = await update_user_profile(db, user_id, update_dict)
        profile_data = build_profile_dict(user_doc, profile_doc)
        return UserProfileResponse(**profile_data)
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Failed to update profile for user_id={current_user.id}: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to update your profile. Please try again."
        )


@router.get(
    "/me/stats",
    response_model=UserStatsResponse,
    summary="Get User Circular Economy Statistics",
    description="Returns real circular economy scores, carbon metrics, and activity counts calculated from MongoDB."
)
async def get_my_stats(
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db)
) -> UserStatsResponse:
    """
    Protected endpoint: GET /api/v1/users/me/stats
    """
    try:
        user_id = ObjectId(current_user.id)
        stats = await get_user_stats(db, user_id, current_user.profile_doc)
        return UserStatsResponse(**stats)
    except Exception as exc:
        logger.error(f"Failed to calculate stats for user_id={current_user.id}: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to load your profile statistics."
        )
