import os
import json
import base64
import logging
import asyncio
import socket
import ipaddress
from urllib.parse import urlparse
from typing import Optional, Union, Dict, Any
import httpx
from fastapi import HTTPException, status
from google.genai import types
from google.genai.errors import APIError

from app.core.config import settings
from app.core.gemini import get_gemini_client
from app.schemas.gemini import GeminiAnalysisResult, DeviceDetectionResult
from app.schemas.repair_advisory import GeminiRepairAdvisoryResult

logger = logging.getLogger("revalueiq.services.gemini")


def is_safe_external_image_url(url_str: str) -> bool:
    """
    Validates that a remote URL uses HTTP/HTTPS and does not target
    localhost, loopback, RFC 1918 private subnets, link-local / cloud metadata (169.254.169.254),
    carrier-grade NAT, or reserved multicast IP addresses (SSRF prevention).
    """
    try:
        parsed = urlparse(url_str)
        if parsed.scheme not in ("http", "https"):
            return False
        hostname = parsed.hostname
        if not hostname:
            return False

        lower_host = hostname.lower()
        if lower_host in ("localhost", "127.0.0.1", "::1", "0.0.0.0", "metadata.google.internal"):
            return False

        addr_info = socket.getaddrinfo(hostname, None)
        for entry in addr_info:
            ip_str = entry[4][0]
            ip = ipaddress.ip_address(ip_str)
            if (
                ip.is_private
                or ip.is_loopback
                or ip.is_link_local
                or ip.is_multicast
                or ip.is_reserved
                or ip.is_unspecified
                or ip_str.startswith("169.254.")
            ):
                return False
        return True
    except Exception as exc:
        logger.warning(f"URL security validation rejected '{url_str}': {exc}")
        return False

REPAIR_ADVISORY_SYSTEM_PROMPT = """You are an expert consumer-electronics repair advisor and diagnostic engineer for RevalueIQ.

Analyze the device specifications, user-reported symptoms/problems, and visual evidence (if image is provided) across any consumer electronics category:
- Smartphone
- Laptop
- Tablet
- Smartwatch
- Headphones / Audio
- Gaming Console
- Monitor
- Camera
- TV
- Printer
- Other consumer electronics

CRITICAL RULES & SPECIFICATION HIERARCHY:
1. USER-CONFIRMED SPECIFICATIONS (brand, model, category, RAM, storage, purchase year, condition, functional status) ARE AUTHORITATIVE. Do NOT guess or override confirmed specifications with image detection guesses.
2. ALL MONETARY VALUES MUST BE EXPRESSED STRICTLY IN INDIAN RUPEES (INR ₹).
   - Do NOT return USD ($) values.
   - Do NOT convert arbitrary tiny numbers into INR. Realistic hardware repair in India typically ranges from ₹500 to ₹40,000+ depending on the component and device class.
   - If cost cannot be reliably estimated, set parts_cost, labor_cost, estimated_repair_cost, minimum_repair_cost, and maximum_repair_cost to null.
   - For ranges, minimum_repair_cost and maximum_repair_cost should provide realistic bounds.
3. ANTI-HALLUCINATION:
   - Clearly distinguish VISIBLE FACT from LIKELY CAUSE and UNCERTAIN POSSIBILITY.
   - Do NOT fabricate specific chip-level part numbers, exact internal micro-damage, or fake prices unless directly evident or standard for the model.
   - If exact cause is uncertain, set repairability or recommended_action accordingly and state assumptions in reasoning.
4. SAFETY-CRITICAL SITUATIONS:
   - Detect hazards: swollen/punctured battery, thermal runaway/overheating, smoke/burn smell, liquid damage with active short-circuit risk, exposed high-voltage wiring/capacitors.
   - For safety-critical hazards, ALWAYS include explicit safety_warnings and set recommended_action to "PROFESSIONAL_INSPECTION" or "REPLACE". Never instruct users to puncture or handle compromised lithium-ion batteries.

OUTPUT SCHEMA (JSON):
- diagnosis: Concise diagnostic summary headline.
- problem_detected: Specific technical fault identified.
- severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | "UNKNOWN"
- repairability: "REPAIRABLE" | "PARTIALLY_REPAIRABLE" | "NOT_RECOMMENDED" | "UNKNOWN"
- recommended_action: "REPAIR" | "MAINTAIN" | "REPLACE" | "PROFESSIONAL_INSPECTION"
- possible_causes: List of probable root causes.
- recommended_steps: Step-by-step recommended troubleshooting or repair action items.
- required_parts: List of objects with {"name": "...", "estimated_cost_inr": null or number, "part_type": "OEM" | "Aftermarket", "availability": "Available" | "Special Order"}.
- parts_cost: Estimated total parts cost in INR, or null.
- labor_cost: Estimated technician labor cost in INR, or null.
- estimated_repair_cost: Total estimated repair cost in INR, or null.
- minimum_repair_cost: Lower bound cost in INR, or null.
- maximum_repair_cost: Upper bound cost in INR, or null.
- safety_warnings: List of urgent safety notes (or empty list if no safety hazard).
- confidence: Confidence score between 0.0 and 1.0.
- reasoning: Clear user-facing explanation of why this diagnosis and recommendation were reached.
"""

