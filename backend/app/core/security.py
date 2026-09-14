import logging
from typing import Optional, Dict, Any
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pymongo.asynchronous.database import AsyncDatabase

from app.core.config import settings
from app.core.firebase import verify_firebase_id_token
from app.db.mongo import get_db
from app.services.user_service import sync_firebase_user

logger = logging.getLogger("revalueiq.security")

security_bearer = HTTPBearer(auto_error=False)


class AuthenticatedUser:
    """Authenticated user domain model holding MongoDB user and profile document state."""
    def __init__(self, user_doc: Dict[str, Any], profile_doc: Dict[str, Any]):
        self.user_doc = user_doc
        self.profile_doc = profile_doc
        self.id = str(user_doc.get("_id", ""))
        self.firebase_uid = user_doc.get("firebase_uid", "")
        self.email = user_doc.get("email", "")
        self.display_name = user_doc.get("full_name", "")
        self.photo_url = user_doc.get("photo_url", "")
        self.role = user_doc.get("role", "user")
        self.status = user_doc.get("status", "active")
        self.is_active = user_doc.get("is_active", True)
        self.is_verified = user_doc.get("is_verified", False)
        self.created_at = user_doc.get("created_at")
        self.last_login_at = user_doc.get("last_login_at")


async def get_current_user_claims(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_bearer)
) -> Dict[str, Any]:
    """
    Extracts and verifies Firebase ID token from Authorization header.
    Throws HTTP 401 Unauthorized for missing, malformed, or invalid tokens.
    """
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token required in header: 'Authorization: Bearer <Firebase_ID_Token>'",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials
    try:
        claims = verify_firebase_id_token(token)
        if not claims or not claims.get("uid"):
            raise ValueError("Token verification returned empty claims.")
        return claims
    except Exception as exc:
        logger.warning(f"Firebase token verification rejected: {exc}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid, expired, or revoked authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user(
    claims: Dict[str, Any] = Depends(get_current_user_claims),
    db: AsyncDatabase = Depends(get_db)
) -> AuthenticatedUser:
    """
    FastAPI dependency that verifies the Firebase ID token and synchronizes/retrieves
    the corresponding user record from MongoDB.
    """
    try:
        user_doc, profile_doc = await sync_firebase_user(db, claims)
        return AuthenticatedUser(user_doc, profile_doc)
    except Exception as exc:
        logger.error(f"Error synchronizing authenticated user: {exc}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database service temporarily unavailable. User synchronization could not be persisted.",
        )


async def get_optional_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_bearer),
    db: AsyncDatabase = Depends(get_db)
) -> Optional[AuthenticatedUser]:
    """
    Optional user dependency: returns AuthenticatedUser if valid token is provided,
    otherwise None without throwing 401.
    """
    if not credentials or not credentials.credentials:
        return None
    try:
        claims = verify_firebase_id_token(credentials.credentials)
        if claims and claims.get("uid"):
            user_doc, profile_doc = await sync_firebase_user(db, claims)
            return AuthenticatedUser(user_doc, profile_doc)
    except Exception:
        return None
    return None


# Backward compatibility alias for Phase 0 foundation
class AuthUserFoundation:
    def __init__(self, uid: str, email: Optional[str] = None, name: Optional[str] = None, is_dev: bool = False):
        self.uid = uid
        self.email = email
        self.name = name
        self.is_dev = is_dev


async def get_current_user_foundation(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_bearer)
) -> AuthUserFoundation:
    claims = await get_current_user_claims(credentials)
    return AuthUserFoundation(
        uid=claims.get("uid", ""),
        email=claims.get("email"),
        name=claims.get("name"),
        is_dev=False
    )
