# RevalueIQ — MongoDB Database Design & Data Architecture Specification

## 1. Database Technology Decision

The official database for the RevalueIQ platform is **MongoDB** (hosted on **MongoDB Atlas**), accessed asynchronously from the Python FastAPI backend via the official **Motor** async driver (`AsyncIOMotorClient`).

```
Next.js Frontend ──► FastAPI Backend ──► Motor Async Driver ──► MongoDB Atlas
```

### Why MongoDB for RevalueIQ?
1. **Flexible AI Data Representation:** RevalueIQ relies heavily on Google Gemini Vision and AI prompt engines. AI outputs (material recovery metrics, computer vision confidence scores, repairability indices, price trend projections) evolve rapidly. MongoDB's native BSON document format allows storing complex, deeply nested AI structures without rigid SQL schema migrations.
2. **Native Geospatial Search:** The platform features location-aware repair center discovery and donation hub finding. MongoDB's built-in `2dsphere` indexing and `$near` / `$geoWithin` operators perform high-speed radial proximity lookups directly on GeoJSON points.
3. **High-Throughput Async I/O:** The `motor` driver integrates seamlessly with FastAPI's `asyncio` event loop, handling concurrent requests non-blockingly.
4. **Rich Embedded Sub-Documents:** Atomic document reads allow fetching complete valuation reports, diagnostic guides, or repair shop profiles in a single query without complex SQL joins.

---

## 2. Document Architecture: Embedding vs Referencing Strategy

RevalueIQ applies clear design guidelines for document structure:

| Relationship Pattern | Strategy | Rationale |
| :--- | :--- | :--- |
| **User Profile ↔ User** | **Embedded / Separate Collection** | Core auth data (`users`) is separated from rich gamification stats (`user_profiles`) linked via `user_id` reference for security isolation. |
| **Valuation ↔ AI Insights & Materials** | **Embedded** | AI insights, carbon stats, and recovered metals are bounded, immutable outputs of a single valuation scan. Embedding ensures single-read atomic retrieval. |
| **Repair Report ↔ Parts & DIY Steps** | **Embedded** | Diagnostic steps, required tools, and OEM parts lists belong exclusively to that specific repair assessment. |
| **Repair Shop ↔ Geolocation & Services** | **Embedded** | GeoJSON coordinates `[lng, lat]` and service catalogs are embedded to enable `2dsphere` spatial indexing and instant rendering. |
| **Community Post ↔ Replies** | **Referenced (`post_replies`)** | Post replies can grow unbounded over time. Storing replies in a separate `post_replies` collection linked by `post_id` prevents document size limits (16MB). |
| **Marketplace Listing ↔ Orders** | **Referenced (`marketplace_orders`)** | Orders represent financial and shipping transactions involving seller, buyer, and payment state changes. |

---

## 3. Detailed Collection Specifications

### 3.1 Collection: `users`
Stores core user identity synced with Firebase Auth.

```json
{
  "_id": "ObjectId",
  "firebase_uid": "string (indexed, unique)",
  "email": "string (indexed, unique)",
  "full_name": "string",
  "role": "string (user | shop_owner | ngo_admin | admin)",
  "is_active": true,
  "is_verified": false,
  "created_at": "ISODate",
  "updated_at": "ISODate"
}
```
**Indexes:**
- `firebase_uid` (Unique)
- `email` (Unique)

---

### 3.2 Collection: `user_profiles`
Stores extended user profile information, gamification, and carbon metrics.

```json
{
  "_id": "ObjectId",
  "user_id": "ObjectId (ref: users._id, unique, indexed)",
  "phone": "string",
  "avatar_url": "string",
  "bio": "string",
  "city": "string",
  "country": "string",
  "occupation": "string",
  "organization": "string",
  "circular_score": 85,
  "circular_grade": "A",
  "co2_saved_kg": 148.5,
  "ewaste_prevented_kg": 18.2,
  "karma_points": 8450,
  "level": 7,
  "social_links": {
    "linkedin": "string",
    "github": "string",
    "twitter": "string",
    "website": "string"
  },
  "created_at": "ISODate",
  "updated_at": "ISODate"
}
```
**Indexes:**
- `user_id` (Unique)

---

### 3.3 Collection: `user_devices`
Stores registered electronic devices owned by users.

