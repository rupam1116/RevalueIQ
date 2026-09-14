import asyncio
import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from fastapi import HTTPException
from google.genai.errors import APIError

from app.schemas.gemini import GeminiAnalysisResult
from app.services.gemini_service import analyze_device_image, _prepare_image_part


@pytest.mark.asyncio
async def test_gemini_service_missing_api_key():
    """3. Missing GEMINI_API_KEY raises HTTP 500."""
    with patch("app.services.gemini_service.settings.GEMINI_API_KEY", ""):
        with pytest.raises(HTTPException) as exc_info:
            await analyze_device_image("valid_image_reference.jpg")
        assert exc_info.value.status_code == 500
        assert "Gemini AI service is not configured" in exc_info.value.detail


@pytest.mark.asyncio
async def test_gemini_service_missing_image():
    """4. Missing image raises HTTP 400."""
    with patch("app.services.gemini_service.settings.GEMINI_API_KEY", "mock_key"):
        with patch("app.services.gemini_service.get_gemini_client", return_value=MagicMock()):
            with pytest.raises(HTTPException) as exc_info:
                await analyze_device_image("")
            assert exc_info.value.status_code == 400
            assert "missing or empty" in exc_info.value.detail


@pytest.mark.asyncio
async def test_gemini_service_invalid_image():
    """5. Invalid image input raises HTTP 400."""
    with patch("app.services.gemini_service.settings.GEMINI_API_KEY", "mock_key"):
        with patch("app.services.gemini_service.get_gemini_client", return_value=MagicMock()):
            with patch("app.services.gemini_service._prepare_image_part", side_effect=ValueError("Corrupt image data")):
                with pytest.raises(HTTPException) as exc_info:
                    await analyze_device_image("corrupt_data")
                assert exc_info.value.status_code == 400
                assert "Invalid image format" in exc_info.value.detail


@pytest.mark.asyncio
async def test_gemini_service_success():
    """1, 2. Successful Gemini structured image analysis parsing."""
    mock_result = GeminiAnalysisResult(
        device_name="Apple iPhone 13 Pro",
        category="Smartphone",
        brand="Apple",
        model="iPhone 13 Pro",
        visible_condition="Cracked Screen",
        damage_detected=True,
        damage_description="Visible diagonal crack across upper display glass",
        repair_recommendation="Front Glass / OLED Screen Replacement",
        estimated_repair_cost=150.0,
        estimated_resale_value=450.0,
        confidence=0.92,
        reasoning="Phone shows clear glass fracture but body and camera module are intact."
    )

    mock_response = MagicMock()
    mock_response.text = mock_result.model_dump_json()
    mock_response.parsed = mock_result

    mock_client = MagicMock()
    mock_client.aio.models.generate_content = AsyncMock(return_value=mock_response)

    with patch("app.services.gemini_service.settings.GEMINI_API_KEY", "mock_key"):
        with patch("app.services.gemini_service.get_gemini_client", return_value=mock_client):
            result = await analyze_device_image("uploads/iphone13.jpg")
            assert isinstance(result, GeminiAnalysisResult)
            assert result.device_name == "Apple iPhone 13 Pro"
            assert result.brand == "Apple"
            assert result.damage_detected is True
            assert result.estimated_repair_cost == 150.0
            assert result.estimated_resale_value == 450.0
            assert result.confidence == 0.92


@pytest.mark.asyncio
async def test_gemini_service_api_error():
    """6. Gemini API generic failure raises HTTP 502."""
    mock_api_err = APIError(501, {"error": {"code": 501, "message": "Internal AI engine error"}})
    mock_client = MagicMock()
    mock_client.aio.models.generate_content = AsyncMock(side_effect=mock_api_err)

    with patch("app.services.gemini_service.settings.GEMINI_API_KEY", "mock_key"):
        with patch("app.services.gemini_service.get_gemini_client", return_value=mock_client):
            with pytest.raises(HTTPException) as exc_info:
                await analyze_device_image("test.jpg")
            assert exc_info.value.status_code == 502
            assert "Gemini AI service returned an error" in exc_info.value.detail


@pytest.mark.asyncio
async def test_gemini_service_timeout():
    """7. Gemini API timeout raises HTTP 504."""
    mock_client = MagicMock()
    mock_client.aio.models.generate_content = AsyncMock(side_effect=asyncio.TimeoutError())

    with patch("app.services.gemini_service.settings.GEMINI_API_KEY", "mock_key"):
        with patch("app.services.gemini_service.get_gemini_client", return_value=mock_client):
            with pytest.raises(HTTPException) as exc_info:
                await analyze_device_image("test.jpg", timeout_seconds=0.01)
            assert exc_info.value.status_code == 504
            assert "request timed out" in exc_info.value.detail


