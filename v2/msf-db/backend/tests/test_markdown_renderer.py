"""Renderer menerjemahkan model menjadi Markdown tanpa menambah isi."""

from app.services.doc_model import (
    SUMBER_AI,
    SUMBER_FALLBACK,
    ColumnDoc,
    DocumentModel,
    TableDoc,
)
from app.services.renderers.markdown_renderer import render_markdown


class FkPalsu:
    def __init__(self, column, references_table, references_column, on_delete=None):
        self.column = column
        self.references_table = references_table
        self.references_column = references_column
        self.on_delete = on_delete


class IndexPalsu:
    def __init__(self, name, columns, is_unique=False):
        self.name = name
        self.columns = columns
        self.is_unique = is_unique


def tabel_contoh(nama="t_uji"):
    return TableDoc(
        name=nama,
        schema="public",
        comment="Catatan dari DBA.",
        summary="Menyimpan data uji.",
        columns=[
            ColumnDoc(
                no=1,
                name="id",
                data_type_label="bigint",
                description="Nomor identitas.",
                source=SUMBER_AI,
                nullable=False,
            ),
            ColumnDoc(
                no=2,
                name="ref_id",
                data_type_label="bigint",
                description="Referensi ke t_lain.id",
                source=SUMBER_FALLBACK,
                nullable=True,
            ),
        ],
        foreign_keys=[FkPalsu("ref_id", "t_lain", "id", on_delete="RESTRICT")],
        indexes=[IndexPalsu("idx_ref", ["ref_id"])],
    )


def model_contoh(jumlah_tabel=1):
    return DocumentModel(
        project_name="Proyek Uji",
        generated_at="11 August 2026",
        tables=[tabel_contoh(f"t_uji_{i}") for i in range(jumlah_tabel)],
    )


def test_judul_dan_jumlah_tabel_muncul():
    hasil = render_markdown(model_contoh(), "Indonesian", "detailed")

    assert "# Proyek Uji" in hasil
    assert "**Total Tabel:** 1" in hasil
    assert "**Tanggal Generate:** 11 August 2026" in hasil


def test_nama_tabel_menjadi_heading_tingkat_dua():
    hasil = render_markdown(model_contoh(), "Indonesian", "detailed")

    assert "## Tabel: `t_uji_0`" in hasil


def test_deskripsi_kolom_masuk_ke_sel_tabel():
    hasil = render_markdown(model_contoh(), "Indonesian", "detailed")

    assert "| `id` | `bigint` | Tidak | Nomor identitas. |" in hasil


def test_kolom_nullable_memakai_label_bahasa_yang_benar():
    """Jalur lama selalu menulis Ya untuk kolom nullable, bahkan dalam bahasa Inggris."""
    inggris = render_markdown(model_contoh(), "English", "detailed")

    assert "| `ref_id` | `bigint` | Yes |" in inggris
    assert "| `id` | `bigint` | No |" in inggris


def test_komentar_tabel_muncul_sebagai_catatan():
    hasil = render_markdown(model_contoh(), "Indonesian", "detailed")

    assert "> Catatan skema: Catatan dari DBA." in hasil


def test_ringkasan_tabel_muncul_sebagai_prosa():
    hasil = render_markdown(model_contoh(), "Indonesian", "detailed")

    assert "Menyimpan data uji." in hasil


def test_dokumen_tanpa_tabel_tidak_melempar_error():
    kosong = DocumentModel(project_name="Kosong", generated_at="11 August 2026")

    hasil = render_markdown(kosong, "Indonesian", "detailed")

    assert "Tidak ada tabel yang ditemukan" in hasil


def test_bahasa_inggris_memakai_label_inggris():
    hasil = render_markdown(model_contoh(), "English", "detailed")

    assert "**Total Tables:** 1" in hasil
    assert "## Table: `t_uji_0`" in hasil


def test_relasi_foreign_key_dirender():
    hasil = render_markdown(model_contoh(), "Indonesian", "detailed")

    assert "`t_lain.id`" in hasil
    assert "ON DELETE RESTRICT" in hasil


def test_index_hanya_pada_mode_comprehensive():
    detailed = render_markdown(model_contoh(), "Indonesian", "detailed")
    comprehensive = render_markdown(model_contoh(), "Indonesian", "comprehensive")

    assert "idx_ref" not in detailed
    assert "idx_ref" in comprehensive


def test_ringkasan_relasi_butuh_lebih_dari_satu_tabel():
    satu = render_markdown(model_contoh(1), "Indonesian", "detailed")
    dua = render_markdown(model_contoh(2), "Indonesian", "detailed")

    assert "Ringkasan Relasi Antar Tabel" not in satu
    assert "Ringkasan Relasi Antar Tabel" in dua


def test_deskripsi_tidak_pernah_memecah_baris_tabel():
    """Satu kolom harus menghasilkan tepat satu baris tabel."""
    hasil = render_markdown(model_contoh(), "Indonesian", "detailed")

    baris = [b for b in hasil.splitlines() if b.startswith("| `id`")]

    assert len(baris) == 1


def test_deskripsi_proyek_muncul_bila_diisi():
    model = model_contoh()
    model.project_description = "Sistem manajemen risiko operasional."

    hasil = render_markdown(model, "Indonesian", "detailed")

    assert "Sistem manajemen risiko operasional." in hasil
