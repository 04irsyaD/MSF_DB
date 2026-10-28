"""
Katalog PostgreSQL untuk Schema Compare (koneksi langsung).

Hanya membaca pg_catalog — struktur tabel, kolom, constraint, dan index.
TIDAK PERNAH ada SELECT ke tabel milik user, termasuk COUNT(*) dan tabel
migrasi. Semua query tetap (tidak ada SQL dari user); nilai jadi parameter.

Baris mentah dikembalikan apa adanya. Frontend menyusunnya jadi snapshot
dengan `core/catalog.ts` yang sama dengan CLI db-schema-compare, jadi query
di sini harus tetap setara dengan `src/adapters/postgres.ts` di repo itu.

Lapisan pengaman:
- guard anti-SSRF (`validate_connection`),
- transaksi READ ONLY + statement_timeout (SET LOCAL, aman untuk pooler),
- tanpa connection pool, koneksi ditutup setelah selesai,
- kredensial tidak disimpan dan tidak dilog.
"""

from typing import Any, Dict, List

import structlog
from sqlalchemy import create_engine, text
from sqlalchemy.engine import Connection
from sqlalchemy.exc import DBAPIError
from sqlalchemy.pool import NullPool

from app.models.schemas import DBConnection
from app.services.db_url_guard import (
    ConnectionNotAllowed,
    categorize_connection_error,
    validate_connection,
)

logger = structlog.get_logger()

STATEMENT_TIMEOUT = "15s"
READABLE_SAMPLE_SIZE = 10


class CatalogError(Exception):
    """Gagal membaca katalog setelah terhubung. `message` aman ditampilkan ke user."""

    def __init__(self, code: str, message: str):
        super().__init__(message)
        self.code = code
        self.message = message


_SCHEMA_SQL = "SELECT oid::text AS oid FROM pg_catalog.pg_namespace WHERE nspname = :schema"

_VERSION_SQL = """
SELECT current_setting('server_version') AS version,
       current_setting('server_version_num')::int AS version_num
"""

# Tabel biasa dan induk partisi; partisi anak dilewati.
_TABLES_SQL = """
SELECT c.oid::text AS oid, c.relname AS name
  FROM pg_catalog.pg_class c
 WHERE c.relnamespace = CAST(:ns AS oid) AND c.relkind IN ('r', 'p') AND NOT c.relispartition
 ORDER BY c.relname
"""

_TABLE_FILTER = """
  JOIN pg_catalog.pg_class t ON t.oid = {rel}
 WHERE t.relnamespace = CAST(:ns AS oid) AND t.relkind IN ('r', 'p') AND NOT t.relispartition
"""

_COLUMNS_SQL = """
SELECT a.attrelid::text AS table_oid,
       a.attname AS name,
       a.attnum::int AS position,
       pg_catalog.format_type(a.atttypid, a.atttypmod) AS type,
       a.attnotnull AS not_null,
       a.attidentity::text AS identity,
       pg_catalog.pg_get_expr(d.adbin, d.adrelid) AS default_expr
  FROM pg_catalog.pg_attribute a
  LEFT JOIN pg_catalog.pg_attrdef d ON d.adrelid = a.attrelid AND d.adnum = a.attnum
""" + _TABLE_FILTER.format(rel="a.attrelid") + """
   AND a.attnum > 0 AND NOT a.attisdropped
 ORDER BY a.attrelid, a.attnum
"""

_CONSTRAINTS_SQL = """
SELECT con.conrelid::text AS table_oid,
       con.conname AS name,
       con.contype::text AS type,
       (SELECT array_agg(a.attname ORDER BY k.ord)
          FROM unnest(con.conkey) WITH ORDINALITY AS k(attnum, ord)
          JOIN pg_catalog.pg_attribute a ON a.attrelid = con.conrelid AND a.attnum = k.attnum)::text[] AS columns,
       ref_ns.nspname AS ref_schema,
       ref.relname AS ref_table,
       (SELECT array_agg(a.attname ORDER BY k.ord)
          FROM unnest(con.confkey) WITH ORDINALITY AS k(attnum, ord)
          JOIN pg_catalog.pg_attribute a ON a.attrelid = con.confrelid AND a.attnum = k.attnum)::text[] AS ref_columns,
       con.confdeltype::text AS on_delete,
       con.confupdtype::text AS on_update
  FROM pg_catalog.pg_constraint con
  LEFT JOIN pg_catalog.pg_class ref ON ref.oid = con.confrelid
  LEFT JOIN pg_catalog.pg_namespace ref_ns ON ref_ns.oid = ref.relnamespace
""" + _TABLE_FILTER.format(rel="con.conrelid") + """
   AND con.contype IN ('p', 'f')
 ORDER BY con.conrelid, con.conname
"""

