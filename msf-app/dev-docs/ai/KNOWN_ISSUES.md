# KNOWN_ISSUES.md — Open Issues Tracker

> **Status:** OUTPUT FILE — Hanya issue OPEN. Resolved > 2 minggu dipindah ke `RESOLVED.md`.

---

## Open Issues

| ID | Issue | Dampak | Ditemukan | Rencana |
|----|-------|--------|-----------|---------|
| I-005 | `APIKeyMiddleware` didaftarkan setelah `CORSMiddleware` (posisi paling luar), sehingga respons 401 tidak membawa header CORS | Saat `MSF_API_KEY` aktif, browser melihat error CORS alih-alih 401. Belum berdampak karena `MSF_API_KEY` kosong di production | 2026-10-19 | Perbaiki urutan middleware di Batch 6 (T-027) |

---

## Recently Resolved

| ID | Issue | Root Cause | Resolved | PR/Commit |
|----|-------|------------|----------|-----------|
| I-001 | SQLParser memotong nilai DEFAULT PostgreSQL | Regex tidak menghitung kedalaman tanda kurung | 2026-07-02 | `u8v9w0x` |
| I-002 | Tabel diagram saling tertimpa (card overlap) pada layout Pusat Relasi dan Organik | Radius lingkaran statis, tidak memperhitungkan jumlah tabel | 2026-07-02 | `w2x3y4z` |
| I-003 | Garis koneksi diagram bertumpuk (line overlap) pada layout Grid | Bezier curve tidak memiliki vertical track offset | 2026-07-02 | `k1l2m3n` |
| I-004 | Konten rule #11 Operations Documentation terputus dan terselip di rule #13 di AGENTS.md | Edit manual yang tidak konsisten | 2026-07-03 | Manual fix |
