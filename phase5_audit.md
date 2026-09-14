# Phase 5 Audit: Marketplace / Selling Workflow

**Project:** RevalueIQ  
**Phase:** Phase 5 — Marketplace / Selling Workflow End-to-End  
**Date:** 2026-08-23  

---

## 1. Existing Marketplace Functionality

- **Frontend Navigation & Views:**
  - `(protected)/marketplace/page.tsx` exists and serves as the primary marketplace view with tabs: `Marketplace` (browse all), `Seller Dashboard` (my listings & statistics), `Wishlist`, `Recently Viewed`, and `Sell Electronics` modal trigger.
  - Rich UI exists including Hero section, environmental impact cards, smart search, category filter cards, featured devices, filter sidebar, product grid, product details modal, and device comparison drawer.
  - Multi-step modal `SellProductForm.tsx` currently exists in mock simulation mode (steps: 1. Device Specs -> 2. Diagnostics -> 3. AI Appraisal -> 4. Publish).
  - Seller dashboard `MarketplaceDashboard.tsx` and `MyListings.tsx` display mock active/sold/draft listing summaries.
  - Currently all marketplace state in the frontend is hardcoded to `INITIAL_PRODUCTS` and `INITIAL_MY_LISTINGS` from `mockData.ts`. No real backend API calls are made.

- **Backend Functionality:**
  - `backend/app/db/indexes.py` had placeholder index definitions for `marketplace_listings` (`category, status, price`, `seller_id`, `created_at`).
  - No `marketplace.py` schema or router currently exists in `backend/app/schemas/` or `backend/app/api/v1/`.
  - No `marketplace_service.py` currently exists in `backend/app/services/`.

---

## 2. Existing Frontend Components

| Component | Path | Description & Status | Action for Phase 5 |
| :--- | :--- | :--- | :--- |
| `ProtectedMarketplacePage` | `frontend/src/app/(protected)/marketplace/page.tsx` | Main orchestrator page. Uses mock initial states. | **Modify**: Wire to real API client (`marketplaceApi.ts`), integrate dynamic loading/error states, fetch public listings and seller listings. |
| `SellProductForm` | `frontend/src/components/marketplace/SellProductForm.tsx` | 4-step selling modal. Currently uses simulated timeouts and mock data. | **Modify**: Connect to user's registered devices (`/users/me/devices`), fetch completed valuations (`/valuations`), allow image upload / data URIs, call `POST /api/v1/marketplace/listings` and `/publish`. |
| `ProductDetailsModal` | `frontend/src/components/marketplace/ProductDetailsModal.tsx` | Detailed view of a listing with AI diagnostics, seller profile, and specifications. | **Modify**: Ensure full support for real listing data structure, INR currency formatting (`₹`), view incrementing, seller isolation. |
| `MarketplaceDashboard` | `frontend/src/components/marketplace/MarketplaceDashboard.tsx` | Seller analytics & listing table. | **Modify**: Wire actions (Publish, Unpublish, Delete, Mark as Sold, Edit) to real API endpoints. |
| `MyListings` | `frontend/src/components/marketplace/MyListings.tsx` | Tabbed listing view (Active, Sold, Pending/Draft). | **Modify**: Wire to real backend `GET /api/v1/marketplace/my-listings`. |
| `ProductCard` | `frontend/src/components/marketplace/ProductCard.tsx` | Listing card with image, AI badge, price, circular metrics. | **Modify**: Ensure INR currency formatting and real backend listing fields. |
| `ProductGrid` | `frontend/src/components/marketplace/ProductGrid.tsx` | Grid displaying cards with empty state. | **Reuse/Refine**: Ensure compatibility with server-side filtered data. |
| `FilterSidebar` | `frontend/src/components/marketplace/FilterSidebar.tsx` | Category, brand, price range, condition grade filters. | **Reuse/Refine**: Ensure filter values match backend query parameters. |
| `SmartSearch` | `frontend/src/components/marketplace/SmartSearch.tsx` | Search bar and quick category pills. | **Reuse**: Sync with state. |
| `CategoryCards` | `frontend/src/components/marketplace/CategoryCards.tsx` | Visual category filter buttons. | **Reuse**: Dynamic counts. |
| `FeaturedDevices` | `frontend/src/components/marketplace/FeaturedDevices.tsx` | Carousel/grid of top listings. | **Reuse**: Pass top real listings. |
| `EnvironmentalImpactCards` | `frontend/src/components/marketplace/EnvironmentalImpactCards.tsx` | Impact stats. | **Reuse**: Aggregate real/platform impact. |
| `CompareDrawer` | `frontend/src/components/marketplace/CompareDrawer.tsx` | Device comparison drawer. | **Reuse**: Works client-side with real loaded products. |
| `WishlistSection` | `frontend/src/components/marketplace/WishlistSection.tsx` | Wishlist view. | **Reuse**: Preserves local wishlist with real products. |
| `ContactSellerModal` | `frontend/src/components/marketplace/ContactSellerModal.tsx` | Modal to initiate seller contact. | **Reuse**: Safe seller contact modal. |

