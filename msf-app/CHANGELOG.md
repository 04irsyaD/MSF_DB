# Changelog

All notable changes to MSF-DB will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to Semantic Versioning.

## [Unreleased]
### Added
- Peringatan keamanan cloud (cloud deployment warning) di komponen DBConnector.
- Validasi Pydantic: `max_length=500_000` pada `sql_content` untuk membatasi ukuran input DDL.
- Validasi Pydantic: Batasan jumlah tabel maksimum per permintaan via `MAX_TABLES_PER_REQUEST`.
- Validasi Pydantic: Validasi port manual rentang 1-65535 di model koneksi.
- Validasi Pydantic: Validasi XOR antara `connection_string` dan `host`+`database` untuk koneksi database.
- Template DDL untuk PostgreSQL, MySQL, dan SQLite di SQL Editor.
- Default filter engine 'postgresql' di halaman Shortcuts.
- Statistik live antrean tugas (Active & Failed Jobs) di Dashboard.
- Daftar model Ollama terinstal di halaman Settings.

### Fixed
- Link Swagger API di halaman Settings mengarah ke domain publik `https://msf-db.my.id/api/docs` (sebelumnya localhost).

## [2.0.0] - 2026-06-27
### Added
- Migrasi penuh dari backend Python FastAPI mandiri ke arsitektur Next.js 14 Serverless API Routes (TypeScript).
- Integrasi modul DDL parser, database inspector, shortcuts, dan pengekspor dokumen Word/PDF.
- Pengekspor PDF serverless bertenaga `pdf-lib` (pure-TypeScript) untuk kepatuhan Vercel.
- Pengekspor Word serverless menggunakan library `docx`.

## [1.0.0] - 2026-01-15
### Added
- Versi pertama aplikasi generator dokumentasi database berbasis Python FastAPI.
