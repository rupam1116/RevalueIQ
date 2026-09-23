import logging
import secrets
import string
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Any, Optional
from bson import ObjectId
from pymongo.asynchronous.database import AsyncDatabase

from app.schemas.subscriptions import (
    EcoPlanTier,
    BillingCycle,
    PlanFeatureItem,
    EcoPlanDetail,
    UserSubscriptionResponse,
    ActivatePlanResponse,
)
from app.services.notification_service import create_notification

logger = logging.getLogger("revalueiq.services.subscriptions")

AVAILABLE_PLANS: List[EcoPlanDetail] = [
    EcoPlanDetail(
        id="free",
        name="Eco Starter",
        tagline="Essential circular appraisal tools for conscious individuals.",
        price_monthly_inr=0.0,
        price_yearly_inr=0.0,
        popular=False,
        badge="Community",
        features=[
            PlanFeatureItem(title="5 AI Device Appraisals per month", included=True),
            PlanFeatureItem(title="Standard Repair Guidance & Cost Estimations", included=True),
            PlanFeatureItem(title="Verified E-Waste Center Matching", included=True),
            PlanFeatureItem(title="Community Hub Discussions & Tips", included=True),
            PlanFeatureItem(title="Basic Impact Score (CO₂ & E-Waste tracked)", included=True),
            PlanFeatureItem(title="Computer Vision Deep Wear Inspection", included=False),
            PlanFeatureItem(title="Zero-fee Priority Marketplace Listings", included=False),
            PlanFeatureItem(title="Verified Green Hardware Certificate Exports", included=False),
            PlanFeatureItem(title="Enterprise ESG & CSR Audit API Access", included=False),
        ],
        limits={
            "monthly_valuations": 5,
            "eco_credits_cap": 500,
            "karma_cap": 500,
            "karma_multiplier": 1.0,
            "cv_diagnostics": False,
            "marketplace_fee_discount_pct": 0,
            "api_access": False,
        }
    ),
    EcoPlanDetail(
        id="pro",
        name="Eco Pro (Circular Pioneer)",
        tagline="Unlimited AI diagnostics, deep computer vision, and zero-fee resale.",
        price_monthly_inr=499.0,
        price_yearly_inr=4999.0,
        popular=True,
        badge="Most Popular",
        features=[
            PlanFeatureItem(title="Unlimited AI Device Valuations & Appraisals", included=True, is_new=True),
            PlanFeatureItem(title="Computer Vision Hardware Degradation Detection", included=True),
            PlanFeatureItem(title="0% Seller Marketplace Fees & Featured Placement", included=True),
            PlanFeatureItem(title="Interactive Generative AI Repair Copilot", included=True),
            PlanFeatureItem(title="Downloadable Green Hardware Impact Certificates", included=True),
            PlanFeatureItem(title="2x Eco Credits Multiplier", included=True, badge="2X"),
            PlanFeatureItem(title="Priority 24/7 Green Technicians Support", included=True),
            PlanFeatureItem(title="Corporate ESG Audit Bulk API", included=False),
        ],
        limits={
            "monthly_valuations": -1,  # unlimited
            "eco_credits_cap": 5000,
            "karma_cap": 5000,
            "karma_multiplier": 2.0,
            "cv_diagnostics": True,
            "marketplace_fee_discount_pct": 100,
            "api_access": False,
        }
    ),
    EcoPlanDetail(
        id="enterprise",
        name="Circular Enterprise (Net-Zero Leader)",
        tagline="For organizations, bulk refurbishers, and CSR/ESG compliance programs.",
        price_monthly_inr=2499.0,
        price_yearly_inr=24999.0,
        popular=False,
        badge="Net-Zero Leader",
        features=[
            PlanFeatureItem(title="Everything included in Eco Pro Tier", included=True),
            PlanFeatureItem(title="Bulk CSV / Excel Inventory Batch Valuations", included=True, is_new=True),
            PlanFeatureItem(title="Formal Corporate CSR / ESG Compliance Audits", included=True),
            PlanFeatureItem(title="Full REST API Access (10,000 requests/day)", included=True),
            PlanFeatureItem(title="White-labeled Custom Valuation & PDF Reports", included=True),
            PlanFeatureItem(title="Verified Carbon Offset Blockchain Registry Entry", included=True),
            PlanFeatureItem(title="Dedicated Circular Economy Account Manager", included=True),
            PlanFeatureItem(title="SLA 99.9% Uptime Guarantee", included=True),
        ],
        limits={
            "monthly_valuations": -1,  # unlimited
            "eco_credits_cap": 50000,
            "karma_cap": 50000,
            "karma_multiplier": 3.0,
            "cv_diagnostics": True,
            "marketplace_fee_discount_pct": 100,
            "api_access": True,
        }
    ),
]


