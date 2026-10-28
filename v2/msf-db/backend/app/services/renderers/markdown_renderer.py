"""
DocumentModel menjadi Markdown.

Dipakai untuk preview job dan ekspor PDF. Keluarannya sengaja dijaga setara
dengan jalur lama agar template `standard` tidak berubah bagi pengguna yang
sudah terbiasa.
"""

from app.services.doc_model import DocumentModel, TableDoc

_LABEL = {
    "Indonesian": {
        "tanggal": "**Tanggal Generate:**",
        "total": "**Total Tabel:**",
        "dibuat": "**Dibuat dengan:** MSF-APP v2.0",
        "daftar": "## Daftar Tabel",
        "tabel": "Tabel",
        "kolom": "### Kolom",
        "header": "| Kolom | Tipe Data | Nullable | Keterangan |",
        "pemisah": "|-------|-----------|----------|------------|",
        "ya": "Ya",
        "tidak": "Tidak",
        "relasi": "### Relasi (Foreign Key)",
        "index": "### Index",
        "ringkasan": "## Ringkasan Relasi Antar Tabel",
        "catatan": "Catatan skema",
        "kosong": "# Dokumentasi Database\n\n*Tidak ada tabel yang ditemukan.*",
    },
    "English": {
        "tanggal": "**Generated:**",
        "total": "**Total Tables:**",
        "dibuat": "**Created with:** MSF-APP v2.0",
        "daftar": "## Table of Contents",
        "tabel": "Table",
        "kolom": "### Columns",
        "header": "| Column | Data Type | Nullable | Notes |",
        "pemisah": "|--------|-----------|----------|-------|",
        "ya": "Yes",
        "tidak": "No",
        "relasi": "### Relationships (Foreign Keys)",
        "index": "### Indexes",
        "ringkasan": "## Table Relationships Summary",
        "catatan": "Schema note",
        "kosong": "# Database Documentation\n\n*No tables found.*",
    },
}


def _label(language: str) -> dict:
    return _LABEL.get(language, _LABEL["Indonesian"])


def render_markdown(
    model: DocumentModel,
    language: str = "Indonesian",
    detail_level: str = "detailed",
) -> str:
    """Susun seluruh dokumen. Renderer tidak pernah menambah isi baru."""
    label = _label(language)
    if not model.tables:
        return label["kosong"]

    bagian = [_render_header(model, label)]
    for tabel in model.tables:
        bagian.append(_render_tabel(tabel, label, detail_level))

    if detail_level in ("detailed", "comprehensive") and len(model.tables) > 1:
        ringkasan = _render_ringkasan_relasi(model, label)
        if ringkasan:
            bagian.append(ringkasan)

    return "\n\n---\n\n".join(bagian)


def _render_header(model: DocumentModel, label: dict) -> str:
    daftar = "\n".join(
        f"- [{t.name}](#{t.name.lower().replace(' ', '-')})" for t in model.tables
    )
    deskripsi = f"\n\n{model.project_description}" if model.project_description else ""
    return (
        f"# {model.project_name}{deskripsi}\n\n"
        f"{label['tanggal']} {model.generated_at}\n"
        f"{label['total']} {len(model.tables)}\n"
        f"{label['dibuat']}\n\n"
        f"{label['daftar']}\n\n{daftar}"
    )


def _render_tabel(tabel: TableDoc, label: dict, detail_level: str) -> str:
    bagian = [f"## {label['tabel']}: `{tabel.name}`"]

    if tabel.comment:
        bagian.append(f"> {label['catatan']}: {tabel.comment.strip()}")
    if tabel.summary:
        bagian.append(tabel.summary)

    bagian.append(label["kolom"] + "\n\n" + _render_tabel_kolom(tabel, label))

    if tabel.foreign_keys:
        garis = []
        for fk in tabel.foreign_keys:
            teks = f"- `{fk.column}` → `{fk.references_table}.{fk.references_column}`"
            if fk.on_delete:
                teks += f" _(ON DELETE {fk.on_delete})_"
            garis.append(teks)
        bagian.append(label["relasi"] + "\n\n" + "\n".join(garis))

    if tabel.indexes and detail_level == "comprehensive":
        garis = []
        for idx in tabel.indexes:
            kolom_idx = ", ".join(f"`{c}`" for c in idx.columns)
            unik = " _(UNIQUE)_" if idx.is_unique else ""
            garis.append(f"- **{idx.name}**: {kolom_idx}{unik}")
        bagian.append(label["index"] + "\n\n" + "\n".join(garis))

    return "\n\n".join(bagian)


def _render_tabel_kolom(tabel: TableDoc, label: dict) -> str:
    baris = [label["header"], label["pemisah"]]
    for kolom in tabel.columns:
        if kolom.nullable is None:
            nullable = "-"
        else:
            nullable = label["ya"] if kolom.nullable else label["tidak"]

        # Penanda kunci mendahului deskripsi, bukan menggantikannya. Jalur lama
        # hanya menampilkan penanda, dan menghilangkannya akan mengurangi
        # informasi yang selama ini terlihat pengguna.
        keterangan = []
        if kolom.is_primary_key:
            keterangan.append("PK")
        if kolom.is_foreign_key:
            keterangan.append("FK")
        if kolom.description:
            keterangan.append(kolom.description)

        baris.append(
            f"| `{kolom.name}` | `{kolom.data_type_label}` | {nullable} "
            f"| {' · '.join(keterangan) if keterangan else '-'} |"
        )
    return "\n".join(baris)


def _render_ringkasan_relasi(model: DocumentModel, label: dict) -> str:
    garis = []
    for tabel in model.tables:
        for fk in tabel.foreign_keys:
            garis.append(
                f"- `{tabel.name}.{fk.column}` → "
                f"`{fk.references_table}.{fk.references_column}`"
            )
    if not garis:
        return ""
    return label["ringkasan"] + "\n\n" + "\n".join(garis)
