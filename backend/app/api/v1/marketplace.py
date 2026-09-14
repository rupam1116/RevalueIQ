import logging
from typing import Optional, List
from bson import ObjectId
from fastapi import APIRouter, Depends, Query, Path, status, HTTPException
from pymongo.asynchronous.database import AsyncDatabase

from app.api.deps import (
    get_db,
    get_current_user,
    get_optional_current_user,
    AuthenticatedUser,
)
from app.schemas.marketplace import (
    MarketplaceListingCreate,
    MarketplaceListingUpdate,
    MarketplaceListingResponse,
    MarketplaceListResponse,
)
from app.services.marketplace_service import (
    create_marketplace_listing,
    get_published_listings,
    get_listing_by_id,
    get_my_listings,
    update_marketplace_listing,
    publish_marketplace_listing,
    unpublish_marketplace_listing,
    mark_listing_sold,
    delete_marketplace_listing,
)

logger = logging.getLogger("revalueiq.api.marketplace")

router = APIRouter(prefix="/marketplace", tags=["Marketplace"])


@router.post(
    "/listings",
    response_model=MarketplaceListingResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Marketplace Listing",
    description="Creates a new circular electronics listing. Can be saved as draft or published immediately.",
)
async def create_listing(
    payload: MarketplaceListingCreate,
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db),
) -> MarketplaceListingResponse:
    """
    POST /api/v1/marketplace/listings
    Validates seller, registered device (if selected), Phase 3 valuation (if linked), and inputs.
    """
    try:
        user_id = ObjectId(current_user.id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user identification."
        )

    listing_dict = await create_marketplace_listing(db, user_id, payload)
    return MarketplaceListingResponse(**listing_dict)


@router.get(
    "/listings",
    response_model=MarketplaceListResponse,
    summary="Browse Public Marketplace Listings",
    description="Retrieves published electronics listings with keyword search, category, brand, condition, and price filters.",
)
async def list_public_listings(
    search: Optional[str] = Query(None, description="Search term across title, description, brand, and model"),
    category: Optional[str] = Query(None, description="Filter by device category (e.g. Phones, Laptops)"),
    brand: Optional[str] = Query(None, description="Filter by brand (single or comma-separated)"),
    condition: Optional[str] = Query(None, description="Filter by condition grade (e.g. A+, A, B)"),
    min_price: Optional[float] = Query(None, ge=0, description="Minimum asking price in INR"),
    max_price: Optional[float] = Query(None, ge=0, description="Maximum asking price in INR"),
    sort: Optional[str] = Query("newest", description="Sorting criterion: newest, price-low, price-high, rating, views, ai-score"),
    page: int = Query(1, ge=1, description="Page index (1-based)"),
    limit: int = Query(20, ge=1, le=100, description="Number of results per page"),
    current_user: Optional[AuthenticatedUser] = Depends(get_optional_current_user),
    db: AsyncDatabase = Depends(get_db),
) -> MarketplaceListResponse:
    """
    GET /api/v1/marketplace/listings
    """
    current_user_id = ObjectId(current_user.id) if current_user else None
    items, total, total_pages = await get_published_listings(
        db=db,
        search=search,
        category=category,
        brand=brand,
        condition=condition,
        min_price=min_price,
        max_price=max_price,
        sort=sort,
        page=page,
        limit=limit,
        current_user_id=current_user_id,
    )

    return MarketplaceListResponse(
        items=[MarketplaceListingResponse(**i) for i in items],
        total=total,
        page=page,
        limit=limit,
        total_pages=total_pages,
    )


@router.get(
    "/my-listings",
    response_model=MarketplaceListResponse,
    summary="Get Authenticated User Listings",
    description="Retrieves all listings belonging to the authenticated seller (active, draft, unpublished, sold).",
)
async def list_my_listings(
    status: Optional[str] = Query(None, description="Filter by status: all, active, pending, draft, sold"),
    search: Optional[str] = Query(None, description="Search term within seller's listings"),
    page: int = Query(1, ge=1, description="Page index"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db),
) -> MarketplaceListResponse:
    """
    GET /api/v1/marketplace/my-listings
    """
    user_id = ObjectId(current_user.id)
    items, total, total_pages = await get_my_listings(
        db=db,
        user_id=user_id,
        status_filter=status,
        search=search,
        page=page,
        limit=limit,
    )

    return MarketplaceListResponse(
        items=[MarketplaceListingResponse(**i) for i in items],
        total=total,
        page=page,
        limit=limit,
        total_pages=total_pages,
    )


