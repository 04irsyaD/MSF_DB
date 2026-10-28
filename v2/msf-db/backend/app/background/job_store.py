"""
JobStore — penyimpanan metadata job persisten berbasis SQLite.

Batas tanggung jawab: JobStore hanya membaca dan menulis baris job.
Ia TIDAK menjalankan job, TIDAK menghapus berkas hasil dari disk, dan TIDAK
mengetahui HTTP. Penghapusan berkas adalah tanggung jawab JobQueue.
"""

import os
import sqlite3
import threading
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List, Optional, Tuple

SCHEMA_VERSION = 1

RESTART_ERROR_MESSAGE = "Pekerjaan terhenti karena server dimulai ulang."

COLUMNS: Tuple[str, ...] = (
    "job_id",
    "access_code",
    "project_name",
    "status",
    "progress",
    "tables_total",
    "tables_processed",
    "current_table",
    "created_at",
    "updated_at",
    "completed_at",
    "error_message",
    "preview_markdown",
    "result_filepath",
    "result_filename",
    "output_format",
    "ai_provider",
    "db_engine",
    "file_purged",
)

_SCHEMA_SQL = """
PRAGMA journal_mode = WAL;

CREATE TABLE IF NOT EXISTS jobs (
    job_id           TEXT PRIMARY KEY,
    access_code      TEXT NOT NULL,
    project_name     TEXT NOT NULL,
    status           TEXT NOT NULL,
    progress         INTEGER NOT NULL DEFAULT 0,
    tables_total     INTEGER NOT NULL DEFAULT 0,
    tables_processed INTEGER NOT NULL DEFAULT 0,
    current_table    TEXT,
    created_at       TEXT NOT NULL,
    updated_at       TEXT NOT NULL,
    completed_at     TEXT,
    error_message    TEXT,
    preview_markdown TEXT,
    result_filepath  TEXT,
    result_filename  TEXT,
    output_format    TEXT NOT NULL DEFAULT 'docx',
    ai_provider      TEXT,
    db_engine        TEXT,
    file_purged      INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_jobs_access_code ON jobs(access_code);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at  ON jobs(created_at);
CREATE INDEX IF NOT EXISTS idx_jobs_status      ON jobs(status);
"""


