from enum import Enum
from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field


class PaymentStatus(str, Enum):
    CREATED = "CREATED"
    PENDING = "PENDING"
    AUTHORIZED = "AUTHORIZED"
    PAID = "PAID"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"
    REFUNDED = "REFUNDED"
    PARTIALLY_REFUNDED = "PARTIALLY_REFUNDED"


class PaymentPurpose(str, Enum):
    MARKETPLACE_PURCHASE = "MARKETPLACE_PURCHASE"
    REPAIR_SERVICE_DEPOSIT = "REPAIR_SERVICE_DEPOSIT"


class CreatePaymentOrderRequest(BaseModel):
    purpose: PaymentPurpose = Field(default=PaymentPurpose.MARKETPLACE_PURCHASE, description="Payment business purpose")
    related_entity_type: str = Field(..., description="Entity type, e.g. marketplace_listing or repair_booking")
    related_entity_id: str = Field(..., description="Target business entity ID")
    notes: Optional[Dict[str, Any]] = Field(default=None, description="Optional safe metadata")


class CreatePaymentOrderResponse(BaseModel):
    payment_id: str = Field(..., description="Internal MongoDB payment ID")
    razorpay_order_id: str = Field(..., description="Razorpay gateway order ID")
    amount_inr: float = Field(..., description="Payable amount in INR")
    amount_paise: int = Field(..., description="Amount in minor currency unit (paise)")
    currency: str = Field(default="INR")
    status: PaymentStatus = Field(default=PaymentStatus.CREATED)
    key_id: str = Field(..., description="Razorpay public Key ID for checkout popup")
    purpose: str
    related_entity_type: str
    related_entity_id: str


class VerifyPaymentRequest(BaseModel):
    payment_id: str = Field(..., description="Internal payment ID")
    razorpay_order_id: str = Field(..., description="Razorpay Order ID")
    razorpay_payment_id: str = Field(..., description="Razorpay Payment ID")
    razorpay_signature: str = Field(..., description="Razorpay HMAC SHA256 Signature")


class RefundPaymentRequest(BaseModel):
    reason: Optional[str] = Field(default="User requested refund", description="Refund justification")
    amount_inr: Optional[float] = Field(default=None, description="Optional partial refund amount in INR")


class PaymentResponse(BaseModel):
    id: str
    order_id: str
    user_id: str
    gateway: str = "razorpay"
    gateway_order_id: str
    gateway_payment_id: Optional[str] = None
    amount_inr: float
    amount_paise: int
    currency: str = "INR"
    status: PaymentStatus
    purpose: str
    related_entity_type: str
    related_entity_id: str
    receipt_reference: str
    created_at: datetime
    paid_at: Optional[datetime] = None
    failed_at: Optional[datetime] = None
    refunded_at: Optional[datetime] = None
    refund_id: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


class PaymentListResponse(BaseModel):
    items: List[PaymentResponse]
    total: int
    page: int
    limit: int
    has_more: bool
