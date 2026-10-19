"""
Test security headers & docs — SECURITY_REMEDIATION_PLAN Batch 8 (T-029).
"""
import pytest

EXPECTED = {
    "strict-transport-security": "max-age=31536000; includeSubDomains",
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
    "referrer-policy": "no-referrer",
    "content-security-policy": "default-src 'none'; frame-ancestors 'none'",
}


def _assert_security_headers(res):
    for name, value in EXPECTED.items():
        assert res.headers.get(name) == value, name


def test_security_headers_on_health(client):
    _assert_security_headers(client.get("/health"))


@pytest.mark.parametrize(
    "method, path, kwargs, status",
    [
        ("get", "/api/jobs/tidak-ada", {}, 404),
        ("post", "/api/db/test-connection", {"json": {"connection": {"engine": "postgresql", "port": "x"}}}, 422),
        ("post", "/api/export/docx", {"content": b"x" * (3 * 1024 * 1024), "headers": {"Content-Type": "application/json"}}, 413),
    ],
)
def test_security_headers_on_error_responses(client, method, path, kwargs, status):
    res = getattr(client, method)(path, **kwargs)
    assert res.status_code == status
    _assert_security_headers(res)


def test_job_and_admin_responses_not_cached(client):
    assert client.get("/api/jobs/tidak-ada").headers.get("cache-control") == "no-store"
    assert client.post("/api/admin/verify").headers.get("cache-control") == "no-store"
    assert client.get("/health").headers.get("cache-control") != "no-store"


@pytest.mark.parametrize("path", ["/docs", "/redoc", "/openapi.json"])
def test_api_docs_disabled_by_default(client, path):
    assert client.get(path).status_code == 404


def test_root_does_not_advertise_disabled_docs(client):
    assert client.get("/").json()["docs"] is None


def test_api_docs_config_enabled_by_env(monkeypatch):
    from app.main import api_docs_config

    monkeypatch.setenv("ENABLE_DOCS", "true")
    assert api_docs_config()["openapi_url"] == "/openapi.json"
    monkeypatch.setenv("ENABLE_DOCS", "false")
    assert api_docs_config() == {"docs_url": None, "redoc_url": None, "openapi_url": None}


def test_cors_does_not_allow_credentials(client):
    res = client.options(
        "/api/shortcuts",
        headers={"Origin": "http://localhost:3000", "Access-Control-Request-Method": "GET"},
    )
    assert res.headers.get("access-control-allow-origin") == "http://localhost:3000"
    assert "access-control-allow-credentials" not in res.headers
