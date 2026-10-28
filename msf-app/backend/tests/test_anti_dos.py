"""
Test anti-DoS — SECURITY_REMEDIATION_PLAN Batch 5 (T-026).

- Batas ukuran field input -> 422.
- Batas body request global -> 413 (Content-Length maupun chunked).
- Export/parser sinkron tidak membekukan event loop.
"""
import asyncio
import time

import pytest
from httpx import ASGITransport, AsyncClient

from app.utils.body_limit import DEFAULT_MAX_BODY_BYTES

DDL = "CREATE TABLE users (id INT PRIMARY KEY, email VARCHAR(100));"


# ----------------------------------------------------------------
# Batas field (422)
# ----------------------------------------------------------------

@pytest.mark.parametrize(
    "path, payload",
    [
        ("/api/export/docx", {"markdown_content": "a" * 1_000_001}),
        ("/api/export/pdf", {"markdown_content": "# x", "author": "a" * 101}),
        ("/api/generate/parse-ddl", {"sql_content": "a" * 500_001}),
        ("/api/generate/parse-ddl", {"sql_content": DDL, "dialect": "oracle"}),
        ("/api/generate/from-ddl", {"sql_content": DDL, "model": "m" * 101}),
        (
            "/api/generate/from-db",
            {
                "connection": {"engine": "postgresql", "host": "db.example.com", "database": "app"},
                "table_filter": [f"t{i}" for i in range(201)],
            },
        ),
    ],
)
def test_oversized_fields_rejected(client, path, payload):
    res = client.post(path, json=payload)
    assert res.status_code == 422


def test_valid_parse_ddl_still_works(client):
    res = client.post("/api/generate/parse-ddl", json={"sql_content": DDL, "dialect": "mysql"})
    assert res.status_code == 200
    assert res.json()[0]["name"] == "users"


# ----------------------------------------------------------------
# Batas body global (413)
# ----------------------------------------------------------------

def test_body_over_limit_rejected_with_cors(client):
    big = b'{"markdown_content": "' + b"a" * (DEFAULT_MAX_BODY_BYTES + 10) + b'"}'
    res = client.post(
        "/api/export/docx",
        content=big,
        headers={"Content-Type": "application/json", "Origin": "http://localhost:3000"},
    )
    assert res.status_code == 413
    assert res.json()["error_code"] == "HTTP_413"
    assert res.headers.get("access-control-allow-origin") == "http://localhost:3000"


def test_chunked_body_over_limit_rejected(client):
    chunk = b"a" * (512 * 1024)

    def body():
        yield b'{"markdown_content": "'
        for _ in range(6):  # 3 MB tanpa Content-Length
            yield chunk
        yield b'"}'

    res = client.post("/api/export/docx", content=body(), headers={"Content-Type": "application/json"})
    assert res.status_code == 413


# ----------------------------------------------------------------
# Event loop tidak beku saat export berat
# ----------------------------------------------------------------

async def test_slow_export_does_not_block_health(monkeypatch):
    from app.main import app
    from app.services import ollama_provider as ollama_module
    from app.services.exporters.docx_exporter import DocxExporter

    def slow_export(self, **kwargs):
        time.sleep(1.5)  # simulasi export CPU-bound
        return b"docx"

    async def no_ollama():
        return False

    monkeypatch.setattr(DocxExporter, "export", slow_export)
    monkeypatch.setattr(ollama_module.ollama_provider, "health_check", no_ollama)

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        export_task = asyncio.create_task(ac.post("/api/export/docx", json={"markdown_content": "# x"}))
        await asyncio.sleep(0.2)

        started = time.perf_counter()
        health = await ac.get("/health")
        elapsed = time.perf_counter() - started

        assert health.status_code == 200
        assert elapsed < 1.0, f"/health tertahan {elapsed:.2f}s oleh export"
        assert not export_task.done()
        assert (await export_task).status_code == 200
