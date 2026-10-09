# SQL Helper v2 — Technical & UX Specification

> **Status:** SPEC — Acuan implementasi. Rencana fase ada di [PLAN.md](./PLAN.md).
> **Tanggal:** 2026-10-09

---

## 1. Ruang Lingkup

Halaman `/sql-helper` tetap **client standalone** (tanpa backend). Spec ini mengubahnya dari "tabel admin" menjadi "pustaka skrip" yang cepat, aksesibel, dan dapat dibagikan.

---

## 2. Arsitektur & Struktur Folder

```
frontend/src/
├─ app/sql-helper/page.tsx              # tipis: compose feature
└─ features/sql-helper/
   ├─ components/
   │  ├─ SqlHelperPage.tsx              # container
   │  ├─ SearchBar.tsx
   │  ├─ FilterChips.tsx                # engine & kategori (multi-select)
   │  ├─ RiskToggle.tsx
   │  ├─ ActiveFilters.tsx              # chip aktif + reset + counter hasil
   │  ├─ ViewToggle.tsx                 # kartu | tabel
   │  ├─ ScriptList.tsx
   │  ├─ ScriptCard.tsx
   │  ├─ ScriptRow.tsx
   │  ├─ ScriptDrawer.tsx               # Radix Dialog (keputusan §13)
   │  ├─ SqlViewer.tsx                  # highlight, nomor baris, wrap, download
   │  ├─ ParamForm.tsx
   │  ├─ RiskBanner.tsx
   │  ├─ RiskBadge.tsx / CategoryBadge.tsx / EngineBadge.tsx
   │  ├─ EmptyState.tsx
   │  └─ CommandPalette.tsx             # Fase 5
   ├─ hooks/
   │  ├─ useScriptFilters.ts            # state ↔ URL
   │  ├─ useDebouncedValue.ts
   │  ├─ useFavorites.ts
   │  ├─ useRecent.ts
   │  ├─ useCopy.ts
   │  └─ useLocalStorage.ts
   ├─ lib/
   │  ├─ schema.ts                      # zod
   │  ├─ riskMeta.ts
   │  ├─ filter.ts                      # pure functions
   │  ├─ search.ts                      # fuse index
   │  ├─ interpolate.ts                 # {{param}}
   │  └─ clipboard.ts
   ├─ data/
   │  ├─ postgresql.json  mysql.json  oracle.json  mssql.json  sqlite.json
   │  └─ index.ts                       # agregasi + export typed
   └─ __tests__/
```

**Aturan:** tiap file < 500 baris (target < 200). `app/sql-helper/page.tsx` hanya merender `SqlHelperPage`. File lama di `components/sql-helper/` dihapus setelah migrasi (lihat PLAN Fase 2). Halaman `/shortcuts` tidak disentuh.

---

## 3. Model Data

### 3.1 Enum

```ts
export const Engine   = z.enum(["postgresql","mysql","oracle","mssql","sqlite"]);
export const Category = z.enum(["diagnostic","performance","maintenance","security","monitoring"]);
export const Risk     = z.enum(["low","medium","high"]);
```

### 3.2 Script

```ts
export const ParamSchema = z.object({
  key: z.string().regex(/^[a-z][a-z0-9_]*$/),
  label: z.string(),
  type: z.enum(["identifier","string","number"]).default("identifier"),
  default: z.string().optional(),
  required: z.boolean().default(false),
  hint: z.string().optional(),
});

export const ScriptSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),      // slug unik, stabil (dipakai deep link & favorit)
  title: z.string().min(3).max(80),
  description: z.string().max(240),
  whenToUse: z.string().optional(),
  engine: Engine,
  category: Category,
  risk: Risk,
  sql: z.string().min(1),
  tags: z.array(z.string()).default([]),
  params: z.array(ParamSchema).default([]),
  minVersion: z.string().optional(),         // "PG 12+", "MySQL 8.0+"
  notes: z.string().optional(),
  relatedIds: z.array(z.string()).default([]),
});
export type Script = z.infer<typeof ScriptSchema>;
```