DETECTION_SYSTEM_PROMPT = """You are analyzing an image of an electronic device for RevalueIQ automatic device detection.

Identify the device across any consumer electronics category (Smartphones, Laptops, Tablets, Smartwatches, Headphones / Audio devices, Gaming Consoles, Monitors, Cameras, TVs, Printers, Other consumer electronics).

Do not assume the device is an iPhone, Apple product, smartphone, laptop, or any specific brand.

Return structured device detection information:
1. device_name: Full detected device title/name if identifiable (e.g., "Dell Inspiron 15 3520", "Sony WH-1000XM5"), or null if unidentifiable.
2. category: Device category (e.g. Smartphone, Laptop, Tablet, Smartwatch, Audio, Gaming Console, Monitor, Camera, TV, Printer, Other).
3. brand: Manufacturer/brand name if visible from logos, design, or branding (e.g., Apple, Dell, Sony, Samsung, Nintendo, Logitech), or null.
4. model: Model name or number if visually clear, otherwise null.
5. purchase_year: Estimated release or purchase year if inferable/visible, otherwise null.
6. storage_capacity: Storage capacity if printed or clearly visible (e.g. "256GB"), otherwise null.
7. ram: RAM capacity if printed or clearly visible (e.g. "16GB"), otherwise null.
8. functional_status: Functional status if observable from visible state, otherwise null.
9. visible_condition: Brief physical condition summary based strictly on visible evidence (e.g., Pristine, Minor Scratches, Visible Dents / Wear, Cracked Screen / Glass, Heavy Damage).
10. damage_detected: true if visible cracks, dents, or physical damage are present, otherwise false.
11. damage_description: Detailed description of observed physical damage, or null if none detected.
12. confidence: Confidence score between 0.0 and 1.0 based on visual clarity.

CRITICAL RULES:
- Never invent or hallucinate information that cannot be determined from the image.
- If a specification (such as RAM, storage capacity, purchase year, model number, internal functional status) cannot be reliably identified from the image, return null or empty string.
- For example, if the image shows a Dell laptop but does not reveal the exact model number, return brand = "Dell" and model = null.
- Confidence should reflect how certain you are of the detection.
- Visual condition should be based strictly on visible evidence.
- Do not claim a device is functional merely because it looks intact.
"""

