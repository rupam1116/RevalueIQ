from enum import Enum
from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field


class LifecycleTierEnum(str, Enum):
    RECOMMENDATION_GENERATED = "recommendation_generated"
    ACTION_INITIATED = "action_initiated"
    EXTERNALLY_COMPLETED = "externally_completed"


class ActivityTypeEnum(str, Enum):
    VALUATION = "valuation"
    REPAIR = "repair"
    MARKETPLACE = "marketplace"
    DONATION = "donation"


class ActivityStatusEnum(str, Enum):
    RECOMMENDED = "Recommended"
    INITIATED = "Initiated"
    IN_PROGRESS = "In Progress"
    LISTED = "Listed"
    COMPLETED = "Completed"
    VERIFIED = "Verified"
    CANCELLED = "Cancelled"


class ActivityDetailsSchema(BaseModel):
    condition_grade: Optional[str] = Field(None, description="Cosmetic or hardware condition grade")
    repair_shop: Optional[str] = Field(None, description="Name of repair center if initiated or repaired")
    buyer_or_ngo: Optional[str] = Field(None, description="Buyer name or recipient NGO")
    repair_cost: Optional[float] = Field(None, description="Actual or estimated repair cost in INR")
    resale_price: Optional[float] = Field(None, description="Actual or asking resale price in INR")
    location: Optional[str] = Field(None, description="City or facility location")
    notes: Optional[str] = Field(None, description="User notes or execution remarks")
    external_reference: Optional[str] = Field(None, description="Receipt number, invoice, or drop-off ID")
    completed_at: Optional[datetime] = Field(None, description="Timestamp of verified external completion")


class ActivityItemResponse(BaseModel):
    id: str = Field(..., description="Unique event or document ID")
    event_code: str = Field(..., description="Unique code e.g. EVT-9281, VAL-A7K29, LIST-8392")
    type: ActivityTypeEnum = Field(..., description="Domain type: valuation, repair, marketplace, donation")
    tier: LifecycleTierEnum = Field(..., description="Truth tier: recommendation_generated, action_initiated, externally_completed")
    title: str = Field(..., description="Descriptive event headline")
    device_name: str = Field(..., description="Electronic asset name")
    category: str = Field(..., description="Device category e.g. Phones, Laptops, Audio")
    date: str = Field(..., description="Formatted user-friendly date string")
    timestamp: float = Field(..., description="Epoch millisecond timestamp for sorting")
    status: str = Field(..., description="Truthful status label")
    value_inr: float = Field(0.0, description="Financial value or cost involved in INR")
    description: str = Field(..., description="Truthful summary of what RevalueIQ knows")
    verified_co2_saved_kg: float = Field(0.0, description="Verified avoided CO2 (strictly Tier 3)")
    potential_co2_opportunity_kg: float = Field(0.0, description="Potential CO2 savings identified (Tier 1 & 2)")
    verified_ewaste_prevented_kg: float = Field(0.0, description="Verified diverted e-waste (strictly Tier 3)")
    potential_ewaste_opportunity_kg: float = Field(0.0, description="Potential e-waste diverted identified (Tier 1 & 2)")
    report_id: Optional[str] = Field(None, description="Associated report or certificate ID if applicable")
    can_complete: bool = Field(False, description="True if action is initiated and can be confirmed as completed by user")
    details: ActivityDetailsSchema = Field(default_factory=ActivityDetailsSchema)


class ActivityTimelineResponse(BaseModel):
    items: List[ActivityItemResponse] = Field(default_factory=list)
    total: int = Field(0, description="Total matching activities")
    page: int = Field(1)
    limit: int = Field(20)
    has_more: bool = Field(False)


class MonthlyActivityBucket(BaseModel):
    month: str = Field(..., description="Month identifier e.g. Aug 2026")
    valuations: int = Field(0)
    repairs: int = Field(0)
    sales: int = Field(0)
    donations: int = Field(0)


class CategoryDistributionItem(BaseModel):
    name: str = Field(..., description="Category name")
    count: int = Field(0)
    percentage: float = Field(0.0)


