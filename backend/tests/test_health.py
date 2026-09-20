import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_health_check(async_client: AsyncClient):
    """Test /api/v1/health returns 200 with ok status and service name."""
    response = await async_client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "service" in data
    assert data["service"] == "RevalueIQ API"


@pytest.mark.asyncio
async def test_root_endpoint(async_client: AsyncClient):
    """Test root / returns 200 with service information and online status."""
    response = await async_client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "service" in data
    assert "health_url" in data


@pytest.mark.asyncio
async def test_root_health_check(async_client: AsyncClient):
    """Test root /health returns 200 for Render health probe."""
    response = await async_client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "service" in data


@pytest.mark.asyncio
async def test_database_health_check(async_client: AsyncClient):
    """Test /api/v1/health/db responds with valid status structure (200 or 503)."""
    response = await async_client.get("/api/v1/health/db")
    assert response.status_code in (200, 503)
    data = response.json()
    assert "status" in data
    assert "database" in data
    if response.status_code == 200:
        assert data["status"] == "ok"
        assert data["database"] == "connected"
    else:
        assert data["status"] == "error"
        assert data["database"] == "disconnected"


@pytest.mark.asyncio
async def test_firebase_health_check(async_client: AsyncClient):
    """Test /api/v1/health/firebase responds with valid Firebase Admin status."""
    response = await async_client.get("/api/v1/health/firebase")
    assert response.status_code in (200, 503)
    data = response.json()
    assert "status" in data
    assert "firebase" in data


@pytest.mark.asyncio
async def test_gemini_health_check(async_client: AsyncClient):
    """Test /api/v1/health/gemini responds with valid Gemini status."""
    response = await async_client.get("/api/v1/health/gemini")
    assert response.status_code in (200, 401, 429, 503)
    data = response.json()
    assert "status" in data
    assert "service" in data


@pytest.mark.asyncio
async def test_full_services_health_check(async_client: AsyncClient):
    """Test /api/v1/health/services returns aggregated system status."""
    response = await async_client.get("/api/v1/health/services")
    assert response.status_code in (200, 503)
    data = response.json()
    assert "status" in data
    assert "api" in data
    assert "mongodb" in data
    assert "firebase" in data
    assert "gemini" in data


@pytest.mark.asyncio
async def test_404_error_handling(async_client: AsyncClient):
    """Test 404 error response structure without stack traces."""
    response = await async_client.get("/api/v1/non-existent-endpoint")
    assert response.status_code == 404
    data = response.json()
    assert data["error"] is True
    assert data["status_code"] == 404
    assert "message" in data
    assert "path" in data


@pytest.mark.asyncio
async def test_cors_headers(async_client: AsyncClient):
    """Test CORS preflight response for configured origin."""
    response = await async_client.options(
        "/api/v1/health",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "GET",
        }
    )
    assert response.status_code in (200, 204)
    assert response.headers.get("access-control-allow-origin") == "http://localhost:3000"