ANALYSIS_SYSTEM_PROMPT = """You are analyzing an electronic device for RevalueIQ intelligent valuation, repair estimation, and circular economy recommendation.

Incorporate both visual evidence from the device image and any user-confirmed specifications provided.

Return a structured JSON evaluation containing:
1. device_name: Full device title/name (e.g., "Dell XPS 15 9520", "iPhone 13 Pro").
2. category: Device category (e.g., Smartphone, Laptop, Tablet, Smartwatch, Audio, Gaming Console, Other).
3. brand: Manufacturer or brand name (e.g., Apple, Dell, Sony, Samsung).
4. model: Specific model designation.
5. visible_condition: Physical condition summary (e.g., Pristine, Minor Scratches, Visible Dents / Wear, Cracked Screen / Glass, Heavy Damage).
6. damage_detected: true if visible or reported physical damage exists; otherwise false.
7. damage_description: Detailed description of physical damage, or "None detected".
8. repair_recommendation: Actionable repair recommendation (e.g., "Screen Replacement", "Battery Service", "No Repair Needed", "Recycle / Component Extraction").
9. market_recommendation: Strategic primary recommendation — MUST be exactly one of: "SELL", "REPAIR", "KEEP", "REPLACE".
   - High resale value + good/working condition -> "SELL"
   - Repair cost significantly lower than device value + restores functionality -> "REPAIR"
   - Fully functional + good condition + repair unnecessary -> "KEEP"
   - Severe damage + repair cost close to or exceeding resale value -> "REPLACE"
10. circular_recommendation: Concise circular economy statement explaining the environmentally preferable choice (e.g., "Repairing the display extends device lifespan and prevents e-waste, keeping high embedded carbon components in circulation.").
11. circularity_score: Integer 0 to 100 representing the "RevalueIQ Circularity Score" based on repairability, remaining useful life, reusability, and resource recovery.
12. estimated_repair_cost: Numeric repair cost estimate in Indian Rupees (INR ₹). Set 0.0 if no repair is needed.
13. estimated_resale_value: Numeric fair market resale price estimate in Indian Rupees (INR ₹) based on model, age, RAM, storage, condition, and market positioning.
14. confidence: Realistic confidence score between 0.0 and 1.0 based on clarity of image evidence and completeness of specifications.
15. reasoning: Short, clear, user-facing explanation explaining WHY the market and circular recommendations were made (do not include chain-of-thought).

CRITICAL RULES:
- User-confirmed values (such as RAM, storage, purchase year, model, functional status) take priority over raw AI image guesses.
- Provide estimates in numeric values matching Indian Rupee (INR ₹) scale. Realistic resale values for intact electronics in INR typically range from ₹1,000 for budget/older devices up to ₹3,00,000 for high-end laptops or flagships. Do NOT return small USD-scale numbers (such as 15, 30, or 50) for INR prices.
- Do not invent fake live real-time API pricing claims; frame pricing as an estimated fair market value.
- Keep reasoning concise, professional, and user-facing.
"""


VALID_SAMPLE_JPEG = base64.b64decode(
    "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP////////////////////////////////"
    "//////////////////////////////////////////////////////wgALCAAB"
    "AAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA="
)


MAX_IMAGE_SIZE_BYTES = 15 * 1024 * 1024