### 3.3 Migrasi `risk_level` → `risk`

| Nilai lama | Nilai baru |
|------------|------------|
| `safe`, `read-only`, `low` | `low` |
| `caution`, `medium` | `medium` |
| `dangerous`, `high` | `high` |

Dikerjakan satu kali pada file JSON; logika mapping runtime dihapus.

### 3.4 Validasi data

- Skrip `npm run validate:data`: parse semua JSON dengan `ScriptSchema`, cek **id unik**, `relatedIds` valid, placeholder `{{x}}` di `sql` ⇔ `params` konsisten.
- Dijalankan di test (Vitest) dan CI/pre-build. **Tidak** dijalankan di runtime browser.

---

## 4. State, Filter & URL

### 4.1 Tipe filter

```ts
type SortKey = "relevance" | "title" | "risk" | "category";
interface Filters {
  q: string;
  engines: Engine[];        // [] = semua
  categories: Category[];   // [] = semua
  risks: Risk[];            // [] = semua
  sort: SortKey;
  page: number;             // 1-based
  pageSize: 10 | 20 | 50;
}
```

Tidak ada sentinel string. `[]` berarti "semua".

### 4.2 Sinkron URL

| Param | Contoh | Catatan |
|-------|--------|---------|
| `q` | `q=lock` | debounce 200ms |
| `engine` | `engine=postgresql,mysql` | koma-separated |
| `cat` | `cat=performance` | |
| `risk` | `risk=high` | |
| `sort` | `sort=title` | default `relevance` tidak ditulis |
| `page` | `page=2` | default 1 tidak ditulis |
| `script` | `script=pg-active-locks` | membuka drawer |

- Gunakan `router.replace` (bukan `push`) untuk perubahan filter; `push` untuk membuka drawer agar tombol Back menutupnya.
- Reset `page=1` dilakukan di **handler** perubahan filter (bukan `useEffect`).
- Nilai tidak valid pada URL diabaikan secara aman (fallback default).

### 4.3 Preferensi (localStorage, prefix `msfdb:sqlhelper:v1:`)

| Key | Isi |
|-----|-----|
| `view` | `"card"` \| `"table"` |
| `favorites` | `string[]` id |
| `recent` | `{id, at}[]` maks 10 |
| `params:<id>` | nilai parameter terakhir |
| `infoDismissed` | `boolean` |
| `pageSize` | `10 \| 20 \| 50` |

Akses localStorage dibungkus try/catch (mode privat/SSR), dibaca setelah mount agar tidak hydration mismatch.

---

## 5. Pencarian

- Library: **Fuse.js**; index dibuat sekali (modul-level / `useMemo` tanpa dependency berubah).
- Field & bobot: `title` 0.4, `tags` 0.25, `description` 0.2, `sql` 0.1, `whenToUse` 0.05.
- `threshold` ≈ 0.35, `ignoreLocation: true`.
- Query kosong → urutan default (kategori, lalu judul).
- Highlight kecocokan di judul/deskripsi memakai `<mark>` (escape aman, tanpa `dangerouslySetInnerHTML`).
- Filter engine/kategori/risiko diterapkan **sebelum** sorting; counter faceted dihitung dari hasil pencarian + filter lain (kecuali dirinya sendiri).

---

## 6. Spesifikasi UI/UX

### 6.1 Layout

```
Header      : Judul + subjudul 1 baris (info box dismissible opsional)
Search      : input besar, ikon, hint "/" , tombol hapus
Chip engine : [Semua] [PostgreSQL n] [MySQL n] ...
Chip kategori: [Semua] [Diagnostic n] ...
Baris kontrol: Risiko (3 toggle) | Sort | Tampilan (kartu/tabel)
Status      : "24 skrip" + chip filter aktif ✕ + Reset
Favorit/Recent (jika ada) — carousel/baris kartu kecil
Daftar      : kartu (default) | tabel
Pagination  : ringkas (prev, n, next, page size)
```

