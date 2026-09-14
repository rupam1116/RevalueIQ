import logging
import random
import string
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List, Tuple
from bson import ObjectId
from fastapi import HTTPException, status
from pymongo.asynchronous.database import AsyncDatabase

from app.schemas.marketplace import (
    ListingStatus,
    MarketplaceListingCreate,
    MarketplaceListingUpdate,
    ListingImageItem,
    ListingSpecifications,
    ListingValuationSnapshot,
    PricingMetadata,
    SafeSellerInfo,
)
from app.services.cloudinary_service import cloudinary_service

logger = logging.getLogger("revalueiq.services.marketplace")


def generate_listing_code() -> str:
    """Generates unique human-readable listing code e.g. LIST-842917."""
    code_digits = "".join(random.choices(string.digits, k=6))
    return f"LIST-{code_digits}"


async def get_seller_snapshot(db: AsyncDatabase, user_id: ObjectId) -> SafeSellerInfo:
    """Retrieves safe, non-private seller snapshot information from user records."""
    user = await db.users.find_one({"_id": user_id})
    profile = await db.user_profiles.find_one({"user_id": user_id})

    name = "RevalueIQ Member"
    avatar = None
    location = "India"
    rating = 5.0
    reviews_count = 0
    member_since = None

    if user:
        name = user.get("full_name") or user.get("display_name") or user.get("name") or name
        avatar = user.get("photo_url") or user.get("avatar_url") or avatar
        if user.get("created_at"):
            try:
                member_since = user["created_at"].strftime("%b %Y")
            except Exception:
                member_since = "2024"

    if profile:
        name = profile.get("full_name") or profile.get("display_name") or name
        location = profile.get("location") or profile.get("city") or location
        rating = float(profile.get("seller_rating") or profile.get("rating") or rating)
        reviews_count = int(profile.get("seller_reviews_count") or reviews_count)

    return SafeSellerInfo(
        id=str(user_id),
        name=name,
        avatar=avatar,
        location=location,
        rating=rating,
        reviews_count=reviews_count,
        verified=True,
        member_since=member_since or "2024",
    )


def validate_image_item(img: ListingImageItem) -> None:
    """Validates individual image structure and reasonable payload bounds."""
    if not img.url or not img.url.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image URL cannot be empty."
        )
    # Check data URI or URL length bound (e.g. max 10MB base64)
    if len(img.url) > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image exceeds maximum allowed size (10MB)."
        )
    if img.url.startswith("data:"):
        valid_prefixes = ("data:image/jpeg", "data:image/png", "data:image/webp", "data:image/jpg")
        if not any(img.url.startswith(p) for p in valid_prefixes):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unsupported image format. Allowed formats: JPEG, PNG, WEBP."
            )


