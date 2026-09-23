import logging
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from pymongo.asynchronous.database import AsyncDatabase

from app.api.deps import get_db, get_current_user, AuthenticatedUser
from app.schemas.subscriptions import (
    EcoPlanDetail,
    UserSubscriptionResponse,
    ActivatePlanRequest,
    ActivatePlanResponse,
    EcoPlanTier,
    BillingCycle,
)
from app.services.subscription_service import (
    get_available_plans,
    get_user_subscription,
    activate_user_plan,
)

logger = logging.getLogger("revalueiq.api.subscriptions")

router = APIRouter(prefix="/subscriptions", tags=["Eco Plans & Subscriptions"])


@router.get(
    "/plans",
    response_model=List[EcoPlanDetail],
    summary="List Available Eco Plans",
    description="Returns public pricing, perks, limits, and features for all Eco tiers."
)
async def list_plans_endpoint() -> List[EcoPlanDetail]:
    return get_available_plans()


@router.get(
    "/current",
    response_model=UserSubscriptionResponse,
    summary="Get User's Current Eco Subscription",
    description="Returns authenticated user's active tier, quota usage (AI appraisals used this month), renewal dates, and recent invoices."
)
async def get_current_subscription_endpoint(
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db),
) -> UserSubscriptionResponse:
    try:
        return await get_user_subscription(db, current_user.id)
    except Exception as exc:
        logger.error(f"Error fetching subscription for user {current_user.id}: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve current subscription status."
        )


@router.post(
    "/activate",
    response_model=ActivatePlanResponse,
    summary="Activate or Switch Eco Plan",
    description="Instant activation / plan switch for smooth demonstration and real-time testing. Immediately updates profile, quotas, and logs an invoice."
)
async def activate_plan_endpoint(
    body: ActivatePlanRequest,
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db),
) -> ActivatePlanResponse:
    try:
        return await activate_user_plan(
            db=db,
            user_id=current_user.id,
            tier=body.tier,
            billing_cycle=body.billing_cycle,
        )
    except Exception as exc:
        logger.error(f"Error activating plan for user {current_user.id}: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to activate {body.tier} plan."
        )


@router.post(
    "/cancel",
    response_model=ActivatePlanResponse,
    summary="Cancel Subscription",
    description="Reverts user back to the free Eco Starter tier."
)
async def cancel_plan_endpoint(
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db),
) -> ActivatePlanResponse:
    try:
        return await activate_user_plan(
            db=db,
            user_id=current_user.id,
            tier=EcoPlanTier.FREE,
            billing_cycle=BillingCycle.MONTHLY,
        )
    except Exception as exc:
        logger.error(f"Error cancelling plan for user {current_user.id}: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to cancel subscription."
        )
