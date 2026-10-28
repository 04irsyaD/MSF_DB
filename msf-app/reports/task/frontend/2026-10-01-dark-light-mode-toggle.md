# LAPORAN TASK FRONTEND

Tanggal: 2026-10-01  
Task: dark-light-mode-toggle  
Repo: msf-app  
Branch: dev  
Commit: (pending)  

---

## 1) Deskripsi Perubahan

Implementasi fitur Dark/Light Mode Toggle menggunakan library `next-themes`. Pengguna dapat beralih antara tema terang dan gelap melalui tombol toggle di bagian footer sidebar. Preferensi tema disimpan secara otomatis di `localStorage` browser sehingga persisten setelah refresh.

---

## 2) Tujuan dan Manfaat

- Memenuhi backlog TODO.md item "Tambahkan toggle Dark/Light Mode di Sidebar menggunakan next-themes"
- Meningkatkan kenyamanan pengguna yang bekerja di lingkungan gelap (malam hari / ruangan redup)
- Preferensi tersimpan persisten di localStorage — tidak reset setelah refresh
- Tidak mengubah color palette utama (emerald accent tetap sama di kedua mode)

---

## 3) Daftar File yang Diubah

- `frontend/src/styles/globals.css` — Tambah CSS variables dark mode (`.dark { ... }`), fallback utility dark mode (`.dark .bg-white`, `.dark .text-gray-*`, `.dark select option`), dan `html.dark { color-scheme: dark }`
- `frontend/src/app/layout.tsx` — Wrap dengan `ThemeProvider` dari next-themes, tambah `suppressHydrationWarning` di `<html>`
- `frontend/src/components/common/ThemeToggle.tsx` — Buat baru: komponen toggle Sun/Moon dengan hydration-safe rendering
- `frontend/src/components/layout/Sidebar.tsx` — Import dan pasang `ThemeToggle` di footer sidebar
- `frontend/src/components/sql-helper/SqlHelperTable.tsx` — Ganti hardcoded `bg-white`, `bg-gray-50`, `text-gray-900` ke semantic tokens (`bg-card`, `bg-muted/50`, `text-foreground`)
- `frontend/src/components/sql-helper/SqlHelperStats.tsx` — Ganti card background dan text color ke `bg-card` & `text-foreground`
- `frontend/src/components/sql-helper/SqlHelperFilter.tsx` — Ganti background filter box, inputs, select options, dan reset button ke semantic tokens
- `frontend/src/components/sql-helper/SqlHelperInfoBox.tsx` — Ubah background dan text agar adaptif terhadap light dan dark mode
- `frontend/src/components/sql-helper/SqlHelperDrawer.tsx` — Ganti background drawer, headers, risk badge, dan teks ke semantic tokens
- `frontend/src/components/shortcuts/ShortcutCard.tsx` — Adaptasi badge engine, border, dan teks ke dark mode
- `frontend/src/components/shortcuts/ShortcutFilter.tsx` — Ganti background filter box dan select option ke semantic tokens
- `frontend/src/app/shortcuts/page.tsx` — Adaptasi info box dan container ke semantic tokens
- `frontend/src/app/dashboard/page.tsx` — Adaptasi action cards, list history, dan security badge ke semantic tokens
- `frontend/src/components/common/MaintenanceModal.tsx` — Modal maintenance adaptif terhadap dark/light mode
- `frontend/src/components/common/UnderConstructionModal.tsx` — Modal under construction adaptif terhadap dark/light mode
- `dev-docs/ai/TASKS.md` — Tambah T-012 ke Completed Tasks

---

## 4) Snapshot Kode (Before -> After)

### 4.1 Dark Mode CSS Variables & Utility Fallbacks

File: `frontend/src/styles/globals.css`

```css
.dark {
  --background: 222 47% 8%;
  --foreground: 210 40% 92%;
  --card: 222 47% 11%;
  --sidebar: 222 47% 10%;
  --muted: 222 47% 14%;
  --border: 222 47% 18%;
}

/* Fallback kompatibilitas jika ada class utility statis */
.dark .bg-white { background-color: hsl(var(--card)); }
.dark .bg-gray-50 { background-color: hsl(var(--muted) / 0.4); }
.dark .text-gray-900, .dark .text-gray-800 { color: hsl(var(--foreground)); }
.dark select option { background-color: hsl(var(--card)); color: hsl(var(--foreground)); }
```

---

## 5) Verifikasi UAT (User Acceptance Test)

| # | Tes | Hasil | Detail |
|---|-----|-------|--------|
| 1 | Toggle button muncul di sidebar footer | SUKSES | Icon Moon/Sun tampil rapi di samping label "Powered by MSF Team" |
| 2 | Klik toggle: light -> dark mode aktif | SUKSES | Sidebar, header, dan seluruh konten utama berganti tema gelap |
| 3 | Perbaikan bug konten putih di SQL Helper | SUKSES | Table, headers, pagination, filter box, info box, dan metric stats menjadi gelap elegan |
| 4 | Keterbacaan teks di dark mode | SUKSES | Judul skrip, deskripsi, badges, dan input teks kontras dan jelas terbaca |
| 5 | Klik toggle lagi: dark -> light mode aktif | SUKSES | Kembali ke tema terang bersih tanpa glitch |
| 6 | Refresh halaman: tema tersimpan (localStorage) | SUKSES | Preferensi tema tetap terjaga setelah browser di-refresh |
| 7 | Tidak ada hydration mismatch / typecheck error | SUKSES | `npx tsc --noEmit` lolos 0 error |