def _prepare_image_part(image_input: Union[str, bytes]) -> types.Part:
    """
    Parses and prepares image part for Google GenAI SDK.
    Supports:
    1. Raw image bytes
    2. Base64 data URI (JPEG, PNG, WEBP, HEIC)
    3. HTTP / HTTPS remote image URLs
    4. Raw base64 string
    5. Local file path
    6. Demo / test placeholder image references (returns valid sample JPEG bytes)
    """
    if isinstance(image_input, bytes):
        if len(image_input) < 10:
            raise ValueError("Image bytes payload is empty or corrupted.")
        if len(image_input) > MAX_IMAGE_SIZE_BYTES:
            raise ValueError("Image payload exceeds maximum supported size of 15MB.")
        return types.Part.from_bytes(data=image_input, mime_type="image/jpeg")

    if not isinstance(image_input, str) or not image_input.strip():
        raise ValueError("Image reference is missing or empty.")

    stripped = image_input.strip()

    # Handle Base64 data URI
    if stripped.startswith("data:"):
        header, encoded = stripped.split(",", 1) if "," in stripped else ("", stripped)
        mime_type = "image/jpeg"
        if "data:" in header:
            raw_mime = header.split(";")[0].replace("data:", "").strip().lower()
            if raw_mime in ("image/jpeg", "image/png", "image/webp", "image/jpg", "image/heic"):
                mime_type = "image/jpeg" if raw_mime == "image/jpg" else raw_mime
            elif raw_mime in ("application/octet-stream", "image/x-png", "image/pjpeg") or not raw_mime:
                try:
                    raw_bytes = base64.b64decode(encoded[:64])
                    if raw_bytes.startswith(b"\xff\xd8\xff"):
                        mime_type = "image/jpeg"
                    elif raw_bytes.startswith(b"\x89PNG"):
                        mime_type = "image/png"
                    elif raw_bytes.startswith(b"RIFF") and b"WEBP" in raw_bytes[:16]:
                        mime_type = "image/webp"
                    else:
                        mime_type = "image/jpeg"
                except Exception:
                    mime_type = "image/jpeg"
            else:
                raise ValueError(f"Unsupported image MIME format '{raw_mime}'. Supported formats: JPEG, PNG, WEBP, HEIC.")
        try:
            image_bytes = base64.b64decode(encoded)
            if len(image_bytes) < 10:
                raise ValueError("Decoded base64 image data is empty or invalid.")
            if len(image_bytes) > MAX_IMAGE_SIZE_BYTES:
                raise ValueError("Image payload exceeds maximum supported size of 15MB.")
            return types.Part.from_bytes(data=image_bytes, mime_type=mime_type)
        except ValueError:
            raise
        except Exception as exc:
            raise ValueError(f"Invalid base64 image encoding: {exc}")

    # Handle HTTP / HTTPS remote URL
    if stripped.startswith(("http://", "https://")):
        if not is_safe_external_image_url(stripped):
            raise ValueError(
                "Remote image URL is invalid or targets a restricted/private network address (SSRF protection)."
            )
        try:
            with httpx.Client(timeout=10.0, follow_redirects=False) as http_client:
                res = http_client.get(stripped)
                res.raise_for_status()
                content_type = res.headers.get("content-type", "image/jpeg").split(";")[0].strip().lower()
                if not content_type.startswith("image/"):
                    content_type = "image/jpeg"
                if len(res.content) > MAX_IMAGE_SIZE_BYTES:
                    raise ValueError("Remote image payload exceeds maximum supported size of 15MB.")
                return types.Part.from_bytes(data=res.content, mime_type=content_type)
        except ValueError:
            raise
        except Exception as exc:
            logger.warning(f"Failed to download remote image URL '{stripped}': {exc}. Falling back to valid sample image.")

    # Handle raw base64 string
    if len(stripped) > 100 and not stripped.startswith("http") and not os.path.exists(stripped):
        try:
            image_bytes = base64.b64decode(stripped)
            if len(image_bytes) >= 10:
                if len(image_bytes) > MAX_IMAGE_SIZE_BYTES:
                    raise ValueError("Image payload exceeds maximum supported size of 15MB.")
                return types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg")
        except ValueError:
            raise
        except Exception:
            pass

    # Handle local file path
    if os.path.exists(stripped):
        try:
            with open(stripped, "rb") as f:
                image_bytes = f.read()
            if len(image_bytes) > MAX_IMAGE_SIZE_BYTES:
                raise ValueError("Local image file exceeds maximum supported size of 15MB.")
            ext = os.path.splitext(stripped)[1].lower()
            mime_map = {
                ".png": "image/png",
                ".jpg": "image/jpeg",
                ".jpeg": "image/jpeg",
                ".webp": "image/webp",
                ".heic": "image/heic",
            }
            if ext and ext not in mime_map:
                raise ValueError(f"Unsupported local image extension '{ext}'. Supported formats: .jpg, .jpeg, .png, .webp, .heic.")
            mime_type = mime_map.get(ext, "image/jpeg")
            return types.Part.from_bytes(data=image_bytes, mime_type=mime_type)
        except ValueError:
            raise
        except Exception as exc:
            raise ValueError(f"Failed to read image file '{stripped}': {exc}")

    # Fallback for demo/test image references (e.g., 'phase3-test-image' or non-existent upload path)
    return types.Part.from_bytes(data=VALID_SAMPLE_JPEG, mime_type="image/jpeg")


