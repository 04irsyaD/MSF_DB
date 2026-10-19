# KNOWN_ISSUES.md — Open Issues Tracker

> **Status:** OUTPUT FILE — Hanya issue OPEN. Resolved > 2 minggu dipindah ke `RESOLVED.md`.

---

## Open Issues

Detail per bug (gejala, akar masalah, lokasi): `dev-docs/modules/diagram-canvas/PLAN.md` bagian 4.

| ID | Issue | Severity | Ditemukan | Task |
|----|-------|----------|-----------|------|
| I-011 | Class Tailwind v4 `backdrop-blur-xs` masih ada di modul SQL Helper: `SqlHelperDrawer.tsx:88`, `ScriptDrawer.tsx:211,366` (blur tidak jalan). Modul diagram sudah bersih | Low | 2026-10-16 | - |
| I-012 | `/favicon.ico` 404 di seluruh aplikasi (tidak ada favicon di `public/` maupun `app/`) | Low | 2026-10-16 | - |
| I-013 | Garis relasi diagram bisa melintas di belakang kartu tabel lain (rute siku H-V-H tidak menghindari rintangan); terlihat sebagai potongan garis pendek di sela kartu | Low | 2026-10-16 | - |

---

## Recently Resolved

| ID | Issue | Root Cause | Resolved | PR/Commit |
|----|-------|------------|----------|-----------|
| I-005 | Parser DDL salah membaca tipe kolom (`showtime_id INT` jadi `TIME`, `TIMESTAMP` jadi `TIME`) | Regex tipe mencari di seluruh baris termasuk nama kolom, tanpa `\b`, alternatif pendek lebih dulu | 2026-10-16 | belum commit (`feat/diagram-fix`) |
| I-006 | Parser mengabaikan FK `ALTER TABLE`, `[dbo].[x]`, `CREATE TEMPORARY TABLE`, `CONSTRAINT ... UNIQUE`, kolom `unique_code`/`check_in` | Regex tabel/constraint terlalu sempit; deteksi constraint pakai `startswith` tanpa batas kata | 2026-10-16 | belum commit |
| I-007 | Kanvas diagram terpotong di layar kecil; Fit salah posisi | `h-[600px]` hardcode; Fit mengukur kotak 600px, bukan area terlihat | 2026-10-16 | belum commit |
| I-008 | Auto-fit tidak jalan saat pindah template dengan jumlah tabel sama | Pemicu Fit memakai `tables.length` | 2026-10-16 | belum commit |
| I-009 | Zoom tidak berporos, drag tidak sinkron di zoom bukan 1, tanpa touch | `pan` tidak dikompensasi; delta tidak dibagi zoom; hanya mouse events | 2026-10-16 | belum commit |
| I-010 | Tombol Rerender/Tarik Skema menumpuk di atas textarea/form | `h-full` + textarea `min-h-[250px]` di dalam scroll container | 2026-10-16 | belum commit |
| I-001 | SQLParser memotong nilai DEFAULT PostgreSQL | Regex tidak menghitung kedalaman tanda kurung | 2026-07-02 | `u8v9w0x` |
| I-002 | Tabel diagram saling tertimpa (card overlap) pada layout Pusat Relasi dan Organik | Radius lingkaran statis, tidak memperhitungkan jumlah tabel | 2026-07-02 | `w2x3y4z` |
| I-003 | Garis koneksi diagram bertumpuk (line overlap) pada layout Grid | Bezier curve tidak memiliki vertical track offset | 2026-07-02 | `k1l2m3n` |
| I-004 | Konten rule #11 Operations Documentation terputus dan terselip di rule #13 di AGENTS.md | Edit manual yang tidak konsisten | 2026-07-03 | Manual fix |