def get_available_plans() -> List[EcoPlanDetail]:
    return AVAILABLE_PLANS


async def get_user_subscription(db: AsyncDatabase, user_id: ObjectId) -> UserSubscriptionResponse:
    """Returns the authenticated user's current subscription details, quotas, and recent invoices."""
    profile = await db.user_profiles.find_one({"user_id": user_id}) or {}
    user_doc = await db.users.find_one({"_id": user_id}) or {}

    tier = str(profile.get("eco_plan") or user_doc.get("eco_plan") or "free").lower()
    if tier not in ("free", "pro", "enterprise"):
        tier = "free"

    tier_names = {
        "free": "Eco Starter",
        "pro": "Eco Pro (Circular Pioneer)",
        "enterprise": "Circular Enterprise (Net-Zero Leader)",
    }
    tier_name = profile.get("eco_plan_name") or tier_names.get(tier, "Eco Starter")
    status_str = profile.get("eco_plan_status") or "active"
    billing_cycle = profile.get("eco_plan_billing_cycle") or "monthly"
    started_at = profile.get("eco_plan_started_at")
    expires_at = profile.get("eco_plan_expires_at")

    # Calculate valuations used this calendar month
    now = datetime.now(timezone.utc)
    start_of_month = datetime(now.year, now.month, 1, tzinfo=timezone.utc)
    used_valuations = await db.device_valuations.count_documents({
        "user_id": user_id,
        "created_at": {"$gte": start_of_month}
    })

    limit = 5 if tier == "free" else -1

    # Fetch recent invoices from payments collection
    invoices_cursor = db.payments.find({
        "user_id": user_id,
        "purpose": "ECO_PLAN_SUBSCRIPTION"
    }).sort("created_at", -1).limit(5)

    recent_invoices = []
    async for inv in invoices_cursor:
        recent_invoices.append({
            "id": str(inv.get("_id")),
            "order_id": inv.get("order_id", ""),
            "amount_inr": float(inv.get("amount_inr", 0.0)),
            "currency": inv.get("currency", "INR"),
            "status": inv.get("status", "PAID"),
            "plan_tier": inv.get("related_entity_id", "pro_monthly"),
            "paid_at": inv.get("paid_at") or inv.get("created_at"),
            "receipt_reference": inv.get("receipt_reference", ""),
        })

    return UserSubscriptionResponse(
        tier=tier,
        tier_name=tier_name,
        status=status_str,
        billing_cycle=billing_cycle,
        started_at=started_at,
        expires_at=expires_at,
        is_pro_or_higher=tier in ("pro", "enterprise"),
        is_enterprise=tier == "enterprise",
        monthly_valuations_limit=limit,
        monthly_valuations_used=used_valuations,
        eco_credits_multiplier=3.0 if tier == "enterprise" else (2.0 if tier == "pro" else 1.0),
        karma_multiplier=3.0 if tier == "enterprise" else (2.0 if tier == "pro" else 1.0),
        can_export_certificates=tier in ("pro", "enterprise"),
        has_api_access=tier == "enterprise",
        has_cv_diagnostics=tier in ("pro", "enterprise"),
        recent_invoices=recent_invoices,
    )