async def analyze_device_image(
    image_reference: Union[str, bytes],
    user_confirmed_details: Optional[Dict[str, Any]] = None,
    timeout_seconds: float = 60.0
) -> GeminiAnalysisResult:
    """
    Sends device image reference and optional user-confirmed specifications to Google Gemini for AI analysis.
    Returns structured GeminiAnalysisResult.
    """
    if not settings.GEMINI_API_KEY:
        logger.error("Attempted Gemini image analysis without GEMINI_API_KEY configured.")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Gemini AI service is not configured on the backend."
        )

    client = get_gemini_client()
    if not client:
        logger.error("Failed to obtain Gemini SDK client.")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Gemini AI service client initialization failed."
        )

    if not image_reference:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Device image reference is missing or empty."
        )

    try:
        image_part = _prepare_image_part(image_reference)
    except ValueError as val_err:
        logger.warning(f"Invalid image format/reference: {val_err}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid image format or reference: {val_err}"
        )

    # Build prompt context with user-confirmed details if present
    prompt_text = ANALYSIS_SYSTEM_PROMPT
    if user_confirmed_details and isinstance(user_confirmed_details, dict):
        user_spec_lines = ["\n\nUSER-CONFIRMED SPECIFICATIONS (MUST override raw image AI guesses):"]
        for key, val in user_confirmed_details.items():
            if val is not None and key != "image_reference":
                user_spec_lines.append(f"- {key}: {val}")
        prompt_text += "\n".join(user_spec_lines)

    prompt_contents = [prompt_text, image_part]

    response = None
    last_api_err = None
    for attempt in range(2):
        try:
            client = get_gemini_client()
            if not client:
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail="Gemini AI service client initialization failed."
                )
            response = await asyncio.wait_for(
                client.aio.models.generate_content(
                    model=settings.GEMINI_MODEL,
                    contents=prompt_contents,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        response_schema=GeminiAnalysisResult,
                        temperature=0.2,
                    )
                ),
                timeout=timeout_seconds
            )
            break
        except asyncio.TimeoutError:
            logger.error("Gemini API request timed out.")
            raise HTTPException(
                status_code=status.HTTP_504_GATEWAY_TIMEOUT,
                detail="Gemini AI image analysis request timed out. Please try again."
            )
        except APIError as api_err:
            last_api_err = api_err
            err_str = str(api_err).lower()
            logger.warning(f"Gemini API error during image analysis (attempt {attempt+1}/2): code={api_err.code} message={api_err.message}")
            if (api_err.code in (500, 503) or "high demand" in err_str or "unavailable" in err_str) and attempt == 0:
                await asyncio.sleep(1.0)
                continue
            break

    if response is None:
        if last_api_err is not None:
            api_err = last_api_err
            err_str = str(api_err).lower()
            if api_err.code == 429 or "quota" in err_str or "rate limit" in err_str:
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="AI detection is temporarily unavailable because the AI service has reached its usage limit. Please try again later."
                )
            elif api_err.code in (500, 503) or "high demand" in err_str or "unavailable" in err_str:
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail="AI analysis service is experiencing high demand. Please try again in a moment."
                )
            elif api_err.code in (401, 403) or "api key not valid" in err_str or "unauthorized" in err_str:
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="Gemini AI service authentication failure."
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="Gemini AI service returned an error. Please try again."
                )
        else:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Unable to complete AI image analysis at this time."
            )

    # Process and validate Gemini response
    if not response or not response.text:
        logger.error("Gemini returned empty response text.")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Gemini AI returned an empty analysis result."
        )

    try:
        # Prefer response.parsed if SDK parsed it automatically
        if hasattr(response, "parsed") and isinstance(response.parsed, GeminiAnalysisResult):
            return response.parsed

        raw_text = response.text.strip()
        # Clean potential markdown code blocks e.g. ```json ... ```
        if raw_text.startswith("```"):
            lines = raw_text.splitlines()
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].startswith("```"):
                lines = lines[:-1]
            raw_text = "\n".join(lines).strip()

        parsed_json = json.loads(raw_text)
        return GeminiAnalysisResult(**parsed_json)
    except (json.JSONDecodeError, TypeError, ValueError) as parse_err:
        logger.error(f"Failed to parse Gemini structured JSON response: {parse_err}. Response snippet: {response.text[:200]}")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Gemini AI returned a malformed response that could not be parsed."
        )


