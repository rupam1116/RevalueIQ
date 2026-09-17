import pytest
from bson import ObjectId
from datetime import datetime, timezone

from mongomock_motor import AsyncMongoMockClient

from app.schemas.history import (
    LifecycleTierEnum,
    ActivityTypeEnum,
    LogLifecycleEventRequest,
    ConfirmCompletionRequest,
)
from app.services.history_service import (
    get_user_timeline,
    get_user_analytics,
    log_lifecycle_event,
    confirm_event_completion,
    get_recent_audited_devices,
    get_audit_reports,
)


@pytest.fixture
def test_db():
    client = AsyncMongoMockClient()
    return client["test_revalueiq"]


@pytest.mark.asyncio
async def test_empty_user_history_returns_zeroes(test_db):
    """
    Validates the strict non-negotiable production rule:
    When a user has zero records, RevalueIQ returns ZERO dummy data,
    ZERO mock analytics, and clean empty states.
    """
    empty_user_id = ObjectId()

    items, total = await get_user_timeline(test_db, empty_user_id)
    assert items == []
    assert total == 0

    analytics = await get_user_analytics(test_db, empty_user_id)
    assert analytics.total_analyzed_units == 0
    assert analytics.recommendations_count == 0
    assert analytics.actions_initiated_count == 0
    assert analytics.externally_completed_count == 0
    assert analytics.repairs_completed == 0
    assert analytics.devices_sold == 0
    assert analytics.devices_donated == 0
    assert analytics.verified_co2_saved_kg == 0.0
    assert analytics.potential_co2_opportunity_kg == 0.0
    assert analytics.verified_ewaste_prevented_kg == 0.0
    assert analytics.verified_money_earned_or_saved == 0.0
    assert analytics.monthly_trends == []
    assert analytics.category_breakdown == []

    devices = await get_recent_audited_devices(test_db, empty_user_id)
    assert devices == []

    reports = await get_audit_reports(test_db, empty_user_id)
    assert reports == []


@pytest.mark.asyncio
async def test_valuation_creates_tier_1_recommendation_generated(test_db):
    """
    Validates that valuations are categorized as Tier 1: Recommendation Generated.
    They must NOT claim verified CO2 saved until physical completion is confirmed.
    """
    user_id = ObjectId()
    now = datetime.now(timezone.utc)

    # Insert a real valuation into device_valuations
    val_doc = {
        "user_id": user_id,
        "valuation_code": "VAL-TST001",
        "input": {
            "device_name": "iPhone 13 Pro",
            "category": "Smartphone",
            "brand": "Apple",
            "model": "13 Pro",
            "condition": "Good"
        },
        "valuation": {
            "estimated_resale_value": 42000.0,
            "market_recommendation": "SELL",
            "circular_recommendation": "SELL",
            "circularity_score": 88,
            "co2_offset_kg": 55.0,
            "ewaste_diverted_kg": 0.18
        },
        "status": "completed",
        "created_at": now
    }
    await test_db.device_valuations.insert_one(val_doc)

    items, total = await get_user_timeline(test_db, user_id)
    assert total == 1
    item = items[0]

    assert item.type == ActivityTypeEnum.VALUATION
    assert item.tier == LifecycleTierEnum.RECOMMENDATION_GENERATED
    assert item.status == "Recommended"
    # Strict truthfulness checks:
    assert item.verified_co2_saved_kg == 0.0  # NOT claimed as verified saved
    assert item.potential_co2_opportunity_kg == 55.0
    assert item.verified_ewaste_prevented_kg == 0.0
    assert item.potential_ewaste_opportunity_kg == 0.18
    assert item.can_complete is False

    # Check analytics
    analytics = await get_user_analytics(test_db, user_id)
    assert analytics.total_analyzed_units == 1
    assert analytics.recommendations_count == 1
    assert analytics.externally_completed_count == 0
    assert analytics.verified_co2_saved_kg == 0.0
    assert analytics.potential_co2_opportunity_kg == 55.0
    assert len(analytics.monthly_trends) == 1
    assert analytics.category_breakdown[0].name == "Smartphone"