def format_listing_document(doc: Dict[str, Any], current_user_id: Optional[ObjectId] = None) -> Dict[str, Any]:
    """Converts a raw MongoDB listing document to a safe response dictionary."""
    seller_id_obj = doc.get("seller_id")
    is_owner = False
    if current_user_id and seller_id_obj:
        is_owner = str(seller_id_obj) == str(current_user_id)

    raw_seller = doc.get("seller_info") or {}
    seller = SafeSellerInfo(
        id=str(seller_id_obj) if seller_id_obj else raw_seller.get("id", ""),
        name=raw_seller.get("name", "RevalueIQ Member"),
        avatar=raw_seller.get("avatar"),
        location=raw_seller.get("location", "India"),
        rating=float(raw_seller.get("rating", 5.0)),
        reviews_count=int(raw_seller.get("reviews_count", 0)),
        verified=bool(raw_seller.get("verified", True)),
        member_since=raw_seller.get("member_since", "2024"),
    )

    specs_raw = doc.get("specifications") or {}
    specifications = ListingSpecifications(
        ram=specs_raw.get("ram"),
        storage=specs_raw.get("storage"),
        purchase_year=specs_raw.get("purchase_year"),
        color=specs_raw.get("color"),
        processor=specs_raw.get("processor"),
        display=specs_raw.get("display"),
        battery_health=specs_raw.get("battery_health"),
        other=specs_raw.get("other", {}),
    )

    def _clean_image_url(url: Optional[str]) -> str:
        if not url or not isinstance(url, str):
            return "https://res.cloudinary.com/demo/image/upload/sample.jpg"
        if "res.cloudinary.com/demo/image/upload" in url and not url.endswith("sample.jpg"):
            return "https://res.cloudinary.com/demo/image/upload/sample.jpg"
        return url

    images = [
        ListingImageItem(
            url=_clean_image_url(img.get("secure_url") or img.get("url", "")),
            secure_url=_clean_image_url(img.get("secure_url") or img.get("url")),
            public_id=img.get("public_id"),
            width=img.get("width"),
            height=img.get("height"),
            format=img.get("format"),
            bytes=img.get("bytes"),
            type=img.get("type", "standard"),
            order=img.get("order", idx)
        )
        for idx, img in enumerate(doc.get("images", []))
    ]

    val_raw = doc.get("valuation")
    valuation = None
    if val_raw:
        valuation = ListingValuationSnapshot(
            estimated_value_inr=val_raw.get("estimated_value_inr"),
            minimum_value_inr=val_raw.get("minimum_value_inr"),
            maximum_value_inr=val_raw.get("maximum_value_inr"),
            valuation_id=val_raw.get("valuation_id"),
            valuation_code=val_raw.get("valuation_code"),
            circularity_score=val_raw.get("circularity_score"),
            co2_saved_kg=val_raw.get("co2_saved_kg"),
            ewaste_diverted_kg=val_raw.get("ewaste_diverted_kg"),
            water_saved_liters=val_raw.get("water_saved_liters"),
        )

    pricing_meta_raw = doc.get("pricing_metadata")
    pricing_metadata = None
    if pricing_meta_raw:
        pricing_metadata = PricingMetadata(
            valuation_based=bool(pricing_meta_raw.get("valuation_based", False)),
            seller_entered=bool(pricing_meta_raw.get("seller_entered", True)),
            suggested_price_inr=pricing_meta_raw.get("suggested_price_inr"),
        )

    return {
        "id": str(doc["_id"]),
        "listing_code": doc.get("listing_code", ""),
        "seller": seller,
        "is_owner": is_owner,
        "device_id": str(doc["device_id"]) if doc.get("device_id") else None,
        "valuation_id": str(doc["valuation_id"]) if doc.get("valuation_id") else None,
        "category": doc.get("category", "Other"),
        "brand": doc.get("brand", ""),
        "model": doc.get("model", ""),
        "title": doc.get("title", ""),
        "description": doc.get("description", ""),
        "condition": doc.get("condition", "A"),
        "functional_status": doc.get("functional_status", "Fully Functional"),
        "specifications": specifications,
        "images": images,
        "valuation": valuation,
        "asking_price_inr": float(doc.get("asking_price_inr", 0.0)),
        "original_price_inr": float(doc["original_price_inr"]) if doc.get("original_price_inr") else None,
        "pricing_metadata": pricing_metadata,
        "warranty": doc.get("warranty", "12-Month Revalue Eco Warranty"),
        "return_policy": doc.get("return_policy", "14-Day Free Returns"),
        "shipping_method": doc.get("shipping_method", "Insured Eco Express Shipping"),
        "location": doc.get("location", seller.location),
        "status": doc.get("status", ListingStatus.PUBLISHED.value),
        "views": int(doc.get("views", 0)),
        "inquiries": int(doc.get("inquiries", 0)),
        "created_at": doc.get("created_at", datetime.now(timezone.utc)),
        "updated_at": doc.get("updated_at", datetime.now(timezone.utc)),
        "published_at": doc.get("published_at"),
        "sold_at": doc.get("sold_at"),
    }


