from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field


class DonationDeviceContextRequest(BaseModel):
    category: Optional[str] = Field(None, description="Category of device e.g. Smartphone, Laptop")
    brand: Optional[str] = Field(None, description="Brand name e.g. Apple, Dell, HP")
    model: Optional[str] = Field(None, description="Model name e.g. iPhone 14 Pro, XPS 15")
    condition: Optional[str] = Field(None, description="Device condition")
    valuation_id: Optional[str] = Field(None, description="Optional associated valuation ID")


class DonationPurposeContextRequest(BaseModel):
    purpose: Optional[str] = Field(None, description="Donation purpose e.g. Digital Literacy, Reuse, Safe Recycling")
    recommended_action: Optional[str] = Field("DONATE", description="AI Valuation action e.g. DONATE")


class DonationLocationContextRequest(BaseModel):
    latitude: Optional[float] = Field(None, description="User GPS latitude")
    longitude: Optional[float] = Field(None, description="User GPS longitude")
    city: Optional[str] = Field(None, description="City name e.g. Hyderabad, Bengaluru")
    area: Optional[str] = Field(None, description="Area or neighborhood")
    postal_code: Optional[str] = Field(None, description="Postal / PIN code")
    radius_km: Optional[float] = Field(50.0, description="Max search radius in km")


class DonationRecommendationRequest(BaseModel):
    device: Optional[DonationDeviceContextRequest] = Field(default_factory=DonationDeviceContextRequest)
    donation: Optional[DonationPurposeContextRequest] = Field(default_factory=DonationPurposeContextRequest)
    location: Optional[DonationLocationContextRequest] = Field(default_factory=DonationLocationContextRequest)


class DonationOrganizationBase(BaseModel):
    name: str = Field(..., description="Organization name")
    provider: str = Field("osm", description="Data provider: 'osm' or 'google'")
    provider_organization_id: Optional[str] = Field(None, description="Provider specific unique organization ID")
    category: str = Field(..., description="Category: Education, NGOs, Orphanages, Rural Schools, Digital Literacy, Government Collection, E-Waste Recyclers")
    description: Optional[str] = Field(None, description="Genuine description or mission statement if available")
    address: str = Field(..., description="Full street/formatted address")
    city: str = Field("", description="City name")
    area: Optional[str] = Field(None, description="Neighborhood or locality")
    postal_code: Optional[str] = Field(None, description="Postal / PIN code")
    latitude: float = Field(..., description="Geographical latitude")
    longitude: float = Field(..., description="Geographical longitude")
    phone: Optional[str] = Field(None, description="Genuine phone number if available")
    website: Optional[str] = Field(None, description="Genuine official website URL if available")
    email: Optional[str] = Field(None, description="Genuine contact email if available")
    opening_hours: Optional[str] = Field(None, description="Genuine operating hours if available")
    accepted_donation_types: Optional[List[str]] = Field(default_factory=list, description="Explicitly confirmed donation types. Empty if unconfirmed.")
    accepted_item_categories: Optional[List[str]] = Field(default_factory=list, description="Item categories accepted")
    is_verified: bool = Field(False, description="True only if official verified partner")
    verification_source: Optional[str] = Field(None, description="Verification source")
    provider_url: Optional[str] = Field(None, description="Link to provider record or map")
    last_updated: Optional[str] = Field(None, description="ISO timestamp of last data fetch")
    donation_acceptance_confirmed: bool = Field(False, description="True only if donation acceptance is confirmed by verifiable data")
    donation_acceptance_status: str = Field("Donation acceptance not confirmed", description="Status: 'Donation acceptance confirmed', 'Donation acceptance not confirmed', or 'Donation acceptance unavailable'")
    rating: Optional[float] = Field(None, description="Genuine provider rating if supplied, else None")
    review_count: Optional[int] = Field(None, description="Genuine provider review count if supplied, else None")
    recommendation_score: Optional[float] = Field(None, description="Recommendation prioritization score (0-100)")
    recommendation_reason: Optional[str] = Field(None, description="Explanation for recommendation priority")
    donation_purpose: Optional[str] = Field(None, description="Matched donation purpose e.g. Digital Literacy, Reuse, Recycling")


class DonationOrganizationResponse(DonationOrganizationBase):
    id: str = Field(..., description="Unique ID of donation organization in RevalueIQ")
    distance_km: Optional[float] = Field(None, description="Distance in kilometers from user's search location")


class DonationOrganizationListResponse(BaseModel):
    items: List[DonationOrganizationResponse] = Field(default_factory=list)
    total: int = Field(0, description="Total matching organizations")
    page: int = Field(1)
    limit: int = Field(20)
    has_more: bool = Field(False)
    user_location: Optional[Dict[str, Any]] = None
    query_used: Optional[str] = None
    provider: str = Field("osm", description="Active discovery provider ('osm' or 'google')")


class DonationRouteResponse(BaseModel):
    distance_km: float = Field(..., description="Driving distance in kilometers")
    duration_minutes: float = Field(..., description="Estimated driving duration in minutes")
    geometry: Optional[Dict[str, Any]] = Field(None, description="GeoJSON LineString geometry coordinates")
    summary: Optional[str] = Field(None, description="Route summary description")
    provider: str = Field("osrm", description="Routing provider used")
