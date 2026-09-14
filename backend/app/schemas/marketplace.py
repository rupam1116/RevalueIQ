from enum import Enum
from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field, field_validator


class ListingStatus(str, Enum):
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"
    UNPUBLISHED = "UNPUBLISHED"
    SOLD = "SOLD"
    REMOVED = "REMOVED"


class ListingCategory(str, Enum):
    PHONES = "Phones"
    LAPTOPS = "Laptops"
    TABLETS = "Tablets"
    CAMERAS = "Cameras"
    GAMING = "Gaming"
    ACCESSORIES = "Accessories"
    SMART_WATCHES = "Smart Watches"
    AUDIO = "Audio"
    OTHER = "Other"


class ListingConditionGrade(str, Enum):
    A_PLUS = "A+"
    A = "A"
    B_PLUS = "B+"
    B = "B"
    C = "C"


class ListingImageItem(BaseModel):
    url: str = Field(..., description="Image URL or Cloudinary secure URL")
    secure_url: Optional[str] = Field(None, description="Cloudinary secure HTTPS URL")
    public_id: Optional[str] = Field(None, description="Cloudinary asset public_id")
    width: Optional[int] = Field(None, description="Image width in pixels")
    height: Optional[int] = Field(None, description="Image height in pixels")
    format: Optional[str] = Field(None, description="Image format e.g. webp, jpg, png")
    bytes: Optional[int] = Field(None, description="Image payload size in bytes")
    type: Optional[str] = Field("standard", description="Image perspective / type")
    order: Optional[int] = Field(0, description="Display order index")


class ListingSpecifications(BaseModel):
    ram: Optional[str] = Field(None, description="RAM memory e.g. 16GB")
    storage: Optional[str] = Field(None, description="Storage capacity e.g. 512GB")
    purchase_year: Optional[int] = Field(None, description="Year of original purchase")
    color: Optional[str] = Field(None, description="Device color")
    processor: Optional[str] = Field(None, description="CPU/Processor model")
    display: Optional[str] = Field(None, description="Display size and type")
    battery_health: Optional[str] = Field(None, description="Battery capacity percentage")
    other: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Additional custom specs")


class ListingValuationSnapshot(BaseModel):
    estimated_value_inr: Optional[float] = Field(None, description="AI estimated market value in INR")
    minimum_value_inr: Optional[float] = Field(None, description="Estimated price range lower bound in INR")
    maximum_value_inr: Optional[float] = Field(None, description="Estimated price range upper bound in INR")
    valuation_id: Optional[str] = Field(None, description="Source valuation document ID")
    valuation_code: Optional[str] = Field(None, description="Source valuation code")
    circularity_score: Optional[int] = Field(None, ge=0, le=100, description="Circularity score (0-100)")
    co2_saved_kg: Optional[float] = Field(None, description="Avoided CO2 emissions in kg")
    ewaste_diverted_kg: Optional[float] = Field(None, description="Diverted e-waste in kg")
    water_saved_liters: Optional[float] = Field(None, description="Water saved in liters")


class PricingMetadata(BaseModel):
    valuation_based: bool = Field(False, description="Whether pricing was derived from AI valuation")
    seller_entered: bool = Field(True, description="Whether seller set their own price")
    suggested_price_inr: Optional[float] = Field(None, description="AI suggested price in INR")


class SafeSellerInfo(BaseModel):
    id: str = Field(..., description="Seller public identifier")
    name: str = Field(..., description="Seller display name")
    avatar: Optional[str] = Field(None, description="Seller avatar URL")
    location: Optional[str] = Field("India", description="Seller city/location")
    rating: float = Field(5.0, ge=1.0, le=5.0, description="Seller rating")
    reviews_count: int = Field(0, ge=0, description="Total review count")
    verified: bool = Field(True, description="Whether seller is verified")
    member_since: Optional[str] = Field(None, description="Year or date joined")


