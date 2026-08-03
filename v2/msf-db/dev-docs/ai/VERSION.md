# Version Management — Riwayat Rilis SemVer

> **Status:** SEMVER DATA — Manajemen versi utama proyek MSF-DB.

---

## 1. Versi Saat Ini (Current Version)

*   **Current Version**: `v2.2.0`
*   **Release Date**: 2026-08-03
*   **Target Release**: `v2.3.0` (Kandidat: refactor `_run_generate_job` dan `_run_from_db` ke `services/generation_service.py`, HTTP security headers, batas sumber daya container)

---

## 2. Riwayat Versi (Release History)

| Versi | Tanggal | Tipe Perubahan | Ringkasan Fitur |
|-------|---------|----------------|-----------------|
| **`v2.2.0`** | 2026-08-03 | MINOR | **Antrean job persisten dengan SQLite** (riwayat dan kode akses selamat dari restart, rekonsiliasi job yatim, retensi dua tingkat), **rate limiting per IP**, **dukungan SQL Server**, dan pengerasan passcode admin. |
| **`v2.1.0`** | 2026-06-29 | PATCH | Menambahkan fitur **Kode Akses Pelacakan** (`access_code`), pop-up "Simpan Kode", dan perbaikan serialisasi Pydantic. |
| **`v2.0.0`** | 2026-06-25 | MAJOR | Rilis awal desain ulang (Supabase/Linear Emerald Light Mode) dengan backend FastAPI dan frontend Next.js 14. |
