import logging
from pymongo.asynchronous.database import AsyncDatabase

logger = logging.getLogger("revalueiq.db.indexes")


async def create_mongo_indexes(db: AsyncDatabase) -> None:
    """
    Creates approved collection indexes based on database_design.md specification.
    Idempotent operation: MongoDB skips existing matching indexes.
    Also drops obsolete legacy indexes (e.g., camelCase firebaseUid_1).
    """
    try:
        # Drop legacy indexes on users collection if they exist
        try:
            indexes = await db.users.index_information()
            if "firebaseUid_1" in indexes:
                await db.users.drop_index("firebaseUid_1")
                logger.info("Dropped legacy index 'firebaseUid_1' from users collection.")
            if "clerkId_1" in indexes:
                await db.users.drop_index("clerkId_1")
                logger.info("Dropped legacy index 'clerkId_1' from users collection.")
        except Exception as e:
            logger.debug(f"Legacy index cleanup notice: {e}")

        # 1. Collection: users
        await db.users.create_index("firebase_uid", unique=True)
        await db.users.create_index("email", unique=True)

        # 2. Collection: user_profiles
        await db.user_profiles.create_index("user_id", unique=True)

        # 3. Collection: user_devices
        await db.user_devices.create_index([("user_id", 1), ("status", 1)])

        # 4. Collection: device_valuations
        await db.device_valuations.create_index("valuation_code", unique=True)
        await db.device_valuations.create_index([("user_id", 1), ("created_at", -1)])
        await db.device_valuations.create_index([("user_id", 1), ("status", 1)])
        await db.device_valuations.create_index([("device_id", 1), ("created_at", -1)])
        await db.device_valuations.create_index("category")

        # 5. Collection: repair_reports & repair_advisories
        await db.repair_reports.create_index("report_code", unique=True)
        await db.repair_reports.create_index([("user_id", 1), ("created_at", -1)])

        await db.repair_advisories.create_index("advisory_code", unique=True)
        await db.repair_advisories.create_index([("user_id", 1), ("created_at", -1)])
        await db.repair_advisories.create_index([("device_id", 1), ("created_at", -1)])
        await db.repair_advisories.create_index([("user_id", 1), ("status", 1)])

        # 6. Collection: repair_centers & repair_shops (2dsphere geospatial)
        await db.repair_centers.create_index("provider_place_id", unique=True, sparse=True)
        await db.repair_centers.create_index("google_place_id", unique=True, sparse=True)
        await db.repair_centers.create_index("provider")
        await db.repair_centers.create_index([("location", "2dsphere")])
        await db.repair_centers.create_index([("city", 1), ("is_active", 1)])
        await db.repair_centers.create_index([("brand_services", 1), ("is_active", 1)])
        await db.repair_centers.create_index([("repair_services", 1), ("is_active", 1)])
        await db.repair_centers.create_index([("rating", -1)])
        await db.repair_centers.create_index("is_verified")

        await db.repair_shops.create_index([("location", "2dsphere")])
        await db.repair_shops.create_index([("rating", -1)])
        await db.repair_shops.create_index("verified_partner")

        # 7. Collection: repair_bookings
        await db.repair_bookings.create_index("booking_code", unique=True)
        await db.repair_bookings.create_index([("user_id", 1), ("created_at", -1)])
        await db.repair_bookings.create_index([("shop_id", 1), ("status", 1)])

        # 8. Collection: marketplace_listings
        await db.marketplace_listings.create_index("listing_code", unique=True)
        await db.marketplace_listings.create_index([("seller_id", 1), ("created_at", -1)])
        await db.marketplace_listings.create_index([("status", 1), ("created_at", -1)])
        await db.marketplace_listings.create_index([("category", 1), ("status", 1)])
        await db.marketplace_listings.create_index([("brand", 1), ("status", 1)])
        await db.marketplace_listings.create_index([("category", 1), ("status", 1), ("asking_price_inr", 1)])
        await db.marketplace_listings.create_index("asking_price_inr")
        await db.marketplace_listings.create_index("device_id", sparse=True)
        await db.marketplace_listings.create_index("valuation_id", sparse=True)
        try:
            await db.marketplace_listings.create_index([
                ("title", "text"),
                ("description", "text"),
                ("brand", "text"),
                ("model", "text")
            ])
        except Exception as e:
            logger.debug(f"Marketplace text index notice: {e}")

        # 9. Collection: marketplace_orders
        await db.marketplace_orders.create_index("order_number", unique=True)
        await db.marketplace_orders.create_index("buyer_id")
        await db.marketplace_orders.create_index("seller_id")

        # 10. Collection: donation_organizations & donation_centers (2dsphere geospatial)
        await db.donation_organizations.create_index("provider_organization_id", unique=True, sparse=True)
        await db.donation_organizations.create_index([("location", "2dsphere")])
        await db.donation_organizations.create_index("category")
        await db.donation_organizations.create_index("city")
        await db.donation_organizations.create_index("is_verified")

        await db.donation_centers.create_index([("location", "2dsphere")])
        await db.donation_centers.create_index("category")

        # 11. Collection: donations
        await db.donations.create_index("certificate_id", unique=True)
        await db.donations.create_index("user_id")

        # 12. Collection: community_posts
        await db.community_posts.create_index([("category", 1), ("created_at", -1)])
        await db.community_posts.create_index("author_id")

        # 13. Collection: post_replies
        await db.post_replies.create_index([("post_id", 1), ("created_at", 1)])

        # 14. Collection: notifications
        await db.notifications.create_index([("user_id", 1), ("is_read", 1)])

        # 15. Collection: impact_certificates
        await db.impact_certificates.create_index([("user_id", 1), ("created_at", -1)])

        # 16. Collection: payments
        try:
            p_indexes = await db.payments.index_information()
            if "payment_intent_id_1" in p_indexes and not p_indexes["payment_intent_id_1"].get("sparse", False):
                await db.payments.drop_index("payment_intent_id_1")
                logger.info("Dropped legacy non-sparse 'payment_intent_id_1' from payments collection.")
        except Exception as e:
            logger.debug(f"Payment index cleanup notice: {e}")

        await db.payments.create_index("order_id", unique=True, sparse=True)
        await db.payments.create_index("gateway_order_id", unique=True, sparse=True)
        await db.payments.create_index("payment_intent_id", unique=True, sparse=True)
        await db.payments.create_index("user_id")

        # 17. Collection: user_lifecycle_events
        await db.user_lifecycle_events.create_index("event_code", unique=True)
        await db.user_lifecycle_events.create_index([("user_id", 1), ("created_at", -1)])
        await db.user_lifecycle_events.create_index([("user_id", 1), ("tier", 1)])
        await db.user_lifecycle_events.create_index([("user_id", 1), ("type", 1)])
        await db.user_lifecycle_events.create_index([("user_id", 1), ("status", 1)])

        logger.info("All approved MongoDB indexes successfully initialized.")
    except Exception as exc:
        logger.warning(f"MongoDB index initialization notice: {exc}")
