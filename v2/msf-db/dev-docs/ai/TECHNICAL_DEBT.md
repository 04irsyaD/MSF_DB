# TECHNICAL_DEBT.md — Technical Debt Tracker

> **Status:** OUTPUT FILE — Diupdate AI saat ada tech debt baru ditemukan atau terselesaikan.

---

## Open Technical Debt

| ID | Debt | Area | Severity | Ditemukan | Notes |
|----|------|------|----------|-----------|-------|
| TD-001 | `renderRelations` di `DiagramCanvas.tsx` saat ini berjalan O(n²) — semua tabel di-loop ulang untuk setiap FK | Frontend / Diagram | Low | 2026-07-02 | Tidak masalah untuk < 50 tabel, perlu dioptimasi jika dataset besar |
| TD-002 | Layout algoritma (5 tipe) semua berada dalam satu fungsi `applyLayout` yang makin panjang | Frontend / Diagram | Low | 2026-07-02 | Perlu di-split menjadi strategi pattern / helper functions terpisah |
| TD-003 | Tidak ada unit test untuk fungsi layout di `DiagramCanvas.tsx` | Frontend / Testing | Medium | 2026-07-02 | Semua layout hanya diuji manual |
| TD-004 | `pytest_asyncio` menggunakan deprecated `event_loop` fixture redefine di `conftest.py` | Backend / Testing | Low | 2026-07-02 | Warning saat pytest, belum error. Perlu migrasi ke `asyncio_mode = "auto"` |
| TD-005 | `DiagramCanvas.tsx` berukuran 871 baris terhadap batas view 500 | Frontend / Diagram | Medium | 2026-08-03 | Pelanggaran yang sudah ada sebelum v2.2.0. Terkait TD-001 dan TD-002 |
| TD-006 | `app/admin/page.tsx` berukuran 645 baris terhadap batas view 500 | Frontend / Admin | Medium | 2026-08-03 | Tumbuh pada redesign 2026-07-06 |
| TD-007 | `app/diagram/templates.ts` berukuran 528 baris terhadap batas 500 | Frontend / Diagram | Low | 2026-08-03 | Berkas data murni, dampak rendah |
| TD-008 | `routers/generate.py` berukuran 360 baris terhadap batas route 200 | Backend / Routes | High | 2026-08-03 | Sudah 328 baris sebelum v2.2.0. Usulan: pindahkan `_run_generate_job` dan `_run_from_db` ke `services/generation_service.py`; keduanya logika domain yang kebetulan tinggal di lapisan route. Perkiraan setelah dipindah sekitar 180 baris |
| TD-009 | `DocxExporter.export()` berjalan sinkron dan memblokir event loop | Backend / Export | Medium | 2026-08-03 | Bar progres menggantung di 92 persen pada skema besar. Bila kelak dibungkus `to_thread`, asumsi single-threaded pada `job.update()` pecah; `JobStore` sudah dibuat aman-thread untuk mengantisipasi |
| TD-010 | 18 pelanggaran lint ruff terbawa dari baseline msf-app | Backend / Kualitas | Low | 2026-08-03 | Import tak terpakai di 9 berkas, variabel ambigu `l`, variabel mati `cells_data` di `docx_exporter.py`. Tidak satu pun berasal dari v2.2.0. `ruff check --fix` menyelesaikan 16 dari 18 |
| TD-011 | Frontend tidak punya konfigurasi ESLint sehingga `npm run lint` tidak dapat dijalankan | Frontend / Testing | Medium | 2026-08-03 | `eslint` dan `eslint-config-next` terpasang sebagai dependensi, tetapi tidak ada `.eslintrc.json`, sehingga `next lint` berhenti menunggu jawaban interaktif. Verifikasi frontend saat ini hanya mengandalkan `npm run build` |
| TD-012 | Frontend tidak memiliki kerangka pengujian sama sekali | Frontend / Testing | High | 2026-08-03 | Tidak ada jest, vitest, maupun playwright di `package.json`. Seluruh perubahan frontend hanya dapat diverifikasi manual |

---

## Resolved Technical Debt

Tidak ada yang telah diselesaikan saat ini.
