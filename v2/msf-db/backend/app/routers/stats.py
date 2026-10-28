"""Router: Stats — /api/stats"""
from fastapi import APIRouter
from app.background.job_queue import job_queue
from app.models.schemas import JobStatus

router = APIRouter(prefix="/api", tags=["Stats"])


@router.get("/stats")
async def get_stats():
    """Statistik penggunaan aplikasi (dari in-memory job queue)"""
    all_jobs = job_queue.list_jobs()
    total = len(all_jobs)
    done = sum(1 for j in all_jobs if j["status"] == JobStatus.DONE)
    error_count = sum(1 for j in all_jobs if j["status"] == JobStatus.ERROR)
    processing = sum(1 for j in all_jobs if j["status"] == JobStatus.PROCESSING)
    cancelled = sum(1 for j in all_jobs if j["status"] == JobStatus.CANCELLED)
    tables_processed = sum(j.get("tables_processed", 0) for j in all_jobs if j["status"] == JobStatus.DONE)

    return {
        "total_jobs": total,
        "jobs_done": done,
        "jobs_error": error_count,
        "jobs_processing": processing,
        "jobs_cancelled": cancelled,
        "tables_processed": tables_processed,
    }
