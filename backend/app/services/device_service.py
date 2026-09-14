import logging
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from bson import ObjectId
from pymongo.asynchronous.database import AsyncDatabase

logger = logging.getLogger("revalueiq.services.devices")


def format_device_doc(doc: Dict[str, Any]) -> Dict[str, Any]:
    """Formats raw MongoDB device document for API response schemas."""
    return {
        "id": str(doc.get("_id", "")),
        "user_id": str(doc.get("user_id", "")),
        "brand": doc.get("brand", ""),
        "model": doc.get("model", ""),
        "category": doc.get("category", doc.get("device_type", "Other")),
        "storage": doc.get("storage", ""),
        "ram": doc.get("ram", ""),
        "serial_number": doc.get("serial_number", ""),
        "purchase_year": str(doc.get("purchase_year", "")),
        "condition": doc.get("condition", "Good"),
        "status": doc.get("status", "Active"),
        "primary_image": doc.get("primary_image", doc.get("imageUrl", "")),
        "notes": doc.get("notes", doc.get("specsSnippet", "")),
        "created_at": doc.get("created_at"),
        "updated_at": doc.get("updated_at"),
    }


def parse_object_id(id_str: str) -> Optional[ObjectId]:
    """Safely parses string ID into BSON ObjectId. Returns None if malformed."""
    try:
        if not id_str or not isinstance(id_str, str) or len(id_str) != 24:
            return None
        return ObjectId(id_str)
    except Exception:
        return None


async def list_user_devices(db: AsyncDatabase, user_id: ObjectId) -> List[Dict[str, Any]]:
    """Retrieves all registered devices belonging to the specified user."""
    cursor = db.user_devices.find({"user_id": user_id}).sort("created_at", -1)
    devices = []
    async for doc in cursor:
        devices.append(format_device_doc(doc))
    return devices


async def create_user_device(
    db: AsyncDatabase,
    user_id: ObjectId,
    device_data: Dict[str, Any]
) -> Dict[str, Any]:
    """Creates a new device document in user_devices collection tied to user_id."""
    now = datetime.now(timezone.utc)
    doc = {
        "user_id": user_id,
        "brand": device_data["brand"],
        "model": device_data["model"],
        "category": device_data["category"],
        "storage": device_data.get("storage", ""),
        "ram": device_data.get("ram", ""),
        "serial_number": device_data.get("serial_number", ""),
        "purchase_year": device_data.get("purchase_year", ""),
        "condition": device_data.get("condition", "Good"),
        "status": device_data.get("status", "Active"),
        "primary_image": device_data.get("primary_image", ""),
        "notes": device_data.get("notes", ""),
        "created_at": now,
        "updated_at": now,
    }

    result = await db.user_devices.insert_one(doc)
    doc["_id"] = result.inserted_id
    logger.info(f"Created user device id={result.inserted_id} for user_id={user_id}")
    return format_device_doc(doc)


async def get_user_device(
    db: AsyncDatabase,
    user_id: ObjectId,
    device_id_str: str
) -> Optional[Dict[str, Any]]:
    """
    Retrieves a single device by ID.
    Strictly verifies ownership (user_id match). Returns None if not found or unauthorized.
    """
    device_oid = parse_object_id(device_id_str)
    if not device_oid:
        return None

    doc = await db.user_devices.find_one({"_id": device_oid, "user_id": user_id})
    if not doc:
        return None

    return format_device_doc(doc)


async def update_user_device(
    db: AsyncDatabase,
    user_id: ObjectId,
    device_id_str: str,
    update_data: Dict[str, Any]
) -> Optional[Dict[str, Any]]:
    """
    Updates a user device by ID.
    Strictly verifies ownership (user_id match). Returns None if not found or unauthorized.
    """
    device_oid = parse_object_id(device_id_str)
    if not device_oid:
        return None

    # Filter out None values
    clean_updates = {k: v for k, v in update_data.items() if v is not None}
    if not clean_updates:
        return await get_user_device(db, user_id, device_id_str)

    clean_updates["updated_at"] = datetime.now(timezone.utc)

    result = await db.user_devices.update_one(
        {"_id": device_oid, "user_id": user_id},
        {"$set": clean_updates}
    )

    if result.matched_count == 0:
        return None

    return await get_user_device(db, user_id, device_id_str)


async def delete_user_device(
    db: AsyncDatabase,
    user_id: ObjectId,
    device_id_str: str
) -> bool:
    """
    Deletes a user device by ID.
    Strictly verifies ownership (user_id match). Returns True if deleted, False if not found/unauthorized.
    """
    device_oid = parse_object_id(device_id_str)
    if not device_oid:
        return False

    result = await db.user_devices.delete_one({"_id": device_oid, "user_id": user_id})
    return result.deleted_count > 0
