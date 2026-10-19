"""
Pytest configuration dan shared fixtures untuk MSF-APP backend tests.

Catatan: `asyncio_mode = auto` sudah dikonfigurasi di pytest.ini,
sehingga fixture `event_loop` custom tidak lagi diperlukan dan telah
dihapus untuk menghindari DeprecationWarning dari pytest-asyncio.
"""
from fastapi.testclient import TestClient
from httpx import ASGITransport, AsyncClient
import pytest


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
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac


@pytest.fixture(autouse=True)
def reset_admin_lockout():
    """State lockout admin global; reset agar kegagalan satu test tidak mengunci test lain."""
    from app.routers.admin import admin_lockout
    admin_lockout.reset()
    yield
    admin_lockout.reset()
