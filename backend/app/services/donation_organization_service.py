import logging
import math
from typing import List, Optional, Tuple, Dict, Any
from bson import ObjectId
from pymongo.asynchronous.database import AsyncDatabase

from app.services.donation_organization_providers import get_donation_provider

logger = logging.getLogger("revalueiq.services.donation_organization")


def calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculates great-circle distance between two GPS coordinates in kilometers.
    """
    r = 6371.0  # Earth's radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2.0) ** 2
        + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2.0) ** 2
    )
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return round(r * c, 2)


async def sync_and_cache_donation_organizations(
    db: AsyncDatabase,
    normalized_orgs: List[Dict[str, Any]]
) -> List[Dict[str, Any]]:
    """
    Upserts normalized provider organizations into MongoDB donation_organizations cache.
    """
    cached_items = []
    for org in normalized_orgs:
        provider_id = org.get("provider_organization_id")
        if not provider_id:
            continue

        # Include GeoJSON Point for 2dsphere spatial index
        lat = org.get("latitude", 0.0)
        lng = org.get("longitude", 0.0)
        org["location"] = {
            "type": "Point",
            "coordinates": [lng, lat]
        }

        query = {"provider_organization_id": provider_id}

        try:
            await db.donation_organizations.update_one(
                query,
                {"$set": org},
                upsert=True
            )
            doc = await db.donation_organizations.find_one(query)
            if doc:
                doc["id"] = str(doc["_id"])
                doc.pop("_id", None)
                cached_items.append(doc)
        except Exception as exc:
            logger.warning(f"Error caching organization {provider_id}: {exc}")
            org["id"] = provider_id
            cached_items.append(org)

    return cached_items


async def list_donation_organizations(
    db: AsyncDatabase,
    search: Optional[str] = None,
    category: Optional[str] = None,
    donation_type: Optional[str] = None,
    city: Optional[str] = None,
    area: Optional[str] = None,
    postal_code: Optional[str] = None,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    radius_km: Optional[float] = None,
    page: int = 1,
    limit: int = 20,
    provider_name: Optional[str] = None
) -> Tuple[List[Dict[str, Any]], int, Optional[str], str]:
    """
    Discovers real donation organizations using active provider (OSM) and MongoDB cache.
    """
    provider = get_donation_provider(provider_name)
    effective_lat = latitude
    effective_lng = longitude

    # 1. Geocode location text if coordinates not supplied
    location_text = " ".join([p for p in [area, city, postal_code] if p and p.strip() and p.lower() != "all"]).strip()
    if (effective_lat is None or effective_lng is None) and location_text:
        geo_result = await provider.geocode(location_text)
        if geo_result:
            effective_lat = geo_result.get("latitude")
            effective_lng = geo_result.get("longitude")
            if not city and geo_result.get("city"):
                city = geo_result.get("city")

    # If user provided a search query that looks like a location (e.g. "Hyderabad", "Madhapur", "500081")
    if (effective_lat is None or effective_lng is None) and search and search.strip():
        geo_result = await provider.geocode(search.strip())
        if geo_result:
            effective_lat = geo_result.get("latitude")
            effective_lng = geo_result.get("longitude")

    # 2. Discover live organizations via active provider and cache in MongoDB
    radius_meters = int((radius_km or 25.0) * 1000)
    if effective_lat is not None and effective_lng is not None:
        try:
            raw_places = await provider.search_organizations(
                query=search,
                category=category,
                donation_type=donation_type,
                latitude=effective_lat,
                longitude=effective_lng,
                radius_meters=radius_meters
            )
            if raw_places:
                normalized_items = []
                for p in raw_places[:35]:
                    norm = provider.normalize_organization(
                        raw_place=p,
                        details=None,
                        target_category=category,
                        target_donation_type=donation_type,
                        city_hint=city
                    )
                    normalized_items.append(norm)

                if normalized_items:
                    await sync_and_cache_donation_organizations(db, normalized_items)
        except Exception as exc:
            logger.error(f"Live provider search error: {exc}")

    # 3. Query MongoDB cache with filters
    db_query: Dict[str, Any] = {}

    if category and category != "All Categories":
        db_query["category"] = category

    if donation_type and donation_type.strip() and donation_type.lower() != "all":
        # Match confirmed accepted donation types
        db_query["accepted_donation_types"] = {"$regex": donation_type.strip(), "$options": "i"}

    # If coordinates are not resolved, use text matching for city
    if effective_lat is None and city and city.strip() and city.lower() != "all":
        db_query["$or"] = [
            {"city": {"$regex": city.strip(), "$options": "i"}},
            {"address": {"$regex": city.strip(), "$options": "i"}}
        ]

    if postal_code and postal_code.strip():
        db_query["postal_code"] = postal_code.strip()

    if search and search.strip():
        clean_search = search.strip()
        search_clauses = [
            {"name": {"$regex": clean_search, "$options": "i"}},
            {"address": {"$regex": clean_search, "$options": "i"}},
            {"category": {"$regex": clean_search, "$options": "i"}}
        ]
        if "$or" in db_query:
            db_query["$and"] = [{"$or": db_query.pop("$or")}, {"$or": search_clauses}]
        else:
            db_query["$or"] = search_clauses

    # Fetch matching documents
    cursor = db.donation_organizations.find(db_query)
    all_matching = await cursor.to_list(length=150)

    # 4. Format, compute distance, and paginate
    formatted_items = []
    for doc in all_matching:
        item = dict(doc)
        item["id"] = str(item.get("_id", item.get("provider_organization_id", "")))
        item.pop("_id", None)
        item.pop("location", None)

        # Distance calculation
        item_lat = item.get("latitude")
        item_lng = item.get("longitude")
        if effective_lat is not None and effective_lng is not None and item_lat and item_lng:
            dist = calculate_haversine_distance(effective_lat, effective_lng, float(item_lat), float(item_lng))
            item["distance_km"] = dist
        else:
            item["distance_km"] = None

        formatted_items.append(item)

    # Sort by distance if coordinates available
    if effective_lat is not None and effective_lng is not None:
        formatted_items.sort(key=lambda x: (x.get("distance_km") is None, x.get("distance_km") or 999999))

    total = len(formatted_items)
    skip = (page - 1) * limit
    paged_items = formatted_items[skip : skip + limit]

    query_used = f"category={category or 'All'}, loc={location_text or search or 'None'}"
    return paged_items, total, query_used, provider.provider_name


async def get_donation_organization_by_id(
    db: AsyncDatabase,
    org_id: str
) -> Optional[Dict[str, Any]]:
    """
    Retrieves a single donation organization by MongoDB ObjectId or provider ID.
    """
    doc = None
    if ObjectId.is_valid(org_id):
        doc = await db.donation_organizations.find_one({"_id": ObjectId(org_id)})

    if not doc:
        doc = await db.donation_organizations.find_one({"provider_organization_id": org_id})

    if not doc:
        return None

    item = dict(doc)
    item["id"] = str(item.get("_id", item.get("provider_organization_id", "")))
    item.pop("_id", None)
    item.pop("location", None)
    return item


async def get_donation_driving_route(
    lat1: float,
    lon1: float,
    lat2: float,
    lon2: float,
    provider_name: Optional[str] = None
) -> Optional[Dict[str, Any]]:
    """
    Computes driving directions from coordinates (lat1, lon1) to (lat2, lon2).
    """
    provider = get_donation_provider(provider_name)
    return await provider.get_directions(lat1, lon1, lat2, lon2)


async def get_donation_recommendations(
    db: AsyncDatabase,
    request: Any,
    provider_name: Optional[str] = None
) -> List[Dict[str, Any]]:
    """
    Recommendation Engine: Ranks genuine donation organizations based on device category compatibility,
    donation purpose, verified capabilities, and geographical proximity.
    """
    device = getattr(request, "device", None)
    donation = getattr(request, "donation", None)
    location = getattr(request, "location", None)

    dev_category = (getattr(device, "category", "") or "").lower()
    dev_brand = (getattr(device, "brand", "") or "").strip()
    dev_model = (getattr(device, "model", "") or "").strip()
    dev_condition = (getattr(device, "condition", "") or "").lower()

    # Determine recommended donation purpose based on device status
    is_severe_damage = any(k in dev_condition for k in ["heavy", "broken", "scrap", "damage", "faulty", "dead"])
    if is_severe_damage:
        donation_purpose = "Safe E-Waste Recycling / Metals Recovery"
    elif "laptop" in dev_category or "computer" in dev_category or "macbook" in dev_model.lower():
        donation_purpose = "Digital Literacy / Community STEM Labs"
    elif "phone" in dev_category or "smartphone" in dev_category or "tablet" in dev_category:
        donation_purpose = "Digital Inclusion / Student Connectivity"
    else:
        donation_purpose = "Community Reuse / Equipment Empowerment"

    # Search candidates across all categories
    items, total, _, active_provider = await list_donation_organizations(
        db,
        search=None,
        category="All Categories",
        donation_type=None,
        city=getattr(location, "city", None),
        area=getattr(location, "area", None),
        postal_code=getattr(location, "postal_code", None),
        latitude=getattr(location, "latitude", None),
        longitude=getattr(location, "longitude", None),
        radius_km=getattr(location, "radius_km", 50.0),
        page=1,
        limit=50,
        provider_name=provider_name
    )

    scored_items = []
    for item in items:
        org_cat = item.get("category", "")
        dist = item.get("distance_km")

        # Base score
        score = 50.0

        # 1. Purpose & Category alignment
        if is_severe_damage:
            if org_cat in ["E-Waste Recyclers", "Government Collection"]:
                score += 35.0
                reason = "Recommended for certified e-waste dismantling and non-toxic metals recovery."
            else:
                score += 5.0
                reason = "Community organization in your area. Contact first to confirm scrap intake."
        elif "laptop" in dev_category or "computer" in dev_category:
            if org_cat in ["Digital Literacy", "Rural Schools", "Education"]:
                score += 35.0
                reason = "Prioritized for computer lab refurbishment & educational empowerment."
            elif org_cat in ["Orphanages", "NGOs"]:
                score += 25.0
                reason = "Youth care or community non-profit suited for working computers."
            else:
                score += 15.0
                reason = "Recycling or public collection partner."
        elif "phone" in dev_category or "smartphone" in dev_category or "tablet" in dev_category:
            if org_cat in ["Digital Literacy", "Education", "Orphanages"]:
                score += 30.0
                reason = "Recommended for student digital access & remote learning."
            elif org_cat == "NGOs":
                score += 25.0
                reason = "Non-profit organization active in community outreach."
            else:
                score += 15.0
                reason = "Certified facility for electronics recycling."
        else:
            score += 20.0
            reason = "Recommended circular drop-off center in your region."

        # 2. Confirmed Acceptance Bonus
        if item.get("donation_acceptance_confirmed"):
            score += 15.0

        # 3. Verified Partner Bonus
        if item.get("is_verified"):
            score += 10.0

        # 4. Proximity weighting
        if dist is not None:
            prox_score = max(0.0, 15.0 - (dist * 0.5))
            score += prox_score

        item["recommendation_score"] = round(min(score, 100.0), 1)
        item["recommendation_reason"] = reason
        item["donation_purpose"] = donation_purpose
        scored_items.append(item)

    # Sort descending by recommendation score
    scored_items.sort(key=lambda x: x.get("recommendation_score", 0.0), reverse=True)
    return scored_items
