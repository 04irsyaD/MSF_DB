"""Rate limiting per IP dan pembedaan dua jenis 429."""

import pytest
from fastapi.testclient import TestClient


@pytest.fixture
def ddl_payload():
    return {
        "sql_content": "CREATE TABLE pengguna (id INT PRIMARY KEY);",
        "ai_provider": "ollama",
        "model": "llama3.2",
        "language": "Indonesian",
        "detail_level": "simple",
        "business_context": "",
        "project_name": "Uji Rate Limit",
        "author": "Developer",
        "output_format": "docx",
    }


def _reset_limiter(rl) -> None:
    """Kosongkan penghitung limit antar test."""
    reset = getattr(rl.limiter, "reset", None)
    if callable(reset):
        reset()
        return
    rl.limiter._storage.reset()


def test_client_key_mengabaikan_forwarded_for_secara_bawaan(monkeypatch):
    from starlette.requests import Request

    from app.utils.rate_limit import client_key

    monkeypatch.delenv("RATE_LIMIT_TRUST_FORWARDED_FOR", raising=False)
    scope = {
        "type": "http",
        "headers": [(b"x-forwarded-for", b"203.0.113.9")],
        "client": ("10.0.0.5", 12345),
    }

    assert client_key(Request(scope)) == "10.0.0.5"


def test_client_key_memakai_forwarded_for_saat_flag_dinyalakan(monkeypatch):
    from starlette.requests import Request

    from app.utils.rate_limit import client_key

    monkeypatch.setenv("RATE_LIMIT_TRUST_FORWARDED_FOR", "true")
    scope = {
        "type": "http",
        "headers": [(b"x-forwarded-for", b"203.0.113.9, 10.0.0.1")],
        "client": ("10.0.0.5", 12345),
    }

    assert client_key(Request(scope)) == "203.0.113.9"


def test_rate_limit_enabled_dibaca_dari_env(monkeypatch):
    from app.utils.rate_limit import rate_limit_enabled

    monkeypatch.setenv("RATE_LIMIT_ENABLED", "false")
    assert rate_limit_enabled() is False

    monkeypatch.setenv("RATE_LIMIT_ENABLED", "true")
    assert rate_limit_enabled() is True


def test_dua_jenis_429_dibedakan_lewat_error_code(monkeypatch, ddl_payload):
    """
    MAX_CONCURRENT_JOBS=0 membuat gerbang antrean selalu menolak, sehingga tidak
    ada job maupun background task yang benar-benar dibuat. Dekorator limiter
    berjalan sebelum badan endpoint, jadi kedua request pertama tetap terhitung.
    """
    from app.main import app
    from app.utils import rate_limit as rl

    monkeypatch.setenv("MAX_CONCURRENT_JOBS", "0")
    monkeypatch.setenv("RATE_LIMIT_GENERATE", "2/minute")
    rl.limiter.enabled = True
    _reset_limiter(rl)

    with TestClient(app) as c:
        pertama = c.post("/api/generate/from-ddl", json=ddl_payload)
        kedua = c.post("/api/generate/from-ddl", json=ddl_payload)
        ketiga = c.post("/api/generate/from-ddl", json=ddl_payload)

    assert pertama.status_code == 429
    assert pertama.json()["error_code"] == "JOB_QUEUE_FULL"
    assert kedua.json()["error_code"] == "JOB_QUEUE_FULL"

    assert ketiga.status_code == 429
    body = ketiga.json()
    assert body["error_code"] == "RATE_LIMIT_EXCEEDED"
    assert "timestamp" in body
    assert int(ketiga.headers["Retry-After"]) > 0


def test_rate_limit_dapat_dimatikan(monkeypatch, ddl_payload):
    from app.main import app
    from app.utils import rate_limit as rl

    monkeypatch.setenv("MAX_CONCURRENT_JOBS", "0")
    monkeypatch.setenv("RATE_LIMIT_GENERATE", "1/minute")
    rl.limiter.enabled = False
    _reset_limiter(rl)

    try:
        with TestClient(app) as c:
            for _ in range(3):
                response = c.post("/api/generate/from-ddl", json=ddl_payload)
                assert response.json()["error_code"] == "JOB_QUEUE_FULL"
    finally:
        rl.limiter.enabled = True


def test_antrean_penuh_menjawab_429_job_queue_full(
    monkeypatch, isolated_job_queue, ddl_payload
):
    from app.main import app
    from app.utils import rate_limit as rl

    rl.limiter.enabled = False
    monkeypatch.setenv("MAX_CONCURRENT_JOBS", "1")

    try:
        with TestClient(app) as c:
            # Job aktif sengaja dibuat SETELAH startup: lifespan menjalankan
            # recover(), yang akan menandai job queued mana pun sebagai error.
            isolated_job_queue.create_job(project_name="Job aktif")
            response = c.post("/api/generate/from-ddl", json=ddl_payload)
    finally:
        rl.limiter.enabled = True

    assert response.status_code == 429
    assert response.json()["error_code"] == "JOB_QUEUE_FULL"
