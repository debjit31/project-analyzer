"""Custom exception hierarchy for the application."""

from __future__ import annotations


class AppError(Exception):
    """Base application error."""

    def __init__(self, message: str, status_code: int = 500) -> None:
        super().__init__(message)
        self.message = message
        self.status_code = status_code


class JobFetchError(AppError):
    """Raised when the job data API call fails."""

    def __init__(self, message: str = "Failed to fetch job listings.") -> None:
        super().__init__(message, status_code=502)


class AIAnalysisError(AppError):
    """Raised when the LLM analysis call fails."""

    def __init__(self, message: str = "AI analysis failed.") -> None:
        super().__init__(message, status_code=502)


class ConfigurationError(AppError):
    """Raised when a required configuration value is missing."""

    def __init__(self, message: str) -> None:
        super().__init__(message, status_code=500)


class JobNotFoundError(AppError):
    """Raised when a job ID is not found."""

    def __init__(self, job_id: str) -> None:
        super().__init__(f"Job '{job_id}' not found.", status_code=404)

