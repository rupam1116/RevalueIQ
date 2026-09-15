import logging
from datetime import datetime, timezone
from typing import Dict, Any, List
from bson import ObjectId
from pymongo.asynchronous.database import AsyncDatabase

from app.schemas.settings import AccountExportResponse
from app.services.users_service import build_profile_dict
from app.services.settings_service import get_or_create_user_settings

logger = logging.getLogger("revalueiq.services.account")


def _sanitize_doc(doc: Dict[str, Any]) -> Dict[str, Any]:
    """Recursively converts ObjectIds to strings and strips any sensitive secrets."""
    sanitized: Dict[str, Any] = {}
    # Block list of sensitive fields that should never be in user exports
    sensitive_keys = {
        "password",
        "hashed_password",
        "secret",
        "private_key",
        "razorpay_signature",
        "api_key",
        "token",
        "admin_credentials",
    }
    for k, v in doc.items():
        if k in sensitive_keys:
            continue
        if isinstance(v, ObjectId):
            sanitized[k] = str(v)
        elif isinstance(v, datetime):
            sanitized[k] = v.isoformat()
        elif isinstance(v, dict):
            sanitized[k] = _sanitize_doc(v)
        elif isinstance(v, list):
            sanitized[k] = [
                _sanitize_doc(item) if isinstance(item, dict)
                else (str(item) if isinstance(item, ObjectId) else (item.isoformat() if isinstance(item, datetime) else item))
                for item in v
            ]
        else:
            sanitized[k] = v
    return sanitized


async def export_user_data(
    db: AsyncDatabase,
    user_id: ObjectId,
    user_doc: Dict[str, Any],
    profile_doc: Dict[str, Any]
) -> AccountExportResponse:
    """
    Exports strictly authenticated user-scoped data across collections.
    User A cannot access User B data.
    """
    now = datetime.now(timezone.utc)
    export_id = f"exp_{str(user_id)}_{int(now.timestamp())}"

    # Profile & settings
    safe_profile = build_profile_dict(user_doc, profile_doc)
    settings_res = await get_or_create_user_settings(db, user_id)

    # 1. Devices
    devices_cursor = db.user_devices.find({"user_id": user_id})
    devices = [_sanitize_doc(d) async for d in devices_cursor]

    # 2. Valuations
    val_cursor = db.device_valuations.find({"user_id": user_id})
    valuations = [_sanitize_doc(d) async for d in val_cursor]

    # 3. Repair reports
    rep_cursor = db.repair_reports.find({"user_id": user_id})
    repair_reports = [_sanitize_doc(d) async for d in rep_cursor]

    # 4. Marketplace listings
    mkt_cursor = db.marketplace_listings.find({"$or": [{"seller_id": user_id}, {"user_id": user_id}]})
    marketplace_listings = [_sanitize_doc(d) async for d in mkt_cursor]

    # 5. Donations
    don_cursor = db.donations.find({"user_id": user_id})
    donations = [_sanitize_doc(d) async for d in don_cursor]

    # 6. Payments
    pay_cursor = db.payments.find({"user_id": user_id})
    payments = [_sanitize_doc(d) async for d in pay_cursor]

    # 7. Notifications
    notif_cursor = db.notifications.find({"user_id": user_id})
    notifications = [_sanitize_doc(d) async for d in notif_cursor]

    return AccountExportResponse(
        export_id=export_id,
        exported_at=now,
        user={
            "id": str(user_doc.get("_id")),
            "firebase_uid": user_doc.get("firebase_uid"),
            "email": user_doc.get("email"),
            "full_name": user_doc.get("full_name"),
            "role": user_doc.get("role", "user"),
            "status": user_doc.get("status", "active"),
            "created_at": user_doc.get("created_at").isoformat() if isinstance(user_doc.get("created_at"), datetime) else str(user_doc.get("created_at")),
        },
        profile=safe_profile,
        settings=settings_res.model_dump(),
        devices=devices,
        valuations=valuations,
        repair_reports=repair_reports,
        marketplace_listings=marketplace_listings,
        donations=donations,
        payments=payments,
        notifications=notifications,
    )


async def deactivate_user_account(
    db: AsyncDatabase,
    user_id: ObjectId,
    firebase_uid: str
) -> bool:
    """Soft deactivates user account."""
    now = datetime.now(timezone.utc)
    res = await db.users.update_one(
        {"_id": user_id},
        {"$set": {"status": "deactivated", "is_active": False, "updated_at": now}}
    )
    logger.info(f"Account deactivated for user_id={user_id}, firebase_uid={firebase_uid}")
    return res.modified_count > 0


async def delete_user_account(
    db: AsyncDatabase,
    user_id: ObjectId,
    firebase_uid: str
) -> bool:
    """
    Soft deletes user account, disables Firebase user if possible, and invalidates sessions.
    Financial and legal records remain preserved for compliance.
    """
    now = datetime.now(timezone.utc)
    res = await db.users.update_one(
        {"_id": user_id},
        {"$set": {"status": "deleted", "is_active": False, "deleted_at": now, "updated_at": now}}
    )

    # Disable in Firebase if admin sdk is configured
    try:
        from firebase_admin import auth as fb_auth
        fb_auth.update_user(firebase_uid, disabled=True)
        fb_auth.revoke_refresh_tokens(firebase_uid)
        logger.info(f"Firebase user {firebase_uid} disabled and tokens revoked.")
    except Exception as e:
        logger.warning(f"Could not disable Firebase user directly (non-fatal): {e}")

    logger.info(f"Account marked deleted for user_id={user_id}, firebase_uid={firebase_uid}")
    return res.modified_count > 0


async def purge_user_activity(
    db: AsyncDatabase,
    user_id: ObjectId
) -> int:
    """Purges user activity history logs and notifications without touching legal or payment data."""
    res = await db.notifications.delete_many({"user_id": user_id})
    logger.info(f"Purged {res.deleted_count} notifications for user_id={user_id}")
    return res.deleted_count
