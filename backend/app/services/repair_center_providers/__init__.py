import logging
from typing import Optional

from app.core.config import settings
from app.services.repair_center_providers.base import BaseRepairCenterProvider
from app.services.repair_center_providers.osm_provider import OSMRepairCenterProvider
from app.services.repair_center_providers.google_provider import GoogleRepairCenterProvider

logger = logging.getLogger("revalueiq.providers")

_osm_provider_instance = OSMRepairCenterProvider()
_google_provider_instance = GoogleRepairCenterProvider()


def get_repair_provider(provider_name: Optional[str] = None) -> BaseRepairCenterProvider:
    """
    Factory to retrieve active repair center and map provider.
    Priority:
    1. Explicit provider_name argument ('osm' or 'google')
    2. settings.REPAIR_MAP_PROVIDER environment setting
    3. Default to 'osm' for free open-source demo execution without billing requirements.
    """
    selected = (provider_name or settings.REPAIR_MAP_PROVIDER or "osm").strip().lower()

    if selected == "google":
        return _google_provider_instance
    else:
        return _osm_provider_instance
