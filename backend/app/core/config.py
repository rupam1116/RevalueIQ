import os
from pathlib import Path
from typing import List, Union
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent.parent
ENV_FILE = BASE_DIR / ".env"


class Settings(BaseSettings):
    PROJECT_NAME: str = "RevalueIQ API"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    PORT: int = 8000

    # CORS Settings
    FRONTEND_URL: Union[str, List[str]] = "https://revalueiq.vercel.app,http://localhost:3000,http://127.0.0.1:3000"

    @property
    def cors_origins(self) -> List[str]:
        if isinstance(self.FRONTEND_URL, list):
            origins = [o.strip().rstrip("/") for o in self.FRONTEND_URL if isinstance(o, str) and o.strip()]
        elif isinstance(self.FRONTEND_URL, str):
            origins = [origin.strip().rstrip("/") for origin in self.FRONTEND_URL.split(",") if origin.strip()]
        else:
            origins = ["http://localhost:3000"]
        default_origins = [
            "https://revalueiq.vercel.app",
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        ]
        for d in default_origins:
            if d not in origins:
                origins.append(d)
        return origins

    # MongoDB Atlas Settings
    MONGODB_URI: str = Field(
        default="",
        description="MongoDB Atlas SRV Connection String"
    )
    MONGODB_DATABASE_NAME: str = Field(
        default="revalueiq",
        description="MongoDB Database Name"
    )

    @field_validator("MONGODB_URI", mode="after")
    @classmethod
    def validate_mongodb_uri(cls, value: str) -> str:
        val = (value or "").strip()
        if not val:
            raise ValueError(
                "MONGODB_URI is not configured! Please provide a valid MONGODB_URI in backend/.env."
            )
        if ("localhost" in val or "127.0.0.1" in val) and os.getenv("ALLOW_LOCAL_MONGO", "false").lower() != "true":
            raise ValueError(
                "MONGODB_URI cannot be localhost. Please configure a valid MongoDB Atlas SRV connection string in backend/.env."
            )
        return val

    # Firebase Admin SDK Configuration Foundation
    FIREBASE_PROJECT_ID: str = Field(default="revalueiq-165c1", description="Firebase Project ID")
    FIREBASE_CLIENT_EMAIL: str = Field(default="", description="Firebase Service Account Client Email")
    FIREBASE_PRIVATE_KEY: str = Field(default="", description="Firebase Private Key")
    FIREBASE_SERVICE_ACCOUNT_PATH: str = Field(default="secrets/firebase-service-account.json", description="Path to firebase-service-account.json")
    FIREBASE_SERVICE_ACCOUNT_JSON: str = Field(default="", description="Raw Firebase Service Account JSON string for cloud deployment")

    # External AI & Cloud Services (Google GenAI)
    GEMINI_API_KEY: str = Field(default="", description="Google Gemini API Key")
    GEMINI_MODEL: str = Field(default="gemini-3.6-flash", description="Google Gemini AI Model Name")

    # Cloudinary Image Storage
    CLOUDINARY_CLOUD_NAME: str = Field(default="", description="Cloudinary Cloud Name")
    CLOUDINARY_API_KEY: str = Field(default="", description="Cloudinary API Key")
    CLOUDINARY_API_SECRET: str = Field(default="", description="Cloudinary API Secret")

    # Google Maps Platform / Google Places API Key
    GOOGLE_MAPS_API_KEY: str = Field(default="", description="Google Maps Platform / Places API Key")

    # Map & Repair Center Provider ("osm" for free OpenStreetMap/Leaflet/Nominatim, "google" for Google Maps Platform)
    REPAIR_MAP_PROVIDER: str = Field(default="osm", description="Map & discovery provider: 'osm' or 'google'")

    # Payment Gateway Configuration (Razorpay - INR)
    PAYMENT_GATEWAY: str = Field(default="razorpay", description="Payment Gateway: razorpay")
    PAYMENT_KEY_ID: str = Field(default="rzp_test_revalueiq_key", description="Payment Gateway Key ID")
    PAYMENT_KEY_SECRET: str = Field(default="revalueiq_razorpay_secret_key_2026", description="Payment Gateway Secret Key")
    PAYMENT_WEBHOOK_SECRET: str = Field(default="revalueiq_webhook_secret_2026", description="Payment Webhook Secret Key")

    model_config = SettingsConfigDict(
        env_file=(str(ENV_FILE), ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=True
    )


settings = Settings()
