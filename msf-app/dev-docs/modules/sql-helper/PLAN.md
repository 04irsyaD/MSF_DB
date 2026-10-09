# SQL Helper v2 — Development Plan

> **Status:** PLAN — Belum dikerjakan. Spesifikasi teknis ada di [SPEC.md](./SPEC.md).
> **Tanggal:** 2026-10-09
> **Modul:** [SQL Helper](./README.md) (`/sql-helper`, client standalone)

---

## 1. Latar Belakang

Halaman `/sql-helper` sudah berfungsi (cari, filter, drawer, salin), tetapi:

- Terasa seperti tabel admin biasa: semua baris berbobot visual sama, SQL tidak terlihat sebelum klik.
- Ikon ▶ menyiratkan "jalankan", padahal aksinya hanya "lihat & salin".
- Teks kecil (10–11px) dan serba `font-mono` sehingga sulit dipindai.
- Data tipis (PostgreSQL ±16KB, MySQL ±6KB), engine Oracle punya badge tapi tanpa data.
- Kode: magic string sentinel, normalisasi risiko tersebar, cast `as unknown as`, a11y kurang, filter tidak tersimpan di URL.

## 2. Tujuan

| # | Tujuan | Indikator keberhasilan |
|---|--------|------------------------|
| G1 | Kode lebih aman & mudah dirawat | Data tervalidasi schema, tanpa duplikasi badge/risk, tanpa magic string |
| G2 | UX lebih cepat untuk DBA | Salin SQL ≤ 2 klik dari daftar, filter via chip, deep link |
| G3 | Tampilan lebih menarik & terbaca | Mode kartu + preview SQL, tipografi ≥ 12px, hierarki jelas |
| G4 | Aksesibel | Lolos axe (0 critical/serious), navigasi keyboard penuh |
| G5 | Fitur pembeda | Parameter template, favorit/terakhir dipakai, AI handoff |

## 3. Non-Goals

- **Tidak** menjalankan SQL dari browser (tetap pustaka skrip, bukan SQL runner).
- **Tidak** menambah ketergantungan backend (tetap 100% client standalone).
- **Tidak** menyentuh halaman lama `/shortcuts` (zero regression).
- Tidak ada akun pengguna; preferensi hanya di `localStorage`.

## 4. Prinsip

- Mengikuti **Anti-Monster Rule**: tiap file < 500 baris (target < 200).
- Tidak ada `git push` otomatis.
- Satu sumber kebenaran untuk risiko, kategori, engine.
- Dependensi baru wajib dibenarkan (ukuran bundle) dan dimuat lazy bila berat.

---

## 5. Fase Pengerjaan

### Fase 1 — Quick Wins (0.5–1 hari)

Perubahan kecil, risiko rendah, dampak langsung terasa.

- [x] Ganti ikon ▶ menjadi aksi **Salin** (+ aksi **Detail**) di baris
- [x] Default page size 10 (opsi 10/20/50)
- [x] Info box ringkas + bisa ditutup (localStorage)
- [x] Hapus kartu `SqlHelperStats` ("100% Client Ready"); pindahkan counter hasil ke atas
- [x] Tipografi: judul/deskripsi sans 13px; mono hanya untuk kode & badge
- [x] Clipboard dengan fallback + toast error
- [x] A11y dasar: `label htmlFor`, tombol judul di baris, `focus-visible`
- [x] Perbaiki cleanup `setTimeout` & restore `body.overflow`


### Fase 2 — Refactor Fondasi (1–2 hari)

- [x] Zod schema `Script` + skrip `validate:data` + migrasi nilai risiko ke `low|medium|high`
- [x] `riskMeta`, `<RiskBadge>`, `<CategoryBadge>`, `<EngineBadge>` (hapus duplikasi)
- [x] Hapus sentinel `"ALL ENGINES"`/`"SEMUA TINGKATAN"` → filter bertipe
- [x] `useScriptFilters` (state ↔ URL) + debounce search
- [x] Pindah ke `features/sql-helper/` (lihat SPEC §2)
- [x] Unit test `filter`, `search`, validasi data


### Fase 3 — UI Baru (2–3 hari)

