"""
DocumentModel menjadi DOCX dengan mengisi template Word.

Template diperlakukan sebagai KODE, bukan data: hanya berasal dari
repositori, tidak pernah dari unggahan pengguna. docxtpl menjalankan Jinja2,
sehingga template yang dapat dikendalikan pengguna berarti eksekusi ekspresi
di server. Lihat planning/spec-template-dokumentasi-tsd.md section 9.1.
"""

import os
from io import BytesIO
from pathlib import Path
from typing import Optional

import structlog
from docxtpl import DocxTemplate
from jinja2.sandbox import SandboxedEnvironment

from app.models.schemas import StructureTemplate
from app.services.doc_model import DocumentModel

logger = structlog.get_logger()

TEMPLATES_DIR = os.getenv("TEMPLATES_DIR", "/app/templates")

# Pemetaan konstan. Nilai dari request TIDAK PERNAH dirangkai menjadi path,
# sehingga tidak ada jalan bagi "../" untuk menjangkau berkas lain.
_BERKAS_TEMPLATE = {
    StructureTemplate.MSF_TSD: "tsd.docx",
}


def _path_template(template: StructureTemplate) -> Path:
    nama = _BERKAS_TEMPLATE.get(template)
    if nama is None:
        raise ValueError(
            f"Template '{template}' tidak memiliki berkas terpetakan. "
            "Nilai enum tanpa berkas tidak boleh jatuh ke path tebakan."
        )

    akar = Path(TEMPLATES_DIR).resolve()
    berkas = (akar / nama).resolve()

    # Lapis kedua: pastikan hasil resolusi tetap berada di dalam TEMPLATES_DIR.
    if berkas.parent != akar:
        raise ValueError("Path template keluar dari direktori template.")

    if not berkas.exists():
        raise FileNotFoundError(
            f"Berkas template '{nama}' tidak ditemukan di {akar}. "
            "Pada deployment Docker direktori ini adalah bind mount, sehingga "
            "direktori host yang kosong menimpanya. Lihat "
            "backend/docs/operations/document-templates.md."
        )
    return berkas


def _konteks(model: DocumentModel, author: Optional[str]) -> dict:
    return {
        "project_name": model.project_name,
        "project_description": model.project_description or "",
        "generated_at": model.generated_at,
        "author": author or model.author or "",
        "tables": model.tables,
    }


def render_docx(
    model: DocumentModel,
    template: StructureTemplate = StructureTemplate.MSF_TSD,
    author: Optional[str] = None,
) -> bytes:
    """Isi template dengan model, kembalikan berkas DOCX sebagai bytes."""
    berkas = _path_template(template)

    dokumen = DocxTemplate(str(berkas))
    lingkungan = SandboxedEnvironment(autoescape=False)
    dokumen.render(_konteks(model, author), lingkungan)

    penyangga = BytesIO()
    dokumen.save(penyangga)
    penyangga.seek(0)

    logger.info(
        "Dokumen DOCX dirender dari template",
        template=str(template),
        tabel=len(model.tables),
    )
    return penyangga.getvalue()
