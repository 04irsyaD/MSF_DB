"""
Test suite untuk Admin Portal endpoints.
"""
import pytest
from fastapi.testclient import TestClient


@pytest.fixture(autouse=True)
def setup_admin_passcode(monkeypatch):
    """
    Fixture untuk memaksa ADMIN_PASSCODE terkonfigurasi selama test.

    ADMIN_PASSCODE dibaca SEKALI saat modul admin.py di-import, bukan per request.
    Karena itu yang ditambal adalah ATRIBUT MODUL, bukan variabel environment —
    menyetel env saja hanya bekerja bila fixture ini kebetulan berjalan sebelum
    modul admin.py pernah di-import (spec 9.8).
    """
    import app.routers.admin as admin_module

    monkeypatch.setenv("ADMIN_PASSCODE", "test-admin-secret-123")
    monkeypatch.setattr(admin_module, "ADMIN_PASSCODE", "test-admin-secret-123")
    yield


def test_admin_endpoints_without_header_returns_401(client):
    """Mengakses endpoint admin tanpa header passcode wajib mengembalikan 401."""
    endpoints = [
        ("/api/admin/verify", "POST"),
        ("/api/admin/stats", "GET"),
        ("/api/admin/jobs", "GET"),
        ("/api/admin/logs", "GET"),
    ]
    for path, method in endpoints:
        if method == "POST":
            response = client.post(path)
        else:
            response = client.get(path)
        assert response.status_code == 401
        assert "detail" in response.json()


def test_admin_endpoints_with_invalid_passcode_returns_401(client):
    """Mengakses dengan passcode salah wajib mengembalikan 401."""
    headers = {"X-Admin-Passcode": "wrong-passcode"}
    response = client.get("/api/admin/stats", headers=headers)
    assert response.status_code == 401
    assert "tidak valid" in response.json()["detail"].lower()


def test_admin_verify_success(client):
    """Mengakses verify dengan passcode benar wajib mengembalikan 200."""
    headers = {"X-Admin-Passcode": "test-admin-secret-123"}
    response = client.post("/api/admin/verify", headers=headers)
    assert response.status_code == 200
    assert response.json()["success"] is True


def test_admin_stats_success(client):
    """Mengakses stats dengan passcode benar wajib mengembalikan struktur statistik yang lengkap."""
    headers = {"X-Admin-Passcode": "test-admin-secret-123"}
    response = client.get("/api/admin/stats", headers=headers)
    assert response.status_code == 200
    
    data = response.json()
    assert "summary" in data
    assert "ai_distribution" in data
    assert "db_distribution" in data
    
    summary = data["summary"]
    assert "total_jobs" in summary
    assert "success_rate" in summary
    assert "avg_duration_seconds" in summary


def test_admin_logs_success(client):
    """Mengakses logs dengan passcode benar wajib mengembalikan list log."""
    headers = {"X-Admin-Passcode": "test-admin-secret-123"}
    response = client.get("/api/admin/logs?limit=50", headers=headers)
    assert response.status_code == 200
    assert "logs" in response.json()
    assert isinstance(response.json()["logs"], list)


def test_passcode_salah_ditolak_dengan_401(monkeypatch):
    """Passcode yang salah harus ditolak lewat perbandingan waktu-konstan."""
    import app.routers.admin as admin_module

    monkeypatch.setattr(admin_module, "ADMIN_PASSCODE", "passcode-benar")

    from app.main import app

    with TestClient(app) as c:
        response = c.post("/api/admin/verify", headers={"X-Admin-Passcode": "passcode-salah"})

    assert response.status_code == 401


def test_verify_memakai_compare_digest():
    """Perbandingan passcode tidak boleh memakai operator != yang bocor waktu."""
    import inspect

    import app.routers.admin as admin_module

    source = inspect.getsource(admin_module.verify_admin_passcode)
    assert "compare_digest" in source


def _job_hanya_di_basis_data(antrean, project_name: str):
    """
    Buat job selesai yang berkasnya sudah dihapus penyapu.

    Job seperti ini TIDAK ikut direhidrasi ke memori oleh recover(), sehingga
    hanya terlihat bila endpoint benar-benar membaca JobStore. Tanpa syarat
    ini, test akan lulus semu karena rehidrasi mengembalikannya ke memori.
    """
    from datetime import datetime, timezone

    job = antrean.create_job(project_name=project_name)
    job.update(
        status="done",
        progress=100,
        completed_at=datetime.now(timezone.utc).isoformat(),
    )
    antrean.store.mark_file_purged(job.job_id)
    antrean._jobs.clear()
    return job


def test_stats_bersumber_dari_riwayat_penuh(isolated_job_queue):
    """Statistik admin harus melintasi riwayat basis data, bukan hanya memori."""
    from app.main import app

    _job_hanya_di_basis_data(isolated_job_queue, "Riwayat Lama")

    with TestClient(app) as c:
        assert isolated_job_queue.list_jobs() == []
        response = c.get(
            "/api/admin/stats", headers={"X-Admin-Passcode": "test-admin-secret-123"}
        )

    assert response.status_code == 200
    assert response.json()["summary"]["total_jobs"] == 1
    assert response.json()["summary"]["done"] == 1


def test_daftar_jobs_admin_bersumber_dari_riwayat_penuh(isolated_job_queue):
    from app.main import app

    _job_hanya_di_basis_data(isolated_job_queue, "Riwayat Lama")

    with TestClient(app) as c:
        response = c.get(
            "/api/admin/jobs", headers={"X-Admin-Passcode": "test-admin-secret-123"}
        )

    assert response.status_code == 200
    jobs = response.json()["jobs"]
    assert len(jobs) == 1
    assert jobs[0]["project_name"] == "Riwayat Lama"


def test_admin_logs_invalid_limit(client):
    """Mengirim limit log di luar batas (10-1000) wajib mengembalikan 400."""
    headers = {"X-Admin-Passcode": "test-admin-secret-123"}
    
    response_low = client.get("/api/admin/logs?limit=5", headers=headers)
    assert response_low.status_code == 400
    
    response_high = client.get("/api/admin/logs?limit=2000", headers=headers)
    assert response_high.status_code == 400
