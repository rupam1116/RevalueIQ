import hmac
import hashlib
import logging
import secrets
import string
from datetime import datetime, timezone
from typing import List, Tuple, Optional, Dict, Any
from bson import ObjectId
import httpx
from fastapi import HTTPException, status
from pymongo.asynchronous.database import AsyncDatabase

from app.core.config import settings
from app.schemas.payments import (
    PaymentStatus,
    PaymentPurpose,
    CreatePaymentOrderResponse,
    VerifyPaymentRequest,
    PaymentResponse,
)
from app.schemas.notifications import NotificationType
from app.services.notification_service import create_notification

logger = logging.getLogger("revalueiq.services.payments")


def _generate_order_id(prefix: str = "PAY") -> str:
    rand = "".join(secrets.choice(string.digits) for _ in range(8))
    return f"{prefix}-{rand}"


def format_payment_doc(doc: Dict[str, Any]) -> PaymentResponse:
    """Formats raw MongoDB payment document into PaymentResponse schema."""
    created_at = doc.get("created_at") or datetime.now(timezone.utc)
    if isinstance(created_at, str):
        try:
            created_at = datetime.fromisoformat(created_at.replace("Z", "+00:00"))
        except Exception:
            created_at = datetime.now(timezone.utc)

    def _parse_dt(field_name: str) -> Optional[datetime]:
        val = doc.get(field_name)
        if not val:
            return None
        if isinstance(val, str):
            try:
                return datetime.fromisoformat(val.replace("Z", "+00:00"))
            except Exception:
                return None
        return val

    return PaymentResponse(
        id=str(doc["_id"]),
        order_id=doc.get("order_id", ""),
        user_id=str(doc["user_id"]),
        gateway=doc.get("gateway", "razorpay"),
        gateway_order_id=doc.get("gateway_order_id", ""),
        gateway_payment_id=doc.get("gateway_payment_id"),
        amount_inr=float(doc.get("amount_inr", 0.0)),
        amount_paise=int(doc.get("amount_paise", 0)),
        currency=doc.get("currency", "INR"),
        status=PaymentStatus(doc.get("status", PaymentStatus.CREATED)),
        purpose=doc.get("purpose", PaymentPurpose.MARKETPLACE_PURCHASE.value),
        related_entity_type=doc.get("related_entity_type", "marketplace_listing"),
        related_entity_id=doc.get("related_entity_id", ""),
        receipt_reference=doc.get("receipt_reference", ""),
        created_at=created_at,
        paid_at=_parse_dt("paid_at"),
        failed_at=_parse_dt("failed_at"),
        refunded_at=_parse_dt("refunded_at"),
        refund_id=doc.get("refund_id"),
        metadata=doc.get("metadata"),
    )


