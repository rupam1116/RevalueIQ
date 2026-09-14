from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional


class BaseDonationOrganizationProvider(ABC):
    """
    Abstract Base Class for Donation Organization & Map Providers (OSM, Google, etc.)
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
        Searches real organizations near coordinates or matching category/query.
        """
        pass

    @abstractmethod
    async def get_organization_details(self, place_id: str) -> Optional[Dict[str, Any]]:
        """
        Fetches detailed metadata for a specific organization place ID.
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
    def normalize_organization(
        self,
        raw_place: Dict[str, Any],
        details: Optional[Dict[str, Any]] = None,
        target_category: Optional[str] = None,
        target_donation_type: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Normalizes provider-specific response into standardized RevalueIQ donation organization dict.
        """
        pass
