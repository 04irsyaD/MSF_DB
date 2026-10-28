"""
Test Schema Compare koneksi langsung — /api/schema-compare/catalog.

Test router memakai fetch_catalog palsu. Test integrasi (paling bawah) butuh
PostgreSQL sungguhan dan dilewati kecuali TEST_PG_URL diisi, misal:
  TEST_PG_URL=postgresql://postgres:pass@127.0.0.1:5432/postgres pytest tests/test_schema_compare.py
"""
import os
import uuid

import pytest
from sqlalchemy import create_engine, text
from sqlalchemy.engine import make_url
from structlog.testing import capture_logs

from app.models.schemas import DBConnection
from app.routers import schema_compare
from app.services.db_url_guard import ConnectionNotAllowed, target_fingerprint
from app.services.schema_catalog import CatalogError, fetch_catalog
from app.utils.rate_limit import SlidingWindowLimiter

URL = "/api/schema-compare/catalog"
SECRET = "rahasia-sekali-123"

FAKE_RESULT = {
    "catalog": {
        "server_version": "17.5",
        "server_version_num": 170005,
        "tables": [{"oid": "1", "name": "users"}],
        "columns": [],
        "constraints": [],
        "indexes": [],
    },
    "access": {"role": "reader", "is_superuser": False, "readable_count": 0, "readable_sample": []},
    "database": "app",
    "schema": "public",
}


def _body(host="db.example.com", user="reader"):
    return {
        "connection": {
            "engine": "postgresql",
            "host": host,
            "port": 5432,
            "database": "app",
            "username": user,
            "password": SECRET,
            "schema_name": "public",
        }
    }


@pytest.fixture(autouse=True)
def reset_limits():
    for limiter in (schema_compare.request_limiter, schema_compare.ip_lockout, schema_compare.target_lockout):
        limiter.reset()
    yield


@pytest.fixture
def fake_fetch(monkeypatch):
    calls = []

    def fake(conn):
        calls.append(conn)
        return FAKE_RESULT

    monkeypatch.setattr(schema_compare, "fetch_catalog", fake)
    return calls


def _fail_with(monkeypatch, error):
    def fake(conn):
        raise error

    monkeypatch.setattr(schema_compare, "fetch_catalog", fake)


def test_success_returns_catalog(client, fake_fetch):
    res = client.post(URL, json=_body())
    assert res.status_code == 200
    assert res.json()["catalog"]["tables"] == [{"oid": "1", "name": "users"}]
    assert len(fake_fetch) == 1


def test_auth_failures_lock_out_the_target_even_from_other_ips(client, monkeypatch):
    _fail_with(monkeypatch, ConnectionNotAllowed("AUTH_FAILED", "Autentikasi gagal."))
    for i in range(5):
        res = client.post(URL, json=_body(), headers={"X-Forwarded-For": f"10.0.0.{i}"})
        assert res.status_code == 400
        assert res.json()["error_code"] == "AUTH_FAILED"

    res = client.post(URL, json=_body(), headers={"X-Forwarded-For": "10.0.0.99"})
    assert res.status_code == 429
    assert int(res.headers["retry-after"]) > 0


def test_lockout_is_per_target(client, monkeypatch):
    _fail_with(monkeypatch, ConnectionNotAllowed("AUTH_FAILED", "Autentikasi gagal."))
    for i in range(5):
        client.post(URL, json=_body(user="admin"), headers={"X-Forwarded-For": f"10.0.1.{i}"})

    monkeypatch.setattr(schema_compare, "fetch_catalog", lambda conn: FAKE_RESULT)
    res = client.post(URL, json=_body(user="reader"), headers={"X-Forwarded-For": "10.0.1.99"})
    assert res.status_code == 200


def test_non_auth_errors_do_not_count_toward_lockout(client, monkeypatch):
    _fail_with(monkeypatch, CatalogError("SCHEMA_NOT_FOUND", "Schema tidak ditemukan di database ini."))
    for _ in range(8):
        assert client.post(URL, json=_body()).json()["error_code"] == "SCHEMA_NOT_FOUND"


def test_request_rate_limit_per_ip(client, fake_fetch, monkeypatch):
    monkeypatch.setattr(schema_compare, "request_limiter", SlidingWindowLimiter(max_requests=3, window_seconds=600))
    for _ in range(3):
        assert client.post(URL, json=_body()).status_code == 200
    assert client.post(URL, json=_body()).status_code == 429
    assert len(fake_fetch) == 3


def test_log_has_outcome_but_no_password_or_host(client, monkeypatch):
    with capture_logs() as logs:
        _fail_with(monkeypatch, ConnectionNotAllowed("AUTH_FAILED", "Autentikasi gagal."))
        client.post(URL, json=_body())
        monkeypatch.setattr(schema_compare, "fetch_catalog", lambda conn: FAKE_RESULT)
        client.post(URL, json=_body())

    audit = [entry for entry in logs if entry["event"] == "schema_compare_catalog"]
    assert [entry["outcome"] for entry in audit] == ["AUTH_FAILED", "OK"]
    logged = repr(logs)
    assert SECRET not in logged
    assert "db.example.com" not in logged


def test_limiter_window_slides():
    now = [0.0]
    limiter = SlidingWindowLimiter(max_requests=2, window_seconds=10, clock=lambda: now[0])
    assert limiter.hit("a") == 0
    assert limiter.hit("a") == 0
    assert limiter.hit("a") > 0
    now[0] = 10.0
    assert limiter.hit("a") == 0


