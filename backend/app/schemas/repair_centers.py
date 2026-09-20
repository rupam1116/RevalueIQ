from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field


class DeviceContextRequest(BaseModel):
    category: Optional[str] = Field(None, description="Category of device e.g. Smartphone, Laptop")
    brand: Optional[str] = Field(None, description="Brand name e.g. Apple, Samsung, Dell")
    model: Optional[str] = Field(None, description="Device model name e.g. iPhone 14 Pro, Galaxy S23")


class RepairContextRequest(BaseModel):
    problem: Optional[str] = Field(None, description="Detected problem e.g. Cracked Screen, Battery Degradation")
    severity: Optional[str] = Field(None, description="Severity level e.g. LOW, MEDIUM, HIGH, CRITICAL")
    recommended_action: Optional[str] = Field(None, description="Action recommended e.g. REPAIR, PROFESSIONAL_INSPECTION")
    estimated_repair_cost: Optional[float] = Field(None, description="Estimated repair cost in INR")
    valuation_id: Optional[str] = Field(None, description="Optional associated valuation ID")
    advisory_id: Optional[str] = Field(None, description="Optional associated repair advisory ID")


class LocationContextRequest(BaseModel):
    latitude: Optional[float] = Field(None, ge=-90.0, le=90.0, description="User GPS latitude")
    longitude: Optional[float] = Field(None, ge=-180.0, le=180.0, description="User GPS longitude")
    city: Optional[str] = Field(None, description="City name e.g. Hyderabad, Bengaluru")
    area: Optional[str] = Field(None, description="Area or neighborhood")
    postal_code: Optional[str] = Field(None, description="Postal/PIN code")
    radius_km: Optional[float] = Field(50.0, ge=0.1, le=500.0, description="Max search radius in kilometers (default: 50km)")


class RepairRecommendationRequest(BaseModel):
    device: Optional[DeviceContextRequest] = Field(default_factory=DeviceContextRequest)
    repair: Optional[RepairContextRequest] = Field(default_factory=RepairContextRequest)
    location: Optional[LocationContextRequest] = Field(default_factory=LocationContextRequest)


class RepairCenterBase(BaseModel):
    name: str = Field(..., description="Business name of the repair center")
    provider: str = Field("osm", description="Map provider: 'osm' or 'google'")
    provider_place_id: Optional[str] = Field(None, description="Unique place ID from provider (OSM node/way or Google place_id)")
    google_place_id: Optional[str] = Field(None, description="Google Place ID (preserved for Google Maps)")
    brand_services: List[str] = Field(default_factory=list, description="Brands serviced e.g. Apple, Samsung")
    device_categories: List[str] = Field(default_factory=list, description="Categories e.g. Smartphone, Laptop")
    repair_services: List[str] = Field(default_factory=list, description="Services offered e.g. Screen Repair, Battery Replacement")
    address: str = Field(..., description="Full street address / formatted address")
    city: str = Field("", description="City")
    state: str = Field("", description="State/Province")
    postal_code: str = Field("", description="Postal PIN code")
    latitude: float = Field(..., description="Geo latitude")
    longitude: float = Field(..., description="Geo longitude")
    phone: Optional[str] = Field(None, description="Contact phone number")
    email: Optional[str] = Field(None, description="Contact email")
    website: Optional[str] = Field(None, description="Official website URL")
    rating: float = Field(4.5, description="User rating out of 5.0")
    review_count: int = Field(0, description="Total number of customer reviews")
    opening_hours: Optional[str] = Field(None, description="Operating hours text")
    open_now: Optional[bool] = Field(None, description="Whether currently open")
    business_status: Optional[str] = Field("OPERATIONAL", description="Business status")
    google_maps_url: Optional[str] = Field(None, description="Direct map URL")
    types: List[str] = Field(default_factory=list, description="Place types / categories")
    photos: List[str] = Field(default_factory=list, description="Photo URLs / References")
    is_verified: bool = Field(True, description="Whether center is verified")
    is_active: bool = Field(True, description="Whether center is actively accepting repairs")
    is_authorized: bool = Field(False, description="Whether center is verified OEM authorized")
    hero_image: Optional[str] = Field(None, description="Storefront hero image URL")
    logo: Optional[str] = Field(None, description="Brand/Store logo URL or emoji")
    source: Optional[str] = Field("osm", description="Data source identifier")
    last_synced_at: Optional[str] = Field(None, description="ISO timestamp of last provider sync")


class RepairCenterResponse(RepairCenterBase):
    id: str = Field(..., description="Unique ID of repair center")
    distance_km: Optional[float] = Field(None, description="Calculated distance in km from search location")
    match_score: Optional[float] = Field(None, description="Recommendation match score (0-100)")
    matched_services: Optional[List[str]] = Field(default_factory=list, description="Services matching query")
    matched_brands: Optional[List[str]] = Field(default_factory=list, description="Brands matching query")
    recommendation_reason: Optional[str] = Field(None, description="Human-readable recommendation rationale")


class RepairCenterListResponse(BaseModel):
    items: List[RepairCenterResponse] = Field(default_factory=list)
    total: int = Field(0, description="Total matching repair centers")
    page: int = Field(1)
    limit: int = Field(20)
    has_more: bool = Field(False)
    user_location: Optional[Dict[str, Any]] = None
    query_used: Optional[str] = None
    provider: str = Field("osm", description="Active map and discovery provider ('osm' or 'google')")


class RouteResponse(BaseModel):
    distance_km: float = Field(..., description="Driving distance in kilometers")
    duration_minutes: float = Field(..., description="Estimated driving duration in minutes")
    geometry: Optional[Dict[str, Any]] = Field(None, description="GeoJSON LineString geometry coordinates")
    summary: Optional[str] = Field(None, description="Route summary description")
    provider: str = Field("osrm", description="Routing provider used")
