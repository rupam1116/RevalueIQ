import logging
import re
from typing import List, Dict, Any, Optional
from pymongo.asynchronous.database import AsyncDatabase

from app.schemas.repair_centers import RepairRecommendationRequest
from app.services.repair_center_providers import get_repair_provider
from app.services.repair_center_service import sync_and_cache_provider_places
from app.services.google_places_service import (
    calculate_haversine_distance,
    build_targeted_search_query,
)

logger = logging.getLogger("revalueiq.services.repair_recommendation")


def _normalize_terms(text: Optional[str]) -> List[str]:
    """Helper to tokenize and normalize strings for fuzzy capability matching."""
    if not text:
        return []
    cleaned = re.sub(r"[^\w\s]", " ", text.lower())
    return [term for term in cleaned.split() if len(term) > 2]


def _match_problem_to_services(problem_text: str, center_services: List[str]) -> List[str]:
    """
    Identifies which repair services offered by the center match the user's reported problem.
    """
    if not problem_text:
        return []

    prob_lower = problem_text.lower()
    matched = []

    keyword_map = {
        "screen": ["screen", "display", "glass", "oled", "amoled", "touch", "cracked"],
        "battery": ["battery", "drain", "charge", "power", "backup", "degradation"],
        "water": ["water", "liquid", "spill", "corrosion", "moisture", "submerged"],
        "motherboard": ["motherboard", "logic board", "chip", "bga", "soldering", "dead", "power rail"],
        "charging": ["charging", "port", "usb-c", "lightning", "connector", "jack"],
        "camera": ["camera", "sensor", "lens", "faced", "blur"],
        "keyboard": ["keyboard", "keys", "typing", "touchpad", "trackpad"],
        "audio": ["speaker", "audio", "mic", "earpiece", "sound", "volume"],
        "thermal": ["fan", "heating", "thermal", "overheat", "paste"],
        "hinge": ["hinge", "body", "fabrication", "frame"]
    }

    for srv in center_services:
        srv_lower = srv.lower()
        # Direct substring match
        if any(w in srv_lower for w in _normalize_terms(prob_lower)):
            matched.append(srv)
            continue

        # Topic association match
        for key, aliases in keyword_map.items():
            if any(alias in prob_lower for alias in aliases) and any(alias in srv_lower for alias in aliases):
                if srv not in matched:
                    matched.append(srv)

    return matched