def test_fingerprint_hides_host_and_separates_users():
    a = target_fingerprint(DBConnection(engine="postgresql", host="db.example.com", database="app", username="a"))
    b = target_fingerprint(DBConnection(engine="postgresql", host="db.example.com", database="app", username="b"))
    assert a != b
    assert "example" not in a


def test_only_postgresql_is_supported():
    conn = DBConnection(engine="mysql", host="db.example.com", database="app", username="u", password="p")
    with pytest.raises(ConnectionNotAllowed) as err:
        fetch_catalog(conn)
    assert err.value.code == "ENGINE_NOT_SUPPORTED"


# ---------------------------------------------------------------------------
# Integrasi dengan PostgreSQL sungguhan
# ---------------------------------------------------------------------------

PG_URL = os.getenv("TEST_PG_URL")
pg = pytest.mark.skipif(not PG_URL, reason="TEST_PG_URL tidak diisi")


@pytest.fixture
def pg_database(monkeypatch):
    """Database sementara berisi dua tabel + role tanpa hak SELECT ke tabel."""
    monkeypatch.setenv("ALLOW_PRIVATE_DB_HOSTS", "true")
    admin_url = make_url(PG_URL)
    name = f"sc_test_{uuid.uuid4().hex[:8]}"
    reader = f"{name}_reader"
    admin = create_engine(admin_url, isolation_level="AUTOCOMMIT")
    with admin.connect() as c:
        c.execute(text(f'CREATE DATABASE "{name}"'))
        c.execute(text(f"CREATE ROLE \"{reader}\" LOGIN PASSWORD 'reader-pass'"))

    db_url = admin_url.set(database=name)
    db = create_engine(db_url, isolation_level="AUTOCOMMIT")
    with db.connect() as c:
        c.execute(text("""
            CREATE TABLE users (id bigserial PRIMARY KEY, email varchar(255) NOT NULL UNIQUE, secret text);
            CREATE TABLE orders (
                id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                user_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                total numeric(12,2) DEFAULT 0
            );
            CREATE INDEX idx_orders_user ON orders(user_id) WHERE total > 0;
            CREATE TABLE migrations (id serial PRIMARY KEY, migration text);
            INSERT INTO users (email, secret) VALUES ('a@x.com', 'jangan-dibaca');
        """))
        c.execute(text(f'GRANT CONNECT ON DATABASE "{name}" TO "{reader}"'))
        c.execute(text(f'GRANT USAGE ON SCHEMA public TO "{reader}"'))
    db.dispose()

    yield {"url": db_url, "name": name, "reader": reader}

    with admin.connect() as c:
        c.execute(text(f'DROP DATABASE "{name}" WITH (FORCE)'))
        c.execute(text(f'DROP ROLE "{reader}"'))
    admin.dispose()


def _conn(url, username=None, password=None):
    return DBConnection(
        engine="postgresql",
        host=url.host,
        port=url.port,
        database=url.database,
        username=username or url.username,
        password=password if password is not None else url.password,
    )


def _table_reads(url):
    """Jumlah scan ke tabel user menurut statistik PostgreSQL."""
    engine = create_engine(url, isolation_level="AUTOCOMMIT")
    with engine.connect() as c:
        c.execute(text("SELECT pg_stat_force_next_flush()"))
        c.execute(text("SELECT pg_stat_clear_snapshot()"))
        rows = c.execute(text(
            "SELECT relname, coalesce(seq_scan, 0) + coalesce(idx_scan, 0) AS scans FROM pg_stat_user_tables"
        ))
        result = {row.relname: row.scans for row in rows}
    engine.dispose()
    return result


@pg
def test_reader_without_select_gets_full_structure(pg_database):
    result = fetch_catalog(_conn(pg_database["url"], pg_database["reader"], "reader-pass"))
    catalog = result["catalog"]

    assert {t["name"] for t in catalog["tables"]} == {"users", "orders", "migrations"}
    columns = {(c["name"], c["type"]) for c in catalog["columns"]}
    assert ("email", "character varying(255)") in columns
    assert ("total", "numeric(12,2)") in columns
    fk = next(c for c in catalog["constraints"] if c["type"] == "f")
    assert fk["columns"] == ["user_id"] and fk["ref_table"] == "users" and fk["on_delete"] == "c"
    partial = next(i for i in catalog["indexes"] if i["name"] == "idx_orders_user")
    assert partial["predicate"] == "(total > (0)::numeric)"

    assert result["access"] == {
        "role": pg_database["reader"],
        "is_superuser": False,
        "readable_count": 0,
        "readable_sample": [],
    }


@pg
def test_catalog_never_scans_user_tables(pg_database):
    before = _table_reads(pg_database["url"])
    fetch_catalog(_conn(pg_database["url"]))
    after = _table_reads(pg_database["url"])
    assert after == before


@pg
def test_superuser_is_reported(pg_database):
    access = fetch_catalog(_conn(pg_database["url"]))["access"]
    assert access["is_superuser"] is True
    assert access["readable_count"] == 3


@pg
def test_wrong_password_and_missing_schema(pg_database):
    with pytest.raises(ConnectionNotAllowed) as err:
        fetch_catalog(_conn(pg_database["url"], pg_database["reader"], "salah"))
    assert err.value.code == "AUTH_FAILED"

    conn = _conn(pg_database["url"], pg_database["reader"], "reader-pass")
    conn.schema_name = "tidak_ada"
    with pytest.raises(CatalogError) as err:
        fetch_catalog(conn)
    assert err.value.code == "SCHEMA_NOT_FOUND"
