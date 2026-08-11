# Current State — Status Kesehatan Sistem saat Ini

> **Status:** PROJECT STATUS — Kondisi berkas, cakupan testing, dan technical debt.

---

## 1. Status Pengujian (Test Coverage & Health)

*   **Kasus Uji Backend (Pytest)**: **195 passed** (100% passing) per 2026-08-11, naik dari 32 pada v2.1.0. Tambahan Batch 1-3 berasal dari `test_doc_generator.py`, `test_db_comments.py`, `test_ai_determinism.py`, `test_generate_settings.py`, `test_tanpa_emoji.py`, `test_doc_model.py`, `test_ai_column_parser.py`, `test_doc_model_builder.py`, `test_markdown_renderer.py`, `test_structure_template.py`, serta perluasan `test_rate_limit.py`.
*   **Ukuran berkas setelah pemecahan**: `doc_generator.py` 248 baris (sebelumnya 375), `markdown_renderer.py` 155, `ai_column_parser.py` 84, `doc_model.py` 63. Seluruhnya di bawah rekomendasi 400 baris untuk Service.
*   **Lingkungan verifikasi**: jalankan pytest dari venv lokal `backend/.venv`. Container `msf2-backend` **tidak** mem-bind-mount kode aplikasi (`docker-compose.yml` hanya memasang `templates`, `shortcuts_data`, dan volume outputs), sehingga perubahan kode tidak terlihat di sana tanpa rebuild image.
*   **Kasus Uji Frontend**: **tidak ada sama sekali.** Tidak ada jest, vitest, maupun playwright di `package.json` (TD-012). Verifikasi frontend hanya lewat `npm run build`.
*   **Linter Backend (ruff)**: 18 pelanggaran terbawa dari baseline msf-app, tidak satu pun berasal dari v2.2.0 (TD-010). Seluruh berkas yang disentuh v2.2.0 lulus ruff.
*   **Linter Frontend (ESLint)**: **tidak dapat dijalankan** — tidak ada `.eslintrc.json` sehingga `next lint` berhenti menunggu jawaban interaktif (TD-011).
*   **Keamanan Linter**: **Markdownlint lulus 100% (0 errors)** berkat konfigurasi berkas `.markdownlint.json` di root repositori.
*   **Status Dependensi**: Stabil. Image backend berhasil dibuat termasuk `msodbcsql18`; `pyodbc.drivers()` di dalam container mengembalikan `ODBC Driver 18 for SQL Server`.
*   **Verifikasi Runtime**: v2 terbukti berjalan bersamaan dengan msf-app. Persistensi, rekonsiliasi job yatim, dan kedua jenis 429 diverifikasi langsung terhadap container yang berjalan (lihat `reports/task/2026-08-03-msf-db-v2.2.0.md`).

---

## 1a. Status Keamanan (diperbarui 2026-08-04)

Tinjauan keamanan dijalankan pada branch `dev` tanggal 2026-08-04.

*   **Temuan tinjauan**: 1 severity Medium (certificate validation bypass pada koneksi SQL Server) — **sudah ditutup** dengan mengubah bawaan `MSSQL_TRUST_SERVER_CERTIFICATE` menjadi `no`.
*   **Terbukti aman**: tidak ada SQL injection di `job_store.py` (seluruh query memakai binding), tidak ada path traversal di endpoint download, dan tidak ada header injection di `Content-Disposition` (nama proyek disaring).
*   **PERUBAHAN ASUMSI 2026-08-11: `jobs.db` tidak lagi dapat dinyatakan bebas data sensitif.** Sejak komentar tabel dan kolom database dipakai sebagai sumber deskripsi, isi komentar tersebut ikut masuk ke `preview_markdown` yang tersimpan di `jobs.db` dan dikembalikan `GET /api/jobs/{job_id}` serta `GET /api/jobs/by-code/{access_code}` — keduanya tanpa autentikasi. Komentar database dapat memuat catatan internal, nama orang, atau aturan bisnis. Pernyataan lama bahwa `jobs.db` tidak memuat kredensial tetap berlaku; yang berubah adalah cakupan data lain di dalamnya.
*   **Rate limit endpoint pelacakan job** (`RATE_LIMIT_JOB_LOOKUP`, bawaan 30/menit) dipasang pada 2026-08-11. Sebelumnya endpoint `by-code` tidak dibatasi sama sekali, sedangkan kode aksesnya hanya berkekuatan 40 bit.
*   **`key_style="endpoint"` pada slowapi wajib dipertahankan.** Bawaan pustaka adalah `"url"`, yang menamai bucket limit dari path permintaan. Karena kode akses berada di dalam path, gaya bawaan memberi setiap tebakan bucket sendiri sehingga limit tidak pernah menggigit. Ditemukan lewat test pada 2026-08-11; jangan dikembalikan ke bawaan.
*   **Insiden pemindai rahasia**: GitGuardian menandai commit `6638912`. Terverifikasi **false positive** — nilai karangan di dalam test. `.env` tidak pernah ter-track dan token Cloudflare tidak pernah masuk history.
*   **HTTP security headers**: **terpasang di backend per 2026-08-04** (tujuh header, plus HSTS opsional lewat `HSTS_ENABLED` yang mati secara bawaan). Yang masih terbuka: header di lapisan frontend dan Content-Security-Policy.
*   **Yang masih terbuka**: CSP dan header frontend (sisa I-005), batas sumber daya container belum ada (I-006), dan `MSF_API_KEY` masih kosong sehingga seluruh endpoint dapat diakses anonim. Rincian di `TECHNICAL_DEBT.md` bagian Catatan Keamanan.

Konteks yang membingkai semuanya: aplikasi ini **terbuka ke internet lewat Cloudflare Tunnel dan tidak memiliki sistem login sama sekali.**

---

## 1b. Status Branch (per 2026-08-04)

*   **`main`**: identik dengan `origin/main`. Merge v2 sempat dilakukan lokal lalu dibatalkan secara sadar — keputusan pengguna untuk menahan `main` sampai v2 benar-benar stabil.
*   **`dev`**: branch kerja aktif. Seluruh pengembangan fitur dan keamanan berlangsung di sini sampai dinyatakan stabil, baru kemudian di-merge ke `main` sekali.
*   **Kebijakan commit**: sejak 2026-08-04, commit dilakukan oleh human developer. AI menyiapkan perubahan dan pesan commit, tidak mengeksekusinya.

---

## 2. Technical Debt (Hutang Teknis yang Belum Selesai)

Berikut adalah beberapa pekerjaan yang perlu dikerjakan pada milestone berikutnya:
1.  **Antrean Job Persisten**: Status pengerjaan saat ini masih bersifat *in-memory* di `JobQueue`. Jika backend restart, pekerjaan aktif yang sedang diproses akan hilang. Rencana selanjutnya adalah menggunakan SQLite/PostgreSQL persisten untuk antrean.
2.  **Validasi Dialek DDL**: Parser DDL saat ini masih bersifat basic regex. Untuk skema yang sangat kompleks (misal triggers/procedures), diperlukan integrasi SQLGlot parser yang lebih canggih di `sql_parser.py`.
3.  **Timeout Panggilan LLM**: Beberapa model Ollama lokal lambat merespon (terutama pada komputer tanpa GPU eksternal). Perlu penyesuaian limit timeout koneksi HTTP agar tidak memicu error `Gateway Timeout` di frontend.