Kartu statistik di bawah **dihapus**.

### 6.2 Kartu skrip

- Judul (sans, 14px, semi-bold), deskripsi (13px, maks 2 baris).
- Preview SQL: 3 baris pertama, mono 12px, latar gelap, fade di bawah.
- Badge: risiko (ikon + teks), engine (+ versi minimum), kategori.
- Aksi: **Salin** (primer), **Detail**, ⭐ favorit.
- Seluruh kartu dapat diklik (judul = tombol/link nyata); aksi sekunder tidak memicu klik kartu.
- Hover: naik 1–2px + border aksen (nonaktif saat `prefers-reduced-motion`).

### 6.3 Tabel ringkas

Kolom: ⭐ | Nama (+ deskripsi 1 baris) | Kategori | Engine | Risiko | Aksi (Salin, Detail). Judul adalah `<button>`/`<a>` fokusable. Di layar `< md` otomatis beralih ke kartu.

### 6.4 Drawer detail

Urutan konten:
1. Header: judul, badge engine/kategori/versi, ⭐, Bagikan link, Tutup.
2. `RiskBanner` (hanya medium/high).
3. Deskripsi + "Kapan dipakai".
4. `ParamForm` (jika `params.length > 0`) + preview real-time.
5. `SqlViewer`: highlight, nomor baris, Wrap, Salin, Unduh `.sql`.
6. Catatan/`notes` bila ada.
7. Skrip terkait (`relatedIds`) dan tag (klik → terapkan filter `q`).
8. Footer sticky: Prev/Next, **Salin SQL** (primer).

**Perilaku risiko:**

| Risk | Banner | Tombol Salin |
|------|--------|--------------|
| low | — | Normal |
| medium | Kuning: "Mengubah data/objek. Backup & uji di staging." | Normal |
| high | Merah: "Destruktif. Jalankan di transaksi bila memungkinkan." | Aktif setelah centang "Saya paham risikonya" |

Pilihan konfirmasi tidak disimpan antar sesi.

### 6.5 Parameter template

- Placeholder `{{key}}` di `sql`; `params[]` mendefinisikan input.
- Tipe & validasi:

| type | Aturan | Perlakuan |
|------|--------|-----------|
| `identifier` | `^[A-Za-z_][A-Za-z0-9_$]*$` | Disisipkan apa adanya |
| `number` | `^-?\d+(\.\d+)?$` | Disisipkan apa adanya |
| `string` | bebas | `'` digandakan (`''`), tidak ada interpolasi lain |

- Placeholder wajib yang kosong tetap tampil sebagai `{{key}}` di preview dan **menonaktifkan tombol Salin** (kecuali untuk skrip tanpa param).
- Nilai yang disisipkan di-highlight pada preview.
- Catatan UI: "Ini generator teks. Periksa SQL sebelum dijalankan."
- Nilai terakhir diingat per skrip (`params:<id>`).

### 6.6 Keyboard & Shortcut

| Tombol | Aksi |
|--------|------|
| `/` | Fokus pencarian |
| `Esc` | Kosongkan pencarian / tutup drawer |
| `←` `→` | Skrip sebelumnya/berikutnya (di drawer) |
| `Ctrl/⌘+K` | Command palette (Fase 5) |
| `Ctrl/⌘+Shift+C` | Salin SQL di drawer (opsional) |

Shortcut tidak aktif saat fokus di input/textarea (kecuali `Esc`).

### 6.7 State kosong, loading, error

- **Empty:** ilustrasi ringan, saran spesifik ("Hapus filter Risiko"), tombol **Reset**, tautan "Usulkan skrip".
- **Loading:** skeleton kartu saat hidrasi/Suspense (cegah layout shift).
- **Clipboard gagal:** toast error + pilih otomatis teks SQL agar bisa salin manual.

### 6.8 Visual

