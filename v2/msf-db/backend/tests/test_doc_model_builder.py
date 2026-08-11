"""Rantai pengisian menentukan seberapa besar dokumen berlandaskan fakta."""

import pytest

from app.models.schemas import ColumnMetadata, ForeignKeyMetadata, TableMetadata
from app.services.doc_generator import DocGenerator
from app.services.doc_model import SUMBER_AI, SUMBER_FALLBACK, SUMBER_KOMENTAR_DB


class ProviderPalsu:
    def __init__(self, balasan=""):
        self.balasan = balasan
        self.prompt_terakhir = None
        self.jumlah_panggilan = 0

    async def generate(self, prompt, model):
        self.prompt_terakhir = prompt
        self.jumlah_panggilan += 1
        return self.balasan


def tabel_campuran():
    return TableMetadata(
        name="trx_pembayaran",
        schema="public",
        columns=[
            ColumnMetadata(
                name="id",
                data_type="bigint",
                is_primary_key=True,
                column_comment="Nomor identitas transaksi.",
            ),
            ColumnMetadata(name="jumlah", data_type="numeric"),
            ColumnMetadata(name="nasabah_id", data_type="bigint", is_foreign_key=True),
        ],
        primary_key=["id"],
        foreign_keys=[
            ForeignKeyMetadata(
                column="nasabah_id",
                references_table="mst_nasabah",
                references_column="id",
            )
        ],
    )


def generator(balasan=""):
    return DocGenerator(
        provider=ProviderPalsu(balasan), model="model-uji", language="Indonesian"
    )


@pytest.mark.asyncio
async def test_komentar_database_menang_atas_ai():
    gen = generator("id | Deskripsi karangan AI.\njumlah | Nominal.")

    model = await gen.build_document_model([tabel_campuran()], "Proyek Uji")
    kolom = {k.name: k for k in model.tables[0].columns}

    assert kolom["id"].description == "Nomor identitas transaksi."
    assert kolom["id"].source == SUMBER_KOMENTAR_DB


@pytest.mark.asyncio
async def test_ai_mengisi_kolom_tanpa_komentar():
    gen = generator("jumlah | Nominal pembayaran.")

    model = await gen.build_document_model([tabel_campuran()], "Proyek Uji")
    kolom = {k.name: k for k in model.tables[0].columns}

    assert kolom["jumlah"].description == "Nominal pembayaran."
    assert kolom["jumlah"].source == SUMBER_AI


@pytest.mark.asyncio
async def test_fallback_dipakai_saat_ai_diam():
    gen = generator("")

    model = await gen.build_document_model([tabel_campuran()], "Proyek Uji")
    kolom = {k.name: k for k in model.tables[0].columns}

    assert kolom["nasabah_id"].source == SUMBER_FALLBACK
    assert "mst_nasabah.id" in kolom["nasabah_id"].description
    assert kolom["jumlah"].description == "-"


@pytest.mark.asyncio
async def test_ai_tidak_dipanggil_bila_semua_kolom_berkomentar():
    """Menghemat panggilan sekaligus menutup peluang mengarang."""
    tabel = TableMetadata(
        name="t_lengkap",
        schema="public",
        columns=[
            ColumnMetadata(name="id", data_type="bigint", column_comment="Identitas.")
        ],
    )
    provider = ProviderPalsu("id | karangan")
    gen = DocGenerator(provider=provider, model="model-uji", language="Indonesian")

    await gen.build_document_model([tabel], "Proyek Uji")

    assert provider.jumlah_panggilan == 0


@pytest.mark.asyncio
async def test_kegagalan_ai_tidak_menjatuhkan_pembangunan_model():
    class ProviderRusak:
        async def generate(self, prompt, model):
            raise RuntimeError("model mati")

    gen = DocGenerator(
        provider=ProviderRusak(), model="model-uji", language="Indonesian"
    )

    model = await gen.build_document_model([tabel_campuran()], "Proyek Uji")

    assert len(model.tables[0].columns) == 3
    assert model.tables[0].columns[1].source == SUMBER_FALLBACK


@pytest.mark.asyncio
async def test_nomor_kolom_berurutan_mulai_dari_satu():
    model = await generator().build_document_model([tabel_campuran()], "Proyek Uji")

    assert [k.no for k in model.tables[0].columns] == [1, 2, 3]


@pytest.mark.asyncio
async def test_ringkasan_tabel_diambil_dari_keluaran_ai():
    gen = generator("RINGKASAN: Mencatat transaksi pembayaran.\njumlah | Nominal.")

    model = await gen.build_document_model([tabel_campuran()], "Proyek Uji")

    assert model.tables[0].summary == "Mencatat transaksi pembayaran."


@pytest.mark.asyncio
async def test_prompt_hanya_meminta_kolom_yang_belum_berkomentar():
    provider = ProviderPalsu("")
    gen = DocGenerator(provider=provider, model="model-uji", language="Indonesian")

    await gen.build_document_model([tabel_campuran()], "Proyek Uji")

    assert "jumlah" in provider.prompt_terakhir
    assert "nasabah_id" in provider.prompt_terakhir


@pytest.mark.asyncio
async def test_kolom_karangan_tidak_masuk_model():
    """Penyaring parser harus benar-benar berlaku di jalur produksi."""
    gen = generator("kolom_hantu | Kolom yang tidak pernah ada.\njumlah | Nominal.")

    model = await gen.build_document_model([tabel_campuran()], "Proyek Uji")
    nama = [k.name for k in model.tables[0].columns]

    assert "kolom_hantu" not in nama
    assert nama == ["id", "jumlah", "nasabah_id"]


@pytest.mark.asyncio
async def test_ringkasan_sumber_mencerminkan_isi_dokumen():
    gen = generator("jumlah | Nominal pembayaran.")

    model = await gen.build_document_model([tabel_campuran()], "Proyek Uji")

    assert model.ringkasan_sumber() == {
        SUMBER_KOMENTAR_DB: 1,
        SUMBER_AI: 1,
        SUMBER_FALLBACK: 1,
    }