async def create_marketplace_listing(
    db: AsyncDatabase,
    user_id: ObjectId,
    payload: MarketplaceListingCreate,
) -> Dict[str, Any]:
    """Creates a new marketplace listing with strict device, valuation, and IDOR validation."""
    # 1. Device Ownership Verification
    device_doc = None
    device_obj_id = None
    if payload.device_id:
        try:
            device_obj_id = ObjectId(payload.device_id)
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Registered device not found."
            )
        device_doc = await db.user_devices.find_one({"_id": device_obj_id, "user_id": user_id})
        if not device_doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Registered device not found or does not belong to you."
            )

    # 2. Valuation Ownership Verification & Snapshot
    valuation_doc = None
    valuation_obj_id = None
    valuation_snapshot: Optional[Dict[str, Any]] = None
    suggested_price: Optional[float] = None

    if payload.valuation_id:
        try:
            valuation_obj_id = ObjectId(payload.valuation_id)
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Valuation record not found."
            )
        valuation_doc = await db.device_valuations.find_one({"_id": valuation_obj_id, "user_id": user_id})
        if not valuation_doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Valuation record not found or does not belong to you."
            )

        val_res = valuation_doc.get("valuation", {})
        est_val = val_res.get("estimated_resale_value")
        if est_val:
            suggested_price = float(est_val)
            min_val = round(est_val * 0.9, 2)
            max_val = round(est_val * 1.1, 2)
        else:
            min_val = None
            max_val = None

        valuation_snapshot = {
            "estimated_value_inr": est_val,
            "minimum_value_inr": min_val,
            "maximum_value_inr": max_val,
            "valuation_id": str(valuation_doc["_id"]),
            "valuation_code": valuation_doc.get("valuation_code"),
            "circularity_score": val_res.get("circularity_score", 90),
            "co2_saved_kg": val_res.get("co2_saved_kg", 74.5),
            "ewaste_diverted_kg": val_res.get("ewaste_diverted_kg", 0.85),
            "water_saved_liters": val_res.get("water_saved_liters", 14500),
        }

    # 3. Generate Unique Listing Code
    listing_code = generate_listing_code()
    for _ in range(5):
        existing = await db.marketplace_listings.find_one({"listing_code": listing_code})
        if not existing:
            break
        listing_code = generate_listing_code()

    # 4. Validate and Upload Images to Cloudinary
    stored_images: List[Dict[str, Any]] = []
    if payload.images:
        if len(payload.images) > 8:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A maximum of 8 images are allowed per listing."
            )
        for idx, img in enumerate(payload.images):
            validate_image_item(img)
            if img.secure_url and img.public_id and not img.url.startswith("data:"):
                stored_images.append(img.model_dump())
            else:
                uploaded = cloudinary_service.upload_marketplace_image(
                    image_data=img.url,
                    user_id=str(user_id),
                    listing_code=listing_code,
                    image_index=idx + 1,
                )
                stored_images.append({
                    "url": uploaded["secure_url"],
                    "secure_url": uploaded["secure_url"],
                    "public_id": uploaded["public_id"],
                    "width": uploaded.get("width"),
                    "height": uploaded.get("height"),
                    "format": uploaded.get("format"),
                    "bytes": uploaded.get("bytes"),
                    "type": img.type or "standard",
                    "order": img.order if img.order is not None else idx,
                })

    # 5. Determine Initial Status
    now = datetime.now(timezone.utc)
    if payload.save_as_draft:
        listing_status = ListingStatus.DRAFT.value
        published_at = None
    else:
        # Require at least 1 image to publish
        if not stored_images or len(stored_images) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="At least one photograph is required to publish a listing."
            )
        listing_status = ListingStatus.PUBLISHED.value
        published_at = now

    # 6. Retrieve Seller Snapshot
    seller_info = await get_seller_snapshot(db, user_id)

    pricing_metadata = {
        "valuation_based": bool(valuation_snapshot is not None),
        "seller_entered": True,
        "suggested_price_inr": suggested_price or payload.asking_price_inr,
    }

    doc = {
        "listing_code": listing_code,
        "seller_id": user_id,
        "seller_info": seller_info.model_dump(),
        "device_id": device_obj_id,
        "valuation_id": valuation_obj_id,
        "category": payload.category.strip(),
        "brand": payload.brand.strip(),
        "model": payload.model.strip(),
        "title": payload.title.strip(),
        "description": payload.description.strip(),
        "condition": payload.condition.strip(),
        "functional_status": (payload.functional_status or "Fully Functional").strip(),
        "specifications": payload.specifications.model_dump() if payload.specifications else {},
        "images": stored_images,
        "valuation": valuation_snapshot,
        "asking_price_inr": payload.asking_price_inr,
        "original_price_inr": payload.original_price_inr or round(payload.asking_price_inr * 1.3, 2),
        "pricing_metadata": pricing_metadata,
        "warranty": payload.warranty or "12-Month Revalue Eco Warranty",
        "return_policy": payload.return_policy or "14-Day Free Returns",
        "shipping_method": payload.shipping_method or "Insured Eco Express Shipping",
        "location": payload.location or seller_info.location,
        "status": listing_status,
        "views": 0,
        "inquiries": 0,
        "created_at": now,
        "updated_at": now,
        "published_at": published_at,
        "sold_at": None,
    }

    result = await db.marketplace_listings.insert_one(doc)
    doc["_id"] = result.inserted_id
    logger.info(f"Created marketplace listing {listing_code} (id={result.inserted_id}) with {len(stored_images)} Cloudinary image(s) for seller {user_id}")
    
    # Trigger real MARKETPLACE_LISTING_PUBLISHED notification
    try:
        from app.schemas.notifications import NotificationType
        from app.services.notification_service import create_notification
        await create_notification(
            db=db,
            user_id=user_id,
            type=NotificationType.MARKETPLACE_LISTING_PUBLISHED,
            title="Listing Published!",
            message=f"Your device listing '{payload.title}' is now live on the RevalueIQ Eco Marketplace for ₹{payload.asking_price_inr:,.2f}.",
            related_entity_type="marketplace_listing",
            related_entity_id=str(result.inserted_id),
            action_url="/app/marketplace",
            event_id=f"list_pub_{str(result.inserted_id)}"
        )
    except Exception as notif_err:
        logger.warning(f"Notice: Failed to create marketplace publication notification: {notif_err}")

    return format_listing_document(doc, user_id)


