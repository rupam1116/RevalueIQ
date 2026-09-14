import logging
from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from pymongo.errors import PyMongoError

from app.api.deps import get_db, get_current_user, get_current_user_claims, AuthenticatedUser
from app.schemas.auth import AuthUserResponse, AuthSyncRequest, UserProfileSchema
from app.services.user_service import sync_firebase_user

logger = logging.getLogger("revalueiq.api.auth")

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.get(
    "/me",
    response_model=AuthUserResponse,
    summary="Get Current Authenticated User Profile",
    description="Returns current authenticated user details verified via Firebase ID token and synchronized with MongoDB."
)
async def get_me(
    current_user: AuthenticatedUser = Depends(get_current_user)
) -> AuthUserResponse:
    """
    Protected endpoint: GET /api/v1/auth/me
    
    Requires valid Firebase ID token string in Authorization header:
    Authorization: Bearer <Firebase_ID_Token>
    """
    profile_data = None
    if current_user.profile_doc:
        p = current_user.profile_doc
        profile_data = UserProfileSchema(
            phone=p.get("phone", ""),
            avatar_url=p.get("avatar_url", ""),
            bio=p.get("bio", ""),
            city=p.get("city", ""),
            country=p.get("country", ""),
            occupation=p.get("occupation", ""),
            organization=p.get("organization", ""),
            circular_score=p.get("circular_score", 100),
            circular_grade=p.get("circular_grade", "A"),
            co2_saved_kg=p.get("co2_saved_kg", 0.0),
            ewaste_prevented_kg=p.get("ewaste_prevented_kg", 0.0),
            karma_points=p.get("karma_points", 0),
            level=p.get("level", 1),
            social_links=p.get("social_links", {})
        )

    return AuthUserResponse(
        id=current_user.id,
        firebase_uid=current_user.firebase_uid,
        email=current_user.email,
        display_name=current_user.display_name,
        photo_url=current_user.photo_url,
        role=current_user.role,
        status=current_user.status,
        is_active=current_user.is_active,
        is_verified=current_user.is_verified,
        created_at=current_user.created_at,
        last_login_at=current_user.last_login_at,
        profile=profile_data
    )


@router.post(
    "/sync",
    response_model=AuthUserResponse,
    summary="Synchronize Authenticated User with MongoDB",
    description="Called by client upon login/registration to ensure user identity and profile are synced in MongoDB."
)
async def sync_user(
    body: AuthSyncRequest = AuthSyncRequest(),
    claims: Dict[str, Any] = Depends(get_current_user_claims),
    db: AsyncDatabase = Depends(get_db)
) -> AuthUserResponse:
    """
    Protected endpoint: POST /api/v1/auth/sync
    """
    extra_data = body.model_dump(exclude_unset=True)
    try:
        user_doc, profile_doc = await sync_firebase_user(db, claims, extra_data=extra_data)
    except Exception as exc:
        logger.error(f"Database error during user sync: {exc}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database service temporarily unavailable. User synchronization could not be persisted."
        )
    auth_user = AuthenticatedUser(user_doc, profile_doc)
    
    profile_data = UserProfileSchema(
        phone=profile_doc.get("phone", ""),
        avatar_url=profile_doc.get("avatar_url", ""),
        bio=profile_doc.get("bio", ""),
        city=profile_doc.get("city", ""),
        country=profile_doc.get("country", ""),
        occupation=profile_doc.get("occupation", ""),
        organization=profile_doc.get("organization", ""),
        circular_score=profile_doc.get("circular_score", 100),
        circular_grade=profile_doc.get("circular_grade", "A"),
        co2_saved_kg=profile_doc.get("co2_saved_kg", 0.0),
        ewaste_prevented_kg=profile_doc.get("ewaste_prevented_kg", 0.0),
        karma_points=profile_doc.get("karma_points", 0),
        level=profile_doc.get("level", 1),
        social_links=profile_doc.get("social_links", {})
    )

    return AuthUserResponse(
        id=auth_user.id,
        firebase_uid=auth_user.firebase_uid,
        email=auth_user.email,
        display_name=auth_user.display_name,
        photo_url=auth_user.photo_url,
        role=auth_user.role,
        status=auth_user.status,
        is_active=auth_user.is_active,
        is_verified=auth_user.is_verified,
        created_at=auth_user.created_at,
        last_login_at=auth_user.last_login_at,
        profile=profile_data
    )
