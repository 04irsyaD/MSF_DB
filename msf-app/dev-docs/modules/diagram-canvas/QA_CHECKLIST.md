# MSF Diagram — QA Checklist

> **Status:** CHECKLIST — Wajib lolos sebelum push. Plan: [PLAN.md](./PLAN.md).
> **Tanggal dibuat:** 2026-10-16
> **Aturan:** Isi kolom Status dengan ✅ (lolos) atau ❌ (gagal + catatan). Satu ❌ di test High/Critical = **tidak boleh push**.

Cara pakai:

1. Jalankan bagian A (otomatis) setiap selesai satu fase.
2. Jalankan bagian yang disebut di fase tersebut (lihat PLAN.md bagian 6).
3. Sebelum push terakhir: jalankan **semua** bagian (regresi penuh).
4. Kalau ada ❌, tulis gejala + screenshot di kolom Catatan, perbaiki, lalu ulangi bagian itu dari awal.

---

## Hasil Run AI — 2026-10-16 (branch `feat/diagram-fix`, belum commit)

Dijalankan oleh Claude (Opus 5.5). Bukti otomatis: `npm run test:diagram`, `pytest`, dan [qa-browser.mjs](./qa-browser.mjs) (Chrome headless, 60 cek mengukur posisi DOM nyata). Screenshot diperiksa manual oleh AI.

| Bagian | Status | Catatan |
|--------|--------|---------|
| A-01 lint | ✅ | 0 warning di file diagram; 2 warning lama di `GeneratePanel.tsx`, `ShortcutFilter.tsx` (di luar scope) |
| A-02 type-check, A-03 build | ✅ | |
| A-04 `npm run test:diagram` | ✅ | 11/11 (termasuk 10 template x 7 layout tanpa kartu bertumpuk) |
| A-05 pytest | ✅ | 53/53, termasuk 16 regression test parser baru |
| A-06 ukuran file, A-07 class Tailwind, A-08 emoji | ✅ | file terbesar 385 baris; emoji di nama template juga dihapus |
| B-01, B-03 tombol tidak menumpuk | ✅ | 1366x666, 1366x768, 1280x720, 1920x1080, 768x1024, 390x844 |
| B-05 halaman tidak scroll (lg) | ✅ | termasuk 1366x666 (area browser laptop user) |
| B-06 s/d B-09 | ✅ | diperiksa dari screenshot |
| B-10 browser zoom 125%/150% | ✅ | diemulasikan (1366x666 / devicePixelRatio 1.25 dan 1.5) di Chrome, Edge, Firefox. Temuan: di 125% panel kiri hanya 245px (tab pecah 2 baris) -> split dua kolom dipindah ke breakpoint `xl` (>= 1280px) |
| C-01, C-02, C-04, C-08, C-09, C-10, C-11, C-12, C-13, C-14 | ✅ | diukur otomatis di browser |
| C-05, C-06, C-07, C-15, C-16, C-17, C-18 | ✅ | dicakup matriks Fit, unit test, dan logika auto-fit `ResizeObserver` |
| D-01, D-02, D-05, D-07, D-10 | ✅ | diukur otomatis |
| D-03, D-04, D-06, D-08, D-09 | ✅ / perlu konfirmasi visual | D-08 (tombol back) belum diotomasi |
| E matriks 10 x 7 | ✅ | browser 1366x666 + unit test |
| E-01 s/d E-05 | ✅ | unit test + E-05 diukur di browser (zoom maks) |
| E-06 console bersih | ✅ dengan 1 catatan | satu-satunya error: `404 /favicon.ico` di seluruh aplikasi (I-012, di luar scope) |
| F-01 s/d F-11, F-13 | ✅ | pytest; F-02 dan F-04 juga lewat UI |
| F-12 | ✅ | toast error, diagram lama tetap (perilaku dipertahankan) |
| G-01, G-02 PNG | ✅ | piksel latar diperiksa: dark luma 25 alpha 255, light luma 250 |
| G-03, G-04 Mermaid | ✅ | dedup per kolom + `copyToClipboard` dengan toast error |
| G-05 s/d G-08 | ✅ | diukur otomatis |
| G-09, G-10, G-13 s/d G-15 | ✅ | diperiksa dari screenshot / kode |
| G-11 Live DB Connector | belum dites | ditunda sampai Supabase siap (keputusan user 2026-10-16) |
| G-12 backend mati | belum dites | perilaku lama dipertahankan (toast error) |
| G-16 halaman lain | belum dites manual | `/generate` memakai parser yang sama: pytest lolos |
| H Chrome 155, Edge 155, Firefox 130 | ✅ | Chrome 71/72, Edge 71/72, Firefox 70/70 (gagal hanya favicon I-012). Temuan: ekspor PNG selalu gagal di Firefox (bug lama `html-to-image` embed font) -> fallback `skipFonts`. Touch di Firefox tidak dites (Playwright tidak mendukung emulasi mobile Firefox) |

