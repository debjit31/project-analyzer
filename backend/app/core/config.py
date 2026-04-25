"""
Core configuration — single source of truth for all settings.
Reads from environment variables / .env file via pydantic-settings.
"""

from __future__ import annotations

from functools import lru_cache
from typing import Literal

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── Application ───────────────────────────────────────────────────────────
    app_name: str = "Project Analyzer API"
    app_version: str = "1.0.0"
    app_env: Literal["development", "staging", "production"] = "development"
    log_level: str = "INFO"

    # ── CORS ──────────────────────────────────────────────────────────────────
    allowed_origins: str = "http://localhost:5173,http://localhost:4173"

    @property
    def cors_origins(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]

    # ── JSearch (RapidAPI) ───────────────────────────────────────────────────
    jsearch_api_key: str = Field(default="", description="RapidAPI key for JSearch")
    jsearch_base_url: str = "https://jsearch.p.rapidapi.com"
    jsearch_max_results: int = Field(default=10, ge=1, le=50)

    # ── AI Provider ───────────────────────────────────────────────────────────
    ai_provider: Literal["gemini", "openai"] = "gemini"

    gemini_api_key: str = Field(default="", description="Google Gemini API key")
    gemini_model: str = "gemini-1.5-flash"

    openai_api_key: str = Field(default="", description="OpenAI API key")
    openai_model: str = "gpt-4o-mini"

    # ── Concurrency & Timeouts ────────────────────────────────────────────────
    ai_concurrency_limit: int = Field(default=5, ge=1, le=20)
    http_timeout_seconds: float = Field(default=30.0, ge=5.0)

    # ── Cache ─────────────────────────────────────────────────────────────────
    cache_ttl_seconds: int = Field(default=600, ge=60)
    cache_max_size: int = Field(default=128, ge=16)

    @field_validator("log_level")
    @classmethod
    def normalise_log_level(cls, v: str) -> str:
        return v.upper()


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return a cached singleton Settings instance."""
    return Settings()

