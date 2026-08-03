# CHANGELOG — MSF-DB

> **Status:** DATA FILE — Catatan kronologis perubahan rilis dan milestone.

---

## [Unreleased]

### Added
- Integrasi folder panduan `ai-rules/` dari repository `docs-ai` untuk standardisasi AI Coding.
- Penambahan file `.agents/AGENTS.md` untuk konfigurasi asisten Gemini (Antigravity).
- Konfigurasi linter `.markdownlint.json` untuk menyeleksi validasi format berkas `.md` secara lokal dan di CI/CD GitHub Actions.
- Berkas awal adopsi proyek di folder `planning/` dan `dev-docs/ai/`.
- Perbaikan bug SQL Parser backend menggunakan algoritma Parentheses Depth Counting untuk menghindari pemotongan nilai `DEFAULT` pada PostgreSQL.
- Peningkatan deteksi `PRIMARY KEY` table-level yang diawali oleh `CONSTRAINT` pada SQLParser.
- Fitur dropdown pilihan **Dialek Database** (PostgreSQL, MySQL, SQLite, SQL Server) pada MSF Diagram UI.
- Fitur **Auto-Arrangement Diagram** dengan 7 variasi layout (Horizontal, Vertikal, Grid, Grid + Pusat Relasi, Radial, Pusat Relasi, Organik/Force-directed).
- Fitur **Dataset 10 Template Contoh DDL** skenario database nyata (Blog, E-Commerce, HR, Akademik, Jejaring Sosial, SaaS, Booking, Gudang, Perpustakaan, Rumah Sakit) dengan kapasitas 3-10 tabel.
- Peningkatan kualitas visual diagram: garis koneksi diganti dari **Bezier Curve** ke **Step/Elbow Routing** (H→V→H), dengan dynamic side selection, FK row-level exit/entry point, dan parallel line offset.
- Spacing antar tabel kini **dinamis** berdasarkan tinggi aktual tabel tertinggi (tidak lagi statis).
- Ditambahkan **arrowhead** di ujung garis koneksi untuk memperjelas arah relasi FK.
- Fitur **Layout Pusat Relasi (Hub-Centric)** secara pintar memposisikan tabel hub utama dengan derajat relasi tertinggi di pusat kanvas, diiringi satelit langsung di lingkaran dalam, dan sisanya di lingkaran luar.
- Fitur **Layout Grid + Pusat Relasi (Smart Grid)** mengunci tabel ke dalam struktur baris-kolom rapi, namun mengurutkannya secara relasional (Parent di kiri, Hub Utama di tengah, dan Child di kanan).
- Perbaikan bug **tabel saling tertimpa (overlap)**: radius lingkar dalam/luar pada layout Radial dan Pusat Relasi kini dihitung secara dinamis, serta ditambahkan penguat tolakan tabrakan (collision box repulsion) di simulasi layout Organik.
- Perbaikan **compliance AI rules**: fix bug struktur aturan #11 dan #13 yang terputus di `ai-rules/AGENTS.md`, serta melengkapi folder output `dev-docs/` yang sebelumnya belum tersedia: `dev-docs/ai/TASKS.md`, `KNOWN_ISSUES.md`, `TECHNICAL_DEBT.md`, `FINAL_SYSTEM_HANDOVER.md`, `PROJECT_MENTAL_MODEL.md`, `dev-docs/architecture/` (4 file), `dev-docs/modules/README.md`, `dev-docs/decisions/` (index + 4 ADR).

---

## [v2.1.0] — 2026-06-29

### Added
- Fitur **Kode Akses Pelacakan** (`access_code`) untuk melacak status pengerjaan dokumentasi secara instan.
- Pop-up modal "Simpan Kode Pelacakan" otomatis di awal proses koding untuk menyalin kode akses.
- Kolom input "Lacak Pekerjaan Aktif" di halaman generator utama.
- Pendaftaran parameter `access_code` ke dalam skema response Pydantic (`JobStatusResponse` dan `GenerateJobResponse`) di backend.

### Changed
- UI Redesign dengan tema Emerald Light Mode premium (Supabase/Linear inspired style) pada dashboard, halaman generator, dan shortcuts.

---

## [v2.0.0] — 2026-06-25

### Added
- Inisialisasi basis kode utama MSF-DB.
- Integrasi LLM lokal Ollama dan cloud API (DeepSeek & OpenAI).
- Dukungan parsing skema SQL DDL dan ekstraksi database PostgreSQL, MySQL, SQLite, SQL Server.
- Modul ekspor ke dokumen Microsoft Word (DOCX) dan PDF.
- DBA Shortcuts Manager untuk pencarian cepat kueri SQL.
- Admin stats dashboard dan endpoint sensor log server.
