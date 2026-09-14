import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pymongo.asynchronous.database import AsyncDatabase

from app.api.deps import get_db, get_optional_current_user, AuthenticatedUser
from app.schemas.repair_centers import (
    RepairCenterResponse,
    RepairCenterListResponse,
    RepairRecommendationRequest,
    RouteResponse,
)
from app.services.repair_center_service import (
    list_repair_centers,
    get_repair_center_by_id,
    get_driving_route,
)
from app.services.repair_recommendation_service import (
    get_repair_recommendations,
)
from app.services.repair_center_providers import get_repair_provider

logger = logging.getLogger("revalueiq.api.repair_centers")

router = APIRouter(prefix="/repair-centers", tags=["Repair Center Hub & Recommendations"])


@router.get(
    "",
    response_model=RepairCenterListResponse,
    summary="Discover & Search Verified Repair Centers",
    description=(
        "Public discovery endpoint for electronics repair centers. "
        "Supports provider switching (OpenStreetMap demo mode or Google Maps Platform), "
        "filtering by brand, device category, repair service type, city, area, postal code, "
        "and accurate GPS distance calculations."
    ),
    responses={
        200: {"description": "List of repair centers successfully retrieved."},
        500: {"description": "Internal server error fetching repair centers."}
    }
)
async def get_repair_centers_list(
    search: Optional[str] = Query(None, description="Free text search on shop name, address, or service"),
    brand: Optional[str] = Query(None, description="Filter by supported brand (e.g. Apple, Samsung, Dell)"),
    category: Optional[str] = Query(None, description="Filter by device category (e.g. Smartphone, Laptop)"),
    repair_type: Optional[str] = Query(None, description="Filter by repair service (e.g. Screen Replacement, Battery)"),
    city: Optional[str] = Query(None, description="Filter by city (e.g. Hyderabad, Bengaluru, Mumbai)"),
    area: Optional[str] = Query(None, description="Filter by locality or neighborhood"),
    postal_code: Optional[str] = Query(None, description="Filter by postal PIN code"),
    latitude: Optional[float] = Query(None, description="User GPS latitude for distance sorting"),
    longitude: Optional[float] = Query(None, description="User GPS longitude for distance sorting"),
    radius: Optional[float] = Query(None, description="Maximum radius in kilometers"),
    verified_only: bool = Query(False, description="Filter only verified partner centers"),
    provider: Optional[str] = Query(None, description="Explicit provider: 'osm' or 'google' (defaults to system setting)"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    db: AsyncDatabase = Depends(get_db)
) -> RepairCenterListResponse:
    """
    Public Endpoint: GET /api/v1/repair-centers
    """
    try:
        items, total, query_used, active_provider = await list_repair_centers(
            db,
            search=search,
            brand=brand,
            category=category,
            repair_type=repair_type,
            city=city,
            area=area,
            postal_code=postal_code,
            latitude=latitude,
            longitude=longitude,
            radius_km=radius,
            verified_only=verified_only,
            page=page,
            limit=limit,
            provider_name=provider
        )

        user_loc = None
        if latitude is not None and longitude is not None:
            user_loc = {"latitude": latitude, "longitude": longitude}

        has_more = (page * limit) < total

        return RepairCenterListResponse(
            items=[RepairCenterResponse(**item) for item in items],
            total=total,
            page=page,
            limit=limit,
            has_more=has_more,
            user_location=user_loc,
            query_used=query_used,
            provider=active_provider
        )
    except Exception as exc:
        logger.error(f"Error fetching repair centers list: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to fetch repair centers."
        )


@router.post(
    "/recommend",
    response_model=RepairCenterListResponse,
    summary="Get Intelligent Capability-First Repair Center Recommendations",
    description=(
        "Consumes device context, detected diagnostic problem, and user location "
        "to recommend ranked repair centers prioritizing repair capability, "
        "brand relevance, and geographic proximity across OSM or Google data."
    ),
    responses={
        200: {"description": "Ranked repair center recommendations successfully returned."},
        400: {"description": "Malformed recommendation request payload."},
        500: {"description": "Internal error executing recommendation algorithm."}
    }
)
async def recommend_repair_centers(
    body: RepairRecommendationRequest,
    provider: Optional[str] = Query(None, description="Explicit provider: 'osm' or 'google'"),
    db: AsyncDatabase = Depends(get_db)
) -> RepairCenterListResponse:
    """
    Public / Context-Driven Endpoint: POST /api/v1/repair-centers/recommend
    """
    try:
        ranked_items = await get_repair_recommendations(db, body, provider_name=provider)
        active_provider = get_repair_provider(provider).provider_name
        
        user_loc = None
        if body.location and body.location.latitude is not None and body.location.longitude is not None:
            user_loc = {
                "latitude": body.location.latitude,
                "longitude": body.location.longitude,
                "city": body.location.city
            }

        return RepairCenterListResponse(
            items=[RepairCenterResponse(**item) for item in ranked_items],
            total=len(ranked_items),
            page=1,
            limit=len(ranked_items),
            has_more=False,
            user_location=user_loc,
            provider=active_provider
        )
    except Exception as exc:
        logger.error(f"Error computing repair center recommendations: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to calculate repair center recommendations."
        )


@router.get(
    "/route",
    response_model=RouteResponse,
    summary="Calculate Driving Route to Repair Center",
    description="Calculates live driving directions, distance in km, duration in minutes, and GeoJSON polyline using OSRM or Google."
)
async def calculate_route(
    user_lat: float = Query(..., description="Origin latitude"),
    user_lon: float = Query(..., description="Origin longitude"),
    dest_lat: float = Query(..., description="Destination latitude"),
    dest_lon: float = Query(..., description="Destination longitude"),
    provider: Optional[str] = Query(None, description="Routing provider: 'osm' or 'google'")
) -> RouteResponse:
    """
    Public Endpoint: GET /api/v1/repair-centers/route
    """
    try:
        route_data = await get_driving_route(user_lat, user_lon, dest_lat, dest_lon, provider_name=provider)
        if not route_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Unable to calculate route between the specified coordinates."
            )
        return RouteResponse(**route_data)
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Error calculating driving route: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to calculate driving route."
        )


@router.get(
    "/{center_id}",
    response_model=RepairCenterResponse,
    summary="Get Detailed Repair Center Profile",
    description="Retrieves complete information, verified status, services, and direct contact details for a specific center."
)
async def get_repair_center(
    center_id: str,
    provider: Optional[str] = Query(None, description="Explicit provider: 'osm' or 'google'"),
    db: AsyncDatabase = Depends(get_db)
) -> RepairCenterResponse:
    """
    Public Endpoint: GET /api/v1/repair-centers/{id}
    """
    try:
        center = await get_repair_center_by_id(db, center_id, provider_name=provider)
        if not center:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Repair center not found."
            )
        return RepairCenterResponse(**center)
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Error fetching repair center {center_id}: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to fetch repair center details."
        )