# pg_get_indexdef per kolom juga menangani index ekspresi.
_INDEXES_SQL = """
SELECT i.indrelid::text AS table_oid,
       ic.relname AS name,
       i.indisunique AS is_unique,
       i.indisprimary AS is_primary,
       am.amname AS method,
       (SELECT array_agg(pg_catalog.pg_get_indexdef(i.indexrelid, k.ord, true) ORDER BY k.ord)
          FROM generate_series(1, i.indnkeyatts) AS k(ord))::text[] AS columns,
       pg_catalog.pg_get_expr(i.indpred, i.indrelid) AS predicate
  FROM pg_catalog.pg_index i
  JOIN pg_catalog.pg_class ic ON ic.oid = i.indexrelid
  JOIN pg_catalog.pg_am am ON am.oid = ic.relam
""" + _TABLE_FILTER.format(rel="i.indrelid") + """
   AND i.indisvalid
 ORDER BY i.indrelid, ic.relname
"""

# Hak akses role, untuk memperingatkan user kalau akunnya bisa membaca isi tabel.
# Fungsi has_* hanya memeriksa ACL; isi tabel tidak disentuh.
_ROLE_SQL = "SELECT current_user AS role, rolsuper AS is_superuser FROM pg_catalog.pg_roles WHERE rolname = current_user"

_READABLE_SQL = """
SELECT c.relname AS name
  FROM pg_catalog.pg_class c
 WHERE c.relnamespace = CAST(:ns AS oid) AND c.relkind IN ('r', 'p', 'v', 'm', 'f')
   AND pg_catalog.has_any_column_privilege(c.oid, 'SELECT')
 ORDER BY c.relname
"""


def _rows(db: Connection, sql: str, **params: Any) -> List[Dict[str, Any]]:
    return [dict(row._mapping) for row in db.execute(text(sql), params)]


def _read(db: Connection, schema: str) -> Dict[str, Any]:
    db.execute(text("SET TRANSACTION READ ONLY"))
    db.execute(text(f"SET LOCAL statement_timeout = '{STATEMENT_TIMEOUT}'"))

    schema_rows = _rows(db, _SCHEMA_SQL, schema=schema)
    if not schema_rows:
        raise CatalogError("SCHEMA_NOT_FOUND", "Schema tidak ditemukan di database ini.")
    ns = schema_rows[0]["oid"]

    version = _rows(db, _VERSION_SQL)[0]
    role = _rows(db, _ROLE_SQL)
    readable = [row["name"] for row in _rows(db, _READABLE_SQL, ns=ns)]

    return {
        "catalog": {
            "server_version": version["version"],
            "server_version_num": version["version_num"],
            "tables": _rows(db, _TABLES_SQL, ns=ns),
            "columns": _rows(db, _COLUMNS_SQL, ns=ns),
            "constraints": _rows(db, _CONSTRAINTS_SQL, ns=ns),
            "indexes": _rows(db, _INDEXES_SQL, ns=ns),
        },
        "access": {
            "role": role[0]["role"] if role else None,
            "is_superuser": bool(role and role[0]["is_superuser"]),
            "readable_count": len(readable),
            "readable_sample": readable[:READABLE_SAMPLE_SIZE],
        },
    }


def fetch_catalog(conn: DBConnection) -> Dict[str, Any]:
    """
    Baca katalog satu schema PostgreSQL (blocking).

    Raise `ConnectionNotAllowed` (ditolak guard / gagal konek) atau `CatalogError`.
    """
    if conn.engine != "postgresql":
        raise ConnectionNotAllowed(
            "ENGINE_NOT_SUPPORTED", "Koneksi langsung Schema Compare baru mendukung PostgreSQL."
        )
    schema = (conn.schema_name or "").strip() or "public"

    guarded = validate_connection(conn)
    connect_args = {**guarded.connect_args, "application_name": "msf-db-schema-compare"}
    engine = create_engine(guarded.url, connect_args=connect_args, poolclass=NullPool)

    connected = False
    try:
        with engine.connect() as db:
            connected = True
            try:
                result = _read(db, schema)
            finally:
                db.rollback()
    except (CatalogError, ConnectionNotAllowed):
        raise
    except DBAPIError as e:
        message = str(e.orig) if e.orig is not None else str(e)
        if not connected:
            raise categorize_connection_error(message)
        if "statement timeout" in message.lower():
            raise CatalogError("CATALOG_TIMEOUT", "Membaca katalog melebihi batas waktu. Coba lagi nanti.")
        # Pesan driver bisa memuat nama objek; detailnya cukup di log tanpa kredensial.
        logger.warning("Gagal membaca katalog", error_type=type(e.orig).__name__)
        raise CatalogError("CATALOG_FAILED", "Katalog database tidak bisa dibaca.")
    finally:
        engine.dispose()

    result["database"] = guarded.url.database or ""
    result["schema"] = schema
    return result
