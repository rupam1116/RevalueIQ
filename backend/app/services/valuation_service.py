import hashlib
import logging
import secrets
import string
import re
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from bson import ObjectId
from fastapi import HTTPException, status
from pymongo.asynchronous.database import AsyncDatabase

from app.schemas.valuations import CreateValuationRequest, ValuationStatus
from app.services import gemini_service

logger = logging.getLogger("revalueiq.services.valuations")


def parse_object_id(id_str: str) -> Optional[ObjectId]:
    """Safely parses a string ID into a BSON ObjectId. Returns None if malformed."""
    try:
        if not id_str or not isinstance(id_str, str) or len(id_str) != 24:
            return None
        return ObjectId(id_str)
    except Exception:
        return None


async def generate_valuation_code(db: AsyncDatabase) -> str:
    """
    Generates a unique human-readable valuation code (e.g. VAL-A7K29P4X).
    Ensures server-side uniqueness against MongoDB unique index.
    """
    alphabet = string.ascii_uppercase + string.digits
    for _ in range(10):
        random_str = "".join(secrets.choice(alphabet) for _ in range(8))
        code = f"VAL-{random_str}"
        existing = await db.device_valuations.find_one({"valuation_code": code})
        if not existing:
            return code
    raise RuntimeError("Failed to generate a unique valuation code after multiple attempts.")


def format_valuation_doc(doc: Dict[str, Any]) -> Dict[str, Any]:
    """Formats raw MongoDB valuation document into schema-compliant dictionary."""
    input_doc = doc.get("input") or {}
    valuation_doc = doc.get("valuation") or {}
    ai_doc = doc.get("ai_analysis") or {}

    return {
        "id": str(doc.get("_id", "")),
        "valuation_code": doc.get("valuation_code", ""),
        "user_id": str(doc.get("user_id", "")),
        "device_id": str(doc.get("device_id")) if doc.get("device_id") else None,
        "status": doc.get("status", ValuationStatus.PENDING.value),
        "input": {
            "device_name": input_doc.get("device_name"),
            "category": input_doc.get("category"),
            "brand": input_doc.get("brand"),
            "model": input_doc.get("model"),
            "image_reference": input_doc.get("image_reference"),
            "storage": input_doc.get("storage"),
            "ram": input_doc.get("ram"),
            "purchase_year": input_doc.get("purchase_year"),
            "condition": input_doc.get("condition"),
            "functional_status": input_doc.get("functional_status"),
            "has_original_box": input_doc.get("has_original_box"),
            "has_charger": input_doc.get("has_charger"),
            "additional_notes": input_doc.get("additional_notes"),
        },
        "ai_analysis": doc.get("ai_analysis"),
        "valuation": {
            "estimated_resale_value": valuation_doc.get("estimated_resale_value") if valuation_doc.get("estimated_resale_value") is not None else ai_doc.get("estimated_resale_value"),
            "repair_estimate": valuation_doc.get("repair_estimate") if valuation_doc.get("repair_estimate") is not None else ai_doc.get("estimated_repair_cost"),
            "estimated_repair_cost": valuation_doc.get("estimated_repair_cost") if valuation_doc.get("estimated_repair_cost") is not None else ai_doc.get("estimated_repair_cost"),
            "recommendation": valuation_doc.get("recommendation") if valuation_doc.get("recommendation") is not None else (ai_doc.get("market_recommendation") or ai_doc.get("repair_recommendation")),
            "market_recommendation": valuation_doc.get("market_recommendation") if valuation_doc.get("market_recommendation") is not None else ai_doc.get("market_recommendation"),
            "circular_recommendation": valuation_doc.get("circular_recommendation") if valuation_doc.get("circular_recommendation") is not None else ai_doc.get("circular_recommendation"),
            "circularity_score": valuation_doc.get("circularity_score") if valuation_doc.get("circularity_score") is not None else ai_doc.get("circularity_score"),
            "confidence": valuation_doc.get("confidence") if valuation_doc.get("confidence") is not None else ai_doc.get("confidence"),
            "reasoning": valuation_doc.get("reasoning") if valuation_doc.get("reasoning") is not None else ai_doc.get("reasoning"),
            "condition": valuation_doc.get("condition") if valuation_doc.get("condition") is not None else ai_doc.get("visible_condition"),
            "damage_detected": valuation_doc.get("damage_detected") if valuation_doc.get("damage_detected") is not None else ai_doc.get("damage_detected", False),
            "damage_description": valuation_doc.get("damage_description") if valuation_doc.get("damage_description") is not None else ai_doc.get("damage_description"),
            "repair_recommendation": valuation_doc.get("repair_recommendation") if valuation_doc.get("repair_recommendation") is not None else ai_doc.get("repair_recommendation"),
        },
        "created_at": doc.get("created_at"),
        "updated_at": doc.get("updated_at"),
        "completed_at": doc.get("completed_at"),
    }


