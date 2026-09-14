import logging
from datetime import datetime, timezone
from typing import Optional, Dict, Any, Tuple
from pymongo.asynchronous.database import AsyncDatabase
from pymongo.errors import DuplicateKeyError

logger = logging.getLogger("revalueiq.services.user")


async def sync_firebase_user(
    db: AsyncDatabase,
    claims: Dict[str, Any],
    extra_data: Optional[Dict[str, Any]] = None
) -> Tuple[Dict[str, Any], Dict[str, Any]]:
    """
    Synchronizes a Firebase authenticated user with the MongoDB database.
    
    1. Reads firebase_uid from claims.
    2. Searches users collection by firebase_uid (and secondary email lookup).
    3. Creates/updates user and user_profiles documents.
    
    Returns a tuple of (user_document, profile_document).
    """
    firebase_uid = claims.get("uid")
    if not firebase_uid:
        raise ValueError("Firebase claims must contain a valid 'uid'.")

    # Safe UID representation for logging (never log tokens or full credentials)
    safe_uid = f"{firebase_uid[:4]}...{firebase_uid[-4:]}" if len(firebase_uid) > 8 else "uid_present"
    email = (claims.get("email") or "").strip()
    display_name = claims.get("name") or (extra_data.get("full_name") if extra_data else None) or ""
    photo_url = claims.get("picture") or (extra_data.get("photo_url") if extra_data else None) or ""
    email_verified = claims.get("email_verified", False)
    now = datetime.now(timezone.utc)

    # 1. Firebase token claims verified
    logger.info(f"[Stage 1] Firebase token claims verified for safe_uid='{safe_uid}'.")

    try:
        # 2. users lookup started
        logger.info(f"[Stage 2] users lookup started for safe_uid='{safe_uid}'.")
        user = await db.users.find_one({"firebase_uid": firebase_uid})
        
        if not user and email:
            user = await db.users.find_one({"email": email})
            if user:
                logger.info(f"Found existing user by email for safe_uid='{safe_uid}', linking firebase_uid.")

        # 3. users lookup completed
        logger.info(f"[Stage 3] users lookup completed for safe_uid='{safe_uid}'. Found={user is not None}.")

        # 4. users upsert started
        logger.info(f"[Stage 4] users upsert started for safe_uid='{safe_uid}'.")
        if not user:
            user_doc = {
                "firebase_uid": firebase_uid,
                "email": email,
                "full_name": display_name,
                "photo_url": photo_url,
                "role": "user",
                "status": "active",
                "is_active": True,
                "is_verified": email_verified,
                "created_at": now,
                "updated_at": now,
                "last_login_at": now,
            }
            try:
                result = await db.users.insert_one(user_doc)
                user_doc["_id"] = result.inserted_id
                user = user_doc
                logger.info(f"Created new MongoDB user for safe_uid='{safe_uid}'.")
            except DuplicateKeyError:
                user = await db.users.find_one({"firebase_uid": firebase_uid})
                if not user and email:
                    user = await db.users.find_one({"email": email})
                if not user:
                    raise
        else:
            update_fields: Dict[str, Any] = {
                "firebase_uid": firebase_uid,
                "last_login_at": now,
                "updated_at": now,
                "is_verified": email_verified,
            }
            if email and email != user.get("email"):
                update_fields["email"] = email
            if display_name and display_name != user.get("full_name"):
                update_fields["full_name"] = display_name
            if photo_url and photo_url != user.get("photo_url"):
                update_fields["photo_url"] = photo_url

            await db.users.update_one({"_id": user["_id"]}, {"$set": update_fields})
            user = await db.users.find_one({"_id": user["_id"]})

        # 5. users upsert completed
        logger.info(f"[Stage 5] users upsert completed for safe_uid='{safe_uid}'. user_id='{user['_id']}'.")

        # 6. user_profiles lookup/upsert started
        user_id = user["_id"]
        logger.info(f"[Stage 6] user_profiles lookup/upsert started for user_id='{user_id}'.")
        profile = await db.user_profiles.find_one({"user_id": user_id})

        if not profile:
            profile_doc = {
                "user_id": user_id,
                "phone": extra_data.get("phone", "") if extra_data else "",
                "avatar_url": photo_url,
                "bio": "",
                "city": "",
                "country": "",
                "occupation": "",
                "organization": "",
                "circular_score": 100,
                "circular_grade": "A",
                "co2_saved_kg": 0.0,
                "ewaste_prevented_kg": 0.0,
                "karma_points": 0,
                "level": 1,
                "social_links": {},
                "created_at": now,
                "updated_at": now,
            }
            try:
                p_result = await db.user_profiles.insert_one(profile_doc)
                profile_doc["_id"] = p_result.inserted_id
                profile = profile_doc
                logger.info(f"Created user_profile for user_id='{user_id}'.")
            except DuplicateKeyError:
                profile = await db.user_profiles.find_one({"user_id": user_id})
                if not profile:
                    raise
        else:
            if photo_url and photo_url != profile.get("avatar_url"):
                await db.user_profiles.update_one(
                    {"_id": profile["_id"]},
                    {"$set": {"avatar_url": photo_url, "updated_at": now}}
                )
                profile["avatar_url"] = photo_url

        # 7. user_profiles operation completed
        logger.info(f"[Stage 7] user_profiles operation completed for user_id='{user_id}'. profile_id='{profile['_id']}'.")

        # 8. auth sync completed
        logger.info(f"[Stage 8] Auth sync completed successfully for safe_uid='{safe_uid}'.")

        return user, profile

    except Exception as db_exc:
        logger.error(f"MongoDB database operation failed during user sync for safe_uid='{safe_uid}': {db_exc}")
        raise db_exc