```json
{
  "_id": "ObjectId",
  "user_id": "ObjectId (ref: users._id, indexed)",
  "brand": "Apple",
  "model": "iPhone 15 Pro Max",
  "category": "Smartphone",
  "storage": "256GB",
  "ram": "8GB",
  "serial_number": "F2LXX00192",
  "purchase_year": "2023",
  "status": "Active (Active | Listed | Repaired | Donated | Recycled)",
  "primary_image": "https://images.unsplash.com/...",
  "created_at": "ISODate",
  "updated_at": "ISODate"
}
```
**Indexes:**
- `user_id`, `status` (Compound)

---

### 3.4 Collection: `device_valuations` (AI Data Hub)
Stores comprehensive AI-generated device valuation reports.

```json
{
  "_id": "ObjectId",
  "valuation_code": "VAL-894210 (unique, indexed)",
  "user_id": "ObjectId (ref: users._id, indexed)",
  "device_id": "ObjectId (ref: user_devices._id, optional)",
  "device_name": "Apple iPhone 15 Pro Max 256GB",
  "brand": "Apple",
  "category": "Smartphone",
  "model": "iPhone 15 Pro Max",
  "storage": "256GB",
  "condition_details": {
    "grade": "Grade A+ Pristine",
    "functional_status": "Fully Functional",
    "has_original_box": true,
    "has_charger": true,
    "additional_notes": "Minor micro-scratches on side frame."
  },
  "valuation": {
    "estimated_value_min": 68000,
    "estimated_value_max": 74000,
    "recommended_listing_price": 72000,
    "trade_in_value": 61000,
    "original_msrp": 139900,
    "value_retention_percent": 52
  },
  "circular_metrics": {
    "circular_score": 94,
    "eco_grade": "A+",
    "co2_offset_kg": 48.0,
    "ewaste_diverted_kg": 0.24,
    "materials_recovered": {
      "gold_mg": 35,
      "silver_mg": 180,
      "copper_grams": 22,
      "cobalt_grams": 45,
      "aluminum_grams": 120
    }
  },
  "ai_insights": [
    {
      "category": "Cosmetic",
      "title": "Surface Topology Verification",
      "description": "97.4% enclosure purity confirmed under vision scan.",
      "confidence": 98.2,
      "type": "positive"
    }
  ],
  "image_urls": ["https://..."],
  "confidence_score": 97.8,
  "created_at": "ISODate"
}
```
**Indexes:**
- `valuation_code` (Unique)
- `user_id`, `created_at` (Compound descending)
- `category`

---

### 3.5 Collection: `repair_reports`
Stores AI diagnostic assessments and DIY vs Pro ROI calculations.

```json
{
  "_id": "ObjectId",
  "report_code": "REP-98214 (unique, indexed)",
  "user_id": "ObjectId (ref: users._id, indexed)",
  "device_name": "iPhone 14 Pro",
  "category": "Smartphone",
  "primary_image": "https://...",
  "problem_identified": {
    "title": "Cracked OLED Screen Glass",
    "symptom_category": "Screen & Battery",
    "summary": "OLED digitizer spiderweb crack with 74% battery health.",
    "root_cause": "Impact drop on hard surface causing micro-fracture propagation.",
    "affected_components": ["Primary Display", "Internal Battery"]
  },
  "severity": {
    "level": "High",
    "score": 78,
    "color": "#f97316",
    "risk_note": "Immediate repair advised to prevent thermal runaway."
  },
  "cost_breakdown": {
    "oem_parts_cost": 115,
    "third_party_parts_cost": 65,
    "labor_cost_est": 60,
    "diy_savings": 110
  },
  "required_parts": [
    {
      "name": "iPhone 14 Pro OEM Front Screen Assembly",
      "oem_price": 115,
      "aftermarket_price": 65,
      "availability": "In Stock"
    }
  ],
  "diy_recommendation": {
    "feasibility": "High",
    "steps": ["1. Heat edges", "2. Lift display panel", "3. Swap component"],
    "tools_required": ["Precision Driver Kit", "Heat Gun", "Suction Clamp"]
  },
  "created_at": "ISODate"
}
```
**Indexes:**
- `report_code` (Unique)
- `user_id`, `created_at` (Compound)

---

