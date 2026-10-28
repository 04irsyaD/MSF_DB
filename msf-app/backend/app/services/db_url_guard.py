"""
Guard koneksi database live (anti-SSRF).

Semua koneksi ke database milik user WAJIB lewat `validate_connection()`
sebelum `create_engine()`. Guard ini:
- hanya mengizinkan driver yang cocok dengan engine yang dipilih,
- hanya mengizinkan query param aman (tidak bisa baca file server),
- menolak host yang resolve ke IP non-publik (loopback, privat,
  link-local/cloud metadata, reserved, multicast),
- mengunci koneksi ke IP hasil resolve (anti DNS-rebinding),
- menonaktifkan SQLite live kecuali diizinkan lewat env.

Env:
- ALLOW_PRIVATE_DB_HOSTS  (default false) — true hanya untuk dev lokal/docker.
- ALLOW_SQLITE_CONNECTION (default false) — true hanya untuk dev lokal.
"""

import hashlib
import hmac
import ipaddress
import os
import secrets
import socket
from dataclasses import dataclass, field
from typing import Any, Dict, List

from sqlalchemy.engine import URL, make_url
from sqlalchemy.exc import ArgumentError

from app.models.schemas import DBConnection

CONNECT_TIMEOUT_SECONDS = 10

DEFAULT_PORTS = {
    "postgresql": 5432,
    "mysql": 3306,
}

# Driver yang diizinkan per engine, dipetakan ke driver yang dipakai backend.
DRIVER_MAP = {
    "postgresql": {"postgresql": "postgresql+psycopg2", "postgresql+psycopg2": "postgresql+psycopg2"},
    "mysql": {"mysql": "mysql+pymysql", "mysql+pymysql": "mysql+pymysql"},
    "sqlite": {"sqlite": "sqlite"},
}

ALLOWED_QUERY_PARAMS = {"sslmode", "charset", "connect_timeout"}


class ConnectionNotAllowed(ValueError):
    """Koneksi ditolak guard. `message` aman ditampilkan ke user."""

    def __init__(self, code: str, message: str):
        super().__init__(message)
        self.code = code
        self.message = message


@dataclass
class GuardedConnection:
    """Hasil validasi: URL final dan connect_args untuk create_engine()."""

    url: URL
    connect_args: Dict[str, Any] = field(default_factory=dict)


def _env_flag(name: str) -> bool:
    return os.getenv(name, "false").strip().lower() in ("1", "true", "yes")


def sqlite_connection_enabled() -> bool:
    return _env_flag("ALLOW_SQLITE_CONNECTION")


def private_hosts_allowed() -> bool:
    return _env_flag("ALLOW_PRIVATE_DB_HOSTS")


def _build_url(conn: DBConnection) -> URL:
    """Parse connection string atau rakit URL dari form manual."""
    if conn.connection_string and conn.connection_string.strip():
        try:
            return make_url(conn.connection_string.strip())
        except (ArgumentError, ValueError):
            raise ConnectionNotAllowed(
                "INVALID_CONNECTION_STRING", "Format connection string tidak valid."
            )

    if conn.engine == "sqlite":
        return URL.create("sqlite", database=conn.database)

    return URL.create(
        drivername=conn.engine,
        username=conn.username or None,
        password=conn.password or None,
        host=conn.host,
        port=conn.port,
        database=conn.database,
    )


_FINGERPRINT_KEY = secrets.token_bytes(32)


def target_fingerprint(conn: DBConnection) -> str:
    """
    Sidik tujuan koneksi (engine, host, port, database, user) untuk lockout dan log.

    HMAC dengan kunci acak per proses: log tidak bisa dibalik jadi nama host,
    dan sidik yang sama hanya bermakna selama proses berjalan.
    """
    try:
        url = _build_url(conn)
        parts = [conn.engine, url.host or "", str(url.port or ""), url.database or "", url.username or ""]
    except ConnectionNotAllowed:
        parts = [conn.engine, conn.connection_string or ""]
    raw = "\x00".join(parts).lower().encode()
    return hmac.new(_FINGERPRINT_KEY, raw, hashlib.sha256).hexdigest()[:16]


def _is_public_ip(raw_ip: str) -> bool:
    ip = ipaddress.ip_address(raw_ip.split("%", 1)[0])
    if isinstance(ip, ipaddress.IPv6Address) and ip.ipv4_mapped:
        ip = ip.ipv4_mapped
    return ip.is_global and not ip.is_multicast


