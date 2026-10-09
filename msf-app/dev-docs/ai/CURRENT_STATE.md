# Current State — Status Kesehatan Sistem saat Ini

> **Status:** PROJECT STATUS — Kondisi berkas, cakupan testing, dan technical debt.
> **Terakhir diupdate:** 2026-10-02

---

## 1. Status Pengujian (Test Coverage & Health)

*   **Kasus Uji Backend (Pytest)**: **32 passed** (100% passing).
*   **Keamanan Linter**: **Markdownlint lulus 100% (0 errors)** berkat konfigurasi berkas `.markdownlint.json` di root repositori.
*   **Status Dependensi**: Stabil (semua image docker-compose berhasil dibuat dan berjalan normal).
*   **TypeScript Check (Frontend)**: `npx tsc --noEmit` → **0 error** (terverifikasi pasca T-012 dark mode).

---

## 2. Fitur Terakhir yang Diselesaikan

| Task ID | Fitur | Tanggal |
|---------|-------|---------|
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
