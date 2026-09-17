import logging
import math
import re
from typing import List, Optional, Tuple, Dict, Any
from bson import ObjectId
from pymongo.asynchronous.database import AsyncDatabase

from app.services.repair_center_providers import get_repair_provider
from app.services.google_places_service import (
    calculate_haversine_distance,
    build_targeted_search_query,
)

logger = logging.getLogger("revalueiq.services.repair_center")


async def sync_and_cache_provider_places(
    db: AsyncDatabase,
    normalized_places: List[Dict[str, Any]]
) -> List[Dict[str, Any]]:
    """
    Upserts normalized provider places (OSM or Google) into MongoDB cache.
    """
    cached_items = []
    for place in normalized_places:
        conditions = []
        if place.get("provider_place_id"):
            conditions.append({"provider_place_id": place["provider_place_id"]})
        if place.get("google_place_id"):
            conditions.append({"google_place_id": place["google_place_id"]})

        if not conditions:
            continue

        query = {"$or": conditions} if len(conditions) > 1 else conditions[0]

        try:
            await db.repair_centers.update_one(
                query,
                {"$set": place},
                upsert=True
            )
            doc = await db.repair_centers.find_one(query)
            if doc:
                doc["id"] = str(doc["_id"])
                doc.pop("_id", None)
                cached_items.append(doc)
        except Exception as exc:
            prov_id = place.get("provider_place_id") or place.get("google_place_id") or "unknown"
            logger.warning(f"Error caching place {prov_id}: {exc}")
            place["id"] = prov_id
            cached_items.append(place)

    return cached_items


