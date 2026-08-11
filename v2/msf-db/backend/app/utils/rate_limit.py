"""
Konfigurasi rate limiting per alamat IP.

Modul ini hanya menentukan KUNCI pembatas, angka limit, dan bentuk respons 429.
Endpoint mana yang dibatasi ditentukan di router masing-masing, agar main.py
tetap berperan sebagai komposisi aplikasi saja.
"""

import os
from datetime import datetime, timezone

from fastapi import Request
from fastapi.responses import JSONResponse
from slowapi import Limiter
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

_NILAI_BENAR = ("1", "true", "yes", "on")


def rate_limit_enabled() -> bool:
    return os.getenv("RATE_LIMIT_ENABLED", "true").strip().lower() in _NILAI_BENAR


def _trust_forwarded_for() -> bool:
    return (
        os.getenv("RATE_LIMIT_TRUST_FORWARDED_FOR", "false").strip().lower()
        in _NILAI_BENAR
    )


def client_key(request: Request) -> str:
    """
    Kunci pembatas: alamat IP klien.

    X-Forwarded-For hanya dipercaya bila RATE_LIMIT_TRUST_FORWARDED_FOR=true.
    Default sengaja false: header ini dapat dipalsukan klien, dan memercayainya
    tanpa proxy tepercaya justru membuat limit dapat dilewati sepenuhnya.
    """
    if _trust_forwarded_for():
        forwarded = request.headers.get("X-Forwarded-For", "")
        if forwarded:
            return forwarded.split(",")[0].strip()
    return get_remote_address(request)


def generate_limit() -> str:
    return os.getenv("RATE_LIMIT_GENERATE", "10/minute")


def admin_verify_limit() -> str:
    return os.getenv("RATE_LIMIT_ADMIN_VERIFY", "5/minute")


def job_lookup_limit() -> str:
    """
    Pelacakan job memakai kode akses 40 bit dari secrets. Kuat terhadap
    tebakan tunggal, tetapi tanpa limit enumerasinya tidak dibatasi apa pun.
    Endpoint ini mengembalikan preview dokumen, yang dapat memuat komentar
    dari database milik pengguna.
    """
    return os.getenv("RATE_LIMIT_JOB_LOOKUP", "30/minute")


# key_style="endpoint" wajib, bukan bawaan slowapi "url".
#
# Dengan gaya "url", nama bucket limit diambil dari path permintaan, sehingga
# setiap path unik mendapat penghitung sendiri. Endpoint pelacakan job memuat
# kode akses di dalam path-nya, jadi penyerang yang menebak kode berbeda-beda
# akan menempati bucket berbeda pula dan tidak pernah terkena limit. Persis
# serangan yang hendak dicegah yang justru lolos.
#
# Endpoint lain memakai path tetap, sehingga bagi mereka kedua gaya setara.
limiter = Limiter(
    key_func=client_key, key_style="endpoint", enabled=rate_limit_enabled()
)


def _retry_after_seconds(exc: RateLimitExceeded, default: int = 60) -> int:
    """Panjang jendela limit dari exception slowapi, dengan cadangan yang aman."""
    inner = getattr(getattr(exc, "limit", None), "limit", None)
    get_expiry = getattr(inner, "get_expiry", None)
    if callable(get_expiry):
        try:
            return int(get_expiry())
        except Exception:
            return default
    return default


def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded) -> JSONResponse:
    """Amplop error standar API_CONTRACT.md, ditambah header Retry-After."""
    retry_after = _retry_after_seconds(exc)
    return JSONResponse(
        status_code=429,
        content={
            "detail": (
                "Terlalu banyak permintaan dari alamat ini. "
                f"Silakan coba lagi dalam {retry_after} detik."
            ),
            "error_code": "RATE_LIMIT_EXCEEDED",
            "timestamp": datetime.now(timezone.utc).isoformat(),
        },
        headers={"Retry-After": str(retry_after)},
    )