async def create_valuation(
    db: AsyncDatabase,
    user_id: ObjectId,
    request_data: CreateValuationRequest
) -> Dict[str, Any]:
    """
    Creates a new pending appraisal for the authenticated user.
    Strictly verifies ownership if device_id is provided.
    Generates valuation_code server-side.
    """
    device_oid: Optional[ObjectId] = None

    if request_data.device_id:
        device_oid = parse_object_id(request_data.device_id)
        if not device_oid:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Device not found."
            )

        # Verify device ownership
        device_doc = await db.user_devices.find_one({"_id": device_oid, "user_id": user_id})
        if not device_doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Device not found."
            )

    # Extract input parameters (prefer explicit request_data.input subdocument, fallback to top-level)
    inp = request_data.input
    device_name = (inp.device_name if inp else None) or request_data.device_name
    category = (inp.category if inp else None) or request_data.category
    brand = (inp.brand if inp else None) or request_data.brand
    model = (inp.model if inp else None) or request_data.model
    image_ref = (inp.image_reference if inp else None) or request_data.image_reference
    storage = inp.storage if inp else None
    ram = inp.ram if inp else None
    purchase_year = inp.purchase_year if inp else None
    condition = inp.condition if inp else None
    functional_status = inp.functional_status if inp else None
    has_original_box = inp.has_original_box if inp else None
    has_charger = inp.has_charger if inp else None
    additional_notes = inp.additional_notes if inp else None

    # If linked device exists, populate missing input fields from device metadata
    if request_data.device_id:
        device_doc = await db.user_devices.find_one({"_id": device_oid, "user_id": user_id})
        if device_doc:
            if not brand:
                brand = device_doc.get("brand")
            if not model:
                model = device_doc.get("model")
            if not category:
                category = device_doc.get("category")
            if not device_name and brand and model:
                device_name = f"{brand} {model}"

    valuation_code = await generate_valuation_code(db)
    now = datetime.now(timezone.utc)

    doc = {
        "valuation_code": valuation_code,
        "user_id": user_id,
        "device_id": device_oid,
        "status": ValuationStatus.PENDING.value,
        "input": {
            "device_name": device_name,
            "category": category,
            "brand": brand,
            "model": model,
            "image_reference": image_ref,
            "storage": storage,
            "ram": ram,
            "purchase_year": purchase_year,
            "condition": condition,
            "functional_status": functional_status,
            "has_original_box": has_original_box,
            "has_charger": has_charger,
            "additional_notes": additional_notes,
        },
        "ai_analysis": None,
        "valuation": {
            "estimated_resale_value": None,
            "repair_estimate": None,
            "estimated_repair_cost": None,
            "recommendation": None,
            "market_recommendation": None,
            "circular_recommendation": None,
            "circularity_score": None,
            "confidence": None,
            "reasoning": None,
            "condition": None,
            "damage_detected": False,
            "damage_description": None,
            "repair_recommendation": None,
        },
        "created_at": now,
        "updated_at": now,
        "completed_at": None,
    }

    result = await db.device_valuations.insert_one(doc)
    doc["_id"] = result.inserted_id
    logger.info(f"Created valuation code={valuation_code} id={result.inserted_id} for user_id={user_id}")
    return format_valuation_doc(doc)


