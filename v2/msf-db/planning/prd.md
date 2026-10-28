# Product Requirements Document (PRD) — MSF-DB

> **Status:** PLANNING DATA — Berkas adopsi sistem saat ini.

---

## 1. Persyaratan Fungsional (Functional Requirements)

### F01: SQL DDL Parser & Input
*   Sistem harus menyediakan editor teks interaktif (menggunakan Monaco Editor) di frontend untuk menempelkan pernyataan `CREATE TABLE`.
*   Parser SQL di backend harus mengenali dialect utama (PostgreSQL, MySQL, SQLite, SQL Server) dan mengekstrak informasi nama tabel, nama kolom, jenis data, kunci primer (*primary key*), dan kunci asing (*foreign key*).

### F02: Live Database Connector
*   Sistem harus mendukung koneksi database langsung menggunakan form koneksi (host, port, database, username, password) atau connection string URI.
*   Sistem wajib mendukung pengujian koneksi (*Test Connection*) sebelum mengekstrak skema.
*   Sistem harus mampu menyaring skema target (*schema filter*) dan tabel target (*table filter*) sebelum diproses.

### F03: Pembangkit Dokumentasi AI (AI Generation)
*   Sistem harus mendukung asisten AI lokal via Ollama serta cloud providers (OpenAI GPT-4o-mini, DeepSeek Chat).
*   Proses pengiriman query ke LLM harus dilakukan secara bertahap (per tabel) untuk menghindari pemotongan batas token (token limits) dan mengoptimalkan performa.
*   Logik pembangkitan dokumen harus memancarkan progress streaming real-time (tabel mana yang sedang diproses) ke antarmuka pengguna.

### F04: Ekspor Berkas (Document Export)
*   Pengguna dapat mengunduh hasil dokumentasi lengkap dalam format Microsoft Word (DOCX) dan PDF.
*   Dokumen hasil ekspor harus diformat rapi dengan tabel ringkasan kolom, deskripsi tabel, dan relasi kunci asing.

### F05: Pelacakan Pekerjaan (Job Tracking)
*   Setiap proses pembangkitan dokumen baru wajib menghasilkan **Kode Akses Pelacakan** (contoh: `MSF-A1B2C3D4`) yang unik.
*   Pengguna harus disajikan pop-up peringatan di awal proses untuk menyalin kode akses tersebut.
*   Pengguna dapat melacak status progres koding yang berjalan dari halaman utama dengan memasukkan kode akses tersebut di kolom pelacakan.

---

## 2. Persyaratan Non-Fungsional (Non-Functional Requirements)

*   **Keamanan Kredensial**: Semua password koneksi database target harus disensor (`***`) pada file log dan keluaran stdout.
*   **Performa**: Operasi pembacaan DB dan LLM harus berjalan secara asinkronus menggunakan FastAPI background tasks agar tidak menghalangi request HTTP utama.
*   **Keandalan (Resilience)**: Antrean pekerjaan harus persisten. Jika container backend mati atau restart, antrean pekerjaan harus pulih secara otomatis dari basis data SQLite lokal.
*   **Kompatibilitas**: Antarmuka Next.js harus sepenuhnya responsif (nyaman digunakan baik di desktop maupun layar tablet).
