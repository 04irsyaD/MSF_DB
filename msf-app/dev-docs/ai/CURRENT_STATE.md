# Current State — Status Kesehatan Sistem saat Ini

> **Status:** PROJECT STATUS — Kondisi berkas, cakupan testing, dan technical debt.

---

## 1. Status Pengujian (Test Coverage & Health)

*   **Kasus Uji Backend (Pytest)**: **32 passed** (100% passing).
*   **Keamanan Linter**: **Markdownlint lulus 100% (0 errors)** berkat konfigurasi berkas `.markdownlint.json` di root repositori.
*   **Status Dependensi**: Stabil (semua image docker-compose berhasil dibuat dan berjalan normal).

---

## 2. Technical Debt (Hutang Teknis yang Belum Selesai)

Berikut adalah beberapa pekerjaan yang perlu dikerjakan pada milestone berikutnya:
1.  **Antrean Job Persisten**: Status pengerjaan saat ini masih bersifat *in-memory* di `JobQueue`. Jika backend restart, pekerjaan aktif yang sedang diproses akan hilang. Rencana selanjutnya adalah menggunakan SQLite/PostgreSQL persisten untuk antrean.
2.  **Validasi Dialek DDL**: Parser DDL saat ini masih bersifat basic regex. Untuk skema yang sangat kompleks (misal triggers/procedures), diperlukan integrasi SQLGlot parser yang lebih canggih di `sql_parser.py`.
3.  **Timeout Panggilan LLM**: Beberapa model Ollama lokal lambat merespon (terutama pada komputer tanpa GPU eksternal). Perlu penyesuaian limit timeout koneksi HTTP agar tidak memicu error `Gateway Timeout` di frontend.