async def get_published_listings(
    db: AsyncDatabase,
    search: Optional[str] = None,
    category: Optional[str] = None,
    brand: Optional[str] = None,
    condition: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    sort: Optional[str] = "newest",
    page: int = 1,
    limit: int = 20,
    current_user_id: Optional[ObjectId] = None,
) -> Tuple[List[Dict[str, Any]], int, int]:
    """Retrieves published marketplace listings with search, filter, sort, and pagination."""
    query: Dict[str, Any] = {"status": ListingStatus.PUBLISHED.value}

    if category and category.lower() != "all":
        query["category"] = {"$regex": f"^{category}$", "$options": "i"}

    if brand:
        brands = [b.strip() for b in brand.split(",") if b.strip()]
        if len(brands) == 1:
            query["brand"] = {"$regex": f"^{brands[0]}$", "$options": "i"}
        elif len(brands) > 1:
            query["brand"] = {"$in": [b for b in brands]}

    if condition:
        conditions = [c.strip() for c in condition.split(",") if c.strip()]
        if len(conditions) == 1:
            query["condition"] = conditions[0]
        elif len(conditions) > 1:
            query["condition"] = {"$in": conditions}

    if min_price is not None or max_price is not None:
        price_query: Dict[str, Any] = {}
        if min_price is not None:
            price_query["$gte"] = float(min_price)
        if max_price is not None:
            price_query["$lte"] = float(max_price)
        query["asking_price_inr"] = price_query

    if search and search.strip():
        q_term = search.strip()
        query["$or"] = [
            {"title": {"$regex": q_term, "$options": "i"}},
            {"description": {"$regex": q_term, "$options": "i"}},
            {"brand": {"$regex": q_term, "$options": "i"}},
            {"model": {"$regex": q_term, "$options": "i"}},
            {"category": {"$regex": q_term, "$options": "i"}},
        ]

    # Sort specification
    sort_spec: List[Tuple[str, int]] = [("created_at", -1)]
    if sort == "price-low":
        sort_spec = [("asking_price_inr", 1), ("created_at", -1)]
    elif sort == "price-high":
        sort_spec = [("asking_price_inr", -1), ("created_at", -1)]
    elif sort == "rating":
        sort_spec = [("seller_info.rating", -1), ("created_at", -1)]
    elif sort == "views" or sort == "popular":
        sort_spec = [("views", -1), ("created_at", -1)]
    elif sort == "ai-score":
        sort_spec = [("valuation.circularity_score", -1), ("created_at", -1)]

    # Pagination bounds
    page = max(1, page)
    limit = max(1, min(100, limit))
    skip = (page - 1) * limit

    total = await db.marketplace_listings.count_documents(query)
    cursor = db.marketplace_listings.find(query).sort(sort_spec).skip(skip).limit(limit)
    raw_docs = await cursor.to_list(length=limit)

    total_pages = max(1, (total + limit - 1) // limit)
    items = [format_listing_document(d, current_user_id) for d in raw_docs]
    return items, total, total_pages


async def get_listing_by_id(
    db: AsyncDatabase,
    listing_id: str,
    current_user_id: Optional[ObjectId] = None,
    increment_view: bool = False,
) -> Dict[str, Any]:
    """Retrieves a single listing by ID with permission checks and view incrementing."""
    try:
        obj_id = ObjectId(listing_id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found."
        )

    doc = await db.marketplace_listings.find_one({"_id": obj_id})
    if not doc or doc.get("status") == ListingStatus.REMOVED.value:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found or has been removed."
        )

    is_owner = current_user_id is not None and str(doc["seller_id"]) == str(current_user_id)

    # If listing is not published, only the owner can view it
    if doc.get("status") != ListingStatus.PUBLISHED.value and not is_owner:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found."
        )

    # Increment view counter safely (only for published listings and when viewer is not the owner)
    if increment_view and doc.get("status") == ListingStatus.PUBLISHED.value and not is_owner:
        try:
            await db.marketplace_listings.update_one(
                {"_id": obj_id},
                {"$inc": {"views": 1}}
            )
            doc["views"] = doc.get("views", 0) + 1
        except Exception as e:
            logger.warning(f"Failed to increment view counter for listing {listing_id}: {e}")

    return format_listing_document(doc, current_user_id)


