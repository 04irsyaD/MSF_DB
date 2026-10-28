"""
Documentation Generator — generate Markdown dari metadata tabel menggunakan AI.
"""

import os
from datetime import datetime, timezone
from typing import List, Optional
import structlog

from app.models.schemas import AIProviderType, OutputLanguage, TableMetadata
from app.services.ai_provider import AIProvider
from app.services.ai_column_parser import (
    BATAS_RINGKASAN,
    parse_keluaran_kolom,
    sanitasi_teks,
)
from app.services.doc_model import (
    SUMBER_AI,
    SUMBER_FALLBACK,
    SUMBER_KOMENTAR_DB,
    ColumnDoc,
    DocumentModel,
    TableDoc,
)
from app.services.ollama_provider import ollama_provider
from app.services.cloud_provider import deepseek_provider, openai_provider
from app.services.renderers.markdown_renderer import render_markdown
from app.background.job_queue import Job, JobStatus

logger = structlog.get_logger()

DEFAULT_LANGUAGE = os.getenv("DEFAULT_LANGUAGE", "Indonesian")
DEFAULT_DETAIL_LEVEL = os.getenv("DEFAULT_DETAIL_LEVEL", "detailed")


def get_provider(provider_type: str) -> AIProvider:
    """Pilih AI provider berdasarkan tipe"""
    mapping = {
        AIProviderType.OLLAMA: ollama_provider,
        AIProviderType.DEEPSEEK: deepseek_provider,
        AIProviderType.OPENAI: openai_provider,
        "ollama": ollama_provider,
        "deepseek": deepseek_provider,
        "openai": openai_provider,
    }
    provider = mapping.get(provider_type)
    if not provider:
        raise ValueError(f"Provider tidak dikenal: {provider_type}")
    return provider