async def list_repair_centers(
    db: AsyncDatabase,
    search: Optional[str] = None,
    brand: Optional[str] = None,
    category: Optional[str] = None,
    repair_type: Optional[str] = None,
    city: Optional[str] = None,
    area: Optional[str] = None,
    postal_code: Optional[str] = None,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    radius_km: Optional[float] = None,
    verified_only: bool = False,
    page: int = 1,
    limit: int = 20,
    provider_name: Optional[str] = None
) -> Tuple[List[Dict[str, Any]], int, Optional[str], str]:
    """
    Discovers real repair centers using active provider (OSM / Google) and MongoDB cache.
    """
    provider = get_repair_provider(provider_name)
    effective_lat = latitude
    effective_lng = longitude

    # 1. Geocode search text if coordinates not supplied
    location_text = " ".join([p for p in [area, city, postal_code] if p and p.strip() and p.lower() != "all"]).strip()
    if (effective_lat is None or effective_lng is None) and location_text:
        geo_result = await provider.geocode(location_text)
        if geo_result:
            effective_lat = geo_result.get("latitude")
            effective_lng = geo_result.get("longitude")

    # 2. Build targeted search query
    query_str = build_targeted_search_query(
        brand=brand,
        category=category,
        repair_type=repair_type,
        city=city,
        area=area,
        postal_code=postal_code,
        search=search
    )

    # 3. Discover live places via active provider and cache in MongoDB
    radius_meters = int((radius_km or 25.0) * 1000)
    try:
        raw_places = await provider.search_places(
            query=query_str,
            latitude=effective_lat,
            longitude=effective_lng,
            radius_meters=radius_meters
        )
        if raw_places:
            normalized_items = []
            for p in raw_places[:15]:
                details = None
                place_id = p.get("place_id") or p.get("id")
                if place_id:
                    details = await provider.get_place_details(str(place_id))
                norm = provider.normalize_place(
                    raw_place=p,
                    details=details,
                    target_brand=brand,
                    target_category=category,
                    target_repair=repair_type
                )
                normalized_items.append(norm)

            await sync_and_cache_provider_places(db, normalized_items)
    except Exception as exc:
        logger.warning(f"Live provider ({provider.provider_name}) search notice for '{query_str}': {exc}")

    # 4. Query MongoDB cache
    db_query: Dict[str, Any] = {"is_active": True}

    if verified_only:
        db_query["is_verified"] = True

    if brand and brand.strip() and brand.lower() != "all":
        safe_brand = re.escape(brand.strip())
        db_query["brand_services"] = {"$regex": f"^{safe_brand}$", "$options": "i"}

    if category and category.strip() and category.lower() != "all":
        safe_cat = re.escape(category.strip())
        db_query["device_categories"] = {"$regex": f"^{safe_cat}$", "$options": "i"}

    if repair_type and repair_type.strip() and repair_type.lower() != "all":
        safe_repair = re.escape(repair_type.strip())
        db_query["repair_services"] = {"$regex": safe_repair, "$options": "i"}

    if city and city.strip() and city.lower() != "all":
        city_regex = {"$regex": re.escape(city.strip()), "$options": "i"}
        db_query["$or"] = [
            {"city": city_regex},
            {"address": city_regex}
        ]

    if area and area.strip():
        db_query["address"] = {"$regex": re.escape(area.strip()), "$options": "i"}

    if postal_code and postal_code.strip():
        safe_postal = re.escape(postal_code.strip())
        db_query["$or"] = [
            {"postal_code": {"$regex": safe_postal, "$options": "i"}},
            {"address": {"$regex": safe_postal, "$options": "i"}}
        ]

    if search and search.strip():
        search_regex = {"$regex": re.escape(search.strip()), "$options": "i"}
        db_query["$or"] = [
            {"name": search_regex},
            {"address": search_regex},
            {"brand_services": search_regex},
            {"repair_services": search_regex}
        ]

    cursor = db.repair_centers.find(db_query)
    results = await cursor.to_list(length=200)

    # 5. Compute distance and sort
    has_coords = effective_lat is not None and effective_lng is not None
    processed_items = []
    for item in results:
        center_id = str(item["_id"])
        c_lat = item.get("latitude")
        c_lng = item.get("longitude")
        dist = None
        if has_coords and c_lat is not None and c_lng is not None:
            try:
                dist = calculate_haversine_distance(effective_lat, effective_lng, float(c_lat), float(c_lng))
            except Exception:
                dist = None

        if radius_km and dist is not None and dist > radius_km:
            continue

        item["id"] = center_id
        item["distance_km"] = dist
        item.pop("_id", None)
        item.pop("location", None)
        processed_items.append(item)

    if has_coords:
        processed_items.sort(key=lambda x: (x["distance_km"] if x["distance_km"] is not None else 99999, -x.get("rating", 0)))
    else:
        processed_items.sort(key=lambda x: (-x.get("rating", 0), -x.get("review_count", 0)))

    total = len(processed_items)
    start_idx = (page - 1) * limit
    paged_items = processed_items[start_idx:start_idx + limit]

    return paged_items, total, query_str, provider.provider_name


async def get_repair_center_by_id(
    db: AsyncDatabase,
    center_id: str,
    provider_name: Optional[str] = None
) -> Optional[Dict[str, Any]]:
    """
    Fetches detailed repair center record by MongoDB ID, provider_place_id, or google_place_id.
    """
    query: Dict[str, Any] = {}
    if ObjectId.is_valid(center_id):
        query["_id"] = ObjectId(center_id)
    else:
        query["$or"] = [
            {"provider_place_id": center_id},
            {"google_place_id": center_id},
            {"id": center_id}
        ]

    doc = await db.repair_centers.find_one(query)
    if not doc and not ObjectId.is_valid(center_id):
        provider = get_repair_provider(provider_name)
        details = await provider.get_place_details(center_id)
        if details:
            normalized = provider.normalize_place(details, details)
            cached = await sync_and_cache_provider_places(db, [normalized])
            if cached:
                return cached[0]

    if not doc:
        return None

    doc["id"] = str(doc["_id"])
    doc.pop("_id", None)
    doc.pop("location", None)
    return doc


async def get_driving_route(
    lat1: float,
    lon1: float,
    lat2: float,
    lon2: float,
    provider_name: Optional[str] = None
) -> Optional[Dict[str, Any]]:
    """
    Calculates driving directions, distance, duration, and geojson polyline using active provider.
    """
    provider = get_repair_provider(provider_name)
    return await provider.get_directions(lat1, lon1, lat2, lon2)
