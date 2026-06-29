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
