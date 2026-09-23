from fastapi import APIRouter
from app.api.v1.health import router as health_router
from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.devices import router as devices_router
from app.api.v1.valuations import router as valuations_router
from app.api.v1.repair_advisory import router as repair_advisory_router
from app.api.v1.marketplace import router as marketplace_router
from app.api.v1.repair_centers import router as repair_centers_router
from app.api.v1.donation_organizations import router as donation_organizations_router
from app.api.v1.history import router as history_router
from app.api.v1.payments import router as payments_router
from app.api.v1.notifications import router as notifications_router
from app.api.v1.settings import router as settings_router
from app.api.v1.subscriptions import router as subscriptions_router

api_v1_router = APIRouter()

# Register endpoints routers
api_v1_router.include_router(health_router)
api_v1_router.include_router(auth_router)
api_v1_router.include_router(users_router)
api_v1_router.include_router(devices_router)
api_v1_router.include_router(valuations_router)
api_v1_router.include_router(repair_advisory_router)
api_v1_router.include_router(marketplace_router)
api_v1_router.include_router(repair_centers_router)
api_v1_router.include_router(donation_organizations_router)
api_v1_router.include_router(history_router)
api_v1_router.include_router(payments_router)
api_v1_router.include_router(notifications_router)
api_v1_router.include_router(settings_router)
api_v1_router.include_router(subscriptions_router)



