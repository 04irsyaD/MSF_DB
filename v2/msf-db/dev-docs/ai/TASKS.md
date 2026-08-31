# TASKS.md — Active Task Tracker

> **Status:** OUTPUT FILE — Diupdate AI setiap task baru/selesai. Task yang done > 1 minggu dipindah ke `TASKS-ARCHIVE.md`.

---

## Active Tasks

| ID | Task | Prioritas | Rujukan |
|----|------|-----------|---------|
| T-016 | Smoke test UI: **alur generate dari DDL sudah terverifikasi 2026-08-14** (lihat laporan Batch 4 section 10). Sisa: alur koneksi database langsung dan tampilan dua pesan 429 | Sedang | `reports/task/2026-08-11-batch-4-template-tsd.md` section 10 |
| T-017 | Pasang HTTP security headers (CSP, HSTS, X-Frame-Options) | Tinggi | I-005 |
| T-018 | Refactor `_run_generate_job` dan `_run_from_db` ke `services/generation_service.py` | Sedang | TD-008, I-007 |
| T-025 | `OLLAMA_DEFAULT_MODEL=llama3.2` menunjuk model yang tidak terpasang di host; yang tersedia `llama3:latest`, `deepseek-r1:8b`, `qwen3:30b` | Sedang | `reports/task/2026-08-11-batch-4-template-tsd.md` section 9.3 |
| T-024 | Keputusan isi template: seksi 3.5 Deskripsi Field View dan tiga gambar di atas 0,5 MB dibuang saat penyiapan. Perlu konfirmasi pengguna | Sedang | `reports/task/2026-08-11-batch-4-template-tsd.md` |
| T-021 | Bersihkan utang lint baseline (7 pelanggaran F401/F541 di `db_connector.py`, `ollama_provider.py`, `generate.py`, `test_api_health.py`, `test_sql_parser.py`) sebagai satu commit `chore` tersendiri | Rendah | TD-010 |
| T-022 | Payload `from-ddl` dicatat utuh ke log termasuk `sql_content`; jalur `from-db` menyamarkan password tetapi `from-ddl` tidak menyamarkan apa pun | Sedang | `planning/spec-template-dokumentasi-tsd.md` §9.7 |

---

## Completed Tasks (< 1 minggu)

| ID | Task | Status | Selesai |
|----|------|--------|---------|
| T-023 | Frontend: selector Struktur Dokumen pada GeneratePanel, `structure_template` diteruskan kedua payload | DONE | 2026-08-14 |
| T-020 | Batch 4 — template TSD dengan `docxtpl`, renderer DOCX bersandbox, penyiapan template terskrip, ADR-006 | DONE | 2026-08-11 |
| T-019 | Batch 1-3 — dokumentasi berbasis komentar database, parser penyaring halusinasi, `DocumentModel`, renderer Markdown, `structure_template` | DONE | 2026-08-11 |
| T-010 | v2.2.0 — Antrean job persisten SQLite (`job_store.py`, rekonsiliasi job yatim, retensi dua tingkat) | DONE | 2026-08-03 |
| T-011 | v2.2.0 — Rate limiting per IP dengan slowapi dan pembedaan dua jenis 429 | DONE | 2026-08-03 |
| T-012 | v2.2.0 — Dukungan SQL Server (`pyodbc`, `msodbcsql18`, Driver 18) | DONE | 2026-08-03 |
| T-013 | v2.2.0 — Hapus passcode admin default dan pakai `compare_digest` | DONE | 2026-08-03 |
| T-014 | v2.2.0 — Isolasi sumber daya v2 dan pembenahan config drift `.env.example` | DONE | 2026-08-03 |
| T-015 | v2.2.0 — ADR-005, tiga dokumen operations, sinkronisasi dev-docs dan planning | DONE | 2026-08-03 |
| T-001 | Adopt ai-rules framework + setup AGENTS.md | DONE | 2026-07-02 |
| T-002 | Tambah dropdown pilihan Dialek Database pada Diagram UI | DONE | 2026-07-02 |
| T-003 | Perbaiki bug SQLParser: Parentheses Depth Counting + table-level PK detection | DONE | 2026-07-02 |
| T-004 | Implementasi Auto-Arrangement Diagram (5 layout: Horizontal, Vertikal, Grid, Radial, Organik) | DONE | 2026-07-02 |
| T-005 | Tambah 10 DDL Template contoh skenario database nyata | DONE | 2026-07-02 |
| T-006 | Refactor garis koneksi dari Bezier ke Step/Elbow Routing (H→V→H) | DONE | 2026-07-02 |
| T-007 | Implementasi layout Pusat Relasi (Hub-Centric) | DONE | 2026-07-02 |
| T-008 | Implementasi layout Grid + Pusat Relasi (Smart Grid) + fix card overlap bug | DONE | 2026-07-02 |
| T-009 | Perbaiki AI rules compliance: fix AGENTS.md bug, lengkapi dev-docs/ai/ | DONE | 2026-07-03 |
| T-010 | Perombakan UI/UX & Restrukturisasi IA terinspirasi dari Databricks & dbdiagram | DONE | 2026-07-06 |

---

## Backlog

| ID | Task | Priority | Notes |
|----|------|----------|-------|
| B-001 | Hover-highlight on diagram connection lines | Medium | Sudah ada dasar, perlu penyempurnaan |
| B-002 | Ekspor diagram sebagai PNG/SVG | Low | Fitur masa depan |
