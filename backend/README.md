# RevalueIQ — FastAPI + MongoDB Backend Foundation

Production-grade FastAPI backend for **RevalueIQ** — an AI-powered circular economy platform for second-hand goods valuation, repair recommendations, resale, donation, and e-waste reduction.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Python 3.11+ (Python 3.14 recommended)
- MongoDB Atlas cluster or local MongoDB instance (`mongodb://localhost:27017`)

### 2. Environment Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure `MONGODB_URI` matches your local or MongoDB Atlas instance:
```env
MONGODB_URI="mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority"
MONGODB_DATABASE_NAME="revalueiq_db"
FRONTEND_URL="http://localhost:3000"
```

---

## ⚡ Running the FastAPI Server

```bash
# Start server with Uvicorn auto-reload
python app/main.py
```
Or via Uvicorn CLI directly:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

- **Interactive Swagger Documentation:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc Documentation:** [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **API Health Check:** `GET` [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)
- **Database Connectivity Check:** `GET` [http://localhost:8000/api/v1/health/db](http://localhost:8000/api/v1/health/db)

---

## 🧪 Running the Pytest Suite

```bash
.\venv\Scripts\pytest
```

---

## 🛡️ Core Security Principles
- All secrets, API keys, and private credentials are stored in `.env` and kept out of version control.
- Centralized exception handlers mask internal stack traces and database error details from public API responses.
- Firebase Admin SDK dependency verifies Bearer tokens securely for future auth routes.