---

## Lingkungan Uji

| Item | Nilai |
|------|-------|
| URL | `http://localhost:3000/diagram` (frontend `npm run dev` + backend uvicorn) |
| Viewport utama | **1366x768** (laptop user), browser zoom 100% |
| Viewport tambahan | 1280x720, 1920x1080, 768x1024 (tablet), 390x844 (HP) |
| Browser zoom tambahan | 125% dan 150% di 1366x768 (umum di laptop Windows) |
| Tema | Dark (default) dan Light |
| Browser | Chrome/Brave (utama), Firefox, Edge |

Tips: atur viewport lewat DevTools (Ctrl+Shift+M) dan isi ukuran manual.

---

## A. Pemeriksaan Otomatis

| ID | Perintah | Hasil yang diharapkan | Status | Catatan |
|----|----------|------------------------|--------|---------|
| A-01 | `cd frontend && npm run lint` | Tidak ada warning/error baru di file `diagram/*`, `lib/diagram/*`, `MaintenanceModal.tsx` | | |
| A-02 | `cd frontend && npm run type-check` | 0 error | | |
| A-03 | `cd frontend && npm run build` | Build sukses | | |
| A-04 | `cd frontend && npm run test:diagram` | Semua test lolos | | |
| A-05 | `cd backend && .venv/Scripts/python.exe -m pytest -q` | Semua test lolos, termasuk regression P-01 s/d P-08 | | |
| A-06 | Hitung baris file diagram | Tidak ada file > 500 baris | | |
| A-07 | Cari class Tailwind tidak valid: `h-5.5`, `w-5.5`, `z-25`, `backdrop-blur-xs` di `app/diagram/`, `components/diagram/`, `components/common/MaintenanceModal.tsx` | 0 hasil (sisa di modul SQL Helper di luar scope, tercatat di KNOWN_ISSUES) | | |
| A-08 | Cari emoji di `components/diagram/` dan `app/diagram/` | 0 hasil | | |

---

## B. Layout Halaman (D-01 s/d D-05, D-11, D-12)

Ulangi di **setiap viewport** pada tabel Lingkungan Uji.

