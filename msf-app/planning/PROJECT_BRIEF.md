# Project Brief — MSF-DB (AI Database Documentation Platform)

> **Status:** PLANNING DATA — Berkas adopsi sistem saat ini.

---

## 1. Ringkasan Eksekutif
**MSF-DB** adalah platform berbasis web lokal yang dirancang untuk menghasilkan dokumentasi database yang komprehensif dan kaya secara otomatis menggunakan asisten AI (seperti LLM lokal Ollama atau penyedia cloud seperti OpenAI & DeepSeek). Aplikasi ini dapat memproses file SQL DDL atau langsung membaca skema dari koneksi database hidup (*live DB connection*).

---

## 2. Tujuan Proyek
*   **Automasi Dokumentasi**: Menghemat waktu DBA dan Developer dalam mendokumentasikan skema database (tabel, kolom, indeks, views, fungsi, relasi).
*   **Analisis Cerdas**: Memanfaatkan kecerdasan LLM untuk mendeteksi relasi implisit, tujuan tabel, validasi tipe data, hingga menyarankan indeks optimasi.
*   **Portabilitas Format**: Mengekspor hasil dokumentasi yang rapi ke format dokumen Microsoft Word (DOCX) atau berkas PDF siap cetak.
*   **DBA Shortcuts Helper**: Menyediakan koleksi pintasan skrip kueri SQL untuk optimasi, administrasi, dan pemeliharaan berbagai mesin database.

---

## 3. Cakupan Proyek (Project Scope)

### Di Dalam Cakupan:
1.  **AI Dokumentasi**:
    *   Input via SQL DDL editor (Monaco Editor dengan penyorotan sintaksis).
    *   Input via Live Database Connection (PostgreSQL, MySQL, SQLite, SQL Server).
    *   Generasi teks dokumen real-time (streaming preview).
    *   Pilihan bahasa dokumen (Indonesia & Inggris).
2.  **Job Queue & Tracking**:
    *   Antrean proses di latar belakang (*background job queue*) menggunakan SQLite persistent store.
    *   Fitur pelacakan pekerjaan melalui **Kode Akses Unik** (contoh: `MSF-A1B2C3D4`) yang aman dari halaman refresh atau keluar browser tidak sengaja.
3.  **DBA Shortcuts Browser**:
    *   Daftar skrip administrasi database yang dikategorikan berdasarkan tingkat risiko (*risk level*) dan mesin database.
4.  **Admin Panel**:
    *   Statistik visual utilisasi database, log aplikasi terpusat, dan konfigurasi API Key middleware.

### Di Luar Cakupan:
*   Migrasi database otomatis (proyek ini hanya melakukan audit dan dokumentasi, tidak mengubah skema database target).
*   Manajemen pengguna multi-tenant terpusat dengan OAuth2 (autentikasi saat ini dibatasi oleh API Key global dan Passcode admin portal).