async def activate_user_plan(
    db: AsyncDatabase,
    user_id: ObjectId,
    tier: EcoPlanTier,
    billing_cycle: BillingCycle,
) -> ActivatePlanResponse:
    """
    Activates or switches the user's Eco Plan instantly.
    Creates a simulated paid invoice record and celebratory notification.
    """
    now = datetime.now(timezone.utc)
    tier_val = tier.value
    cycle_val = billing_cycle.value

    tier_names = {
        "free": "Eco Starter",
        "pro": "Eco Pro (Circular Pioneer)",
        "enterprise": "Circular Enterprise (Net-Zero Leader)",
    }
    tier_name = tier_names.get(tier_val, "Eco Plan")

    # Expiry calculation
    expires_at = None
    if tier_val != "free":
        if cycle_val == "yearly":
            expires_at = now + timedelta(days=365)
        else:
            expires_at = now + timedelta(days=30)

    # 1. Update user_profiles & users collection
    update_data = {
        "eco_plan": tier_val,
        "eco_plan_name": tier_name,
        "eco_plan_status": "active",
        "eco_plan_billing_cycle": cycle_val,
        "eco_plan_started_at": now,
        "eco_plan_expires_at": expires_at,
        "updated_at": now,
    }

    await db.user_profiles.update_one(
        {"user_id": user_id},
        {"$set": update_data},
        upsert=True
    )
    await db.users.update_one(
        {"_id": user_id},
        {"$set": {
            "eco_plan": tier_val,
            "eco_plan_name": tier_name,
            "updated_at": now,
        }}
    )

    # 2. Record completed invoice in payments if upgraded
    invoice_id = None
    if tier_val != "free":
        price_map = {
            ("pro", "monthly"): 499.0,
            ("pro", "yearly"): 4999.0,
            ("enterprise", "monthly"): 2499.0,
            ("enterprise", "yearly"): 24999.0,
        }
        amount_inr = price_map.get((tier_val, cycle_val), 499.0)
        rand_code = "".join(secrets.choice(string.digits) for _ in range(6))
        order_num = f"INV-ECO-{now.year}-{rand_code}"

        payment_doc = {
            "order_id": order_num,
            "user_id": user_id,
            "gateway": "revalueiq_instant",
            "gateway_order_id": f"order_demo_{rand_code}",
            "gateway_payment_id": f"pay_demo_{rand_code}",
            "amount_inr": amount_inr,
            "amount_paise": int(amount_inr * 100),
            "currency": "INR",
            "status": "PAID",
            "purpose": "ECO_PLAN_SUBSCRIPTION",
            "related_entity_type": "eco_plan",
            "related_entity_id": f"{tier_val}_{cycle_val}",
            "receipt_reference": f"RCPT-ECO-{rand_code}",
            "created_at": now,
            "paid_at": now,
            "metadata": {
                "tier": tier_val,
                "tier_name": tier_name,
                "billing_cycle": cycle_val,
                "instant_activation": True,
            }
        }
        ins_result = await db.payments.insert_one(payment_doc)
        invoice_id = str(ins_result.inserted_id)

        # 3. Create real-time notification
        try:
            await create_notification(
                db=db,
                user_id=user_id,
                title=f"🌱 Upgraded to {tier_name}!",
                message=f"Your subscription is active ({cycle_val.capitalize()}). All premium circular perks & unlimited AI appraisals are unlocked.",
                notif_type="ECO_PLAN_UPGRADED",
                action_url="/app/settings",
                metadata={"plan": tier_val, "order_id": order_num}
            )
        except Exception as e:
            logger.warning(f"Could not send upgrade notification: {e}")
    else:
        # Downgraded to free
        try:
            await create_notification(
                db=db,
                user_id=user_id,
                title="🌱 Switched to Eco Starter",
                message="You are currently on the free Eco Starter tier (5 monthly AI appraisals).",
                notif_type="ECO_PLAN_CHANGED",
                action_url="/app/settings",
                metadata={"plan": "free"}
            )
        except Exception as e:
            logger.warning(f"Could not send downgrade notification: {e}")

    logger.info(f"User {user_id} activated eco plan: {tier_val} ({cycle_val})")

    return ActivatePlanResponse(
        success=True,
        message=f"Successfully activated {tier_name} plan!",
        tier=tier_val,
        tier_name=tier_name,
        status="active",
        billing_cycle=cycle_val,
        expires_at=expires_at,
        invoice_id=invoice_id,
    )