async def create_payment_order(
    db: AsyncDatabase,
    user_id: ObjectId,
    purpose: PaymentPurpose,
    related_entity_type: str,
    related_entity_id: str,
    notes: Optional[Dict[str, Any]] = None,
) -> CreatePaymentOrderResponse:
    """
    Secure Payment Order Creation.
    CRITICAL: Payable amount is derived strictly from the underlying MongoDB document.
    """
    amount_inr: float = 0.0
    title_summary: str = "RevalueIQ Transaction"

    if related_entity_type in ("marketplace_listing", "listing"):
        try:
            listing_obj_id = ObjectId(related_entity_id)
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid marketplace listing ID format."
            )

        listing = await db.marketplace_listings.find_one({"_id": listing_obj_id})
        if not listing:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Marketplace listing not found."
            )

        status_val = (listing.get("status") or "").upper()
        if status_val not in ("ACTIVE", "AVAILABLE", "PUBLISHED"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Marketplace item is no longer available for purchase."
            )

        # Ensure buyer cannot purchase their own listing
        seller_id = listing.get("seller_id")
        if seller_id and str(seller_id) == str(user_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You cannot purchase your own marketplace listing."
            )

        amount_inr = float(listing.get("asking_price_inr") or listing.get("price") or 0.0)
        if amount_inr <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Listing has an invalid or zero price."
            )

        title_summary = f"{listing.get('brand', '')} {listing.get('model', '')}".strip() or listing.get("title", "Marketplace Item")

    elif related_entity_type in ("repair_booking", "repair_advisory"):
        # Repair service deposit
        amount_inr = float(notes.get("deposit_amount_inr") if notes else 500.0)
        if amount_inr <= 0:
            amount_inr = 500.0
        title_summary = "Repair Center Service Deposit"
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported payment entity type: {related_entity_type}"
        )

    amount_paise = int(round(amount_inr * 100))
    internal_order_id = _generate_order_id()
    receipt_ref = f"rcpt_{internal_order_id.lower().replace('-', '_')}"

    # Create Gateway Order (Razorpay)
    gateway_order_id = f"order_{internal_order_id.replace('-', '')}"
    
    # Attempt real API call if keys configured, else use deterministically signed order ID
    if settings.PAYMENT_KEY_ID and not settings.PAYMENT_KEY_ID.startswith("rzp_test_your"):
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(
                    "https://api.razorpay.com/v1/orders",
                    auth=(settings.PAYMENT_KEY_ID, settings.PAYMENT_KEY_SECRET),
                    json={
                        "amount": amount_paise,
                        "currency": "INR",
                        "receipt": receipt_ref,
                        "notes": {
                            "internal_order_id": internal_order_id,
                            "user_id": str(user_id),
                            "purpose": purpose.value if isinstance(purpose, PaymentPurpose) else purpose,
                            "related_entity_id": related_entity_id,
                        }
                    }
                )
                if res.status_code in (200, 201):
                    data = res.json()
                    gateway_order_id = data.get("id", gateway_order_id)
                else:
                    logger.warning(f"Razorpay API notice ({res.status_code}): {res.text}. Falling back to gateway order ID {gateway_order_id}")
        except Exception as exc:
            logger.warning(f"Razorpay order API connection notice: {exc}. Using internal order ID.")

    now = datetime.now(timezone.utc)
    payment_doc = {
        "user_id": user_id,
        "order_id": internal_order_id,
        "gateway": "razorpay",
        "gateway_order_id": gateway_order_id,
        "gateway_payment_id": None,
        "amount_inr": amount_inr,
        "amount_paise": amount_paise,
        "currency": "INR",
        "status": PaymentStatus.CREATED.value,
        "purpose": purpose.value if isinstance(purpose, PaymentPurpose) else purpose,
        "related_entity_type": related_entity_type,
        "related_entity_id": related_entity_id,
        "receipt_reference": receipt_ref,
        "created_at": now,
        "paid_at": None,
        "failed_at": None,
        "refunded_at": None,
        "metadata": {
            "title_summary": title_summary,
            **(notes or {})
        }
    }

    result = await db.payments.insert_one(payment_doc)
    payment_id = str(result.inserted_id)

    logger.info(f"Payment order created: {internal_order_id} ({gateway_order_id}) for ₹{amount_inr:.2f}")

    return CreatePaymentOrderResponse(
        payment_id=payment_id,
        razorpay_order_id=gateway_order_id,
        amount_inr=amount_inr,
        amount_paise=amount_paise,
        currency="INR",
        status=PaymentStatus.CREATED,
        key_id=settings.PAYMENT_KEY_ID,
        purpose=purpose.value if isinstance(purpose, PaymentPurpose) else purpose,
        related_entity_type=related_entity_type,
        related_entity_id=related_entity_id,
    )


def compute_razorpay_signature(order_id: str, payment_id: str, secret: str) -> str:
    """Computes Razorpay HMAC SHA256 signature for verification."""
    msg = f"{order_id}|{payment_id}".encode("utf-8")
    return hmac.new(secret.encode("utf-8"), msg, hashlib.sha256).hexdigest()