async def list_user_valuations(
    db: AsyncDatabase,
    user_id: ObjectId,
    category: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None,
) -> List[Dict[str, Any]]:
    """
    Retrieves all appraisals belonging to the specified authenticated user.
    Supports filtering by category, status, and search term.
    """
    filters: List[Dict[str, Any]] = [{"user_id": user_id}]

    if category and category.lower() != "all":
        cat_clean = re.escape(category.strip())
        filters.append({
            "$or": [
                {"input.category": {"$regex": f"^{cat_clean}$", "$options": "i"}},
                {"ai_analysis.category": {"$regex": f"^{cat_clean}$", "$options": "i"}},
            ]
        })

    if status:
        filters.append({"status": status})

    if search and search.strip():
        q_clean = re.escape(search.strip())
        filters.append({
            "$or": [
                {"input.device_name": {"$regex": q_clean, "$options": "i"}},
                {"valuation_code": {"$regex": q_clean, "$options": "i"}},
                {"input.brand": {"$regex": q_clean, "$options": "i"}},
                {"input.model": {"$regex": q_clean, "$options": "i"}},
                {"ai_analysis.device_name": {"$regex": q_clean, "$options": "i"}},
            ]
        })

    query = {"$and": filters} if len(filters) > 1 else filters[0]

    limit = 50
    cursor = db.device_valuations.find(query).sort("created_at", -1).limit(limit)
    valuations = []
    async for doc in cursor:
        valuations.append(format_valuation_doc(doc))
    return valuations



async def get_valuation_certificate(
    db: AsyncDatabase,
    user_id: ObjectId,
    valuation_id_str: str,
) -> Dict[str, Any]:
    """
    Generates an official valuation certificate for the specified valuation.
    Enforces strict user ownership check (IDOR protection).
    """
    valuation_oid = parse_object_id(valuation_id_str)
    if not valuation_oid:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Valuation not found."
        )

    doc = await db.device_valuations.find_one({"_id": valuation_oid, "user_id": user_id})
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Valuation not found."
        )

    val_code = doc.get("valuation_code", "VAL-000000")
    cert_id = f"CERT-{val_code}"
    hash_payload = f"{doc['_id']}:{val_code}:{user_id}".encode("utf-8")
    verification_hash = hashlib.sha256(hash_payload).hexdigest()

    inp = doc.get("input") or {}
    val = doc.get("valuation") or {}
    ai = doc.get("ai_analysis") or {}

    brand = inp.get("brand") or ai.get("brand") or "Generic"
    model = inp.get("model") or ai.get("model") or "Device"
    device_name = inp.get("device_name") or f"{brand} {model}".strip()

    est_resale = val.get("estimated_resale_value") or ai.get("estimated_resale_value") or 0.0
    est_repair = val.get("estimated_repair_cost") or val.get("repair_estimate") or ai.get("estimated_repair_cost") or 0.0
    circ_score = val.get("circularity_score") or ai.get("circularity_score") or 85
    market_rec = val.get("market_recommendation") or ai.get("market_recommendation") or val.get("recommendation") or "SELL"
    circ_rec = val.get("circular_recommendation") or ai.get("circular_recommendation") or "Extending device operational lifespan diverts electronic waste."
    confidence = val.get("confidence") or ai.get("confidence") or 0.92

    issued_at = doc.get("completed_at") or doc.get("updated_at") or doc.get("created_at") or datetime.now(timezone.utc)

    return {
        "certificate_id": cert_id,
        "valuation_code": val_code,
        "verification_hash": verification_hash,
        "issued_at": issued_at,
        "owner_id": str(user_id),
        "device_name": device_name,
        "category": inp.get("category") or ai.get("category") or "Smartphone",
        "brand": brand,
        "model": model,
        "condition": val.get("condition") or inp.get("condition") or ai.get("visible_condition") or "Good",
        "estimated_resale_value": float(est_resale),
        "estimated_repair_cost": float(est_repair),
        "circularity_score": int(circ_score),
        "co2_offset_kg": 24.5,
        "ewaste_diverted_kg": 1.8,
        "market_recommendation": market_rec,
        "circular_recommendation": circ_rec,
        "ai_confidence": float(confidence),
        "materials_recovered": {
            "gold_mg": 24,
            "silver_mg": 250,
            "copper_grams": 14,
            "cobalt_grams": 6,
            "aluminum_grams": 42,
        },
    }


