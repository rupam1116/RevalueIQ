import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pymongo.asynchronous.database import AsyncDatabase

from app.api.deps import get_db
from app.schemas.donation_organizations import (
    DonationOrganizationResponse,
    DonationOrganizationListResponse,
    DonationRouteResponse,
    DonationRecommendationRequest,
)
from app.services.donation_organization_service import (
    list_donation_organizations,
    get_donation_organization_by_id,
    get_donation_driving_route,
    get_donation_recommendations,
)

logger = logging.getLogger("revalueiq.api.donation_organizations")

router = APIRouter(prefix="/donation-organizations", tags=["Donation Organizations Hub"])


@router.get(
    "",
    response_model=DonationOrganizationListResponse,
    summary="Discover & Search Verified Donation Organizations",
    description=(
        "Public discovery endpoint for genuine donation organizations, NGOs, schools, "
        "and e-waste recyclers. Filters by category, location, and donation types. "
        "Strictly enforces real data with zero dummy records."
    ),
    responses={
        200: {"description": "List of donation organizations successfully retrieved."},
        500: {"description": "Internal server error fetching organizations."}
    }
)
async def get_donation_organizations(
    search: Optional[str] = Query(None, description="Free text search on organization name, address, or category"),
    category: Optional[str] = Query(None, description="Category filter (Education, NGOs, Orphanages, etc.)"),
    donation_type: Optional[str] = Query(None, description="Donation type filter (e.g. Electronics, Computers)"),
    city: Optional[str] = Query(None, description="City name (e.g. Hyderabad, Bengaluru)"),
    area: Optional[str] = Query(None, description="Locality / Neighborhood (e.g. Madhapur, Gachibowli)"),
    postal_code: Optional[str] = Query(None, description="Postal / PIN code (e.g. 500081)"),
    latitude: Optional[float] = Query(None, ge=-90.0, le=90.0, description="User GPS latitude for distance sorting"),
    longitude: Optional[float] = Query(None, ge=-180.0, le=180.0, description="User GPS longitude for distance sorting"),
    radius: Optional[float] = Query(None, ge=0.1, le=500.0, description="Search radius in kilometers"),
    provider: Optional[str] = Query(None, description="Provider identifier: 'osm' or 'google'"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    db: AsyncDatabase = Depends(get_db)
) -> DonationOrganizationListResponse:
    """
    Public Endpoint: GET /api/v1/donation-organizations
    """
    try:
        items, total, query_used, active_provider = await list_donation_organizations(
            db,
            search=search,
            category=category,
            donation_type=donation_type,
            city=city,
            area=area,
            postal_code=postal_code,
            latitude=latitude,
            longitude=longitude,
            radius_km=radius,
            page=page,
            limit=limit,
            provider_name=provider
        )

        user_loc = None
        if latitude is not None and longitude is not None:
            user_loc = {"latitude": latitude, "longitude": longitude}

        return DonationOrganizationListResponse(
            items=[DonationOrganizationResponse(**item) for item in items],
            total=total,
            page=page,
            limit=limit,
            has_more=(page * limit) < total,
            user_location=user_loc,
            query_used=query_used,
            provider=active_provider
        )
    except Exception as exc:
        logger.error(f"Error fetching donation organizations: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while discovering donation organizations."
        )


@router.get(
    "/search",
    response_model=DonationOrganizationListResponse,
    summary="Search Donation Organizations (Convenience Alias)"
)
async def search_donation_organizations_endpoint(
    q: Optional[str] = Query(None, description="Search query string"),
    category: Optional[str] = Query(None, description="Category filter"),
    location: Optional[str] = Query(None, description="Location search string (city, area, pincode)"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncDatabase = Depends(get_db)
) -> DonationOrganizationListResponse:
    """
    Public Endpoint: GET /api/v1/donation-organizations/search
    """
    return await get_donation_organizations(
        search=q,
        category=category,
        city=location,
        page=page,
        limit=limit,
        db=db
    )


@router.get(
    "/nearby",
    response_model=DonationOrganizationListResponse,
    summary="Nearby Donation Organizations by Coordinates"
)
async def get_nearby_donation_organizations(
    latitude: float = Query(..., ge=-90.0, le=90.0, description="GPS Latitude"),
    longitude: float = Query(..., ge=-180.0, le=180.0, description="GPS Longitude"),
    category: Optional[str] = Query(None, description="Category filter"),
    radius: Optional[float] = Query(25.0, ge=0.1, le=500.0, description="Radius in km"),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncDatabase = Depends(get_db)
) -> DonationOrganizationListResponse:
    """
    Public Endpoint: GET /api/v1/donation-organizations/nearby
    """
    return await get_donation_organizations(
        latitude=latitude,
        longitude=longitude,
        category=category,
        radius=radius,
        limit=limit,
        db=db
    )


@router.post(
    "/recommend",
    response_model=DonationOrganizationListResponse,
    summary="AI Recommendation Engine for Device Donation",
    description=(
        "Prioritizes genuine organizations, schools, non-profits, and certified recyclers "
        "based on device category compatibility, donation purpose, and proximity."
    )
)
async def recommend_donation_organizations(
    body: DonationRecommendationRequest,
    provider: Optional[str] = Query(None, description="Provider: 'osm' or 'google'"),
    db: AsyncDatabase = Depends(get_db)
) -> DonationOrganizationListResponse:
    """
    Public / Context-Driven Endpoint: POST /api/v1/donation-organizations/recommend
    """
    try:
        ranked_items = await get_donation_recommendations(db, body, provider_name=provider)
        user_loc = None
        if body.location and body.location.latitude is not None and body.location.longitude is not None:
            user_loc = {
                "latitude": body.location.latitude,
                "longitude": body.location.longitude,
                "city": body.location.city
            }

        return DonationOrganizationListResponse(
            items=[DonationOrganizationResponse(**item) for item in ranked_items],
            total=len(ranked_items),
            page=1,
            limit=len(ranked_items),
            has_more=False,
            user_location=user_loc,
            query_used=f"recommendation: {body.device.category or 'Device'} -> {body.donation.purpose or 'Donation'}",
            provider="osm"
        )
    except Exception as exc:
        logger.error(f"Error computing donation recommendations: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to calculate donation recommendations."
        )


@router.get(
    "/route",
    response_model=DonationRouteResponse,
    summary="Get Driving Route & Distance to Organization",
    description="Calculates turn-by-turn route, driving distance in km, duration in minutes, and GeoJSON polyline geometry."
)
async def get_route_to_organization(
    lat1: float = Query(..., ge=-90.0, le=90.0, description="Origin latitude (e.g. user GPS)"),
    lon1: float = Query(..., ge=-180.0, le=180.0, description="Origin longitude (e.g. user GPS)"),
    lat2: float = Query(..., ge=-90.0, le=90.0, description="Destination organization latitude"),
    lon2: float = Query(..., ge=-180.0, le=180.0, description="Destination organization longitude"),
    provider: Optional[str] = Query(None, description="Routing provider override")
) -> DonationRouteResponse:
    """
    Public Endpoint: GET /api/v1/donation-organizations/route
    """
    try:
        route_data = await get_donation_driving_route(lat1, lon1, lat2, lon2, provider_name=provider)
        if not route_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Unable to calculate navigation route between coordinates."
            )
        return DonationRouteResponse(**route_data)
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Error calculating donation driving route: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error calculating route to organization."
        )


@router.get(
    "/{id}",
    response_model=DonationOrganizationResponse,
    summary="Get Single Donation Organization Details",
    responses={
        200: {"description": "Organization details retrieved."},
        404: {"description": "Organization not found."}
    }
)
async def get_single_donation_organization(
    id: str,
    db: AsyncDatabase = Depends(get_db)
) -> DonationOrganizationResponse:
    """
    Public Endpoint: GET /api/v1/donation-organizations/{id}
    """
    try:
        org = await get_donation_organization_by_id(db, id)
        if not org:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Donation organization with ID '{id}' was not found."
            )
        return DonationOrganizationResponse(**org)
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Error fetching donation organization '{id}': {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving organization details."
        )
