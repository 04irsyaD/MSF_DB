"""
SQLite persistence layer untuk MSF-APP Job Queue.

Modul ini menyimpan snapshot status job ke SQLite sehingga
data tidak hilang saat backend restart. File DB disimpan di
OUTPUT_DIR (sama dengan output .docx) agar ikut di-persist oleh
Docker volume.

Desain:
- Semua operasi DB berjalan di thread terpisah via asyncio.to_thread()
  agar tidak memblokir event loop async FastAPI.
- sqlite3 dipakai (built-in Python) — tidak ada dependency tambahan.
- Hanya menyimpan metadata job (status, progress, timestamps, dll),
  BUKAN blob file DOCX (file tetap di disk OUTPUT_DIR).
"""

import sqlite3
import os
import json
from typing import Optional
from datetime import datetime, timezone

DB_PATH = os.path.join(
    os.getenv("OUTPUT_DIR", os.path.join(os.path.dirname(__file__), "..", "..", "..", "data")),
    "msf_jobs.db",
)


def _get_conn() -> sqlite3.Connection:
    """Buka koneksi SQLite dengan row_factory untuk kemudahan akses kolom."""
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    """
    Inisialisasi schema tabel jobs. Dipanggil saat startup.
    Aman dijalankan berulang kali (CREATE TABLE IF NOT EXISTS).
    """
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    with _get_conn() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS jobs (
                job_id          TEXT PRIMARY KEY,
                project_name    TEXT,
                access_code     TEXT,
                status          TEXT,
                progress        INTEGER DEFAULT 0,
                tables_total    INTEGER DEFAULT 0,
                tables_processed INTEGER DEFAULT 0,
                current_table   TEXT,
                error_message   TEXT,
                preview_markdown TEXT,
                result_filepath TEXT,
                result_filename TEXT,
                output_format   TEXT DEFAULT 'docx',
                ai_provider     TEXT,
                db_engine       TEXT,
                created_at      TEXT,
                updated_at      TEXT,
                completed_at    TEXT
            )
        """)
        conn.execute("CREATE INDEX IF NOT EXISTS idx_jobs_access_code ON jobs(access_code)")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status)")
        conn.commit()


def upsert_job(job_data: dict) -> None:
    """
    Insert atau update (upsert) satu baris job.
    Dipanggil setiap kali Job.update() mengubah status.
    """
    with _get_conn() as conn:
        conn.execute("""
            INSERT INTO jobs (
                job_id, project_name, access_code, status, progress,
                tables_total, tables_processed, current_table,
                error_message, preview_markdown, result_filepath,
                result_filename, output_format, ai_provider, db_engine,
                created_at, updated_at, completed_at
            ) VALUES (
                :job_id, :project_name, :access_code, :status, :progress,
                :tables_total, :tables_processed, :current_table,
                :error_message, :preview_markdown, :result_filepath,
                :result_filename, :output_format, :ai_provider, :db_engine,
                :created_at, :updated_at, :completed_at
            )
            ON CONFLICT(job_id) DO UPDATE SET
                status           = excluded.status,
                progress         = excluded.progress,
                tables_total     = excluded.tables_total,
                tables_processed = excluded.tables_processed,
                current_table    = excluded.current_table,
                error_message    = excluded.error_message,
                preview_markdown = excluded.preview_markdown,
                result_filepath  = excluded.result_filepath,
                result_filename  = excluded.result_filename,
                output_format    = excluded.output_format,
                ai_provider      = excluded.ai_provider,
                db_engine        = excluded.db_engine,
                updated_at       = excluded.updated_at,
                completed_at     = excluded.completed_at
        """, job_data)
        conn.commit()


def get_job_row(job_id: str) -> Optional[dict]:
    """Ambil satu job dari DB. Return None jika tidak ditemukan."""
    with _get_conn() as conn:
        row = conn.execute("SELECT * FROM jobs WHERE job_id = ?", (job_id,)).fetchone()
        return dict(row) if row else None


def get_inflight_jobs() -> list[dict]:
    """
    Ambil semua job dengan status queued/processing.
    Dipakai saat startup untuk me-restore job yang sedang berjalan.
    """
    with _get_conn() as conn:
        rows = conn.execute(
            "SELECT * FROM jobs WHERE status IN ('queued', 'processing')"
        ).fetchall()
        return [dict(row) for row in rows]


def delete_job_row(job_id: str) -> None:
    """Hapus baris job dari DB. Dipanggil saat job dihapus dari queue."""
    with _get_conn() as conn:
        conn.execute("DELETE FROM jobs WHERE job_id = ?", (job_id,))
        conn.commit()
