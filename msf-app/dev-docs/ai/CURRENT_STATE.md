# Current State — Status Kesehatan Sistem saat Ini

> **Status:** PROJECT STATUS — Kondisi berkas, cakupan testing, dan technical debt.
> **Terakhir diupdate:** 2026-10-19

---

## 1. Status Pengujian (Test Coverage & Health)

*   **Kasus Uji Backend (Pytest)**: **93 passed** (100% passing, termasuk 39 test guard anti-SSRF koneksi DB, 7 test redaksi log, 10 test anti-DoS).
*   **Keamanan Linter**: **Markdownlint lulus 100% (0 errors)** berkat konfigurasi berkas `.markdownlint.json` di root repositori.
*   **Audit Dependensi**: `pip-audit -r requirements.txt` → **0 kerentanan** (sebelumnya 48 di 7 package). Dicek otomatis di CI `.github/workflows/backend-security.yml`.
*   **Status Dependensi**: Stabil (semua image docker-compose berhasil dibuat dan berjalan normal).
*   **TypeScript Check (Frontend)**: `npm run type-check` (`tsc --noEmit`) → **0 error** (terverifikasi pasca SQL Helper v2 Fase 4).
*   **Validasi Data SQL Helper**: `npm run validate:data` → **27 skrip valid 100%** across 2 datasets.
*   **Unit Tests Frontend**: `npm run test:sql-helper` → **7 passed** (100% passing parameter validation & interpolation).
*   **Production Build**: `npm run build` → **11/11 halaman statis sukses** (bundle `/sql-helper` 71.1 kB).

---

## 2. Fitur Terakhir yang Diselesaikan

| Task ID | Fitur | Tanggal |
|---------|-------|---------|
| T-026 | Security Batch 5: export/parser via `asyncio.to_thread`, batas ukuran field, batas body global 2 MB (413) | 2026-10-19 |
| T-025 | Security Batch 4: upgrade 7 package rentan (FastAPI 0.146 / Starlette 1.9, dll), `requirements-dev.txt`, CI `pip-audit` + pytest | 2026-10-19 |
| T-024 | Security Batch 3: redaksi log global (`redact.py`), log generate hanya metadata, log validasi tanpa input mentah | 2026-10-19 |
| T-023 | Security Batch 2: guard anti-SSRF koneksi DB live (`db_url_guard.py`), SQLite live nonaktif di produksi, kategori error koneksi | 2026-10-19 |
| T-020 | SQL Helper v2 Fase 4 (Template params `{{x}}`, Favorites & Recent localStorage, Deep link `?script=`, Drawer Prev/Next) | 2026-10-09 |
| T-019 | SQL Helper v2 Fase 3 (UI Baru: Cards preview 3 baris SQL, Table ringkas, Radix drawer, FilterChips, Shiki SqlViewer) | 2026-10-09 |
| T-018 | SQL Helper v2 Fase 2 (Refactor Fondasi: Zod schema, riskMeta, labels, validate:data, useScriptFilters URL sync) | 2026-10-09 |
| T-017 | SQL Helper v2 Fase 1 (Quick Wins: Salin langsung, default 10 baris, dismissible info, a11y, clipboard utility) | 2026-10-09 |
| T-012 | Dark/Light Mode Toggle (`next-themes`, ThemeProvider, semantic tokens) | 2026-10-01 |
| T-011 | Fix MaintenanceModal React Portal, ekspansi ke Admin & Shortcuts | 2026-09-21 |
| T-010 | SQL Helper pagination, Drawer React Portal, responsivitas | 2026-09-21 |

---

## 3. Technical Debt (Hutang Teknis yang Belum Selesai)

Berikut adalah pekerjaan yang perlu dikerjakan pada milestone berikutnya:

1.  **Antrean Job Persisten**: Status pengerjaan saat ini masih bersifat *in-memory* di `JobQueue`. Jika backend restart, pekerjaan aktif yang sedang diproses akan hilang. Rencana selanjutnya adalah menggunakan SQLite/PostgreSQL persisten untuk antrean.
2.  **Validasi Dialek DDL**: Parser DDL saat ini masih bersifat basic regex. Untuk skema yang sangat kompleks (misal triggers/procedures), diperlukan integrasi SQLGlot parser yang lebih canggih di `sql_parser.py`.
3.  **Timeout Panggilan LLM**: Beberapa model Ollama lokal lambat merespon (terutama pada komputer tanpa GPU eksternal). Perlu penyesuaian limit timeout koneksi HTTP agar tidak memicu error `Gateway Timeout` di frontend.
4.  **Semantic Token Migration** (TD-006): Dark mode menggunakan CSS fallback override karena banyak komponen masih hardcode Tailwind colors (`bg-white`, `text-gray-900`). Perlu migrasi bertahap ke semantic tokens.
5.  **Header ROUTE_MAP Refactor** (TD-005): `getPageInfo()` di `Header.tsx` masih if-else chain — kurang scalable saat rute bertambah.