class MarketplaceListingCreate(BaseModel):
    device_id: Optional[str] = Field(None, description="Optional registered device ID owned by seller")
    valuation_id: Optional[str] = Field(None, description="Optional Phase 3 valuation ID owned by seller")
    category: str = Field(..., description="Device category e.g. Phones, Laptops")
    brand: str = Field(..., min_length=1, max_length=100, description="Brand name")
    model: str = Field(..., min_length=1, max_length=150, description="Model designation")
    title: str = Field(..., min_length=3, max_length=200, description="Listing title")
    description: str = Field(..., min_length=5, max_length=5000, description="Detailed condition & device description")
    condition: str = Field("A", description="Cosmetic condition grade (A+, A, B+, B, C)")
    functional_status: Optional[str] = Field("Fully Functional", description="Operational status")
    specifications: Optional[ListingSpecifications] = Field(default_factory=ListingSpecifications)
    images: List[ListingImageItem] = Field(default_factory=list, description="List of image items")
    asking_price_inr: float = Field(..., gt=0, le=10000000, description="Asking price in Indian Rupees (INR)")
    original_price_inr: Optional[float] = Field(None, gt=0, description="Original MSRP in INR for comparison")
    warranty: Optional[str] = Field("12-Month Revalue Eco Warranty", description="Warranty coverage")
    return_policy: Optional[str] = Field("14-Day Free Returns", description="Return policy")
    shipping_method: Optional[str] = Field("Insured Eco Express Shipping", description="Shipping method")
    location: Optional[str] = Field(None, description="Device location")
    save_as_draft: Optional[bool] = Field(False, description="Save as draft instead of publishing immediately")

    @field_validator("asking_price_inr")
    @classmethod
    def validate_price(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("Asking price must be strictly positive.")
        if v > 10_000_000:
            raise ValueError("Asking price exceeds maximum allowed threshold (₹10,000,000).")
        return round(float(v), 2)


class MarketplaceListingUpdate(BaseModel):
    category: Optional[str] = Field(None, description="Updated category")
    brand: Optional[str] = Field(None, min_length=1, max_length=100)
    model: Optional[str] = Field(None, min_length=1, max_length=150)
    title: Optional[str] = Field(None, min_length=3, max_length=200)
    description: Optional[str] = Field(None, min_length=5, max_length=5000)
    condition: Optional[str] = Field(None)
    functional_status: Optional[str] = Field(None)
    specifications: Optional[ListingSpecifications] = Field(None)
    images: Optional[List[ListingImageItem]] = Field(None)
    asking_price_inr: Optional[float] = Field(None, gt=0, le=10000000)
    original_price_inr: Optional[float] = Field(None, gt=0)
    warranty: Optional[str] = Field(None)
    return_policy: Optional[str] = Field(None)
    shipping_method: Optional[str] = Field(None)
    location: Optional[str] = Field(None)

    @field_validator("asking_price_inr")
    @classmethod
    def validate_price(cls, v: Optional[float]) -> Optional[float]:
        if v is not None:
            if v <= 0:
                raise ValueError("Asking price must be strictly positive.")
            if v > 10_000_000:
                raise ValueError("Asking price exceeds maximum allowed threshold (₹10,000,000).")
            return round(float(v), 2)
        return v


class MarketplaceListingResponse(BaseModel):
    id: str = Field(..., description="Listing unique ID")
    listing_code: str = Field(..., description="Unique human-readable listing code (e.g. LIST-482931)")
    seller: SafeSellerInfo = Field(..., description="Safe seller snapshot")
    is_owner: Optional[bool] = Field(False, description="Whether current requesting user is the listing owner")
    device_id: Optional[str] = Field(None, description="Linked device ID")
    valuation_id: Optional[str] = Field(None, description="Linked valuation ID")
    category: str = Field(..., description="Device category")
    brand: str = Field(..., description="Brand name")
    model: str = Field(..., description="Model name")
    title: str = Field(..., description="Listing title")
    description: str = Field(..., description="Description")
    condition: str = Field(..., description="Cosmetic condition grade")
    functional_status: str = Field("Fully Functional", description="Functional status")
    specifications: ListingSpecifications = Field(default_factory=ListingSpecifications)
    images: List[ListingImageItem] = Field(default_factory=list)
    valuation: Optional[ListingValuationSnapshot] = Field(None, description="AI Valuation snapshot")
    asking_price_inr: float = Field(..., description="Asking price in INR")
    original_price_inr: Optional[float] = Field(None, description="Original MSRP in INR")
    pricing_metadata: Optional[PricingMetadata] = Field(None)
    warranty: Optional[str] = Field("12-Month Revalue Eco Warranty")
    return_policy: Optional[str] = Field("14-Day Free Returns")
    shipping_method: Optional[str] = Field("Insured Eco Express Shipping")
    location: str = Field("India", description="Item location")
    status: ListingStatus = Field(..., description="Listing lifecycle status")
    views: int = Field(0, description="Total views count")
    inquiries: int = Field(0, description="Total inquiries count")
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")
    published_at: Optional[datetime] = Field(None, description="Publish timestamp")
    sold_at: Optional[datetime] = Field(None, description="Sold timestamp")


class MarketplaceListResponse(BaseModel):
    items: List[MarketplaceListingResponse] = Field(..., description="List of marketplace items")
    total: int = Field(..., description="Total matching items count")
    page: int = Field(1, description="Current page number")
    limit: int = Field(20, description="Page limit")
    total_pages: int = Field(1, description="Total available pages")
