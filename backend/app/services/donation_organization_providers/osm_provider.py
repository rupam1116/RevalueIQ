import logging
import math
import re
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
import httpx

from app.services.donation_organization_providers.base import BaseDonationOrganizationProvider

logger = logging.getLogger("revalueiq.providers.donation.osm")

NOMINATIM_GEOCODE_URL = "https://nominatim.openstreetmap.org/search"
OVERPASS_API_URL = "https://overpass-api.de/api/interpreter"
OSRM_ROUTE_URL = "http://router.project-osrm.org/route/v1/driving"

DEFAULT_HEADERS = {
    "User-Agent": "RevalueIQ-DonationHub/1.0 (https://revalueiq.app; contact@revalueiq.app)"
}

CATEGORY_MAPPINGS = {
    "Education": ["school", "college", "university", "kindergarten", "training"],
    "NGOs": ["ngo", "charity", "non_profit", "social_facility"],
    "Orphanages": ["orphanage", "children", "child", "group_home", "shelter"],
    "Rural Schools": ["rural", "mandal", "zilla", "panchayat", "village"],
    "Digital Literacy": ["digital", "computer", "tech", "literacy", "skill", "training"],
    "Government Collection": ["government", "municipal", "waste_transfer_station", "public"],
    "E-Waste Recyclers": ["recycling", "scrap_metal", "electronics_repair", "waste"],
}


