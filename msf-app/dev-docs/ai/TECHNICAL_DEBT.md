# TECHNICAL_DEBT.md — Technical Debt Tracker

> **Status:** OUTPUT FILE — Diupdate AI saat ada tech debt baru ditemukan atau terselesaikan.

---

## Open Technical Debt

| ID | Debt | Area | Severity | Ditemukan | Notes |
|----|------|------|----------|-----------|-------|
| TD-001 | `renderRelations` di `DiagramCanvas.tsx` saat ini berjalan O(n²) — semua tabel di-loop ulang untuk setiap FK | Frontend / Diagram | Low | 2026-07-02 | Tidak masalah untuk < 50 tabel, perlu dioptimasi jika dataset besar |
| TD-002 | Layout algoritma (5 tipe) semua berada dalam satu fungsi `applyLayout` yang makin panjang | Frontend / Diagram | Low | 2026-07-02 | Perlu di-split menjadi strategi pattern / helper functions terpisah |
| TD-003 | Tidak ada unit test untuk fungsi layout di `DiagramCanvas.tsx` | Frontend / Testing | Medium | 2026-07-02 | Semua layout hanya diuji manual |
| TD-006 | Komponen dark mode menggunakan CSS override fallback (`.dark .bg-white { ... }`) karena banyak komponen masih hardcode Tailwind colors | Frontend / Styling | Medium | 2026-10-02 | Migrasi bertahap ke semantic tokens (`bg-card`, `text-foreground`, `bg-muted`) |
| TD-007 | Starlette 1.9 memberi `StarletteDeprecationWarning`: TestClient berbasis `httpx` deprecated, disarankan `httpx2` | Backend / Testing | Low | 2026-10-19 | Hanya di test; migrasi saat `httpx2` stabil dan didukung FastAPI |
| TD-008 | Dockerfile masih single-stage (`gcc` + `libpq-dev` ikut ke image runtime) | Backend / Deploy | Low | 2026-10-19 | Opsional di Batch 4; ditunda agar build Render tidak berisiko. Jadikan multi-stage di batch terpisah |

---

## Resolved Technical Debt

| ID | Debt | Resolved | Solusi |
|----|------|----------|--------|
| TD-004 | `pytest_asyncio` deprecated `event_loop` fixture di `conftest.py` | 2026-10-02 | Hapus custom fixture — `asyncio_mode = auto` di `pytest.ini` sudah cukup |
| TD-005 | `Header.tsx` `getPageInfo()` if-else chain tidak scalable | 2026-10-02 | Refactor ke `ROUTE_MAP` array + pure function `getPageInfo(pathname)` |