def _resolve_public_ip(host: str, port: int) -> str:
    """Resolve host; tolak kalau ada satu pun IP yang bukan publik."""
    try:
        infos = socket.getaddrinfo(host, port, type=socket.SOCK_STREAM)
    except (socket.gaierror, UnicodeError, OSError):
        raise ConnectionNotAllowed(
            "HOST_UNREACHABLE",
            "Server database tidak dapat dihubungi. Periksa host dan port.",
        )

    addresses: List[str] = [info[4][0] for info in infos]
    if not addresses or not all(_is_public_ip(a) for a in addresses):
        raise ConnectionNotAllowed(
            "HOST_NOT_ALLOWED",
            "Host database tidak diizinkan. Gunakan host yang dapat diakses publik.",
        )
    return addresses[0]


def validate_connection(conn: DBConnection) -> GuardedConnection:
    """Validasi koneksi user dan kembalikan URL + connect_args yang aman."""
    engine = conn.engine
    if engine not in DRIVER_MAP:
        raise ConnectionNotAllowed(
            "ENGINE_NOT_SUPPORTED", "Engine database ini belum didukung untuk koneksi langsung."
        )
    if engine == "sqlite" and not sqlite_connection_enabled():
        raise ConnectionNotAllowed(
            "SQLITE_DISABLED",
            "Koneksi SQLite langsung tidak tersedia di server ini. Gunakan mode Paste DDL.",
        )

    url = _build_url(conn)

    driver = DRIVER_MAP[engine].get(url.drivername)
    if driver is None:
        raise ConnectionNotAllowed(
            "DRIVER_MISMATCH", "Jenis connection string tidak cocok dengan engine yang dipilih."
        )
    url = url.set(drivername=driver)

    if engine == "sqlite":
        return GuardedConnection(url=url)

    unknown_params = set(url.query) - ALLOWED_QUERY_PARAMS
    if unknown_params:
        raise ConnectionNotAllowed(
            "PARAM_NOT_ALLOWED",
            "Parameter connection string tidak diizinkan: " + ", ".join(sorted(unknown_params)),
        )

    if engine == "mysql" and "charset" not in url.query:
        url = url.update_query_dict({"charset": "utf8mb4"})

    host = (url.host or "").strip()
    if not host or host.startswith("/") or "," in host:
        raise ConnectionNotAllowed("HOST_NOT_ALLOWED", "Host database wajib diisi dengan hostname atau IP.")

    connect_args: Dict[str, Any] = {"connect_timeout": CONNECT_TIMEOUT_SECONDS}
    if private_hosts_allowed():
        return GuardedConnection(url=url, connect_args=connect_args)

    port = url.port or DEFAULT_PORTS[engine]
    ip = _resolve_public_ip(host, port)

    # Kunci ke IP hasil resolve supaya DNS tidak bisa diganti setelah validasi.
    if engine == "postgresql":
        connect_args["hostaddr"] = ip
    else:
        url = url.set(host=ip)
    return GuardedConnection(url=url, connect_args=connect_args)


# Pola error driver -> kategori umum. Refused/timeout/DNS sengaja digabung
# menjadi HOST_UNREACHABLE supaya endpoint tidak bisa dipakai port scanning.
_ERROR_CATEGORIES = [
    (
        "AUTH_FAILED",
        "Autentikasi gagal. Periksa username dan password.",
        ("password authentication failed", "no password supplied", "access denied", "(1045", "role \""),
    ),
    (
        "DB_NOT_FOUND",
        "Database tidak ditemukan. Periksa nama database.",
        ("does not exist", "unknown database", "(1049"),
    ),
]

_UNREACHABLE = (
    "HOST_UNREACHABLE",
    "Server database tidak dapat dihubungi. Periksa host, port, dan pastikan database dapat diakses dari internet.",
)


def categorize_connection_error(error_msg: str) -> ConnectionNotAllowed:
    """Ubah pesan error mentah driver menjadi kategori yang aman untuk user."""
    lowered = error_msg.lower()
    for code, message, patterns in _ERROR_CATEGORIES:
        if any(p in lowered for p in patterns):
            return ConnectionNotAllowed(code, message)
    return ConnectionNotAllowed(*_UNREACHABLE)
