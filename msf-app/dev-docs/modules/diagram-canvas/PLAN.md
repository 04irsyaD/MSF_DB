# MSF Diagram — Bugfix & Responsive Plan

> **Status:** IMPLEMENTED (2026-10-16, branch `feat/diagram-fix`, belum commit) — semua ID D-01 s/d D-12, C-01 s/d C-21, P-01 s/d P-08 dikerjakan. Hasil QA di [QA_CHECKLIST.md](./QA_CHECKLIST.md); sisa uji manual: zoom browser 125%/150%, Firefox/Edge, Live DB Connector.
>
> Temuan tambahan saat implementasi: Fit tertutup toolbar mengambang (diperbaiki: Fit mengukur tinggi toolbar), PNG dark mode transparan (diperbaiki: komposit warna latar), kolom bernama `unique_code`/`check_in`/`key_name` dibuang parser (diperbaiki), emoji di nama template (dihapus), `MaintenanceModal` tanpa `try/catch` storage (diperbaiki).
> **Tanggal:** 2026-10-16
> **Modul:** [Diagram Canvas](./README.md) (`/diagram`) + [SQL Parser](../sql-parser/README.md) (`POST /api/generate/parse-ddl`)
> **Aturan kerja AI:** [dev-docs/ai/CODING_RULES.md](../../ai/CODING_RULES.md)

---

## 1. Latar Belakang

Laporan user (laptop layar kecil, viewport sekitar 1364x666):

1. Klik **Pusatkan Layar (Fit)** membuat diagram terpotong di bawah, terasa "zoom ke tabel yang aneh".
2. Tombol **Rerender Diagram** menumpuk di atas textarea kode SQL; isi textarea terlihat di bawah tombol.
3. Area diagram terlalu sempit di layar kecil; diminta tombol fullscreen.

Analisis kode menemukan masalah yang lebih luas: tinggi elemen di-hardcode, logika viewport (zoom/pan/drag) tidak konsisten, auto-fit tidak jalan di kasus tertentu, dan **parser DDL di backend salah membaca tipe data** (contoh: `showtime_id INT` tampil sebagai `time`, terlihat di screenshot user).

Bukti yang sudah dijalankan (2026-10-16):

- `SQLParser.parse()` dengan input uji: `showtime_id INT` jadi `TIME`, `settings JSON` jadi `SET`, `created_at TIMESTAMP` jadi `TIME`, `booking_date DATETIME` jadi `DATE`; `CREATE TABLE [dbo].[orders]`, `CREATE TEMPORARY TABLE`, dan `ALTER TABLE ... ADD FOREIGN KEY` tidak terbaca sama sekali.
- `pytest tests/test_sql_parser.py`: 11 passed, tetapi tidak ada test yang mencakup kasus di atas.
- `tsc --noEmit`: bersih. `next lint`: 3 warning `react-hooks/exhaustive-deps` di file diagram.
- Template `social` dan `booking` sama-sama 8 tabel; template `ecommerce`, `saas`, `library` sama-sama 6 tabel (memicu bug C-03).

## 2. Tujuan

| # | Tujuan | Indikator keberhasilan |
|---|--------|------------------------|
| G1 | Tidak ada elemen terpotong/menumpuk di layar kecil | Lolos QA di 1366x768, 1280x720, dan zoom browser 125% |
| G2 | Fit selalu menampilkan seluruh diagram | 10 template x 7 layout: semua tabel terlihat setelah Fit |
| G3 | Zoom/pan/drag terasa natural | Zoom berporos di tengah/kursor, tabel menempel ke kursor saat drag di zoom berapa pun |
| G4 | Mode fullscreen untuk layar kecil | Masuk/keluar via tombol dan Esc, diagram otomatis di-fit ulang |
| G5 | Data diagram benar | Tipe kolom sesuai DDL; FK dari `ALTER TABLE` terbaca; regression test hijau |
| G6 | Kode bisa dirawat & dites | `DiagramCanvas.tsx` < 500 baris; logika layout/geometri murni dan punya unit test |

## 3. Non-Goals

