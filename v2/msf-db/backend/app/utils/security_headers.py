"""
Security headers HTTP untuk seluruh respons backend.

Modul ini hanya menentukan header apa yang dipasang dan kapan. Pendaftarannya
dilakukan di main.py agar berkas itu tetap berperan sebagai komposisi aplikasi.
"""

import os

from starlette.middleware.base import BaseHTTPMiddleware

_NILAI_BENAR = ("1", "true", "yes", "on")

# Header yang selalu dipasang, tanpa syarat.
SECURITY_HEADERS = {
    # Mencegah browser menebak-nebak tipe konten
    "X-Content-Type-Options": "nosniff",
    # Mencegah clickjacking. DENY, bukan SAMEORIGIN, karena tidak ada satu pun
    # halaman yang perlu menyematkan backend di dalam frame.
    "X-Frame-Options": "DENY",
    # Jangan bocorkan path lengkap ke situs lain saat pengguna berpindah
    "Referrer-Policy": "strict-origin-when-cross-origin",
    # Aplikasi ini tidak butuh satu pun API perangkat
    "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
    # Putuskan hubungan window dengan pembuka lintas origin
    "Cross-Origin-Opener-Policy": "same-origin",
    # Cegah situs lain memuat berkas hasil generate sebagai sumber daya
    "Cross-Origin-Resource-Policy": "same-origin",
    # Cegah Flash/PDF lintas domain
    "X-Permitted-Cross-Domain-Policies": "none",
}

HSTS_HEADER = "Strict-Transport-Security"
HSTS_VALUE = "max-age=31536000; includeSubDomains"


def hsts_enabled() -> bool:
    """
    HSTS mati secara bawaan dan HARUS tetap begitu di pengembangan.

    Browser mengingat HSTS per host. Mengirimnya sekali dari http://localhost
    membuat browser memaksa HTTPS untuk SELURUH localhost selama setahun,
    termasuk proyek lain yang tidak ada hubungannya, dan itu sulit dibatalkan.
    Nyalakan hanya pada deployment yang benar-benar melayani HTTPS.
    """
    return os.getenv("HSTS_ENABLED", "false").strip().lower() in _NILAI_BENAR


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Memasang security headers pada setiap respons, termasuk respons error."""

    async def dispatch(self, request, call_next):
        response = await call_next(request)

        for nama, nilai in SECURITY_HEADERS.items():
            # setdefault agar endpoint yang sengaja menetapkan sendiri tidak ditimpa
            response.headers.setdefault(nama, nilai)

        if hsts_enabled():
            response.headers.setdefault(HSTS_HEADER, HSTS_VALUE)

        return response