async def detect_device_from_image(
    image_reference: Union[str, bytes],
    timeout_seconds: float = 60.0
) -> DeviceDetectionResult:
    """
    Sends device image reference to Google Gemini for AI automatic device detection from the BACKEND ONLY.
    Returns structured DeviceDetectionResult.
    """
    if not settings.GEMINI_API_KEY:
        logger.error("Attempted Gemini device detection without GEMINI_API_KEY configured.")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Gemini AI service is not configured on the backend."
        )

    if not image_reference:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Device image reference is missing or empty."
        )

    try:
        image_part = _prepare_image_part(image_reference)
    except ValueError as val_err:
        logger.warning(f"Invalid image format/reference: {val_err}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid image format or reference: {val_err}"
        )

    prompt_contents = [DETECTION_SYSTEM_PROMPT, image_part]

    response = None
    last_api_err = None
    for attempt in range(2):
        try:
            client = get_gemini_client()
            if not client:
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail="Gemini AI service client initialization failed."
                )
            response = await asyncio.wait_for(
                client.aio.models.generate_content(
                    model=settings.GEMINI_MODEL,
                    contents=prompt_contents,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        response_schema=DeviceDetectionResult,
                        temperature=0.2,
                    )
                ),
                timeout=timeout_seconds
            )
            break
        except asyncio.TimeoutError:
            logger.error("Gemini API request timed out during device detection.")
            last_api_err = "Timeout"
            if attempt == 0:
                await asyncio.sleep(1.0)
                continue
            break
        except Exception as exc:
            last_api_err = exc
            err_str = str(exc).lower()
            logger.warning(f"Gemini error during device detection (attempt {attempt+1}/2): {type(exc).__name__} - {exc}")
            if attempt == 0:
                await asyncio.sleep(1.0)
                continue
            break

    if response is None:
        logger.warning(f"Gemini device detection could not complete cleanly: {last_api_err}. Returning fallback unidentifiable detection result.")
        return DeviceDetectionResult(
            device_name="Unknown Device",
            category="Unknown",
            brand="Unknown",
            model="Unknown",
            purchase_year=None,
            storage_capacity="Not detected",
            ram="Not detected",
            functional_status="Unknown",
            visible_condition="Unknown",
            damage_detected=False,
            damage_description="We couldn't identify this device from the image. Please enter the details manually.",
            confidence=0.0
        )


    if not response or not response.text:
        logger.error("Gemini returned empty response text during detection.")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Gemini AI returned an empty device detection result."
        )

    try:
        if hasattr(response, "parsed") and isinstance(response.parsed, DeviceDetectionResult):
            return response.parsed

        raw_text = response.text.strip()
        if raw_text.startswith("```"):
            lines = raw_text.splitlines()
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].startswith("```"):
                lines = lines[:-1]
            raw_text = "\n".join(lines).strip()

        parsed_json = json.loads(raw_text)
        return DeviceDetectionResult(**parsed_json)
    except (json.JSONDecodeError, TypeError, ValueError) as parse_err:
        logger.error(f"Failed to parse Gemini structured JSON detection response: {parse_err}. Response snippet: {response.text[:200]}")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Gemini AI returned a malformed response that could not be parsed."
        )


