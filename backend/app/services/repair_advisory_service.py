import logging
import secrets
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from bson import ObjectId
from fastapi import HTTPException, status
from pymongo.asynchronous.database import AsyncDatabase

from app.schemas.repair_advisory import (
    RepairAdvisoryRequest,
    GeminiRepairAdvisoryResult,
)
from app.services.gemini_service import analyze_repair_advisory

logger = logging.getLogger("revalueiq.services.repair_advisory")


async def analyze_and_create_advisory(
    db: AsyncDatabase,
    user_id: ObjectId,
    request_data: RepairAdvisoryRequest,
) -> Dict[str, Any]:
    """
    Validates device and valuation ownership (strict IDOR protection),
    hydrates authoritative user-confirmed device specifications,
    invokes backend Gemini Vision AI repair diagnosis,
    and persists structured advisory in MongoDB repair_advisories collection.
    """
    hydrated_device_info: Dict[str, Any] = {}
    linked_device_id: Optional[ObjectId] = None
    linked_valuation_id: Optional[ObjectId] = None

    # 1. Device Context & IDOR Ownership Verification
    if request_data.device_id:
        try:
            device_obj_id = ObjectId(request_data.device_id)
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Device not found."
            )

        user_device = await db.user_devices.find_one({"_id": device_obj_id, "user_id": user_id})
        if not user_device:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Device not found."
            )
        linked_device_id = device_obj_id
        hydrated_device_info = {
            "brand": user_device.get("brand"),
            "model": user_device.get("model"),
            "category": user_device.get("category"),
            "storage": user_device.get("storage"),
            "ram": user_device.get("ram"),
            "purchase_year": user_device.get("purchase_year"),
            "condition": user_device.get("condition"),
            "status": user_device.get("status"),
            "notes": user_device.get("notes"),
        }

    # 2. Valuation Context & IDOR Ownership Verification
    if request_data.valuation_id:
        try:
            val_obj_id = ObjectId(request_data.valuation_id)
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Valuation not found."
            )

        valuation_doc = await db.device_valuations.find_one({"_id": val_obj_id, "user_id": user_id})
        if not valuation_doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Valuation not found."
            )
        linked_valuation_id = val_obj_id
        val_data = valuation_doc.get("valuation", {})
        val_input = valuation_doc.get("input", {})
        hydrated_device_info.setdefault("previous_damage", val_data.get("damage_description"))
        hydrated_device_info.setdefault("previous_valuation", val_data.get("estimated_resale_value"))
        if not hydrated_device_info.get("brand"):
            hydrated_device_info["brand"] = val_input.get("brand") or valuation_doc.get("brand")
        if not hydrated_device_info.get("model"):
            hydrated_device_info["model"] = val_input.get("model") or valuation_doc.get("model")
        if not hydrated_device_info.get("category"):
            hydrated_device_info["category"] = val_input.get("category") or valuation_doc.get("category")

    # 3. Merge User-Specified Context with Authoritative Priority
    user_context = request_data.device_context.model_dump(exclude_unset=True) if request_data.device_context else {}
    for key, val in user_context.items():
        if val is not None and val != "":
            hydrated_device_info[key] = val

    # 4. Prepare Problem Context
    problem_dict = request_data.problem_input.model_dump(exclude_unset=True) if request_data.problem_input else {}
    if request_data.additional_notes:
        problem_dict["additional_notes"] = request_data.additional_notes

    # 5. Invoke Gemini AI Repair Advisor
    gemini_result: GeminiRepairAdvisoryResult = await analyze_repair_advisory(
        device_context=hydrated_device_info,
        problem_input=problem_dict,
        image_reference=request_data.image_reference,
    )

    # 6. Generate Unique Advisory Code and Build Document
    advisory_code = f"ADV-{secrets.randbelow(900000) + 100000}"
    now = datetime.now(timezone.utc)

    advisory_doc = {
        "advisory_code": advisory_code,
        "user_id": user_id,
        "device_id": linked_device_id,
        "valuation_id": linked_valuation_id,
        "status": "completed",
        "device_info": hydrated_device_info,
        "problem_input": problem_dict,
        "ai_analysis": gemini_result.model_dump(),
        "image_metadata": {
            "has_image": bool(request_data.image_reference),
        },
        "created_at": now,
        "updated_at": now,
    }

    # 7. Persist to MongoDB repair_advisories
    result = await db.repair_advisories.insert_one(advisory_doc)
    advisory_doc["_id"] = result.inserted_id

    # Also sync into repair_reports for unified backward compatibility
    try:
        report_code = f"REP-{advisory_code.replace('ADV-', '')}"
        await db.repair_reports.insert_one({
            "advisory_id": result.inserted_id,
            "report_code": report_code,
            "user_id": user_id,
            "device_name": f"{hydrated_device_info.get('brand', '')} {hydrated_device_info.get('model', '')}".strip() or "Device",
            "category": hydrated_device_info.get("category", "Other"),
            "problem_identified": {
                "title": gemini_result.diagnosis,
                "summary": gemini_result.problem_detected,
                "root_cause": ", ".join(gemini_result.possible_causes) if gemini_result.possible_causes else "Hardware fault",
                "affected_components": [p.name for p in gemini_result.required_parts],
            },
            "severity": {
                "level": gemini_result.severity.value if hasattr(gemini_result.severity, 'value') else str(gemini_result.severity),
                "risk_note": " ".join(gemini_result.safety_warnings) if gemini_result.safety_warnings else "",
            },
            "created_at": now,
        })
    except Exception as sync_err:
        logger.debug(f"repair_reports sync note: {sync_err}")

    return {
        "id": str(advisory_doc["_id"]),
        "advisory_code": advisory_doc["advisory_code"],
        "user_id": str(user_id),
        "device_id": str(linked_device_id) if linked_device_id else None,
        "valuation_id": str(linked_valuation_id) if linked_valuation_id else None,
        "status": advisory_doc["status"],
        "device_info": advisory_doc["device_info"],
        "problem_input": advisory_doc["problem_input"],
        "ai_analysis": advisory_doc["ai_analysis"],
        "image_metadata": advisory_doc["image_metadata"],
        "created_at": advisory_doc["created_at"],
        "updated_at": advisory_doc["updated_at"],
    }


