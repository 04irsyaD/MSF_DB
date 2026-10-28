# Modules — MSF-DB

> **Status:** PLANNING DATA — Daftar modul fungsional beserta status dan pemiliknya.
> Dibuat 2026-08-03 sebagai bagian rilis v2.2.0; berkas ini ditandai wajib oleh template
> `ai-rules/planning-templates/` tetapi sebelumnya belum pernah ada.

---

## 1. Modul yang Terlihat Pengguna

| # | Modul | Halaman | Status | Versi | Ringkasan |
|---|---|---|---|---|---|
| 1 | Dashboard | `/dashboard` | Production | v2.0.0 | Halaman utama. Riwayat job milik browser (`localStorage`), kolom pelacakan kode akses, pengecekan kesehatan tiap 12 detik |
| 2 | Generator | `/generate` | Production | v2.2.0 | Fitur inti. Editor SQL Monaco, form koneksi database, pilihan AI dan model, bahasa, tingkat detail, format keluaran |
| 3 | Diagram | `/diagram` | Production | v2.1.0 | ERD dari skrip SQL. Lima tata letak, unduh PNG, sepuluh template contoh |
| 4 | Shortcuts | `/shortcuts` | Production | v2.0.0 | Kumpulan perintah SQL siap pakai untuk MySQL dan PostgreSQL dengan penanda tingkat risiko |
| 5 | Admin Portal | `/admin` | Production | v2.2.0 | Tersembunyi dari navigasi, dilindungi passcode. Statistik, daftar job, log server, pembersihan |
| 6 | Settings | `/settings` | Redirect | v2.0.0 | Dialihkan ke Dashboard. Keputusan UX yang disengaja pada 2026-07-06, bukan stub yang terlupakan |

---

## 2. Modul Inti di Balik Layar

| # | Modul | Berkas utama | Status | Versi | Catatan |
|---|---|---|---|---|---|
| 1 | SQL Parser | `services/sql_parser.py` | Production | v2.1.0 | Membaca `CREATE TABLE`: tabel, kolom, tipe, PK, FK, indeks |
| 2 | Database Connector | `services/db_connector.py` | Production | v2.2.0 | PostgreSQL, MySQL, SQLite, **SQL Server (baru)**. MongoDB belum ada |
| 3 | AI Provider | `services/ai_provider.py`, `ollama_provider.py`, `cloud_provider.py` | Production | v2.0.0 | Ollama lokal, DeepSeek, OpenAI. Diproses per tabel agar tidak melebihi batas token |
| 4 | Document Exporter | `services/exporters/` | Production | v2.0.0 | DOCX dan PDF. Berjalan sinkron di event loop (TD-009) |
| 5 | Job Queue | `background/job_queue.py` | Production | v2.2.0 | Maksimum 3 job bersamaan, batas waktu 30 menit, dapat dibatalkan |
| 6 | **Job Store** | `background/job_store.py` | **Baru** | **v2.2.0** | Persistensi SQLite, rekonsiliasi job yatim, dua pembersihan retensi |
| 7 | **Rate Limiting** | `utils/rate_limit.py` | **Baru** | **v2.2.0** | Pembatasan per alamat IP pada tiga endpoint |
| 8 | Security | `main.py` (APIKeyMiddleware), `routers/admin.py` | Production | v2.2.0 | API key opsional, CORS, penyensoran password di log, passcode admin |

---

## 3. Permukaan API

Total 23 endpoint pada 7 kelompok. Rilis v2.2.0 **tidak menambah maupun menghapus satu endpoint pun**;
yang berubah hanya perilaku internal dan bentuk respons error.

| Kelompok | Jumlah | Endpoint |
|---|---|---|
| Generate dan Job | 7 | `parse-ddl`, `from-ddl`, `from-db`, `jobs/{id}`, `jobs/by-code/{code}`, `jobs/{id}/cancel`, `jobs/{id}/download` |
| Admin | 5 | `verify`, `stats`, `jobs`, `logs`, `cleanup` |
| AI | 3 | `models`, `providers`, `test` |
| Shortcuts | 3 | daftar, `engines`, `categories` |
| Database | 2 | `test-connection`, `metadata` |
| Export | 2 | `docx`, `pdf` |
| Stats | 1 | `stats` |

---

## 4. Fitur yang Sengaja Belum Ada

| Fitur | Alasan |
|---|---|
| Akun pengguna dan login | Bukan produk multi-tenant. Pelacakan memakai kode akses, bukan identitas |
| MongoDB | Schemaless, butuh strategi inferensi skema tersendiri. Pilihannya masih tampil di UI dan menyesatkan (I-009) |
| Mode gelap | Antre di `TODO.md` |
| Share link | Antre di `TODO.md` Nice to Have |
| Notifikasi webhook | Antre di `TODO.md` Nice to Have |
| Bahasa selain Indonesia dan Inggris | Antre di `TODO.md` Nice to Have |
