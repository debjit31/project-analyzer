"""
AI Analysis service — turns a raw job description into structured insights.

Supports two providers, selected via the AI_PROVIDER env var:
  - "gemini"  → Google Gemini (default, free tier available)
  - "openai"  → OpenAI ChatCompletion

Both providers enforce strict JSON output matching JobAnalysis schema:
  {"tech_stack": [...], "core_problem": "...", "project_idea": "..."}
"""

from __future__ import annotations

import json
import re
from abc import ABC, abstractmethod
from typing import Any

from tenacity import (
    retry,
    retry_if_exception_type,
    stop_after_attempt,
    wait_exponential,
)

from app.core import AIAnalysisError, ConfigurationError, get_logger, get_settings
from app.models import JobAnalysis

logger = get_logger(__name__)

# ---------------------------------------------------------------------------
# Prompt template
# ---------------------------------------------------------------------------

_SYSTEM_PROMPT = """You are a senior software engineer and career strategist.
Analyse the following job description and return ONLY a valid JSON object
with EXACTLY these three keys (no markdown, no explanation):

{
  "tech_stack": ["list", "of", "specific", "technologies"],
  "core_problem": "One or two sentences describing the core technical or business problem the company needs to solve.",
  "project_idea": "A concrete, specific weekend-sized portfolio project a candidate could build to demonstrate they can solve that problem, referencing the actual tech stack."
}

Rules:
- tech_stack must list only concrete technologies/frameworks/languages (e.g. React, PostgreSQL, Kubernetes).
- core_problem must be specific to this company, not generic HR language.
- project_idea must be actionable and reference at least two items from tech_stack.
- Return ONLY the JSON object. No markdown code fences. No preamble."""


# ---------------------------------------------------------------------------
# Abstract base
# ---------------------------------------------------------------------------


class BaseAIProvider(ABC):
    @abstractmethod
    async def analyse(self, description: str, job_title: str, company: str) -> JobAnalysis:
        """Return structured analysis for a job description."""


# ---------------------------------------------------------------------------
# Gemini provider
# ---------------------------------------------------------------------------


class GeminiProvider(BaseAIProvider):
    def __init__(self) -> None:
        settings = get_settings()
        if not settings.gemini_api_key:
            raise ConfigurationError(
                "GEMINI_API_KEY is not set. Add it to your .env file."
            )
        try:
            import google.generativeai as genai
            genai.configure(api_key=settings.gemini_api_key)
            self._model = genai.GenerativeModel(
                model_name=settings.gemini_model,
                generation_config={
                    "temperature": 0.4,
                    "response_mime_type": "application/json",
                },
                system_instruction=_SYSTEM_PROMPT,
            )
        except ImportError as exc:
            raise ConfigurationError(
                "google-generativeai package is not installed. "
                "Run: pip install google-generativeai"
            ) from exc

    @retry(
        retry=retry_if_exception_type(Exception),
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        reraise=True,
    )
    async def analyse(self, description: str, job_title: str, company: str) -> JobAnalysis:
        prompt = (
            f"Job Title: {job_title}\n"
            f"Company: {company}\n\n"
            f"Job Description:\n{description}"
        )
        try:
            response = await self._model.generate_content_async(prompt)
            raw_text = response.text
            logger.debug("gemini.response", raw=raw_text[:300])
            return _parse_analysis(raw_text)
        except Exception as exc:
            logger.error("gemini.error", error=str(exc))
            raise AIAnalysisError(f"Gemini analysis failed: {exc}") from exc


# ---------------------------------------------------------------------------
# OpenAI provider
# ---------------------------------------------------------------------------


class OpenAIProvider(BaseAIProvider):
    def __init__(self) -> None:
        settings = get_settings()
        if not settings.openai_api_key:
            raise ConfigurationError(
                "OPENAI_API_KEY is not set. Add it to your .env file."
            )
        try:
            from openai import AsyncOpenAI
            self._client = AsyncOpenAI(api_key=settings.openai_api_key)
            self._model = settings.openai_model
        except ImportError as exc:
            raise ConfigurationError(
                "openai package is not installed. Run: pip install openai"
            ) from exc

    @retry(
        retry=retry_if_exception_type(Exception),
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        reraise=True,
    )
    async def analyse(self, description: str, job_title: str, company: str) -> JobAnalysis:
        user_content = (
            f"Job Title: {job_title}\n"
            f"Company: {company}\n\n"
            f"Job Description:\n{description}"
        )
        try:
            completion = await self._client.chat.completions.create(
                model=self._model,
                response_format={"type": "json_object"},
                temperature=0.4,
                messages=[
                    {"role": "system", "content": _SYSTEM_PROMPT},
                    {"role": "user", "content": user_content},
                ],
            )
            raw_text = completion.choices[0].message.content or ""
            logger.debug("openai.response", raw=raw_text[:300])
            return _parse_analysis(raw_text)
        except Exception as exc:
            logger.error("openai.error", error=str(exc))
            raise AIAnalysisError(f"OpenAI analysis failed: {exc}") from exc


# ---------------------------------------------------------------------------
# Factory
# ---------------------------------------------------------------------------


class NoOpAIProvider(BaseAIProvider):
    """
    Fallback provider used when no AI API key is configured.
    Returns empty analysis so the job fetch pipeline still works.
    """

    async def analyse(self, description: str, job_title: str, company: str) -> JobAnalysis:
        return JobAnalysis(tech_stack=[], core_problem="", project_idea="")


def create_ai_provider() -> BaseAIProvider:
    """Instantiate the configured AI provider, falling back to NoOp if unconfigured."""
    settings = get_settings()
    provider = settings.ai_provider.lower()
    logger.info("ai.provider", provider=provider)
    if provider == "openai":
        if not settings.openai_api_key:
            logger.warning("ai.provider.no_key", provider="openai", fallback="noop")
            return NoOpAIProvider()
        return OpenAIProvider()
    if not settings.gemini_api_key:
        logger.warning("ai.provider.no_key", provider="gemini", fallback="noop")
        return NoOpAIProvider()
    return GeminiProvider()


# ---------------------------------------------------------------------------
# Shared JSON parser
# ---------------------------------------------------------------------------


def _parse_analysis(raw: str) -> JobAnalysis:
    """
    Parse LLM output into a JobAnalysis.

    Handles edge cases:
      - Markdown code fences (```json ... ```)
      - Trailing commas
      - Extra whitespace
    """
    # Strip markdown fences if present
    text = re.sub(r"```(?:json)?|```", "", raw).strip()

    try:
        data: dict[str, Any] = json.loads(text)
        return JobAnalysis(
            tech_stack=data.get("tech_stack") or [],
            core_problem=data.get("core_problem") or "",
            project_idea=data.get("project_idea") or "",
        )
    except json.JSONDecodeError:
        # Last-ditch: try to extract a JSON object from the text
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            try:
                data = json.loads(match.group())
                return JobAnalysis(
                    tech_stack=data.get("tech_stack") or [],
                    core_problem=data.get("core_problem") or "",
                    project_idea=data.get("project_idea") or "",
                )
            except json.JSONDecodeError:
                pass

        logger.warning("ai.parse_failed", raw=raw[:500])
        # Return a graceful degraded response rather than crashing
        return JobAnalysis(
            tech_stack=[],
            core_problem="Analysis unavailable.",
            project_idea="Could not generate a project idea for this listing.",
        )