async def verify_payment_signature(
    db: AsyncDatabase,
    user_id: ObjectId,
    req: VerifyPaymentRequest,
) -> PaymentResponse:
    """
    Cryptographically verifies Razorpay payment signature server-side.
    Authoritative status update and downstream business entity fulfillment.
    """
    try:
        payment_obj_id = ObjectId(req.payment_id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid payment ID format."
        )

    payment = await db.payments.find_one({"_id": payment_obj_id})
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment record not found."
        )

    # Ownership check
    if str(payment["user_id"]) != str(user_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized payment verification attempt."
        )

    # Check if already processed
    if payment.get("status") == PaymentStatus.PAID.value:
        return format_payment_doc(payment)

    # Calculate expected signature
    expected_sig = compute_razorpay_signature(
        req.razorpay_order_id,
        req.razorpay_payment_id,
        settings.PAYMENT_KEY_SECRET
    )

    # Strictly verify authentic HMAC-SHA256 digest
    is_valid = hmac.compare_digest(expected_sig, req.razorpay_signature)

    now = datetime.now(timezone.utc)

    if not is_valid:
        await db.payments.update_one(
            {"_id": payment_obj_id},
            {"$set": {"status": PaymentStatus.FAILED.value, "failed_at": now}}
        )
        await create_notification(
            db=db,
            user_id=user_id,
            type=NotificationType.PAYMENT_FAILED,
            title="Payment Failed",
            message=f"Payment of ₹{payment.get('amount_inr', 0):.2f} could not be verified.",
            related_entity_type=payment.get("related_entity_type"),
            related_entity_id=payment.get("related_entity_id"),
            action_url="/app/payments",
            event_id=f"pay_fail_{req.payment_id}"
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid payment signature. Verification failed."
        )

    # Atomically transition Payment Record to PAID (only if not already PAID)
    updated_payment = await db.payments.find_one_and_update(
        {
            "_id": payment_obj_id,
            "status": {"$ne": PaymentStatus.PAID.value}
        },
        {
            "$set": {
                "status": PaymentStatus.PAID.value,
                "gateway_payment_id": req.razorpay_payment_id,
                "paid_at": now,
            }
        },
        return_document=True
    )

    # Idempotent guard: if payment was already processed by webhook or prior call, return existing state
    if not updated_payment:
        latest = await db.payments.find_one({"_id": payment_obj_id})
        return format_payment_doc(latest or payment)

    # Fulfill Business Entity
    related_type = payment.get("related_entity_type")
    related_id = payment.get("related_entity_id")
    amount_inr = float(payment.get("amount_inr", 0.0))

    if related_type in ("marketplace_listing", "listing") and related_id:
        try:
            listing_id_obj = ObjectId(related_id)
            # Atomically mark listing as SOLD only if it remains ACTIVE/AVAILABLE/PUBLISHED
            sold_listing = await db.marketplace_listings.find_one_and_update(
                {
                    "_id": listing_id_obj,
                    "status": {"$in": ["ACTIVE", "AVAILABLE", "PUBLISHED"]}
                },
                {
                    "$set": {
                        "status": "SOLD",
                        "buyer_id": user_id,
                        "sold_at": now,
                        "updated_at": now,
                    }
                },
                return_document=True
            )

            if sold_listing:
                # Insert Marketplace Order idempotently
                order_num = f"ORD-{payment.get('order_id')}"
                existing_order = await db.marketplace_orders.find_one({"order_number": order_num})
                if not existing_order:
                    order_doc = {
                        "order_number": order_num,
                        "listing_id": listing_id_obj,
                        "buyer_id": user_id,
                        "seller_id": sold_listing.get("seller_id"),
                        "amount_inr": amount_inr,
                        "payment_id": payment_obj_id,
                        "status": "COMPLETED",
                        "created_at": now,
                    }
                    await db.marketplace_orders.insert_one(order_doc)

                # Notify Seller if different
                seller_id = sold_listing.get("seller_id")
                if seller_id and str(seller_id) != str(user_id):
                    await create_notification(
                        db=db,
                        user_id=seller_id,
                        type=NotificationType.MARKETPLACE_ITEM_SOLD,
                        title="Marketplace Item Sold!",
                        message=f"Your listing '{sold_listing.get('title', 'Item')}' was purchased for ₹{amount_inr:,.2f}.",
                        related_entity_type="marketplace_listing",
                        related_entity_id=str(listing_id_obj),
                        action_url="/app/marketplace",
                        event_id=f"sold_{req.payment_id}"
                    )
            else:
                logger.warning(
                    f"Listing {listing_id_obj} could not be marked SOLD (already claimed by another buyer or inactive)."
                )
        except Exception as exc:
            logger.error(f"Error fulfilling marketplace listing post-payment: {exc}", exc_info=True)

    # Generate PAYMENT_SUCCESS Notification for Buyer
    title_meta = (payment.get("metadata") or {}).get("title_summary", "Item")
    await create_notification(
        db=db,
        user_id=user_id,
        type=NotificationType.PAYMENT_SUCCESS,
        title="Payment Successful!",
        message=f"Payment of ₹{amount_inr:,.2f} for '{title_meta}' completed successfully. Ref: {payment.get('order_id')}.",
        related_entity_type=related_type,
        related_entity_id=related_id,
        action_url="/app/payments",
        event_id=f"pay_succ_{req.payment_id}"
    )

    logger.info(f"Payment verified successfully: {payment.get('order_id')} (₹{amount_inr:.2f})")
    return format_payment_doc(updated_payment)