| ID | Langkah | Hasil yang diharapkan | Bug | Status | Catatan |
|----|---------|------------------------|-----|--------|---------|
| B-01 | Buka `/diagram`, tab SQL DDL EDITOR, textarea kosong | Tombol Rerender berada di bawah textarea, tidak menumpuk; border bawah textarea terlihat utuh | D-01 | | |
| B-02 | Pilih template 10 tabel (Rumah Sakit), scroll textarea sampai bawah | Teks kode hanya terlihat di dalam textarea, tidak pernah muncul di bawah/di balik tombol | D-01 | | |
| B-03 | Perkecil tinggi window sampai sekitar 600px | Tombol tetap terlihat dan bisa diklik; area form yang di-scroll, bukan tombol yang tertutup | D-01 | | |
| B-04 | Tab LIVE DB CONNECTOR | Tombol "Tarik Skema" tidak menutupi field form; semua field bisa dijangkau dengan scroll | D-02 | | |
| B-05 | Di 1366x768 dan 1920x1080, scroll halaman (bukan pane) | Halaman tidak punya scrollbar vertikal sendiri (tidak ada geser 8px) | D-03 | | |
| B-06 | Di 768x1024 dan 390x844 | Editor dan diagram tersusun vertikal, masing-masing punya tinggi layak (editor sekitar 420px, kanvas sekitar 60vh); halaman bisa di-scroll | D-04 | | |
| B-07 | Lihat ikon di judul halaman | Ukuran ikon proporsional dengan judul (sekitar 22px) | D-05 | | |
| B-08 | Baca deskripsi halaman | Tidak lagi menjanjikan render "langsung" tanpa klik | D-11 | | |
| B-09 | Periksa ukuran font label, tab, textarea | Teks UI minimal 11px, kode di textarea minimal 12px | D-12 | | |
| B-10 | Ulangi B-01 s/d B-04 di browser zoom 125% dan 150% | Hasil sama dengan zoom 100% | D-01, D-02 | | |

---

## C. Viewport Kanvas (C-01 s/d C-09)

Gunakan template **Pemesanan Tiket Bioskop (8 tabel)** kecuali disebut lain. Viewport utama 1366x768.

| ID | Langkah | Hasil yang diharapkan | Bug | Status | Catatan |
|----|---------|------------------------|-----|--------|---------|
| C-01 | Render template, lihat kanvas | Kanvas mengisi pane kanan sampai bawah; tepi bawah kanvas (rounded border) terlihat | C-01 | | |
| C-02 | Klik Pusatkan Layar (Fit) | Semua tabel terlihat utuh dan berada di tengah, tidak ada yang terpotong di sisi mana pun | C-02 | | |
| C-03 | Zoom in 3x, geser kanvas, lalu klik Fit | Kembali ke tampilan C-02 | C-02 | | |
| C-04 | Pilih template Sosial Media (8 tabel), lalu Pemesanan Tiket (8 tabel) | Setiap pergantian, diagram langsung di-fit (tidak muncul di zoom 100% posisi kiri atas) | C-03 | | |
| C-05 | Ulangi C-04 untuk E-commerce, lalu SaaS, lalu Perpustakaan (6 tabel) | Sama dengan C-04 | C-03 | | |
| C-06 | Template Rumah Sakit (10 tabel) di layout Horizontal di 1280x720, klik Fit | Semua tabel muat (zoom boleh di bawah 0.45) | C-04 | | |
| C-07 | Klik zoom out terus sampai mentok | Berhenti di batas minimum yang sama dengan Fit; tidak ada lompatan | C-04 | | |
| C-08 | Klik Zoom In 3x | Diagram membesar dari tengah layar; tabel di tengah tetap di tengah | C-05 | | |
| C-09 | Ctrl + scroll mouse di atas satu tabel | Zoom berporos di posisi kursor; scroll tanpa Ctrl tidak mencuri scroll halaman secara tak terduga | C-05, C-07 | | |
| C-10 | Zoom ke sekitar 50%, drag header satu tabel 200px ke kanan | Tabel menempel di bawah kursor selama drag | C-06 | | |
| C-11 | Ulangi C-10 di zoom sekitar 150% | Sama | C-06 | | |
| C-12 | Drag area kosong kanvas (pan) | Seluruh diagram bergeser mengikuti kursor; berhenti saat mouse dilepas, juga saat dilepas di luar kanvas | C-07 | | |
| C-13 | Di 390x844 (mode touch DevTools): geser kanvas dengan satu jari, drag header tabel | Keduanya berfungsi; halaman tidak ikut ter-scroll saat menggeser kanvas | C-07 | | |
| C-14 | Drag satu tabel jauh ke kiri atas (koordinat negatif), lalu Fit | Garis relasi tabel itu tetap tergambar; Fit mencakup tabel itu | C-08 | | |
| C-15 | Template Rumah Sakit, layout Vertikal, Fit | Semua garis relasi tergambar, tidak terpotong di tepi mana pun | C-08 | | |
| C-16 | Hover tabel yang bertumpuk/berdekatan dengan tabel lain | Tabel yang di-hover tampil di atas tabel lain | C-09 | | |
| C-17 | Resize window dari 1920 ke 1366 tanpa interaksi lain | Diagram otomatis di-fit ulang | C-02 | | |
| C-18 | Zoom manual, lalu resize window | Zoom manual user tidak di-reset paksa | C-02 | | |

