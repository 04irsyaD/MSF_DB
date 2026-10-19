# Diagram Canvas

> **Status:** OUTPUT FILE — Indeks modul MSF Diagram (`/diagram`). Diperbarui 2026-10-16.

| Aspek | Lokasi |
|-------|--------|
| Halaman | `frontend/src/app/diagram/page.tsx` |
| Template DDL | `frontend/src/app/diagram/templates.ts` (10 template) |
| Kanvas (komposisi, pointer, fullscreen, ekspor PNG) | `frontend/src/components/diagram/DiagramCanvas.tsx` |
| Toolbar, kartu tabel, garis relasi | `DiagramToolbar.tsx`, `TableCard.tsx`, `RelationLines.tsx` (folder yang sama) |
| Zoom/pan/Fit/resize | `frontend/src/components/diagram/useCanvasViewport.ts` |
| Logika murni (layout, geometri, konstanta) | `frontend/src/lib/diagram/{layouts,geometry,constants}.ts` |
| Ekspor Mermaid | `frontend/src/components/diagram/MermaidExportModal.tsx`, `frontend/src/lib/mermaidGenerator.ts` |
| Parser DDL (backend) | `backend/app/services/sql_parser.py`, endpoint `POST /api/generate/parse-ddl` |
| Test | `backend/tests/test_sql_parser.py`, `frontend/scripts/test-diagram.mjs` (+ `fixtures/diagram-templates.json`) |

Aturan penting:

- Ukuran kartu di `TableCard.tsx` dikunci ke `lib/diagram/constants.ts`. Ubah keduanya bersamaan, lalu jalankan `npm run test:diagram`.
- `lib/diagram/*` hanya boleh `import type` dari luar folder dan memakai ekstensi `.ts` antar file agar bisa dites langsung dengan Node 24 (`allowImportingTsExtensions` di `tsconfig.json`).
- Fixture test dihasilkan dari parser backend. Jika template atau parser berubah, buat ulang fixture.

## Dokumen

- [PLAN.md](./PLAN.md) — inventaris bug + rencana perbaikan (2026-10-16)
- [QA_CHECKLIST.md](./QA_CHECKLIST.md) — checklist QA, hasil run AI, dan gate push
- [qa-browser.mjs](./qa-browser.mjs) — skrip QA browser otomatis (60 cek)