- Tidak mengganti engine diagram ke library lain (React Flow, dsb.) pada plan ini.
- Tidak menambah fitur baru selain fullscreen dan zoom pakai scroll.
- Tidak mengubah API contract `parse-ddl` (bentuk response tetap `TableMetadata[]`).
- Tidak menyentuh batch keamanan T-021 sampai T-033 (`SECURITY_REMEDIATION_PLAN.md`), kecuali tidak bentrok.

---

## 4. Inventaris Bug

Severity: **Critical** = data salah / fitur tidak bisa dipakai; **High** = terlihat langsung oleh user di kasus umum; **Medium** = muncul di kasus tertentu; **Low** = kosmetik / kualitas kode.

### 4.1 Halaman `/diagram` — `frontend/src/app/diagram/page.tsx`

| ID | Severity | Gejala (user) | Akar masalah (developer) | Lokasi |
|----|----------|---------------|--------------------------|--------|
| D-01 | High | Tombol Rerender menumpuk di atas textarea; isi kode muncul di bawah tombol; pane kiri punya scrollbar aneh | Wrapper `h-full flex-col` di dalam scroll container. Wrapper `flex-1 min-h-0` boleh menyusut, tapi textarea `min-h-[250px]` tidak bisa, jadi textarea meluber dan tombol mendarat di tengahnya | baris 162-234 |
| D-02 | High | Pola sama di tab Live DB Connector: tombol "Tarik Skema" bisa menutupi form | Struktur identik dengan D-01 | baris 237-263 |
| D-03 | Medium | Halaman bisa di-scroll sedikit (sekitar 8px) di layar `lg` | `h-[calc(100vh-120px)]`, padahal header 64px + padding `main` `lg:p-8` (64px) = 128px | baris 109, `AppLayout.tsx:38` |
| D-04 | High | Di tablet/HP (`< lg`), editor dan diagram sama-sama gepeng dan terpotong | Dua pane ditumpuk (`grid-cols-1`) tapi tetap dijejalkan ke satu tinggi layar (`flex-1 min-h-0`) | baris 109, 131 |
| D-05 | Low | Ikon judul halaman lebih besar dari yang dimaksud | `h-5.5 w-5.5` tidak ada di Tailwind 3.4, jadi class diabaikan | baris 122 |
| D-06 | Medium | Dropdown template masih menampilkan nama template setelah kode diedit; memilih template yang sama lagi tidak memuat ulang | `<select defaultValue="">` tidak terkontrol; `onChange` tidak terpicu untuk nilai yang sama | baris 168-180 |
| D-07 | Medium | Ganti template cepat-cepat bisa menampilkan diagram template sebelumnya | Tidak ada pembatalan/penanda request; respons lama bisa menimpa yang baru | `handleVisualizeDDL` baris 48-72 |
| D-08 | Medium | Kode DDL user tertimpa tanpa konfirmasi saat klik "Gunakan Contoh"/template; hilang saat pindah halaman | Tidak ada konfirmasi; tidak ada draft tersimpan | baris 41-46, 74-81 |
| D-09 | Low | Tidak terlihat | `useEffect` auto-visualize saat mount tidak pernah jalan karena `sqlContent` selalu kosong saat mount (dead code + warning lint) | baris 43-46 |
| D-10 | Low | Ganti dialek tidak me-render ulang dan tidak ada petunjuk | Dialek hanya dipakai saat klik tombol | baris 186-196 |
| D-11 | Low | Teks deskripsi bilang "secara langsung", padahal harus klik tombol | Copy tidak sesuai perilaku | baris 125 |
| D-12 | Low | Label, tab, dan textarea sulit dibaca (9-10px) | Ukuran font terlalu kecil untuk UI dan input kode | seluruh halaman |

### 4.2 Kanvas — `frontend/src/components/diagram/DiagramCanvas.tsx` (890 baris)

