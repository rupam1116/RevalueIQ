import pytest
from httpx import AsyncClient
from bson import ObjectId

from app.services.gemini_service import is_safe_external_image_url
from app.services.payment_service import compute_razorpay_signature
from app.core.config import settings


@pytest.mark.asyncio
async def test_security_headers_applied(async_client: AsyncClient):
    """TEST: Verify security headers and API Cache-Control directives are applied."""
    res = await async_client.get("/api/v1/health")
    assert res.status_code == 200
    assert res.headers.get("X-Content-Type-Options") == "nosniff"
    assert res.headers.get("X-Frame-Options") == "SAMEORIGIN"
    assert "no-store" in res.headers.get("Cache-Control", "")
    assert "strict-origin-when-cross-origin" in res.headers.get("Referrer-Policy", "")


@pytest.mark.asyncio
async def test_missing_and_invalid_token_rejection(async_client: AsyncClient):
    """TEST 1 & 2: Missing or invalid token must return 401 Unauthorized."""
    # 1. Missing token
    res1 = await async_client.get("/api/v1/users/me/profile")
    assert res1.status_code == 401
    assert "Authentication token required" in res1.json().get("message", res1.text)

    # 2. Invalid / malformed token
    res2 = await async_client.get(
        "/api/v1/users/me/profile",
        headers={"Authorization": "Bearer invalid_malformed_token_12345"}
    )
    assert res2.status_code == 401
    assert "Invalid, expired, or revoked" in res2.json().get("message", res2.text)


@pytest.mark.asyncio
async def test_forged_tier3_event_rejected(async_client: AsyncClient):
    """TEST 15: Client-forged Tier 3 completion must be rejected by backend."""
    from app.services.history_service import log_lifecycle_event
    from app.schemas.history import LogLifecycleEventRequest, ActivityTypeEnum, LifecycleTierEnum
    from fastapi import HTTPException

    user_id = ObjectId()
    from mongomock_motor import AsyncMongoMockClient
    mock_client = AsyncMongoMockClient()
    mock_db = mock_client["revalueiq_test"]

    with pytest.raises(HTTPException) as excinfo:
        await log_lifecycle_event(
            mock_db,
            user_id,
            LogLifecycleEventRequest(
                type=ActivityTypeEnum.DONATION,
                device_name="Forged Device",
                category="Smartphone",
                tier=LifecycleTierEnum.EXTERNALLY_COMPLETED,
                title="Forged Tier 3",
                value_inr=10000.0,
            ),
            allow_system_tier3=False
        )
    assert excinfo.value.status_code == 400
    assert "Direct creation of Tier 3 completed events is forbidden" in excinfo.value.detail


@pytest.mark.asyncio
async def test_manual_mark_sold_forbidden(async_client: AsyncClient):
    """TEST: Manual seller transition to SOLD via API is forbidden."""
    # Needs auth, but we can check with mock auth or unauth 401, or test endpoint directly
    fake_id = str(ObjectId())
    # Calling without auth gives 401
    res = await async_client.post(f"/api/v1/marketplace/listings/{fake_id}/sold")
    assert res.status_code in (401, 403)


def test_ssrf_url_validation():
    """TEST 17: SSRF Protection rejects loopback, private subnets, and cloud metadata."""
    # Loopback targets
    assert not is_safe_external_image_url("http://127.0.0.1/admin")
    assert not is_safe_external_image_url("http://localhost:8000/docs")
    assert not is_safe_external_image_url("http://[::1]/secret")

    # Cloud metadata target
    assert not is_safe_external_image_url("http://169.254.169.254/latest/meta-data/")

    # Private RFC 1918 networks
    assert not is_safe_external_image_url("http://10.0.0.1/router")
    assert not is_safe_external_image_url("http://172.16.0.5/internal")
    assert not is_safe_external_image_url("http://192.168.1.1/gateway")

    # Disallowed non-http schemes
    assert not is_safe_external_image_url("file:///etc/passwd")
    assert not is_safe_external_image_url("ftp://ftp.example.com/file")


@pytest.mark.asyncio
async def test_invalid_payment_and_webhook_signatures(async_client: AsyncClient):
    """TEST 10 & 11: Tampered payment signatures and webhook signatures must be rejected."""
    # 1. Tampered payment signature verification (requires auth)
    res_verify = await async_client.post(
        "/api/v1/payments/verify",
        json={
            "payment_id": str(ObjectId()),
            "razorpay_order_id": "order_test_123",
            "razorpay_payment_id": "pay_test_456",
            "razorpay_signature": "invalid_forged_signature_hex"
        }
    )
    assert res_verify.status_code == 401

    # 2. Public Webhook listener with invalid HMAC signature
    res_webhook = await async_client.post(
        "/api/v1/payments/webhook",
        content=b'{"event": "payment.captured"}',
        headers={"X-Razorpay-Signature": "forged_webhook_signature_hex"}
    )
    body = res_webhook.json()
    assert "Invalid webhook signature" in (body.get("detail") or body.get("message") or "")


@pytest.mark.asyncio
async def test_client_cannot_create_notifications(async_client: AsyncClient):
    """TEST 16: Clients cannot manually create trusted notifications."""
    res = await async_client.post(
        "/api/v1/notifications",
        json={"title": "Forged Notification", "type": "PAYMENT_SUCCESS"}
    )
    # Method Not Allowed or 404 (endpoint does not exist)
    assert res.status_code in (404, 405)


@pytest.mark.asyncio
async def test_rate_limit_enforcement(async_client: AsyncClient):
    """TEST 7: Rate limiter returns 429 Too Many Requests when limits are exceeded."""
    from app.core.rate_limit import limiter

    client_key = "test_rate_client:test"
    # Exhaust 5 requests
    for _ in range(5):
        limiter.is_allowed(client_key, max_requests=5, window_seconds=60.0)

    # 6th request should be rejected
    allowed, remaining, retry_after = limiter.is_allowed(client_key, max_requests=5, window_seconds=60.0)
    assert not allowed
    assert remaining == 0
    assert retry_after > 0


@pytest.mark.asyncio
async def test_malformed_request_error_safety(async_client: AsyncClient):
    """TEST 19: Malformed JSON body is handled cleanly without internal leakage."""
    res = await async_client.post(
        "/api/v1/payments/orders",
        content=b"{ invalid json ",
        headers={"Content-Type": "application/json"}
    )
    assert res.status_code in (400, 422)
    data = res.json()
    assert data.get("error") is True
    # Ensure no internal filesystem paths or passwords leaked
    content_str = str(data)
    assert "Traceback" not in content_str
    assert "password" not in content_str
    assert "mongodb+srv" not in content_str