async def get_repair_recommendations(
    db: AsyncDatabase,
    request: RepairRecommendationRequest,
    provider_name: Optional[str] = None
) -> List[Dict[str, Any]]:
    """
    Recommends and ranks real verified repair centers using a multi-factor capability-first algorithm.
    """
    provider = get_repair_provider(provider_name)

    device = request.device or None
    repair = request.repair or None
    location = request.location or None

    user_lat = location.latitude if location else None
    user_lng = location.longitude if location else None
    user_city = location.city if location else None
    user_area = location.area if location else None
    user_postal = location.postal_code if location else None
    max_radius = location.radius_km if location and location.radius_km else 50.0

    target_brand = (device.brand or "").strip() if device else ""
    target_category = (device.category or "").strip() if device else ""
    target_model = (device.model or "").strip() if device else ""
    target_problem = (repair.problem or "").strip() if repair else ""
    target_action = (repair.recommended_action or "").strip() if repair else ""

    # 1. Geocode location if text provided without GPS coordinates
    location_text = " ".join([p for p in [user_area, user_city, user_postal] if p and p.strip() and p.lower() != "all"]).strip()
    if (user_lat is None or user_lng is None) and location_text:
        geo_result = await provider.geocode(location_text)
        if geo_result:
            user_lat = geo_result.get("latitude")
            user_lng = geo_result.get("longitude")

    # 2. Build targeted search query for device + problem
    query_str = build_targeted_search_query(
        brand=target_brand,
        model=target_model,
        category=target_category,
        problem=target_problem,
        city=user_city,
        area=user_area,
        postal_code=user_postal
    )

    # 3. Live search on active provider (OSM or Google) and sync into MongoDB cache
    radius_meters = int(max_radius * 1000)
    try:
        raw_places = await provider.search_places(
            query=query_str,
            latitude=user_lat,
            longitude=user_lng,
            radius_meters=radius_meters
        )
        if raw_places:
            normalized_items = []
            for p in raw_places[:15]:
                place_id = p.get("place_id") or p.get("id")
                details = None
                if place_id:
                    details = await provider.get_place_details(str(place_id))
                norm = provider.normalize_place(
                    raw_place=p,
                    details=details,
                    target_brand=target_brand,
                    target_category=target_category,
                    target_repair=target_problem
                )
                normalized_items.append(norm)

            await sync_and_cache_provider_places(db, normalized_items)
    except Exception as exc:
        logger.warning(f"Provider ({provider.provider_name}) recommendation search notice: {exc}")

    # 4. Fetch candidates from MongoDB cache
    db_query: Dict[str, Any] = {"is_active": True}
    cursor = db.repair_centers.find(db_query)
    centers = await cursor.to_list(length=300)

    scored_centers = []

    for center in centers:
        center_id = str(center["_id"])
        c_lat = center.get("latitude")
        c_lng = center.get("longitude")
        c_brands = center.get("brand_services", [])
        c_categories = center.get("device_categories", [])
        c_services = center.get("repair_services", [])
        is_auth = center.get("is_authorized", False)
        is_ver = center.get("is_verified", True)
        rating = float(center.get("rating", 4.0))

        # Calculate distance
        dist_km = None
        if user_lat is not None and user_lng is not None and c_lat is not None and c_lng is not None:
            try:
                dist_km = calculate_haversine_distance(user_lat, user_lng, float(c_lat), float(c_lng))
            except Exception:
                dist_km = None

        # Filter out if beyond specified radius
        if max_radius and dist_km is not None and dist_km > max_radius:
            continue

        # 1. Capability Matching (Weight: 35 points)
        matched_services = _match_problem_to_services(target_problem, c_services)
        service_score = 0.0
        if matched_services:
            service_score = min(35.0, 20.0 + (len(matched_services) * 7.5))
        elif not target_problem:
            service_score = 20.0
        else:
            if any("diagnostic" in s.lower() or "repair" in s.lower() for s in c_services):
                service_score = 10.0

        # 2. Brand Matching & Authorization (Weight: 30 points)
        brand_score = 0.0
        matched_brands = []
        if target_brand:
            brand_lower = target_brand.lower()
            for b in c_brands:
                if b.lower() in brand_lower or brand_lower in b.lower():
                    matched_brands.append(b)
            if matched_brands:
                brand_score = 30.0 if is_auth else 22.0
            else:
                if len(c_brands) >= 4 or "Multi-Brand" in c_brands:
                    brand_score = 14.0
        else:
            brand_score = 20.0

        # 3. Device Category Compatibility (Weight: 15 points)
        category_score = 0.0
        if target_category:
            cat_lower = target_category.lower()
            if any(c.lower() in cat_lower or cat_lower in c.lower() for c in c_categories):
                category_score = 15.0
        else:
            category_score = 10.0

        # 4. Proximity Score (Weight: 10 points)
        proximity_score = 0.0
        if dist_km is not None:
            if dist_km <= 3.0:
                proximity_score = 10.0
            elif dist_km <= 7.0:
                proximity_score = 8.0
            elif dist_km <= 15.0:
                proximity_score = 6.0
            elif dist_km <= 30.0:
                proximity_score = 4.0
            else:
                proximity_score = 2.0
        else:
            proximity_score = 5.0

        # 5. Quality, Verification & Rating (Weight: 10 points)
        quality_score = (rating / 5.0) * 7.0 + (3.0 if is_ver else 0.0)

        # Total Match Score out of 100
        total_score = round(service_score + brand_score + category_score + proximity_score + quality_score, 1)

        # Build informative rationale
        reasons = []
        if is_auth and matched_brands:
            reasons.append(f"Official OEM Authorized Center for {target_brand or matched_brands[0]}")
        elif matched_brands:
            reasons.append(f"Specialized in {matched_brands[0]} servicing")

        if matched_services:
            reasons.append(f"Direct capability for {', '.join(matched_services[:2])}")

        if dist_km is not None and dist_km <= 5.0:
            reasons.append(f"Within {dist_km} km of your location")

        if rating >= 4.7:
            reasons.append(f"Top-rated ({rating}★ from {center.get('review_count', 0)} reviews)")

        reason_text = " • ".join(reasons) if reasons else "Verified electronics repair partner"

        item = dict(center)
        item["id"] = center_id
        item["distance_km"] = dist_km
        item["match_score"] = total_score
        item["matched_services"] = matched_services
        item["matched_brands"] = matched_brands
        item["is_authorized"] = is_auth
        item["recommendation_reason"] = reason_text
        item.pop("_id", None)
        item.pop("location", None)

        scored_centers.append(item)

    # Sort primarily by match_score descending, and secondarily by distance ascending
    scored_centers.sort(
        key=lambda x: (
            -x.get("match_score", 0),
            x.get("distance_km") if x.get("distance_km") is not None else 99999,
            -x.get("rating", 0)
        )
    )

    return scored_centers
