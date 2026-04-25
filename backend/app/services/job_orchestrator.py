"""
JobOrchestrator — the core pipeline.

Responsibilities:
  1. Accept a search request
  2. Check the cache; return early if hit
  3. Fetch jobs from JSearch
  4. Run AI analysis on each job concurrently (bounded by semaphore)
  5. Cache and return the enriched results

This is the only service the API route layer interacts with.
"""

from __future__ import annotations

import asyncio
import hashlib
import json
from functools import lru_cache

from app.cache import InMemoryCache
from app.core import get_logger, get_settings
from app.models import JobAnalysis, JobListing, SearchRequest
from app.services.ai_service import BaseAIProvider, create_ai_provider
from app.services.jsearch_service import JSearchService

logger = get_logger(__name__)


class JobOrchestrator:
    """
    Orchestrates the full pipeline: fetch → analyse → cache → return.

    Design notes:
    - One instance per application lifetime (singleton via get_orchestrator()).
    - The semaphore caps concurrent AI calls to avoid rate-limit blowups.
    - Cache key is a deterministic hash of the search parameters.
    """

    def __init__(
        self,
        jsearch: JSearchService,
        ai_provider: BaseAIProvider,
        cache: InMemoryCache[list[JobListing]],
    ) -> None:
        settings = get_settings()
        self._jsearch = jsearch
        self._ai = ai_provider
        self._cache = cache
        self._semaphore = asyncio.Semaphore(settings.ai_concurrency_limit)

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    async def generate_projects(self, request: SearchRequest) -> list[JobListing]:
        """
        Main entry point.

        1. Return cached results if available.
        2. Otherwise, fetch + analyse + cache + return.
        """
        cache_key = self._make_cache_key(request)
        cached = self._cache.get(cache_key)
        if cached is not None:
            logger.info("cache.hit", key=cache_key[:16])
            return cached

        logger.info(
            "orchestrator.start",
            title=request.job_title,
            location=request.location,
            date_posted=request.date_posted,
        )

        raw_jobs = await self._jsearch.search(
            query=request.job_title,
            location=request.location,
            date_posted=request.date_posted,
        )

        if not raw_jobs:
            logger.info("orchestrator.no_jobs")
            return []

        enriched = await self._analyse_all(raw_jobs)
        self._cache.set(cache_key, enriched)
        logger.info("orchestrator.done", count=len(enriched))
        return enriched

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

    async def _analyse_all(
        self, raw_jobs: list[dict]
    ) -> list[JobListing]:
        """Run AI analysis on all jobs concurrently (semaphore-bounded)."""
        tasks = [self._analyse_one(job) for job in raw_jobs]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        listings: list[JobListing] = []
        for raw, result in zip(raw_jobs, results):
            if isinstance(result, Exception):
                logger.warning(
                    "orchestrator.analysis_failed",
                    job_id=raw.get("id"),
                    error=str(result),
                )
                # Degrade gracefully: include job with empty analysis
                analysis = JobAnalysis()
            else:
                analysis = result  # type: ignore[assignment]

            listings.append(
                JobListing(
                    id=raw["id"],
                    job_title=raw["job_title"],
                    company=raw["company"],
                    url=raw["url"],
                    location=raw["location"],
                    posted_date=raw.get("posted_date", ""),
                    description=raw.get("description", ""),
                    analysis=analysis,
                )
            )
        return listings

    async def _analyse_one(self, raw: dict) -> JobAnalysis:
        async with self._semaphore:
            return await self._ai.analyse(
                description=raw.get("description", ""),
                job_title=raw.get("job_title", ""),
                company=raw.get("company", ""),
            )

    @staticmethod
    def _make_cache_key(request: SearchRequest) -> str:
        key_data = json.dumps(request.model_dump(), sort_keys=True)
        return hashlib.sha256(key_data.encode()).hexdigest()


# ---------------------------------------------------------------------------
# Application-scoped singleton factory
# ---------------------------------------------------------------------------


@lru_cache(maxsize=1)
def get_orchestrator() -> JobOrchestrator:
    """
    Build and return the singleton JobOrchestrator.

    Called once on first request; subsequent calls return the cached instance.
    The lru_cache is invalidated by calling get_orchestrator.cache_clear().
    """
    settings = get_settings()
    cache: InMemoryCache[list[JobListing]] = InMemoryCache(
        maxsize=settings.cache_max_size,
        ttl=settings.cache_ttl_seconds,
    )
    return JobOrchestrator(
        jsearch=JSearchService(),
        ai_provider=create_ai_provider(),
        cache=cache,
    )

