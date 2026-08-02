# Architecture Review & Migration Plan

This document provides a comprehensive architectural analysis of the current RevalueIQ codebase, based strictly on the current source code without making any modifications.

## 1. Current Project Folder Structure
The project currently suffers from a fractured, multi-stack structure containing four separate application roots:
- **`frontend/`**: The primary, active application. A Next.js 14 App Router project utilizing Tailwind CSS, `shadcn/ui`, Prisma ORM, and Clerk for authentication. 
- **`backend/`**: A stubbed Python FastAPI server containing only a basic `main.py` health-check. It does not currently handle any business logic.
- **`server/`**: A legacy or mocked Node.js/Express server that returns hardcoded JSON responses for analysis, advisor, and partner endpoints.
- **`client/`**: A legacy Vite + React application, largely unused compared to the Next.js `frontend`.

## 2. Frontend Architecture Analysis
- **Framework**: Next.js 14 (App Router).
- **Styling**: Tailwind CSS + `shadcn/ui` + `framer-motion` for micro-animations.
- **Auth**: Clerk (`@clerk/nextjs`).
- **State/Data**: Server components combined with Serverless API routes.
- **Architecture**: Monolithic serverless. The frontend is currently bearing the weight of both the UI and the heavy backend business logic via its `app/api` directory.

## 3. Backend Architecture Analysis (if any)
Currently, there is no unified backend:
- The actual production logic is embedded in **Next.js Serverless API routes** (`frontend/src/app/api`).
- The standalone `backend` (Python) and `server` (Node) directories are completely disconnected from the active data flow and contain only stubs or mocked data.

## 4. Files Containing Business Logic
- `frontend/src/app/api/analyze/route.ts`: Contains the core appraisal logic (parsing form data, processing images via Gemini Vision, determining condition/price).
- `frontend/src/app/api/repair-shops/search/route.ts`: Contains over 1000 lines of logic to search, filter, and calculate distances for repair shops based on user location and device type.
- `server/routes/analysis.js` & `server/routes/advisor.js`: Contain mocked/hardcoded business logic for legacy purposes.

## 5. Files Calling External APIs Directly
- `frontend/src/app/api/analyze/route.ts`: Calls **Google Generative AI (Gemini)** for image analysis and **Supabase Storage** for image hosting.
- `frontend/src/app/api/repair-shops/search/route.ts`: Calls **OpenStreetMap Nominatim API** and **Overpass API** for real-time geolocation and shop discovery.
- `frontend/src/app/api/newsletter/route.ts`: Calls **Resend API** for email delivery.

## 6. Files Containing Database Logic
- `frontend/prisma/schema.prisma`: Defines the PostgreSQL schema (e.g., `Appraisal` model).
- `frontend/src/lib/db.ts`: Instantiates the Prisma Client singleton.
- `frontend/src/app/api/analyze/route.ts`: Executes direct database writes (`db.appraisal.create`).

## 7. Files Containing Authentication Logic
- `frontend/src/middleware.ts`: Implements Clerk's `clerkMiddleware` to protect specific routes (e.g., `/dashboard`, `/upload`).
- `frontend/src/app/api/analyze/route.ts`: Interacts with Clerk's `auth()` helper to extract the `userId` before saving appraisals.

## 8. Environment Variables
Variables are primarily stored in `frontend/.env.local`:
- **Auth**: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
- **Database**: `DATABASE_URL`, `DIRECT_URL` (PostgreSQL)
- **Storage**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- **AI / External**: `GEMINI_API_KEY`, `RESEND_API_KEY`, `GNEWS_API_KEY`

## 9. Security Issues
- **Authentication Bypass**: In `api/analyze/route.ts`, if Clerk auth fails, the system silently catches the error and assigns a generic `"guest-mobile-user"`. This allows unauthenticated users to create DB records and exhaust expensive Gemini API quotas.
- **Missing Rate Limiting**: None of the external API endpoints (Gemini, Resend) are protected by rate limiters, leaving the application vulnerable to DDoS or billing exhaustion attacks.

## 10. Performance Issues
- **Synchronous Heavy APIs**: `api/analyze/route.ts` uploads an image to Supabase, queries the Gemini API with retries, and writes to a DB all within a single synchronous HTTP request. This is highly prone to serverless timeouts (typically 10-15s on Vercel/Netlify).
- **Bloated Endpoints**: `api/repair-shops/search/route.ts` is 1000+ lines long, performing multiple sequential HTTP calls to OpenStreetMap APIs which will block the thread and cause severe latency for the user.

## 11. Scalability Issues
- **Tight Coupling**: The Next.js frontend is tightly coupled to the database and heavy AI logic. Scaling the frontend UI independently of the heavy AI processing is currently impossible.
- **Connection Pooling**: Serverless functions scaling horizontally will rapidly spawn new Prisma connections, potentially exhausting the PostgreSQL database connection limit.

## 12. Maintainability Issues
- **Massive File Sizes**: Single files like the repair-shop search route are doing too much (routing, geocoding, business rules, external API fetching).
- **Fractured Codebase**: Having `frontend`, `backend`, `client`, and `server` directories causes severe developer confusion and fragments the domain logic.

## 13. Code Duplication
- There is significant duplication of domain concepts. The AI appraisal logic exists both in the Next.js API routes (production) and the `server` Express app (mocked).

---

## 14. Complete Migration Roadmap to an Enterprise Architecture

**Phase 1: Codebase Consolidation & Cleanup**
1. Delete the unused `client/` (Vite) and `server/` (Express) directories to eliminate confusion.
2. Decide on a unified backend stack. We recommend shifting all API routes out of Next.js and into the existing Python **FastAPI** (`backend/`) setup, as Python is significantly better suited for AI/ML processing (Gemini integration).

**Phase 2: Decoupling & API Gateway**
1. **Frontend**: The Next.js app should become a pure presentation layer. It will fetch data and submit forms to the FastAPI backend.
2. **Backend**: Migrate `analyze`, `repair-shops`, and `newsletter` logic from Next.js API routes into FastAPI controllers.
3. **Database**: Move Prisma schema and database management to the backend (e.g., using SQLAlchemy or Prisma Python).

**Phase 3: Asynchronous Processing (Message Queue)**
1. Implement a task queue (e.g., Celery + Redis for Python, or BullMQ for Node).
2. Refactor the Image Analysis flow:
   - Frontend uploads image -> Backend returns a `jobId`.
   - Backend processes Gemini AI and Supabase upload in the background worker.
   - Frontend polls or uses WebSockets to get the final result, eliminating HTTP timeouts entirely.

**Phase 4: Security & Scalability Hardening**
1. Implement strict JWT validation on the backend using Clerk's JWKS. Remove the `"guest-mobile-user"` fallback.
2. Add Rate Limiting (e.g., Redis-based token bucket) to all public-facing endpoints.
3. Modularize massive files (like `repair-shops/search`) into Services, Repositories, and Controllers to adhere to SOLID principles.
