"""
Documentation Generator — generate Markdown dari metadata tabel menggunakan AI.
"""

import os
from typing import List, Optional
import structlog

from app.models.schemas import (
    TableMetadata, DBMetadataResponse,
    OutputLanguage, DetailLevel, AIProviderType,
)
from app.services.ai_provider import AIProvider
from app.services.ollama_provider import ollama_provider
from app.services.cloud_provider import deepseek_provider, openai_provider
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
    ):
        self.provider = provider
        self.model = model
        self.language = language
        self.detail_level = detail_level
        self.business_context = business_context

    async def generate_from_tables(
        self,
        tables: List[TableMetadata],
        project_name: str,
        job: Optional[Job] = None,
    ) -> str:
        """
        Generate dokumentasi lengkap untuk semua tabel.
        Update job progress jika job diberikan.
        """
        if not tables:
            return "# Dokumentasi Database\n\n*Tidak ada tabel yang ditemukan.*"

        total = len(tables)
        if job:
            job.update(tables_total=total, tables_processed=0)

        sections = [self._build_header(project_name, tables)]

        for i, table in enumerate(tables):
            if job:
                job.update(
                    current_table=table.name,
                    tables_processed=i,
                    progress=int((i / total) * 90),  # 0-90% untuk AI, 90-100% untuk export
                    status=JobStatus.PROCESSING,
                )

            logger.info(f"Generating docs for table: {table.name}")

            try:
                table_doc = await self._generate_table_doc(table)
                sections.append(table_doc)
            except Exception as e:
                logger.error(f"Gagal generate docs untuk {table.name}", error=str(e))
                sections.append(self._fallback_table_doc(table, str(e)))

        # Summary relasi antar tabel
        if self.detail_level in ("detailed", "comprehensive") and len(tables) > 1:
            relations_section = self._build_relations_summary(tables)
            sections.append(relations_section)

        if job:
            job.update(tables_processed=total, progress=90)

        full_doc = "\n\n---\n\n".join(sections)

        # Simpan preview (500 karakter pertama)
        if job:
            job.update(preview_markdown=full_doc[:500] + "..." if len(full_doc) > 500 else full_doc)

        return full_doc

    def _build_header(self, project_name: str, tables: List[TableMetadata]) -> str:
        """Buat header dokumentasi"""
        from datetime import datetime, timezone
        now = datetime.now(timezone.utc).strftime("%d %B %Y")

        table_list = "\n".join(
            f"- [{t.name}](#{t.name.lower().replace(' ', '-')})"
            for t in tables
        )

        if self.language == OutputLanguage.INDONESIAN:
            return f"""# {project_name}

**Tanggal Generate:** {now}
**Total Tabel:** {len(tables)}
**Dibuat dengan:** MSF-APP v2.0

## Daftar Tabel

{table_list}"""
        else:
            return f"""# {project_name}

**Generated:** {now}
**Total Tables:** {len(tables)}
**Created with:** MSF-APP v2.0

## Table of Contents

{table_list}"""

    async def _generate_table_doc(self, table: TableMetadata) -> str:
        """Generate dokumentasi satu tabel menggunakan AI"""
        prompt = self._build_prompt(table)
        ai_description = await self.provider.generate(prompt, self.model)

        # Bangun markdown tabel kolom
        columns_md = self._build_columns_table(table)

        # FK section
        fk_section = self._build_fk_section(table) if table.foreign_keys else ""

        # Index section
        idx_section = self._build_index_section(table) if (
            table.indexes and self.detail_level == "comprehensive"
        ) else ""

        if self.language == OutputLanguage.INDONESIAN:
            return f"""## Tabel: `{table.name}`

{ai_description}

### Kolom

{columns_md}
{fk_section}{idx_section}"""
        else:
            return f"""## Table: `{table.name}`

{ai_description}

### Columns

{columns_md}
{fk_section}{idx_section}"""

    def _build_prompt(self, table: TableMetadata) -> str:
        """Bangun prompt untuk AI berdasarkan metadata tabel"""
        # Buat representasi teks dari kolom
        cols_text = []
        for col in table.columns:
            flags = []
            if col.is_primary_key:
                flags.append("PRIMARY KEY")
            if col.is_foreign_key:
                flags.append("FOREIGN KEY")
            if not col.is_nullable:
                flags.append("NOT NULL")
            if col.default_value:
                flags.append(f"DEFAULT {col.default_value}")

            col_desc = f"  - {col.name} ({col.data_type})"
            if flags:
                col_desc += f" [{', '.join(flags)}]"
            cols_text.append(col_desc)

        cols_repr = "\n".join(cols_text)

        # FK info
        fk_text = ""
        if table.foreign_keys:
            fk_lines = [
                f"  - {fk.column} → {fk.references_table}.{fk.references_column}"
                for fk in table.foreign_keys
            ]
            fk_text = f"\nForeign Keys:\n" + "\n".join(fk_lines)

        # Context tambahan
        context_text = ""
        if self.business_context:
            if self.language == OutputLanguage.INDONESIAN:
                context_text = f"\nKonteks Bisnis: {self.business_context}"
            else:
                context_text = f"\nBusiness Context: {self.business_context}"

        # Row count hint
        row_hint = ""
        if table.row_count is not None:
            row_hint = f"\nJumlah data saat ini: {table.row_count:,} baris"

        if self.language == OutputLanguage.INDONESIAN:
            detail_instruction = {
                "simple": "Berikan deskripsi singkat (2-3 kalimat) tentang tujuan tabel ini.",
                "detailed": "Berikan deskripsi mendetail tentang tujuan tabel, deskripsi singkat tiap kolom penting, dan hubungannya dengan tabel lain.",
                "comprehensive": "Berikan dokumentasi komprehensif: tujuan tabel, penjelasan setiap kolom, relasi, use case bisnis, dan catatan teknis penting.",
            }.get(self.detail_level, "Berikan deskripsi mendetail.")

            return f"""Kamu adalah ahli dokumentasi database. Buat dokumentasi dalam Bahasa Indonesia untuk tabel database berikut:

Nama Tabel: {table.name}
Schema: {table.schema}
{row_hint}

Kolom:
{cols_repr}
{fk_text}{context_text}

Instruksi: {detail_instruction}
Tulis dalam format prosa yang jelas. Jangan ulangi informasi yang sudah ada di tabel kolom.
Fokus pada: APA tujuan tabel ini, MENGAPA kolom-kolom ini ada, dan BAGAIMANA tabel ini digunakan.
Jawaban hanya berisi deskripsi, tanpa heading atau markdown tambahan."""

        else:
            detail_instruction = {
                "simple": "Provide a brief description (2-3 sentences) about this table's purpose.",
                "detailed": "Provide a detailed description about the table purpose, brief explanation of important columns, and its relationship with other tables.",
                "comprehensive": "Provide comprehensive documentation: table purpose, column explanations, relationships, business use cases, and important technical notes.",
            }.get(self.detail_level, "Provide a detailed description.")

            return f"""You are a database documentation expert. Create documentation in English for the following database table:

Table Name: {table.name}
Schema: {table.schema}
{row_hint}

Columns:
{cols_repr}
{fk_text}{context_text}

Instruction: {detail_instruction}
Write in clear prose format. Do not repeat information already shown in the column table.
Focus on: WHAT is the purpose of this table, WHY these columns exist, and HOW this table is used.
Response should contain only the description, without additional headings or markdown."""

    def _build_columns_table(self, table: TableMetadata) -> str:
        """Buat tabel Markdown untuk kolom"""
        if self.language == OutputLanguage.INDONESIAN:
            header = "| Kolom | Tipe Data | Nullable | Keterangan |"
            separator = "|-------|-----------|----------|------------|"
        else:
            header = "| Column | Data Type | Nullable | Notes |"
            separator = "|--------|-----------|----------|-------|"

        rows = []
        for col in table.columns:
            flags = []
            if col.is_primary_key:
                flags.append("🔑 PK")
            if col.is_foreign_key:
                flags.append("🔗 FK")
            if col.default_value:
                flags.append(f"default: `{col.default_value}`")

            nullable = "Ya" if col.is_nullable else "Tidak" if self.language == OutputLanguage.INDONESIAN else ("Yes" if col.is_nullable else "No")
            notes = " · ".join(flags) if flags else "-"
            rows.append(f"| `{col.name}` | `{col.data_type}` | {nullable} | {notes} |")

        return "\n".join([header, separator] + rows)

    def _build_fk_section(self, table: TableMetadata) -> str:
        """Buat seksi foreign key"""
        if not table.foreign_keys:
            return ""

        if self.language == OutputLanguage.INDONESIAN:
            title = "\n### Relasi (Foreign Key)\n"
        else:
            title = "\n### Relationships (Foreign Keys)\n"

        lines = []
        for fk in table.foreign_keys:
            line = f"- `{fk.column}` → `{fk.references_table}.{fk.references_column}`"
            if fk.on_delete:
                line += f" _(ON DELETE {fk.on_delete})_"
            lines.append(line)

        return title + "\n".join(lines) + "\n"

    def _build_index_section(self, table: TableMetadata) -> str:
        """Buat seksi index (untuk comprehensive mode)"""
        if not table.indexes:
            return ""

        if self.language == OutputLanguage.INDONESIAN:
            title = "\n### Index\n"
        else:
            title = "\n### Indexes\n"

        lines = []
        for idx in table.indexes:
            cols = ", ".join(f"`{c}`" for c in idx.columns)
            idx_type = " _(UNIQUE)_" if idx.is_unique else ""
            lines.append(f"- **{idx.name}**: {cols}{idx_type}")

        return title + "\n".join(lines) + "\n"

    def _build_relations_summary(self, tables: List[TableMetadata]) -> str:
        """Buat ringkasan relasi antar tabel"""
        all_fks = []
        for table in tables:
            for fk in table.foreign_keys:
                all_fks.append(f"- `{table.name}.{fk.column}` → `{fk.references_table}.{fk.references_column}`")

        if not all_fks:
            return ""

        if self.language == OutputLanguage.INDONESIAN:
            return f"""## Ringkasan Relasi Antar Tabel

{chr(10).join(all_fks)}"""
        else:
            return f"""## Table Relationships Summary

{chr(10).join(all_fks)}"""

    def _fallback_table_doc(self, table: TableMetadata, error: str) -> str:
        """Fallback jika AI gagal — generate dokumentasi dasar tanpa AI"""
        columns_md = self._build_columns_table(table)
        fk_section = self._build_fk_section(table) if table.foreign_keys else ""

        note = f"\n> ⚠️ AI description tidak tersedia: {error[:100]}\n"

        if self.language == OutputLanguage.INDONESIAN:
            return f"""## Tabel: `{table.name}`

{note}

### Kolom

{columns_md}
{fk_section}"""
        else:
            return f"""## Table: `{table.name}`

{note}

### Columns

{columns_md}
{fk_section}"""
