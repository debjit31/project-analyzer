"""
JSearch (RapidAPI) service — fetches real job listings.

Docs: https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch
"""

from __future__ import annotations

import hashlib
import json
from typing import Any

import httpx
from tenacity import (
    retry,
    retry_if_exception_type,
    stop_after_attempt,
    wait_exponential,
)

from app.core import JobFetchError, get_logger, get_settings

logger = get_logger(__name__)

# Map frontend date_posted values to JSearch query params
_DATE_MAP: dict[str, str] = {
    "anytime": "all",
    "24h": "today",
    "7d": "week",
    "30d": "month",
}


class JSearchService:
    """
    Thin async wrapper around the JSearch RapidAPI.

    All network errors are translated to JobFetchError so callers
    never need to know the underlying HTTP library.
    """

    def __init__(self) -> None:
        settings = get_settings()
        self._base_url = settings.jsearch_base_url
        self._api_key = settings.jsearch_api_key
        self._max_results = settings.jsearch_max_results
        self._timeout = settings.http_timeout_seconds

    @retry(
        retry=retry_if_exception_type(httpx.TransportError),
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=1, max=8),
        reraise=True,
    )
    async def search(
        self,
        query: str,
        location: str = "",
        date_posted: str = "anytime",
    ) -> list[dict[str, Any]]:
        """
        Search for jobs and return a normalised list of dicts.

        Returns a list of dicts with keys:
            id, job_title, company, url, location, posted_date, description
        """
        if not self._api_key:
            raise JobFetchError(
                "JSearch API key is not configured. "
                "Set JSEARCH_API_KEY in your .env file."
            )

        params = {
            "query": f"{query} {location}".strip(),
            "num_pages": "1",
            "page": "1",
            "date_posted": _DATE_MAP.get(date_posted, "all"),
        }

        headers = {
            "X-RapidAPI-Key": self._api_key,
            "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
        }

        logger.info(
            "jsearch.search",
            query=params["query"],
            date_posted=params["date_posted"],
        )

        try:
            async with httpx.AsyncClient(timeout=self._timeout) as client:
                response = await client.get(
                    f"{self._base_url}/search",
                    params=params,
                    headers=headers,
                )
                response.raise_for_status()
                payload = response.json()
        except httpx.HTTPStatusError as exc:
            logger.error(
                "jsearch.http_error",
                status=exc.response.status_code,
                body=exc.response.text[:500],
            )
            raise JobFetchError(
                f"Job search API returned {exc.response.status_code}."
            ) from exc
        except httpx.TransportError as exc:
            logger.error("jsearch.transport_error", error=str(exc))
            raise JobFetchError("Network error contacting job search API.") from exc

        raw_jobs: list[dict] = payload.get("data", [])
        return [self._normalise(job) for job in raw_jobs[: self._max_results]]

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _normalise(raw: dict[str, Any]) -> dict[str, Any]:
        """Map JSearch fields to our internal schema."""
        job_id = raw.get("job_id") or hashlib.md5(
            json.dumps(raw, sort_keys=True).encode()
        ).hexdigest()[:12]

        employer = raw.get("employer_name", "Unknown Company")
        title = raw.get("job_title", "")
        url = (
            raw.get("job_apply_link")
            or raw.get("job_google_link")
            or ""
        )
        city = raw.get("job_city", "")
        country = raw.get("job_country", "")
        location = ", ".join(filter(None, [city, country])) or "Remote"
        posted_date = (raw.get("job_posted_at_datetime_utc") or "")[:10]
        description = (raw.get("job_description") or "")[:4000]  # cap size

        return {
            "id": str(job_id),
            "job_title": title,
            "company": employer,
            "url": url,
            "location": location,
            "posted_date": posted_date,
            "description": description,
        }