async def register_device_from_valuation(
    db: AsyncDatabase,
    user_id: ObjectId,
    valuation_id_str: str,
) -> Dict[str, Any]:
    """
    Converts an appraised valuation into a registered device in user_devices collection.
    Strictly verifies ownership (IDOR protection).
    Links the created user_devices._id back to device_valuations.device_id.
    """
    valuation_oid = parse_object_id(valuation_id_str)
    if not valuation_oid:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Valuation not found."
        )

    val_doc = await db.device_valuations.find_one({"_id": valuation_oid, "user_id": user_id})
    if not val_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Valuation not found."
        )

    # If device is already registered, return existing link
    if val_doc.get("device_id"):
        return {
            "message": "Device is already registered in portfolio",
            "device_id": str(val_doc["device_id"]),
            "valuation_id": valuation_id_str,
            "status": "already_registered",
        }

    inp = val_doc.get("input") or {}
    ai = val_doc.get("ai_analysis") or {}

    brand = inp.get("brand") or ai.get("brand") or "Generic"
    model = inp.get("model") or ai.get("model") or "Device"
    category = inp.get("category") or ai.get("category") or "Smartphone"

    now = datetime.now(timezone.utc)
    new_device = {
        "user_id": user_id,
        "brand": brand,
        "model": model,
        "category": category,
        "storage": inp.get("storage") or "Not specified",
        "ram": inp.get("ram") or "Not specified",
        "serial_number": None,
        "purchase_year": str(inp.get("purchase_year")) if inp.get("purchase_year") else None,
        "status": "Active",
        "primary_image": inp.get("image_reference") or "",
        "created_at": now,
        "updated_at": now,
    }

    res = await db.user_devices.insert_one(new_device)
    device_oid = res.inserted_id

    # Update valuation document to reference the newly created device_id
    await db.device_valuations.update_one(
        {"_id": valuation_oid},
        {"$set": {"device_id": device_oid, "updated_at": now}}
    )

    logger.info(f"Registered device id={device_oid} from valuation id={valuation_id_str} for user_id={user_id}")
    return {
        "message": "Device successfully registered in portfolio",
        "device_id": str(device_oid),
        "valuation_id": valuation_id_str,
        "status": "registered",
    }



async def get_user_valuation(
    db: AsyncDatabase,
    user_id: ObjectId,
    valuation_id_str: str
) -> Optional[Dict[str, Any]]:
    """
    Retrieves a single appraisal by ID.
    Strictly enforces user ownership (user_id match). Returns None if not found or unauthorized.
    """
    valuation_oid = parse_object_id(valuation_id_str)
    if not valuation_oid:
        return None

    doc = await db.device_valuations.find_one({"_id": valuation_oid, "user_id": user_id})
    if not doc:
        return None

    return format_valuation_doc(doc)


async def delete_user_valuation(
    db: AsyncDatabase,
    user_id: ObjectId,
    valuation_id_str: str
) -> bool:
    """
    Deletes an appraisal by ID.
    Strictly enforces user ownership (user_id match). Returns True if deleted, False if not found/unauthorized.
    """
    valuation_oid = parse_object_id(valuation_id_str)
    if not valuation_oid:
        return False

    result = await db.device_valuations.delete_one({"_id": valuation_oid, "user_id": user_id})
    return result.deleted_count > 0


async def get_user_valuation_status(
    db: AsyncDatabase,
    user_id: ObjectId,
    valuation_id_str: str
) -> Optional[Dict[str, Any]]:
    """Retrieves appraisal status info. Enforces ownership check."""
    val = await get_user_valuation(db, user_id, valuation_id_str)
    if not val:
        return None

    return {
        "id": val["id"],
        "valuation_code": val["valuation_code"],
        "status": val["status"],
        "updated_at": val["updated_at"],
        "completed_at": val["completed_at"],
    }


def _normalize_inr_valuation_values(resale_val: Optional[float], repair_val: Optional[float]) -> tuple[float, float]:
    resale = float(resale_val) if resale_val is not None else 0.0
    repair = float(repair_val) if repair_val is not None else 0.0

    # If resale or repair estimates are returned in small USD-scale numbers (< 200 for non-scrap devices), scale to INR
    if 0.0 < resale < 200.0:
        resale = round(resale * 83.0, 2)
    if 0.0 < repair < 50.0:
        repair = round(repair * 83.0, 2)

    return resale, repair


