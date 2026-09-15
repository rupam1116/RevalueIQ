from typing import Optional, Dict, Any, List
from datetime import datetime
from pydantic import BaseModel, Field


# -------------------------------------------------------------
# 1. Notification Preferences
# -------------------------------------------------------------
class NotificationPreferencesSchema(BaseModel):
    in_app: bool = Field(default=True, description="Enable in-app notifications")
    email_notifications: bool = Field(default=True, description="Enable email alerts")
    push_notifications: bool = Field(default=True, description="Enable push notifications")
    sms_notifications: bool = Field(default=False, description="Enable SMS text alerts")
    marketplace_alerts: bool = Field(default=True, description="Marketplace resale offers and buyer messages")
    repair_status_updates: bool = Field(default=True, description="Repair center inspection and turnaround updates")
    donation_impact_reports: bool = Field(default=True, description="Monthly donation impact reports")
    promotional_newsletters: bool = Field(default=False, description="Eco tech trends and newsletter announcements")


# -------------------------------------------------------------
# 2. Privacy Preferences
# -------------------------------------------------------------
class CookiePreferencesSchema(BaseModel):
    essential: bool = Field(default=True, description="Strictly necessary session cookies")
    analytics: bool = Field(default=True, description="Performance and telemetry cookies")
    marketing: bool = Field(default=False, description="Personalization and advertising cookies")
    functional: bool = Field(default=True, description="Preference and functional cookies")


class PrivacyPreferencesSchema(BaseModel):
    profile_visibility: str = Field(default="Public", description="Public, Members Only, or Private")
    activity_visibility: str = Field(default="Public", description="Public, Followers Only, or Private")
    stats_visibility: str = Field(default="Public Leaderboards", description="Public Leaderboards, Members Only, or Hidden")
    search_engine_indexing: bool = Field(default=True, description="Allow search engines to index profile")
    ai_data_personalization: bool = Field(default=True, description="Use past appraisal history for recommendations")
    anonymized_analytics: bool = Field(default=True, description="Send anonymous telemetry & crash analytics")
    cookies: CookiePreferencesSchema = Field(default_factory=CookiePreferencesSchema)


# -------------------------------------------------------------
# 3. Application Preferences
# -------------------------------------------------------------
class AccessibilityOptionsSchema(BaseModel):
    high_contrast: bool = Field(default=False, description="High contrast visual mode")
    reduced_motion: bool = Field(default=False, description="Minimize motion and animations")


class AppPreferencesSchema(BaseModel):
    theme: str = Field(default="Dark", description="Light, Dark, or System Default")
    language: str = Field(default="English (US)", description="Application display language")
    currency: str = Field(default="INR (₹)", description="Platform currency locked to INR")
    distance_unit: str = Field(default="Kilometers (km)", description="Kilometers (km) or Miles (mi)")
    date_format: str = Field(default="YYYY-MM-DD", description="Date format")
    accessibility: AccessibilityOptionsSchema = Field(default_factory=AccessibilityOptionsSchema)
    animations: bool = Field(default=True, description="Enable UI animations and transitions")
    compact_mode: bool = Field(default=False, description="Higher density table & list layout")


# -------------------------------------------------------------
# 4. AI Preferences
# -------------------------------------------------------------
class AiPreferencesSchema(BaseModel):
    preferred_recommendation_style: str = Field(
        default="Balanced",
        description="Repair First, Sell First, Donation First, or Balanced"
    )
    enable_ai_learning: bool = Field(default=True, description="Enable AI continuous learning from feedback")
    enable_personalized_suggestions: bool = Field(default=True, description="Enable personalized alerts and pricing")
    allow_ai_device_history: bool = Field(default=True, description="Retain past device diagnostic grades")


# -------------------------------------------------------------
# 5. Combined Settings Models
# -------------------------------------------------------------
class UserSettingsResponse(BaseModel):
    user_id: str
    notifications: NotificationPreferencesSchema
    privacy: PrivacyPreferencesSchema
    preferences: AppPreferencesSchema
    ai: AiPreferencesSchema
    updated_at: Optional[datetime] = None


class UserSettingsUpdateRequest(BaseModel):
    notifications: Optional[NotificationPreferencesSchema] = None
    privacy: Optional[PrivacyPreferencesSchema] = None
    preferences: Optional[AppPreferencesSchema] = None
    ai: Optional[AiPreferencesSchema] = None


# -------------------------------------------------------------
# 6. Support & Feedback
# -------------------------------------------------------------
class SupportTicketCreateRequest(BaseModel):
    type: str = Field(..., description="contact, bug, or feature")
    subject: str = Field(..., min_length=3, max_length=150, description="Summary subject")
    details: str = Field(..., min_length=10, max_length=3000, description="Detailed description")


class SupportTicketResponse(BaseModel):
    id: str
    user_id: str
    type: str
    subject: str
    details: str
    status: str
    created_at: datetime


# -------------------------------------------------------------
# 7. Account Data Export
# -------------------------------------------------------------
class AccountExportResponse(BaseModel):
    export_id: str
    exported_at: datetime
    user: Dict[str, Any]
    profile: Dict[str, Any]
    settings: Dict[str, Any]
    devices: List[Dict[str, Any]]
    valuations: List[Dict[str, Any]]
    repair_reports: List[Dict[str, Any]]
    marketplace_listings: List[Dict[str, Any]]
    donations: List[Dict[str, Any]]
    payments: List[Dict[str, Any]]
    notifications: List[Dict[str, Any]]