| ID | Severity | Gejala (user) | Akar masalah (developer) | Lokasi |
|----|----------|---------------|--------------------------|--------|
| C-01 | Critical | Bagian bawah diagram terpotong di layar kecil | Tinggi kanvas di-hardcode `h-[600px]`, padahal parent tingginya mengikuti layar dan `overflow-hidden` | baris 715 |
| C-02 | High | Fit menaruh diagram terlalu ke bawah, separuh hilang | `handleResetZoom` memakai `clientHeight` (600), bukan area yang benar-benar terlihat (akibat C-01) | baris 443-495 |
| C-03 | High | Pindah ke template dengan jumlah tabel yang sama: diagram tidak di-fit, muncul di zoom 1 posisi (0,0) | Effect auto-fit hanya jalan jika `layoutStyle` atau `tables.length` berubah; effect `[tables]` me-reset zoom ke 1 dan pan ke 0 | baris 389-394, 498-516 |
| C-04 | Medium | Skema besar tidak bisa di-zoom out sampai muat | Batas zoom Fit 0.45, tombol zoom out 0.5 (tidak konsisten) | baris 482, 773 |
| C-05 | Medium | Zoom in/out membuat diagram "lari" ke kiri atas | Hanya `zoom` yang diubah, `pan` tidak dikompensasi; `transformOrigin: 0 0` | baris 765, 773 |
| C-06 | Medium | Saat zoom bukan 1, tabel yang di-drag bergerak lebih cepat/lambat dari kursor | Delta mouse tidak dibagi `zoom` | baris 405-428 |
| C-07 | Medium | Di HP/tablet tidak bisa geser kanvas atau drag tabel; tidak ada zoom via scroll | Hanya `onMouse*`, tanpa pointer/touch events dan wheel | baris 790-797 |
| C-08 | Medium | Garis relasi hilang/terpotong untuk skema besar atau tabel yang di-drag ke kiri/atas | Kanvas fixed 5000x5000; SVG `overflow: hidden` memotong koordinat negatif atau > 5000 | baris 804-809 |
| C-09 | Medium | Tabel yang di-hover tidak naik ke atas tabel lain | `z-25` tidak ada di skala Tailwind 3.4 (tidak di-extend di `tailwind.config.ts`) | baris 829 |
| C-10 | Medium | Ujung garis FK bisa meleset dari baris kolom, makin ke bawah makin geser (perlu diukur) | Konstanta `HEADER_HEIGHT`/`COLUMN_HEIGHT` tidak menghitung `py-1` list kolom dan border; tidak diukur dari DOM | baris 30-32, 588-591 |
| C-11 | Low | Panah relasi menghadap terbalik untuk relasi satu kolom/self-reference sisi kanan | Rumus arrowhead memakai `endX - 6` untuk kasus overlap kanan; variabel `targetStubX`/`midX` tidak terpakai | baris 640-648, 684-689 |
| C-12 | Medium | Layout Organik berbeda tiap render; tabel dengan nama sama di schema berbeda saling tumpuk (live DB) | `Math.random()`; posisi dan React `key` memakai `table.name` saja | baris 79-82, 818 |
| C-13 | Medium | Layout Horizontal/Vertikal kadang menaruh child sejajar/di belakang parent (DAG dengan banyak jalur) | BFS memperbarui `levels[child]` setelah node dikunjungi, jadi turunannya tidak ikut diperbarui | baris 320-337 |
| C-14 | Low | Layout Lingkaran/Pusat Relasi bisa menumpuk di tepi | Offset tetap `-100` (bukan tinggi tabel) + clamp `Math.max(50, ...)` | baris 68-72, 210-224 |
| C-15 | Medium | PNG di dark mode: latar terang dengan kartu gelap; ekspor saat posisi belum siap bisa gagal | `backgroundColor: "#f9fafb"` hardcode; bounding box bisa `Infinity` | baris 518-560 |
| C-16 | Low | Ekspor Mermaid kehilangan relasi kedua antara dua tabel yang sama (misal `origin_id` dan `dest_id`) | Dedup memakai pasangan tabel, bukan tabel+kolom; clipboard tanpa `catch` | `lib/mermaidGenerator.ts`, `MermaidExportModal.tsx` |
| C-17 | Low | Badge "Mode Maintenance" menutupi pojok kanan bawah kanvas | `fixed bottom-5 right-5 z-40` | `MaintenanceModal.tsx:118` |
| C-18 | Low | Efek blur modal maintenance tidak jalan | `backdrop-blur-xs` hanya ada di Tailwind v4 | `MaintenanceModal.tsx:59` |
| C-19 | Low | Opsi layout memakai emoji (melanggar AGENTS.md rule 12) | Teks `<option>` berisi emoji | baris 728-734 |
| C-20 | Low | Tombol ikon tanpa `aria-label`; tidak bisa dioperasikan keyboard | Hanya `title` | baris 739-786 |
| C-21 | Low | Kualitas kode | File 890 baris (> 500, Anti-Monster Rule); 2 warning `exhaustive-deps`; `cn()` lokal duplikat | seluruh file |

