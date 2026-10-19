"""
Test redaksi log — SECURITY_REMEDIATION_PLAN Batch 3 (T-024).

Password, connection string, API key, dan SQL penuh tidak boleh muncul di log.
"""
import io
import json

import pytest
import structlog

from app.utils.redact import MASK, mask_url_credentials, redact_sensitive_processor

SECRET = "S3cretPass!"


class RecordingLogger:
    """Pengganti logger structlog yang mencatat semua pemanggilan."""

    def __init__(self):
        self.calls = []

    def _record(self, event, **kwargs):
        self.calls.append((event, kwargs))

    info = warning = error = exception = debug = _record

    def dump(self) -> str:
        return json.dumps(self.calls, default=str)


# ----------------------------------------------------------------
# Processor global
# ----------------------------------------------------------------

def test_processor_masks_sensitive_keys_at_any_depth():
    event = {
        "event": "x",
        "payload": {
            "connection": {"host": "db.example.com", "password": SECRET, "connection_string": f"postgresql://u:{SECRET}@h/db"},
            "headers": [{"X-Admin-Passcode": SECRET}, {"x-api-key": SECRET}],
        },
        "access_code": "MSF-ABCDEF",
    }
    out = redact_sensitive_processor(None, "info", event)
    dumped = json.dumps(out)
    assert SECRET not in dumped
    assert "MSF-ABCDEF" not in dumped
    assert out["payload"]["connection"]["host"] == "db.example.com"
    assert out["payload"]["connection"]["password"] == MASK


@pytest.mark.parametrize(
    "raw",
    [
        f"could not connect: postgresql+psycopg2://admin:{SECRET}@10.0.0.1:5432/app",
        f"mysql+pymysql://root:{SECRET}@db/app?charset=utf8mb4",
    ],
)
def test_url_credentials_masked_in_free_text(raw):
    masked = mask_url_credentials(raw)
    assert SECRET not in masked
    assert ":***@" in masked


def test_processor_runs_inside_structlog_pipeline():
    stream = io.StringIO()
    log = structlog.wrap_logger(
        structlog.PrintLogger(file=stream),
        processors=[redact_sensitive_processor, structlog.processors.JSONRenderer()],
    )
    log.info("connect", connection={"password": SECRET}, error=f"postgresql://u:{SECRET}@h/db")
    assert SECRET not in stream.getvalue()


# ----------------------------------------------------------------
# Endpoint tidak me-log SQL / kredensial
# ----------------------------------------------------------------

def test_generate_from_db_logs_only_metadata(client, monkeypatch):
    from app.routers import generate

    recorder = RecordingLogger()
    monkeypatch.setattr(generate, "logger", recorder)
    monkeypatch.delenv("ALLOW_PRIVATE_DB_HOSTS", raising=False)

    payload = {
        "connection": {
            "engine": "postgresql",
            "connection_string": f"postgresql://admin:{SECRET}@127.0.0.1:5432/app",
        },
        "business_context": "RAHASIA-BISNIS",
        "project_name": "Test",
    }
    res = client.post("/api/generate/from-db", json=payload)
    assert res.status_code == 400  # ditolak guard (host privat)

    dumped = recorder.dump()
    assert recorder.calls, "request harus tetap tercatat (metadata)"
    assert SECRET not in dumped
    assert "RAHASIA-BISNIS" not in dumped
    assert "127.0.0.1" not in dumped


def test_settings_log_fields_exclude_sql_and_context():
    from app.models.schemas import GenerateFromDDLRequest
    from app.routers.generate import _settings_log_fields

    req = GenerateFromDDLRequest(sql_content="CREATE TABLE secret_table (id int);", business_context="RAHASIA")
    fields = json.dumps(_settings_log_fields(req), default=str)
    assert "secret_table" not in fields
    assert "RAHASIA" not in fields


def test_validation_error_log_has_no_raw_input(client, monkeypatch):
    import app.main as main

    recorder = RecordingLogger()
    monkeypatch.setattr(main, "logger", recorder)

    payload = {"connection": {"engine": "postgresql", "host": "db.example.com", "database": "app",
                              "password": SECRET, "port": "bukan-angka"}}
    res = client.post("/api/db/test-connection", json=payload)
    assert res.status_code == 422
    assert recorder.calls
    assert SECRET not in recorder.dump()
