# PROJECT_MENTAL_MODEL.md — Arsitektur Mental MSF-APP

> **Status:** OUTPUT FILE — Diupdate AI saat pola arsitektur berubah secara signifikan.

---

## Gambaran Besar

MSF-APP adalah platform dokumentasi database otomatis berbasis AI. Sistem ini menerima input berupa SQL DDL (paste manual) atau koneksi database langsung, memproses skema dengan parser lokal, lalu menghasilkan dokumentasi Word (.docx) menggunakan AI (Ollama lokal / Cloud AI).

---

## Pola Aliran Data Utama

```
[User Input]
    |
    ├─ DDL Text (paste manual)  ─────────────────────────────────┐
    │                                                             |
    └─ Live DB Connection (host/user/pass/db) ──→ [DB Connector] ─┘
                                                                  |
                                                       [SQLParser (Regex)]
                                                                  |
                                                    [TableMetadata / SchemaInfo]
                                                                  |
                                                      ┌───────────┴───────────┐
                                                      |                       |
                                               [AI Provider]          [Diagram Canvas]
                                          (Ollama / DeepSeek)       (React / Custom SVG)
                                                      |
                                              [Docx Generator]
                                                      |
                                              [Download .docx]
```

---

## Prinsip Arsitektur Inti

### 1. Parser Lokal Ringan (bukan sqlparse/antlr)
SQLParser menggunakan regex kustom + algoritma Parentheses Depth Counting untuk menghindari dependency besar. Hasilnya cukup untuk ekstraksi nama tabel, kolom, tipe data, dan FK — lalu AI yang mendeskripsikan secara kontekstual.

### 2. Diagram Canvas Kustom (bukan React Flow)
`DiagramCanvas.tsx` menggunakan HTML5 drag-drop native + SVG overlay. Pendekatan ini sangat ringan dan tidak membutuhkan library besar. Layout dihitung murni dengan JavaScript (tidak ada Dagre/ELK dependency).

### 3. Background Job Queue In-Memory
Generate dokumen berjalan di background via `job_queue.py` (in-memory Queue). Tidak ada Redis/Celery karena project ini adalah developer tool skala kecil/personal.

### 4. Multi-AI Provider Pattern
Backend mendukung Ollama (lokal/offline) dan Cloud AI (DeepSeek, OpenAI). Provider dipilih berdasarkan availability check di startup.

---

## Layout Diagram — 7 Strategi

| Layout | Algoritma | Cocok Untuk |
|--------|-----------|-------------|
| Horizontal | Topological Sort + Level Assignment (LR) | Database relasional standar |
| Vertikal | Topological Sort + Level Assignment (TB) | Skema dengan banyak level hierarki |
| Grid | Index-based Grid Placement | Preview cepat semua tabel |
| Grid + Pusat Relasi | Hub Detection + 3-Column Grid | Database dengan satu tabel master utama |
| Lingkaran (Radial) | Circular Placement | Skema kecil (< 6 tabel) |
| Pusat Relasi | Hub Detection + Inner/Outer Ring | Visualisasi tabel hub dan satelitnya |
| Organik (Force) | Spring Physics (Repulsion + Attraction) | Skema tanpa pola hierarki jelas |

---

## Keputusan Desain Penting

- **Step/Elbow Routing** (bukan Bezier) dipilih untuk garis koneksi agar tidak saling silang.
- **Dynamic spacing** antar tabel berbasis tinggi tabel aktual, bukan statis.
- **Hover highlight** pada tabel menyebabkan garis yang tidak terkait memudar (opacity 0.15).
- **Collision box repulsion** ditambahkan ke layout Organik untuk mencegah tabel bertumpuk.
