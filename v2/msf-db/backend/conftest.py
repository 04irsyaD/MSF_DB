"""
Pytest configuration dan shared fixtures untuk MSF-APP backend tests.
"""
import pytest
import asyncio
from fastapi.testclient import TestClient
from httpx import AsyncClient

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

    import app.background.job_queue as jq_module
    monkeypatch.setattr(jq_module, "OUTPUT_DIR", str(output_dir))

    fresh = jq_module.JobQueue(max_retention_minutes=60)
    monkeypatch.setattr(jq_module, "job_queue", fresh)

    import app.main as main_module
    import app.routers.admin as admin_router
    import app.routers.generate as generate_router

    monkeypatch.setattr(admin_router, "job_queue", fresh)
    monkeypatch.setattr(generate_router, "job_queue", fresh)
    monkeypatch.setattr(main_module, "job_queue", fresh)

    yield fresh


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