class OSMDonationOrganizationProvider(BaseDonationOrganizationProvider):
    """
    OpenStreetMap Provider for Genuine Donation Organizations, Non-Profits,
    Schools, and Recycling Centers using Overpass API, Nominatim, and OSRM.
    """

    @property
    def provider_name(self) -> str:
        return "osm"

    def is_configured(self) -> bool:
        return True

    async def geocode(self, location_text: str) -> Optional[Dict[str, Any]]:
        """
        Geocodes location query into coordinates using OpenStreetMap Nominatim.
        """
        if not location_text or not location_text.strip():
            return None

        params = {
            "q": location_text.strip(),
            "format": "json",
            "addressdetails": 1,
            "limit": 1
        }

        try:
            async with httpx.AsyncClient(timeout=10.0, headers=DEFAULT_HEADERS) as client:
                res = await client.get(NOMINATIM_GEOCODE_URL, params=params)
                if res.status_code == 200:
                    results = res.json()
                    if results and isinstance(results, list) and len(results) > 0:
                        top = results[0]
                        lat = float(top["lat"])
                        lon = float(top["lon"])
                        display_name = top.get("display_name", location_text)
                        address_info = top.get("address", {})

                        city = (
                            address_info.get("city")
                            or address_info.get("town")
                            or address_info.get("municipality")
                            or address_info.get("suburb")
                            or address_info.get("state_district")
                            or ""
                        )
                        state = address_info.get("state", "")
                        postal_code = address_info.get("postcode", "")

                        return {
                            "latitude": lat,
                            "longitude": lon,
                            "formatted_address": display_name,
                            "city": city,
                            "state": state,
                            "postal_code": postal_code
                        }
        except Exception as exc:
            logger.error(f"OSM Nominatim geocode error for '{location_text}': {exc}")

        return None

    def _build_overpass_query(
        self,
        category: Optional[str],
        query: Optional[str],
        donation_type: Optional[str],
        lat: float,
        lon: float,
        radius_meters: int
    ) -> str:
        """
        Builds targeted Overpass QL query strictly tailored to the requested category or keywords.
        """
        cat = (category or "").strip()
        clauses = []

        if cat == "Education":
            clauses.append(f'node["amenity"="school"](around:{radius_meters},{lat},{lon});')
            clauses.append(f'way["amenity"="school"](around:{radius_meters},{lat},{lon});')
            clauses.append(f'node["amenity"="college"](around:{radius_meters},{lat},{lon});')
            clauses.append(f'way["amenity"="college"](around:{radius_meters},{lat},{lon});')
        elif cat == "NGOs":
            clauses.append(f'node["office"="ngo"](around:{radius_meters},{lat},{lon});')
            clauses.append(f'way["office"="ngo"](around:{radius_meters},{lat},{lon});')
            clauses.append(f'node["office"="charity"](around:{radius_meters},{lat},{lon});')
            clauses.append(f'way["office"="charity"](around:{radius_meters},{lat},{lon});')
            clauses.append(f'node["amenity"="social_facility"]["social_facility"!~"nursing_home|assisted_living|hospice"]["healthcare"!~".*"](around:{radius_meters},{lat},{lon});')
        elif cat == "Orphanages":
            clauses.append(f'node["amenity"="social_facility"]["social_facility"~"group_home|shelter|child|children|orphan",i](around:{radius_meters},{lat},{lon});')
            clauses.append(f'way["amenity"="social_facility"]["social_facility"~"group_home|shelter|child|children|orphan",i](around:{radius_meters},{lat},{lon});')
            clauses.append(f'node["name"~"orphan|anatha|balala|children|child home",i](around:{radius_meters},{lat},{lon});')
        elif cat == "Rural Schools":
            clauses.append(f'node["amenity"="school"]["name"~"zilla|parishad|mandal|govt|village|rural|primary",i](around:{radius_meters},{lat},{lon});')
            clauses.append(f'way["amenity"="school"]["name"~"zilla|parishad|mandal|govt|village|rural|primary",i](around:{radius_meters},{lat},{lon});')
        elif cat == "Digital Literacy":
            clauses.append(f'node["amenity"="training"](around:{radius_meters},{lat},{lon});')
            clauses.append(f'way["amenity"="training"](around:{radius_meters},{lat},{lon});')
            clauses.append(f'node["name"~"computer|digital|skill|vocational|training|it centre",i](around:{radius_meters},{lat},{lon});')
        elif cat == "Government Collection":
            clauses.append(f'node["amenity"="waste_transfer_station"](around:{radius_meters},{lat},{lon});')
            clauses.append(f'way["amenity"="waste_transfer_station"](around:{radius_meters},{lat},{lon});')
            clauses.append(f'node["amenity"="recycling"]["operator:type"="government"](around:{radius_meters},{lat},{lon});')
            clauses.append(f'node["amenity"="recycling"]["operator"~"ghmc|bbmp|municipal|government|corporation|ward",i](around:{radius_meters},{lat},{lon});')
        elif cat == "E-Waste Recyclers":
            clauses.append(f'node["amenity"="recycling"](around:{radius_meters},{lat},{lon});')
            clauses.append(f'way["amenity"="recycling"](around:{radius_meters},{lat},{lon});')
            clauses.append(f'node["shop"="second_hand"](around:{radius_meters},{lat},{lon});')
        else:
            # "All Categories" or broad search
            clauses.append(f'node["amenity"="recycling"](around:{radius_meters},{lat},{lon});')
            clauses.append(f'way["amenity"="recycling"](around:{radius_meters},{lat},{lon});')
            clauses.append(f'node["office"="ngo"](around:{radius_meters},{lat},{lon});')
            clauses.append(f'way["office"="ngo"](around:{radius_meters},{lat},{lon});')
            clauses.append(f'node["amenity"="social_facility"]["social_facility"!~"nursing_home|assisted_living|hospice"]["healthcare"!~".*"](around:{radius_meters},{lat},{lon});')
            clauses.append(f'node["amenity"="school"](around:{min(radius_meters, 8000)},{lat},{lon});')

        # If user supplied a free text query (e.g. "Rotary", "Electronics", "Green"), include named match clause
        clean_query = (query or "").strip()
        if clean_query and len(clean_query) >= 3 and clean_query.lower() not in ["all", "all categories"]:
            escaped_q = re.escape(clean_query)
            clauses.append(f'node["name"~"{escaped_q}",i](around:{radius_meters},{lat},{lon});')
            clauses.append(f'way["name"~"{escaped_q}",i](around:{radius_meters},{lat},{lon});')

        joined_clauses = "\n  ".join(clauses)
        return f"""
        [out:json][timeout:15];
        (
          {joined_clauses}
        );
        out center body 30;
        """

    async def search_organizations(
        self,
        query: Optional[str] = None,
        category: Optional[str] = None,
        donation_type: Optional[str] = None,
        latitude: Optional[float] = None,
        longitude: Optional[float] = None,
        radius_meters: int = 25000
    ) -> List[Dict[str, Any]]:
        """
        Queries OpenStreetMap Overpass API for genuine organizations matching category and location.
        """
        if latitude is None or longitude is None:
            return []

        overpass_query = self._build_overpass_query(
            category=category,
            query=query,
            donation_type=donation_type,
            lat=latitude,
            lon=longitude,
            radius_meters=radius_meters
        )

        try:
            async with httpx.AsyncClient(timeout=15.0, headers=DEFAULT_HEADERS) as client:
                res = await client.post(OVERPASS_API_URL, data={"data": overpass_query})
                if res.status_code == 200:
                    data = res.json()
                    elements = data.get("elements", [])
                    # Filter out elements that lack an identifiable name or are medical facilities
                    EXCLUDED_MEDICAL = [
                        "nursing home", "maternity", "hospital", "clinic", "dental",
                        "eye care", "diagnostic", "pharmacy", "medical store", "orthopaedic",
                        "pediatric", "surgical"
                    ]
                    valid_elements = []
                    for el in elements:
                        tags = el.get("tags", {})
                        name = tags.get("name") or tags.get("operator")
                        if not name or not name.strip():
                            continue
                        name_lower = name.lower()
                        if any(term in name_lower for term in EXCLUDED_MEDICAL):
                            continue
                        valid_elements.append(el)
                    return valid_elements
        except Exception as exc:
            logger.warning(f"Overpass API donation query error: {exc}")

        return []

    async def get_organization_details(self, place_id: str) -> Optional[Dict[str, Any]]:
        """
        OSM element details are self-contained in Overpass body.
        """
        return None

    async def get_directions(
        self,
        lat1: float,
        lon1: float,
        lat2: float,
        lon2: float
    ) -> Optional[Dict[str, Any]]:
        """
        Calculates live driving directions and route geometry using OSRM.
        """
        url = f"{OSRM_ROUTE_URL}/{lon1},{lat1};{lon2},{lat2}"
        params = {
            "overview": "full",
            "geometries": "geojson"
        }

        try:
            async with httpx.AsyncClient(timeout=10.0, headers=DEFAULT_HEADERS) as client:
                res = await client.get(url, params=params)
                if res.status_code == 200:
                    data = res.json()
                    if data.get("code") == "Ok" and data.get("routes"):
                        route = data["routes"][0]
                        dist_km = round(route.get("distance", 0.0) / 1000.0, 2)
                        duration_min = round(route.get("duration", 0.0) / 60.0, 1)
                        geom = route.get("geometry", {})

                        return {
                            "distance_km": dist_km,
                            "duration_minutes": duration_min,
                            "geometry": geom,
                            "summary": f"Via {route.get('legs', [{}])[0].get('summary', 'Road')}",
                            "provider": "osrm"
                        }
        except Exception as exc:
            logger.warning(f"OSRM donation route calculation error: {exc}")

        # Fallback simple line calculation if OSRM mirror is momentarily unreachable
        return {
            "distance_km": round(((lat2 - lat1)**2 + (lon2 - lon1)**2)**0.5 * 111.0, 2),
            "duration_minutes": 15.0,
            "geometry": {
                "type": "LineString",
                "coordinates": [[lon1, lat1], [lon2, lat2]]
            },
            "summary": "Direct Route",
            "provider": "osrm_fallback"
        }

    def _determine_category(self, tags: Dict[str, Any], target_category: Optional[str] = None) -> str:
        """
        Maps tags to one of the 8 canonical categories.
        """
        if target_category and target_category != "All Categories":
            return target_category

        name = (tags.get("name") or "").lower()
        amenity = (tags.get("amenity") or "").lower()
        office = (tags.get("office") or "").lower()

        if "orphan" in name or "anatha" in name or tags.get("social_facility") in ["group_home", "shelter"]:
            return "Orphanages"
        if office in ["ngo", "charity"] or amenity == "social_facility":
            return "NGOs"
        if amenity == "recycling" or "recycl" in name:
            return "E-Waste Recyclers"
        if "waste" in amenity or tags.get("operator:type") == "government" or any(g in name for g in ["ghmc", "municipal", "corporation"]):
            return "Government Collection"
        if "digital" in name or "computer" in name or amenity == "training":
            return "Digital Literacy"
        if any(r in name for r in ["zilla", "parishad", "mandal", "village", "rural"]):
            return "Rural Schools"
        if amenity in ["school", "college", "university"]:
            return "Education"

        return "NGOs"

    def normalize_organization(
        self,
        raw_place: Dict[str, Any],
        details: Optional[Dict[str, Any]] = None,
        target_category: Optional[str] = None,
        target_donation_type: Optional[str] = None,
        city_hint: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Normalizes OSM Overpass element into standardized RevalueIQ donation organization dict.
        Enforces strict integrity: no fake ratings, no fake reviews, no fake donation types.
        """
        osm_id = str(raw_place.get("id", ""))
        osm_type = raw_place.get("type", "node")
        provider_organization_id = f"osm_{osm_type}_{osm_id}"

        tags = raw_place.get("tags", {})
        name = tags.get("name") or tags.get("operator") or "Community Organization"

        # Coordinates
        lat = raw_place.get("lat") or raw_place.get("center", {}).get("lat") or 0.0
        lon = raw_place.get("lon") or raw_place.get("center", {}).get("lon") or 0.0

        category = self._determine_category(tags, target_category)

        # Address construction
        street = tags.get("addr:street") or ""
        housenumber = tags.get("addr:housenumber") or ""
        suburb = tags.get("addr:suburb") or tags.get("addr:neighbourhood") or tags.get("addr:district") or ""
        city = tags.get("addr:city") or tags.get("addr:town") or tags.get("addr:municipality") or city_hint or ""
        postal_code = tags.get("addr:postcode") or None

        address_parts = [p for p in [housenumber, street, suburb, city, postal_code] if p]
        full_address = ", ".join(address_parts) if address_parts else f"{name}, {city or 'Local Area'}"

        phone = tags.get("phone") or tags.get("contact:phone") or None
        website = tags.get("website") or tags.get("contact:website") or tags.get("url") or None
        email = tags.get("email") or tags.get("contact:email") or None
        opening_hours = tags.get("opening_hours") or None
        description = tags.get("description") or tags.get("mission") or None

        # Strict donation verification
        # An organization is only marked as confirmed if explicit recycling/donation tags exist
        accepted_donation_types = []
        is_confirmed = False

        if tags.get("recycling:electrical_appliances") == "yes":
            accepted_donation_types.append("Electronics")
            is_confirmed = True
        if tags.get("recycling:computers") == "yes":
            accepted_donation_types.append("Computers & Laptops")
            is_confirmed = True
        if tags.get("recycling:batteries") == "yes":
            accepted_donation_types.append("Batteries")
            is_confirmed = True
        if tags.get("donation:accepted") == "yes" or tags.get("donation:electronics") == "yes":
            accepted_donation_types.append("Electronics")
            is_confirmed = True

        accepted_item_categories = []
        if is_confirmed:
            accepted_item_categories = ["Electronics", "Digital Devices"]

        provider_url = f"https://www.openstreetmap.org/{osm_type}/{osm_id}"

        return {
            "provider": "osm",
            "provider_organization_id": provider_organization_id,
            "name": name,
            "category": category,
            "description": description,
            "address": full_address,
            "city": city,
            "area": suburb or None,
            "postal_code": postal_code,
            "latitude": float(lat),
            "longitude": float(lon),
            "phone": phone,
            "website": website,
            "email": email,
            "opening_hours": opening_hours,
            "accepted_donation_types": accepted_donation_types,
            "accepted_item_categories": accepted_item_categories,
            "is_verified": False,  # Only true for officially verified partner records
            "verification_source": "OpenStreetMap Community Data",
            "provider_url": provider_url,
            "last_updated": datetime.now(timezone.utc).isoformat(),
            "donation_acceptance_confirmed": is_confirmed,
            "donation_acceptance_status": "Donation acceptance confirmed" if is_confirmed else "Donation acceptance not confirmed",
            "rating": None,
            "review_count": None
        }
