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

- `frontend/src/styles/globals.css` — Tambah CSS variables dark mode (`.dark { ... }`) dan `html.dark { color-scheme: dark }`
- `frontend/src/app/layout.tsx` — Wrap dengan `ThemeProvider` dari next-themes, tambah `suppressHydrationWarning` di `<html>`
- `frontend/src/components/common/ThemeToggle.tsx` — Buat baru: komponen toggle Sun/Moon dengan hydration-safe rendering
- `frontend/src/components/layout/Sidebar.tsx` — Import dan pasang `ThemeToggle` di footer sidebar
- `dev-docs/ai/TASKS.md` — Tambah T-012 ke Completed Tasks

---

## 4) Snapshot Kode (Before -> After)

### 4.1 Dark Mode CSS Variables

File: `frontend/src/styles/globals.css`

Before:
```css
@layer base {
  :root {
    --background: 220 14% 96%;
    /* ... hanya light mode ... */
  }
}
```

After:
```css
@layer base {
  :root {
    --background: 220 14% 96%;
    /* ... light mode ... */
  }

  .dark {
    --background: 222 47% 8%;
    --foreground: 210 40% 92%;
    --card: 222 47% 11%;
    --sidebar: 222 47% 10%;
    /* ... semua dark mode variables ... */
  }
}
```

### 4.2 ThemeProvider di Root Layout

File: `frontend/src/app/layout.tsx`

Before:
```tsx
<html lang="en">
  <body ...>
    <AppLayout>{children}</AppLayout>
    <Toaster theme="light" ... />
  </body>
</html>
```

After:
```tsx
<html lang="en" suppressHydrationWarning>
  <body ...>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <AppLayout>{children}</AppLayout>
      <Toaster closeButton richColors />
    </ThemeProvider>
  </body>
</html>
```

### 4.3 ThemeToggle Component (Baru)

File: `frontend/src/components/common/ThemeToggle.tsx`

```tsx
export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  // hydration-safe: render setelah mount
  // toggle antara Sun (dark -> light) dan Moon (light -> dark)
}
```

### 4.4 Toggle di Sidebar Footer

File: `frontend/src/components/layout/Sidebar.tsx`

Before:
```tsx
<div className="pt-2 border-t border-border">
  <p className="text-[10px] text-muted-foreground text-center">
    Powered by <span className="text-accent font-semibold">MSF Team</span>
  </p>
</div>
```

After:
```tsx
<div className="pt-2 border-t border-border flex items-center justify-between">
  <p className="text-[10px] text-muted-foreground">
    Powered by <span className="text-accent font-semibold">MSF Team</span>
  </p>
  <ThemeToggle />
</div>
```

---

## 5) Verifikasi UAT (User Acceptance Test)

| # | Tes | Hasil | Detail |
|---|-----|-------|--------|
| 1 | Toggle button muncul di sidebar footer | - | Perlu dicek di browser |
| 2 | Klik toggle: light -> dark mode aktif | - | Perlu dicek di browser |
| 3 | Klik toggle lagi: dark -> light mode aktif | - | Perlu dicek di browser |
| 4 | Refresh halaman: tema tersimpan (localStorage) | - | Perlu dicek di browser |
| 5 | Semua halaman ikut theme (dashboard, generate, diagram, dll) | - | Perlu dicek di browser |
| 6 | Tidak ada hydration mismatch error di console | - | Perlu dicek di browser |
