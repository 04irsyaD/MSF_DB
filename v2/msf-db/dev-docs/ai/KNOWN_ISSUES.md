# KNOWN_ISSUES.md — Open Issues Tracker

> **Status:** OUTPUT FILE — Hanya issue OPEN. Resolved > 2 minggu dipindah ke `RESOLVED.md`.

---

## Open Issues

| ID | Issue | Dampak | Ditemukan | Catatan |
|----|-------|--------|-----------|---------|
| I-005 | HTTP security headers | **Sebagian selesai 2026-08-04.** Tujuh header dipasang di backend, HSTS tersedia lewat `HSTS_ENABLED`. **Yang masih terbuka:** header di lapisan frontend Next.js, dan Content-Security-Policy | 2026-08-03 | CSP direncanakan sebagai batch tersendiri dengan mode Report-Only lebih dulu, karena CSP ketat berpotensi mematahkan hidrasi Next.js dan Monaco Editor. COEP sengaja tidak dipasang di backend karena akan mematahkan `/docs` yang memuat aset Swagger dari CDN |
| I-006 | Tidak ada satu pun batas memori atau prosesor di seluruh container | Satu container bermasalah dapat menghabiskan RAM host dan mematikan layanan lain. Menjalankan v2 berdampingan dengan msf-app menggandakan konsumsi tanpa pagar | 2026-08-03 | Pengukuran sudah tersedia (lihat task report 2026-08-03). Batas dapat disetel setelah ada data lebih panjang |
| I-007 | Batas 50 tabel ditegakkan di dua titik yang sangat berbeda rasanya bagi pengguna | Jalur DDL menolak seketika dengan 400. Jalur koneksi DB terlanjur membuat job dan memberi kode akses, lalu berakhir `error`, sekaligus memakai satu slot konkurensi | 2026-08-03 | Perbaikan berada di `routers/generate.py` yang sudah melebihi batas ukuran; paling tepat dikerjakan bersama TD-008 |
| I-008 | `estimated_seconds` pada jalur koneksi DB selalu 60 detik | Database 40 tabel yang butuh sekitar 10 menit tetap dijanjikan selesai dalam 60 detik | 2026-08-03 | Jumlah tabel belum diketahui saat respons dikirim. Perbaikan jujur menuntut perubahan `JobStatusResponse` |
| I-009 | Antarmuka menawarkan engine MongoDB yang belum berfungsi | Pengguna mengisi seluruh form koneksi, lalu menerima "Engine tidak didukung: mongodb" | 2026-08-03 | Perbaikan termurah: tandai pilihan MongoDB sebagai belum tersedia dan nonaktifkan di `DbConnector.tsx`. Satu berkas frontend, tanpa perubahan backend |
| I-010 | Kegagalan AI per tabel tidak terlihat sama sekali di antarmuka | Job berakhir `done` dengan isi jauh lebih miskin dari harapan; dokumen hanya memuat catatan "AI description tidak tersedia" | 2026-08-03 | Baru terlihat setelah alur dipetakan utuh. Usulan: hitung tabel yang gagal dan tampilkan peringatan di panel hasil |

---

## Recently Resolved

| ID | Issue | Root Cause | Resolved | PR/Commit |
|----|-------|------------|----------|-----------|
| I-001 | SQLParser memotong nilai DEFAULT PostgreSQL | Regex tidak menghitung kedalaman tanda kurung | 2026-07-02 | `u8v9w0x` |
| I-002 | Tabel diagram saling tertimpa (card overlap) pada layout Pusat Relasi dan Organik | Radius lingkaran statis, tidak memperhitungkan jumlah tabel | 2026-07-02 | `w2x3y4z` |
| I-003 | Garis koneksi diagram bertumpuk (line overlap) pada layout Grid | Bezier curve tidak memiliki vertical track offset | 2026-07-02 | `k1l2m3n` |
| I-004 | Konten rule #11 Operations Documentation terputus dan terselip di rule #13 di AGENTS.md | Edit manual yang tidak konsisten | 2026-07-03 | Manual fix |