- Tipografi: judul/deskripsi sans 13–14px; mono untuk SQL, badge, label teknis (min 11px untuk badge).
- Kontras teks ≥ **4.5:1** (WCAG AA), termasuk `muted-foreground` pada tema terang & gelap.
- Satu warna aksen untuk aksi utama; warna kategori dikurangi, engine pakai ikon monokrom.
- Badge risiko = ikon + teks + warna (tidak hanya warna).
- Spacing kartu 16–20px; lebar teks deskripsi dibatasi.
- Dukungan light & dark memakai token tema yang ada.
- Animasi ≤ 200ms, dinonaktifkan di `prefers-reduced-motion`.

### 6.9 Responsif

| Breakpoint | Perilaku |
|------------|----------|
| `< sm` | 1 kolom kartu, chip scroll horizontal, drawer full-width |
| `sm–lg` | 2 kolom kartu |
| `≥ lg` | 3 kolom kartu atau tabel; drawer maks `xl` |

---

## 7. Aksesibilitas (wajib)

- Semua kontrol dapat dioperasikan keyboard; fokus terlihat (`focus-visible:ring`).
- `<label htmlFor>` ↔ `id` untuk setiap input/select; chip memakai `role="group"`/`aria-pressed`.
- Drawer: `role="dialog"`, `aria-modal`, `aria-labelledby`, focus trap, fokus kembali ke pemicu (Radix Dialog).
- Jangan memakai `<tr onClick>` sebagai satu-satunya interaksi.
- Counter hasil memakai `aria-live="polite"`.
- Toast terbaca screen reader.
- Target sentuh ≥ 40×40px untuk aksi utama di mobile.
- Hormati `prefers-reduced-motion` dan `prefers-color-scheme`.
- Lolos `axe` (0 critical/serious) pada halaman & drawer.

---

## 8. Robustness & Performa

- `copyText()` : `navigator.clipboard` → fallback `textarea + execCommand` → return boolean; toast sesuai hasil.
- `setTimeout`/listener selalu dibersihkan; `body.overflow` dikembalikan ke nilai sebelumnya (otomatis lewat Radix).
- Highlighter dimuat lazy (`next/dynamic`), fallback `<pre>` polos.
- Metadata daftar dan `sql` tetap satu bundle selama data < ~300 skrip; bila lebih, pisahkan `sql` per engine via dynamic import.
- Virtualisasi (`@tanstack/react-virtual`) hanya bila daftar tampil > 300 item.
- Budget bundle: tambahan halaman ≤ **+60KB gzip** (tanpa konten data).
- Tidak ada `any` baru; `strict` TypeScript tetap aktif.

---

## 9. Konten

**Engine target:** PostgreSQL, MySQL (ada) + Oracle, SQL Server, SQLite.
**Target:** 60–100 skrip. Topik prioritas:

| Kategori | Topik |
|----------|-------|
| Diagnostic | lock/blocking, long-running query, koneksi aktif, duplikat, orphan FK |
| Performance | ukuran tabel/indeks, indeks tidak terpakai, bloat, slow query, cache hit ratio |
| Maintenance | vacuum/analyze, reindex, ubah owner, kill session, rotasi log |
| Security | audit privilege, user tanpa password, grant least-privilege template |
| Monitoring | replikasi lag, kapasitas tablespace/disk, deadlock, backup terakhir |

Standar tiap skrip: judul actionable, `whenToUse`, `minVersion`, `risk` tepat, catatan keamanan untuk medium/high, `id` slug stabil.

---

## 10. Testing

| Level | Alat | Cakupan minimum |
|-------|------|-----------------|
| Unit | Vitest | `filter`, `search`, `interpolate` (termasuk escape), `schema` (semua JSON), parsing URL |
| Komponen | Testing Library | filter chip, empty state, drawer buka/tutup, salin, konfirmasi High, form param |
| E2E | Playwright | cari → buka → isi param → salin; deep link; favorit persisten; mobile viewport |
| A11y | axe-core | Halaman + drawer, light & dark |
| Build | CI | `lint`, `tsc --noEmit`, `validate:data`, `build` |