@pytest.mark.asyncio
async def test_lifecycle_event_initiated_and_completion_transition(test_db):
    """
    Validates Tier 2 (Action Initiated) transition to Tier 3 (Externally Completed Action).
    Only upon verified completion are CO2 and e-waste credited.
    """
    user_id = ObjectId()

    # 1. Log an action initiated: user contacted repair shop
    log_req = LogLifecycleEventRequest(
        type=ActivityTypeEnum.REPAIR,
        device_name="MacBook Pro 16",
        category="Laptop",
        tier=LifecycleTierEnum.ACTION_INITIATED,
        title="Repair Inquiry: Screen Glass Replacement",
        description="Booked diagnostic check at Authorized Apple Repair Center.",
        shop_name="iCare Authorized Center",
        value_inr=14500.0,
    )
    created = await log_lifecycle_event(test_db, user_id, log_req)
    event_id = str(created["_id"])

    # Verify timeline state while initiated
    items, total = await get_user_timeline(test_db, user_id)
    assert total == 1
    assert items[0].tier == LifecycleTierEnum.ACTION_INITIATED
    assert items[0].status == "Initiated"
    assert items[0].verified_co2_saved_kg == 0.0
    assert items[0].potential_co2_opportunity_kg == 180.0  # laptop LCA benchmark
    assert items[0].can_complete is True

    # 2. Confirm external completion
    complete_req = ConfirmCompletionRequest(
        completed_date="2026-09-13",
        final_cost_or_earning_inr=13800.0,
        service_provider_or_recipient="iCare Authorized Center",
        completion_notes="Screen display replaced with OEM parts. Device fully operational.",
        receipt_or_reference="INV-99281"
    )
    completed_doc = await confirm_event_completion(test_db, user_id, event_id, complete_req)

    assert completed_doc["tier"] == LifecycleTierEnum.EXTERNALLY_COMPLETED.value
    assert completed_doc["status"] == "Verified"

    # Verify timeline state after completion
    items_after, total_after = await get_user_timeline(test_db, user_id)
    assert total_after == 1
    item_completed = items_after[0]
    assert item_completed.tier == LifecycleTierEnum.EXTERNALLY_COMPLETED
    assert item_completed.status == "Verified"
    assert item_completed.verified_co2_saved_kg == 180.0
    assert item_completed.verified_ewaste_prevented_kg == 1.9
    assert item_completed.potential_co2_opportunity_kg == 0.0
    assert item_completed.value_inr == 13800.0
    assert item_completed.can_complete is False

    # Verify analytics reflects verified completion
    analytics = await get_user_analytics(test_db, user_id)
    assert analytics.externally_completed_count == 1
    assert analytics.repairs_completed == 1
    assert analytics.verified_co2_saved_kg == 180.0
    assert analytics.verified_ewaste_prevented_kg == 1.9
    assert analytics.verified_money_earned_or_saved == 13800.0


@pytest.mark.asyncio
async def test_timeline_search_and_tier_filtering(test_db):
    """
    Validates filtering by search query, tier, and activity type.
    """
    user_id = ObjectId()

    # Valuation (Tier 1)
    await log_lifecycle_event(test_db, user_id, LogLifecycleEventRequest(
        type=ActivityTypeEnum.VALUATION,
        device_name="Dell XPS 15",
        category="Laptop",
        tier=LifecycleTierEnum.RECOMMENDATION_GENERATED,
        title="AI Appraisal: Dell XPS 15",
        value_inr=55000.0
    ))

    # Marketplace (Tier 2)
    await log_lifecycle_event(test_db, user_id, LogLifecycleEventRequest(
        type=ActivityTypeEnum.MARKETPLACE,
        device_name="Sony WH-1000XM4",
        category="Audio",
        tier=LifecycleTierEnum.ACTION_INITIATED,
        title="Marketplace Listing: Sony Headphones",
        value_inr=14000.0
    ))

    # Donation (Tier 3)
    await log_lifecycle_event(test_db, user_id, LogLifecycleEventRequest(
        type=ActivityTypeEnum.DONATION,
        device_name="iPad Air 4",
        category="Tablet",
        tier=LifecycleTierEnum.EXTERNALLY_COMPLETED,
        title="Verified Donation: iPad Air 4",
        ngo_name="Digital Literacy Foundation",
        value_inr=28000.0
    ), allow_system_tier3=True)

    # 1. Test search query
    items_search, total_search = await get_user_timeline(test_db, user_id, search="Sony")
    assert total_search == 1
    assert items_search[0].device_name == "Sony WH-1000XM4"

    # 2. Test tier filter: RECOMMENDATION_GENERATED
    items_t1, total_t1 = await get_user_timeline(test_db, user_id, tier="recommendation_generated")
    assert total_t1 == 1
    assert items_t1[0].device_name == "Dell XPS 15"

    # 3. Test tier filter: EXTERNALLY_COMPLETED
    items_t3, total_t3 = await get_user_timeline(test_db, user_id, tier="externally_completed")
    assert total_t3 == 1
    assert items_t3[0].device_name == "iPad Air 4"

    # 4. Test type filter: DONATION
    items_don, total_don = await get_user_timeline(test_db, user_id, activity_type="donation")
    assert total_don == 1
    assert items_don[0].type == ActivityTypeEnum.DONATION
