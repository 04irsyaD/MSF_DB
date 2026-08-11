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

### Security

- **Rate limit pada `GET /api/jobs/by-code/{access_code}`** lewat `RATE_LIMIT_JOB_LOOKUP` (bawaan 30/menit). Endpoint ini sebelumnya tidak dibatasi sama sekali, sementara kode akses hanya berkekuatan 40 bit dan endpoint tersebut mengembalikan preview dokumen yang kini memuat komentar database.
- **`key_style="endpoint"` dipasang pada limiter slowapi.** Bawaan pustaka adalah `"url"`, yang menamai bucket limit dari path permintaan. Karena kode akses berada di dalam path, setiap tebakan menempati bucket berbeda sehingga limit tidak pernah menggigit — persis serangan yang hendak dicegah justru lolos. Endpoint lain memakai path tetap sehingga perilakunya tidak berubah.
- **HTTP security headers dipasang di backend.** Middleware baru `app/utils/security_headers.py` memasang `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy`, dan `X-Permitted-Cross-Domain-Policies` pada seluruh respons, termasuk respons error. `Strict-Transport-Security` tersedia lewat `HSTS_ENABLED` dan **mati secara bawaan**, karena mengirimnya dari `localhost` akan mengunci browser ke HTTPS untuk seluruh `localhost` selama setahun. Sebelumnya backend tidak memasang satu pun header, melanggar `ai-rules/security/part-b` yang bersifat wajib.
- **`MSSQL_TRUST_SERVER_CERTIFICATE` bawaan diubah dari `yes` menjadi `no`.** Nilai `yes` membuat ODBC Driver 18 menerima sertifikat apa pun tanpa memvalidasi rantai kepercayaan maupun nama host, sehingga kredensial database yang dimasukkan pengguna dapat disadap lewat serangan orang di tengah. Temuan tinjauan keamanan 2026-08-04, severity Medium. Operator yang memakai sertifikat self-signed dapat menaikkannya kembali secara sadar lewat `.env`.
- **Port PostgreSQL uji diikat ke `127.0.0.1`.** Sebelumnya dipetakan ke seluruh antarmuka, sehingga database uji berkredensial bawaan terbuka ke jaringan. Akses dari klien DB di mesin yang sama tetap berfungsi.
- **`_get_table_count_query` dihapus.** Fungsi itu tidak pernah dipanggil tetapi menyisipkan nama schema milik pengguna ke SQL lewat f-string. Tidak terjangkau berarti tidak dapat dieksploitasi, tetapi meninggalkannya berarti menunggu seseorang memanggilnya.

### Added
- **Komentar tabel dan kolom dari database dipakai sebagai sumber deskripsi.** `db_connector` kini mengisi `column_comment` dan `table_comment` lewat inspector SQLAlchemy; keduanya sebelumnya hanya dideklarasikan di schema tanpa pernah diisi maupun dibaca. Komentar kolom masuk ke kolom Keterangan, komentar tabel tampil sebagai catatan skema sekaligus dikirim ke AI sebagai konteks. Komentar yang ditulis DBA adalah fakta, sehingga model tidak perlu menebak ulang hal yang jawabannya sudah tersedia. Engine yang tidak mendukungnya, seperti SQLite, tetap berjalan tanpa komentar.
- **Test untuk `DocGenerator`.** Sebelumnya satu-satunya service inti tanpa test sama sekali. Delapan test mengunci perilaku keluaran `generate_from_tables`.
- **Kontrak keluaran AI berubah dari prosa bebas menjadi deskripsi per kolom.** Sebelumnya AI menghasilkan satu blok prosa per tabel yang ditempel apa adanya, sehingga heading liar dari model kecil masuk ke Markdown lalu diterjemahkan exporter menjadi Heading Word sederajat dengan nama tabel, merusak hierarki dokumen. Kini AI diminta satu baris `nama_kolom | deskripsi` per kolom, dan **parser membuang setiap nama kolom yang tidak ada di metadata asli**. Penyaringan itu deterministik dan tidak bergantung pada kepatuhan model. Jumlah panggilan AI tidak bertambah: tetap satu per tabel, mengembalikan ringkasan tabel sekaligus seluruh deskripsi kolom.
- **`DocumentModel` sebagai bentuk data antara** (`services/doc_model.py`), dengan `services/renderers/markdown_renderer.py` sebagai renderer pertamanya. Isi dokumen kini terpisah dari cara menampilkannya, sehingga bentuk keluaran lain dapat ditambahkan tanpa menduplikasi logika pengisian. `doc_generator.py` menyusut dari 375 menjadi 248 baris.
- **`structure_template` pada `GenerateSettings`**, berupa Enum tertutup dengan satu nilai `standard` dan bawaan yang sama, sehingga job tersimpan dan request frontend versi lama tidak terpengaruh. Enum tertutup dipilih karena nilai ini kelak memilih berkas template, sedangkan endpoint generate dapat diakses anonim.
- **`AI_SEED` dan `AI_TEMPERATURE`.** Sebelumnya sampling AI tidak memakai seed sama sekali, sehingga input yang sama menghasilkan dokumen berbeda setiap kali dijalankan dan hasilnya tidak pernah dapat diverifikasi ulang. `AI_SEED` kosong mempertahankan perilaku lama. `AI_TEMPERATURE` bawaan turun dari 0.3 ke 0.1 karena tugasnya ekstraksi fakta dari skema, bukan menulis kreatif. Keduanya berlaku untuk Ollama, DeepSeek, dan OpenAI.
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
