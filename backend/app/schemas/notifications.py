from enum import Enum
from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field


class NotificationType(str, Enum):
    PAYMENT_SUCCESS = "PAYMENT_SUCCESS"
    PAYMENT_FAILED = "PAYMENT_FAILED"
    PAYMENT_REFUNDED = "PAYMENT_REFUNDED"
    VALUATION_COMPLETED = "VALUATION_COMPLETED"
    REPAIR_ADVISORY_READY = "REPAIR_ADVISORY_READY"
    REPAIR_ACTION_INITIATED = "REPAIR_ACTION_INITIATED"
    MARKETPLACE_LISTING_PUBLISHED = "MARKETPLACE_LISTING_PUBLISHED"
    MARKETPLACE_ITEM_SOLD = "MARKETPLACE_ITEM_SOLD"
    DONATION_ACTION_INITIATED = "DONATION_ACTION_INITIATED"
    LIFECYCLE_COMPLETED = "LIFECYCLE_COMPLETED"
    IMPACT_UPDATED = "IMPACT_UPDATED"
    SECURITY = "SECURITY"


class NotificationResponse(BaseModel):
    id: str
    user_id: str
    type: NotificationType
    title: str
    message: str
    related_entity_type: Optional[str] = None
    related_entity_id: Optional[str] = None
    action_url: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    is_read: bool = False
    read_at: Optional[datetime] = None
    created_at: datetime


class NotificationListResponse(BaseModel):
    items: List[NotificationResponse]
    total: int
    unread_count: int
    page: int
    limit: int
    has_more: bool


class UnreadCountResponse(BaseModel):
    unread_count: int