async def get_my_listings(
    db: AsyncDatabase,
    user_id: ObjectId,
    status_filter: Optional[str] = None,
    search: Optional[str] = None,
    page: int = 1,
    limit: int = 20,
) -> Tuple[List[Dict[str, Any]], int, int]:
    """Retrieves all listings created by the authenticated user."""
    query: Dict[str, Any] = {
        "seller_id": user_id,
        "status": {"$ne": ListingStatus.REMOVED.value}
    }

    if status_filter and status_filter.lower() != "all":
        st = status_filter.upper()
        if st in ("ACTIVE", "PUBLISHED"):
            query["status"] = ListingStatus.PUBLISHED.value
        elif st in ("PENDING", "DRAFT"):
            query["status"] = ListingStatus.DRAFT.value
        elif st in ("UNPUBLISHED", "PAUSED"):
            query["status"] = ListingStatus.UNPUBLISHED.value
        elif st == "SOLD":
            query["status"] = ListingStatus.SOLD.value

    if search and search.strip():
        q_term = search.strip()
        query["$or"] = [
            {"title": {"$regex": q_term, "$options": "i"}},
            {"brand": {"$regex": q_term, "$options": "i"}},
            {"model": {"$regex": q_term, "$options": "i"}},
            {"category": {"$regex": q_term, "$options": "i"}},
        ]

    page = max(1, page)
    limit = max(1, min(100, limit))
    skip = (page - 1) * limit

    total = await db.marketplace_listings.count_documents(query)
    cursor = db.marketplace_listings.find(query).sort([("created_at", -1)]).skip(skip).limit(limit)
    raw_docs = await cursor.to_list(length=limit)

    total_pages = max(1, (total + limit - 1) // limit)
    items = [format_listing_document(d, user_id) for d in raw_docs]
    return items, total, total_pages


async def update_marketplace_listing(
    db: AsyncDatabase,
    listing_id: str,
    user_id: ObjectId,
    payload: MarketplaceListingUpdate,
) -> Dict[str, Any]:
    """Updates an existing listing with strict ownership check (404 on IDOR)."""
    try:
        obj_id = ObjectId(listing_id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found."
        )

    doc = await db.marketplace_listings.find_one({"_id": obj_id, "seller_id": user_id})
    if not doc or doc.get("status") == ListingStatus.REMOVED.value:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found or does not belong to you."
        )

    update_fields: Dict[str, Any] = {"updated_at": datetime.now(timezone.utc)}

    if payload.title is not None:
        update_fields["title"] = payload.title.strip()
    if payload.description is not None:
        update_fields["description"] = payload.description.strip()
    if payload.category is not None:
        update_fields["category"] = payload.category.strip()
    if payload.brand is not None:
        update_fields["brand"] = payload.brand.strip()
    if payload.model is not None:
        update_fields["model"] = payload.model.strip()
    if payload.condition is not None:
        update_fields["condition"] = payload.condition.strip()
    if payload.functional_status is not None:
        update_fields["functional_status"] = payload.functional_status.strip()
    if payload.asking_price_inr is not None:
        update_fields["asking_price_inr"] = payload.asking_price_inr
    if payload.original_price_inr is not None:
        update_fields["original_price_inr"] = payload.original_price_inr
    if payload.warranty is not None:
        update_fields["warranty"] = payload.warranty.strip()
    if payload.return_policy is not None:
        update_fields["return_policy"] = payload.return_policy.strip()
    if payload.shipping_method is not None:
        update_fields["shipping_method"] = payload.shipping_method.strip()
    if payload.location is not None:
        update_fields["location"] = payload.location.strip()

    if payload.specifications is not None:
        update_fields["specifications"] = payload.specifications.model_dump()

    if payload.images is not None:
        if len(payload.images) > 8:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A maximum of 8 images are allowed per listing."
            )

        # 1. Detect removed Cloudinary public_ids and clean them up
        existing_images = doc.get("images", [])
        existing_public_ids = {img.get("public_id") for img in existing_images if img.get("public_id")}
        payload_public_ids = {img.public_id for img in payload.images if img.public_id}
        orphan_public_ids = list(existing_public_ids - payload_public_ids)
        if orphan_public_ids:
            cloudinary_service.delete_images(orphan_public_ids)

        # 2. Upload any new base64/data URI images to Cloudinary
        updated_stored_images: List[Dict[str, Any]] = []
        for idx, img in enumerate(payload.images):
            validate_image_item(img)
            if img.secure_url and img.public_id and not img.url.startswith("data:"):
                updated_stored_images.append(img.model_dump())
            else:
                uploaded = cloudinary_service.upload_marketplace_image(
                    image_data=img.url,
                    user_id=str(user_id),
                    listing_code=doc.get("listing_code", listing_id),
                    image_index=idx + 1,
                )
                updated_stored_images.append({
                    "url": uploaded["secure_url"],
                    "secure_url": uploaded["secure_url"],
                    "public_id": uploaded["public_id"],
                    "width": uploaded.get("width"),
                    "height": uploaded.get("height"),
                    "format": uploaded.get("format"),
                    "bytes": uploaded.get("bytes"),
                    "type": img.type or "standard",
                    "order": img.order if img.order is not None else idx,
                })

        update_fields["images"] = updated_stored_images

    await db.marketplace_listings.update_one(
        {"_id": obj_id},
        {"$set": update_fields}
    )

    updated_doc = await db.marketplace_listings.find_one({"_id": obj_id})
    return format_listing_document(updated_doc, user_id)