### 4.3 Parser DDL — `backend/app/services/sql_parser.py`

| ID | Severity | Gejala (user) | Akar masalah (developer) | Lokasi |
|----|----------|---------------|--------------------------|--------|
| P-01 | Critical | Tipe kolom salah: `showtime_id INT` jadi `time`, `settings JSON` jadi `set` | `DATA_TYPE_PATTERN.search(line)` mencari di seluruh baris termasuk nama kolom, tanpa `\b` | `_parse_column` |
| P-02 | High | `TIMESTAMP` jadi `time`, `DATETIME` jadi `date` | Urutan alternasi regex: `TIME` sebelum `TIMESTAMP`, `DATE` sebelum `DATETIME`, tanpa batas kata | `DATA_TYPE_PATTERN` |
| P-03 | High | Hasil `pg_dump`/MySQL Workbench tampil tanpa garis relasi | `ALTER TABLE ... ADD [CONSTRAINT x] FOREIGN KEY` tidak diproses | `parse` |
| P-04 | Medium | Dialek SQL Server ditawarkan, tapi `[dbo].[orders]` tidak terbaca; `CREATE TEMPORARY/UNLOGGED TABLE` juga tidak | Regex nama tabel tidak mengenal kurung siku dan modifier tabel | `create_pattern` |
| P-05 | Medium | `CONSTRAINT uq_x UNIQUE (...)` hilang | Semua baris berawalan `CONSTRAINT` (selain PK) masuk cabang FK lalu dibuang | `_parse_table_body` |
| P-06 | Low | Badge schema selalu `PUBLIC` (juga di MySQL/SQLite/SQL Server); `a.users` dan `b.users` bertabrakan | `schema="public"` hardcode; prefix schema dibuang | `_parse_table_body` |
| P-07 | Low | `DEFAULT '--'` atau `CHECK (x IN ('a)'))` merusak parsing | Penghapus komentar dan penghitung kurung tidak sadar string literal | `_remove_comments`, `parse` |
| P-08 | Low | Pilihan dialek tidak berpengaruh | Parameter `dialect` tidak dipakai | `parse` |

---

## 5. Desain Solusi (Ringkas)

**Layout halaman (D-01 s/d D-05):**
Pane kiri dibagi tiga baris tetap: tab (atas), area scroll (form + textarea `flex-1 min-h-[120px]`), footer tombol (`shrink-0`, di luar area scroll). Di `< lg`, halaman di-scroll biasa (`h-auto`) dan tiap pane punya tinggi minimum (editor sekitar 420px, kanvas sekitar 60vh). Tinggi halaman `lg` dihitung dari header 64px + padding `main` yang sebenarnya.

**Viewport kanvas (C-01 s/d C-08):**
- Kanvas `h-full` mengikuti parent; ukuran asli dibaca via `ResizeObserver`.
- Satu hook `useCanvasViewport` memegang `zoom` + `pan` dengan konversi `screenToWorld` / `worldToScreen` yang dipakai bersama oleh Fit, tombol zoom, wheel, pan, dan drag.
- Konstanta tunggal: `MIN_ZOOM = 0.2`, `MAX_ZOOM = 2`.
- `zoomAt(factor, pivot)`: pivot = tengah viewport (tombol) atau posisi kursor (Ctrl + wheel).
- Fit dipicu oleh: identitas data tabel berubah (pakai signature nama tabel, bukan panjang array), layout berubah, ukuran viewport berubah (debounce), dan klik tombol.
- Pointer Events (`onPointerDown/Move/Up` + `setPointerCapture`) untuk mouse dan touch.
- Ukuran kanvas dan SVG dihitung dari bounding box + margin; `overflow: visible`.

