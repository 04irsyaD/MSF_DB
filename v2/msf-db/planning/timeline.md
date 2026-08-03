# Timeline — MSF-DB

> **Status:** PLANNING DATA — Riwayat rilis dan rencana berikutnya.
> Dibuat 2026-08-03 sebagai bagian rilis v2.2.0; berkas ini ditandai wajib oleh template
> `ai-rules/planning-templates/` tetapi sebelumnya belum pernah ada.

---

## 1. Riwayat Rilis

| Versi | Tanggal | Tipe | Isi |
|---|---|---|---|
| `v2.0.0` | 2026-06-25 | MAJOR | Rilis awal desain ulang: backend FastAPI, frontend Next.js 14 |
| `v2.1.0` | 2026-06-29 | MINOR | Kode Akses Pelacakan (`access_code`), pop-up simpan kode, perbaikan serialisasi Pydantic |
| — | 2026-07-02 | — | Perbaikan SQL Parser, tujuh layout diagram, sepuluh template DDL |
| — | 2026-07-06 | — | Penyederhanaan UI/UX, pemisahan peran pengguna, halaman Settings dijadikan redirect |
| — | 2026-07-31 | — | Unduh diagram sebagai PNG, kontrol layout |
| **`v2.2.0`** | **2026-08-03** | **MINOR** | **Antrean job persisten SQLite, rate limiting per IP, dukungan SQL Server, pengerasan passcode admin** |

---

## 2. Rincian v2.2.0

Dikerjakan dalam sepuluh batch, satu batch satu commit, seluruhnya di branch `dev`.

| # | Batch | Isi |
|---|---|---|
| 1 | Baseline | Salin `backend/`, `frontend/`, `dev-docs/`, `planning/` dari msf-app |
| 2 | Isolasi sumber daya | Nama container `msf2-*`, volume `msf2_*`, port terpisah, config drift `.env.example` |
| 3 | Keamanan admin | Hapus fallback `admin123`, pakai `compare_digest` |
| 4 | Isolasi test | Fixture autouse untuk singleton `job_queue` |
| 5 | Persistensi | `job_store.py`, callback `on_change`, rekonsiliasi job yatim |
| 6 | Retensi | Pemisahan retensi berkas dan retensi riwayat, 410 `RESULT_EXPIRED` |
| 7 | Rate limiting | `utils/rate_limit.py`, dekorator pada tiga endpoint |
| 8 | Frontend | Pembedaan dua jenis 429 dan penanganan 410 |
| 9 | SQL Server | `pyodbc`, `msodbcsql18`, Driver 18, skema sistem |
| 10 | Dokumentasi | Operations docs, ADR-005, sinkronisasi dev-docs dan planning |

---

## 3. Rencana Berikutnya

Belum dijadwalkan tanggalnya. Urutan disusun berdasarkan tingkat risiko yang ditanggung sekarang.

| Prioritas | Item | Alasan | Rujukan |
|---|---|---|---|
| 1 | HTTP security headers (CSP, HSTS, X-Frame-Options) | Pelanggaran nyata terhadap standar keamanan wajib, pada aplikasi yang terbuka ke internet | I-005 |
| 2 | Refactor `_run_generate_job` dan `_run_from_db` ke `services/generation_service.py` | `routers/generate.py` 360 baris terhadap batas route 200, sekaligus melanggar Separation of Concerns. Membuka jalan perbaikan I-007 | TD-008, I-007 |
| 3 | Batas memori dan prosesor pada container | Tidak ada pagar sama sekali; v2 berdampingan dengan msf-app menggandakan konsumsi. Pengukuran sudah tersedia | I-006 |
| 4 | Konfigurasi ESLint dan kerangka pengujian frontend | `npm run lint` tidak dapat dijalankan dan tidak ada satu pun test frontend | TD-011, TD-012 |
| 5 | Nonaktifkan pilihan MongoDB di antarmuka | Satu berkas frontend, tanpa perubahan backend | I-009 |
| 6 | Peringatan kegagalan AI per tabel di antarmuka | Job berakhir sukses dengan isi jauh lebih miskin tanpa satu pun tanda | I-010 |
| 7 | Bersihkan 18 pelanggaran lint bawaan | `ruff check --fix` menyelesaikan 16 dari 18 | TD-010 |
| 8 | Mode gelap, share link, webhook | Antre di `TODO.md` Nice to Have | — |
