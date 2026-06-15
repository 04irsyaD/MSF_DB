"""
MSF-APP Backend — FastAPI Entry Point
"""

import os
import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import structlog

from app.routers import generate, database, ai, shortcuts, export
from app.background.job_queue import job_queue
from app.services.ollama_provider import ollama_provider

logger = structlog.get_logger()

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
            await asyncio.sleep(15 * 60)
            cleaned = await job_queue.cleanup_old_jobs()
            if cleaned > 0:
                logger.info(f"Cleaned up {cleaned} old jobs")

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
    allow_methods=["*"],
    allow_headers=["*"],
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