class DocGenerator:
    """
    Generate dokumentasi Markdown dari metadata database menggunakan AI.
    """

    def __init__(
        self,
        provider: AIProvider,
        model: str,
        language: str = DEFAULT_LANGUAGE,
        detail_level: str = DEFAULT_DETAIL_LEVEL,
        business_context: Optional[str] = None,
        project_description: Optional[str] = None,
    ):
        self.provider = provider
        self.model = model
        self.language = language
        self.detail_level = detail_level
        self.business_context = business_context
        self.project_description = project_description

    async def generate_from_tables(
        self,
        tables: List[TableMetadata],
        project_name: str,
        job: Optional[Job] = None,
    ) -> str:
        """
        Bangun model dokumen lalu render menjadi Markdown.

        Penyusunan isi dan penyusunan tampilan sengaja dipisah: model yang
        sama kelak dapat dirender ke bentuk keluaran lain tanpa menduplikasi
        logika pengisian deskripsi.
        """
        model = await self.build_document_model(tables, project_name, job=job)
        markdown = render_markdown(model, self.language, self.detail_level)

        if job:
            preview = markdown[:2000] + "\n\n..." if len(markdown) > 2000 else markdown
            job.update(preview_markdown=preview)

        logger.info(
            "Dokumen selesai dibangun",
            tabel=len(model.tables),
            sumber=model.ringkasan_sumber(),
        )
        return markdown

    def _deskripsi_fallback(self, kolom, tabel) -> str:
        """Dipakai saat komentar database kosong dan AI tidak memberi hasil."""
        if kolom.is_primary_key:
            return "Primary key"
        for fk in tabel.foreign_keys:
            if fk.column == kolom.name:
                return f"Referensi ke {fk.references_table}.{fk.references_column}"
        return "-"

    def _prompt_kolom(self, tabel, nama_kolom_diminta) -> str:
        """
        Minta satu baris per kolom, bukan prosa bebas.

        Instruksi ditulis positif, bukan berupa larangan. Model kecil
        mengabaikan larangan seperti "jangan pakai heading", tetapi menurut
        permintaan berbentuk contoh format.
        """
        baris_kolom = []
        for kolom in tabel.columns:
            penanda = []
            if kolom.is_primary_key:
                penanda.append("PRIMARY KEY")
            if kolom.is_foreign_key:
                penanda.append("FOREIGN KEY")
            keterangan = f" [{', '.join(penanda)}]" if penanda else ""
            sudah = " (sudah ada keterangan)" if kolom.column_comment else ""
            baris_kolom.append(f"- {kolom.name} ({kolom.data_type}){keterangan}{sudah}")

        konteks = ""
        if tabel.table_comment:
            konteks += f"\nKeterangan tabel: {tabel.table_comment.strip()}"
        if self.business_context:
            konteks += f"\nKonteks bisnis: {self.business_context}"
        if self.project_description:
            konteks += f"\nDeskripsi proyek: {self.project_description}"

        diminta = ", ".join(nama_kolom_diminta)

        # Bahasa WAJIB dinyatakan eksplisit. Prompt berbahasa Indonesia saja
        # tidak cukup: model tetap menjawab dalam bahasa Inggris untuk baris
        # per kolom, meskipun ringkasannya mengikuti bahasa prompt.
        bahasa = (
            "Bahasa Indonesia"
            if self.language == OutputLanguage.INDONESIAN
            else "English"
        )

        return f"""Kamu ahli dokumentasi database. Tabel: {tabel.name}

Tulis SELURUH jawaban dalam {bahasa}.

Kolom:
{chr(10).join(baris_kolom)}{konteks}

Tulis jawaban dalam format berikut, tanpa tambahan apa pun:
RINGKASAN: <satu kalimat tentang kegunaan tabel ini>
<nama_kolom> | <deskripsi singkat satu kalimat>

Tulis satu baris untuk setiap kolom berikut saja: {diminta}
Pakai nama kolom persis seperti tertulis di atas.
Jangan menambah kolom yang tidak ada dalam daftar."""

    async def build_document_model(
        self, tables, project_name: str, job=None
    ) -> DocumentModel:
        """Satukan metadata dan keluaran AI menjadi model dokumen."""
        model = DocumentModel(
            project_name=project_name,
            generated_at=datetime.now(timezone.utc).strftime("%d %B %Y"),
            project_description=self.project_description,
        )

        total = len(tables)
        if job:
            job.update(tables_total=total, tables_processed=0)

        for indeks, tabel in enumerate(tables):
            if job:
                if job.status == JobStatus.CANCELLED:
                    logger.info("Job dibatalkan oleh user", job_id=job.job_id)
                    raise RuntimeError("Job dibatalkan oleh pengguna.")
                job.update(
                    current_table=tabel.name,
                    tables_processed=indeks,
                    progress=int((indeks / total) * 90) if total else 0,
                    status=JobStatus.PROCESSING,
                )

            model.tables.append(await self._bangun_tabel(tabel))

        if job:
            job.update(tables_processed=total, progress=90)

        return model

    async def _bangun_tabel(self, tabel) -> TableDoc:
        """
        Rantai pengisian per kolom: komentar database, lalu AI, lalu metadata.

        Kolom yang sudah punya komentar tidak pernah ditanyakan ke AI,
        sehingga tidak mungkin dikarang.
        """
        tanpa_komentar = [k.name for k in tabel.columns if not k.column_comment]

        ringkasan = ""
        deskripsi_ai = {}
        if tanpa_komentar:
            try:
                keluaran = await self.provider.generate(
                    self._prompt_kolom(tabel, tanpa_komentar), self.model
                )
                ringkasan, deskripsi_ai, ditolak = parse_keluaran_kolom(
                    keluaran, [k.name for k in tabel.columns]
                )
                if ditolak:
                    logger.warning(
                        "Kolom karangan dibuang parser",
                        tabel=tabel.name,
                        jumlah=ditolak,
                    )
            except Exception as e:
                logger.error(
                    "Gagal ambil deskripsi kolom", tabel=tabel.name, error=str(e)
                )

        kolom_doc = []
        for nomor, kolom in enumerate(tabel.columns, start=1):
            if kolom.column_comment:
                deskripsi = sanitasi_teks(kolom.column_comment, BATAS_RINGKASAN)
                sumber = SUMBER_KOMENTAR_DB
            elif kolom.name in deskripsi_ai:
                deskripsi = deskripsi_ai[kolom.name]
                sumber = SUMBER_AI
            else:
                deskripsi = self._deskripsi_fallback(kolom, tabel)
                sumber = SUMBER_FALLBACK

            kolom_doc.append(
                ColumnDoc(
                    no=nomor,
                    name=kolom.name,
                    data_type_label=kolom.data_type,
                    description=deskripsi,
                    source=sumber,
                    nullable=kolom.is_nullable,
                    is_primary_key=kolom.is_primary_key,
                    is_foreign_key=kolom.is_foreign_key,
                )
            )

        return TableDoc(
            name=tabel.name,
            schema=tabel.schema,
            comment=tabel.table_comment,
            summary=ringkasan,
            columns=kolom_doc,
            foreign_keys=list(tabel.foreign_keys),
            indexes=list(tabel.indexes),
        )