- [x] Chip filter engine/kategori (multi-select, faceted count)
- [x] Toggle risiko + sorting
- [x] Mode **Kartu** (preview 3 baris SQL) & **Tabel ringkas**, pilihan tersimpan
- [x] Drawer berbasis Radix Dialog (focus trap, ESC, aria) — keputusan final
- [x] Pusatkan semua teks UI di `lib/labels.ts` (siap i18n; UI tetap istilah teknis Inggris)
- [x] `SqlViewer`: syntax highlight, nomor baris, wrap toggle, download `.sql`
- [x] Banner & konfirmasi untuk risiko **High**
- [x] Empty/loading state yang informatif
- [x] Responsif: kartu otomatis di mobile

### Fase 4 — Fitur Pembeda (2–3 hari)

- [ ] **Parameter template** `{{placeholder}}` + form + preview real-time
- [ ] Favorit & Terakhir dipakai (localStorage)
- [ ] Deep link `?script=<id>` + tombol bagikan link
- [ ] Navigasi prev/next skrip di drawer

### Fase 5 — Konten, QA, Integrasi (3–5 hari)

- [ ] Tambah engine: Oracle, SQL Server, SQLite
- [ ] Target 60–100 skrip (lihat SPEC §9 daftar topik)
- [ ] Command palette `Ctrl/⌘+K`
- [ ] Tombol "Jelaskan dengan AI" → AI Generator (nonaktif saat Offline)
- [ ] Playwright E2E + axe, bundle analyzer
- [ ] Update dokumentasi modul, CHANGELOG, commit log

---

## 6. Dependensi Baru (usulan)

| Paket | Fungsi | Fase | Catatan |
|-------|--------|------|---------|
| `zod` | Validasi schema data | 2 | Dev/build-time saja bila memungkinkan |
| `fuse.js` | Pencarian fuzzy berbobot | 2/3 | ±6KB gz |
| `@radix-ui/react-dialog` | Drawer aksesibel | 3 | Alternatif: `vaul` |
| `shiki` | Syntax highlight (keputusan final) | 3 | Dimuat via `next/dynamic`, bahasa `sql` saja, singleton highlighter |
| `vitest`, `@testing-library/react` | Unit/komponen test | 2 | Dev |
| `@playwright/test`, `axe-core` | E2E & a11y | 5 | Dev |

Keputusan akhir library dicatat sebagai ADR bila ada trade-off signifikan.

## 7. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|--------|--------|----------|
| Migrasi `risk_level` merusak tampilan lama | Badge/filter salah | Migrasi satu kali + `validate:data` di CI + test snapshot |
| Bundle membesar (highlighter, fuse) | LCP turun | `next/dynamic`, bundle analyzer, budget ≤ +60KB gz |
| Interpolasi parameter menghasilkan SQL salah/berbahaya | Salah eksekusi oleh user | Validasi identifier, tandai "generator teks", jangan eksekusi |
| Scope creep | Jadwal molor | Kerjakan per fase, tiap fase dapat di-merge terpisah |
| Regresi `/shortcuts` | Fitur lama rusak | Tidak menyentuh file shortcuts lama; cek manual tiap fase |

## 8. Definition of Done (per fase)

- [ ] Semua checklist fase selesai
- [ ] `npm run lint`, `npm run build`, dan test lulus
- [ ] UAT manual (desktop + mobile, light + dark) tercatat
- [ ] File < 500 baris, tidak ada `any` baru
- [ ] Laporan task di `reports/task/frontend/` dibuat
- [ ] `CHANGELOG.md` & `commit-logs` diperbarui

## 9. Urutan & Estimasi

| Fase | Estimasi | Bergantung pada |
|------|----------|-----------------|
| 1 Quick Wins | 0.5–1 hari | — |
| 2 Refactor | 1–2 hari | Fase 1 (opsional) |
| 3 UI Baru | 2–3 hari | Fase 2 |
| 4 Fitur | 2–3 hari | Fase 2, 3 |
| 5 Konten & QA | 3–5 hari | Fase 2–4 |
| **Total** | **±9–14 hari kerja** | |

Fase 1 dapat dikerjakan lebih dulu secara independen.