async def publish_marketplace_listing(
    db: AsyncDatabase,
    listing_id: str,
    user_id: ObjectId,
) -> Dict[str, Any]:
    """Publishes a draft or unpublished listing after validating complete information."""
    try:
        obj_id = ObjectId(listing_id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found."
        )

    doc = await db.marketplace_listings.find_one({"_id": obj_id, "seller_id": user_id})
    if not doc or doc.get("status") == ListingStatus.REMOVED.value:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found or does not belong to you."
        )

    # Validation: title, category, brand, model, description, condition, price, images
    errors = []
    if not doc.get("title") or len(doc["title"].strip()) < 3:
        errors.append("Title is required (min 3 chars).")
    if not doc.get("category"):
        errors.append("Category is required.")
    if not doc.get("brand"):
        errors.append("Brand is required.")
    if not doc.get("model"):
        errors.append("Model is required.")
    if not doc.get("description") or len(doc["description"].strip()) < 5:
        errors.append("Description is required (min 5 chars).")
    if not doc.get("condition"):
        errors.append("Condition grade is required.")
    if not doc.get("asking_price_inr") or doc["asking_price_inr"] <= 0:
        errors.append("A valid asking price in INR is required.")
    if not doc.get("images") or len(doc["images"]) == 0:
        errors.append("At least one product photograph is required.")

    if errors:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot publish incomplete listing: {'; '.join(errors)}"
        )

    now = datetime.now(timezone.utc)
    await db.marketplace_listings.update_one(
        {"_id": obj_id},
        {
            "$set": {
                "status": ListingStatus.PUBLISHED.value,
                "published_at": doc.get("published_at") or now,
                "updated_at": now,
            }
        }
    )

    updated_doc = await db.marketplace_listings.find_one({"_id": obj_id})
    logger.info(f"Published marketplace listing {doc.get('listing_code')} (id={obj_id}) by user {user_id}")
    return format_listing_document(updated_doc, user_id)