### 3.6 Collection: `repair_shops` (Geospatial Enabled)
Stores certified workshop listings with GeoJSON geospatial points.

```json
{
  "_id": "ObjectId",
  "name": "iFix Green Labs & Repair Hub",
  "tagline": "Certified OEM Parts & Zero-Landfill Guarantee",
  "rating": 4.9,
  "review_count": 342,
  "ai_trust_score": 98,
  "location": {
    "type": "Point",
    "coordinates": [-122.4024, 37.7882]
  },
  "address": {
    "street": "742 Market Street, Suite 400",
    "city": "San Francisco",
    "state": "CA",
    "zip_code": "94103"
  },
  "phone": "(415) 890-3412",
  "email": "support@ifixgreenlabs.com",
  "verified_partner": true,
  "pickup_available": true,
  "services": [
    {
      "service_id": "serv-screen",
      "name": "OLED Screen Replacement",
      "price": 129,
      "duration": "45-60 mins"
    }
  ],
  "created_at": "ISODate"
}
```
**Indexes:**
- `location`: `2dsphere` (Geospatial index for radial distance searches)
- `rating`
- `verified_partner`

---

### 3.7 Collection: `repair_bookings`
Appointments booked by users at repair shops.

```json
{
  "_id": "ObjectId",
  "booking_code": "RIX-88421 (unique, indexed)",
  "user_id": "ObjectId (ref: users._id, indexed)",
  "shop_id": "ObjectId (ref: repair_shops._id, indexed)",
  "device_category": "Smartphone",
  "device_model": "iPhone 14 Pro",
  "issue_type": "OLED Screen Replacement",
  "booking_date": "2026-08-15",
  "time_slot": "10:30 AM - 11:30 AM",
  "pickup_requested": true,
  "pickup_address": "123 Green St, San Francisco, CA",
  "estimated_cost": 129,
  "status": "Confirmed (Confirmed | In Progress | Completed | Cancelled)",
  "created_at": "ISODate"
}
```
**Indexes:**
- `booking_code` (Unique)
- `user_id`, `created_at` (Compound)
- `shop_id`, `status` (Compound)

---

### 3.8 Collection: `marketplace_listings`
Refurbished tech products listed on the circular marketplace.

```json
{
  "_id": "ObjectId",
  "seller_id": "ObjectId (ref: users._id, indexed)",
  "title": "Refurbished Sony WH-1000XM5 Wireless Headphones",
  "description": "Certified pristine condition with original box.",
  "category": "Audio",
  "brand": "Sony",
  "model": "WH-1000XM5",
  "price": 18990,
  "original_msrp": 29990,
  "condition_grade": "Grade A+ (Certified)",
  "images": ["https://..."],
  "status": "Active (Active | Pending Escrow | Sold | Archived)",
  "created_at": "ISODate",
  "updated_at": "ISODate"
}
```
**Indexes:**
- `category`, `price`, `status` (Compound search index)
- `seller_id`
- `created_at` (Descending)

---

### 3.9 Collection: `marketplace_orders`
Purchase transactions managed via marketplace escrow.

```json
{
  "_id": "ObjectId",
  "order_number": "ORD-2026-9812 (unique, indexed)",
  "buyer_id": "ObjectId (ref: users._id, indexed)",
  "seller_id": "ObjectId (ref: users._id, indexed)",
  "listing_id": "ObjectId (ref: marketplace_listings._id)",
  "total_amount": 18990,
  "escrow_status": "Held (Held | Released | Refunded)",
  "delivery_status": "Processing (Processing | Shipped | Delivered)",
  "payment_reference_id": "string",
  "shipping_address": {
    "full_name": "Rupam Das",
    "city": "Hyderabad",
    "state": "Telangana",
    "pincode": "500081"
  },
  "created_at": "ISODate"
}
```
**Indexes:**
- `order_number` (Unique)
- `buyer_id`
- `seller_id`

---

### 3.10 Collection: `donation_centers` (Geospatial Enabled)
NGOs, school trusts, and government e-waste collection hubs.

