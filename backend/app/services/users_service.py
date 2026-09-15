import logging
from datetime import datetime, timezone
from typing import Dict, Any, Tuple, Optional
from bson import ObjectId
from pymongo.asynchronous.database import AsyncDatabase

logger = logging.getLogger("revalueiq.services.users")


def build_profile_dict(user_doc: Dict[str, Any], profile_doc: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """
    Constructs a merged safe user profile dictionary matching UserProfileResponse.
    Never exposes passwords, tokens, API keys, or private auth secrets.
    """
    p = profile_doc or {}
    social = p.get("social_links") or {}
    
    return {
        "id": str(user_doc.get("_id", "")),
        "firebase_uid": user_doc.get("firebase_uid", ""),
        "email": user_doc.get("email", ""),
        "full_name": user_doc.get("full_name", ""),
        "photo_url": user_doc.get("photo_url") or p.get("avatar_url") or "",
        "phone": p.get("phone", ""),
        "bio": p.get("bio", ""),
        "city": p.get("city", ""),
        "country": p.get("country", ""),
        "occupation": p.get("occupation", ""),
        "organization": p.get("organization", ""),
        "language": p.get("language", "English (US)"),
        "timezone": p.get("timezone", "Asia/Kolkata"),
        "role": user_doc.get("role", "user"),
        "status": user_doc.get("status", "active"),
        "circular_score": p.get("circular_score", 100),
        "circular_grade": p.get("circular_grade", "A"),
        "co2_saved_kg": float(p.get("co2_saved_kg", 0.0)),
        "ewaste_prevented_kg": float(p.get("ewaste_prevented_kg", 0.0)),
        "karma_points": p.get("karma_points", 0),
        "level": p.get("level", 1),
        "social_links": {
            "linkedin": social.get("linkedin", ""),
            "github": social.get("github", ""),
            "twitter": social.get("twitter", ""),
            "website": social.get("website", ""),
        },
        "created_at": user_doc.get("created_at"),
        "updated_at": user_doc.get("updated_at"),
    }


async def update_user_profile(
    db: AsyncDatabase,
    user_id: ObjectId,
    update_fields: Dict[str, Any]
) -> Tuple[Dict[str, Any], Dict[str, Any]]:
    """
    Updates the authenticated user's profile information across `users` and `user_profiles`.
    Strictly filters out protected business logic fields.
    """
    now = datetime.now(timezone.utc)
    user_updates: Dict[str, Any] = {"updated_at": now}
    profile_updates: Dict[str, Any] = {"updated_at": now}

    if "full_name" in update_fields and update_fields["full_name"] is not None:
        name_clean = str(update_fields["full_name"]).strip()
        if not name_clean:
            raise ValueError("Full name cannot be empty.")
        user_updates["full_name"] = name_clean

    if "photo_url" in update_fields and update_fields["photo_url"] is not None:
        user_updates["photo_url"] = update_fields["photo_url"]
        profile_updates["avatar_url"] = update_fields["photo_url"]

    for field in ["bio", "city", "country", "phone", "occupation", "organization", "language"]:
        if field in update_fields and update_fields[field] is not None:
            profile_updates[field] = str(update_fields[field]).strip()

    if "timezone" in update_fields and update_fields["timezone"] is not None:
        tz_str = str(update_fields["timezone"]).strip()
        # Validate IANA timezone
        try:
            from zoneinfo import ZoneInfo
            ZoneInfo(tz_str)
            profile_updates["timezone"] = tz_str
        except Exception:
            raise ValueError(f"Invalid IANA timezone identifier: {tz_str}")

    if "social_links" in update_fields and update_fields["social_links"] is not None:
        profile_updates["social_links"] = update_fields["social_links"]

    # 1. Update users collection if needed
    if len(user_updates) > 1:
        await db.users.update_one({"_id": user_id}, {"$set": user_updates})

    # 2. Update user_profiles collection
    await db.user_profiles.update_one(
        {"user_id": user_id},
        {"$set": profile_updates},
        upsert=True
    )

    # 3. Fetch refreshed documents
    user_doc = await db.users.find_one({"_id": user_id})
    profile_doc = await db.user_profiles.find_one({"user_id": user_id})

    if not user_doc:
        raise ValueError("User not found.")

    return user_doc, profile_doc or {}


async def get_user_stats(
    db: AsyncDatabase,
    user_id: ObjectId,
    profile_doc: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Calculates real user circular economy statistics by querying MongoDB collections.
    Returns 0 for non-existent activities (no fake hardcoded numbers).
    """
    p = profile_doc or {}

    devices_count = await db.user_devices.count_documents({"user_id": user_id})
    valuations_count = await db.device_valuations.count_documents({"user_id": user_id})
    repair_reports_count = await db.repair_reports.count_documents({"user_id": user_id})
    
    # Marketplace listings count (by seller_id or user_id)
    marketplace_listings_count = await db.marketplace_listings.count_documents({
        "$or": [{"seller_id": user_id}, {"user_id": user_id}]
    })

    donations_count = await db.donations.count_documents({"user_id": user_id})

    return {
        "circular_score": p.get("circular_score", 100),
        "circular_grade": p.get("circular_grade", "A"),
        "co2_saved_kg": float(p.get("co2_saved_kg", 0.0)),
        "ewaste_prevented_kg": float(p.get("ewaste_prevented_kg", 0.0)),
        "karma_points": p.get("karma_points", 0),
        "level": p.get("level", 1),
        "devices_count": devices_count,
        "valuations_count": valuations_count,
        "repair_reports_count": repair_reports_count,
        "marketplace_listings_count": marketplace_listings_count,
        "donations_count": donations_count,
    }
