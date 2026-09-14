import logging
from typing import Optional
from app.core.config import settings
from app.services.donation_organization_providers.base import BaseDonationOrganizationProvider
from app.services.donation_organization_providers.osm_provider import OSMDonationOrganizationProvider

logger = logging.getLogger("revalueiq.providers.donation")

_instances = {}


def get_donation_provider(provider_name: Optional[str] = None) -> BaseDonationOrganizationProvider:
    """
    Returns configured Donation Organization discovery & map provider instance.
    Defaults to OpenStreetMap ('osm').
    """
    selected = (provider_name or getattr(settings, "DONATION_MAP_PROVIDER", None) or getattr(settings, "REPAIR_MAP_PROVIDER", "osm")).strip().lower()

    if selected not in _instances:
        # Default to OSM provider (free, open, no billing key needed)
        _instances[selected] = OSMDonationOrganizationProvider()
        logger.info(f"Initialized Donation Provider: '{selected}'")

    return _instances[selected]