class HistoryAnalyticsResponse(BaseModel):
    total_analyzed_units: int = Field(0, description="Total unique devices analyzed via AI valuations")
    recommendations_count: int = Field(0, description="Tier 1: Recommendations generated")
    actions_initiated_count: int = Field(0, description="Tier 2: Actions initiated")
    externally_completed_count: int = Field(0, description="Tier 3: Verified completions")
    
    repairs_completed: int = Field(0, description="Tier 3: Verified completed repairs")
    repairs_initiated: int = Field(0, description="Tier 2: Initiated repair actions")
    devices_sold: int = Field(0, description="Tier 3: Confirmed sold devices")
    devices_listed: int = Field(0, description="Tier 2: Currently listed devices")
    devices_donated: int = Field(0, description="Tier 3: Confirmed donated devices")
    donations_initiated: int = Field(0, description="Tier 2: Initiated donations")

    verified_co2_saved_kg: float = Field(0.0, description="Realized CO2 savings from confirmed completed actions")
    potential_co2_opportunity_kg: float = Field(0.0, description="Potential CO2 savings from recommendations & active listings")
    verified_ewaste_prevented_kg: float = Field(0.0, description="Realized diverted e-waste from confirmed completed actions")
    potential_ewaste_opportunity_kg: float = Field(0.0, description="Potential diverted e-waste from recommendations & listings")
    
    verified_money_earned_or_saved: float = Field(0.0, description="Real money earned from verified sales or saved from verified repairs")
    circular_score: int = Field(100, ge=0, le=100, description="Truthful score based on actual completed vs potential lifecycle actions")
    
    monthly_trends: List[MonthlyActivityBucket] = Field(default_factory=list, description="Monthly trends from real user events")
    category_breakdown: List[CategoryDistributionItem] = Field(default_factory=list, description="Category distribution from real user events")


class LogLifecycleEventRequest(BaseModel):
    type: ActivityTypeEnum = Field(..., description="Action domain: valuation, repair, marketplace, donation")
    device_name: str = Field(..., min_length=1, max_length=150, description="Device name")
    category: str = Field("Other", description="Device category")
    tier: LifecycleTierEnum = Field(LifecycleTierEnum.ACTION_INITIATED, description="Tier: action_initiated or externally_completed")
    title: str = Field(..., min_length=3, max_length=200, description="Headline of the activity")
    description: Optional[str] = Field(None, max_length=1000, description="Details or context")
    shop_name: Optional[str] = Field(None, description="Repair shop name or service center")
    ngo_name: Optional[str] = Field(None, description="NGO name or donation center")
    value_inr: Optional[float] = Field(0.0, ge=0.0, description="Value or cost in INR")
    device_id: Optional[str] = Field(None, description="Linked user device ID")
    valuation_id: Optional[str] = Field(None, description="Linked valuation ID")
    external_reference: Optional[str] = Field(None, description="Invoice, job sheet, or tracking ID")


class ConfirmCompletionRequest(BaseModel):
    completed_date: Optional[str] = Field(None, description="ISO date or string date when action was completed")
    final_cost_or_earning_inr: Optional[float] = Field(None, ge=0.0, description="Final money paid or earned in INR")
    service_provider_or_recipient: Optional[str] = Field(None, description="Shop name or NGO name")
    completion_notes: Optional[str] = Field(None, max_length=1000, description="User verification notes")
    receipt_or_reference: Optional[str] = Field(None, description="Receipt number, invoice, or certificate ID")


class RecentAuditedDeviceItem(BaseModel):
    id: str = Field(..., description="Device or valuation ID")
    device_name: str = Field(..., description="Device model name")
    brand: str = Field(..., description="Brand")
    category: str = Field(..., description="Category")
    condition: str = Field("Good", description="Condition grade")
    estimated_value_inr: float = Field(0.0, description="Current estimated resale value")
    recommended_action: str = Field(..., description="Strategic recommendation: SELL, REPAIR, DONATE, KEEP")
    status: str = Field(..., description="Current status: In Portfolio, Listed, Repaired, Donated")
    last_updated: str = Field(..., description="Formatted date")
    valuation_id: Optional[str] = None
    device_id: Optional[str] = None


class AuditReportItem(BaseModel):
    id: str = Field(..., description="Report reference ID")
    title: str = Field(..., description="Report title")
    category: str = Field(..., description="Valuation, Repair, Donation, Activity")
    date: str = Field(..., description="Generation date")
    format: str = Field("PDF", description="Document format")
    file_size: str = Field("1.2 MB", description="Estimated or actual document size")
    description: str = Field(..., description="Summary of report contents")
    valuation_id: Optional[str] = None
    event_id: Optional[str] = None
