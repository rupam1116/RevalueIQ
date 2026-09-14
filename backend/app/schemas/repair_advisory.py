import enum
from typing import Optional, List, Any, Dict
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime


class SeverityEnum(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"
    UNKNOWN = "UNKNOWN"


class RepairabilityEnum(str, enum.Enum):
    REPAIRABLE = "REPAIRABLE"
    PARTIALLY_REPAIRABLE = "PARTIALLY_REPAIRABLE"
    NOT_RECOMMENDED = "NOT_RECOMMENDED"
    UNKNOWN = "UNKNOWN"


class RecommendedActionEnum(str, enum.Enum):
    REPAIR = "REPAIR"
    MAINTAIN = "MAINTAIN"
    REPLACE = "REPLACE"
    PROFESSIONAL_INSPECTION = "PROFESSIONAL_INSPECTION"


class DeviceContextInput(BaseModel):
    category: Optional[str] = Field(None, description="Device category e.g. Smartphone, Laptop, Tablet, Audio")
    brand: Optional[str] = Field(None, description="Manufacturer brand e.g. Apple, Dell, Sony")
    model: Optional[str] = Field(None, description="Device model designation")
    ram: Optional[str] = Field(None, description="RAM specification e.g. 16GB")
    storage: Optional[str] = Field(None, description="Storage specification e.g. 256GB")
    purchase_year: Optional[int] = Field(None, description="Year of purchase or manufacture")
    functional_status: Optional[str] = Field(None, description="User reported operational status")
    condition: Optional[str] = Field(None, description="Cosmetic and physical condition grade")
    device_id: Optional[str] = Field(None, description="Optional link to user_devices._id")
    valuation_id: Optional[str] = Field(None, description="Optional link to device_valuations._id")
    previous_damage: Optional[str] = Field(None, description="Known past damages or defects")
    previous_valuation: Optional[float] = Field(None, description="Previous appraised value in INR")

    model_config = ConfigDict(extra="ignore")


class RepairProblemInput(BaseModel):
    symptom_category: Optional[str] = Field(None, description="Primary symptom category e.g. Screen & Battery")
    issue_headline: Optional[str] = Field(None, description="Short summary/title of the problem")
    detailed_description: Optional[str] = Field(None, description="Detailed user description of how the failure happened")
    severity_level: Optional[str] = Field(None, description="User self-assessed severity e.g. Low, Medium, High, Critical")
    power_status: Optional[bool] = Field(None, description="True if device powers on, False otherwise")
    liquid_exposure: Optional[bool] = Field(None, description="True if device was exposed to liquid/moisture")
    previous_repair_history: Optional[bool] = Field(None, description="True if device was previously repaired")
    symptoms: Optional[List[str]] = Field(default_factory=list, description="List of specific symptoms observed")
    user_description: Optional[str] = Field(None, description="Alternative raw user description field")
    additional_notes: Optional[str] = Field(None, description="Any additional context or user notes")

    model_config = ConfigDict(extra="ignore")


class RepairAdvisoryRequest(BaseModel):
    device_id: Optional[str] = Field(None, description="Registered device ID in user_devices")
    valuation_id: Optional[str] = Field(None, description="Existing valuation ID if applicable")
    device_context: Optional[DeviceContextInput] = Field(default_factory=DeviceContextInput)
    problem_input: Optional[RepairProblemInput] = Field(default_factory=RepairProblemInput)
    image_reference: Optional[str] = Field(None, description="Base64 data URI, HTTP URL, or image bytes reference")
    additional_notes: Optional[str] = Field(None, description="Additional context or remarks")

    model_config = ConfigDict(extra="ignore")


class RequiredPartSchema(BaseModel):
    name: str = Field(..., description="Part name e.g. OEM OLED Display Assembly")
    estimated_cost_inr: Optional[float] = Field(None, description="Estimated component cost in Indian Rupees (INR)")
    part_type: Optional[str] = Field("OEM", description="OEM or Aftermarket")
    availability: Optional[str] = Field("Available", description="Sourcing availability status")

    model_config = ConfigDict(extra="ignore")


class GeminiRepairAdvisoryResult(BaseModel):
    diagnosis: str = Field(..., description="Technical diagnosis summary")
    problem_detected: str = Field(..., description="Specific problem identified by AI analysis")
    severity: SeverityEnum = Field(SeverityEnum.UNKNOWN, description="Assessed severity level")
    repairability: RepairabilityEnum = Field(RepairabilityEnum.UNKNOWN, description="Repair feasibility rating")
    recommended_action: RecommendedActionEnum = Field(RecommendedActionEnum.PROFESSIONAL_INSPECTION, description="Recommended next action")
    possible_causes: List[str] = Field(default_factory=list, description="List of probable root causes")
    recommended_steps: List[str] = Field(default_factory=list, description="Step-by-step recommended remedy or repair procedures")
    required_parts: List[RequiredPartSchema] = Field(default_factory=list, description="List of components required for repair")
    parts_cost: Optional[float] = Field(None, description="Estimated total parts cost in Indian Rupees (INR)")
    labor_cost: Optional[float] = Field(None, description="Estimated professional labor cost in Indian Rupees (INR)")
    estimated_repair_cost: Optional[float] = Field(None, description="Total estimated repair cost in Indian Rupees (INR)")
    minimum_repair_cost: Optional[float] = Field(None, description="Estimated lower bound repair cost in INR")
    maximum_repair_cost: Optional[float] = Field(None, description="Estimated upper bound repair cost in INR")
    safety_warnings: List[str] = Field(default_factory=list, description="Crucial safety warnings for battery/electrical hazards")
    confidence: float = Field(0.0, ge=0.0, le=1.0, description="Confidence score between 0.0 and 1.0")
    reasoning: str = Field("", description="Clear, user-facing explanation of the diagnosis and recommendation")

    model_config = ConfigDict(extra="ignore")


class RepairAdvisoryResponse(BaseModel):
    id: str = Field(..., description="MongoDB ObjectId string")
    advisory_code: str = Field(..., description="Human-readable unique code e.g. ADV-849201")
    user_id: str = Field(..., description="Owner user ID")
    device_id: Optional[str] = Field(None, description="Linked registered device ID if applicable")
    valuation_id: Optional[str] = Field(None, description="Linked valuation ID if applicable")
    status: str = Field("completed", description="Status of the advisory e.g. completed, pending")
    device_info: Dict[str, Any] = Field(default_factory=dict, description="Hydrated user-confirmed device specifications")
    problem_input: Dict[str, Any] = Field(default_factory=dict, description="User reported symptoms and problem context")
    ai_analysis: GeminiRepairAdvisoryResult = Field(..., description="Structured AI diagnosis and repair recommendations")
    image_metadata: Optional[Dict[str, Any]] = Field(None, description="Information on processed image")
    created_at: datetime = Field(..., description="Timestamp of advisory creation")
    updated_at: datetime = Field(..., description="Timestamp of last update")

    model_config = ConfigDict(extra="ignore")


class RepairAdvisoryListResponse(BaseModel):
    advisories: List[RepairAdvisoryResponse] = Field(default_factory=list)
    total: int = 0
