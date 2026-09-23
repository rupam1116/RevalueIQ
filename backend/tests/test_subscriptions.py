import pytest
from httpx import AsyncClient
from app.services.subscription_service import get_available_plans
from app.schemas.subscriptions import EcoPlanTier, BillingCycle


@pytest.mark.asyncio
async def test_get_available_plans(async_client: AsyncClient):
    """Test public listing of eco plans."""
    response = await async_client.get("/api/v1/subscriptions/plans")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3
    tiers = [p["id"] for p in data]
    assert "free" in tiers
    assert "pro" in tiers
    assert "enterprise" in tiers

    # Check pro tier features
    pro = next(p for p in data if p["id"] == "pro")
    assert pro["popular"] is True
    assert pro["price_monthly_inr"] == 499.0


@pytest.mark.asyncio
async def test_subscription_current_requires_auth(async_client: AsyncClient):
    """Test that current subscription requires authentication."""
    response = await async_client.get("/api/v1/subscriptions/current")
    assert response.status_code in (401, 403)


@pytest.mark.asyncio
async def test_subscription_activate_requires_auth(async_client: AsyncClient):
    """Test that plan activation requires authentication."""
    response = await async_client.post(
        "/api/v1/subscriptions/activate",
        json={"tier": "pro", "billing_cycle": "monthly"}
    )
    assert response.status_code in (401, 403)
