"""
Jobs router — all endpoints under /api/v1/

Endpoints
---------
POST /api/v1/generate-projects
    Primary endpoint. Accepts a search payload, runs the full pipeline
    (fetch + AI analysis), and returns enriched job listings.

POST /api/v1/jobs/search
    Alias for frontend compatibility (same behaviour as generate-projects).

GET  /api/v1/health
    Simple liveness probe used by deployment platforms.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.deps import orchestrator_dep
from app.core import AppError, get_logger
from app.models import ApiResponse, JobListing, SearchRequest
from app.services.job_orchestrator import JobOrchestrator

logger = get_logger(__name__)
router = APIRouter()


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------


@router.get("/health", tags=["system"])
async def health_check() -> dict:
    """Liveness probe."""
    return {"status": "ok"}


# ---------------------------------------------------------------------------
# Primary endpoint
# ---------------------------------------------------------------------------


@router.post(
    "/generate-projects",
    response_model=ApiResponse[list[JobListing]],
    summary="Fetch jobs + generate portfolio project ideas",
    tags=["jobs"],
)
async def generate_projects(
    request: SearchRequest,
    orchestrator: JobOrchestrator = Depends(orchestrator_dep),
) -> ApiResponse[list[JobListing]]:
    """
    The core pipeline:

    1. Fetch real job listings from JSearch (RapidAPI).
    2. Run each job description through the LLM concurrently.
    3. Return enriched listings with tech_stack, core_problem, project_idea.
    """
    logger.info(
        "api.generate_projects",
        job_title=request.job_title,
        location=request.location,
        date_posted=request.date_posted,
    )
    try:
        listings = await orchestrator.generate_projects(request)
    except AppError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc
    except Exception as exc:
        logger.exception("api.unexpected_error", error=str(exc))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred. Please try again.",
        ) from exc

    return ApiResponse(
        success=True,
        data=listings,
        total=len(listings),
        message=f"Found {len(listings)} job listings.",
    )


# ---------------------------------------------------------------------------
# Alias for frontend compatibility
# ---------------------------------------------------------------------------


@router.post(
    "/jobs/search",
    response_model=ApiResponse[list[JobListing]],
    summary="Search jobs (alias for /generate-projects)",
    tags=["jobs"],
)
async def search_jobs(
    request: SearchRequest,
    orchestrator: JobOrchestrator = Depends(orchestrator_dep),
) -> ApiResponse[list[JobListing]]:
    """Alias so the frontend can call either endpoint interchangeably."""
    return await generate_projects(request, orchestrator)

