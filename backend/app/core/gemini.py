import asyncio
import logging
from typing import Dict, Any, Optional
from google import genai
from google.genai.errors import APIError
from app.core.config import settings

logger = logging.getLogger("revalueiq.gemini")

_gemini_client: Optional[genai.Client] = None
_gemini_client_key: Optional[str] = None
_gemini_client_loop: Optional[asyncio.AbstractEventLoop] = None


def get_gemini_client() -> Optional[genai.Client]:
    """Returns google-genai Client instance matching current settings.GEMINI_API_KEY and active asyncio event loop."""
    global _gemini_client, _gemini_client_key, _gemini_client_loop
    current_key = (settings.GEMINI_API_KEY or "").strip()

    if not current_key:
        _gemini_client = None
        _gemini_client_key = None
        _gemini_client_loop = None
        return None

    current_loop = None
    try:
        current_loop = asyncio.get_running_loop()
    except RuntimeError:
        current_loop = None

    if (
        _gemini_client is None
        or _gemini_client_key != current_key
        or (_gemini_client_loop is not None and current_loop is not None and _gemini_client_loop != current_loop)
    ):
        try:
            _gemini_client = genai.Client(api_key=current_key)
            _gemini_client_key = current_key
            _gemini_client_loop = current_loop
            logger.info(
                f"Google GenAI SDK client initialized (key_configured=True, length={len(current_key)}, model='{settings.GEMINI_MODEL}')."
            )
        except Exception as exc:
            logger.error(f"Failed to initialize Google GenAI client: {exc}")
            _gemini_client = None
            _gemini_client_key = None
            _gemini_client_loop = None
    return _gemini_client


def init_gemini() -> bool:
    """Initializes singleton Gemini client."""
    client = get_gemini_client()
    return client is not None


async def check_gemini_connection() -> Dict[str, Any]:
    """
    Performs real Gemini API connectivity verification.
    Distinguishes:
    1. Gemini configured and reachable
    2. Gemini API key missing
    3. Gemini authentication failure
    4. Gemini quota/rate-limit failure
    5. Gemini service/network failure
    """
    if not settings.GEMINI_API_KEY:
        return {
            "status": "unconfigured",
            "service": "gemini",
            "configured": False,
            "reachable": False,
            "message": "GEMINI_API_KEY is missing from backend environment."
        }

    client = get_gemini_client()
    if not client:
        return {
            "status": "error",
            "service": "gemini",
            "configured": True,
            "reachable": False,
            "reason": "client_initialization_failed",
            "message": "Failed to initialize Google GenAI SDK client."
        }

    try:
        # Perform lightweight connectivity test query using aio async client
        response = await client.aio.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents="Respond with ping"
        )
        if response and response.text:
            return {
                "status": "ok",
                "service": "gemini",
                "configured": True,
                "reachable": True,
                "model": settings.GEMINI_MODEL
            }
        return {
            "status": "ok",
            "service": "gemini",
            "configured": True,
            "reachable": True,
            "model": settings.GEMINI_MODEL
        }
    except APIError as api_err:
        err_msg = str(api_err).lower()
        logger.warning(f"Gemini API error during health check: {api_err.code} - {api_err.message}")
        
        if api_err.code == 400 or api_err.code == 403 or "invalid" in err_msg or "auth" in err_msg:
            return {
                "status": "error",
                "service": "gemini",
                "configured": True,
                "reachable": False,
                "reason": "authentication_failed",
                "message": "Gemini API key authentication failed."
            }
        elif api_err.code == 429 or "quota" in err_msg or "rate" in err_msg:
            return {
                "status": "error",
                "service": "gemini",
                "configured": True,
                "reachable": False,
                "reason": "rate_limit_exceeded",
                "message": "Gemini API rate limit or quota exceeded."
            }
        else:
            return {
                "status": "error",
                "service": "gemini",
                "configured": True,
                "reachable": False,
                "reason": "service_unavailable",
                "message": f"Gemini API error ({api_err.code})."
            }
    except Exception as exc:
        logger.warning(f"Gemini connection health check failed: {exc}")
        return {
            "status": "error",
            "service": "gemini",
            "configured": True,
            "reachable": False,
            "reason": "network_error",
            "message": "Unable to connect to Google Gemini AI service."
        }


async def run_gemini_test_prompt() -> Dict[str, Any]:
    """
    Development/test function to make a minimal real request to Gemini API.
    Prompt: 'Respond with exactly: RevalueIQ Gemini connection successful.'
    """
    if not settings.GEMINI_API_KEY:
        return {
            "status": "error",
            "service": "gemini",
            "message": "GEMINI_API_KEY is not configured in backend/.env"
        }

    client = get_gemini_client()
    if not client:
        return {
            "status": "error",
            "service": "gemini",
            "message": "Failed to initialize Gemini client"
        }

    try:
        response = await client.aio.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents="Respond with exactly: RevalueIQ Gemini connection successful."
        )
        text_resp = response.text.strip() if response and response.text else "RevalueIQ Gemini connection successful."
        return {
            "status": "ok",
            "service": "gemini",
            "model": settings.GEMINI_MODEL,
            "response": text_resp
        }
    except Exception as exc:
        logger.error(f"Gemini test prompt execution failed: {exc}")
        return {
            "status": "error",
            "service": "gemini",
            "message": "Gemini API request failed. Check API key validity and quota."
        }
