import logging
from datetime import datetime, timezone
from typing import List, Tuple, Optional, Dict, Any
from bson import ObjectId
from fastapi import HTTPException, status
from pymongo.asynchronous.database import AsyncDatabase

from app.schemas.notifications import NotificationType, NotificationResponse

logger = logging.getLogger("revalueiq.services.notifications")


def format_notification_doc(doc: Dict[str, Any]) -> NotificationResponse:
    """Formats raw MongoDB notification document into NotificationResponse schema."""
    created_at = doc.get("created_at") or datetime.now(timezone.utc)
    if isinstance(created_at, str):
        try:
            created_at = datetime.fromisoformat(created_at.replace("Z", "+00:00"))
        except Exception:
            created_at = datetime.now(timezone.utc)

    read_at = doc.get("read_at")
    if isinstance(read_at, str):
        try:
            read_at = datetime.fromisoformat(read_at.replace("Z", "+00:00"))
        except Exception:
            read_at = None

    return NotificationResponse(
        id=str(doc["_id"]),
        user_id=str(doc["user_id"]),
        type=NotificationType(doc.get("type", NotificationType.SECURITY)),
        title=doc.get("title", "Notification"),
        message=doc.get("message", ""),
        related_entity_type=doc.get("related_entity_type"),
        related_entity_id=doc.get("related_entity_id"),
        action_url=doc.get("action_url"),
        metadata=doc.get("metadata"),
        is_read=bool(doc.get("is_read", False)),
        read_at=read_at,
        created_at=created_at,
    )


async def create_notification(
    db: AsyncDatabase,
    user_id: ObjectId,
    type: NotificationType,
    title: str,
    message: str,
    action_url: Optional[str] = None,
    related_entity_type: Optional[str] = None,
    related_entity_id: Optional[str] = None,
    event_id: Optional[str] = None,
    metadata: Optional[Dict[str, Any]] = None,
) -> Optional[NotificationResponse]:
    """
    Idempotent notification creation service.
    If event_id is supplied, skips duplicate notification insertion.
    """
    try:
        if event_id:
            existing = await db.notifications.find_one({
                "user_id": user_id,
                "event_id": event_id,
            })
            if existing:
                logger.info(f"Duplicate notification skipped for event_id: {event_id}")
                return format_notification_doc(existing)

        now = datetime.now(timezone.utc)
        doc = {
            "user_id": user_id,
            "type": type.value if isinstance(type, NotificationType) else type,
            "title": title,
            "message": message,
            "action_url": action_url,
            "related_entity_type": related_entity_type,
            "related_entity_id": related_entity_id,
            "event_id": event_id,
            "metadata": metadata or {},
            "is_read": False,
            "read_at": None,
            "created_at": now,
        }

        result = await db.notifications.insert_one(doc)
        doc["_id"] = result.inserted_id
        logger.info(f"Notification created ({type}) for user {user_id}: {title}")
        return format_notification_doc(doc)
    except Exception as exc:
        logger.error(f"Failed to create notification: {exc}")
        return None


def _normalize_uid_filter(uid: Any) -> Dict[str, Any]:
    """Ensures query matches whether user_id was stored as BSON ObjectId or str."""
    candidates = [uid]
    if isinstance(uid, str) and ObjectId.is_valid(uid):
        candidates.append(ObjectId(uid))
    elif isinstance(uid, ObjectId):
        candidates.append(str(uid))
    return {"$in": candidates}


async def get_user_notifications(
    db: AsyncDatabase,
    user_id: Any,
    unread_only: bool = False,
    page: int = 1,
    limit: int = 20,
) -> Tuple[List[NotificationResponse], int, int]:
    """
    Retrieves paginated notifications for an authenticated user.
    Returns (items, total_count, unread_count).
    """
    uid_filter = _normalize_uid_filter(user_id)
    query: Dict[str, Any] = {"user_id": uid_filter}
    if unread_only:
        query["is_read"] = False

    skip = (page - 1) * limit

    total = await db.notifications.count_documents(query)
    unread_count = await db.notifications.count_documents({"user_id": uid_filter, "is_read": False})

    cursor = db.notifications.find(query).sort("created_at", -1).skip(skip).limit(limit)
    items: List[NotificationResponse] = []
    async for doc in cursor:
        items.append(format_notification_doc(doc))

    return items, total, unread_count


async def get_unread_count(db: AsyncDatabase, user_id: Any) -> int:
    """Returns exact unread notification count for authenticated user."""
    return await db.notifications.count_documents({"user_id": _normalize_uid_filter(user_id), "is_read": False})


async def mark_notification_read(
    db: AsyncDatabase,
    user_id: ObjectId,
    notification_id: str,
) -> NotificationResponse:
    """Marks a single notification as read after validating user ownership."""
    try:
        notif_obj_id = ObjectId(notification_id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid notification ID format."
        )

    doc = await db.notifications.find_one({"_id": notif_obj_id})
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found."
        )

    if str(doc["user_id"]) != str(user_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized access to notification record."
        )

    now = datetime.now(timezone.utc)
    updated = await db.notifications.find_one_and_update(
        {"_id": notif_obj_id},
        {"$set": {"is_read": True, "read_at": now}},
        return_document=True
    )

    return format_notification_doc(updated or doc)


async def mark_all_notifications_read(
    db: AsyncDatabase,
    user_id: ObjectId,
) -> int:
    """Marks all unread notifications for authenticated user as read."""
    now = datetime.now(timezone.utc)
    result = await db.notifications.update_many(
        {"user_id": user_id, "is_read": False},
        {"$set": {"is_read": True, "read_at": now}}
    )
    return result.modified_count


async def delete_notification(
    db: AsyncDatabase,
    user_id: ObjectId,
    notification_id: str,
) -> bool:
    """Deletes a notification after validating ownership."""
    try:
        notif_obj_id = ObjectId(notification_id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid notification ID format."
        )

    doc = await db.notifications.find_one({"_id": notif_obj_id})
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found."
        )

    if str(doc["user_id"]) != str(user_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized access to notification record."
        )

    res = await db.notifications.delete_one({"_id": notif_obj_id})
    return res.deleted_count > 0
