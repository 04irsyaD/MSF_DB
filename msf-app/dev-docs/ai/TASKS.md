# TASKS.md — Active Task Tracker

> **Status:** OUTPUT FILE — Diupdate AI setiap task baru/selesai. Task yang done > 1 minggu dipindah ke `TASKS-ARCHIVE.md`.

---

## Active Tasks

Rencana lengkap: `dev-docs/ai/SECURITY_REMEDIATION_PLAN.md` (audit keamanan backend 2026-10-16).

| ID | Task | Severity | Status |
|----|------|----------|--------|
| T-021 | Batch 0: Housekeeping — untrack `data/msf_jobs.db`, `.env.example` + `ADMIN_PASSCODE`, hapus default `admin123` | Medium | DONE (5328f54, ccd4169) |
| T-022 | Batch 1: Tutup SSRF di PDF exporter (matikan raw HTML + `link_callback`) | Critical | DONE (ccd4169) |
| T-023 | Batch 2: Tutup SSRF koneksi DB + nonaktifkan SQLite live di produksi | Critical | DONE (ef2115c, belum push) |
| T-024 | Batch 3: Redaksi `connection_string`/SQL dari log | Critical | DONE (2b2ebac, belum push) |
| T-025 | Batch 4: Upgrade dependency rentan + pisah requirements-dev | High | DONE (belum push) |
| T-026 | Batch 5: Anti-DoS — `asyncio.to_thread` untuk export/parser + batas ukuran input | High | TODO |
| T-027 | Batch 6: API key server-side via Next.js middleware + fix URL admin `localhost:3001` | High | TODO |
| T-028 | Batch 7: Rate limit per IP + whitelist model + kuota AI harian | High | TODO |
| T-029 | Batch 8: Security headers + matikan `/docs` di produksi | Medium | TODO |
| T-030 | Batch 9: Hardening admin — `compare_digest` + lockout | Medium | TODO |
| T-031 | Batch 10: Sanitasi pesan error + `X-Request-ID` | Medium | TODO |
| T-032 | Batch 11: Kode akses job 64-bit + cleanup baris SQLite | Medium | TODO |
| T-033 | Batch 12: Coding standards — pecah `schemas.py`, hapus dead code, dedup | Low | TODO |

---

## Completed Tasks (< 1 minggu)

| ID | Task | Status | Selesai |
|----|------|--------|---------|
| T-001 | Adopt ai-rules framework + setup AGENTS.md | DONE | 2026-07-02 |
| T-002 | Tambah dropdown pilihan Dialek Database pada Diagram UI | DONE | 2026-07-02 |
| T-003 | Perbaiki bug SQLParser: Parentheses Depth Counting + table-level PK detection | DONE | 2026-07-02 |
| T-004 | Implementasi Auto-Arrangement Diagram (5 layout: Horizontal, Vertikal, Grid, Radial, Organik) | DONE | 2026-07-02 |
| T-005 | Tambah 10 DDL Template contoh skenario database nyata | DONE | 2026-07-02 |
| T-006 | Refactor garis koneksi dari Bezier ke Step/Elbow Routing (H→V→H) | DONE | 2026-07-02 |
| T-007 | Implementasi layout Pusat Relasi (Hub-Centric) | DONE | 2026-07-02 |
| T-008 | Implementasi layout Grid + Pusat Relasi (Smart Grid) + fix card overlap bug | DONE | 2026-07-02 |
| T-009 | Perbaiki AI rules compliance: fix AGENTS.md bug, lengkapi dev-docs/ai/ | DONE | 2026-07-03 |
| T-010 | Implementasi pagination 5 baris, fix drawer React Portal, & responsivitas SQL Helper | DONE | 2026-09-21 |
| T-011 | Fix backdrop MaintenanceModal dengan React Portal, update badge Coming Soon, pasang modal di Admin & Shortcuts, perbaiki navbar Header /admin, dan kepatuhan Anti-Monster Rule (< 500 baris) | DONE | 2026-09-21 |
| T-012 | Implementasi Dark/Light Mode Toggle menggunakan next-themes, ThemeProvider di root layout, ThemeToggle component, dan dark mode CSS variables | DONE | 2026-10-01 |
| T-013 | Technical Debt Jalur A: Refactor Header.tsx getPageInfo() ke ROUTE_MAP pattern (TD-005) + fix deprecated event_loop fixture di conftest.py (TD-004) | DONE | 2026-10-02 |
| T-014 | Jalur B: Konfirmasi localStorage riwayat dokumentasi sudah berfungsi, tambah tombol Hapus Semua di Dashboard | DONE | 2026-10-02 |
| T-015 | Jalur B: Implementasi SQLite persistent job queue — buat job_store.py, integrasi ke job_queue.py (zero breaking change) | DONE | 2026-10-02 |
| T-016 | Jalur B: Implementasi Mermaid.js ERD export — mermaidGenerator.ts, MermaidExportModal.tsx, integrasi tombol di DiagramCanvas | DONE | 2026-10-02 |
| T-017 | SQL Helper v2 Fase 1 (Quick Wins): Salin kueri langsung di tabel, default 10 baris, dismissible info box, hapus metrik redundan, a11y, dan utility clipboard | DONE | 2026-10-09 |
| T-018 | SQL Helper v2 Fase 2 (Refactor Fondasi): Zod schema, riskMeta, labels, validate:data, useScriptFilters URL sync, dan modularisasi features/sql-helper/ | DONE | 2026-10-09 |
| T-019 | SQL Helper v2 Fase 3 (UI Baru): Cards preview 3 baris SQL, Table ringkas, Radix drawer, FilterChips faceted count, RiskToggle, SqlViewer (Shiki), dan RiskBanner confirmation | DONE | 2026-10-09 |
| T-020 | SQL Helper v2 Fase 4 (Fitur Pembeda): Parameter template {{placeholder}} + ParamForm + real-time preview, Favorit & Terakhir dipakai (localStorage), Deep link ?script=<id> + Share link + browser history sync, dan navigasi prev/next di drawer | DONE | 2026-10-09 |



---

## Backlog

| ID | Task | Priority | Notes |
|----|------|----------|-------|
| B-001 | Hover-highlight on diagram connection lines | Medium | Sudah ada dasar, perlu penyempurnaan |
| B-002 | Ekspor diagram sebagai PNG/SVG | Low | Fitur masa depan |
