import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Header, Request, status
from pymongo.asynchronous.database import AsyncDatabase

from app.api.deps import get_db, get_current_user, AuthenticatedUser
from app.schemas.payments import (
    CreatePaymentOrderRequest,
    CreatePaymentOrderResponse,
    VerifyPaymentRequest,
    PaymentResponse,
    PaymentListResponse,
    RefundPaymentRequest,
)
from app.services.payment_service import (
    create_payment_order,
    verify_payment_signature,
    handle_razorpay_webhook,
    list_user_payments,
    get_payment_by_id,
    refund_payment,
)

logger = logging.getLogger("revalueiq.api.payments")

router = APIRouter(prefix="/payments", tags=["Payments & Transactions"])


@router.post(
    "/orders",
    response_model=CreatePaymentOrderResponse,
    summary="Create Payment Order",
    description="Creates an internal payment record and Razorpay gateway order. Payable amount is derived strictly from the backend business record."
)
async def create_order_endpoint(
    body: CreatePaymentOrderRequest,
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db)
) -> CreatePaymentOrderResponse:
    """
    Protected Endpoint: POST /api/v1/payments/orders
    """
    try:
        return await create_payment_order(
            db=db,
            user_id=current_user.id,
            purpose=body.purpose,
            related_entity_type=body.related_entity_type,
            related_entity_id=body.related_entity_id,
            notes=body.notes,
        )
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Error creating payment order: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create payment order."
        )


@router.post(
    "/verify",
    response_model=PaymentResponse,
    summary="Verify Payment Signature",
    description="Cryptographically verifies the gateway HMAC SHA256 signature server-side. Authoritative status update and order fulfillment."
)
async def verify_payment_endpoint(
    body: VerifyPaymentRequest,
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db)
) -> PaymentResponse:
    """
    Protected Endpoint: POST /api/v1/payments/verify
    """
    try:
        return await verify_payment_signature(
            db=db,
            user_id=current_user.id,
            req=body,
        )
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Error verifying payment signature: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to verify payment signature."
        )


@router.post(
    "/webhook",
    summary="Razorpay Gateway Webhook",
    description="Public webhook listener. Validates HMAC signature against raw request body using PAYMENT_WEBHOOK_SECRET."
)
async def webhook_endpoint(
    request: Request,
    x_razorpay_signature: Optional[str] = Header(None, alias="X-Razorpay-Signature"),
    db: AsyncDatabase = Depends(get_db)
):
    """
    Public Gateway Webhook Endpoint: POST /api/v1/payments/webhook
    """
    if not x_razorpay_signature:
        raise HTTPException(status_code=400, detail="Missing X-Razorpay-Signature header.")

    raw_body = await request.body()
    return await handle_razorpay_webhook(db, raw_body, x_razorpay_signature)


@router.get(
    "",
    response_model=PaymentListResponse,
    summary="List Payment History",
    description="Retrieves real authenticated user's payment records with status filter and pagination."
)
async def list_payments_endpoint(
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by status: PAID, FAILED, CREATED, REFUNDED"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db)
) -> PaymentListResponse:
    """
    Protected Endpoint: GET /api/v1/payments
    """
    try:
        items, total = await list_user_payments(
            db=db,
            user_id=current_user.id,
            status_filter=status_filter,
            page=page,
            limit=limit,
        )
        has_more = (page * limit) < total
        return PaymentListResponse(
            items=items,
            total=total,
            page=page,
            limit=limit,
            has_more=has_more,
        )
    except Exception as exc:
        logger.error(f"Error listing payments: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to fetch payment history."
        )


@router.get(
    "/{payment_id}",
    response_model=PaymentResponse,
    summary="Get Payment Details",
    description="Retrieves detailed payment record for authenticated user with strict IDOR ownership check."
)
async def get_payment_endpoint(
    payment_id: str,
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db)
) -> PaymentResponse:
    """
    Protected Endpoint: GET /api/v1/payments/{payment_id}
    """
    return await get_payment_by_id(db=db, user_id=current_user.id, payment_id=payment_id)


@router.post(
    "/{payment_id}/refund",
    response_model=PaymentResponse,
    summary="Process Refund",
    description="Processes refund for a completed transaction after validating ownership."
)
async def refund_payment_endpoint(
    payment_id: str,
    body: RefundPaymentRequest,
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db)
) -> PaymentResponse:
    """
    Protected Endpoint: POST /api/v1/payments/{payment_id}/refund
    """
    return await refund_payment(
        db=db,
        user_id=current_user.id,
        payment_id=payment_id,
        reason=body.reason,
        amount_inr=body.amount_inr,
    )