async def unpublish_marketplace_listing(
    db: AsyncDatabase,
    listing_id: str,
    user_id: ObjectId,
) -> Dict[str, Any]:
    """Transitions a listing from PUBLISHED to UNPUBLISHED (pause listing)."""
    try:
        obj_id = ObjectId(listing_id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found."
        )

    doc = await db.marketplace_listings.find_one({"_id": obj_id, "seller_id": user_id})
    if not doc or doc.get("status") == ListingStatus.REMOVED.value:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found or does not belong to you."
        )

    now = datetime.now(timezone.utc)
    await db.marketplace_listings.update_one(
        {"_id": obj_id},
        {
            "$set": {
                "status": ListingStatus.UNPUBLISHED.value,
                "updated_at": now,
            }
        }
    )

    updated_doc = await db.marketplace_listings.find_one({"_id": obj_id})
    logger.info(f"Unpublished marketplace listing {doc.get('listing_code')} (id={obj_id}) by user {user_id}")
    return format_listing_document(updated_doc, user_id)


async def mark_listing_sold(
    db: AsyncDatabase,
    listing_id: str,
    user_id: ObjectId,
) -> Dict[str, Any]:
    """Marks an active listing as SOLD."""
    try:
        obj_id = ObjectId(listing_id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found."
        )

    doc = await db.marketplace_listings.find_one({"_id": obj_id, "seller_id": user_id})
    if not doc or doc.get("status") == ListingStatus.REMOVED.value:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found or does not belong to you."
        )

    now = datetime.now(timezone.utc)
    await db.marketplace_listings.update_one(
        {"_id": obj_id},
        {
            "$set": {
                "status": ListingStatus.SOLD.value,
                "sold_at": now,
                "updated_at": now,
            }
        }
    )

    updated_doc = await db.marketplace_listings.find_one({"_id": obj_id})
    logger.info(f"Marked listing {doc.get('listing_code')} (id={obj_id}) as SOLD by user {user_id}")
    return format_listing_document(updated_doc, user_id)


async def delete_marketplace_listing(
    db: AsyncDatabase,
    listing_id: str,
    user_id: ObjectId,
) -> None:
    """Safely deletes an unsold listing belonging to the authenticated user and cleans up Cloudinary assets."""
    try:
        obj_id = ObjectId(listing_id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found."
        )

    doc = await db.marketplace_listings.find_one({"_id": obj_id, "seller_id": user_id})
    if not doc or doc.get("status") == ListingStatus.REMOVED.value:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found or does not belong to you."
        )

    if doc.get("status") == ListingStatus.SOLD.value:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete a listing that has already been marked as sold."
        )

    # Clean up associated Cloudinary image assets
    existing_images = doc.get("images", [])
    public_ids_to_delete = [img.get("public_id") for img in existing_images if img.get("public_id")]
    if public_ids_to_delete:
        cloudinary_service.delete_images(public_ids_to_delete)

    await db.marketplace_listings.update_one(
        {"_id": obj_id},
        {
            "$set": {
                "status": ListingStatus.REMOVED.value,
                "updated_at": datetime.now(timezone.utc),
            }
        }
    )
    logger.info(f"Deleted listing {doc.get('listing_code')} (id={obj_id}) and cleaned up {len(public_ids_to_delete)} Cloudinary asset(s) for user {user_id}")
