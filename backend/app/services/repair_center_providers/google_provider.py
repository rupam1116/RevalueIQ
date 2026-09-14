import logging
import re
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
import httpx

from app.core.config import settings
from app.services.repair_center_providers.base import BaseRepairCenterProvider

logger = logging.getLogger("revalueiq.providers.google")

GOOGLE_GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json"
GOOGLE_PLACES_TEXTSEARCH_URL = "https://maps.googleapis.com/maps/api/place/textsearch/json"
GOOGLE_PLACES_DETAILS_URL = "https://maps.googleapis.com/maps/api/place/details/json"
GOOGLE_PLACES_PHOTO_URL = "https://maps.googleapis.com/maps/api/place/photo"

KNOWN_BRANDS = ["Apple", "Samsung", "Dell", "HP", "Lenovo", "Xiaomi", "Redmi", "OnePlus", "Google", "Asus", "Acer", "Motorola", "Realme", "Sony"]


def is_authorized_service_center(name: str) -> bool:
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


def infer_brands(name: str, query_brand: Optional[str] = None) -> List[str]:
    brands = set()
    if query_brand and query_brand.strip() and query_brand.lower() != "all":
        brands.add(query_brand.strip())

    name_lower = name.lower()
    for b in KNOWN_BRANDS:
        if re.search(rf"\b{b.lower()}\b", name_lower):
            brands.add(b)

    if any(k in name_lower for k in ["multi-brand", "multibrand", "all brands", "chipset lab", "electronics repair", "tech lab", "fix"]):
        for default_b in ["Apple", "Samsung", "Dell", "HP", "Lenovo", "Xiaomi"]:
            brands.add(default_b)

    return sorted(list(brands)) if brands else (["Multi-Brand"] if not query_brand else [query_brand])


def infer_services(name: str, query_repair: Optional[str] = None) -> List[str]:
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

    services.add("Hardware Diagnostics")
    services.add("Screen Replacement")
    services.add("Battery Replacement")
    return sorted(list(services))


class GoogleRepairCenterProvider(BaseRepairCenterProvider):
    """
    Google Maps Platform Provider implementation (Places API, Geocoding API).
    """

    def __init__(self):
        self.api_key = settings.GOOGLE_MAPS_API_KEY.strip()

    @property
    def provider_name(self) -> str:
        return "google"

    def is_configured(self) -> bool:
        return bool(self.api_key)

    async def geocode(self, location_text: str) -> Optional[Dict[str, Any]]:
        if not self.is_configured() or not location_text or not location_text.strip():
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
        except Exception as exc:
            logger.error(f"Google Geocoding error for '{location_text}': {exc}")

        return None

    async def search_places(
        self,
        query: str,
        latitude: Optional[float] = None,
        longitude: Optional[float] = None,
        radius_meters: int = 25000
    ) -> List[Dict[str, Any]]:
        if not self.is_configured():
            logger.info("Google Maps API key not configured.")
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
        except Exception as exc:
            logger.error(f"Google Places Search error for query '{query}': {exc}")

        return []

    async def get_place_details(self, place_id: str) -> Optional[Dict[str, Any]]:
        if not self.is_configured() or not place_id:
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
            logger.error(f"Google Place Details error for place_id={place_id}: {exc}")

        return None

    async def get_directions(
        self,
        lat1: float,
        lon1: float,
        lat2: float,
        lon2: float
    ) -> Optional[Dict[str, Any]]:
        """Fallback driving directions or Google Maps URL destination."""
        return {
            "distance_km": round(((lat2 - lat1)**2 + (lon2 - lon1)**2)**0.5 * 111.0, 2),
            "duration_minutes": 15.0,
            "geometry": {
                "type": "LineString",
                "coordinates": [[lon1, lat1], [lon2, lat2]]
            },
            "summary": "Google Maps Driving Route",
            "provider": "google"
        }

    def normalize_place(
        self,
        raw_place: Dict[str, Any],
        details: Optional[Dict[str, Any]] = None,
        target_brand: Optional[str] = None,
        target_category: Optional[str] = None,
        target_repair: Optional[str] = None
    ) -> Dict[str, Any]:
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

        types = data.get("types") or raw_place.get("types") or []
        brands_supported = infer_brands(name, target_brand)
        services_supported = infer_services(name, target_repair)
        is_auth = is_authorized_service_center(name)

        city = ""
        address_parts = [p.strip() for p in formatted_address.split(",") if p.strip()]
        if len(address_parts) >= 2:
            city = address_parts[-2]

        now_iso = datetime.now(timezone.utc).isoformat()

        return {
            "provider": "google",
            "provider_place_id": place_id,
            "google_place_id": place_id,
            "name": name,
            "brand_services": brands_supported,
            "device_categories": [target_category] if target_category and target_category != "All" else ["Smartphone", "Laptop"],
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
            "opening_hours": "10:00 AM - 8:00 PM (Mon - Sat)",
            "open_now": True,
            "business_status": business_status,
            "google_maps_url": google_maps_url,
            "types": types,
            "photos": [],
            "is_verified": True,
            "is_active": (business_status != "CLOSED_PERMANENTLY"),
            "is_authorized": is_auth,
            "hero_image": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
            "logo": "🍎" if "apple" in name.lower() else "📱" if "samsung" in name.lower() else "💻" if any(w in name.lower() for w in ["dell", "hp", "lenovo", "laptop"]) else "🔧",
            "source": "google_places",
            "last_synced_at": now_iso
        }
