"""Field baru tidak boleh memecahkan request maupun job yang sudah ada."""

import pytest
from pydantic import ValidationError

from app.models.schemas import GenerateSettings, StructureTemplate


def test_bawaan_standard_menjaga_kompatibilitas():
    setting = GenerateSettings()

    assert setting.structure_template == StructureTemplate.STANDARD


def test_nilai_di_luar_enum_ditolak():
    """Endpoint publik tanpa auth; bentuk bebas tidak boleh diterima."""
    with pytest.raises(ValidationError):
        GenerateSettings(structure_template="../../etc/passwd")


def test_request_tanpa_field_tetap_valid():
    setting = GenerateSettings(project_name="Proyek Lama")

    assert setting.project_name == "Proyek Lama"
    assert setting.structure_template == StructureTemplate.STANDARD


def test_kedua_router_meneruskan_structure_template():
    import inspect

    from app.routers import generate as modul

    sumber = inspect.getsource(modul)

    assert sumber.count('"structure_template": payload.structure_template') == 2


def test_enum_hanya_memuat_nilai_yang_sudah_didukung():
    """
    Nilai template hanya boleh bertambah bersamaan dengan renderer yang
    benar-benar ada. Enum yang mendahului implementasi berarti request
    yang valid tetapi tidak dapat dilayani.
    """
    assert [t.value for t in StructureTemplate] == ["standard"]
