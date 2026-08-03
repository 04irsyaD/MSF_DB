# TASKS.md — Active Task Tracker

> **Status:** OUTPUT FILE — Diupdate AI setiap task baru/selesai. Task yang done > 1 minggu dipindah ke `TASKS-ARCHIVE.md`.

---

## Active Tasks

| ID | Task | Prioritas | Rujukan |
|----|------|-----------|---------|
| T-016 | Smoke test UI: alur generate dari koneksi database dan tampilan dua pesan 429 | Tinggi — disarankan sebelum merge ke `main` | `reports/task/2026-08-03-msf-db-v2.2.0.md` bagian 6 |
| T-017 | Pasang HTTP security headers (CSP, HSTS, X-Frame-Options) | Tinggi | I-005 |
| T-018 | Refactor `_run_generate_job` dan `_run_from_db` ke `services/generation_service.py` | Sedang | TD-008, I-007 |

---

## Completed Tasks (< 1 minggu)

| ID | Task | Status | Selesai |
|----|------|--------|---------|
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
