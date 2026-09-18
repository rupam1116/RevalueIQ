import json
import logging
import os
from pathlib import Path
from typing import Optional
import firebase_admin
from firebase_admin import credentials, auth
from app.core.config import settings, BASE_DIR

logger = logging.getLogger("revalueiq.firebase")

_firebase_app = None


def _resolve_service_account_path() -> Optional[Path]:
    """Resolves the service account JSON path relative to BASE_DIR or as absolute path."""
    if not settings.FIREBASE_SERVICE_ACCOUNT_PATH:
        return None
    p = Path(settings.FIREBASE_SERVICE_ACCOUNT_PATH)
    if p.is_absolute() and p.exists():
        return p
    
    resolved = (BASE_DIR / p).resolve()
    if resolved.exists():
        return resolved

    alt_resolved = (BASE_DIR / p.name).resolve()
    if alt_resolved.exists():
        return alt_resolved

    return None


def init_firebase() -> bool:
    """Safely initializes the Firebase Admin SDK foundation using service account credentials."""
    global _firebase_app
    if firebase_admin._apps:
        _firebase_app = firebase_admin.get_app()
        return True

    try:
        if settings.FIREBASE_SERVICE_ACCOUNT_JSON and settings.FIREBASE_SERVICE_ACCOUNT_JSON.strip():
            try:
                raw_json = json.loads(settings.FIREBASE_SERVICE_ACCOUNT_JSON.strip())
                cred = credentials.Certificate(raw_json)
                _firebase_app = firebase_admin.initialize_app(cred)
                logger.info("Firebase Admin SDK initialized from FIREBASE_SERVICE_ACCOUNT_JSON environment variable.")
                return True
            except Exception as json_err:
                logger.error(f"Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON environment variable: {json_err}")

        sa_path = _resolve_service_account_path()
        if sa_path and sa_path.exists():
            cred = credentials.Certificate(str(sa_path))
            _firebase_app = firebase_admin.initialize_app(cred)
            logger.info(f"Firebase Admin SDK initialized from service account file ({sa_path.name}).")
            return True

        if settings.FIREBASE_PROJECT_ID and settings.FIREBASE_CLIENT_EMAIL and settings.FIREBASE_PRIVATE_KEY:
            cred_dict = {
                "type": "service_account",
                "project_id": settings.FIREBASE_PROJECT_ID,
                "private_key": settings.FIREBASE_PRIVATE_KEY.replace("\\n", "\n"),
                "client_email": settings.FIREBASE_CLIENT_EMAIL,
                "token_uri": "https://oauth2.googleapis.com/token",
            }
            cred = credentials.Certificate(cred_dict)
            _firebase_app = firebase_admin.initialize_app(cred)
            logger.info("Firebase Admin SDK initialized from environment credentials.")
            return True

        if settings.ENVIRONMENT == "development":
            options = {"projectId": settings.FIREBASE_PROJECT_ID or "revalueiq-165c1"}
            _firebase_app = firebase_admin.initialize_app(options=options)
            logger.info("Firebase Admin SDK initialized in development fallback mode.")
            return True

        logger.warning("Firebase Admin SDK credentials not configured.")
        return False
    except Exception as e:
        logger.error(f"Failed to initialize Firebase Admin SDK: {e}")
        return False


def verify_firebase_id_token(id_token: str) -> dict:
    """Verifies a real Firebase ID token string and returns decoded user claims dictionary."""
    if not firebase_admin._apps:
        init_firebase()
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        logger.error(f"Firebase token verification failed: {e}")
        raise e


async def check_firebase_connection() -> dict:
    """Checks Firebase Admin SDK initialization and real credentials state."""
    try:
        if not firebase_admin._apps:
            initialized = init_firebase()
            if not initialized:
                return {
                    "status": "error",
                    "firebase": "disconnected",
                    "project_id": settings.FIREBASE_PROJECT_ID,
                    "message": "Firebase Admin SDK credentials unconfigured"
                }

        app = firebase_admin.get_app()
        project_id = getattr(app, "project_id", settings.FIREBASE_PROJECT_ID)
        return {
            "status": "ok",
            "firebase": "connected",
            "project_id": project_id
        }
    except Exception as exc:
        logger.warning(f"Firebase health check notice: {exc}")
        return {
            "status": "error",
            "firebase": "disconnected"
        }
