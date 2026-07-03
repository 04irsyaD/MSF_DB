# Frontend Structure — MSF-APP

> **Status:** OUTPUT FILE — Diupdate saat ada perubahan struktur frontend.

---

## Rendering Model

Next.js 14 **App Router** dengan hybrid rendering:
- **Server Components (SSR)** untuk halaman utama
- **Client Components** untuk interaktivitas (DiagramCanvas, form inputs, live polling)
- Komunikasi ke backend via `fetch` dengan `src/lib/api.ts`

---

## Layout Architecture

| Path | Purpose |
|------|---------|
| `src/app/layout.tsx` | Root layout — global providers, fonts, theme |
| `src/app/page.tsx` | Landing / home page |
| `src/app/diagram/` | Halaman ERD Diagram viewer |
| `src/app/shortcuts/` | Halaman Shortcuts Manager |
| `src/app/admin/` | Halaman Admin portal |

---

## Component Organization

| Path | Purpose |
|------|---------|
| `src/components/diagram/DiagramCanvas.tsx` | Inti diagram ERD — custom SVG renderer + 7 layout algoritma |
| `src/components/generator/SqlEditor.tsx` | Input editor DDL SQL |
| `src/components/generator/DbConnector.tsx` | Form koneksi database live |
| `src/components/generator/GeneratePanel.tsx` | Panel trigger generate + AI provider selector |
| `src/components/generator/DocPreview.tsx` | Preview dan download dokumen hasil |
| `src/lib/api.ts` | API client — semua fetch ke backend dengan X-API-Key header |
| `src/hooks/useGenerate.ts` | Custom hook untuk polling job status generate |

---

## Frontend Dependencies

| Dependency | Versi | Kegunaan |
|-----------|-------|----------|
| `next` | 14.x | Framework utama (App Router, SSR) |
| `react` | 18.x | UI library |
| `typescript` | 5.x | Type safety |
| `tailwindcss` | 3.x | Utility-first CSS framework |

---

## Asset Pipeline

- **Build tool:** Next.js built-in (Webpack/Turbopack)
- **Development:** `npm run dev` dengan hot reload
- **Production:** `npm run build` + `npm start`
- **Source CSS:** `src/app/globals.css` (Tailwind directives)
- **Di dalam Docker:** `npm run dev` berjalan di port 3000 (mapped ke 3001 di host)