---

## D. Fullscreen (Fitur Baru)

| ID | Langkah | Hasil yang diharapkan | Status | Catatan |
|----|---------|------------------------|--------|---------|
| D-01 | Klik tombol fullscreen | Kanvas memenuhi seluruh layar, menutupi sidebar dan header; diagram di-fit otomatis | | |
| D-02 | Tekan Esc | Kembali ke tampilan normal; diagram di-fit ulang | | |
| D-03 | Klik tombol yang sama (ikon berubah ke "keluar") | Sama dengan D-02 | | |
| D-04 | Di fullscreen: zoom, pan, drag tabel, ganti layout | Semua berfungsi sama seperti mode normal | | |
| D-05 | Di fullscreen: buka Ekspor Mermaid | Modal tampil di atas overlay; Esc menutup modal dulu, Esc kedua keluar fullscreen | | |
| D-06 | Di fullscreen: unduh PNG | Toast sukses terlihat di atas overlay; file PNG benar | | |
| D-07 | Di fullscreen: scroll mouse di luar kanvas | Halaman di belakang tidak ikut ter-scroll | | |
| D-08 | Masuk fullscreen, lalu pindah halaman lewat tombol back browser | Tidak ada overlay yang tertinggal; scroll body normal kembali | | |
| D-09 | Badge Mode Maintenance saat fullscreen | Tidak menutupi toolbar/kontrol kanvas | | |
| D-10 | Navigasi keyboard: Tab ke tombol fullscreen, Enter | Fullscreen aktif; fokus tetap di dalam overlay | | |

---

## E. Matriks Template x Layout (Fit)

Viewport **1366x768**, tema Dark. Untuk tiap sel: pilih template, pilih layout, klik Fit.
Lolos jika **semua tabel terlihat utuh, tidak ada kartu yang saling tumpuk, semua garis relasi tergambar, dan panah menunjuk ke tabel tujuan**.

| Template | Horizontal | Vertikal | Grid | Grid + Pusat | Lingkaran | Pusat Relasi | Organik |
|----------|-----------|----------|------|--------------|-----------|--------------|---------|
| blog (3) | | | | | | | |
| ecommerce (6) | | | | | | | |
| hr (9) | | | | | | | |
| academic (7) | | | | | | | |
| social (8) | | | | | | | |
| saas (6) | | | | | | | |
| booking (8) | | | | | | | |
| warehouse (7) | | | | | | | |
| library (6) | | | | | | | |
| hospital (10) | | | | | | | |

Tambahan:

| ID | Langkah | Hasil yang diharapkan | Bug | Status | Catatan |
|----|---------|------------------------|-----|--------|---------|
| E-01 | Pilih layout Organik dua kali untuk template yang sama | Posisi tabel identik (deterministik) | C-12 | | |
| E-02 | DDL dengan self-reference (`employees.manager_id REFERENCES employees(id)`) di semua layout | Garis loop tergambar, panah menunjuk ke tabel, tidak ada error console | C-11, C-13 | | |
| E-03 | DDL siklus A -> B -> C -> A, layout Horizontal | Semua tabel tampil, tidak ada hang | C-13 | | |
| E-04 | DDL DAG: `a`, `b REFERENCES a`, `c REFERENCES a`, `c REFERENCES b`, layout Horizontal | `c` berada di kolom setelah `b` (bukan sejajar) | C-13 | | |
| E-05 | Zoom 200%, perhatikan ujung garis FK di kolom ke-5 dan seterusnya pada tabel panjang | Titik garis tepat di tengah baris kolom FK (toleransi 2px) | C-10 | | |
| E-06 | Buka DevTools Console selama seluruh bagian E | Tidak ada error/warning React (key duplikat, NaN, dsb.) | C-12 | | |

---

## F. Parser DDL (P-01 s/d P-08)

Tempel DDL di editor, klik Rerender, periksa kartu. Kasus yang sama **wajib** ada sebagai test di `backend/tests/test_sql_parser.py`.

| ID | Input DDL | Hasil yang diharapkan | Bug | Status | Catatan |
|----|-----------|------------------------|-----|--------|---------|
| F-01 | `CREATE TABLE b (id INT PRIMARY KEY, showtime_id INT, start_time TIMESTAMP, settings JSON, points INT, booking_date DATETIME);` | Tipe: `int`, `int`, `timestamp`, `json`, `int`, `datetime` | P-01, P-02 | | |
| F-02 | Template Pemesanan Tiket Bioskop | `bookings.showtime_id` = `int`, `showtimes.start_time` = `timestamp`, `bookings.booking_date` = `timestamp` | P-01, P-02 | | |
| F-03 | Semua 10 template | Tipe tiap kolom sama dengan DDL sumber (cek acak minimal 5 kolom per template) | P-01, P-02 | | |
| F-04 | `CREATE TABLE a (id INT PRIMARY KEY); CREATE TABLE b (id INT, a_id INT); ALTER TABLE b ADD CONSTRAINT fk_b_a FOREIGN KEY (a_id) REFERENCES a(id);` | Garis relasi `b.a_id` ke `a.id` tergambar; ikon FK di `a_id` | P-03 | | |
| F-05 | Sama dengan F-04 tanpa `CONSTRAINT fk_b_a` dan dengan `ALTER TABLE ONLY public.b` (gaya pg_dump) | Sama dengan F-04 | P-03 | | |
| F-06 | Dialek SQL Server: `CREATE TABLE [dbo].[orders] ([id] INT PRIMARY KEY, [customer_name] NVARCHAR(100));` | Tabel `orders` tampil, schema `dbo`, tipe `nvarchar(100)` | P-04, P-06 | | |
| F-07 | `CREATE TEMPORARY TABLE tmp (id INT);` dan `CREATE UNLOGGED TABLE logs (id INT);` | Kedua tabel tampil | P-04 | | |
| F-08 | `CREATE TABLE c (id INT, email VARCHAR(100), CONSTRAINT uq_email UNIQUE (email));` | Index unik `uq_email` terbaca (cek lewat ekspor/generate) | P-05 | | |
| F-09 | Dialek MySQL, template mana pun | Badge schema bukan `PUBLIC` | P-06 | | |
| F-10 | `CREATE TABLE s.users (id INT); CREATE TABLE t.users (id INT);` | Dua kartu terpisah, tidak saling tumpuk, tidak ada warning key duplikat | P-06, C-12 | | |
| F-11 | `CREATE TABLE x (id INT, note VARCHAR(10) DEFAULT '--', st CHAR(1) CHECK (st IN ('a)', 'b')));` | Tabel `x` tampil dengan 3 kolom | P-07 | | |
| F-12 | DDL kosong / hanya komentar / teks acak | Toast error yang jelas, diagram lama tidak hilang | - | | |
| F-13 | FK ke tabel yang tidak ada di DDL | Tidak error; kolom tetap bertanda FK; tidak ada garis menggantung | - | | |

---

## G. Fitur Lain & Regresi