---

## 3. Existing Backend Functionality & Gaps

- **Existing Foundation (Phases 0–4):**
  - Robust Firebase Auth verification via `get_current_user` dependency in `app/api/deps.py`.
  - User and Profile services (`user_service.py`, `users_service.py`).
  - Registered devices collection `user_devices` and endpoints (`/api/v1/users/me/devices`).
  - Valuation collection `device_valuations` and endpoints (`/api/v1/valuations`).
  - Repair Advisory service & endpoints (`/api/v1/repair-advisory`).
- **Backend Gaps for Phase 5:**
  - `backend/app/schemas/marketplace.py` missing.
  - `backend/app/services/marketplace_service.py` missing.
  - `backend/app/api/v1/marketplace.py` missing.
  - `api_v1_router` in `backend/app/api/v1/router.py` does not include marketplace router.
  - MongoDB collection `marketplace_listings` indexes need comprehensive initialization.
  - Backend tests `backend/tests/test_marketplace_phase5.py` missing.

---

## 4. Existing Database Structures & Target Data Model

### Target Collection: `marketplace_listings`
```json
{
  "_id": "ObjectId",
  "listing_code": "LIST-482931 (unique, indexed)",
  "seller_id": "ObjectId (ref: users._id, indexed)",
  "seller_info": {
    "name": "string",
    "avatar": "string",
    "location": "string",
    "rating": 5.0,
    "reviews_count": 0,
    "verified": true
  },
  "device_id": "ObjectId (ref: user_devices._id, optional, indexed)",
  "valuation_id": "ObjectId (ref: device_valuations._id, optional, indexed)",
  "category": "Phones | Laptops | Tablets | Gaming | Accessories | Cameras | Smart Watches | Audio | Other",
  "brand": "string",
  "model": "string",
  "title": "string",
  "description": "string",
  "condition": "A+ | A | B+ | B | C",
  "functional_status": "Fully Functional | Minor Issues | Needs Repair",
  "specifications": {
    "ram": "string",
    "storage": "string",
    "purchase_year": 2023,
    "color": "string",
    "processor": "string",
    "display": "string",
    "battery_health": "string",
    "other": {}
  },
  "images": [
    {
      "url": "string",
      "type": "string",
      "order": 0
    }
  ],
  "valuation": {
    "estimated_value_inr": 42000,
    "minimum_value_inr": 38000,
    "maximum_value_inr": 45000,
    "circularity_score": 92,
    "co2_saved_kg": 74.5,
    "ewaste_diverted_kg": 0.85,
    "water_saved_liters": 14500,
    "valuation_id": "string",
    "valuation_code": "string"
  },
  "asking_price_inr": 40000,
  "original_price_inr": 55000,
  "warranty": "string",
  "return_policy": "string",
  "shipping_method": "string",
  "pricing_metadata": {
    "valuation_based": true,
    "seller_entered": true,
    "suggested_price_inr": 42000
  },
  "status": "DRAFT | PUBLISHED | UNPUBLISHED | SOLD | REMOVED",
  "views": 0,
  "inquiries": 0,
  "created_at": "datetime",
  "updated_at": "datetime",
  "published_at": "datetime (optional)",
  "sold_at": "datetime (optional)"
}
```

---

## 5. Indexing Plan

