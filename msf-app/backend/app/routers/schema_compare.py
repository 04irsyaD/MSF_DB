"""
Router: Schema Compare — /api/schema-compare/*

Koneksi langsung hanya membaca struktur (lihat `services/schema_catalog.py`).
Tidak ada riwayat koneksi: kredensial tidak disimpan di mana pun. Log hanya
mencatat waktu, IP, sidik tujuan (HMAC, tidak bisa dibalik), dan hasil.

Anti penyalahgunaan (misal menebak password DB orang lewat server ini):
- rate limit per IP,
- lockout per IP dan per tujuan setelah autentikasi gagal berulang
  (per tujuan penting karena request lewat Vercel terbaca sebagai IP Vercel),
- maksimal 2 introspeksi berjalan bersamaan.
"""

import asyncio

import structlog
from fastapi import APIRouter, HTTPException, Request

from app.models.schemas import SchemaCatalogRequest
from app.services.db_url_guard import ConnectionNotAllowed, target_fingerprint
from app.services.schema_catalog import CatalogError, fetch_catalog
from app.utils.client_ip import client_ip
from app.utils.errors import AppDetailedException
from app.utils.login_lockout import LoginLockout
from app.utils.rate_limit import SlidingWindowLimiter

router = APIRouter(prefix="/api/schema-compare", tags=["Schema Compare"])
logger = structlog.get_logger()

request_limiter = SlidingWindowLimiter(max_requests=20, window_seconds=10 * 60)
ip_lockout = LoginLockout(max_failures=10, window_seconds=15 * 60, lockout_seconds=15 * 60)
target_lockout = LoginLockout(max_failures=5, window_seconds=15 * 60, lockout_seconds=15 * 60)
_slots = asyncio.Semaphore(2)

_AUTH_FAILURES = {"AUTH_FAILED"}


def _audit(ip: str, target: str, outcome: str, **extra) -> None:
    logger.info("schema_compare_catalog", client_ip=ip, target=target, outcome=outcome, **extra)


@router.post("/catalog")
async def schema_catalog(request: Request, body: SchemaCatalogRequest):
    """Baca struktur satu schema PostgreSQL. Tidak membaca isi tabel."""
    ip = client_ip(request)
    target = target_fingerprint(body.connection)

    retry_after = max(
        ip_lockout.retry_after(ip),
        target_lockout.retry_after(target),
        request_limiter.hit(ip),
    )
    if retry_after:
        _audit(ip, target, "RATE_LIMITED")
        raise HTTPException(
            status_code=429,
            detail="Terlalu banyak percobaan koneksi. Coba lagi nanti.",
            headers={"Retry-After": str(retry_after)},
        )

    try:
        async with _slots:
            result = await asyncio.to_thread(fetch_catalog, body.connection)
    except ConnectionNotAllowed as e:
        if e.code in _AUTH_FAILURES:
            ip_lockout.register_failure(ip)
            target_lockout.register_failure(target)
        _audit(ip, target, e.code)
        raise AppDetailedException(e.message, status_code=400, error_code=e.code)
    except CatalogError as e:
        _audit(ip, target, e.code)
        raise AppDetailedException(e.message, status_code=400, error_code=e.code)

    target_lockout.register_success(target)
    _audit(ip, target, "OK", tables=len(result["catalog"]["tables"]))
    return result
