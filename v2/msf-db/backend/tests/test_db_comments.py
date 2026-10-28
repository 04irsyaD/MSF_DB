"""Komentar database adalah fakta dari DBA, bukan tebakan AI."""

import pytest

from app.models.schemas import ColumnMetadata, TableMetadata
from app.services.doc_generator import DocGenerator


class ProviderDiam:
    async def generate(self, prompt, model):
        return "Deskripsi dari AI."


def tabel_berkomentar():
    return TableMetadata(
        name="mst_nasabah",
        schema="public",
        table_comment="Data induk nasabah aktif.",
        columns=[
            ColumnMetadata(
                name="id",
                data_type="bigint",
                is_nullable=False,
                is_primary_key=True,
                column_comment="Nomor identitas internal nasabah.",
            ),
            ColumnMetadata(name="nama", data_type="varchar", is_nullable=False),
        ],
        primary_key=["id"],
    )


def generator():
    return DocGenerator(
        provider=ProviderDiam(),
        model="model-uji",
        language="Indonesian",
        detail_level="detailed",
    )


@pytest.mark.asyncio
async def test_komentar_kolom_muncul_di_tabel_markdown():
    hasil = await generator().generate_from_tables([tabel_berkomentar()], "Proyek Uji")

    assert "Nomor identitas internal nasabah." in hasil


@pytest.mark.asyncio
async def test_komentar_tabel_muncul_sebagai_catatan_skema():
    hasil = await generator().generate_from_tables([tabel_berkomentar()], "Proyek Uji")

    assert "Data induk nasabah aktif." in hasil


@pytest.mark.asyncio
async def test_komentar_ikut_masuk_prompt_sebagai_konteks():
    """Komentar yang sudah ada mencegah AI menebak ulang hal yang sudah diketahui."""

    class ProviderPerekam:
        def __init__(self):
            self.prompt = None

        async def generate(self, prompt, model):
            self.prompt = prompt
            return "Deskripsi."

    provider = ProviderPerekam()
    gen = DocGenerator(
        provider=provider,
        model="model-uji",
        language="Indonesian",
        detail_level="detailed",
    )

    await gen.generate_from_tables([tabel_berkomentar()], "Proyek Uji")

    assert "Data induk nasabah aktif." in provider.prompt


def test_tabel_tanpa_komentar_tetap_valid():
    tabel = TableMetadata(name="t_kosong", schema="public")

    assert tabel.table_comment is None