**Fullscreen (G4):**
Tombol baru di toolbar: kanvas dibungkus overlay `fixed inset-0 z-[100]`, latar `bg-background`. Esc atau tombol yang sama untuk keluar; `body` tidak bisa di-scroll selama fullscreen. Modal Mermaid (z-200) dan toast tetap di atas. Fit otomatis lewat `ResizeObserver`. Tidak pakai Fullscreen API browser agar portal modal/toast tidak hilang.

**Struktur file (C-21, target < 500 baris per file):**

```
frontend/src/components/diagram/
  DiagramCanvas.tsx        # komposisi + state (< 300 baris)
  DiagramToolbar.tsx       # tombol layout, zoom, fit, fullscreen, ekspor
  TableCard.tsx            # kartu tabel
  RelationLines.tsx        # SVG relasi
  useCanvasViewport.ts     # zoom/pan/fit/resize/pointer
frontend/src/lib/diagram/
  layouts.ts               # 7 algoritma layout, fungsi murni & deterministik
  geometry.ts              # bounding box, fit, anchor kolom, path relasi
  constants.ts             # ukuran kartu, batas zoom
frontend/scripts/
  test-diagram.mjs         # node --test untuk layouts.ts & geometry.ts
```

`lib/diagram/*` hanya memakai `import type`, jadi bisa dites langsung dengan Node 24 (type stripping) tanpa dependensi baru.