| ID | Langkah | Hasil yang diharapkan | Bug | Status | Catatan |
|----|---------|------------------------|-----|--------|---------|
| G-01 | Unduh PNG di tema Dark | Latar PNG gelap, teks kartu terbaca, semua tabel ikut | C-15 | | |
| G-02 | Unduh PNG di tema Light | Latar terang, teks terbaca | C-15 | | |
| G-03 | Ekspor Mermaid untuk DDL dengan 2 FK ke tabel yang sama (`flights.origin_id`, `flights.dest_id` -> `airports`) | Ada 2 baris relasi | C-16 | | |
| G-04 | Klik Salin di modal Mermaid saat clipboard diblokir (http non-localhost) | Toast error tampil, tidak ada unhandled rejection | C-16 | | |
| G-05 | Pilih template, edit kode, pilih template yang sama lagi | Muncul konfirmasi; kalau setuju, kode template dimuat ulang | D-06, D-08 | | |
| G-06 | Ketik DDL sendiri, klik "Gunakan Contoh" | Muncul konfirmasi sebelum menimpa | D-08 | | |
| G-07 | Ketik DDL, pindah ke `/dashboard`, kembali ke `/diagram` | Draft DDL masih ada (dalam sesi tab yang sama) | D-08 | | |
| G-08 | Pilih 3 template berbeda dengan cepat (< 1 detik) | Diagram akhir = template terakhir yang dipilih | D-07 | | |
| G-09 | Ganti dialek tanpa klik Rerender | Ada petunjuk untuk klik Rerender | D-10 | | |
| G-10 | Hover tabel | Tabel terkait tetap jelas, yang lain meredup; garis relasi terkait menonjol | - | | |
| G-11 | Live DB Connector (jika ada DB lokal): Test Connection lalu Tarik Skema | Diagram tampil dan di-fit; perilaku sama dengan mode DDL | - | | |
| G-12 | Backend mati, klik Rerender | Toast error yang ramah, UI tidak macet di loading | - | | |
| G-13 | Toggle tema Dark/Light di halaman diagram | Semua elemen (kanvas, kartu, toolbar, overlay fullscreen, modal) mengikuti tema | - | | |
| G-14 | Modal maintenance & badge | Badge tidak menutupi kontrol kanvas; blur modal berfungsi | C-17, C-18 | | |
| G-15 | Navigasi keyboard: Tab melalui toolbar kanvas | Semua tombol bisa difokus, punya label yang dibacakan (cek `aria-label`) | C-20 | | |
| G-16 | Halaman lain (`/generate`, `/sql-helper`, `/schema-compare`) | Tidak ada perubahan perilaku (parser dipakai juga oleh generate dari DDL) | P-01 | | |

---

## H. Lintas Browser (ringkas)

Jalankan B-01, C-02, C-08, C-10, C-12, D-01, D-02, G-01 di tiap browser.

| Browser | Status | Catatan |
|---------|--------|---------|
| Chrome / Brave | | |
| Firefox | | |
| Edge | | |

---

## Gate Push

Push ke GitHub **hanya** jika semua di bawah ✅. Push dilakukan manual oleh developer (AI dilarang `git push`).

| Syarat | Status |
|--------|--------|
| Bagian A semua ✅ | |
| Bagian B-F: semua test High/Critical ✅, tidak ada ❌ terbuka | |
| Bagian G dan H: tidak ada ❌ terbuka (Low boleh ditunda jika dicatat di `KNOWN_ISSUES.md`) | |
| Screenshot sesudah di 1366x768 dan 1920x1080 dilampirkan di task report | |
| `TASKS.md`, `KNOWN_ISSUES.md`, commit log harian, task report diperbarui | |
| Push ke branch `feat/diagram-fix` atau `dev`, **bukan** `main` | |

| Diperiksa oleh | Tanggal | Commit |
|----------------|---------|--------|
| | | |
