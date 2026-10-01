# LAPORAN TASK FRONTEND

Tanggal: 2026-09-21
Task: maintenance-modal
Repo: msf-app
Branch: main
Commit: f1a8c2d

---

## 1) Deskripsi Perubahan

Menambahkan komponen modal **`MaintenanceModal`** yang ramah dan informatif dengan ilustrasi teknisi server lucu, estimasi perbaikan, backdrop blur, dan tombol *"Saya Mengerti (Preview UI)"*. Modal ini dipasang secara spesifik pada modul yang terhubung langsung dengan backend dan engine pemrosesan:
1. **AI Generator** (`src/app/generate/page.tsx`)
2. **MSF Diagram** (`src/app/diagram/page.tsx`)

Fitur-fitur asli di latar belakang (seperti Monaco SQL Editor, Tab DDL / Live DB, panel konfigurasi AI, dan kanvas diagram) tetap terlihat di balik lapisan transparan (*frosted glass*). Pengguna dapat menutup modal dengan menekan tombol hijau atau ikon close untuk menjelajahi antarmuka secara leluasa. Saat modal tertutup, sebuah pill/badge mengambang (*floating trigger*) di pojok bawah tetap tersedia untuk membuka kembali informasi maintenance kapan saja.

Selain itu, modal konstruksi global lama (`UnderConstructionModal`) dilepas dari `RootLayout` (`src/app/layout.tsx`) agar popup tidak mengganggu halaman lain yang tidak berhubungan, serta `next.config.js` diperbarui agar mendukung `BACKEND_URL` dinamis saat dideploy ke platform cloud seperti Vercel.

---

## 2) Tujuan dan Manfaat

- **Transparansi Status Sistem:** Memberikan kejelasan kepada pengguna/klien bahwa layanan backend pemrosesan AI & database sedang dalam pemeliharaan tanpa memberi kesan bahwa aplikasi rusak atau blank.
- **Preview UI Tetap Berfungsi:** Pengunjung tetap dapat melihat kemewahan antarmuka MSF DB (tampilan form, editor skrip DDL, pengaturan output DOCX/PDF) di balik modal.
- **Pengalaman Pengguna (UX) Ramah:** Karakter ilustrasi teknisi yang bersahabat mengurangi friksi pengguna, dan modal dapat ditutup dengan satu klik sehingga pengguna bebas mencoba mengetik di editor.
- **Dukungan Deploy Vercel:** Memudahkan pemilik proyek untuk mendeploy frontend ke Vercel sementara server pribadi sedang mengalami perbaikan.

---

## 3) Daftar File yang Diubah

- `msf-app/frontend/public/images/technician-avatar.png` [NEW]
- `msf-app/frontend/src/components/common/MaintenanceModal.tsx` [NEW/MODIFY]
- `msf-app/frontend/src/components/layout/Sidebar.tsx` [MODIFY]
- `msf-app/frontend/src/app/generate/page.tsx` [MODIFY]
- `msf-app/frontend/src/app/diagram/page.tsx` [MODIFY]
- `msf-app/frontend/src/app/layout.tsx` [MODIFY]
- `msf-app/frontend/next.config.js` [MODIFY]
- `msf-app/dev-docs/CHANGELOG.md` [MODIFY]
- `msf-app/dev-docs/COMMIT_LOG.md` [MODIFY]
- `msf-app/dev-docs/commit-logs/2026-09-21.md` [MODIFY]

---

## 4) Snapshot Kode (Before → After)

### 4.1 Integrasi MaintenanceModal pada Halaman AI Generator

File: `msf-app/frontend/src/app/generate/page.tsx`

Before:
```tsx
  return (
    <div className="space-y-6">
      {/* Jika sedang memproses pembuatan dokumentasi */}
      {isGenerating ? (
```

After:
```tsx
  return (
    <div className="space-y-6">
      {/* Maintenance Notice Modal */}
      <MaintenanceModal
        title="Layanan AI Generator Sedang Maintenance"
        description="Halo pengguna MSF DB, kami sedang melakukan pemeliharaan rutin pada modul AI Generator untuk meningkatkan performa dan fitur. Harap sabar, kami akan segera kembali online!"
        estimateTime="15 MENIT LAGI"
        storageKey="msf_maintenance_generator"
      />

      {/* Jika sedang memproses pembuatan dokumentasi */}
      {isGenerating ? (
```

### 4.2 Integrasi MaintenanceModal pada Halaman MSF Diagram

File: `msf-app/frontend/src/app/diagram/page.tsx`

Before:
```tsx
  return (
    <div className="space-y-5 animate-fade-in-up h-[calc(100vh-120px)] flex flex-col">
      {/* Page Header */}
```

After:
```tsx
  return (
    <div className="space-y-5 animate-fade-in-up h-[calc(100vh-120px)] flex flex-col">
      {/* Maintenance Notice Modal */}
      <MaintenanceModal
        title="Layanan MSF Diagram Sedang Maintenance"
        description="Halo pengguna MSF DB, kami sedang melakukan pemeliharaan rutin pada modul parser & visualisasi diagram database. Harap sabar, kami akan segera kembali online!"
        estimateTime="15 MENIT LAGI"
        storageKey="msf_maintenance_diagram"
      />

      {/* Page Header */}
```

### 4.3 Pembersihan Modal Global di RootLayout

File: `msf-app/frontend/src/app/layout.tsx`

Before:
```tsx
        <AppLayout>{children}</AppLayout>

        {/* Under Construction Popup */}
        <UnderConstructionModal />

        {/* Sonner Toast Notifications */}
```

After:
```tsx
        <AppLayout>{children}</AppLayout>

        {/* Sonner Toast Notifications */}
```

---

## 5) Verifikasi UAT (User Acceptance Test)

| # | Skenario Tes | Hasil | Detail |
|---|--------------|:-----:|--------|
| 1 | Render modal di halaman `/generate` | ✅ | Modal muncul di tengah dengan ilustrasi teknisi, teks ramah, dan estimasi waktu |
| 2 | Background fitur di `/generate` terlihat | ✅ | Monaco SQL editor dan panel konfigurasi AI tampak di belakang modal dengan blur lembut |
| 3 | Aksi tombol "Saya Mengerti (Preview UI)" | ✅ | Modal tertutup mulus dan menyimpan state di sessionStorage |
| 4 | Floating trigger saat modal ditutup | ✅ | Tombol kecil "Mode Maintenance" muncul di pojok kanan bawah untuk membuka kembali info |
| 5 | Render modal di halaman `/diagram` | ✅ | Modal muncul dengan judul spesifik untuk modul MSF Diagram |
| 6 | Halaman lain (Dashboard, Settings, Landing) | ✅ | Bersih dari popup global yang mengganggu |
| 7 | Kepatuhan File Size Limits (< 500 baris) | ✅ | Semua file modifikasi < 300 baris |
| 8 | Larangan Git Push | ✅ | Tidak ada perintah `git push` yang dijalankan |
