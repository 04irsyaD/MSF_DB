"""Berkas hasil yang sudah dihapus penyapu harus menjawab 410, bukan 500."""

from datetime import datetime, timezone

from fastapi.testclient import TestClient


def test_download_berkas_kedaluwarsa_menjawab_410(isolated_job_queue):
    from app.main import app

    job = isolated_job_queue.create_job()
    job.update(
        status="done",
        progress=100,
        completed_at=datetime.now(timezone.utc).isoformat(),
        result_filename="dokumentasi.docx",
    )
    isolated_job_queue.store.mark_file_purged(job.job_id)
    isolated_job_queue._jobs.clear()

    with TestClient(app) as c:
        response = c.get(f"/api/jobs/{job.job_id}/download")

    assert response.status_code == 410
    body = response.json()
    assert body["error_code"] == "RESULT_EXPIRED"
    assert "timestamp" in body


def test_download_job_tidak_dikenal_tetap_404(isolated_job_queue):
    from app.main import app

    with TestClient(app) as c:
        response = c.get("/api/jobs/job-tidak-ada/download")

    assert response.status_code == 404