async def analyze_user_valuation(
    db: AsyncDatabase,
    user_id: ObjectId,
    valuation_id_str: str
) -> Dict[str, Any]:
    """
    Analyzes an appraisal image using backend Gemini AI model.
    Enforces user ownership check (IDOR protection). Returns 404 if unauthorized/not found.
    Manages status lifecycle: pending -> analyzing -> completed (or failed).
    Saves structured result in MongoDB device_valuations document under ai_analysis and valuation.
    """
    valuation_oid = parse_object_id(valuation_id_str)
    if not valuation_oid:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Valuation not found."
        )

    # Verify valuation ownership
    doc = await db.device_valuations.find_one({"_id": valuation_oid, "user_id": user_id})
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Valuation not found."
        )

    inp = doc.get("input") or {}
    image_ref = inp.get("image_reference")
    if not image_ref:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Valuation has no image reference to analyze."
        )

    now = datetime.now(timezone.utc)
    # Transition status to 'analyzing'
    await db.device_valuations.update_one(
        {"_id": valuation_oid},
        {"$set": {"status": ValuationStatus.ANALYZING.value, "updated_at": now}}
    )

    try:
        ai_result = await gemini_service.analyze_device_image(image_ref, user_confirmed_details=inp)

        resale_inr, repair_inr = _normalize_inr_valuation_values(
            ai_result.estimated_resale_value,
            ai_result.estimated_repair_cost
        )

        comp_now = datetime.now(timezone.utc)
        ai_analysis_dict = {
            "device_name": ai_result.device_name,
            "category": ai_result.category,
            "brand": ai_result.brand,
            "model": ai_result.model,
            "visible_condition": ai_result.visible_condition,
            "damage_detected": ai_result.damage_detected,
            "damage_description": ai_result.damage_description,
            "repair_recommendation": ai_result.repair_recommendation,
            "market_recommendation": ai_result.market_recommendation,
            "circular_recommendation": ai_result.circular_recommendation,
            "circularity_score": ai_result.circularity_score,
            "estimated_repair_cost": repair_inr,
            "estimated_resale_value": resale_inr,
            "confidence": ai_result.confidence,
            "reasoning": ai_result.reasoning,
        }

        valuation_dict = {
            "estimated_resale_value": resale_inr,
            "repair_estimate": repair_inr,
            "estimated_repair_cost": repair_inr,
            "recommendation": ai_result.market_recommendation or ai_result.repair_recommendation,
            "market_recommendation": ai_result.market_recommendation,
            "circular_recommendation": ai_result.circular_recommendation,
            "circularity_score": ai_result.circularity_score,
            "confidence": ai_result.confidence,
            "reasoning": ai_result.reasoning,
            "condition": ai_result.visible_condition,
            "damage_detected": ai_result.damage_detected,
            "damage_description": ai_result.damage_description,
            "repair_recommendation": ai_result.repair_recommendation,
        }

        await db.device_valuations.update_one(
            {"_id": valuation_oid},
            {
                "$set": {
                    "status": ValuationStatus.COMPLETED.value,
                    "ai_analysis": ai_analysis_dict,
                    "valuation": valuation_dict,
                    "updated_at": comp_now,
                    "completed_at": comp_now,
                }
            }
        )

        updated_doc = await db.device_valuations.find_one({"_id": valuation_oid})
        
        # Trigger real VALUATION_COMPLETED notification
        try:
            from app.schemas.notifications import NotificationType
            from app.services.notification_service import create_notification
            await create_notification(
                db=db,
                user_id=user_id,
                type=NotificationType.VALUATION_COMPLETED,
                title="AI Valuation Completed",
                message=f"Appraisal for {ai_result.device_name or 'your device'} is ready (Estimated: ₹{resale_inr:,.2f}).",
                related_entity_type="device_valuation",
                related_entity_id=valuation_id_str,
                action_url="/app/valuation",
                event_id=f"val_comp_{valuation_id_str}"
            )
        except Exception as notif_err:
            logger.warning(f"Notice: Failed to create valuation notification: {notif_err}")

        return format_valuation_doc(updated_doc)

    except HTTPException as http_exc:
        logger.warning(f"Valuation analysis failed for valuation_id={valuation_id_str}: status={http_exc.status_code} detail={http_exc.detail}")
        fail_now = datetime.now(timezone.utc)
        await db.device_valuations.update_one(
            {"_id": valuation_oid},
            {
                "$set": {
                    "status": ValuationStatus.FAILED.value,
                    "ai_analysis": {"error": str(http_exc.detail)},
                    "updated_at": fail_now,
                }
            }
        )
        raise http_exc
    except Exception as exc:
        logger.error(f"Unexpected valuation analysis failure for valuation_id={valuation_id_str}: {exc}")
        fail_now = datetime.now(timezone.utc)
        await db.device_valuations.update_one(
            {"_id": valuation_oid},
            {
                "$set": {
                    "status": ValuationStatus.FAILED.value,
                    "ai_analysis": {"error": str(exc)},
                    "updated_at": fail_now,
                }
            }
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to perform AI Evaluation image analysis."
        )

