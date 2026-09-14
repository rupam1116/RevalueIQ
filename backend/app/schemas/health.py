from typing import Dict, Any, Optional
from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = Field(default="ok", json_schema_extra={"example": "ok"})
    service: str = Field(default="RevalueIQ API", json_schema_extra={"example": "RevalueIQ API"})


class DatabaseHealthResponse(BaseModel):
    status: str = Field(default="ok", json_schema_extra={"example": "ok"})
    database: str = Field(default="connected", json_schema_extra={"example": "connected"})


class FirebaseHealthResponse(BaseModel):
    status: str = Field(default="ok", json_schema_extra={"example": "ok"})
    firebase: str = Field(default="connected", json_schema_extra={"example": "connected"})
    project_id: Optional[str] = Field(default=None, json_schema_extra={"example": "revalueiq-165c1"})


class GeminiHealthResponse(BaseModel):
    status: str = Field(default="ok", json_schema_extra={"example": "ok"})
    service: str = Field(default="gemini", json_schema_extra={"example": "gemini"})
    configured: bool = Field(default=True, json_schema_extra={"example": True})
    reachable: bool = Field(default=True, json_schema_extra={"example": True})
    reason: Optional[str] = Field(default=None, json_schema_extra={"example": None})
    message: Optional[str] = Field(default=None, json_schema_extra={"example": None})


class GeminiTestResponse(BaseModel):
    status: str = Field(default="ok", json_schema_extra={"example": "ok"})
    service: str = Field(default="gemini", json_schema_extra={"example": "gemini"})
    model: Optional[str] = Field(default="gemini-3.6-flash", json_schema_extra={"example": "gemini-3.6-flash"})
    response: Optional[str] = Field(default="RevalueIQ Gemini connection successful.", json_schema_extra={"example": "RevalueIQ Gemini connection successful."})
    message: Optional[str] = Field(default=None)


class SystemServicesHealthResponse(BaseModel):
    status: str = Field(default="ok", json_schema_extra={"example": "ok"})
    environment: str = Field(default="development", json_schema_extra={"example": "development"})
    api: Dict[str, Any] = Field(default_factory=dict)
    mongodb: Dict[str, Any] = Field(default_factory=dict)
    firebase: Dict[str, Any] = Field(default_factory=dict)
    gemini: Dict[str, Any] = Field(default_factory=dict)
