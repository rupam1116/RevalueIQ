from datetime import datetime
from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class EcoPlanTier(str, Enum):
    FREE = "free"
    PRO = "pro"
    ENTERPRISE = "enterprise"


class BillingCycle(str, Enum):
    MONTHLY = "monthly"
    YEARLY = "yearly"


class PlanFeatureItem(BaseModel):
    title: str
    included: bool = True
    is_new: bool = False
    badge: Optional[str] = None


class EcoPlanDetail(BaseModel):
    id: str
    name: str
    tagline: str
    price_monthly_inr: float
    price_yearly_inr: float
    popular: bool = False
    badge: Optional[str] = None
    features: List[PlanFeatureItem]
    limits: Dict[str, Any]


class UserSubscriptionResponse(BaseModel):
    tier: str = Field(default="free", description="Active plan tier: free, pro, enterprise")
    tier_name: str = Field(default="Eco Starter", description="Display name of tier")
    status: str = Field(default="active", description="active, trialing, cancelled, expired")
    billing_cycle: str = Field(default="monthly", description="monthly or yearly")
    started_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None
    is_pro_or_higher: bool = False
    is_enterprise: bool = False
    monthly_valuations_limit: int = 5
    monthly_valuations_used: int = 0
    eco_credits_multiplier: float = 1.0
    karma_multiplier: float = 1.0
    can_export_certificates: bool = False
    has_api_access: bool = False
    has_cv_diagnostics: bool = False
    recent_invoices: List[Dict[str, Any]] = Field(default_factory=list)


class ActivatePlanRequest(BaseModel):
    tier: EcoPlanTier = Field(..., description="Target eco plan tier: free, pro, enterprise")
    billing_cycle: BillingCycle = Field(default=BillingCycle.MONTHLY, description="Billing frequency")


class ActivatePlanResponse(BaseModel):
    success: bool
    message: str
    tier: str
    tier_name: str
    status: str
    billing_cycle: str
    expires_at: Optional[datetime] = None
    invoice_id: Optional[str] = None