In `backend/app/db/indexes.py`:
- `listing_code`: Unique index
- `seller_id` + `created_at`: Compound index
- `status` + `created_at`: Compound index
- `category` + `status`: Compound index
- `brand` + `status`: Compound index
- `asking_price_inr`: Index
- `device_id`: Sparse index
- `valuation_id`: Sparse index
- Text search index on `title`, `description`, `brand`, `model`

---

## 6. Files to Reuse, Modify, and Create

### Files to Reuse:
- `frontend/src/lib/api.ts` (`fetchWithAuth`)
- `frontend/src/context/AuthContext.tsx`
- `frontend/src/components/marketplace/CategoryCards.tsx`
- `frontend/src/components/marketplace/EnvironmentalImpactCards.tsx`
- `frontend/src/components/marketplace/CompareDrawer.tsx`
- `frontend/src/components/marketplace/ContactSellerModal.tsx`
- `frontend/src/components/marketplace/SmartSearch.tsx`
- `frontend/src/components/marketplace/FilterSidebar.tsx`
- `backend/app/core/security.py`
- `backend/app/db/mongo.py`

### Files to Modify:
- `backend/app/db/indexes.py` — Add full marketplace indexes
- `backend/app/api/v1/router.py` — Register marketplace router
- `frontend/src/app/(protected)/marketplace/page.tsx` — Connect to API client, handle async states, real filters and pagination
- `frontend/src/components/marketplace/types.ts` — Align types with backend models
- `frontend/src/components/marketplace/SellProductForm.tsx` — Integrate registered device selection, Phase 3 valuation auto-fill, image upload, real listing submission
- `frontend/src/components/marketplace/MarketplaceDashboard.tsx` — Connect listing management actions to backend
- `frontend/src/components/marketplace/MyListings.tsx` — Connect to real backend data
- `frontend/src/components/marketplace/ProductCard.tsx` — Ensure INR `₹` currency rendering and real backend schema compatibility
- `frontend/src/components/marketplace/ProductDetailsModal.tsx` — Connect to backend listing details, INR pricing, increment view safely

### Files to Create:
- `backend/app/schemas/marketplace.py` — Strict Pydantic models & enums
- `backend/app/services/marketplace_service.py` — Business logic, device & valuation ownership validation, IDOR prevention, search & filtering, status transitions
- `backend/app/api/v1/marketplace.py` — FastAPI REST endpoints
- `frontend/src/lib/marketplaceApi.ts` — Frontend API client utilizing `fetchWithAuth()`
- `backend/tests/test_marketplace_phase5.py` — Full backend test suite covering 39+ criteria

---

## 7. Potential Phase 3 Conflicts & Safety Rules

- **Valuation Immutability:** Marketplace listings will **read** from `device_valuations` records but will **never modify or mutate** valuation records in MongoDB.
- **Valuation Reference Integrity:** A listing can link to a valuation, but if the valuation does not belong to the authenticated seller, the backend will reject the request with HTTP 404 (preventing IDOR enumeration).
- **Device Reference Integrity:** If a `device_id` is supplied, it must belong to `current_user.id` in `user_devices`. Otherwise reject with HTTP 404.

---

## 8. Security & IDOR Risks and Countermeasures

1. **Foreign Listing Modification (PATCH / DELETE):**
   - Query filters strictly by `_id = listing_id` AND `seller_id = current_user.id`.
   - If not found or owned by another user, return `404 Not Found`.
2. **Foreign Device / Valuation Injection:**
   - Always query `user_devices` with `user_id = current_user.id` and `device_valuations` with `user_id = current_user.id`.
   - Any ownership mismatch returns `404 Not Found`.
3. **Public Exposure of Private Seller Details:**
   - Responses for public browse endpoints project only safe seller info (`name`, `avatar`, `location`, `rating`), omitting Firebase UID, email, or private device metadata.
4. **Draft/Unpublished Listing Privacy:**
   - Public listing search/get endpoints strictly filter by `status == "PUBLISHED"`.
   - Direct GET by ID allows owner to view DRAFT/UNPUBLISHED, but non-owners receive `404 Not Found` for non-published listings.
5. **Self-Purchase Prevention:**
   - Enforce check preventing seller from ordering or purchasing their own listing.
6. **Price & Data Validation:**
   - `asking_price_inr` must be integer > 0, max 10,000,000 INR. No negatives, NaN, or infinity.