**Parser (P-01 s/d P-08):**
Pisahkan nama kolom dulu (mendukung `` ` ``, `"`, `[ ]`), lalu cocokkan tipe di **awal sisa baris** dengan regex ber-`\b`, alternatif terpanjang lebih dulu, dan fallback ke token pertama apa adanya (misal `NVARCHAR(50)`, `UNIQUEIDENTIFIER`). Tambah langkah kedua untuk `ALTER TABLE ... ADD [CONSTRAINT n] FOREIGN KEY`. Penghapus komentar dan penghitung kurung melewati string literal. Schema diisi dari prefix jika ada, default per dialek (`public` / `dbo` / `main` / kosong untuk MySQL). Setiap ID P-xx wajib punya regression test.

---

## 6. Fase Pengerjaan

Setiap fase = 1 batch kecil = 1 commit di branch `feat/diagram-fix` (dari `dev`). Fase berikutnya baru dimulai setelah QA fase sebelumnya lolos. **AI tidak melakukan `git push`**; push dilakukan manual oleh developer setelah [QA_CHECKLIST.md](./QA_CHECKLIST.md) lolos.

### Fase 0 — Persiapan (0.25 hari)

- [ ] Buat branch `feat/diagram-fix` dari `dev` (working tree bersih)
- [ ] Ambil screenshot baseline di 1366x768 dan 1920x1080 (sebelum perubahan)
- [ ] Catat baseline: `npm run lint`, `npm run type-check`, `pytest`

### Fase 1 — Layout halaman (0.5 hari) — D-01, D-02, D-03, D-04, D-05, D-11

- [ ] Tombol Rerender / Tarik Skema jadi footer di luar area scroll
- [ ] Textarea `flex-1` dengan `min-h` kecil
- [ ] Tinggi halaman `lg` sesuai header + padding; `< lg` scroll biasa
- [ ] Ganti class Tailwind yang tidak valid; perbaiki copy deskripsi
- [ ] QA: bagian A + B di QA_CHECKLIST

### Fase 2 — Parser DDL (0.5-1 hari) — P-01 s/d P-08

- [ ] Tulis regression test yang **gagal dulu** untuk tiap P-xx
- [ ] Perbaiki deteksi tipe, `ALTER TABLE` FK, identifier `[ ]`, modifier tabel, `CONSTRAINT UNIQUE`, schema, string literal
- [ ] Semua test lama tetap hijau; 10 template menghasilkan tipe yang sama dengan DDL
- [ ] QA: bagian F

### Fase 3 — Viewport + Fullscreen (1 hari) — C-01 s/d C-08, C-09

- [ ] Ekstrak `useCanvasViewport.ts` + `lib/diagram/geometry.ts`
- [ ] Kanvas `h-full`, `ResizeObserver`, Fit berbasis ukuran asli
- [ ] Fit dipicu oleh signature tabel, layout, resize
- [ ] Zoom berporos (tombol = tengah, Ctrl+wheel = kursor), batas zoom tunggal
- [ ] Drag/pan via Pointer Events, delta dibagi zoom
- [ ] Ukuran kanvas/SVG dinamis
- [ ] Tombol fullscreen + Esc + kunci scroll body
- [ ] QA: bagian C + D

### Fase 4 — Refactor & kebenaran layout (1 hari) — C-10 s/d C-16, C-21, D-06 s/d D-09

- [ ] Pecah `DiagramCanvas.tsx` sesuai struktur di bagian 5 (tanpa ubah perilaku dulu, lalu fix)
- [ ] `layouts.ts` deterministik (seed untuk Organik), key `schema.name`
- [ ] Perbaiki level BFS (longest-path di DAG, aman terhadap siklus & self-reference)
- [ ] Anchor garis dari geometri yang sama dengan render kartu; perbaiki arah panah
- [ ] Ekspor PNG ikut tema; guard bounding box kosong
- [ ] Mermaid: dedup per tabel+kolom; clipboard dengan `catch`
- [ ] Select template terkontrol, request race guard, konfirmasi timpa kode, draft di `sessionStorage`
- [ ] Unit test `scripts/test-diagram.mjs`
- [ ] QA: bagian E + G

### Fase 5 — Polish (0.5 hari) — D-10, D-12, C-17 s/d C-20

- [ ] Tipografi minimal 11px untuk UI, 12px untuk textarea kode
- [ ] Hapus emoji di opsi layout; `aria-label` di semua tombol ikon
- [ ] Badge maintenance tidak menutupi kontrol (geser/collapsible); ganti `backdrop-blur-xs`
- [ ] Petunjuk "Klik Rerender untuk menerapkan dialek" saat dialek berubah
- [ ] QA: seluruh QA_CHECKLIST (regresi penuh)

---

## 7. Risiko

| Risiko | Mitigasi |
|--------|----------|
| Refactor DiagramCanvas memicu regresi layout | Fase 4 dimulai dengan pemecahan file tanpa ubah perilaku + screenshot banding 10 template |
| Perubahan parser mengubah hasil generate dokumentasi AI (parser yang sama dipakai `/generate/from-ddl`) | Regression test + cek output 10 template sebelum/sesudah |
| `ResizeObserver` memicu Fit terus saat user sedang zoom manual | Auto-fit saat resize hanya jika user belum zoom/pan manual sejak Fit terakhir |
| Konflik dengan batch keamanan T-026 (batas ukuran input parser) | Kerjakan di file yang sama secara berurutan; koordinasi lewat TASKS.md |

## 8. Definition of Done

- Semua ID High/Critical berstatus ✅ di QA_CHECKLIST, tidak ada ❌ yang terbuka.
- `npm run lint` tanpa warning baru di file yang disentuh; `npm run type-check` dan `npm run build` lolos.
- `pytest` backend lolos, termasuk regression test P-01 s/d P-08.
- `node --test scripts/test-diagram.mjs` lolos.
- Tidak ada file diagram > 500 baris.
- `dev-docs/ai/TASKS.md`, `KNOWN_ISSUES.md`, commit log harian, dan task report `reports/task/frontend/` diperbarui.
- Developer menandatangani bagian "Gate Push" di QA_CHECKLIST, lalu push manual.
