# CHANGELOG — MSF-DB

> **Status:** DATA FILE — Catatan kronologis perubahan rilis dan milestone.

---

## [Unreleased]

### Added
- Integrasi folder panduan `ai-rules/` dari repository `docs-ai` untuk standardisasi AI Coding.
- Penambahan file `.agents/AGENTS.md` untuk konfigurasi asisten Gemini (Antigravity).
- Konfigurasi linter `.markdownlint.json` untuk menyeleksi validasi format berkas `.md` secara lokal dan di CI/CD GitHub Actions.
- Berkas awal adopsi proyek di folder `planning/` dan `dev-docs/ai/`.

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
