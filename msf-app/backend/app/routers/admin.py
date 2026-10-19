"""
Router: Admin Portal — /api/admin/*
Menyediakan statistik, pemantauan log, manajemen antrean, dan aksi sistem.
"""

import os
import secrets
from fastapi import APIRouter, HTTPException, Header, Depends, Request
from datetime import datetime
from collections import deque
import structlog

from app.background.job_queue import job_queue, JobStatus
from app.utils.client_ip import client_ip
from app.utils.login_lockout import LoginLockout

router = APIRouter(prefix="/api/admin", tags=["Admin"])
logger = structlog.get_logger()

MIN_PASSCODE_LENGTH = 16
admin_lockout = LoginLockout(max_failures=5, window_seconds=15 * 60, lockout_seconds=15 * 60)


def configured_admin_passcode() -> str:
    """Passcode dari env; kosong (admin nonaktif) jika belum di-set atau terlalu pendek."""
    passcode = os.getenv("ADMIN_PASSCODE", "")
    if passcode and len(passcode) < MIN_PASSCODE_LENGTH:
        logger.warning("ADMIN_PASSCODE terlalu pendek, fitur admin dinonaktifkan", min_length=MIN_PASSCODE_LENGTH)
        return ""
    return passcode


def warn_if_admin_passcode_weak() -> None:
    """Dipanggil saat startup supaya konfigurasi lemah terlihat di log sejak awal."""
    configured_admin_passcode()


async def verify_admin_passcode(request: Request, x_admin_passcode: str = Header(None)):
    """Dependency untuk memvalidasi admin passcode (constant-time + lockout per IP)."""
    expected = configured_admin_passcode()
    if not expected:
        raise HTTPException(status_code=403, detail="Fitur admin dinonaktifkan di server ini.")

    ip = client_ip(request)
    retry_after = admin_lockout.retry_after(ip)
    if retry_after:
        raise HTTPException(
            status_code=429,
            detail="Terlalu banyak percobaan login admin. Coba lagi nanti.",
            headers={"Retry-After": str(retry_after)},
        )

    if not x_admin_passcode:
        raise HTTPException(status_code=401, detail="Header X-Admin-Passcode wajib disertakan.")

    if not secrets.compare_digest(x_admin_passcode.encode(), expected.encode()):
        failures = admin_lockout.register_failure(ip)
        logger.warning("Login admin gagal", client_ip=ip, failures=failures)
        raise HTTPException(status_code=401, detail="Admin passcode tidak valid.")

    admin_lockout.register_success(ip)


@router.post("/verify", dependencies=[Depends(verify_admin_passcode)])
async def verify_passcode():
    """Endpoint sederhana untuk memvalidasi passcode dari frontend."""
    return {"success": True, "message": "Otentikasi admin berhasil."}


@router.get("/stats", dependencies=[Depends(verify_admin_passcode)])
async def get_admin_stats():
    """Mengembalikan statistik penggunaan dan performa sistem."""
    jobs = job_queue.list_jobs()
    
    total = len(jobs)
    done = sum(1 for j in jobs if j["status"] == JobStatus.DONE)
    error = sum(1 for j in jobs if j["status"] == JobStatus.ERROR)
    processing = sum(1 for j in jobs if j["status"] == JobStatus.PROCESSING)
    queued = sum(1 for j in jobs if j["status"] == JobStatus.QUEUED)
    cancelled = sum(1 for j in jobs if j["status"] == JobStatus.CANCELLED)
    
    # Hitung success rate
    success_rate = 100.0
    if (done + error) > 0:
        success_rate = round((done / (done + error)) * 100, 1)
        
    # Hitung rata-rata waktu generasi (durasi job selesai)
    durations = []
    for j in jobs:
        if j["status"] in (JobStatus.DONE, JobStatus.ERROR) and j.get("completed_at") and j.get("created_at"):
            try:
                start = datetime.fromisoformat(j["created_at"])
                end = datetime.fromisoformat(j["completed_at"])
                durations.append((end - start).total_seconds())
            except Exception:
                pass
    avg_duration = round(sum(durations) / len(durations), 1) if durations else 0.0
    
    # Distribusi AI Provider
    ai_distribution = {}
    for j in jobs:
        provider = j.get("ai_provider") or "unknown"
        ai_distribution[provider] = ai_distribution.get(provider, 0) + 1
        
    # Distribusi DB Engine
    db_distribution = {}
    for j in jobs:
        engine = j.get("db_engine") or "unknown"
        db_distribution[engine] = db_distribution.get(engine, 0) + 1

    return {
        "summary": {
            "total_jobs": total,
            "done": done,
            "error": error,
            "processing": processing,
            "queued": queued,
            "cancelled": cancelled,
            "success_rate": success_rate,
            "avg_duration_seconds": avg_duration,
        },
        "ai_distribution": ai_distribution,
        "db_distribution": db_distribution
    }


@router.get("/jobs", dependencies=[Depends(verify_admin_passcode)])
async def get_all_jobs():
    """Mengembalikan daftar seluruh pekerjaan di memori."""
    jobs = job_queue.list_jobs()
    # Urutkan berdasarkan waktu dibuat (terbaru dahulu)
    jobs.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    return {"jobs": jobs}


@router.get("/logs", dependencies=[Depends(verify_admin_passcode)])
async def get_server_logs(limit: int = 200):
    """Membaca N baris terakhir dari file log aplikasi secara efisien."""
    if limit < 10 or limit > 1000:
        raise HTTPException(
            status_code=400,
            detail="Limit harus di antara rentang 10 sampai 1000 baris."
        )

    log_file_path = os.getenv("LOG_FILE_PATH", "/app/outputs/app.log")
    if not os.path.exists(log_file_path):
        return {"logs": ["Belum ada log yang tercatat di server."]}
        
    try:
        # Membaca baris terakhir secara efisien tanpa me-load seluruh file ke RAM
        with open(log_file_path, "r", encoding="utf-8", errors="ignore") as f:
            lines = deque(f, maxlen=limit)
        return {"logs": [line.strip() for line in lines]}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Gagal membaca file log di server: {str(e)}"
        )


@router.post("/cleanup", dependencies=[Depends(verify_admin_passcode)])
async def force_cleanup_system():
    """Membersihkan seluruh riwayat pekerjaan secara paksa."""
    try:
        # Batalkan semua job aktif terlebih dahulu
        jobs = job_queue.list_jobs()
        active_ids = [j["job_id"] for j in jobs if j["status"] in (JobStatus.QUEUED, JobStatus.PROCESSING)]
        for job_id in active_ids:
            await job_queue.cancel_job(job_id)
            
        # Hapus semua job dari memory
        all_ids = [j["job_id"] for j in jobs]
        for job_id in all_ids:
            job_queue.delete_job(job_id)
            
        return {"success": True, "message": "Seluruh riwayat pekerjaan berhasil dibersihkan."}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Gagal melakukan pembersihan sistem: {str(e)}"
        )
