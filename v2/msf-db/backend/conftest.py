"""
Pytest configuration dan shared fixtures untuk MSF-APP backend tests.
"""
import asyncio
import os
import tempfile

import pytest
from fastapi.testclient import TestClient
from httpx import AsyncClient

# Dijalankan saat conftest di-import, sebelum modul test mana pun dikumpulkan.
# Singleton job_queue dibangun saat modul di-import, yaitu sebelum fixture mana
# pun berjalan, dan path bawaan /app/outputs/jobs.db tidak valid di luar container.
os.environ.setdefault(
    "JOBS_DB_PATH", os.path.join(tempfile.gettempdir(), "msf_test_jobs.db")
)
os.environ.setdefault("OUTPUT_DIR", tempfile.gettempdir())

@pytest.fixture(scope="session")
def event_loop():
    """Create event loop untuk async tests."""
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    yield loop
    loop.close()

@pytest.fixture(autouse=True)
def isolated_job_queue(tmp_path, monkeypatch):
    """
    Setiap test mendapat singleton job_queue sendiri dengan OUTPUT_DIR sementara.

    Modul router mengimpor singleton lewat 'from ... import job_queue', sehingga
    menambal modul asal saja tidak cukup — setiap modul pengimpor ikut ditambal.
    """
    output_dir = tmp_path / "outputs"
    output_dir.mkdir()
    monkeypatch.setenv("OUTPUT_DIR", str(output_dir))
    monkeypatch.setenv("JOBS_DB_PATH", str(tmp_path / "jobs.db"))

    import app.background.job_queue as jq_module
    monkeypatch.setattr(jq_module, "OUTPUT_DIR", str(output_dir))

    fresh = jq_module.JobQueue()
    monkeypatch.setattr(jq_module, "job_queue", fresh)

    import app.main as main_module
    import app.routers.admin as admin_router
    import app.routers.generate as generate_router

    monkeypatch.setattr(admin_router, "job_queue", fresh)
    monkeypatch.setattr(generate_router, "job_queue", fresh)
    monkeypatch.setattr(main_module, "job_queue", fresh)

    yield fresh

    fresh.close()


@pytest.fixture
def client():
    """Sync test client untuk endpoint tests."""
    from app.main import app
    with TestClient(app) as c:
        yield c

@pytest.fixture
async def async_client():
    """Async test client untuk endpoint tests."""
    from app.main import app
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac
