from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field


class SocialLinksSchema(BaseModel):
    linkedin: Optional[str] = Field(default="", description="LinkedIn profile URL")
    github: Optional[str] = Field(default="", description="GitHub profile URL")
    twitter: Optional[str] = Field(default="", description="Twitter/X profile URL")
    website: Optional[str] = Field(default="", description="Personal website URL")


class UserProfileResponse(BaseModel):
    id: str = Field(..., description="MongoDB User ID")
    firebase_uid: str = Field(..., description="Firebase Unique User Identifier")
    email: str = Field(..., description="User primary email address")
    full_name: str = Field(..., description="User full display name")
    photo_url: Optional[str] = Field(default="", description="Avatar or photo URL")
    phone: Optional[str] = Field(default="", description="Contact phone number")
    bio: Optional[str] = Field(default="", description="Short user bio")
    city: Optional[str] = Field(default="", description="City/region")
    country: Optional[str] = Field(default="", description="Country")
    occupation: Optional[str] = Field(default="", description="Occupation or role")
    organization: Optional[str] = Field(default="", description="Organization or company")
    role: str = Field(..., description="User platform authorization role")
    status: str = Field(..., description="User account status")
    circular_score: int = Field(..., description="Circular economy sustainability score")
    circular_grade: str = Field(default="A", description="Circular grade rating")
    co2_saved_kg: float = Field(..., description="Total CO2 saved in kilograms")
    ewaste_prevented_kg: float = Field(..., description="Total e-waste diverted in kilograms")
    karma_points: int = Field(..., description="Accumulated karma points")
    level: int = Field(..., description="User gamification level")
    social_links: Optional[SocialLinksSchema] = Field(default_factory=SocialLinksSchema)
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class UserProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = Field(default=None, max_length=100, description="Full display name")
    photo_url: Optional[str] = Field(default=None, description="Avatar photo URL")
    phone: Optional[str] = Field(default=None, max_length=30, description="Phone number")
    bio: Optional[str] = Field(default=None, max_length=500, description="Short user bio")
    city: Optional[str] = Field(default=None, max_length=100, description="City")
    country: Optional[str] = Field(default=None, max_length=100, description="Country")
    occupation: Optional[str] = Field(default=None, max_length=100, description="Occupation")
    organization: Optional[str] = Field(default=None, max_length=100, description="Organization")
    social_links: Optional[SocialLinksSchema] = Field(default=None, description="Social profile URLs")


class UserStatsResponse(BaseModel):
    circular_score: int = Field(..., description="Current circular score")
    circular_grade: str = Field(default="A", description="Circular grade rating")
    co2_saved_kg: float = Field(..., description="CO2 saved in kg")
    ewaste_prevented_kg: float = Field(..., description="E-waste prevented in kg")
    karma_points: int = Field(..., description="Karma points")
    level: int = Field(..., description="Current user level")
    devices_count: int = Field(..., description="Total registered user devices")
    valuations_count: int = Field(..., description="Total device AI valuations performed")
    repair_reports_count: int = Field(..., description="Total repair reports generated")
    marketplace_listings_count: int = Field(..., description="Total active/past marketplace listings")
    donations_count: int = Field(..., description="Total completed device donations")
