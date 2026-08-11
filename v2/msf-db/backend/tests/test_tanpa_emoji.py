"""AGENTS.md poin 12: dilarang emoji di kode maupun keluarannya."""

from pathlib import Path

import pytest

from app.models.schemas import ColumnMetadata, ForeignKeyMetadata, TableMetadata
from app.services.doc_generator import DocGenerator

AKAR_APP = Path(__file__).resolve().parent.parent / "app"


def _emoji(kode: int) -> bool:
    """
    Rentang emoji sebenarnya, bukan ambang kasar.

    Panah seperti U+2192 dan titik tengah U+00B7 adalah tanda baca tipografis,
    bukan ikon, sehingga tidak boleh ikut tertangkap.
    """
    return (
        0x1F000 <= kode <= 0x1FAFF
        or 0x2600 <= kode <= 0x27BF
        or 0x2B00 <= kode <= 0x2BFF
        or kode == 0xFE0F
    )


def _emoji_dalam(teks: str) -> set:
    return {f"U+{ord(k):04X}" for k in teks if _emoji(ord(k))}


@pytest.mark.parametrize(
    "berkas", sorted(AKAR_APP.rglob("*.py")), ids=lambda p: p.name
)
def test_berkas_sumber_tanpa_emoji(berkas):
    ditemukan = _emoji_dalam(berkas.read_text(encoding="utf-8"))

    assert not ditemukan, f"{berkas.name} memuat {sorted(ditemukan)}"


class ProviderGagal:
    async def generate(self, prompt, model):
        raise RuntimeError("model mati")


def tabel_uji():
    return TableMetadata(
        name="t_uji",
        schema="public",
        columns=[
            ColumnMetadata(
                name="id", data_type="bigint", is_nullable=False, is_primary_key=True
            ),
            ColumnMetadata(name="ref_id", data_type="bigint", is_foreign_key=True),
        ],
        primary_key=["id"],
        foreign_keys=[
            ForeignKeyMetadata(
                column="ref_id", references_table="t_lain", references_column="id"
            )
        ],
    )


@pytest.mark.asyncio
async def test_keluaran_dokumen_tanpa_emoji_saat_ai_gagal():
    """Jalur fallback dulu memakai penanda peringatan berupa emoji."""
    gen = DocGenerator(provider=ProviderGagal(), model="model-uji")

    hasil = await gen.generate_from_tables([tabel_uji()], "Proyek Uji")

    assert not _emoji_dalam(hasil)


@pytest.mark.asyncio
async def test_keluaran_dokumen_tanpa_emoji_saat_ai_berhasil():
    """Penanda PK dan FK di tabel kolom dulu memakai emoji."""

    class ProviderBaik:
        async def generate(self, prompt, model):
            return "Deskripsi tabel uji."

    gen = DocGenerator(provider=ProviderBaik(), model="model-uji")

    hasil = await gen.generate_from_tables([tabel_uji()], "Proyek Uji")

    assert not _emoji_dalam(hasil)
    assert "PK" in hasil
    assert "FK" in hasil
