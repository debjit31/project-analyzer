"""
Pydantic models (schemas) used across the application.

Naming convention:
  - *Request  → inbound payloads
  - *Response → outbound API responses
  - *DTO      → internal data-transfer objects (not serialised directly)
"""

from __future__ import annotations

from typing import Generic, Literal, TypeVar

from pydantic import BaseModel, Field, HttpUrl, field_validator

# ---------------------------------------------------------------------------
# Generic envelope
# ---------------------------------------------------------------------------

DataT = TypeVar("DataT")


class ApiResponse(BaseModel, Generic[DataT]):
    """Standard JSON envelope returned by every endpoint."""

    success: bool = True
    data: DataT
    total: int = 0
    message: str = "OK"


class ErrorResponse(BaseModel):
    success: bool = False
    error: str
    detail: str | None = None


# ---------------------------------------------------------------------------
# Job Analysis (AI output)
# ---------------------------------------------------------------------------


class JobAnalysis(BaseModel):
    tech_stack: list[str] = Field(default_factory=list)
    core_problem: str = ""
    project_idea: str = ""


# ---------------------------------------------------------------------------
# Job Listing (enriched)
# ---------------------------------------------------------------------------


class JobListing(BaseModel):
    id: str
    job_title: str
    company: str
    url: str
    location: str
    posted_date: str = ""
    description: str = ""
    analysis: JobAnalysis


# ---------------------------------------------------------------------------
# Request payloads
# ---------------------------------------------------------------------------


class SearchRequest(BaseModel):
    """Payload for POST /api/v1/generate-projects and /api/v1/jobs/search."""

    job_title: str = Field(..., min_length=1, max_length=120)
    location: str = Field(default="", max_length=120)
    date_posted: Literal["anytime", "24h", "7d", "30d"] = "anytime"

    @field_validator("job_title", "location", mode="before")
    @classmethod
    def strip_whitespace(cls, v: str) -> str:
        return v.strip() if isinstance(v, str) else v

