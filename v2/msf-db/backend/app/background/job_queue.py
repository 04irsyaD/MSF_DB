"""
Background job queue untuk MSF-DB.

Job aktif hidup di memori agar cepat, dan setiap perubahannya ikut ditulis ke
JobStore (SQLite) supaya riwayat dan kode akses selamat dari restart backend.
"""

import asyncio
import os
import tempfile
import uuid
import secrets
from datetime import datetime, timezone
from typing import Dict, Optional, Callable
from app.background.job_store import JobStore
from app.models.schemas import JobStatus

OUTPUT_DIR = os.getenv("OUTPUT_DIR", tempfile.gettempdir())
if OUTPUT_DIR != tempfile.gettempdir():
    os.makedirs(OUTPUT_DIR, exist_ok=True)


class Job:
    def __init__(
        self,
        job_id: str,
        project_name: str = "Database Documentation",
        on_change: Optional[Callable[["Job"], None]] = None,
    ):
        self.job_id = job_id
        self.project_name = project_name
        self.status: JobStatus = JobStatus.QUEUED
        self.progress: int = 0
        self.tables_total: int = 0
        self.tables_processed: int = 0
        self.current_table: Optional[str] = None
        self.created_at: str = datetime.now(timezone.utc).isoformat()
        self.updated_at: str = datetime.now(timezone.utc).isoformat()
        self.completed_at: Optional[str] = None
        self.error_message: Optional[str] = None
        self.preview_markdown: Optional[str] = None
        self.result_filepath: Optional[str] = None       # Path file DOCX/PDF di disk
        self.result_filename: Optional[str] = None       # Nama file untuk download
        self.output_format: str = "docx"
        self.ai_provider: Optional[str] = None           # Tracking untuk statistik admin
        self.db_engine: Optional[str] = None             # Tracking untuk statistik admin
        self.access_code: str = f"MSF-{secrets.token_hex(5).upper()}" # Kode pelacakan unik untuk user
        self.file_purged: bool = False                   # True bila berkas sudah dihapus penyapu
        self._on_change = on_change

    def to_dict(self) -> dict:
        download_url = None
        if self.status == JobStatus.DONE and self.result_filepath and os.path.exists(self.result_filepath):
            download_url = f"/api/jobs/{self.job_id}/download"

        return {
            "job_id": self.job_id,
            "status": self.status,
            "progress": self.progress,
            "tables_total": self.tables_total,
            "tables_processed": self.tables_processed,
            "current_table": self.current_table,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "completed_at": self.completed_at,
            "error_message": self.error_message,
            "preview_markdown": self.preview_markdown,
            "download_url": download_url,
            "project_name": self.project_name,
            "ai_provider": self.ai_provider,
            "db_engine": self.db_engine,
            "access_code": self.access_code,
        }

    def to_row(self) -> dict:
        """Bentuk baris untuk JobStore. Hanya metadata, tidak pernah isi berkas."""
        status = self.status.value if hasattr(self.status, "value") else str(self.status)
        return {
            "job_id": self.job_id,
            "access_code": self.access_code,
            "project_name": self.project_name,
            "status": status,
            "progress": self.progress,
            "tables_total": self.tables_total,
            "tables_processed": self.tables_processed,
            "current_table": self.current_table,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "completed_at": self.completed_at,
            "error_message": self.error_message,
            "preview_markdown": self.preview_markdown,
            "result_filepath": self.result_filepath,
            "result_filename": self.result_filename,
            "output_format": self.output_format,
            "ai_provider": self.ai_provider,
            "db_engine": self.db_engine,
            "file_purged": 1 if self.file_purged else 0,
        }

    @classmethod
    def from_row(cls, row: dict) -> "Job":
        """
        Bangun Job dari baris basis data sebagai snapshot BACA-SAJA.

        on_change sengaja dibiarkan None: job hasil hidrasi tidak boleh menulis
        balik ke store. Aman karena hanya job queued/processing yang dimutasi,
        dan job seperti itu selalu ada di memori setelah rehidrasi.
        """
        job = cls(job_id=row["job_id"], project_name=row["project_name"])
        job.status = row["status"]
        job.progress = row["progress"]
        job.tables_total = row["tables_total"]
        job.tables_processed = row["tables_processed"]
        job.current_table = row["current_table"]
        job.created_at = row["created_at"]
        job.updated_at = row["updated_at"]
        job.completed_at = row["completed_at"]
        job.error_message = row["error_message"]
        job.preview_markdown = row["preview_markdown"]
        job.result_filepath = row["result_filepath"]
        job.result_filename = row["result_filename"]
        job.output_format = row["output_format"]
        job.ai_provider = row["ai_provider"]
        job.db_engine = row["db_engine"]
        job.access_code = row["access_code"]
        job.file_purged = bool(row["file_purged"])
        return job

    def update(self, **kwargs):
        # Intercept result_bytes dan simpan ke disk
        if "result_bytes" in kwargs:
            res_bytes = kwargs.pop("result_bytes")
            if res_bytes is not None:
                try:
                    fmt = kwargs.get("output_format", self.output_format)
                    filepath = os.path.join(OUTPUT_DIR, f"msf_doc_{self.job_id}.{fmt}")
                    with open(filepath, "wb") as f:
                        f.write(res_bytes)
                    self.result_filepath = filepath
                except Exception as e:
                    import structlog
                    _log = structlog.get_logger()
                    _log.error("Gagal menyimpan file hasil generate ke disk", job_id=self.job_id, error=str(e))
                    self.error_message = f"Gagal menyimpan file: {str(e)}"
                    self.status = JobStatus.ERROR

        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
        self.updated_at = datetime.now(timezone.utc).isoformat()

        if self._on_change is not None:
            self._on_change(self)

    def cleanup_file(self):
        """Hapus file dari disk jika ada"""
        if self.result_filepath and os.path.exists(self.result_filepath):
            try:
                os.remove(self.result_filepath)
            except Exception:
                pass


