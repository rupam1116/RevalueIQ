import pytest
from httpx import AsyncClient
from app.services.settings_service import get_default_settings_doc, format_settings_response
from app.services.account_service import _sanitize_doc
from bson import ObjectId
from datetime import datetime, timezone


def test_default_settings_currency_is_inr():
    """Verify that RevalueIQ application currency defaults strictly to INR (₹)."""
    user_id = ObjectId()
    doc = get_default_settings_doc(user_id)
    assert doc["preferences"]["currency"] == "INR (₹)"
    
    # Verify format_settings_response preserves/enforces INR
    res = format_settings_response(str(user_id), doc)
    assert res.preferences.currency == "INR (₹)"


def test_sanitize_doc_removes_secrets_and_converts_objectid():
    """Verify export data sanitizer strips secrets, passwords, and sensitive keys."""
    obj_id = ObjectId()
    raw = {
        "_id": obj_id,
        "full_name": "Test User",
        "password": "supersecretpassword",
        "hashed_password": "hash",
        "secret": "backend_secret",
        "api_key": "gemini_key",
        "nested": {
            "token": "bearer_token",
            "val": 42
        }
    }
    sanitized = _sanitize_doc(raw)
    assert "_id" in sanitized
    assert isinstance(sanitized["_id"], str)
    assert "password" not in sanitized
    assert "hashed_password" not in sanitized
    assert "secret" not in sanitized
    assert "api_key" not in sanitized
    assert "token" not in sanitized["nested"]
    assert sanitized["nested"]["val"] == 42


def test_timezone_validation():
    """Verify IANA timezone validation accepts valid timezones and rejects invalid ones."""
    from zoneinfo import ZoneInfo
    
    valid_tz = "Asia/Kolkata"
    z = ZoneInfo(valid_tz)
    assert z.key == "Asia/Kolkata"
    
    with pytest.raises(Exception):
        ZoneInfo("NonExistent/ArbitraryTimezone")


@pytest.mark.asyncio
async def test_settings_requires_authentication(async_client: AsyncClient):
    """Verify GET /api/v1/settings returns 401 Unauthorized for unauthenticated requests."""
    res = await async_client.get("/api/v1/settings")
    assert res.status_code == 401


@pytest.mark.asyncio
async def test_patch_settings_requires_authentication(async_client: AsyncClient):
    """Verify PATCH /api/v1/settings returns 401 Unauthorized for unauthenticated requests."""
    res = await async_client.patch("/api/v1/settings", json={"preferences": {"theme": "Light"}})
    assert res.status_code == 401


@pytest.mark.asyncio
async def test_account_export_requires_authentication(async_client: AsyncClient):
    """Verify GET /api/v1/account/export returns 401 Unauthorized for unauthenticated requests."""
    res = await async_client.get("/api/v1/account/export")
    assert res.status_code == 401


@pytest.mark.asyncio
async def test_account_delete_requires_authentication(async_client: AsyncClient):
    """Verify POST /api/v1/account/delete returns 401 Unauthorized for unauthenticated requests."""
    res = await async_client.post("/api/v1/account/delete")
    assert res.status_code == 401


@pytest.mark.asyncio
async def test_support_ticket_requires_authentication(async_client: AsyncClient):
    """Verify POST /api/v1/support/ticket returns 401 Unauthorized for unauthenticated requests."""
    res = await async_client.post(
        "/api/v1/support/ticket",
        json={"type": "bug", "subject": "Test Bug", "details": "This is a detailed bug report description."}
    )
    assert res.status_code == 401
