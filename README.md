# RevalueIQ ♻️ — AI-Powered Circular Economy & Device Valuation Platform

[![Python](https://img.shields.io/badge/Python-3.12%20%7C%203.14-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-black.svg)](https://nextjs.org/)
[![AI Model](https://img.shields.io/badge/AI%20Model-Gemini%203.6%20Flash-4285F4.svg)](https://ai.google.dev/)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248.svg)](https://www.mongodb.com/atlas)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**RevalueIQ** is an end-to-end, multi-modal artificial intelligence platform engineered to bridge the information asymmetry gap in consumer electronics. By combining **Google Gemini 3.6 Flash** computer vision with parametric depreciation models, RevalueIQ automates device condition grading, residual value estimation, DIY repair playbooks, verified circular marketplace listings, and quantified carbon abatement ($CO_2e$) tracking.

---

## 🌟 Key Features & AI Capabilities

### 1. Multi-Modal Visual Inspection (Gemini 3.6 Flash)
- **Defect Detection**: Evaluates uploaded device imagery to identify micro-scratches, deep chassis scuffs, screen fractures, and port corrosion.
- **Parametric Depreciation**: Blends visual wear severity, battery cycle degradation estimates, and historical market comps to compute fair residual resale and trade-in value.
- **Circularity Score**: Quantifies estimated embodied carbon avoidance ($kg\ CO_2e$) and electronic waste diverted from landfills.

### 2. Intelligent Repair Advisory & Triage
- **Feasibility Index**: Calculates the economic threshold ($\frac{\text{Repair Cost}}{\text{Resale Value}}$) to advise whether to Repair, Resell, or Donate.
- **Automated DIY Guides**: Provides step-by-step repair playbooks, required tools, difficulty ratings, and safety hazard alerts.
- **Localized Repair Discovery**: Integrates OpenStreetMap (OSM / Leaflet / Nominatim) and Google Places to discover nearby repair centers with Haversine distance ranking.

### 3. Circular Marketplace & Escrow Payments
- **Verified Listings**: Direct-from-valuation listings with verified cosmetic grade badges.
- **Razorpay Payment Gateway**: Secure INR transactions with server-side HMAC-SHA256 signature verification and idempotent webhook reconciliation.

### 4. Certified E-Waste Donation Tracking
- Generates verifiable tax/impact certificates with unique audit IDs for refurbished device donations to accredited non-profits.

---

## 🏛️ System Architecture

```mermaid
flowchart TB
    subgraph Client_Tier [Frontend: Next.js 16 / React 19 / TailwindCSS]
        UI[Responsive User Portal]
        ValuationUI[Multi-Angle Photo Upload Zone]
        MarketUI[Circular Marketplace]
    end

    subgraph API_Tier [Backend: FastAPI / Python]
        Router[API v1 Asynchronous Router]
        Auth[Firebase Token Verification]
        SecMiddleware[Security & Rate Limit Middleware]
    end

    subgraph AI_Engine [AI & Services Engine]
        Gemini[Gemini 3.6 Flash Multi-Modal Vision]
        ValuationService[Depreciation & Fair Value Engine]
        RepairEngine[Repair Triage & Decision Tree]
        PaymentService[Razorpay Gateway & Webhook Handler]
    end

    subgraph Data_Tier [Persistence & External Cloud]
        MongoDB[(MongoDB Atlas DB)]
        Firebase[(Firebase Auth / Admin SDK)]
        Cloudinary[(Cloudinary Image Storage)]
        OSM[(OpenStreetMap / Nominatim)]
    end

    UI --> Router
    Router --> Auth
    Router --> SecMiddleware
    Router --> AI_Engine
    AI_Engine --> Data_Tier
```

---

## 🛠️ Tech Stack

- **Backend**: FastAPI, Uvicorn, Pydantic v2, Pydantic-Settings, PyMongo, HTTPX
- **AI / Computer Vision**: Google GenAI SDK (`google-genai>=1.0.0`), Gemini 3.6 Flash
- **Frontend**: Next.js 16 (Turbopack, App Router), React 19, TypeScript, TailwindCSS, Lucide Icons
- **Database**: MongoDB Atlas (Async Client with auto-indexed collections)
- **Auth**: Firebase Authentication & Firebase Admin SDK
- **Media Storage**: Cloudinary SDK (Direct authenticated upload & CDN optimization)
- **Payments**: Razorpay (HMAC-SHA256 authenticated API)
- **Maps / Discovery**: OpenStreetMap (OSM/Leaflet/Nominatim) with Google Maps provider fallback

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.12+ (or 3.14)
- Node.js 18+ & npm
- MongoDB Atlas cluster
- Firebase Project Service Account

---

### Backend Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Create and activate virtual environment
python -m venv venv

# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# Linux / macOS:
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment variables
cp .env.example .env
# Edit .env with your credentials

# 5. Run the FastAPI development server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

- **Interactive API Documentation (Swagger)**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc Documentation**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)

---

### Frontend Setup

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Run the development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the client application.

---

## 🧪 Testing

Run the automated backend test suite:
```bash
cd backend
pytest tests/ -v
```

Run frontend production build verification:
```bash
cd frontend
npm run build
```

---

## ☁️ Deployment Guide (Render)

This repository includes a turnkey [`render.yaml`](./render.yaml) blueprint for deploying the backend web service directly to **Render**.

### 1. Render Web Service Settings
- **Runtime**: `Python`
- **Root Directory**: `backend`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Health Check Path**: `/health`

### 2. Required Environment Variables on Render

| Variable | Description | Example / Source |
|---|---|---|
| `ENVIRONMENT` | Environment type | `production` |
| `DEBUG` | Debug mode | `false` |
| `PYTHON_VERSION` | Python runtime version | `3.12.8` |
| `MONGODB_URI` | MongoDB Atlas SRV URI | `mongodb+srv://user:pass@cluster.mongodb.net/...` |
| `MONGODB_DATABASE_NAME` | Mongo database name | `revalueiq` |
| `FIREBASE_PROJECT_ID` | Firebase Project ID | `revalueiq-165c1` |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Minified raw service account JSON string | *(See command below)* |
| `GEMINI_API_KEY` | Google Gemini API Key | `AIzaSy...` |
| `GEMINI_MODEL` | Gemini Model Identifier | `gemini-3.6-flash` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | `1234567890` |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | `your_secret` |
| `PAYMENT_GATEWAY` | Payment provider | `razorpay` |
| `PAYMENT_KEY_ID` | Razorpay public Key ID | `rzp_test_...` |
| `PAYMENT_KEY_SECRET` | Razorpay Secret Key | `your_razorpay_secret` |
| `PAYMENT_WEBHOOK_SECRET` | Razorpay Webhook Secret | `your_webhook_secret` |
| `REPAIR_MAP_PROVIDER` | Discovery provider | `osm` |
| `FRONTEND_URL` | Allowed CORS origins | `https://your-frontend.vercel.app,http://localhost:3000` |

#### How to format `FIREBASE_SERVICE_ACCOUNT_JSON` for Render:
Because `secrets/firebase-service-account.json` is protected by `.gitignore`, compress it into a single-line string to paste into Render:
```powershell
(Get-Content backend\firebase-service-account.json -Raw | ConvertFrom-Json | ConvertTo-Json -Compress) | Set-Clipboard
```

---

## 🔒 Security & Best Practices

1. **Zero Secret Leaks**: All credentials, tokens, and private keys are strictly managed via environment variables and git-ignored.
2. **MongoDB Access Control**: Enforce IP allowlists (`0.0.0.0/0` required for cloud serverless/dynamic hosts).
3. **Cryptographic Validation**: Razorpay webhook payloads and client payment IDs are verified server-side with HMAC-SHA256 before database state transitions.
4. **Token Verification**: User identity is verified server-side using Firebase Admin SDK tokens.

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
