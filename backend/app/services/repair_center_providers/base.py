from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional, Tuple


class BaseRepairCenterProvider(ABC):
    """
    Abstract Base Class for Repair Center & Map Providers (OSM, Google, etc.)
    """

    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Returns the unique provider identifier e.g. 'osm' or 'google'."""
        pass

    @abstractmethod
    def is_configured(self) -> bool:
        """Returns whether the provider credentials/requirements are satisfied."""
        pass

    @abstractmethod
    async def geocode(self, location_text: str) -> Optional[Dict[str, Any]]:
        """
        Geocodes user location query string into exact latitude and longitude.
        Returns dict with keys: latitude, longitude, formatted_address, city, state, postal_code
        """
        pass

    @abstractmethod
    async def search_places(
        self,
        query: str,
        latitude: Optional[float] = None,
        longitude: Optional[float] = None,
        radius_meters: int = 25000
    ) -> List[Dict[str, Any]]:
        """
        Searches real repair businesses near coordinates or matching query.
        """
        pass

    @abstractmethod
    async def get_place_details(self, place_id: str) -> Optional[Dict[str, Any]]:
        """
        Fetches detailed metadata for a specific place ID.
        """
        pass

    @abstractmethod
    async def get_directions(
        self,
        lat1: float,
        lon1: float,
        lat2: float,
        lon2: float
    ) -> Optional[Dict[str, Any]]:
        """
        Calculates driving directions, distance, duration, and geometry route coordinates.
        """
        pass

    @abstractmethod
    def normalize_place(
        self,
        raw_place: Dict[str, Any],
        details: Optional[Dict[str, Any]] = None,
        target_brand: Optional[str] = None,
        target_category: Optional[str] = None,
        target_repair: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Normalizes provider-specific response into standardized RevalueIQ repair center dict.
        """
        pass