@pytest.mark.asyncio
async def test_gemini_service_rate_limit():
    """8. Gemini rate-limit / quota error raises HTTP 429."""
    mock_rate_err = APIError(429, {"error": {"code": 429, "message": "Resource has been exhausted (e.g. check quota)"}})
    mock_client = MagicMock()
    mock_client.aio.models.generate_content = AsyncMock(side_effect=mock_rate_err)

    with patch("app.services.gemini_service.settings.GEMINI_API_KEY", "mock_key"):
        with patch("app.services.gemini_service.get_gemini_client", return_value=mock_client):
            with pytest.raises(HTTPException) as exc_info:
                await analyze_device_image("test.jpg")
            assert exc_info.value.status_code == 429
            assert "usage limit" in exc_info.value.detail


@pytest.mark.asyncio
async def test_gemini_service_malformed_response():
    """9. Gemini malformed response raises HTTP 502."""
    mock_response = MagicMock()
    mock_response.text = "This is plain invalid text, not JSON {"
    mock_response.parsed = None

    mock_client = MagicMock()
    mock_client.aio.models.generate_content = AsyncMock(return_value=mock_response)

    with patch("app.services.gemini_service.settings.GEMINI_API_KEY", "mock_key"):
        with patch("app.services.gemini_service.get_gemini_client", return_value=mock_client):
            with pytest.raises(HTTPException) as exc_info:
                await analyze_device_image("test.jpg")
            assert exc_info.value.status_code == 502
            assert "malformed response" in exc_info.value.detail


def test_prepare_image_part_unsupported_mime():
    """10. Unsupported image MIME format raises ValueError."""
    with pytest.raises(ValueError) as exc_info:
        _prepare_image_part("data:text/html;base64,PCFET0NUWVBFIGh0bWw+")
    assert "Unsupported image MIME format" in str(exc_info.value)


def test_prepare_image_part_valid_fallback():
    """11. Demo/placeholder image reference returns valid Part."""
    part = _prepare_image_part("phase3-test-image")
    assert part is not None
    assert part.inline_data.mime_type == "image/jpeg"
    assert len(part.inline_data.data) > 10


def test_prepare_image_part_valid_jpeg_data_uri():
    """12. Real JPEG Data URI is parsed cleanly."""
    sample_b64 = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA="
    part = _prepare_image_part(sample_b64)
    assert part is not None
    assert part.inline_data.mime_type == "image/jpeg"
    assert len(part.inline_data.data) > 10


def test_prepare_image_part_valid_png_data_uri():
    """13. Real PNG Data URI is parsed cleanly."""
    sample_png = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
    part = _prepare_image_part(sample_png)
    assert part is not None
    assert part.inline_data.mime_type == "image/png"
    assert len(part.inline_data.data) > 10


@pytest.mark.asyncio
async def test_gemini_service_generic_electronics_laptop():
    """14. Generic laptop device detection via Gemini."""
    mock_result = GeminiAnalysisResult(
        device_name="Dell XPS 15",
        category="Laptop",
        brand="Dell",
        model="XPS 15",
        visible_condition="Minor Scratches",
        damage_detected=True,
        damage_description="Small scratch near bottom-right corner",
        repair_recommendation="No Repair Needed",
        estimated_repair_cost=0.0,
        estimated_resale_value=750.0,
        confidence=0.91,
        reasoning="Dell XPS 15 laptop identified with minor cosmetic scratch."
    )

    mock_response = MagicMock()
    mock_response.text = mock_result.model_dump_json()
    mock_response.parsed = mock_result

    mock_client = MagicMock()
    mock_client.aio.models.generate_content = AsyncMock(return_value=mock_response)

    with patch("app.services.gemini_service.settings.GEMINI_API_KEY", "mock_key"):
        with patch("app.services.gemini_service.get_gemini_client", return_value=mock_client):
            result = await analyze_device_image("uploads/dell_xps.jpg")
            assert isinstance(result, GeminiAnalysisResult)
            assert result.category == "Laptop"
            assert result.brand == "Dell"
            assert result.model == "XPS 15"
            assert result.damage_detected is True


@pytest.mark.asyncio
async def test_gemini_service_generic_electronics_audio():
    """15. Generic audio/headphones device detection via Gemini."""
    mock_result = GeminiAnalysisResult(
        device_name="Sony WH-1000XM5",
        category="Audio",
        brand="Sony",
        model="WH-1000XM5",
        visible_condition="Mint",
        damage_detected=False,
        damage_description="None detected from image",
        repair_recommendation="No Repair Needed",
        estimated_repair_cost=0.0,
        estimated_resale_value=220.0,
        confidence=0.95,
        reasoning="Sony wireless ANC headphones in pristine visual state."
    )

    mock_response = MagicMock()
    mock_response.text = mock_result.model_dump_json()
    mock_response.parsed = mock_result

    mock_client = MagicMock()
    mock_client.aio.models.generate_content = AsyncMock(return_value=mock_response)

    with patch("app.services.gemini_service.settings.GEMINI_API_KEY", "mock_key"):
        with patch("app.services.gemini_service.get_gemini_client", return_value=mock_client):
            result = await analyze_device_image("uploads/sony_headphones.jpg")
            assert isinstance(result, GeminiAnalysisResult)
            assert result.category == "Audio"
            assert result.brand == "Sony"
            assert result.damage_detected is False