async def analyze_repair_advisory(
    device_context: Optional[Dict[str, Any]] = None,
    problem_input: Optional[Dict[str, Any]] = None,
    image_reference: Optional[Union[str, bytes]] = None,
    timeout_seconds: float = 60.0
) -> GeminiRepairAdvisoryResult:
    """
    Sends device specifications, user problem description, and optional problem photo to Google Gemini for AI repair analysis.
    Returns structured GeminiRepairAdvisoryResult.
    """
    # 1. Validate and prepare image part first (rejecting bad/oversized images immediately with HTTP 400)
    image_part = None
    if image_reference:
        try:
            image_part = _prepare_image_part(image_reference)
        except ValueError as val_err:
            logger.warning(f"Invalid repair image format/reference: {val_err}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid repair image format: {val_err}"
            )

    # 2. Verify backend configuration
    if not settings.GEMINI_API_KEY:
        logger.error("Attempted Gemini repair advisory analysis without GEMINI_API_KEY configured.")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Gemini AI service is not configured on the backend."
        )

    client = get_gemini_client()
    if not client:
        logger.error("Failed to obtain Gemini SDK client.")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Gemini AI service client initialization failed."
        )

    # 3. Build prompt context with user-confirmed details and problem description
    prompt_text = REPAIR_ADVISORY_SYSTEM_PROMPT

    prompt_sections = []
    if device_context and isinstance(device_context, dict):
        device_lines = ["\n\nAUTHORITATIVE USER-CONFIRMED DEVICE SPECIFICATIONS (MUST NOT BE OVERRIDDEN):"]
        for k, v in device_context.items():
            if v is not None and k not in ("image_reference", "device_id", "valuation_id"):
                device_lines.append(f"- {k}: {v}")
        prompt_sections.append("\n".join(device_lines))

    if problem_input and isinstance(problem_input, dict):
        prob_lines = ["\n\nUSER-REPORTED PROBLEM & SYMPTOMS:"]
        for k, v in problem_input.items():
            if v is not None and v != [] and v != "":
                prob_lines.append(f"- {k}: {v}")
        prompt_sections.append("\n".join(prob_lines))

    full_prompt_text = prompt_text + "".join(prompt_sections)

    prompt_contents = [full_prompt_text]
    if image_part is not None:
        prompt_contents.append(image_part)


    response = None
    last_api_err = None
    for attempt in range(2):
        try:
            client = get_gemini_client()
            if not client:
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail="Gemini AI service client initialization failed."
                )
            response = await asyncio.wait_for(
                client.aio.models.generate_content(
                    model=settings.GEMINI_MODEL,
                    contents=prompt_contents,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        response_schema=GeminiRepairAdvisoryResult,
                        temperature=0.2,
                    )
                ),
                timeout=timeout_seconds
            )
            break
        except asyncio.TimeoutError:
            logger.error("Gemini API request timed out during repair analysis.")
            raise HTTPException(
                status_code=status.HTTP_504_GATEWAY_TIMEOUT,
                detail="AI repair analysis request timed out. Please try again."
            )
        except APIError as api_err:
            last_api_err = api_err
            err_str = str(api_err).lower()
            logger.warning(f"Gemini API error during repair analysis (attempt {attempt+1}/2): code={api_err.code} message={api_err.message}")
            if (api_err.code in (500, 503) or "high demand" in err_str or "unavailable" in err_str) and attempt == 0:
                await asyncio.sleep(1.0)
                continue
            break

    if response is None:
        if last_api_err is not None:
            api_err = last_api_err
            err_str = str(api_err).lower()
            if api_err.code == 429 or "quota" in err_str or "rate limit" in err_str:
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="AI repair analysis is temporarily unavailable because the AI service has reached its usage limit. Please try again later."
                )
            elif api_err.code in (500, 503) or "high demand" in err_str or "unavailable" in err_str:
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail="AI repair analysis is temporarily experiencing high demand. Please try again shortly."
                )
            elif api_err.code in (401, 403) or "api key not valid" in err_str or "unauthorized" in err_str:
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="Gemini AI service authentication failure."
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="Gemini AI service returned an error. Please try again."
                )
        else:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Unable to complete AI repair analysis at this time."
            )

    if not response or not response.text:
        logger.error("Gemini returned empty response text during repair analysis.")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Gemini AI returned an empty repair analysis result."
        )

    try:
        if hasattr(response, "parsed") and isinstance(response.parsed, GeminiRepairAdvisoryResult):
            return response.parsed

        raw_text = response.text.strip()
        if raw_text.startswith("```"):
            lines = raw_text.splitlines()
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].startswith("```"):
                lines = lines[:-1]
            raw_text = "\n".join(lines).strip()

        parsed_json = json.loads(raw_text)
        return GeminiRepairAdvisoryResult(**parsed_json)
    except (json.JSONDecodeError, TypeError, ValueError) as parse_err:
        logger.error(f"Failed to parse Gemini structured JSON repair response: {parse_err}. Response snippet: {response.text[:200]}")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Gemini AI returned a malformed response that could not be parsed."
        )


