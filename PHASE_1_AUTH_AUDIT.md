# PHASE 1: FIREBASE AUTHENTICATION AUDIT REPORT

## 1. Overview & Current Auth Flow
RevalueIQ currently features a hybrid frontend auth architecture built around Firebase Web SDK (`firebase/auth`), with client-side route protection in `AuthContext.tsx`.

- **Frontend Login & Signup:** Users sign in or register via email/password or OAuth (Google, GitHub) in Next.js 16 (`src/components/auth/LoginForm.tsx`, `SignupForm.tsx`, `SocialLogin.tsx`).
- **Client Auth State:** `AuthContext.tsx` maintains the active `FirebaseUser` state via `onAuthStateChanged` listener.
- **Backend Foundation (Phase 0):** Python FastAPI backend has `app/core/firebase.py` configured with Firebase Admin SDK (`firebase_admin.auth.verify_id_token`), and `app/core/security.py` providing a foundational `get_current_user_foundation` HTTPBearer dependency.
- **Database (Phase 0):** MongoDB Atlas database connection (`app/db/mongo.py`) is verified with unique indexes on `users.firebase_uid`, `users.email`, and `user_profiles.user_id`.

## 2. Inventory of Auth Files

### Frontend Files
- `frontend/src/lib/firebase.ts` — Firebase Web SDK initialization.
- `frontend/src/context/AuthContext.tsx` — Context provider, `onAuthStateChanged` observer, route protection logic, and auth helper methods.
- `frontend/src/components/auth/LoginForm.tsx` — Login form component with Zod validation.
- `frontend/src/components/auth/SignupForm.tsx` — Registration form component with password strength validation.
- `frontend/src/components/auth/SocialLogin.tsx` — Google and GitHub OAuth buttons.
- `frontend/src/components/auth/ForgotPasswordForm.tsx` — Password reset form.
- `frontend/src/lib/mockAuth.ts` — Obsolete mock authentication service class (unused by active UI).
- `frontend/src/lib/api.ts` — Centralized API base URL resolver.

### Backend Files
- `backend/app/core/firebase.py` — Firebase Admin SDK initializer & `verify_firebase_id_token()`.
- `backend/app/core/security.py` — FastAPI `HTTPBearer` security dependency (`get_current_user_foundation`).
- `backend/app/db/indexes.py` — MongoDB unique index definitions (`firebase_uid`, `email`, `user_id`).
- `backend/app/api/deps.py` — FastAPI dependency exports.

## 3. What Will Be Replaced / Upgraded
1. **Dev Guest Fallback in Security Dependency:** `get_current_user_foundation` in `security.py` currently allows unauthenticated requests in `development` mode by returning a fallback `dev_guest_user_123`. This will be updated to strictly require valid Firebase tokens for protected endpoints (`/api/v1/auth/me`).
2. **MongoDB User Synchronization:** We will create `app/services/user_service.py` to handle atomic `users` and `user_profiles` upsert operations upon Firebase ID token verification.
3. **Active Authentication Endpoints:** Add `/api/v1/auth/me` and `/api/v1/auth/sync` routes under `app/api/v1/auth.py`.
4. **Obsolete Auth Remnants:** Safely prune `mockAuth.ts` and ensure no active component references mock login methods.

## 4. What Will Be Preserved
- **UI Design & Aesthetic:** All Next.js pages (`/login`, `/signup`, `/forgot-password`, `/app`), Shadcn/Tailwind styling, dark mode, animations, forms, and layouts remain completely intact.
- **Firebase Web SDK Architecture:** `firebase/auth` initialization in `lib/firebase.ts` and standard Firebase token exchange mechanism.
- **FastAPI / Motor Architecture:** Non-blocking async PyMongo AsyncClient connection, exception handlers, CORS, logging middleware, and tests.
- **MongoDB Schema:** `users` and `user_profiles` schema design as specified in `database_design.md`.
