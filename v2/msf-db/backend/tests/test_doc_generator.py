"""Perilaku DocGenerator dikunci di sini sebelum strukturnya diubah."""

import pytest

from app.models.schemas import (
    ColumnMetadata,
    ForeignKeyMetadata,
    IndexMetadata,
    TableMetadata,
)
from app.services.doc_generator import DocGenerator


class ProviderPalsu:
    """Provider AI tiruan. Mencatat prompt terakhir agar isinya bisa diperiksa."""

    def __init__(self, balasan="Tabel ini menyimpan transaksi pembayaran."):
        self.balasan = balasan
        self.prompt_terakhir = None
        self.jumlah_panggilan = 0

    async def generate(self, prompt, model):
        self.prompt_terakhir = prompt
        self.jumlah_panggilan += 1
        if isinstance(self.balasan, Exception):
            raise self.balasan
        return self.balasan


def tabel_contoh(nama="trx_pembayaran"):
    return TableMetadata(
        name=nama,
        schema="public",
        columns=[
            ColumnMetadata(
                name="id", data_type="bigint", is_nullable=False, is_primary_key=True
            ),
            ColumnMetadata(
                name="nasabah_id",
                data_type="bigint",
                is_nullable=False,
                is_foreign_key=True,
            ),
            ColumnMetadata(name="jumlah", data_type="numeric", is_nullable=False),
        ],
        primary_key=["id"],
        foreign_keys=[
            ForeignKeyMetadata(
                column="nasabah_id",
                references_table="mst_nasabah",
                references_column="id",
                on_delete="RESTRICT",
            )
        ],
        indexes=[
            IndexMetadata(
                name="idx_trx_nasabah", columns=["nasabah_id"], is_unique=False
            )
        ],
        row_count=1500,
    )


def generator(detail_level="detailed", provider=None):
    return DocGenerator(
        provider=provider or ProviderPalsu(),
        model="model-uji",
        language="Indonesian",
        detail_level=detail_level,
    )


@pytest.mark.asyncio
async def test_dokumen_memuat_judul_dan_jumlah_tabel():
    hasil = await generator().generate_from_tables([tabel_contoh()], "Proyek Uji")

    assert "# Proyek Uji" in hasil
    assert "**Total Tabel:** 1" in hasil


@pytest.mark.asyncio
async def test_setiap_kolom_muncul_di_tabel_markdown():
    hasil = await generator().generate_from_tables([tabel_contoh()], "Proyek Uji")

    for nama_kolom in ("id", "nasabah_id", "jumlah"):
        assert f"`{nama_kolom}`" in hasil


@pytest.mark.asyncio
async def test_relasi_foreign_key_menyebut_tabel_tujuan():
    hasil = await generator().generate_from_tables([tabel_contoh()], "Proyek Uji")

    assert "`mst_nasabah.id`" in hasil
    assert "ON DELETE RESTRICT" in hasil


@pytest.mark.asyncio
async def test_index_hanya_muncul_pada_mode_comprehensive():
    tanpa_index = await generator("detailed").generate_from_tables(
        [tabel_contoh()], "Proyek Uji"
    )
    dengan_index = await generator("comprehensive").generate_from_tables(
        [tabel_contoh()], "Proyek Uji"
    )

    assert "idx_trx_nasabah" not in tanpa_index
    assert "idx_trx_nasabah" in dengan_index


@pytest.mark.asyncio
async def test_ringkasan_relasi_butuh_lebih_dari_satu_tabel():
    satu = await generator("detailed").generate_from_tables(
        [tabel_contoh()], "Proyek Uji"
    )
    dua = await generator("detailed").generate_from_tables(
        [tabel_contoh("trx_pembayaran"), tabel_contoh("trx_pinjaman")], "Proyek Uji"
    )

    assert "Ringkasan Relasi Antar Tabel" not in satu
    assert "Ringkasan Relasi Antar Tabel" in dua


@pytest.mark.asyncio
async def test_dokumen_kosong_saat_tidak_ada_tabel():
    hasil = await generator().generate_from_tables([], "Proyek Uji")

    assert "Tidak ada tabel yang ditemukan" in hasil


@pytest.mark.asyncio
async def test_kegagalan_ai_tidak_membatalkan_dokumen():
    """Satu tabel gagal tidak boleh menjatuhkan seluruh job."""
    rusak = ProviderPalsu(balasan=RuntimeError("model mati"))

    hasil = await generator(provider=rusak).generate_from_tables(
        [tabel_contoh()], "Proyek Uji"
    )

    assert "trx_pembayaran" in hasil
    assert "`jumlah`" in hasil


@pytest.mark.asyncio
async def test_prompt_memuat_nama_dan_kolom_tabel():
    provider = ProviderPalsu()

    await generator(provider=provider).generate_from_tables(
        [tabel_contoh()], "Proyek Uji"
    )

    assert "trx_pembayaran" in provider.prompt_terakhir
    assert "nasabah_id" in provider.prompt_terakhir
