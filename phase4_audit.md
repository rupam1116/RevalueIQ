# Phase 4 — Repair Advisory Audit & Architecture Plan

**Project:** RevalueIQ  
**Target:** Phase 4 — Repair Advisory Full End-to-End Implementation  
**Audit Date:** August 19, 2026  

---

## 1. Existing Repair Advisory Functionality

### Frontend (`frontend/src/`):
- **Pages:**
  - `src/app/(protected)/repair/page.tsx` & `src/app/app/repair/page.tsx`: Wraps `RepairModule` component with tab navigation.
  - `src/app/(protected)/repair/recommendation/page.tsx` & `src/app/app/repair/recommendation/page.tsx`: Displays post-diagnosis authorized repair centers and appointment booking UI.
- **Components (`src/components/app/repair/`):**
  - `RepairModule.tsx`: Orchestrates the 3-stage diagnosis flow (`idle` -> `diagnosing` -> `report`).
  - `DeviceSelectionCards.tsx`: UI for selecting category, brand, and popular model.
  - `ProblemDescriptionForm.tsx`: Form inputs for primary symptom category, issue headline, detailed description, severity level, power status toggle, liquid exposure toggle, and prior repair history.
  - `RepairImageUploadZone.tsx`: Upload zone with tag assignment ("Front View", "Close-up Damage", etc.).
  - `AIDiagnosisAnimation.tsx`: Visual scanning HUD with 5-stage progress animation and terminal telemetry logs.
  - `AIRepairReportView.tsx`: Comprehensive diagnostic report view with severity badge, cost range, DIY steps, required parts, nearby shops, and environmental circular impact metrics.
  - `RepairHistoryTable.tsx`: Searchable history log table.
  - `RepairFloatingAIAssistant.tsx` & `RepairPDFReportModal.tsx`: Copilot drawer and PDF export modal.
- **Types & Mock Data:**
  - `src/types/repair.ts`: Type definitions for `RepairReport`, `RepairProblemForm`, `RepairDeviceSelection`, `RepairHistoryItem`, `RequiredPartItem`, etc.
  - `src/lib/mockRepairData.ts`: Static mock generators (`generateMockRepairReport`, `INITIAL_REPAIR_HISTORY`, `DEMO_REPAIR_PRESETS`).

### Backend (`backend/app/`):
- **Existing Services & Infrastructure:**
  - `app/core/gemini.py` & `app/services/gemini_service.py`: Google GenAI SDK integration with Gemini 2.5/Flash model, error mapping (429, 502, 503, 504), image preparation helper (`_prepare_image_part`), and structured response parsing.
  - `app/core/security.py` & `app/api/deps.py`: Firebase ID token authentication (`get_current_user`), MongoDB database injection (`get_db`).
  - `app/services/device_service.py` & `app/api/v1/devices.py`: User registered device CRUD (`/api/v1/users/me/devices`).
  - `app/services/valuation_service.py` & `app/api/v1/valuations.py`: Phase 3 valuation analysis, image analysis, and valuation-to-device registration.
  - `app/db/indexes.py`: Indexes initialized for `user_devices`, `device_valuations`, and `repair_reports`.

---

## 2. Missing Functionality

1. **Backend Repair Advisory Endpoints:**
   - No dedicated `/api/v1/repair-advisory` or `/api/v1/repair-advisory/analyze` FastAPI router exists yet in `app/api/v1/router.py`.
2. **Dedicated Repair AI Schema & Prompt:**
   - Need strict Pydantic schemas (`RepairAdvisoryRequest`, `RepairAdvisoryResponse`, `GeminiRepairAdvisoryResult`) adhering to consumer-electronics repair standards.
   - Dedicated `REPAIR_ADVISORY_SYSTEM_PROMPT` instructing Gemini to identify likely causes, severity, repairability, recommended action, required parts, INR cost estimates (with min/max ranges and nulls for unknown), safety critical warnings (swollen batteries, thermal runaway, electrical shock), and zero hallucination.
3. **MongoDB Persistence:**
   - Dedicated repository/service layer `app/services/repair_advisory_service.py` to persist records in `repair_advisories` (and `repair_reports`), with user isolation and IDOR protection.
4. **Device Context & User-Confirmed Override:**
   - Automatic hydration of user-confirmed specs from `user_devices` (and linked `device_valuations`) when `device_id` is supplied, guaranteeing user-confirmed specs take absolute precedence over AI guesses.
5. **Frontend API Client & Real State Management:**
   - Frontend currently calls `generateMockRepairReport` in `RepairModule.tsx`. Must be connected to real `repairApi.ts` client communicating with FastAPI `/api/v1/repair-advisory/analyze`.
   - Real history retrieval (`GET /api/v1/repair-advisory`) replacing hardcoded `INITIAL_REPAIR_HISTORY`.
   - Option to select existing registered devices directly from user's account portfolio in `DeviceSelectionCards.tsx`.
   - Clear and accurate error banners for 429 Rate Limits, 503 High Demand, 401 Session Expiry, 400 Bad Request, 504 Timeouts.

---

## 3. Files That Can Be Reused

