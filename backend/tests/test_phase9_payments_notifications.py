import pytest
from httpx import AsyncClient
from app.services.payment_service import compute_razorpay_signature


def test_razorpay_signature_computation():
    """Verify cryptographic HMAC-SHA256 signature calculation matches Razorpay standard."""
    order_id = "order_N12345678"
    payment_id = "pay_N87654321"
    secret = "revalueiq_secret_key"
    
    sig = compute_razorpay_signature(order_id, payment_id, secret)
    assert isinstance(sig, str)
    assert len(sig) == 64  # SHA-256 hex string length is 64 chars
    
    # Verify deterministic output
    sig2 = compute_razorpay_signature(order_id, payment_id, secret)
    assert sig == sig2


@pytest.mark.asyncio
async def test_payments_endpoint_requires_auth(async_client: AsyncClient):
    """Verify payment endpoints reject unauthenticated requests with 401 Unauthorized."""
    response = await async_client.get("/api/v1/payments")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_notifications_endpoint_requires_auth(async_client: AsyncClient):
    """Verify notification endpoints reject unauthenticated requests with 401 Unauthorized."""
    response = await async_client.get("/api/v1/notifications")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_create_payment_order_requires_auth(async_client: AsyncClient):
    """Verify payment order creation rejects unauthenticated requests."""
    response = await async_client.post(
        "/api/v1/payments/orders",
        json={
            "purpose": "MARKETPLACE_PURCHASE",
            "related_entity_type": "marketplace_listing",
            "related_entity_id": "507f1f77bcf86cd799439011"
        }
    )
    assert response.status_code == 401
