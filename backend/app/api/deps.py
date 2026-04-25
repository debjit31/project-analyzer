"""FastAPI dependency injectors."""

from __future__ import annotations

from fastapi import Depends

from app.services.job_orchestrator import JobOrchestrator, get_orchestrator


def orchestrator_dep() -> JobOrchestrator:
    """Provide the singleton JobOrchestrator to route handlers."""
    return get_orchestrator()

