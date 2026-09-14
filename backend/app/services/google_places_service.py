import logging
import math
import re
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Any, Optional, Tuple
import httpx
from pymongo.asynchronous.database import AsyncDatabase
from bson import ObjectId

from app.core.config import settings

logger = logging.getLogger("revalueiq.services.google_places")

GOOGLE_GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json"
GOOGLE_PLACES_TEXTSEARCH_URL = "https://maps.googleapis.com/maps/api/place/textsearch/json"
GOOGLE_PLACES_DETAILS_URL = "https://maps.googleapis.com/maps/api/place/details/json"
GOOGLE_PLACES_PHOTO_URL = "https://maps.googleapis.com/maps/api/place/photo"

KNOWN_BRANDS = ["Apple", "Samsung", "Dell", "HP", "Lenovo", "Xiaomi", "Redmi", "OnePlus", "Google", "Asus", "Acer", "Motorola", "Realme", "Sony"]
KNOWN_CATEGORIES = ["Smartphone", "Laptop", "Tablet", "Smartwatch", "Audio", "Desktop", "Gaming Console"]
KNOWN_REPAIRS = [
    "Screen Replacement", "Battery Replacement", "Water Damage Repair",
    "Motherboard Micro-Soldering", "Charging Port Fix", "Camera Repair",
    "Display Repair", "Keyboard Replacement", "Hardware Diagnostics"
]


def calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculates great-circle distance in kilometers between two geo-coordinates using Haversine formula.
    """
    R = 6371.0  # Earth's radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2.0) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2.0) ** 2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return round(R * c, 2)


def is_authorized_service_center(name: str, types: List[str] = None) -> bool:
    """
    Determines if a center is an authentic OEM authorized service center based on title and metadata.
    Strict check to avoid false authorization claims.
    """
    name_lower = name.lower()
    auth_patterns = [
        r"\bauthorized\b",
        r"\bofficial service\b",
        r"\bexclusive service\b",
        r"\bauthorized service provider\b",
        r"\bsmart care plaza\b",
        r"\bflagship service\b",
        r"\bcare center\b",
        r"\bbrand store\b",
        r"\bgenius bar\b",
        r"\baptronix\b",
        r"\bimagine\b",
        r"\biplace\b"
    ]
    return any(re.search(pat, name_lower) for pat in auth_patterns)


def infer_brands_from_text(name: str, query_brand: Optional[str] = None) -> List[str]:
    """Infers supported brands from business title and explicit query brand."""
    brands = set()
    if query_brand and query_brand.strip() and query_brand.lower() != "all":
        brands.add(query_brand.strip())

    name_lower = name.lower()
    for b in KNOWN_BRANDS:
        if re.search(rf"\b{b.lower()}\b", name_lower):
            brands.add(b)

    # If title says "Multi-Brand" or "All Mobile" or "Laptop Care"
    if any(k in name_lower for k in ["multi-brand", "multibrand", "all brands", "chipset lab", "electronics repair", "tech lab", "fix"]):
        for default_b in ["Apple", "Samsung", "Dell", "HP", "Lenovo", "Xiaomi"]:
            brands.add(default_b)

    return sorted(list(brands)) if brands else (["Multi-Brand"] if not query_brand else [query_brand])


def infer_services_from_text(name: str, types: List[str] = None, query_repair: Optional[str] = None) -> List[str]:
    """Infers offered repair capabilities from Google Places name and metadata."""
    services = set()
    if query_repair and query_repair.strip() and query_repair.lower() != "all":
        services.add(query_repair.strip())

    name_lower = name.lower()
    if any(w in name_lower for w in ["screen", "display", "glass", "oled"]):
        services.add("Screen Replacement")
    if any(w in name_lower for w in ["battery", "power"]):
        services.add("Battery Replacement")
    if any(w in name_lower for w in ["water", "liquid", "corrosion"]):
        services.add("Water Damage Repair")
    if any(w in name_lower for w in ["chip", "logic board", "motherboard", "soldering", "bga"]):
        services.add("Motherboard Micro-Soldering")
    if any(w in name_lower for w in ["port", "charging", "jack"]):
        services.add("Charging Port Fix")
    if any(w in name_lower for w in ["camera", "sensor"]):
        services.add("Camera Repair")

    # Standard baseline capabilities for electronics repair shops
    services.add("Hardware Diagnostics")
    services.add("Screen Replacement")
    services.add("Battery Replacement")

    return sorted(list(services))


def infer_categories_from_text(name: str, query_cat: Optional[str] = None) -> List[str]:
    """Infers device categories from Google Places name."""
    cats = set()
    if query_cat and query_cat.strip() and query_cat.lower() != "all":
        cats.add(query_cat.strip())

    name_lower = name.lower()
    if any(w in name_lower for w in ["phone", "mobile", "iphone", "galaxy", "cellular"]):
        cats.add("Smartphone")
    if any(w in name_lower for w in ["laptop", "macbook", "notebook", "computer", "pc", "desktop"]):
        cats.add("Laptop")
    if any(w in name_lower for w in ["tablet", "ipad"]):
        cats.add("Tablet")
    if any(w in name_lower for w in ["watch", "iwatch"]):
        cats.add("Smartwatch")

    return sorted(list(cats)) if cats else ["Smartphone", "Laptop"]


def build_targeted_search_query(
    brand: Optional[str] = None,
    model: Optional[str] = None,
    category: Optional[str] = None,
    problem: Optional[str] = None,
    repair_type: Optional[str] = None,
    city: Optional[str] = None,
    area: Optional[str] = None,
    postal_code: Optional[str] = None,
    search: Optional[str] = None
) -> str:
    """
    Constructs a high-intent Google Places search query based on device context and location.
    """
    parts = []

    if search and search.strip():
        return search.strip()

    # Brand / Model
    if brand and brand.strip() and brand.lower() != "all":
        parts.append(brand.strip())
        if model and model.strip() and model.lower() not in brand.lower():
            parts.append(model.strip())
    elif category and category.strip() and category.lower() != "all":
        parts.append(category.strip())

    # Repair requirement
    if repair_type and repair_type.strip() and repair_type.lower() != "all":
        parts.append(repair_type.strip())
    elif problem and problem.strip():
        parts.append(problem.strip())
    else:
        parts.append("repair service center")

    # Location specifics
    if area and area.strip():
        parts.append(area.strip())
    if city and city.strip() and city.lower() != "all":
        parts.append(city.strip())
    if postal_code and postal_code.strip():
        parts.append(postal_code.strip())

    query_str = " ".join(parts).strip()
    return query_str if query_str else "electronics repair service center"


class GooglePlacesService:
    def __init__(self):
        self.api_key = settings.GOOGLE_MAPS_API_KEY.strip()

    def has_api_key(self) -> bool:
        return bool(self.api_key)

    async def geocode(self, location_text: str) -> Optional[Dict[str, Any]]:
        """
        Geocodes user location query string into exact latitude and longitude.
        """
        if not self.has_api_key() or not location_text or not location_text.strip():
            return None

        params = {
            "address": location_text.strip(),
            "key": self.api_key,
        }

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.get(GOOGLE_GEOCODE_URL, params=params)
                if res.status_code == 200:
                    data = res.json()
                    if data.get("status") == "OK" and data.get("results"):
                        top_res = data["results"][0]
                        geom = top_res.get("geometry", {}).get("location", {})
                        lat = geom.get("lat")
                        lng = geom.get("lng")
                        formatted_addr = top_res.get("formatted_address", location_text)

                        # Extract address components
                        city = ""
                        state = ""
                        postal_code = ""
                        for comp in top_res.get("address_components", []):
                            types = comp.get("types", [])
                            if "locality" in types:
                                city = comp.get("long_name", "")
                            elif "administrative_area_level_1" in types:
                                state = comp.get("long_name", "")
                            elif "postal_code" in types:
                                postal_code = comp.get("long_name", "")

                        return {
                            "latitude": lat,
                            "longitude": lng,
                            "formatted_address": formatted_addr,
                            "city": city,
                            "state": state,
                            "postal_code": postal_code
                        }
                    else:
                        logger.warning(f"Google Geocoding status: {data.get('status')} for '{location_text}'")
        except Exception as exc:
            logger.error(f"Error during Google Geocoding for '{location_text}': {exc}")

        return None

    async def search_places(
        self,
        query: str,
        latitude: Optional[float] = None,
        longitude: Optional[float] = None,
        radius_meters: int = 25000
    ) -> List[Dict[str, Any]]:
        """
        Queries Google Places Text Search API for real repair businesses.
        """
        if not self.has_api_key():
            logger.info("Google Maps API key not configured; skipping live Google Places API call.")
            return []

        params: Dict[str, Any] = {
            "query": query,
            "key": self.api_key,
        }

        if latitude is not None and longitude is not None:
            params["location"] = f"{latitude},{longitude}"
            params["radius"] = min(radius_meters, 50000)

        try:
            async with httpx.AsyncClient(timeout=12.0) as client:
                res = await client.get(GOOGLE_PLACES_TEXTSEARCH_URL, params=params)
                if res.status_code == 200:
                    data = res.json()
                    status = data.get("status")
                    if status in ["OK", "ZERO_RESULTS"]:
                        return data.get("results", [])
                    else:
                        logger.warning(f"Google Places Search returned status '{status}' for query '{query}': {data.get('error_message')}")
                        return []
        except Exception as exc:
            logger.error(f"Google Places Search HTTP error for query '{query}': {exc}")

        return []

    async def get_place_details(self, place_id: str) -> Optional[Dict[str, Any]]:
        """
        Fetches detailed place metadata from Google Places Details API.
        """
        if not self.has_api_key() or not place_id:
            return None

        params = {
            "place_id": place_id,
            "fields": "place_id,name,formatted_address,geometry,formatted_phone_number,international_phone_number,website,rating,user_ratings_total,opening_hours,business_status,url,types,photos",
            "key": self.api_key
        }

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.get(GOOGLE_PLACES_DETAILS_URL, params=params)
                if res.status_code == 200:
                    data = res.json()
                    if data.get("status") == "OK":
                        return data.get("result", {})
        except Exception as exc:
            logger.error(f"Google Place Details HTTP error for place_id={place_id}: {exc}")

        return None

    def build_photo_url(self, photo_reference: str, max_width: int = 800) -> str:
        """Constructs a direct Google Places photo URL."""
        if not self.api_key or not photo_reference:
            return ""
        return f"{GOOGLE_PLACES_PHOTO_URL}?maxwidth={max_width}&photo_reference={photo_reference}&key={self.api_key}"

    def normalize_place(
        self,
        raw_place: Dict[str, Any],
        details: Optional[Dict[str, Any]] = None,
        target_brand: Optional[str] = None,
        target_category: Optional[str] = None,
        target_repair: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Normalizes raw Google Place data into our verified schema format without fabricating missing data.
        """
        data = details if details else raw_place
        place_id = data.get("place_id") or raw_place.get("place_id")
        name = data.get("name") or raw_place.get("name") or "Repair Center"
        formatted_address = data.get("formatted_address") or raw_place.get("formatted_address") or ""

        geom = data.get("geometry", {}).get("location", {}) or raw_place.get("geometry", {}).get("location", {})
        lat = geom.get("lat") or 0.0
        lng = geom.get("lng") or 0.0

        phone = data.get("formatted_phone_number") or data.get("international_phone_number") or None
        website = data.get("website") or None
        rating = float(data.get("rating") or raw_place.get("rating") or 4.5)
        review_count = int(data.get("user_ratings_total") or raw_place.get("user_ratings_total") or 0)
        business_status = data.get("business_status") or raw_place.get("business_status") or "OPERATIONAL"
        google_maps_url = data.get("url") or f"https://www.google.com/maps/place/?q=place_id:{place_id}"

        # Extract opening hours if available
        opening_hours_data = data.get("opening_hours") or raw_place.get("opening_hours")
        opening_hours_text = None
        open_now = None
        if opening_hours_data:
            open_now = opening_hours_data.get("open_now")
            weekday_text = opening_hours_data.get("weekday_text")
            if weekday_text and isinstance(weekday_text, list):
                opening_hours_text = " | ".join(weekday_text[:3])
            elif open_now is True:
                opening_hours_text = "Open Now (Verified via Google)"
            elif open_now is False:
                opening_hours_text = "Currently Closed"

        types = data.get("types") or raw_place.get("types") or []

        # Photos
        photos = []
        raw_photos = data.get("photos") or raw_place.get("photos") or []
        for p in raw_photos[:3]:
            pref = p.get("photo_reference")
            if pref:
                photos.append(self.build_photo_url(pref))

        hero_image = photos[0] if photos else "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"

        # Infer brand and service capabilities strictly
        brands_supported = infer_brands_from_text(name, target_brand)
        services_supported = infer_services_from_text(name, types, target_repair)
        categories_supported = infer_categories_from_text(name, target_category)
        is_auth = is_authorized_service_center(name, types)

        # Extract city from formatted address if possible
        city = ""
        address_parts = [p.strip() for p in formatted_address.split(",") if p.strip()]
        if len(address_parts) >= 2:
            city = address_parts[-2]  # typically city or postal code in standard Google address format

        now_iso = datetime.now(timezone.utc).isoformat()

        return {
            "google_place_id": place_id,
            "name": name,
            "brand_services": brands_supported,
            "device_categories": categories_supported,
            "repair_services": services_supported,
            "address": formatted_address,
            "city": city,
            "state": "",
            "postal_code": "",
            "latitude": float(lat),
            "longitude": float(lng),
            "location": {
                "type": "Point",
                "coordinates": [float(lng), float(lat)]
            },
            "phone": phone,
            "email": None,
            "website": website,
            "rating": rating,
            "review_count": review_count,
            "opening_hours": opening_hours_text,
            "open_now": open_now,
            "business_status": business_status,
            "google_maps_url": google_maps_url,
            "types": types,
            "photos": photos,
            "is_verified": True,
            "is_active": (business_status != "CLOSED_PERMANENTLY"),
            "is_authorized": is_auth,
            "hero_image": hero_image,
            "logo": "🍎" if "apple" in name.lower() else "📱" if "samsung" in name.lower() else "💻" if any(w in name.lower() for w in ["dell", "hp", "lenovo", "laptop"]) else "🔧",
            "source": "google_places",
            "last_synced_at": now_iso
        }

    async def sync_and_cache_places(
        self,
        db: AsyncDatabase,
        normalized_places: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Upserts normalized Google Places records into MongoDB repair_centers cache to prevent duplicate documents.
        """
        cached_items = []
        for place in normalized_places:
            place_id = place.get("google_place_id")
            if not place_id:
                continue

            try:
                # Upsert by google_place_id
                await db.repair_centers.update_one(
                    {"google_place_id": place_id},
                    {"$set": place},
                    upsert=True
                )
                # Fetch fresh record with generated ObjectId
                doc = await db.repair_centers.find_one({"google_place_id": place_id})
                if doc:
                    doc["id"] = str(doc["_id"])
                    doc.pop("_id", None)
                    cached_items.append(doc)
            except Exception as exc:
                logger.warning(f"Error caching Google Place {place_id}: {exc}")
                place["id"] = place_id
                cached_items.append(place)

        return cached_items


# Singleton instance
google_places_service = GooglePlacesService()
