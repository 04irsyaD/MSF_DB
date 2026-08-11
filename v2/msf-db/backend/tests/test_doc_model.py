"""Model dokumen memisahkan isi dari cara menampilkannya."""

from app.services.doc_model import (
    SUMBER_AI,
    SUMBER_FALLBACK,
    SUMBER_KOMENTAR_DB,
    ColumnDoc,
    DocumentModel,
    TableDoc,
)


def model_contoh():
    kolom = [
        ColumnDoc(
            no=1,
            name="id",
            data_type_label="bigint",
            description="Nomor identitas.",
            source=SUMBER_KOMENTAR_DB,
        ),
        ColumnDoc(
            no=2,
            name="nama",
            data_type_label="varchar",
            description="Nama nasabah.",
            source=SUMBER_AI,
        ),
        ColumnDoc(
            no=3,
            name="ref_id",
            data_type_label="bigint",
            description="Referensi ke t_lain.id",
            source=SUMBER_FALLBACK,
        ),
    ]
    tabel = TableDoc(
        name="mst_nasabah",
        schema="public",
        comment="Data induk nasabah.",
        summary="Menyimpan data induk nasabah.",
        columns=kolom,
    )
    return DocumentModel(
        project_name="Proyek Uji",
        generated_at="11 August 2026",
        tables=[tabel],
    )


def test_ringkasan_sumber_menghitung_setiap_asal_deskripsi():
    hasil = model_contoh().ringkasan_sumber()

    assert hasil[SUMBER_KOMENTAR_DB] == 1
    assert hasil[SUMBER_AI] == 1
    assert hasil[SUMBER_FALLBACK] == 1


def test_ringkasan_sumber_pada_dokumen_kosong():
    kosong = DocumentModel(project_name="Kosong", generated_at="11 August 2026")

    hasil = kosong.ringkasan_sumber()

    assert hasil[SUMBER_AI] == 0
    assert hasil[SUMBER_KOMENTAR_DB] == 0
    assert hasil[SUMBER_FALLBACK] == 0


def test_nomor_kolom_dipertahankan_apa_adanya():
    """Nomor dipakai kolom No pada template dan tidak boleh dihitung ulang renderer."""
    tabel = model_contoh().tables[0]

    assert [k.no for k in tabel.columns] == [1, 2, 3]


def test_tabel_bawaan_tidak_berbagi_daftar_kolom():
    """Default mutable yang dibagikan antar instance adalah jebakan klasik."""
    satu = TableDoc(name="a")
    dua = TableDoc(name="b")

    satu.columns.append(
        ColumnDoc(
            no=1,
            name="x",
            data_type_label="int",
            description="-",
            source=SUMBER_FALLBACK,
        )
    )

    assert dua.columns == []


def test_dokumen_menyimpan_deskripsi_proyek_dan_penulis():
    model = DocumentModel(
        project_name="Proyek Uji",
        generated_at="11 August 2026",
        project_description="Sistem manajemen risiko.",
        author="Irsyad",
    )

    assert model.project_description == "Sistem manajemen risiko."
    assert model.author == "Irsyad"
