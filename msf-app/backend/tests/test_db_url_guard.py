"""
Test guard koneksi DB (anti-SSRF) — SECURITY_REMEDIATION_PLAN Batch 2 (T-023).

Resolusi DNS di-mock supaya test tidak butuh jaringan atau database sungguhan.
"""
import socket

import pytest

from app.models.schemas import DBConnection
from app.services import db_url_guard
from app.services.db_connector import DBConnector
from app.services.db_url_guard import (
    ConnectionNotAllowed,
    categorize_connection_error,
    validate_connection,
)

PUBLIC_IP = "93.184.216.34"


@pytest.fixture(autouse=True)
def production_defaults(monkeypatch):
    """Semua test berjalan dengan default production (privat & SQLite ditolak)."""
    monkeypatch.delenv("ALLOW_PRIVATE_DB_HOSTS", raising=False)
    monkeypatch.delenv("ALLOW_SQLITE_CONNECTION", raising=False)


def _fake_dns(monkeypatch, *ips):
    def fake_getaddrinfo(host, port, *args, **kwargs):
        return [(socket.AF_INET, socket.SOCK_STREAM, 6, "", (ip, port)) for ip in ips]

    monkeypatch.setattr(db_url_guard.socket, "getaddrinfo", fake_getaddrinfo)


def _pg(host, **kwargs):
    return DBConnection(engine="postgresql", host=host, database="app", username="u", password="p", **kwargs)


def _rejected_code(conn) -> str:
    with pytest.raises(ConnectionNotAllowed) as exc:
        validate_connection(conn)
    return exc.value.code


# ----------------------------------------------------------------
# Host non-publik ditolak
# ----------------------------------------------------------------

@pytest.mark.parametrize(
    "host",
    [
        "127.0.0.1",
        "localhost",
        "10.0.0.5",
        "172.16.0.1",
        "192.168.1.10",
        "169.254.169.254",  # cloud metadata
        "100.64.0.1",       # CGNAT / shared address space
        "0.0.0.0",
        "::1",
        "::ffff:127.0.0.1",  # IPv4-mapped IPv6
    ],
)
def test_private_and_special_hosts_rejected(host):
    assert _rejected_code(_pg(host)) == "HOST_NOT_ALLOWED"


def test_hostname_resolving_to_private_ip_rejected(monkeypatch):
    _fake_dns(monkeypatch, "10.1.2.3")
    assert _rejected_code(_pg("db.attacker.example")) == "HOST_NOT_ALLOWED"


def test_hostname_with_any_private_ip_rejected(monkeypatch):
    _fake_dns(monkeypatch, PUBLIC_IP, "127.0.0.1")
    assert _rejected_code(_pg("db.mixed.example")) == "HOST_NOT_ALLOWED"


def test_unresolvable_host_rejected(monkeypatch):
    def fail(*args, **kwargs):
        raise socket.gaierror("no such host")

    monkeypatch.setattr(db_url_guard.socket, "getaddrinfo", fail)
    assert _rejected_code(_pg("does-not-exist.example")) == "HOST_UNREACHABLE"


def test_unix_socket_host_rejected():
    conn = DBConnection(engine="postgresql", connection_string="postgresql://u:p@/app?host=/var/run/postgresql")
    assert _rejected_code(conn) in ("PARAM_NOT_ALLOWED", "HOST_NOT_ALLOWED")


# ----------------------------------------------------------------
# Driver, param, engine
# ----------------------------------------------------------------

def test_sqlite_disabled_by_default():
    conn = DBConnection(engine="sqlite", connection_string="sqlite:///data.db")
    assert _rejected_code(conn) == "SQLITE_DISABLED"


def test_sqlite_allowed_when_env_enabled(monkeypatch):
    monkeypatch.setenv("ALLOW_SQLITE_CONNECTION", "true")
    guarded = validate_connection(DBConnection(engine="sqlite", connection_string="sqlite:///data.db"))
    assert guarded.url.drivername == "sqlite"


@pytest.mark.parametrize(
    "conn_str",
    [
        "mysql+pymysql://u:p@db.example.com/app",
        "postgresql+pg8000://u:p@db.example.com/app",
        "sqlite:///etc/passwd",
    ],
)
def test_driver_must_match_engine(conn_str):
    conn = DBConnection(engine="postgresql", connection_string=conn_str)
    assert _rejected_code(conn) == "DRIVER_MISMATCH"


