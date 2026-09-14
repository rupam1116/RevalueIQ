from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field, ConfigDict


class UserProfileSchema(BaseModel):
    phone: Optional[str] = ""
    avatar_url: Optional[str] = ""
    bio: Optional[str] = ""
    city: Optional[str] = ""
    country: Optional[str] = ""
    occupation: Optional[str] = ""
    organization: Optional[str] = ""
    circular_score: int = 100
    circular_grade: str = "A"
    co2_saved_kg: float = 0.0
    ewaste_prevented_kg: float = 0.0
    karma_points: int = 0
    level: int = 1
    social_links: Dict[str, str] = Field(default_factory=dict)

    model_config = ConfigDict(from_attributes=True)


class AuthUserResponse(BaseModel):
    id: str
    firebase_uid: str
    email: str
    display_name: str
    photo_url: Optional[str] = None
    role: str = "user"
    status: str = "active"
    is_active: bool = True
    is_verified: bool = False
    created_at: Optional[datetime] = None
    last_login_at: Optional[datetime] = None
    profile: Optional[UserProfileSchema] = None

    model_config = ConfigDict(from_attributes=True)


class AuthSyncRequest(BaseModel):
    full_name: Optional[str] = None
    photo_url: Optional[str] = None
    phone: Optional[str] = None
