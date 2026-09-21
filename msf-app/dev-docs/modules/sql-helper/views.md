# Views & Komponen UI: SQL Helper

Dokumentasi spesifikasi antarmuka pengguna untuk modul **SQL Helper** (`/sql-helper`).

---

## 1. Daftar Komponen

| Komponen | Lokasi Berkas | Tanggung Jawab |
|----------|---------------|----------------|
| `SqlHelperPage` | `src/app/sql-helper/page.tsx` | Controller state utama (search, filter, pagination, selected drawer) |
| `SqlHelperTable` | `src/components/sql-helper/SqlHelperTable.tsx` | Render tabel data grid kueri + kontrol pagination bar |
| `SqlHelperDrawer` | `src/components/sql-helper/SqlHelperDrawer.tsx` | Slide-over detail kueri via React Portal (`createPortal`) |
| `SqlHelperFilter` | `src/components/sql-helper/SqlHelperFilter.tsx` | Search bar teks bebas, filter Engine, Category, Risk, dan tombol Reset |
| `SqlHelperInfoBox` | `src/components/sql-helper/SqlHelperInfoBox.tsx` | Banner panduan skrip diagnostik & administrasi database |
| `SqlHelperStats` | `src/components/sql-helper/SqlHelperStats.tsx` | Kartu ringkasan metrik (Total skrip, Active Engine, Mode Status) |

---

## 2. Spesifikasi Pagination (`SqlHelperTable`)

1. **Konfigurasi Default**:
   - `pageSize`: **5 baris per halaman** (disesuaikan untuk viewport standar laptop).
   - Opsi `pageSize`: 5, 10, 20 baris per halaman.
   - Default `currentPage`: 1.
2. **Perilaku Reset State**:
   - Setiap kali terjadi perubahan pada filter pencarian (`search`), engine, category, atau risk level di `page.tsx`, `currentPage` otomatis di-reset ke 1.
3. **Komponen Navigasi Pagination**:
   - Teks Info: `Menampilkan {startIdx}–{endIdx} dari {totalCount} skrip`.
   - Tombol Navigasi:
     - `Sebelumnya` (disabled jika di halaman 1).
     - Tombol nomor halaman numerik dengan status aktif disorot (`bg-[#00bfa5] text-white`).
     - `Selanjutnya` (disabled jika di halaman terakhir).

---

## 3. Spesifikasi Slide-Over Drawer (`SqlHelperDrawer`)

1. **Arsitektur Rendering**:
   - Wajib menggunakan **React Portal** (`createPortal(drawerContent, document.body)`) untuk mencegah *stacking context containment* dari parent beranimasi CSS (`animate-fade-in-up`).
2. **Layout & Dimensi**:
   - Backdrop: `fixed inset-0 z-[100] bg-black/40 backdrop-blur-xs`.
   - Panel Drawer: `fixed inset-y-0 right-0 z-[100] w-full sm:max-w-xl bg-white shadow-2xl flex flex-col h-full`.
   - Header Drawer: Sticky di atas dengan judul kueri, badge engine/kategori, dan tombol close `X`.
   - Body Drawer: Scrollable secara mandiri (`overflow-y-auto`) menampilkan deskripsi, level risiko, kode SQL terformat, dan tags.
   - Footer Drawer: Sticky di bawah dengan tombol *Tutup* dan *Salin Kueri SQL* (terhubung ke clipboard & Sonner toast).

---

## 4. Spesifikasi Responsivitas

1. **Layar Lebar (Desktop/Laptop $\ge$ 1024px)**:
   - Tabel menampilkan kolom lengkap: `Script Name`, `Category`, `Engine`, `Risk`, `Action`.
   - Filter bar tertata dalam 4 kolom sejajar secara proporsional.
2. **Layar Sedang & Sempit (Laptop 13-14" / Resize Window / Tablet $\le$ 900px)**:
   - Kolom tabel tetap adaptif tanpa memotong tombol Action.
   - Dropdown filter responsif dengan tombol Reset sejajar presisi.
   - Padding container menggunakan breakpoint adaptif: `p-4 sm:p-6 lg:p-8`.

---

> Mengikuti aturan arsitektur frontend dan Anti-Monster Rule (`< 500 baris`).
