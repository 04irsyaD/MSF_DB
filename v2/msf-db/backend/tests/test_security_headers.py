"""Security headers HTTP wajib terpasang di seluruh respons backend."""

import pytest
from fastapi.testclient import TestClient


def _ambil(path: str = "/api/health"):
    from app.main import app

    with TestClient(app) as c:
        return c.get(path)


@pytest.mark.parametrize(
    "nama,nilai",
    [
        ("X-Content-Type-Options", "nosniff"),
        ("X-Frame-Options", "DENY"),
        ("Referrer-Policy", "strict-origin-when-cross-origin"),
        ("Permissions-Policy", "geolocation=(), microphone=(), camera=()"),
        ("Cross-Origin-Opener-Policy", "same-origin"),
        ("Cross-Origin-Resource-Policy", "same-origin"),
        ("X-Permitted-Cross-Domain-Policies", "none"),
    ],
)
def test_header_wajib_terpasang(nama, nilai):
    response = _ambil()

    assert response.headers.get(nama) == nilai


def test_header_terpasang_juga_pada_respons_error():
    """Respons error dibentuk exception handler, bukan endpoint. Jangan sampai lolos."""
    response = _ambil("/api/jobs/job-yang-tidak-ada")

    assert response.status_code == 404
    assert response.headers.get("X-Content-Type-Options") == "nosniff"
    assert response.headers.get("X-Frame-Options") == "DENY"


def test_hsts_mati_secara_bawaan(monkeypatch):
    """
    Mengirim HSTS saat diakses lewat http://localhost akan mengunci browser
    ke HTTPS untuk seluruh localhost selama setahun, termasuk proyek lain.
    """
    monkeypatch.delenv("HSTS_ENABLED", raising=False)

    response = _ambil()

    assert "Strict-Transport-Security" not in response.headers


def test_hsts_aktif_bila_dinyalakan(monkeypatch):
    monkeypatch.setenv("HSTS_ENABLED", "true")

    response = _ambil()

    assert (
        response.headers["Strict-Transport-Security"]
        == "max-age=31536000; includeSubDomains"
    )


def test_x_xss_protection_tidak_dipasang():
    """Header itu sudah deprecated dan dihapus browser modern sejak 2019."""
    response = _ambil()

    assert "X-XSS-Protection" not in response.headers