class JobStore:
    """Penyimpanan baris job. Aman dipakai lintas thread lewat satu lock."""

    def __init__(self, db_path: Optional[str] = None) -> None:
        self.db_path = db_path or os.getenv("JOBS_DB_PATH", "/app/outputs/jobs.db")
        directory = os.path.dirname(self.db_path)
        if directory:
            os.makedirs(directory, exist_ok=True)

        self._lock = threading.Lock()
        self._conn = sqlite3.connect(self.db_path, check_same_thread=False)
        self._conn.row_factory = sqlite3.Row
        self._init_schema()

    def _init_schema(self) -> None:
        with self._lock:
            self._conn.executescript(_SCHEMA_SQL)
            current = self._conn.execute("PRAGMA user_version").fetchone()[0]
            if current > SCHEMA_VERSION:
                raise RuntimeError(
                    f"Basis data job memakai skema versi {current}, "
                    f"sedangkan kode ini hanya mendukung versi {SCHEMA_VERSION}."
                )
            self._conn.execute(f"PRAGMA user_version = {SCHEMA_VERSION}")
            self._conn.commit()

    def save(self, row: Dict[str, Any]) -> None:
        """Simpan atau timpa satu baris job."""
        kolom = ", ".join(COLUMNS)
        placeholder = ", ".join(f":{c}" for c in COLUMNS)
        data = {c: row.get(c) for c in COLUMNS}
        with self._lock:
            self._conn.execute(
                f"INSERT OR REPLACE INTO jobs ({kolom}) VALUES ({placeholder})", data
            )
            self._conn.commit()

    def get(self, job_id: str) -> Optional[Dict[str, Any]]:
        with self._lock:
            row = self._conn.execute(
                "SELECT * FROM jobs WHERE job_id = :job_id", {"job_id": job_id}
            ).fetchone()
        return dict(row) if row else None

    def get_by_access_code(self, access_code: str) -> Optional[Dict[str, Any]]:
        with self._lock:
            row = self._conn.execute(
                "SELECT * FROM jobs WHERE access_code = :code "
                "ORDER BY created_at DESC LIMIT 1",
                {"code": access_code},
            ).fetchone()
        return dict(row) if row else None

    def query(self, limit: int = 500) -> List[Dict[str, Any]]:
        """Seluruh baris, terbaru dahulu. Dipakai Admin Portal."""
        with self._lock:
            rows = self._conn.execute(
                "SELECT * FROM jobs ORDER BY created_at DESC LIMIT :limit",
                {"limit": limit},
            ).fetchall()
        return [dict(r) for r in rows]

    def list_hydratable(self) -> List[Dict[str, Any]]:
        """Baris yang layak dimuat kembali ke memori saat startup."""
        with self._lock:
            rows = self._conn.execute(
                "SELECT * FROM jobs WHERE file_purged = 0 ORDER BY created_at DESC"
            ).fetchall()
        return [dict(r) for r in rows]

    def delete(self, job_id: str) -> bool:
        with self._lock:
            cur = self._conn.execute(
                "DELETE FROM jobs WHERE job_id = :job_id", {"job_id": job_id}
            )
            self._conn.commit()
            return cur.rowcount > 0

    def reconcile_orphans(self) -> int:
        """
        Tandai job yang masih queued/processing sebagai error.

        Wajib dijalankan saat startup sebelum melayani request: tanpa ini job
        yatim mengisi gerbang MAX_CONCURRENT_JOBS secara permanen.
        """
        now = datetime.now(timezone.utc).isoformat()
        with self._lock:
            cur = self._conn.execute(
                """
                UPDATE jobs
                   SET status = 'error',
                       error_message = :message,
                       completed_at = :now,
                       updated_at = :now
                 WHERE status IN ('queued', 'processing')
                """,
                {"message": RESTART_ERROR_MESSAGE, "now": now},
            )
            self._conn.commit()
            return cur.rowcount

    def list_purgeable_files(self, max_age_minutes: int) -> List[Tuple[str, str]]:
        """Pasangan (job_id, filepath) untuk berkas yang sudah melewati retensi."""
        cutoff = (
            datetime.now(timezone.utc) - timedelta(minutes=max_age_minutes)
        ).isoformat()
        with self._lock:
            rows = self._conn.execute(
                """
                SELECT job_id, result_filepath FROM jobs
                 WHERE file_purged = 0
                   AND result_filepath IS NOT NULL
                   AND completed_at IS NOT NULL
                   AND completed_at < :cutoff
                 ORDER BY completed_at ASC
                """,
                {"cutoff": cutoff},
            ).fetchall()
        return [(r["job_id"], r["result_filepath"]) for r in rows]

    def mark_file_purged(self, job_id: str) -> None:
        """Tandai berkas sudah dihapus. Baris riwayatnya sengaja dipertahankan."""
        now = datetime.now(timezone.utc).isoformat()
        with self._lock:
            self._conn.execute(
                """
                UPDATE jobs
                   SET file_purged = 1,
                       result_filepath = NULL,
                       updated_at = :now
                 WHERE job_id = :job_id
                """,
                {"job_id": job_id, "now": now},
            )
            self._conn.commit()

    def purge_expired_records(self, retention_days: int) -> int:
        cutoff = (
            datetime.now(timezone.utc) - timedelta(days=retention_days)
        ).isoformat()
        with self._lock:
            cur = self._conn.execute(
                "DELETE FROM jobs WHERE created_at < :cutoff", {"cutoff": cutoff}
            )
            self._conn.commit()
            return cur.rowcount

    def close(self) -> None:
        with self._lock:
            self._conn.close()
