"""Retensi berkas (menit) terpisah dari retensi baris riwayat (hari)."""

import os
from datetime import datetime, timedelta, timezone

import pytest


@pytest.mark.asyncio
async def test_purge_expired_files_menghapus_berkas_tapi_mempertahankan_baris(
    isolated_job_queue, tmp_path
):
    berkas = tmp_path / "hasil.docx"
    berkas.write_bytes(b"isi dokumen")

    job = isolated_job_queue.create_job()
    lama = (datetime.now(timezone.utc) - timedelta(minutes=120)).isoformat()
    job.update(
        status="done",
        completed_at=lama,
        result_filepath=str(berkas),
    )

    jumlah = await isolated_job_queue.purge_expired_files()

    assert jumlah == 1
    assert not os.path.exists(str(berkas))

    baris = isolated_job_queue.store.get(job.job_id)
    assert baris is not None
    assert baris["file_purged"] == 1
    assert baris["result_filepath"] is None


@pytest.mark.asyncio
async def test_purge_expired_files_tidak_menyentuh_berkas_yang_masih_muda(
    isolated_job_queue, tmp_path
):
    berkas = tmp_path / "hasil.docx"
    berkas.write_bytes(b"isi dokumen")

    job = isolated_job_queue.create_job()
    job.update(
        status="done",
        completed_at=datetime.now(timezone.utc).isoformat(),
        result_filepath=str(berkas),
    )

    jumlah = await isolated_job_queue.purge_expired_files()

    assert jumlah == 0
    assert os.path.exists(str(berkas))


@pytest.mark.asyncio
async def test_purge_expired_records_menghapus_baris_lebih_tua_dari_retensi(
    isolated_job_queue,
):
    job = isolated_job_queue.create_job()
    tua = (datetime.now(timezone.utc) - timedelta(days=40)).isoformat()
    job.update(status="done", created_at=tua, completed_at=tua)

    jumlah = await isolated_job_queue.purge_expired_records()

    assert jumlah == 1
    assert isolated_job_queue.store.get(job.job_id) is None


def test_max_job_retention_minutes_dibaca_dari_env(monkeypatch, tmp_path):
    """MAX_JOB_RETENTION_MINUTES sebelumnya config mati (spec 9.3)."""
    import app.background.job_queue as jq_module

    monkeypatch.setenv("JOBS_DB_PATH", str(tmp_path / "jobs-env.db"))
    monkeypatch.setenv("MAX_JOB_RETENTION_MINUTES", "5")
    monkeypatch.setenv("JOB_RECORD_RETENTION_DAYS", "7")

    antrean = jq_module.JobQueue()
    try:
        assert antrean._max_retention_minutes == 5
        assert antrean._record_retention_days == 7
    finally:
        antrean.close()
