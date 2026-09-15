import logging
from datetime import datetime, timezone
from typing import Dict, Any, Optional
from bson import ObjectId
from pymongo.asynchronous.database import AsyncDatabase

from app.schemas.settings import (
    NotificationPreferencesSchema,
    PrivacyPreferencesSchema,
    AppPreferencesSchema,
    AiPreferencesSchema,
    UserSettingsResponse,
    UserSettingsUpdateRequest,
)

logger = logging.getLogger("revalueiq.services.settings")


def get_default_settings_doc(user_id: ObjectId) -> Dict[str, Any]:
    now = datetime.now(timezone.utc)
    return {
        "user_id": user_id,
        "notifications": {
            "in_app": True,
            "email_notifications": True,
            "push_notifications": True,
            "sms_notifications": False,
            "marketplace_alerts": True,
            "repair_status_updates": True,
            "donation_impact_reports": True,
            "promotional_newsletters": False,
        },
        "privacy": {
            "profile_visibility": "Public",
            "activity_visibility": "Public",
            "stats_visibility": "Public Leaderboards",
            "search_engine_indexing": True,
            "ai_data_personalization": True,
            "anonymized_analytics": True,
            "cookies": {
                "essential": True,
                "analytics": True,
                "marketing": False,
                "functional": True,
            },
        },
        "preferences": {
            "theme": "Dark",
            "language": "English (US)",
            "currency": "INR (₹)",
            "distance_unit": "Kilometers (km)",
            "date_format": "YYYY-MM-DD",
            "accessibility": {
                "high_contrast": False,
                "reduced_motion": False,
            },
            "animations": True,
            "compact_mode": False,
        },
        "ai": {
            "preferred_recommendation_style": "Balanced",
            "enable_ai_learning": True,
            "enable_personalized_suggestions": True,
            "allow_ai_device_history": True,
        },
        "created_at": now,
        "updated_at": now,
    }


def format_settings_response(user_id_str: str, doc: Dict[str, Any]) -> UserSettingsResponse:
    notif_data = doc.get("notifications") or {}
    priv_data = doc.get("privacy") or {}
    pref_data = doc.get("preferences") or {}
    ai_data = doc.get("ai") or {}

    # Lock currency to INR (₹)
    pref_data["currency"] = "INR (₹)"

    return UserSettingsResponse(
        user_id=user_id_str,
        notifications=NotificationPreferencesSchema(**notif_data),
        privacy=PrivacyPreferencesSchema(**priv_data),
        preferences=AppPreferencesSchema(**pref_data),
        ai=AiPreferencesSchema(**ai_data),
        updated_at=doc.get("updated_at"),
    )


async def get_or_create_user_settings(
    db: AsyncDatabase,
    user_id: ObjectId
) -> UserSettingsResponse:
    doc = await db.user_settings.find_one({"user_id": user_id})
    if not doc:
        default_doc = get_default_settings_doc(user_id)
        await db.user_settings.insert_one(default_doc)
        doc = default_doc

    return format_settings_response(str(user_id), doc)


async def update_user_settings(
    db: AsyncDatabase,
    user_id: ObjectId,
    update_request: UserSettingsUpdateRequest
) -> UserSettingsResponse:
    now = datetime.now(timezone.utc)
    set_fields: Dict[str, Any] = {"updated_at": now}

    if update_request.notifications is not None:
        set_fields["notifications"] = update_request.notifications.model_dump()

    if update_request.privacy is not None:
        set_fields["privacy"] = update_request.privacy.model_dump()

    if update_request.preferences is not None:
        pref_dict = update_request.preferences.model_dump()
        # Enforce INR currency rule
        pref_dict["currency"] = "INR (₹)"
        set_fields["preferences"] = pref_dict

    if update_request.ai is not None:
        set_fields["ai"] = update_request.ai.model_dump()

    doc = await db.user_settings.find_one_and_update(
        {"user_id": user_id},
        {"$set": set_fields},
        upsert=True,
        return_document=True,
    )
    if not doc:
        doc = await db.user_settings.find_one({"user_id": user_id}) or get_default_settings_doc(user_id)

    return format_settings_response(str(user_id), doc)
