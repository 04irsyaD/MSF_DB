"""Prasyarat Batch 4: dependensi ada, dan template tidak ditelan .gitignore."""

import subprocess
from pathlib import Path

import pytest

TEMPLATE_REPO = "v2/msf-db/backend/templates/tsd.docx"


def _akar_repo():
    """
    Cari akar repositori dengan menaiki direktori sampai menemukan .git.

    Tidak boleh mengandalkan kedalaman path yang tetap: di dalam container
    kode berada di /app tanpa repositori git sama sekali, dan indeks parent
    yang dipatok membuat seluruh koleksi test gagal, bukan hanya test ini.
    """
    for kandidat in Path(__file__).resolve().parents:
        if (kandidat / ".git").exists():
            return kandidat
    return None


def test_docxtpl_dapat_diimpor():
    import docxtpl

    assert hasattr(docxtpl, "DocxTemplate")


def test_python_docx_tetap_di_versi_terkunci():
    """docxtpl tidak boleh diam-diam menggeser pustaka inti."""
    import docx

    assert docx.__version__ == "1.1.2"


def test_template_tidak_diabaikan_git():
    """
    .gitignore memuat *.docx. Tanpa negasi, template tidak pernah masuk repo
    dan prinsip template-hanya-dari-repo runtuh tanpa pesan error apa pun.

    Diperiksa lewat `git status`, bukan `git check-ignore`. Pada mode -v,
    check-ignore mengembalikan exit 0 juga ketika yang cocok adalah pola
    NEGASI, sehingga hasilnya mudah dibaca terbalik.
    """
    akar = _akar_repo()
    if akar is None:
        pytest.skip("bukan working tree git, misalnya saat berjalan di container")

    berkas = akar / TEMPLATE_REPO
    if not berkas.exists():
        pytest.skip("templates/tsd.docx belum dibuat")

    hasil = subprocess.run(
        ["git", "status", "--porcelain", "--untracked-files=all", TEMPLATE_REPO],
        cwd=akar,
        capture_output=True,
        text=True,
    )

    assert hasil.stdout.strip(), (
        f"{TEMPLATE_REPO} tidak terlihat git, berarti masih diabaikan .gitignore"
    )
