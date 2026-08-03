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

---

## Resolved Technical Debt

Tidak ada yang telah diselesaikan saat ini.