async def list_user_advisories(
    db: AsyncDatabase,
    user_id: ObjectId,
    device_id: Optional[str] = None,
    severity: Optional[str] = None,
    search: Optional[str] = None,
) -> List[Dict[str, Any]]:
    """
    Lists repair advisories owned by the authenticated user with optional filtering.
    """
    query: Dict[str, Any] = {"user_id": user_id}

    if device_id:
        try:
            query["device_id"] = ObjectId(device_id)
        except Exception:
            return []

    if severity and severity.upper() != "ALL":
        query["ai_analysis.severity"] = severity.upper()

    if search:
        search_regex = {"$regex": search, "$options": "i"}
        query["$or"] = [
            {"advisory_code": search_regex},
            {"device_info.brand": search_regex},
            {"device_info.model": search_regex},
            {"ai_analysis.diagnosis": search_regex},
            {"ai_analysis.problem_detected": search_regex},
        ]

    cursor = db.repair_advisories.find(query).sort("created_at", -1)
    docs = await cursor.to_list(length=100)

    results = []
    for doc in docs:
        results.append({
            "id": str(doc["_id"]),
            "advisory_code": doc.get("advisory_code", ""),
            "user_id": str(doc["user_id"]),
            "device_id": str(doc["device_id"]) if doc.get("device_id") else None,
            "valuation_id": str(doc["valuation_id"]) if doc.get("valuation_id") else None,
            "status": doc.get("status", "completed"),
            "device_info": doc.get("device_info", {}),
            "problem_input": doc.get("problem_input", {}),
            "ai_analysis": doc.get("ai_analysis", {}),
            "image_metadata": doc.get("image_metadata"),
            "created_at": doc.get("created_at", datetime.now(timezone.utc)),
            "updated_at": doc.get("updated_at", datetime.now(timezone.utc)),
        })
    return results


async def get_user_advisory(
    db: AsyncDatabase,
    user_id: ObjectId,
    advisory_id: str,
) -> Optional[Dict[str, Any]]:
    """
    Fetches a specific repair advisory with strict IDOR ownership verification.
    """
    try:
        adv_obj_id = ObjectId(advisory_id)
    except Exception:
        return None

    doc = await db.repair_advisories.find_one({"_id": adv_obj_id, "user_id": user_id})
    if not doc:
        return None

    return {
        "id": str(doc["_id"]),
        "advisory_code": doc.get("advisory_code", ""),
        "user_id": str(doc["user_id"]),
        "device_id": str(doc["device_id"]) if doc.get("device_id") else None,
        "valuation_id": str(doc["valuation_id"]) if doc.get("valuation_id") else None,
        "status": doc.get("status", "completed"),
        "device_info": doc.get("device_info", {}),
        "problem_input": doc.get("problem_input", {}),
        "ai_analysis": doc.get("ai_analysis", {}),
        "image_metadata": doc.get("image_metadata"),
        "created_at": doc.get("created_at", datetime.now(timezone.utc)),
        "updated_at": doc.get("updated_at", datetime.now(timezone.utc)),
    }


async def delete_user_advisory(
    db: AsyncDatabase,
    user_id: ObjectId,
    advisory_id: str,
) -> bool:
    """
    Deletes a repair advisory owned by the authenticated user.
    """
    try:
        adv_obj_id = ObjectId(advisory_id)
    except Exception:
        return False

    result = await db.repair_advisories.delete_one({"_id": adv_obj_id, "user_id": user_id})
    if result.deleted_count > 0:
        await db.repair_reports.delete_many({"advisory_id": adv_obj_id, "user_id": user_id})
        return True
    return False
