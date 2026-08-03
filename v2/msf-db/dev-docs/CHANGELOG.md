# CHANGELOG — MSF-DB

> **Status:** DATA FILE — Catatan kronologis perubahan rilis dan milestone.

---

## [v2.2.0] — 2026-08-03

### Added

- **Antrean job persisten dengan SQLite.** Komponen baru `backend/app/background/job_store.py` menyimpan metadata job ke `jobs.db`. Riwayat pekerjaan dan kode akses `MSF-XXXXXXXXXX` kini selamat dari restart, deploy ulang, dan crash backend.
- **Rekonsiliasi job yatim saat startup.** Job yang tertinggal `queued` atau `processing` ditandai `error` dengan pesan "Pekerjaan terhenti karena server dimulai ulang.", bukan menggantung selamanya.
- **Retensi dua tingkat.** Berkas hasil dibatasi `MAX_JOB_RETENTION_MINUTES` (bawaan 60 menit), sedangkan baris riwayat dibatasi `JOB_RECORD_RETENTION_DAYS` (bawaan 30 hari).
- **Rate limiting per alamat IP** pada `POST /api/generate/from-ddl`, `POST /api/generate/from-db`, dan `POST /api/admin/verify`, memakai slowapi. Dapat dimatikan lewat `RATE_LIMIT_ENABLED=false`.
- **Dukungan SQL Server.** `pyodbc` diaktifkan, `msodbcsql18` dipasang di image backend, dan `ODBC Driver 18` beserta `TrustServerCertificate` dapat diatur lewat env.
- Dokumentasi operations baru: `backend/docs/operations/job-database-backup.md`, `scheduler-cleanup.md`, dan `rate-limiting.md`.
- [ADR-005](decisions/005-persistent-job-queue-sqlite.md) yang men-supersede ADR-004 dan menyelesaikan konflik antara PRD dan ADR.

### Changed

- **PERUBAHAN MAKNA: statistik Admin Portal kini melintasi 30 hari, bukan 60 menit terakhir.** Sumbernya berpindah dari memori ke `JobStore.query()`. Angka yang tampil akan terlihat jauh lebih besar dari sebelumnya; ini disengaja, bukan anomali.
- Unduh pada job yang berkasnya sudah kedaluwarsa menjawab **410 `RESULT_EXPIRED`**, sebelumnya 500 "File hasil tidak tersedia" yang menyesatkan.
- Respons 429 antrean penuh kini membawa `error_code: JOB_QUEUE_FULL`, sedangkan 429 rate limit membawa `error_code: RATE_LIMIT_EXCEEDED` beserta header `Retry-After`. Frontend menampilkan dua pesan berbeda untuk keduanya.
- `MAX_JOB_RETENTION_MINUTES` kini benar-benar dibaca kode; sebelumnya dideklarasikan tetapi diabaikan (hardcoded 60).
- Isolasi sumber daya v2: nama container menjadi `msf2-*`, nama volume menjadi `msf2_*`, port backend 8001, frontend 3002, PostgreSQL 5434, Ollama host 11435.
- `OLLAMA_BASE_URL` dan `CORS_ORIGINS` kini benar-benar dapat diubah lewat `.env`; sebelumnya di-hardcode di `docker-compose.yml` sehingga perubahan `.env` gagal secara diam-diam.
- `.env.example` mendokumentasikan tujuh variabel yang sebelumnya tidak tercatat, termasuk rahasia `CLOUDFLARE_TUNNEL_TOKEN`, dan menandai variabel yang tidak dibaca kode mana pun.

### Security

- **Passcode admin `admin123` dihapus.** `docker-compose.yml` sebelumnya menyuntikkan nilai bawaan itu sehingga perlindungan di `admin.py` tidak pernah tercapai, pada aplikasi yang terbuka ke internet. Kini `ADMIN_PASSCODE` kosong secara bawaan dan Admin Portal mati total selama belum diisi.
- Perbandingan passcode memakai `secrets.compare_digest` untuk menutup kebocoran waktu.
- `SECRET_KEY` dihapus dari `docker-compose.yml` dan `.env.example` karena tidak ada kode yang membacanya.

### Fixed

- Berkas hasil tidak lagi menjadi yatim setelah restart. Berkas yatim yang menumpuk **sebelum** v2.2.0 tetap perlu dibersihkan manual; caranya ada di `backend/docs/operations/job-database-backup.md`.
- Fixture test `setup_admin_passcode` tidak lagi bergantung pada urutan import yang kebetulan.

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
