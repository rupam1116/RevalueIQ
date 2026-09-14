from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, field_validator

ALLOWED_CATEGORIES = {
    "Smartphone",
    "Laptop",
    "Tablet",
    "Smartwatch",
    "Audio",
    "Gaming",
    "Desktop",
    "Camera",
    "Other",
}

ALLOWED_STATUSES = {
    "Active",
    "Listed",
    "Repaired",
    "Donated",
    "Recycled",
    "Sold",
}

ALLOWED_CONDITIONS = {
    "Excellent",
    "Good",
    "Fair",
    "Poor",
    "Grade A+",
    "Grade A",
    "Grade B",
    "Grade C",
    "Cracked/Damaged",
    "Unknown",
}


class DeviceBase(BaseModel):
    brand: str = Field(..., min_length=1, max_length=100, description="Device brand (e.g. Apple, Samsung, Dell)")
    model: str = Field(..., min_length=1, max_length=100, description="Device model (e.g. iPhone 15 Pro Max, XPS 15)")
    category: str = Field(..., description="Device category/type (e.g. Smartphone, Laptop, Tablet, Smartwatch, Audio, Gaming, Desktop, Other)")
    storage: Optional[str] = Field(default="", max_length=50, description="Storage capacity (e.g. 256GB)")
    ram: Optional[str] = Field(default="", max_length=50, description="RAM memory (e.g. 8GB)")
    serial_number: Optional[str] = Field(default="", max_length=100, description="Device serial number")
    purchase_year: Optional[str] = Field(default="", max_length=10, description="Year of purchase (e.g. 2023)")
    condition: Optional[str] = Field(default="Good", description="Physical/functional condition")
    status: Optional[str] = Field(default="Active", description="Current lifecycle status")
    primary_image: Optional[str] = Field(default="", description="Primary image URL")
    notes: Optional[str] = Field(default="", max_length=1000, description="Additional notes or specifications")

    @field_validator("category")
    @classmethod
    def validate_category(cls, v: str) -> str:
        v_clean = v.strip()
        if not v_clean:
            raise ValueError("Category cannot be empty.")
        if v_clean not in ALLOWED_CATEGORIES:
            allowed_list = ", ".join(sorted(ALLOWED_CATEGORIES))
            raise ValueError(f"Invalid device category '{v_clean}'. Allowed values: {allowed_list}")
        return v_clean

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: Optional[str]) -> Optional[str]:
        if not v:
            return "Active"
        v_clean = v.strip()
        if v_clean not in ALLOWED_STATUSES:
            allowed_list = ", ".join(sorted(ALLOWED_STATUSES))
            raise ValueError(f"Invalid device status '{v_clean}'. Allowed values: {allowed_list}")
        return v_clean

    @field_validator("condition")
    @classmethod
    def validate_condition(cls, v: Optional[str]) -> Optional[str]:
        if not v:
            return "Good"
        v_clean = v.strip()
        if v_clean not in ALLOWED_CONDITIONS:
            allowed_list = ", ".join(sorted(ALLOWED_CONDITIONS))
            raise ValueError(f"Invalid condition rating '{v_clean}'. Allowed values: {allowed_list}")
        return v_clean

    @field_validator("purchase_year")
    @classmethod
    def validate_purchase_year(cls, v: Optional[str]) -> Optional[str]:
        if not v or not v.strip():
            return ""
        val = v.strip()
        if val.isdigit():
            year_int = int(val)
            current_year = datetime.now().year
            if year_int < 1980 or year_int > current_year + 1:
                raise ValueError(f"Purchase year must be between 1980 and {current_year + 1}.")
        return val


class DeviceCreate(DeviceBase):
    pass


class DeviceUpdate(BaseModel):
    brand: Optional[str] = Field(default=None, min_length=1, max_length=100)
    model: Optional[str] = Field(default=None, min_length=1, max_length=100)
    category: Optional[str] = Field(default=None)
    storage: Optional[str] = Field(default=None, max_length=50)
    ram: Optional[str] = Field(default=None, max_length=50)
    serial_number: Optional[str] = Field(default=None, max_length=100)
    purchase_year: Optional[str] = Field(default=None, max_length=10)
    condition: Optional[str] = Field(default=None)
    status: Optional[str] = Field(default=None)
    primary_image: Optional[str] = Field(default=None)
    notes: Optional[str] = Field(default=None, max_length=1000)

    @field_validator("category")
    @classmethod
    def validate_category(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return None
        v_clean = v.strip()
        if v_clean not in ALLOWED_CATEGORIES:
            allowed_list = ", ".join(sorted(ALLOWED_CATEGORIES))
            raise ValueError(f"Invalid device category '{v_clean}'. Allowed values: {allowed_list}")
        return v_clean

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return None
        v_clean = v.strip()
        if v_clean not in ALLOWED_STATUSES:
            allowed_list = ", ".join(sorted(ALLOWED_STATUSES))
            raise ValueError(f"Invalid device status '{v_clean}'. Allowed values: {allowed_list}")
        return v_clean

    @field_validator("condition")
    @classmethod
    def validate_condition(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return None
        v_clean = v.strip()
        if v_clean not in ALLOWED_CONDITIONS:
            allowed_list = ", ".join(sorted(ALLOWED_CONDITIONS))
            raise ValueError(f"Invalid condition rating '{v_clean}'. Allowed values: {allowed_list}")
        return v_clean

    @field_validator("purchase_year")
    @classmethod
    def validate_purchase_year(cls, v: Optional[str]) -> Optional[str]:
        if v is None or not v.strip():
            return v
        val = v.strip()
        if val.isdigit():
            year_int = int(val)
            current_year = datetime.now().year
            if year_int < 1980 or year_int > current_year + 1:
                raise ValueError(f"Purchase year must be between 1980 and {current_year + 1}.")
        return val


class DeviceResponse(DeviceBase):
    id: str = Field(..., description="MongoDB Device Document ID")
    user_id: str = Field(..., description="Owner User ID")
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
