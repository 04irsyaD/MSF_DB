"""
Model dokumen — bentuk data antara metadata database dan renderer.

Berkas ini tidak mengetahui Markdown, Word, maupun HTTP. Renderer yang
menerjemahkannya, sehingga satu isi dapat ditampilkan dalam banyak bentuk
keluaran tanpa menduplikasi logika penyusunan isi.
"""

from dataclasses import dataclass, field
from typing import Dict, List, Optional

SUMBER_KOMENTAR_DB = "db_comment"
SUMBER_AI = "ai"
SUMBER_FALLBACK = "fallback"

SEMUA_SUMBER = (SUMBER_KOMENTAR_DB, SUMBER_AI, SUMBER_FALLBACK)


@dataclass
class ColumnDoc:
    """Satu baris pada tabel deskripsi field."""

    no: int
    name: str
    data_type_label: str
    description: str
    source: str
    nullable: Optional[bool] = None
    is_primary_key: bool = False
    is_foreign_key: bool = False


@dataclass
class TableDoc:
    name: str
    schema: str = "public"
    comment: Optional[str] = None
    summary: str = ""
    columns: List[ColumnDoc] = field(default_factory=list)
    foreign_keys: List[object] = field(default_factory=list)
    indexes: List[object] = field(default_factory=list)


@dataclass
class DocumentModel:
    project_name: str
    generated_at: str
    project_description: Optional[str] = None
    author: Optional[str] = None
    tables: List[TableDoc] = field(default_factory=list)

    def ringkasan_sumber(self) -> Dict[str, int]:
        """
        Hitung asal setiap deskripsi kolom.

        Dipakai untuk melaporkan seberapa besar porsi dokumen yang
        berlandaskan fakta dibanding tebakan model.
        """
        hasil = {sumber: 0 for sumber in SEMUA_SUMBER}
        for tabel in self.tables:
            for kolom in tabel.columns:
                hasil[kolom.source] = hasil.get(kolom.source, 0) + 1
        return hasil
