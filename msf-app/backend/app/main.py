"""
MSF-APP Backend — FastAPI Entry Point
"""

import os
import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse as StarletteJSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
import structlog
from datetime import datetime, timezone

from app.routers import generate, database, ai, shortcuts, export
from app.background.job_queue import job_queue
from app.services.ollama_provider import ollama_provider
from app.utils.errors import AppDetailedException
from app.utils.logger import setup_logger

setup_logger()
logger = structlog.get_logger()

# ================================================================
# SECURITY CONFIGURATION
# ================================================================

API_KEY = os.getenv("MSF_API_KEY", "")

# Paths yang diizinkan tanpa API Key (public endpoints)
PUBLIC_PATHS = [
    "/",
    "/health",
    "/api/health",
    "/docs",
    "/redoc",
    "/openapi.json",
]


class APIKeyMiddleware(BaseHTTPMiddleware):
    """Middleware untuk validasi API Key. Aktif hanya jika MSF_API_KEY di-set di env."""

    async def dispatch(self, request: Request, call_next):
        # Jika API_KEY tidak dikonfigurasi, lewati validasi (development mode)
        if not API_KEY:
            return await call_next(request)

        # Izinkan public paths dan OPTIONS request (CORS preflight)
        if request.method == "OPTIONS" or request.url.path in PUBLIC_PATHS:
            return await call_next(request)

        # Cek header X-API-Key
        key = request.headers.get("X-API-Key", "")
        if key != API_KEY:
            return StarletteJSONResponse(
                status_code=401,
                content={
                    "detail": "API Key tidak valid atau tidak ditemukan.",
                    "error_code": "UNAUTHORIZED",
                },
            )

        return await call_next(request)

# ================================================================
# LIFESPAN (startup/shutdown)
# ================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Setup saat startup, cleanup saat shutdown"""
    logger.info("MSF-APP Backend starting up...")

    # Background task: cleanup job lama setiap 15 menit
    async def cleanup_loop():
        while True:
            try:
                await asyncio.sleep(15 * 60)
                cleaned = await job_queue.cleanup_old_jobs()
                if cleaned > 0:
                    logger.info(f"Cleaned up {cleaned} old jobs")
            except Exception as e:
                logger.error("Error in job cleanup loop", error=str(e))

    cleanup_task = asyncio.create_task(cleanup_loop())

    # Cek Ollama availability saat startup
    ollama_ok = await ollama_provider.health_check()
    if ollama_ok:
        models = await ollama_provider.list_models()
        logger.info(f"Ollama tersedia, {len(models)} model terinstall")
    else:
        logger.warning(
            "Ollama tidak tersedia saat startup. "
            "Pastikan Ollama sudah berjalan dan model sudah di-pull."
        )

    yield

    # Cleanup
    cleanup_task.cancel()
    
    # Close singleton clients
    try:
        from app.services.cloud_provider import deepseek_provider, openai_provider
        await ollama_provider.close()
        await deepseek_provider.close()
        await openai_provider.close()
        logger.info("AI Provider clients closed cleanly.")
    except Exception as e:
        logger.error("Error closing AI provider clients", error=str(e))

    logger.info("MSF-APP Backend shutting down.")


# ================================================================
# APP SETUP
# ================================================================

app = FastAPI(
    title="MSF-APP API",
    description=(
        "Database Documentation Platform API. "
        "Generate dokumentasi database dari SQL DDL atau koneksi langsung ke DB."
    ),
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS
cors_origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in cors_origins],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept", "X-API-Key"],
)
app.add_middleware(APIKeyMiddleware)

# ================================================================
# EXCEPTION HANDLERS
# ================================================================

@app.exception_handler(AppDetailedException)
async def app_detailed_exception_handler(request: Request, exc: AppDetailedException):
    logger.error("App error occurred", detail=exc.detail, error_code=exc.error_code)
    return exc.to_response()


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    logger.error("HTTP error occurred", status_code=exc.status_code, detail=exc.detail)
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            "error_code": f"HTTP_{exc.status_code}",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    logger.error("Validation error occurred", errors=errors)
    detail = "Input tidak valid"
    if errors:
        loc = " -> ".join(str(x) for x in errors[0]["loc"] if x != "body")
        msg = errors[0]["msg"]
        detail = f"Validasi gagal pada {loc}: {msg}" if loc else f"Validasi gagal: {msg}"

    return JSONResponse(
        status_code=422,
        content={
            "detail": detail,
            "error_code": "VALIDATION_ERROR",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.exception("Internal server error occurred", error=str(exc))
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Terjadi kesalahan internal pada server.",
            "error_code": "INTERNAL_SERVER_ERROR",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    )


# ================================================================
# ROUTERS
# ================================================================

app.include_router(generate.router)
app.include_router(database.router)
app.include_router(ai.router)
app.include_router(shortcuts.router)
app.include_router(export.router)


# ================================================================
# HEALTH CHECK
# ================================================================

@app.get("/health", tags=["Health"])
@app.get("/api/health", tags=["Health"])
async def health_check():
    """Health check semua service"""
    ollama_ok = await ollama_provider.health_check()
    ollama_status = "up" if ollama_ok else "down"

    # Cek model default
    ollama_model = None
    if ollama_ok:
        models = await ollama_provider.list_models()
        if models:
            ollama_model = models[0].name

    status = "healthy" if ollama_ok else "degraded"

    return {
        "status": status,
        "services": {
            "api": "up",
            "ollama": ollama_status,
            "ollama_model": ollama_model,
        },
        "version": "2.0.0",
    }


@app.get("/", tags=["Root"])
async def root():
    return {
        "name": "MSF-APP API",
        "version": "2.0.0",
        "docs": "/docs",
        "health": "/health",
    }