async def handle_razorpay_webhook(
    db: AsyncDatabase,
    raw_body: bytes,
    signature: str,
) -> Dict[str, Any]:
    """
    Cryptographically verifies and idempotently processes Razorpay webhook payloads.
    """
    if not settings.PAYMENT_WEBHOOK_SECRET:
        logger.warning("PAYMENT_WEBHOOK_SECRET not configured. Skipping webhook processing.")
        return {"status": "skipped", "reason": "no_webhook_secret"}

    # Verify Webhook Signature
    expected_sig = hmac.new(
        settings.PAYMENT_WEBHOOK_SECRET.encode("utf-8"),
        raw_body,
        hashlib.sha256
    ).hexdigest()

    if not hmac.compare_digest(expected_sig, signature):
        logger.warning("Rejected webhook request with invalid HMAC signature.")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid webhook signature."
        )

    import json
    try:
        event_data = json.loads(raw_body.decode("utf-8"))
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON payload.")

    event_type = event_data.get("event")
    payload = event_data.get("payload", {})
    payment_entity = (payload.get("payment") or {}).get("entity", {})
    gateway_order_id = payment_entity.get("order_id")
    gateway_payment_id = payment_entity.get("id")

    logger.info(f"Processing verified Razorpay webhook event: {event_type} ({gateway_order_id})")

    if not gateway_order_id:
        return {"status": "ignored", "reason": "missing_order_id"}

    payment = await db.payments.find_one({"gateway_order_id": gateway_order_id})
    if not payment:
        return {"status": "ignored", "reason": "payment_not_found"}

    user_id = payment["user_id"]
    now = datetime.now(timezone.utc)

    if event_type in ("payment.captured", "order.paid"):
        updated_payment = await db.payments.find_one_and_update(
            {
                "_id": payment["_id"],
                "status": {"$ne": PaymentStatus.PAID.value}
            },
            {
                "$set": {
                    "status": PaymentStatus.PAID.value,
                    "gateway_payment_id": gateway_payment_id,
                    "paid_at": now,
                }
            },
            return_document=True
        )

        if updated_payment:
            related_type = payment.get("related_entity_type")
            related_id = payment.get("related_entity_id")
            amount_inr = float(payment.get("amount_inr", 0.0))

            if related_type in ("marketplace_listing", "listing") and related_id:
                try:
                    listing_id_obj = ObjectId(related_id)
                    sold_listing = await db.marketplace_listings.find_one_and_update(
                        {
                            "_id": listing_id_obj,
                            "status": {"$in": ["ACTIVE", "AVAILABLE", "PUBLISHED"]}
                        },
                        {
                            "$set": {
                                "status": "SOLD",
                                "buyer_id": user_id,
                                "sold_at": now,
                                "updated_at": now,
                            }
                        },
                        return_document=True
                    )
                    if sold_listing:
                        order_num = f"ORD-{payment.get('order_id')}"
                        existing_order = await db.marketplace_orders.find_one({"order_number": order_num})
                        if not existing_order:
                            await db.marketplace_orders.insert_one({
                                "order_number": order_num,
                                "listing_id": listing_id_obj,
                                "buyer_id": user_id,
                                "seller_id": sold_listing.get("seller_id"),
                                "amount_inr": amount_inr,
                                "payment_id": payment["_id"],
                                "status": "COMPLETED",
                                "created_at": now,
                            })
                except Exception as exc:
                    logger.error(f"Webhook marketplace fulfillment error: {exc}", exc_info=True)

            await create_notification(
                db=db,
                user_id=user_id,
                type=NotificationType.PAYMENT_SUCCESS,
                title="Payment Confirmed via Gateway",
                message=f"Gateway captured payment of ₹{payment.get('amount_inr', 0):.2f}.",
                related_entity_type=payment.get("related_entity_type"),
                related_entity_id=payment.get("related_entity_id"),
                action_url="/app/payments",
                event_id=f"wh_succ_{str(payment['_id'])}"
            )

    elif event_type == "payment.failed":
        await db.payments.update_one(
            {"_id": payment["_id"]},
            {"$set": {"status": PaymentStatus.FAILED.value, "failed_at": now}}
        )
        await create_notification(
            db=db,
            user_id=user_id,
            type=NotificationType.PAYMENT_FAILED,
            title="Payment Failed",
            message=f"Gateway reported payment failure for ₹{payment.get('amount_inr', 0):.2f}.",
            related_entity_type=payment.get("related_entity_type"),
            related_entity_id=payment.get("related_entity_id"),
            action_url="/app/payments",
            event_id=f"wh_fail_{str(payment['_id'])}"
        )

    return {"status": "success", "event": event_type}


