from enum import Enum
from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field


class ValuationStatus(str, Enum):
    PENDING = "pending"
    ANALYZING = "analyzing"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class ValuationInputData(BaseModel):
    device_name: Optional[str] = Field(None, description="Name or title of the electronic device")
    category: Optional[str] = Field(None, description="Device category e.g. Smartphone, Laptop, Tablet, Smartwatch, Audio, Other")
    brand: Optional[str] = Field(None, description="Brand/Manufacturer")
    model: Optional[str] = Field(None, description="Model designation")
    image_reference: Optional[str] = Field(None, description="Optional image URL or reference key")
    storage: Optional[str] = Field(None, description="Storage capacity e.g. 256GB")
    ram: Optional[str] = Field(None, description="RAM memory e.g. 16GB")
    purchase_year: Optional[int] = Field(None, description="Purchase or release year")
    condition: Optional[str] = Field(None, description="User-confirmed or detected physical condition")
    functional_status: Optional[str] = Field(None, description="Functional status")
    has_original_box: Optional[bool] = Field(None, description="Whether original packaging/box is included")
    has_charger: Optional[bool] = Field(None, description="Whether original charger/cable is included")
    additional_notes: Optional[str] = Field(None, description="User notes or damage description")


class ValuationResultData(BaseModel):
    estimated_resale_value: Optional[float] = Field(None, description="Estimated fair resale price in INR ₹")
    repair_estimate: Optional[float] = Field(None, description="Estimated cost of repairs in INR ₹ (backward compatible)")
    estimated_repair_cost: Optional[float] = Field(None, description="Estimated cost of repairs in INR ₹")
    recommendation: Optional[str] = Field(None, description="Recommended repair/action (backward compatible)")
    market_recommendation: Optional[str] = Field(None, description="Strategic market action: SELL, REPAIR, KEEP, REPLACE")
    circular_recommendation: Optional[str] = Field(None, description="Environmentally preferable circular recommendation")
    circularity_score: Optional[int] = Field(None, ge=0, le=100, description="RevalueIQ Circularity Score (0-100)")
    confidence: Optional[float] = Field(None, ge=0.0, le=1.0, description="Confidence score between 0.0 and 1.0")
    reasoning: Optional[str] = Field(None, description="Short user-facing explanation of the recommendation")
    condition: Optional[str] = Field(None, description="Device condition")
    damage_detected: Optional[bool] = Field(False, description="Whether physical damage was detected")
    damage_description: Optional[str] = Field(None, description="Damage description")
    repair_recommendation: Optional[str] = Field(None, description="Specific repair action recommendation")


class CreateValuationRequest(BaseModel):
    device_id: Optional[str] = Field(None, description="Optional BSON ObjectId of registered user device")
    input: Optional[ValuationInputData] = Field(None, description="Structured device input for appraisal")
    device_name: Optional[str] = Field(None, description="Convenience field: device name")
    category: Optional[str] = Field(None, description="Convenience field: device category")
    brand: Optional[str] = Field(None, description="Convenience field: brand")
    model: Optional[str] = Field(None, description="Convenience field: model")
    image_reference: Optional[str] = Field(None, description="Convenience field: image reference key/URL")


class ValuationResponse(BaseModel):
    id: str = Field(..., description="Valuation document ID")
    valuation_code: str = Field(..., description="Server-generated unique code e.g. VAL-A7K29P4X")
    user_id: str = Field(..., description="Owner user ID")
    device_id: Optional[str] = Field(None, description="Linked user device ID if applicable")
    status: ValuationStatus = Field(..., description="Appraisal status: pending, processing, completed, failed")
    input: ValuationInputData = Field(..., description="Input specifications used for appraisal")
    ai_analysis: Optional[Dict[str, Any]] = Field(None, description="AI vision analysis details (Phase 3.3)")
    valuation: ValuationResultData = Field(..., description="Calculated appraisal values")
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: datetime = Field(..., description="Last updated timestamp")
    completed_at: Optional[datetime] = Field(None, description="Completion timestamp if finalized")


class ValuationStatusResponse(BaseModel):
    id: str = Field(..., description="Valuation document ID")
    valuation_code: str = Field(..., description="Unique valuation code")
    status: ValuationStatus = Field(..., description="Current appraisal status")
    updated_at: datetime = Field(..., description="Last status update timestamp")
    completed_at: Optional[datetime] = Field(None, description="Completion timestamp if completed")


class ValuationListResponse(BaseModel):
    items: List[ValuationResponse] = Field(..., description="List of valuations")
    total: int = Field(..., description="Total count of valuations")


class DeviceDetectionRequest(BaseModel):
    image_reference: str = Field(..., description="Base64 data URI, HTTP URL, or image reference string for detection")


class DeviceDetectionResponse(BaseModel):
    device_detection: Any = Field(..., description="Structured AI device detection result")


class ValuationCertificateResponse(BaseModel):
    certificate_id: str = Field(..., description="Unique certificate ID e.g. CERT-VAL-A7K29P4X")
    valuation_code: str = Field(..., description="Valuation reference code")
    verification_hash: str = Field(..., description="SHA-256 digital verification fingerprint")
    issued_at: datetime = Field(..., description="Certificate issuance timestamp")
    owner_id: str = Field(..., description="Owner user ID")
    device_name: str = Field(..., description="Appraised device full name")
    category: str = Field(..., description="Device category")
    brand: str = Field(..., description="Brand")
    model: str = Field(..., description="Model")
    condition: str = Field(..., description="Physical condition grade")
    estimated_resale_value: float = Field(..., description="Fair resale estimate in INR")
    estimated_repair_cost: float = Field(..., description="Repair cost estimate in INR")
    circularity_score: int = Field(..., description="Circularity eco-score (0-100)")
    co2_offset_kg: float = Field(..., description="CO2 offset in kg")
    ewaste_diverted_kg: float = Field(..., description="e-Waste diverted in kg")
    market_recommendation: str = Field(..., description="SELL, REPAIR, KEEP, REPLACE")
    circular_recommendation: str = Field(..., description="Circular recommendation detail")
    ai_confidence: float = Field(..., description="AI model confidence rating")
    materials_recovered: Optional[Dict[str, Any]] = Field(None, description="Precious metals and raw materials recovered breakdown")


class RegisterDeviceFromValuationResponse(BaseModel):
    message: str = Field(default="Device successfully registered in portfolio")
    device_id: str = Field(..., description="BSON ObjectId of created user device")
    valuation_id: str = Field(..., description="Valuation ObjectId")
    status: str = Field(default="registered")