- `backend/app/core/gemini.py`: Gemini client initialization.
- `backend/app/core/security.py` & `backend/app/api/deps.py`: Firebase auth dependency and `AuthenticatedUser`.
- `backend/app/core/config.py`: Environment configuration and settings.
- `backend/app/db/mongo.py` & `backend/app/db/indexes.py`: MongoDB connection management and indexing.
- `backend/app/services/device_service.py`: Retrieval of user-owned devices.
- `frontend/src/lib/api.ts`: Centralized API URL and `fetchWithAuth` wrapper with automatic 401 token refresh.
- `frontend/src/lib/userApi.ts`: `getUserDevices` function.
- `frontend/src/components/app/repair/*`: UI presentation components (`HeroSection`, `ProblemDescriptionForm`, `RepairImageUploadZone`, `AIDiagnosisAnimation`, `AIRepairReportView`, `RepairHistoryTable`, `RepairFloatingAIAssistant`, `RepairPDFReportModal`).

---

## 4. Files That Need Modification

1. `backend/app/api/v1/router.py`:
   - Mount new `repair_advisory_router` under `/api/v1`.
2. `backend/app/db/indexes.py`:
   - Ensure `repair_advisories` collection indexes (`advisory_code`, `user_id`, `created_at`, `device_id`) are created alongside `repair_reports`.
3. `backend/app/services/gemini_service.py`:
   - Add `analyze_repair_advisory(device_info, user_problem_details, image_reference)` with dedicated repair prompt and structured output parsing.
4. `frontend/src/components/app/modules/RepairModule.tsx`:
   - Connect diagnosis flow to real `analyzeRepairAdvisory()` API call, integrate active user token, handle real loading/error states, and load real user history.
5. `frontend/src/components/app/repair/DeviceSelectionCards.tsx`:
   - Add capability to pick from authenticated user's registered devices (`user_devices`) in addition to manual category/brand/model selection.
6. `frontend/src/components/app/repair/AIRepairReportView.tsx`:
   - Display INR (₹) monetary formatting seamlessly for parts and total repair estimates.
7. `frontend/src/components/app/repair/RepairHistoryTable.tsx`:
   - Display INR (₹) formatting and real timestamps/status from database records.
8. `frontend/src/types/repair.ts`:
   - Ensure TypeScript interfaces support optional `device_id`, safety warnings, INR min/max ranges, and database ID mapping.

---

## 5. Files That Need Creation

1. `backend/app/schemas/repair_advisory.py`:
   - Pydantic models for request input, Gemini AI structured output, persistence model, and response schemas.
2. `backend/app/services/repair_advisory_service.py`:
   - Service layer handling ownership verification, device specification hydration, Gemini AI invocation, MongoDB persistence, and history queries.
3. `backend/app/api/v1/repair_advisory.py`:
   - FastAPI router defining `POST /api/v1/repair-advisory/analyze`, `GET /api/v1/repair-advisory`, `GET /api/v1/repair-advisory/{advisory_id}`, and `DELETE /api/v1/repair-advisory/{advisory_id}`.
4. `frontend/src/lib/repairApi.ts`:
   - Frontend API client containing `analyzeRepairAdvisory()`, `getRepairAdvisories()`, `getRepairAdvisoryById()`, and `deleteRepairAdvisory()`.
5. `backend/tests/test_repair_advisory_phase4.py`:
   - Comprehensive test suite covering all 28 required test cases (smartphone, laptop, tablet, audio, console, missing specs, user overrides, invalid/oversized images, IDOR security, rate limits, 502/503/504 errors, safety-critical cases, INR validation, MongoDB persistence, and user isolation).

---

## 6. Existing MongoDB Collections Relevant to Phase 4

- `users` & `user_profiles`: User identity and profile records.
- `user_devices`: User registered devices containing confirmed brand, model, specs, condition, purchase year.
- `device_valuations`: Past valuations containing damage detection, repair recommendations, and appraisal data.
- `repair_advisories` / `repair_reports`: Persistence collection for Phase 4 AI repair diagnostic audits.

---

## 7. Existing Gemini Integration That Should Be Reused

- `app.core.gemini.get_gemini_client()`: Initialized Google GenAI SDK client.
- `_prepare_image_part()` in `gemini_service.py`: Robust image decoding (Base64 data URIs, raw bytes, HTTP URLs, file paths, size limit checks).
- Rate limit & transient error handling pattern: Catching `APIError` with clean mapping to HTTP 429 (quota limit), HTTP 503 (high demand retry), HTTP 504 (timeout), and HTTP 502 (bad gateway).

---

## 8. Potential Conflicts with Phase 3 & Prevention

| Potential Conflict | Mitigation Strategy |
|---|---|
| Overwriting user-confirmed device specifications with AI image detection | Device info from `user_devices` and user input is strictly preserved and injected into the Gemini prompt with explicit instructions that user-confirmed specs take precedence. |
| USD vs INR currency inconsistency | All prompts, schemas, calculations, and UI displays strictly enforce Indian Rupees (INR ₹). |
| IDOR security vulnerabilities | All backend endpoints verify `user_id == current_user.id` on devices and repair records, returning HTTP 404 (not 403) for non-existent or foreign resources. |
| Broken existing tests in Phase 0–3 | Phase 4 adds non-destructive routes and modular services; all existing 98 pytest tests remain 100% untouched and passing. |
| Duplicate API calls / React StrictMode triggers | Frontend in-flight lock refs prevent duplicate trigger on double-click or fast re-renders. |