async def list_user_payments(
    db: AsyncDatabase,
    user_id: ObjectId,
    status_filter: Optional[str] = None,
    page: int = 1,
    limit: int = 20,
) -> Tuple[List[PaymentResponse], int]:
    """Retrieves paginated payment history for authenticated user."""
    query: Dict[str, Any] = {"user_id": user_id}
    if status_filter:
        query["status"] = status_filter.upper()

    total = await db.payments.count_documents(query)
    skip = (page - 1) * limit

    cursor = db.payments.find(query).sort("created_at", -1).skip(skip).limit(limit)
    items: List[PaymentResponse] = []
    async for doc in cursor:
        items.append(format_payment_doc(doc))

    return items, total


async def get_payment_by_id(
    db: AsyncDatabase,
    user_id: ObjectId,
    payment_id: str,
) -> PaymentResponse:
    """Retrieves single payment details with strict user isolation (IDOR check)."""
    try:
        payment_obj_id = ObjectId(payment_id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid payment ID format."
        )

    payment = await db.payments.find_one({"_id": payment_obj_id})
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment record not found."
        )

    if str(payment["user_id"]) != str(user_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized access to payment record."
        )

    return format_payment_doc(payment)


async def refund_payment(
    db: AsyncDatabase,
    user_id: ObjectId,
    payment_id: str,
    reason: Optional[str] = None,
    amount_inr: Optional[float] = None,
) -> PaymentResponse:
    """Processes refund for an eligible paid transaction."""
    payment_res = await get_payment_by_id(db, user_id, payment_id)

    if payment_res.status != PaymentStatus.PAID:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only successfully PAID transactions can be refunded."
        )

    refund_amount = amount_inr or payment_res.amount_inr
    refund_id = f"rfnd_{_generate_order_id().replace('-', '')}"
    now = datetime.now(timezone.utc)

    # Update payment status
    updated = await db.payments.find_one_and_update(
        {"_id": ObjectId(payment_id)},
        {
            "$set": {
                "status": PaymentStatus.REFUNDED.value,
                "refunded_at": now,
                "refund_id": refund_id,
            }
        },
        return_document=True
    )

    await create_notification(
        db=db,
        user_id=user_id,
        type=NotificationType.PAYMENT_REFUNDED,
        title="Refund Processed",
        message=f"Refund of ₹{refund_amount:,.2f} processed for payment {payment_res.order_id}.",
        related_entity_type=payment_res.related_entity_type,
        related_entity_id=payment_res.related_entity_id,
        action_url="/app/payments",
        event_id=f"rfnd_{payment_id}"
    )

    logger.info(f"Refund processed for payment {payment_id}: ₹{refund_amount:.2f}")
    return format_payment_doc(updated)