@router.get(
    "/listings/{listing_id}",
    response_model=MarketplaceListingResponse,
    summary="Get Listing Details",
    description="Retrieves comprehensive details for a specific listing. Increments view counter for public viewers.",
)
async def get_listing(
    listing_id: str = Path(..., description="BSON ObjectId or unique identifier of the listing"),
    current_user: Optional[AuthenticatedUser] = Depends(get_optional_current_user),
    db: AsyncDatabase = Depends(get_db),
) -> MarketplaceListingResponse:
    """
    GET /api/v1/marketplace/listings/{listing_id}
    """
    current_user_id = ObjectId(current_user.id) if current_user else None
    doc = await get_listing_by_id(
        db=db,
        listing_id=listing_id,
        current_user_id=current_user_id,
        increment_view=True,
    )
    return MarketplaceListingResponse(**doc)


@router.patch(
    "/listings/{listing_id}",
    response_model=MarketplaceListingResponse,
    summary="Update Listing",
    description="Updates listing details. Only the authenticated owner can modify their listing.",
)
async def update_listing(
    payload: MarketplaceListingUpdate,
    listing_id: str = Path(..., description="Listing ID to update"),
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db),
) -> MarketplaceListingResponse:
    """
    PATCH /api/v1/marketplace/listings/{listing_id}
    """
    user_id = ObjectId(current_user.id)
    doc = await update_marketplace_listing(db, listing_id, user_id, payload)
    return MarketplaceListingResponse(**doc)


@router.post(
    "/listings/{listing_id}/publish",
    response_model=MarketplaceListingResponse,
    summary="Publish Listing",
    description="Publishes a draft or unpublished listing. Validates that all mandatory fields and photos are present.",
)
async def publish_listing(
    listing_id: str = Path(..., description="Listing ID to publish"),
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db),
) -> MarketplaceListingResponse:
    """
    POST /api/v1/marketplace/listings/{listing_id}/publish
    """
    user_id = ObjectId(current_user.id)
    doc = await publish_marketplace_listing(db, listing_id, user_id)
    return MarketplaceListingResponse(**doc)


@router.post(
    "/listings/{listing_id}/unpublish",
    response_model=MarketplaceListingResponse,
    summary="Unpublish / Pause Listing",
    description="Pauses a published listing, removing it from public browse while preserving it in the seller's dashboard.",
)
async def unpublish_listing(
    listing_id: str = Path(..., description="Listing ID to pause"),
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db),
) -> MarketplaceListingResponse:
    """
    POST /api/v1/marketplace/listings/{listing_id}/unpublish
    """
    user_id = ObjectId(current_user.id)
    doc = await unpublish_marketplace_listing(db, listing_id, user_id)
    return MarketplaceListingResponse(**doc)


@router.post(
    "/listings/{listing_id}/sold",
    response_model=MarketplaceListingResponse,
    summary="Mark Listing as Sold",
    description="Marks an active listing as sold.",
)
async def mark_sold(
    listing_id: str = Path(..., description="Listing ID to mark as sold"),
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db),
) -> MarketplaceListingResponse:
    """
    POST /api/v1/marketplace/listings/{listing_id}/sold
    """
    user_id = ObjectId(current_user.id)
    doc = await mark_listing_sold(db, listing_id, user_id)
    return MarketplaceListingResponse(**doc)


@router.delete(
    "/listings/{listing_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete Listing",
    description="Removes an unsold listing belonging to the authenticated user.",
)
async def delete_listing(
    listing_id: str = Path(..., description="Listing ID to delete"),
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db),
) -> None:
    """
    DELETE /api/v1/marketplace/listings/{listing_id}
    """
    user_id = ObjectId(current_user.id)
    await delete_marketplace_listing(db, listing_id, user_id)


@router.post(
    "/upload-image",
    status_code=status.HTTP_200_OK,
    summary="Upload Marketplace Image to Cloudinary",
    description="Uploads an image to permanent Cloudinary storage for marketplace listings.",
)
async def upload_image(
    payload: dict,
    current_user: AuthenticatedUser = Depends(get_current_user),
) -> dict:
    """
    POST /api/v1/marketplace/upload-image
    """
    from app.services.cloudinary_service import cloudinary_service
    image_data = payload.get("image_data") or payload.get("url")
    if not image_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image data is required."
        )
    listing_code = payload.get("listing_code") or "temp"
    index = payload.get("index", 1)
    uploaded = cloudinary_service.upload_marketplace_image(
        image_data=image_data,
        user_id=str(current_user.id),
        listing_code=listing_code,
        image_index=index,
    )
    return uploaded