---

## 11. Kriteria Penerimaan

| ID | Kriteria |
|----|----------|
| AC-1 | Salin SQL dapat dilakukan dari daftar tanpa membuka drawer |
| AC-2 | Filter, pencarian, halaman, dan drawer tercermin di URL; membuka URL yang sama mereproduksi tampilan |
| AC-3 | Semua JSON lulus `validate:data`; tidak ada nilai risiko di luar `low|medium|high` |
| AC-4 | Tidak ada string sentinel `"ALL …"`/`"SEMUA …"` di kode |
| AC-5 | Satu implementasi badge risiko dipakai di seluruh fitur |
| AC-6 | Skrip High mewajibkan konfirmasi sebelum tombol Salin aktif |
| AC-7 | Skrip berparameter tidak dapat disalin sebelum parameter wajib valid; escape `string` benar |
| AC-8 | Navigasi keyboard penuh; axe 0 critical/serious |
| AC-9 | Gagal clipboard menampilkan toast error (bukan sukses) |
| AC-10 | Tampilan mobile (<640px) memakai kartu, tanpa scroll horizontal |
| AC-11 | Favorit & terakhir dipakai bertahan setelah reload |
| AC-12 | `/shortcuts` dan modul lain tidak berubah perilakunya |
| AC-13 | Semua file < 500 baris; build & test lulus |

---

## 12. Out of Scope / Ide Lanjutan

- Eksekusi SQL langsung / koneksi ke database.
- Ekspor massal `.zip`, impor favorit JSON.
- Form "Usulkan skrip" (template GitHub Issue/PR).
- Sinkron favorit lintas perangkat (butuh akun/backend).

---

## 13. Keputusan (Resolved 2026-10-09)

| # | Topik | Keputusan | Alasan / Implikasi |
|---|-------|-----------|--------------------|
| 1 | Syntax highlighter | **`shiki`** | Konten hanya ditampilkan (read-only), tanpa interaksi FE/BE, jadi akurasi lebih penting daripada ukuran. Wajib dimuat lazy (`next/dynamic`), pakai `createHighlighter` singleton, bahasa dimuat hanya `sql`, tema `github-dark` (+ `github-light` untuk light mode). Fallback `<pre>` polos saat belum siap. |
| 2 | Drawer | **Radix Dialog** (`@radix-ui/react-dialog`) | Focus trap, ESC, aria, dan scroll lock bawaan. Tidak memakai `vaul`. |
| 3 | Nasib `/shortcuts` | **Digantikan bila stabil** | `/shortcuts` tetap utuh selama SQL Helper v2 belum stabil. Penggantian (redirect/penghapusan menu) hanya dilakukan setelah kriteria AC-1..AC-13 terpenuhi dan fitur setara/lebih baik; dicatat sebagai ADR terpisah saat dieksekusi. |
| 4 | Bahasa UI | **Istilah teknis tetap Inggris** (Script, Category, Risk, Engine) | Bahasa lain mungkin ditambah nanti, jadi **semua string UI dipusatkan** di `lib/labels.ts` (bukan hardcode di JSX) agar mudah dimigrasi ke i18n. Pemakaian key di data (`engine`, `category`, `risk`) tetap bahasa-netral. |

### Dampak ke spesifikasi

- Tambah `features/sql-helper/lib/labels.ts` sebagai satu-satunya sumber teks UI (judul, placeholder, pesan empty/error, label badge, toast).
- `riskMeta` memakai `labelKey`, bukan teks literal.
- `SqlViewer`: `shiki` dimuat lazy; budget bundle dihitung **tanpa** chunk shiki (chunk async terpisah, hanya dimuat saat drawer/preview pertama dibuka).
- Data skrip (`title`, `description`, `whenToUse`, `notes`) saat ini satu bahasa; bila nanti multi-bahasa, ubah ke bentuk `{ en: string, id?: string }` lewat migrasi schema (di luar scope v2).