@pytest.mark.parametrize("param", ["sslrootcert=/etc/ssl/x", "passfile=/root/.pgpass", "options=-c%20x", "service=foo"])
def test_dangerous_query_params_rejected(param):
    conn = DBConnection(engine="postgresql", connection_string=f"postgresql://u:p@db.example.com/app?{param}")
    assert _rejected_code(conn) == "PARAM_NOT_ALLOWED"


def test_unsupported_engine_rejected():
    conn = DBConnection(engine="sqlserver", host="db.example.com", database="app")
    assert _rejected_code(conn) == "ENGINE_NOT_SUPPORTED"


def test_invalid_connection_string_rejected():
    conn = DBConnection(engine="postgresql", connection_string="not a url at all")
    assert _rejected_code(conn) == "INVALID_CONNECTION_STRING"


# ----------------------------------------------------------------
# Host publik lolos dan dikunci ke IP hasil resolve
# ----------------------------------------------------------------

def test_public_postgres_pinned_with_hostaddr(monkeypatch):
    _fake_dns(monkeypatch, PUBLIC_IP)
    guarded = validate_connection(_pg("db.example.com", port=6543))
    assert guarded.url.drivername == "postgresql+psycopg2"
    assert guarded.url.host == "db.example.com"
    assert guarded.connect_args["hostaddr"] == PUBLIC_IP
    assert guarded.connect_args["connect_timeout"] == db_url_guard.CONNECT_TIMEOUT_SECONDS


def test_public_mysql_host_replaced_by_ip_and_charset_kept(monkeypatch):
    _fake_dns(monkeypatch, PUBLIC_IP)
    conn = DBConnection(engine="mysql", host="db.example.com", database="app", username="u", password="p")
    guarded = validate_connection(conn)
    assert guarded.url.drivername == "mysql+pymysql"
    assert guarded.url.host == PUBLIC_IP
    assert guarded.url.query["charset"] == "utf8mb4"


def test_password_with_special_chars_is_not_parsed_as_host(monkeypatch):
    _fake_dns(monkeypatch, PUBLIC_IP)
    conn = _pg("db.example.com")
    conn.password = "p@ss:w/rd@127.0.0.1"
    guarded = validate_connection(conn)
    assert guarded.url.host == "db.example.com"
    assert guarded.url.password == "p@ss:w/rd@127.0.0.1"


def test_private_hosts_allowed_for_local_dev(monkeypatch):
    monkeypatch.setenv("ALLOW_PRIVATE_DB_HOSTS", "true")
    guarded = validate_connection(_pg("localhost"))
    assert guarded.url.host == "localhost"
    assert "hostaddr" not in guarded.connect_args


# ----------------------------------------------------------------
# Kategori error (anti port scanning) & integrasi
# ----------------------------------------------------------------

@pytest.mark.parametrize(
    "raw, code",
    [
        ('FATAL:  password authentication failed for user "u"', "AUTH_FAILED"),
        ("(1045, \"Access denied for user 'u'@'x'\")", "AUTH_FAILED"),
        ('FATAL:  database "app" does not exist', "DB_NOT_FOUND"),
        ("(1049, \"Unknown database 'app'\")", "DB_NOT_FOUND"),
        ("Connection refused\n\tIs the server running on host", "HOST_UNREACHABLE"),
        ("timeout expired", "HOST_UNREACHABLE"),
        ("something unexpected", "HOST_UNREACHABLE"),
    ],
)
def test_connection_errors_are_categorized(raw, code):
    assert categorize_connection_error(raw).code == code


def test_connector_rejects_metadata_ip_without_connecting():
    result = DBConnector.test_connection_sync(_pg("169.254.169.254"))
    assert result.success is False
    assert result.error_code == "HOST_NOT_ALLOWED"
    assert "169.254" not in result.message


def test_api_test_connection_blocks_private_host(client):
    payload = {"connection": {"engine": "postgresql", "host": "127.0.0.1", "database": "app"}}
    res = client.post("/api/db/test-connection", json=payload)
    assert res.status_code == 200
    body = res.json()
    assert body["success"] is False
    assert body["error_code"] == "HOST_NOT_ALLOWED"


def test_health_reports_sqlite_flag(client):
    res = client.get("/health")
    assert res.json()["features"]["sqlite_connection"] is False
