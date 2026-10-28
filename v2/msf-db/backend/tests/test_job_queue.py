"""
Test job queue state machine — memastikan lifecycle job berjalan benar,
termasuk persistensi ke JobStore dan pemulihan setelah restart.
"""
import pytest
from app.background.job_queue import JobStatus


@pytest.mark.asyncio
async def test_create_job_returns_id(isolated_job_queue):
    job = isolated_job_queue.create_job(
        project_name="Test",
    )
    assert isinstance(job.job_id, str)
    assert len(job.job_id) > 0


@pytest.mark.asyncio
async def test_new_job_status_is_queued(isolated_job_queue):
    job = isolated_job_queue.create_job(
        project_name="Test",
    )
    fetched_job = isolated_job_queue.get_job(job.job_id)
    assert fetched_job is not None
    assert fetched_job.status == JobStatus.QUEUED


@pytest.mark.asyncio
async def test_cancel_queued_job(isolated_job_queue):
    job = isolated_job_queue.create_job(
        project_name="Test",
    )
    success = await isolated_job_queue.cancel_job(job.job_id)
    assert success is True

    fetched_job = isolated_job_queue.get_job(job.job_id)
    assert fetched_job.status == JobStatus.CANCELLED


@pytest.mark.asyncio
async def test_get_nonexistent_job_returns_none(isolated_job_queue):
    job = isolated_job_queue.get_job("nonexistent-job-id-12345")
    assert job is None


# ----------------------------------------------------------------------
# Persistensi (v2.2.0)
# ----------------------------------------------------------------------


def test_create_job_langsung_tersimpan_ke_store(isolated_job_queue):
    job = isolated_job_queue.create_job(project_name="Proyek Persisten")

    baris = isolated_job_queue.store.get(job.job_id)
    assert baris is not None
    assert baris["project_name"] == "Proyek Persisten"
    assert baris["status"] == "queued"


def test_update_job_mempersist_perubahan(isolated_job_queue):
    job = isolated_job_queue.create_job()

    job.update(progress=45, current_table="pengguna")

    baris = isolated_job_queue.store.get(job.job_id)
    assert baris["progress"] == 45
    assert baris["current_table"] == "pengguna"


def test_get_job_jatuh_ke_store_saat_memori_kosong(isolated_job_queue):
    job = isolated_job_queue.create_job()
    job_id = job.job_id
    isolated_job_queue._jobs.clear()

    hasil = isolated_job_queue.get_job(job_id)

    assert hasil is not None
    assert hasil.job_id == job_id


def test_get_job_by_access_code_jatuh_ke_store(isolated_job_queue):
    job = isolated_job_queue.create_job()
    kode = job.access_code
    isolated_job_queue._jobs.clear()

    hasil = isolated_job_queue.get_job_by_access_code(kode)

    assert hasil is not None
    assert hasil.access_code == kode


def test_bentuk_access_code_tidak_berubah(isolated_job_queue):
    """Invarian 8.5 nomor 1: MSF- diikuti 10 heksadesimal huruf besar."""
    import re

    job = isolated_job_queue.create_job()

    assert re.fullmatch(r"MSF-[0-9A-F]{10}", job.access_code)


def test_job_dari_store_adalah_snapshot_baca_saja(isolated_job_queue):
    job = isolated_job_queue.create_job()
    job_id = job.job_id
    isolated_job_queue._jobs.clear()

    snapshot = isolated_job_queue.get_job(job_id)
    snapshot.update(progress=99)

    assert isolated_job_queue.store.get(job_id)["progress"] == 0


def test_recover_menandai_job_aktif_sebagai_error(isolated_job_queue):
    from app.background.job_store import RESTART_ERROR_MESSAGE

    job = isolated_job_queue.create_job()
    job_id = job.job_id
    isolated_job_queue._jobs.clear()

    jumlah = isolated_job_queue.recover()

    assert jumlah == 1
    pulih = isolated_job_queue.get_job(job_id)
    assert pulih.status == "error"
    assert pulih.error_message == RESTART_ERROR_MESSAGE


def test_recover_tidak_menyisakan_job_aktif_di_gerbang_konkurensi(isolated_job_queue):
    for _ in range(3):
        isolated_job_queue.create_job()
    isolated_job_queue._jobs.clear()

    isolated_job_queue.recover()

    aktif = [
        j for j in isolated_job_queue.list_jobs()
        if j["status"] in ("queued", "processing")
    ]
    assert aktif == []


def test_delete_job_menghapus_baris_di_store(isolated_job_queue):
    job = isolated_job_queue.create_job()

    assert isolated_job_queue.delete_job(job.job_id) is True
    assert isolated_job_queue.store.get(job.job_id) is None
