"""
FastAPI application factory.

Separating the factory from main.py makes testing easier — tests can call
create_app() without starting uvicorn.
"""

from __future__ import annotations

from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1 import api_v1_router
from app.core import AppError, configure_logging, get_logger, get_settings


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Application lifespan handler.

    Startup:  configure logging, warm up the orchestrator singleton.
    Shutdown: nothing special needed (httpx clients are per-request).
    """
    settings = get_settings()
    configure_logging(settings.log_level)
    logger = get_logger("app.lifespan")
    logger.info("app.startup", env=settings.app_env, version=settings.app_version)

    # Pre-warm the orchestrator (validates API keys on startup)
    try:
        from app.services.job_orchestrator import get_orchestrator
        get_orchestrator()
        logger.info("app.orchestrator_ready")
    except Exception as exc:
        logger.warning("app.orchestrator_init_warning", error=str(exc))

    yield

    logger.info("app.shutdown")


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description=(
            "Strategic career advisor API: fetches real job listings and uses "
            "an LLM to generate custom portfolio project ideas tailored to each "
            "company's tech stack and core problem."
        ),
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan,
    )

    # ── CORS ────────────────────────────────────────────────────────────────
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ── Global exception handlers ────────────────────────────────────────────
    @app.exception_handler(AppError)
    async def app_error_handler(request: Request, exc: AppError) -> JSONResponse:
        return JSONResponse(
            status_code=exc.status_code,
            content={"success": False, "error": exc.message},
        )

    @app.exception_handler(Exception)
    async def generic_error_handler(request: Request, exc: Exception) -> JSONResponse:
        get_logger("app.error").exception("unhandled_exception", error=str(exc))
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": "Internal server error."},
        )

    # ── Routers ──────────────────────────────────────────────────────────────
    app.include_router(api_v1_router)

    # ── Root redirect to docs ─────────────────────────────────────────────────
    @app.get("/", include_in_schema=False)
    async def root() -> JSONResponse:
        return JSONResponse({"message": f"{settings.app_name} — visit /docs"})

    return app