```json
{
  "_id": "ObjectId",
  "name": "TechForGood Foundation",
  "verification_badge": "Verified NGO",
  "category": "Digital Literacy Programs",
  "rating": 4.9,
  "location": {
    "type": "Point",
    "coordinates": [78.3742, 17.4486]
  },
  "address": {
    "street": "Plot 42, Innovation Corridor",
    "city": "Hyderabad",
    "pincode": "500081"
  },
  "accepted_devices": ["Laptops", "Tablets", "Smartphones"],
  "tax_exemption_eligible": true,
  "impact_stats": {
    "devices_received": 3420,
    "beneficiaries_count": 12400,
    "co2_saved_kg": 18500
  },
  "created_at": "ISODate"
}
```
**Indexes:**
- `location`: `2dsphere` (Geospatial radial searching)
- `category`

---

### 3.11 Collection: `donations`
User device donations and carbon offset certificates.

```json
{
  "_id": "ObjectId",
  "certificate_id": "DON-2026-89412-EC (unique, indexed)",
  "user_id": "ObjectId (ref: users._id, indexed)",
  "organization_id": "ObjectId (ref: donation_centers._id, indexed)",
  "device_name": "MacBook Air 2017 (13-inch)",
  "device_category": "Laptops",
  "fulfillment_type": "Pickup",
  "pickup_details": {
    "date": "2026-07-29",
    "slot": "10:00 AM - 1:00 PM"
  },
  "co2_saved_kg": 145.2,
  "trees_equivalent": 6.5,
  "status": "Completed (Scheduled | In Transit | Completed)",
  "created_at": "ISODate"
}
```
**Indexes:**
- `certificate_id` (Unique)
- `user_id`

---

### 3.12 Collection: `community_posts` & `post_replies`
Forum posts and discussion threads.

#### `community_posts`
```json
{
  "_id": "ObjectId",
  "author_id": "ObjectId (ref: users._id, indexed)",
  "title": "MacBook Pro Thermal Paste Restoration Guide",
  "description": "Restoring an Intel MacBook Pro by applying MX-6 thermal paste.",
  "content": "Full markdown body text...",
  "category": "Repair",
  "tags": ["MacBook", "DIYRepair"],
  "views_count": 1240,
  "likes_count": 156,
  "replies_count": 18,
  "is_pinned": true,
  "created_at": "ISODate"
}
```
**Indexes:**
- `category`, `created_at` (Compound)
- `author_id`

#### `post_replies` (Separate collection for unbounded scaling)
```json
{
  "_id": "ObjectId",
  "post_id": "ObjectId (ref: community_posts._id, indexed)",
  "author_id": "ObjectId (ref: users._id, indexed)",
  "content": "This saved my 2017 Touch Bar model!",
  "likes_count": 14,
  "is_helpful_answer": true,
  "created_at": "ISODate"
}
```
**Indexes:**
- `post_id`, `created_at` (Compound ascending)

---

### 3.13 Collection: `notifications` & `payments`

#### `notifications`
```json
{
  "_id": "ObjectId",
  "user_id": "ObjectId (ref: users._id, indexed)",
  "type": "reply",
  "title": "New Reply on your Post",
  "message": "Dr. Aris Thorne replied to your guide.",
  "is_read": false,
  "link_id": "post-1",
  "created_at": "ISODate"
}
```
**Indexes:**
- `user_id`, `is_read` (Compound)

#### `payments`
```json
{
  "_id": "ObjectId",
  "user_id": "ObjectId (ref: users._id, indexed)",
  "order_id": "ObjectId (ref: marketplace_orders._id, indexed)",
  "gateway": "Razorpay (Razorpay | Stripe)",
  "payment_intent_id": "pay_K81920JAS",
  "amount": 18990,
  "currency": "INR",
  "status": "Success (Pending | Success | Failed)",
  "created_at": "ISODate"
}
```
**Indexes:**
- `payment_intent_id` (Unique)
- `user_id`

---

## 4. Security & Environmental Configuration

### Secrets & Environment Variables (`.env`)
```env
# MongoDB Atlas Connection
MONGODB_URI="mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority"
MONGODB_DATABASE_NAME="revalueiq_db"

# Firebase Admin SDK Configuration
FIREBASE_PROJECT_ID="revalueiq-dev"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk@revalueiq-dev.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"

# AI Service Keys
GEMINI_API_KEY="AIzaSy..."
```

### Payment & Data Security Guidelines
- Raw credit card numbers, CVVs, and banking secrets are **NEVER** stored in MongoDB.
- All timestamps are stored as standard BSON `ISODate` in UTC.
