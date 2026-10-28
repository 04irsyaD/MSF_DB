# ADR-003 — Custom SVG Diagram Canvas

> **Status:** Accepted
> **Tanggal:** 2026-06-30

---

## Context

MSF-APP membutuhkan ERD viewer interaktif untuk menampilkan relasi antar tabel dari skema database yang di-parse. Dibutuhkan rendering yang mendukung drag-drop, zoom, pan, dan algoritma layout yang dapat dikonfigurasi.

Constraint:
- Harus ringan (tidak menambah bundle size secara signifikan)
- Harus mendukung minimal 5 algoritma layout berbeda
- Harus bisa di-customize sepenuhnya (garis koneksi, ukuran node, warna)

---

## Decision

Menggunakan **custom SVG renderer** di `DiagramCanvas.tsx` dengan:
- HTML5 native drag-and-drop untuk interaksi node
- SVG `<path>` dengan **Step/Elbow routing** (H→V→H) untuk garis koneksi
- 7 algoritma layout: Horizontal, Vertikal, Grid, Grid+HubCentric, Radial, HubCentric, Organic (Force-directed)
- Hover highlight dengan opacity fade untuk non-related tables

Alternatif yang ditolak:
- **React Flow:** library besar (~500KB), opinionated, sulit customize rendering garis koneksi
- **Mermaid.js:** tidak interaktif, tidak mendukung drag-drop
- **D3.js:** sangat powerful tapi learning curve tinggi, overkill untuk use case ini

---

## Consequences

### Positive

- Zero external dependency untuk diagram
- Full kontrol atas rendering, animasi, dan interaction
- Bisa optimize untuk performa sesuai kebutuhan

### Trade-offs

- Semua fitur harus diimplementasi manual (zoom, pan, minimap)
- Tidak ada ekosistem plugin

### Risks

- Layout algorithm O(n²) untuk jumlah tabel besar — dimitigasi karena use case rata-rata < 20 tabel
