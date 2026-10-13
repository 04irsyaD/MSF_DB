# Task Report: Mermaid.js ERD Export (T-016)

**Tanggal:** 2026-10-02  
**Status:** DONE  
**Branch:** `dev`  
**Pelaksana:** AI Pair Programmer + User  

---

## 1. Latar Belakang & Masalah
Pengguna membutuhkan cara untuk mengekspor skema ERD yang divisualisasikan di `DiagramCanvas` ke format teks/kode yang mudah dibagikan di dokumentasi teknis seperti GitHub Markdown, Notion, GitLab, atau dbdiagram.io tanpa harus mengandalkan screenshot gambar.

## 2. Solusi & Perubahan
1. **`frontend/src/lib/mermaidGenerator.ts` (BARU)**
   - Pure function `toMermaidERD(tables: TableMetadata[]): string`
   - Normalisasi tipe SQL ke tipe data Mermaid ERD yang valid (`INT`, `VARCHAR`, `TIMESTAMP`, dll.)
   - Penandaan `PK`, `FK`, dan `"NOT NULL"`
   - Deduplikasi relasi Foreign Key menggunakan `Set`
2. **`frontend/src/components/diagram/MermaidExportModal.tsx` (BARU)**
   - Modal berbasis React Portal (`createPortal` ke `document.body`)
   - Opsi Copy Raw Mermaid Syntax dan Copy Markdown Fenced Codeblock (````mermaid)
   - Dukungan keyboard Esc untuk menutup modal, backdrop blur, SSR-safe check
3. **`frontend/src/components/diagram/DiagramCanvas.tsx`**
   - Menambahkan tombol Mermaid ERD di toolbar canvas dengan icon `GitBranch`
   - Mengintegrasikan `MermaidExportModal` di dalam container canvas

## 3. Verifikasi
- TypeScript Typecheck (`npx tsc --noEmit`): **PASSED** (0 errors).
- Anti-Monster Rule: `mermaidGenerator.ts` (86 baris) & `MermaidExportModal.tsx` (172 baris) jauh di bawah batas 500 baris.
