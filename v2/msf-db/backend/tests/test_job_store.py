"""Test untuk JobStore — penyimpanan job persisten berbasis SQLite."""

import os
from datetime import datetime, timedelta, timezone

import pytest

from app.background.job_store import RESTART_ERROR_MESSAGE, JobStore


def _row(job_id: str, **overrides) -> dict:
    now = datetime.now(timezone.utc).isoformat()
    row = {
        "job_id": job_id,
        "access_code": f"MSF-{job_id.upper()}",
        "project_name": "Proyek Uji",
        "status": "done",
        "progress": 100,
        "tables_total": 2,
        "tables_processed": 2,
        "current_table": None,
        "created_at": now,
        "updated_at": now,
        "completed_at": now,
        "error_message": None,
        "preview_markdown": "# Judul",
        "result_filepath": None,
        "result_filename": "dokumentasi.docx",
        "output_format": "docx",
        "ai_provider": "ollama",
        "db_engine": "ddl",
        "file_purged": 0,
    }
    row.update(overrides)
    return row


@pytest.fixture
def store(tmp_path):
    s = JobStore(db_path=str(tmp_path / "jobs.db"))
    yield s
    s.close()


def test_save_lalu_get_mengembalikan_baris_yang_sama(store):
    store.save(_row("job-1"))

    hasil = store.get("job-1")

    assert hasil is not None
    assert hasil["job_id"] == "job-1"
    assert hasil["project_name"] == "Proyek Uji"
    assert hasil["progress"] == 100


def test_get_pada_job_yang_tidak_ada_mengembalikan_none(store):
    assert store.get("tidak-ada") is None


def test_get_by_access_code(store):
    store.save(_row("job-1", access_code="MSF-ABCDEF0123"))

    hasil = store.get_by_access_code("MSF-ABCDEF0123")

    assert hasil is not None
    assert hasil["job_id"] == "job-1"


def test_save_kedua_kali_menimpa_baris_yang_sama(store):
    store.save(_row("job-1", progress=10))
    store.save(_row("job-1", progress=90))

    assert store.get("job-1")["progress"] == 90
    assert len(store.query()) == 1


def test_data_bertahan_setelah_store_ditutup_dan_dibuka_ulang(tmp_path):
    db_path = str(tmp_path / "jobs.db")
    pertama = JobStore(db_path=db_path)
    pertama.save(_row("job-1"))
    pertama.close()

    kedua = JobStore(db_path=db_path)
    try:
        assert kedua.get("job-1") is not None
    finally:
        kedua.close()


def test_reconcile_orphans_mengubah_job_aktif_menjadi_error(store):
    store.save(_row("job-queued", status="queued", completed_at=None))
    store.save(_row("job-processing", status="processing", completed_at=None))
    store.save(_row("job-done", status="done"))

    jumlah = store.reconcile_orphans()

    assert jumlah == 2
    assert store.get("job-queued")["status"] == "error"
    assert store.get("job-queued")["error_message"] == RESTART_ERROR_MESSAGE
    assert store.get("job-queued")["completed_at"] is not None
    assert store.get("job-done")["status"] == "done"


def test_delete_menghapus_baris(store):
    store.save(_row("job-1"))

    assert store.delete("job-1") is True
    assert store.get("job-1") is None
    assert store.delete("job-1") is False


def test_query_mengurutkan_terbaru_dahulu(store):
    lama = (datetime.now(timezone.utc) - timedelta(hours=2)).isoformat()
    store.save(_row("job-lama", created_at=lama))
    store.save(_row("job-baru"))

    hasil = store.query()

    assert [r["job_id"] for r in hasil] == ["job-baru", "job-lama"]


def test_list_purgeable_files_hanya_berkas_yang_sudah_lewat_batas(store, tmp_path):
    berkas = tmp_path / "hasil.docx"
    berkas.write_bytes(b"isi")
    lama = (datetime.now(timezone.utc) - timedelta(minutes=120)).isoformat()

    store.save(_row("job-lama", completed_at=lama, result_filepath=str(berkas)))
    store.save(_row("job-baru", result_filepath=str(berkas)))

    hasil = store.list_purgeable_files(max_age_minutes=60)

    assert hasil == [("job-lama", str(berkas))]


def test_mark_file_purged_mempertahankan_baris(store):
    store.save(_row("job-1", result_filepath="/tmp/hasil.docx"))

    store.mark_file_purged("job-1")

    baris = store.get("job-1")
    assert baris is not None
    assert baris["file_purged"] == 1
    assert baris["result_filepath"] is None
    assert baris["status"] == "done"


def test_purge_expired_records_menghapus_baris_yang_terlalu_tua(store):
    tua = (datetime.now(timezone.utc) - timedelta(days=40)).isoformat()
    store.save(_row("job-tua", created_at=tua))
    store.save(_row("job-muda"))

    jumlah = store.purge_expired_records(retention_days=30)

    assert jumlah == 1
    assert store.get("job-tua") is None
    assert store.get("job-muda") is not None


def test_list_hydratable_melewati_baris_yang_berkasnya_sudah_dihapus(store):
    store.save(_row("job-utuh"))
    store.save(_row("job-terhapus", file_purged=1))

    hasil = store.list_hydratable()

    assert [r["job_id"] for r in hasil] == ["job-utuh"]


def test_membuat_direktori_induk_bila_belum_ada(tmp_path):
    db_path = str(tmp_path / "belum" / "ada" / "jobs.db")
    s = JobStore(db_path=db_path)
    try:
        assert os.path.exists(db_path)
    finally:
        s.close()
