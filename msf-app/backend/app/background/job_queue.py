"""
In-memory background job queue untuk MSF-APP.
Menyimpan status job generate dokumentasi.
"""

import asyncio
import uuid
from datetime import datetime, timezone
from typing import Dict, Optional, Callable, Any
from app.models.schemas import JobStatus


class Job:
    def __init__(self, job_id: str, project_name: str = "Database Documentation"):
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
        self.result_bytes: Optional[bytes] = None        # File DOCX/PDF bytes
        self.result_filename: Optional[str] = None       # Nama file untuk download
        self.output_format: str = "docx"

    def to_dict(self) -> dict:
        download_url = None
        if self.status == JobStatus.DONE and self.result_bytes:
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
        }

    def update(self, **kwargs):
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
        self.updated_at = datetime.now(timezone.utc).isoformat()


class JobQueue:
    """
    In-memory job queue.
    Di production bisa diganti dengan Redis/Celery,
    tapi untuk personal use ini sudah cukup.
    """

    def __init__(self, max_retention_minutes: int = 60):
        self._jobs: Dict[str, Job] = {}
        self._max_retention_minutes = max_retention_minutes
        self._lock = asyncio.Lock()

    def create_job(self, project_name: str = "Database Documentation") -> Job:
        """Buat job baru dan return job object"""
        job_id = str(uuid.uuid4())
        job = Job(job_id=job_id, project_name=project_name)
        self._jobs[job_id] = job
        return job

    def get_job(self, job_id: str) -> Optional[Job]:
        """Ambil job berdasarkan ID"""
        return self._jobs.get(job_id)

    def list_jobs(self) -> list[dict]:
        """List semua job (untuk debugging)"""
        return [job.to_dict() for job in self._jobs.values()]

    def delete_job(self, job_id: str) -> bool:
        """Hapus job dari memory"""
        if job_id in self._jobs:
            del self._jobs[job_id]
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
        try:
            await task_fn(job, *args, **kwargs)
            if job.status != JobStatus.ERROR:
                job.update(
                    status=JobStatus.DONE,
                    progress=100,
                    completed_at=datetime.now(timezone.utc).isoformat()
                )
        except Exception as e:
            job.update(
                status=JobStatus.ERROR,
                error_message=str(e),
                completed_at=datetime.now(timezone.utc).isoformat()
            )

    async def cleanup_old_jobs(self):
        """Hapus job lama yang sudah melebihi retention time"""
        now = datetime.now(timezone.utc)
        to_delete = []

        for job_id, job in self._jobs.items():
            if job.status in (JobStatus.DONE, JobStatus.ERROR):
                if job.completed_at:
                    completed = datetime.fromisoformat(job.completed_at)
                    age_minutes = (now - completed).total_seconds() / 60
                    if age_minutes > self._max_retention_minutes:
                        to_delete.append(job_id)

        for job_id in to_delete:
            del self._jobs[job_id]

        return len(to_delete)


# Singleton instance — dipakai di seluruh app
job_queue = JobQueue(max_retention_minutes=60)
