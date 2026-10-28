"""Pemilihan renderer harus mengikuti structure_template, bukan menebak."""

import pytest

from app.models.schemas import StructureTemplate
from app.routers.generate import batasi_ukuran_keluaran, pilih_keluaran_docx
from app.services.doc_model import SUMBER_AI, ColumnDoc, DocumentModel, TableDoc


def model_contoh():
    return DocumentModel(
        project_name="Proyek Uji",
        generated_at="11 August 2026",
        tables=[
            TableDoc(
                name="t_uji",
                summary="Ringkasan.",
                columns=[
                    ColumnDoc(
                        no=1,
                        name="id",
                        data_type_label="bigint",
                        description="Identitas.",
                        source=SUMBER_AI,
                    )
                ],
            )
        ],
    )


def test_standard_memakai_exporter_markdown():
    dipanggil = {}

    def exporter_palsu(markdown_content, project_name, author=None):
        dipanggil["markdown"] = markdown_content
        return b"DOCX-LAMA"

    hasil = pilih_keluaran_docx(
        template=StructureTemplate.STANDARD,
        model=model_contoh(),
        markdown="# Judul",
        project_name="Proyek Uji",
        author=None,
        exporter=exporter_palsu,
    )

    assert hasil == b"DOCX-LAMA"
    assert dipanggil["markdown"] == "# Judul"


def test_msf_tsd_memakai_renderer_template(monkeypatch):
    from app.routers import generate as modul

    monkeypatch.setattr(
        modul, "render_docx", lambda model, template, author: b"DOCX-TSD"
    )

    hasil = pilih_keluaran_docx(
        template=StructureTemplate.MSF_TSD,
        model=model_contoh(),
        markdown="# Judul",
        project_name="Proyek Uji",
        author=None,
        exporter=lambda **_: b"SALAH",
    )

    assert hasil == b"DOCX-TSD"


def test_nilai_string_dari_setting_lama_tetap_dikenali(monkeypatch):
    """Job tersimpan di SQLite menyimpan nilai enum sebagai string biasa."""
    from app.routers import generate as modul

    monkeypatch.setattr(
        modul, "render_docx", lambda model, template, author: b"DOCX-TSD"
    )

    hasil = pilih_keluaran_docx(
        template="msf_tsd",
        model=model_contoh(),
        markdown="# Judul",
        project_name="Proyek Uji",
        author=None,
        exporter=lambda **_: b"SALAH",
    )

    assert hasil == b"DOCX-TSD"


def test_ukuran_di_bawah_batas_lolos(monkeypatch):
    monkeypatch.setenv("MAX_OUTPUT_SIZE_MB", "1")

    batasi_ukuran_keluaran(b"x" * 1000)


def test_ukuran_melebihi_batas_ditolak_dengan_pesan_jelas(monkeypatch):
    """Template TSD memperbesar keluaran; batasnya harus benar-benar dibaca."""
    monkeypatch.setenv("MAX_OUTPUT_SIZE_MB", "1")

    with pytest.raises(ValueError) as info:
        batasi_ukuran_keluaran(b"x" * (2 * 1024 * 1024))

    assert "MAX_OUTPUT_SIZE_MB" in str(info.value)
