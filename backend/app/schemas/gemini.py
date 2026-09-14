from typing import Optional
from pydantic import BaseModel, Field


class GeminiAnalysisResult(BaseModel):
    """
    Structured Pydantic schema for Google Gemini AI device image analysis output.
    """
    device_name: Optional[str] = Field(
        None,
        description="Identified or inferable electronic device name, or 'Unknown' if unidentifiable"
    )
    category: Optional[str] = Field(
        None,
        description="Device category e.g. Smartphone, Laptop, Tablet, Smartwatch, Audio, Gaming Console, Other"
    )
    brand: Optional[str] = Field(
        None,
        description="Manufacturer/Brand if identifiable from visible logos/design e.g. Apple, Samsung, Dell, Sony, or 'Unknown'"
    )
    model: Optional[str] = Field(
        None,
        description="Specific model designation if visually identifiable, or 'Unknown'/null"
    )
    visible_condition: Optional[str] = Field(
        None,
        description="Visible physical condition summary e.g. Mint, Excellent, Good, Fair, Cracked Screen, Heavy Wear, Damaged"
    )
    damage_detected: bool = Field(
        False,
        description="Whether visible physical damage (cracks, dents, liquid indicators, broken port) was observed"
    )
    damage_description: Optional[str] = Field(
        None,
        description="Detailed description of identified visible physical damage, or 'None observed'"
    )
    repair_recommendation: Optional[str] = Field(
        None,
        description="Actionable repair/refurbishment recommendation e.g. Screen Replacement, Battery Service, No Repair Needed, Recycle"
    )
    market_recommendation: Optional[str] = Field(
        None,
        description="Primary strategic market recommendation: SELL, REPAIR, KEEP, or REPLACE"
    )
    circular_recommendation: Optional[str] = Field(
        None,
        description="Concise circular economy recommendation explaining environmentally preferable option"
    )
    circularity_score: Optional[int] = Field(
        None,
        ge=0,
        le=100,
        description="RevalueIQ Circularity Score (0 to 100) reflecting repairability, reusability, and lifecycle sustainability"
    )
    estimated_repair_cost: Optional[float] = Field(
        None,
        ge=0.0,
        description="Estimated cost of necessary repairs in currency (INR ₹), or 0.0 if no repair needed"
    )
    estimated_resale_value: Optional[float] = Field(
        None,
        ge=0.0,
        description="Estimated current fair market resale value in currency (INR ₹) based on condition and specifications"
    )
    confidence: Optional[float] = Field(
        None,
        ge=0.0,
        le=1.0,
        description="Confidence score for visual analysis between 0.0 (uncertain) and 1.0 (highly accurate)"
    )
    reasoning: Optional[str] = Field(
        None,
        description="Short reasoning explaining visual observations, condition assessment, and valuation estimates"
    )


class DeviceDetectionResult(BaseModel):
    """
    Structured Pydantic schema for Google Gemini AI automatic device detection output.
    """
    device_name: Optional[str] = Field(
        None,
        description="Detected device name or title, e.g. 'Dell Inspiron 15 3520' or 'Sony WH-1000XM5'"
    )
    category: Optional[str] = Field(
        None,
        description="Device category e.g. Smartphone, Laptop, Tablet, Smartwatch, Audio, Gaming Console, Other"
    )
    brand: Optional[str] = Field(
        None,
        description="Brand/Manufacturer e.g. Apple, Dell, Sony, Samsung, Nintendo, Logitech"
    )
    model: Optional[str] = Field(
        None,
        description="Specific model designation if visually clear, otherwise null"
    )
    purchase_year: Optional[int] = Field(
        None,
        description="Estimated purchase year if inferable/visible, otherwise null"
    )
    storage_capacity: Optional[str] = Field(
        None,
        description="Storage capacity if visible e.g. 256GB, otherwise null"
    )
    ram: Optional[str] = Field(
        None,
        description="RAM memory if visible e.g. 16GB, otherwise null"
    )
    functional_status: Optional[str] = Field(
        None,
        description="Functional status if observable, otherwise null"
    )
    visible_condition: Optional[str] = Field(
        None,
        description="Visible physical condition summary"
    )
    damage_detected: bool = Field(
        False,
        description="Whether visible physical damage was observed"
    )
    damage_description: Optional[str] = Field(
        None,
        description="Description of visible physical damage or null"
    )
    confidence: float = Field(
        0.0,
        ge=0.0,
        le=1.0,
        description="Detection confidence score between 0.0 and 1.0"
    )