class JobQueue:
    """
    Job queue dengan memori sebagai lapisan cepat dan SQLite sebagai
    penyimpanan tahan restart.
    """

    def __init__(
        self,
        max_retention_minutes: Optional[int] = None,
        store: Optional[JobStore] = None,
    ):
        self._jobs: Dict[str, Job] = {}
        self._max_retention_minutes = (
            max_retention_minutes
            if max_retention_minutes is not None
            else int(os.getenv("MAX_JOB_RETENTION_MINUTES", "60"))
        )
        self._record_retention_days = int(os.getenv("JOB_RECORD_RETENTION_DAYS", "30"))
        self._lock = asyncio.Lock()
        self._store = store if store is not None else JobStore()

    @property
    def store(self) -> JobStore:
        return self._store

    def _persist(self, job: Job) -> None:
        self._store.save(job.to_row())

    def recover(self) -> int:
        """
        Pulihkan keadaan dari basis data saat startup.

        Job yang tertinggal queued/processing ditandai error, lalu job yang
        berkasnya masih ada dimuat kembali ke memori sebagai snapshot baca-saja.
        Mengembalikan jumlah job yatim yang ditandai error.
        """
        orphans = self._store.reconcile_orphans()
        for row in self._store.list_hydratable():
            job = Job.from_row(row)
            self._jobs[job.job_id] = job
        return orphans

    def create_job(self, project_name: str = "Database Documentation") -> Job:
        """Buat job baru, simpan baris awalnya, dan return job object"""
        job_id = str(uuid.uuid4())
        job = Job(job_id=job_id, project_name=project_name, on_change=self._persist)
        self._jobs[job_id] = job
        self._persist(job)
        return job

    def get_job(self, job_id: str) -> Optional[Job]:
        """Ambil job dari memori; bila tidak ada, cari di basis data"""
        job = self._jobs.get(job_id)
        if job is not None:
            return job
        row = self._store.get(job_id)
        return Job.from_row(row) if row else None

    def get_job_by_access_code(self, access_code: str) -> Optional[Job]:
        """Ambil job berdasarkan kode akses; memori dulu, lalu basis data"""
        for job in self._jobs.values():
            if job.access_code == access_code:
                return job
        row = self._store.get_by_access_code(access_code)
        return Job.from_row(row) if row else None

    def list_jobs(self) -> list[dict]:
        """
        List job yang ada di MEMORI saja.

        Sengaja tidak menyentuh basis data: gerbang MAX_CONCURRENT_JOBS
        dihitung dari sini, dan menghitungnya dari riwayat penuh akan membuat
        job yatim mengunci fitur generate secara permanen.
        """
        return [job.to_dict() for job in self._jobs.values()]

    def delete_job(self, job_id: str) -> bool:
        """Hapus job dari memori dan basis data, berikut filenya"""
        job = self._jobs.pop(job_id, None)
        if job is not None:
            job.cleanup_file()
        terhapus_di_store = self._store.delete(job_id)
        return terhapus_di_store or job is not None

    def close(self) -> None:
        self._store.close()

    async def cancel_job(self, job_id: str) -> bool:
        """Batalkan job yang sedang berjalan atau mengantre (thread-safe)"""
        async with self._lock:
            job = self.get_job(job_id)
            if job and job.status in (JobStatus.QUEUED, JobStatus.PROCESSING):
                job.update(status=JobStatus.CANCELLED)
                return True
            return False

    async def run_job(
        self,
        job: Job,
        task_fn: Callable,
        *args,
        **kwargs
    ):
        """
        Jalankan task function sebagai background task.
        task_fn harus menerima job sebagai parameter pertama.
        """
        job.update(status=JobStatus.PROCESSING)
        job_timeout = int(os.getenv("JOB_TIMEOUT_SECONDS", "1800"))
        try:
            await asyncio.wait_for(
                task_fn(job, *args, **kwargs),
                timeout=job_timeout
            )
            if job.status == JobStatus.CANCELLED:
                job.update(
                    completed_at=datetime.now(timezone.utc).isoformat()
                )
            elif job.status != JobStatus.ERROR:
                job.update(
                    status=JobStatus.DONE,
                    progress=100,
                    completed_at=datetime.now(timezone.utc).isoformat()
                )
        except asyncio.TimeoutError:
            job.update(
                status=JobStatus.ERROR,
                error_message=f"Pekerjaan dibatalkan secara otomatis karena melebihi batas waktu {job_timeout // 60} menit.",
                completed_at=datetime.now(timezone.utc).isoformat()
            )
        except Exception as e:
            if job.status == JobStatus.CANCELLED:
                job.update(
                    completed_at=datetime.now(timezone.utc).isoformat()
                )
            else:
                job.update(
                    status=JobStatus.ERROR,
                    error_message=str(e),
                    completed_at=datetime.now(timezone.utc).isoformat()
                )

    async def purge_expired_files(self) -> int:
        """
        Hapus berkas hasil yang sudah melewati MAX_JOB_RETENTION_MINUTES.

        Baris riwayatnya sengaja DIPERTAHANKAN dan ditandai file_purged agar
        kode akses tetap dapat dilacak sampai retensi riwayat habis. Inilah
        yang memisahkan umur berkas (dibatasi ruang disk) dari umur riwayat
        (sekitar 1 KB per baris).
        """
        jumlah = 0
        for job_id, filepath in self._store.list_purgeable_files(
            self._max_retention_minutes
        ):
            if filepath and os.path.exists(filepath):
                try:
                    os.remove(filepath)
                except OSError as e:
                    import structlog
                    structlog.get_logger().warning(
                        "Gagal menghapus berkas hasil kedaluwarsa",
                        job_id=job_id,
                        error=str(e),
                    )
                    continue
            self._store.mark_file_purged(job_id)
            self._jobs.pop(job_id, None)
            jumlah += 1
        return jumlah

    async def purge_expired_records(self) -> int:
        """Hapus baris riwayat yang lebih tua dari JOB_RECORD_RETENTION_DAYS."""
        return self._store.purge_expired_records(self._record_retention_days)


# Singleton instance — dipakai di seluruh app.
# Angka retensi dibaca dari environment, bukan lagi di-hardcode.
job_queue = JobQueue()
