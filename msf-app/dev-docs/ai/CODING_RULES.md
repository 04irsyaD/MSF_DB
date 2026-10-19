# CODING_RULES — MSF-DB

> **Status:** OUTPUT FILE — Dibuat dari `ai-rules/dev-docs-ai-templates/CODING_RULES-template.md`.
> **Purpose:** Aturan coding spesifik project yang WAJIB diikuti semua AI agent (Claude, Antigravity, Copilot, dll).
> **Dibuat:** 2026-10-16 (dari analisis bug modul Diagram, lihat `dev-docs/modules/diagram-canvas/PLAN.md`).
> **Prioritas:** Jika bertentangan dengan `ai-rules/AGENTS.md`, yang berlaku `ai-rules/AGENTS.md`.

Project type: **Fullstack** — `backend/` (FastAPI, Python) + `frontend/` (Next.js 14 App Router, TypeScript, Tailwind CSS 3.4).

---

## 0) Aturan Umum (Berlaku untuk Semua Task)

1. **Baca dulu, baru ubah.** Sebelum mengubah file, baca file itu dan pemanggilnya. Jangan menebak struktur dari nama file.
2. **Buktikan bug sebelum memperbaiki.** Reproduksi bug (jalankan kode, test, atau langkah UI) dan catat buktinya. Untuk bug logika, tulis test yang gagal dulu.
3. **Batch kecil.** Satu fase/batch = satu tujuan = satu commit. Jangan campur fix bug + refactor + fitur baru di satu commit.
4. **Dilarang `git push`.** AI hanya commit (jika diminta). Push dilakukan manual oleh developer setelah QA lolos.
5. **Gate QA wajib.** Perubahan UI tidak dianggap selesai sebelum checklist QA modul terkait diisi (contoh: `dev-docs/modules/diagram-canvas/QA_CHECKLIST.md`). Jangan menandai ✅ untuk test yang tidak benar-benar dijalankan; tulis "belum dites" jika memang belum.
6. **Laporkan apa adanya.** Jika test gagal atau langkah dilewati, tulis di output akhir beserta alasannya.
7. **Tanpa emoji** di kode, teks UI, dan komentar (AGENTS.md rule 12). Di dokumentasi hanya ✅ dan ❌.
8. **Ukuran file** maksimal 500 baris per file kode (Anti-Monster Rule), target < 300. Jika menyentuh file yang sudah melanggar, usulkan rencana pemecahan di task report.

---

## Part A — Backend Rules

### 1) Module and Route Conventions

- Router di `backend/app/routers/*.py` tipis: validasi request (Pydantic di `app/models/schemas.py`), panggil service, petakan error ke `HTTPException`.
- Logika di `backend/app/services/*.py`. Contoh: parsing DDL di `services/sql_parser.py` (`SQLParser.parse`), dipakai oleh `/generate/parse-ddl` dan `/generate/from-ddl`.
- Mengubah service yang dipakai lebih dari satu endpoint = cek dan uji semua endpoint pemakainya.

### 2) Authorization Conventions

- Ikuti `dev-docs/ai/SECURITY_REMEDIATION_PLAN.md` (batch T-021 s/d T-033). Jangan menulis ulang mekanisme auth/admin di luar batch tersebut.

### 3) Data and Parsing Conventions

Aturan untuk parser berbasis regex (pelajaran dari bug P-01 s/d P-08):

- **Pisahkan token sebelum mencocokkan.** Ambil nama identifier dulu, baru cocokkan tipe/keyword pada sisa string. Jangan `re.search` ke seluruh baris yang berisi nama buatan user.
- **Selalu pakai batas kata** (`\b`) untuk keyword SQL.
- **Alternatif terpanjang lebih dulu** di regex alternasi (`TIMESTAMP` sebelum `TIME`, `DATETIME` sebelum `DATE`, `INTEGER` sebelum `INT`).
- **Sadar string literal.** Penghapus komentar dan penghitung kurung wajib melewati isi `'...'`.
- **Dukung semua dialek yang ditawarkan UI.** Jika dropdown menawarkan SQL Server, parser wajib mengenali `[schema].[table]`; jika belum, hapus opsinya atau tampilkan peringatan.
- **Tipe tak dikenal dikembalikan apa adanya** (token asli), bukan default `TEXT`.
- Jangan log SQL/connection string mentah (lihat T-024).

### 4) Import Conventions

- Input DDL dari user dianggap tidak tepercaya: batasi ukuran (lihat T-026) dan jangan pernah dieksekusi.

---

## Part B — Frontend Rules

### 5) UI Conventions

**Struktur:**

- Halaman di `frontend/src/app/{route}/page.tsx` (`"use client"`), komponen per fitur di `src/components/{fitur}/`, fitur besar di `src/features/{fitur}/`.
- **Logika murni** (layout, geometri, transformasi data) di `src/lib/{fitur}/*.ts`, tanpa React, tanpa DOM, deterministik (tanpa `Math.random()` kecuali di-seed). Hanya `import type` ke modul lain agar bisa dites dengan `node --test`.
- Panggilan API lewat `src/lib/api.ts`; pesan error lewat `getFriendlyErrorMessage`; notifikasi lewat `toast` (sonner).
- Utility class: pakai satu `cn()` bersama, jangan buat ulang per file.

**Tailwind 3.4 — hanya class yang ada:**

- Project memakai Tailwind **3.4**, bukan v4. Dilarang class khusus v4 atau nilai di luar skala default, kecuali di-extend di `tailwind.config.ts`.
- Contoh yang pernah salah: `h-5.5`/`w-5.5` (pakai `h-[22px]`), `z-25` (pakai `z-[25]`), `backdrop-blur-xs` (pakai `backdrop-blur-sm` atau `backdrop-blur-[2px]`).
- Ragu? Cek `tailwind.config.ts` dan dokumentasi v3. Class yang tidak ada **gagal diam-diam** (tidak ada error build).

**Layout & tinggi elemen (pelajaran dari bug D-01, C-01):**

- **Dilarang tinggi tetap** (`h-[600px]`, `h-[500px]`) untuk elemen di dalam pane yang tingginya mengikuti layar. Pakai `flex-1 min-h-0` / `h-full` dari parent.
- **Dilarang `h-full` + anak dengan `min-h-*` besar di dalam scroll container.** Anak akan meluber dan elemen berikutnya menumpuk.
- **Tombol aksi utama pane = footer tetap** (`shrink-0`) di luar area scroll. Area scroll hanya berisi form.
- Rumus `calc(100vh - X)` wajib sesuai tinggi header + padding nyata (header 64px, `main` padding `p-4 sm:p-6 lg:p-8`). Lebih baik pakai layout flex dari `AppLayout` daripada angka ajaib.
- Di bawah breakpoint split, jangan jejalkan beberapa pane ke satu tinggi layar; biarkan halaman scroll dan beri tiap pane `min-h` yang layak.
- Sidebar tampil mulai `lg` dan memakan 256px. Layout split dua kolom di halaman kerja dimulai dari `xl` (>= 1280px), bukan `lg`, agar panel sempit tidak di bawah sekitar 300px (penting untuk laptop dengan browser zoom 125%).
- Uji layout juga pada browser zoom 125% dan 150% (emulasi: viewport dibagi zoom + `deviceScaleFactor`).
- Ukuran yang dipakai untuk perhitungan (Fit, ekspor, posisi) harus **diukur** (`ResizeObserver`, `getBoundingClientRect`), bukan diasumsikan dari konstanta.

**Kanvas / viewport interaktif (pelajaran dari bug C-02 s/d C-08):**

- Satu sumber kebenaran untuk `zoom` + `pan` (hook), dengan konversi `screenToWorld` / `worldToScreen` yang dipakai semua interaksi.
- Zoom selalu **berporos** (tengah viewport untuk tombol, posisi kursor untuk wheel). Satu konstanta `MIN_ZOOM`/`MAX_ZOOM` untuk semua jalur zoom.
- Delta drag dalam koordinat dunia = delta layar / `zoom`.
- Pakai **Pointer Events** + `setPointerCapture`, bukan hanya mouse events, agar touch berfungsi.
- Auto-fit dipicu oleh perubahan **identitas data** (signature), bukan `array.length`.
- Konten yang bisa keluar batas (garis SVG) tidak boleh dipotong kontainer berukuran tetap; ukuran dihitung dari bounding box.
- Konstanta geometri yang dipakai untuk menggambar garis harus sama dengan yang dipakai untuk merender kartu (satu file `constants.ts`).

**Lapisan z-index (urutan tetap):**

| Lapisan | Nilai |
|---------|-------|
| Konten kanvas | `z-0` s/d `z-10` (hover `z-[25]`) |
| Kontrol mengambang dalam komponen | `z-20` |
| Header sticky | `z-20` |
| Badge/notifikasi mengambang | `z-40` |
| Modal halaman (MaintenanceModal) | `z-50` |
| Overlay fullscreen | `z-[100]` |
| Modal portal (Mermaid, drawer) | `z-[200]` |
| Toast (sonner) | default library (paling atas) |

Elemen `fixed` baru wajib mengambil nilai dari tabel ini dan dicek tidak menutupi kontrol lain.

**Tipografi, tema, a11y:**

- Teks UI minimal **11px**, input/teks kode minimal **12px**. Hindari `text-[9px]`/`text-[10px]` untuk teks yang perlu dibaca.
- Default tema **dark**. Setiap warna baru wajib punya varian `dark:` atau memakai token CSS (`bg-background`, `text-foreground`, `border-border`). Ekspor gambar wajib mengikuti tema aktif.
- Tombol ikon wajib `aria-label` (bukan hanya `title`) dan bisa difokus keyboard. Overlay/modal: Esc menutup, scroll `body` dikunci, dan dikembalikan saat unmount.

**State & async:**

- Request yang bisa dipicu berulang (ganti template, filter) wajib dijaga dari race: `AbortController` atau request id; hanya respons terakhir yang dipakai.
- `<select>`/input yang mencerminkan state wajib **terkontrol** (`value`), bukan `defaultValue`.
- Aksi yang menimpa input user (template, contoh) wajib konfirmasi jika input sudah diubah.
- Tidak boleh menambah warning `react-hooks/exhaustive-deps` baru. Jika menyentuh effect yang sudah melanggar, perbaiki.
- Clipboard, `localStorage`, `sessionStorage`: selalu dibungkus `try/catch` / `.catch()` dengan toast error.
- Ekspor gambar dengan `html-to-image`: embed font gagal di Firefox, wajib fallback `skipFonts: true`; warna latar harus solid (komposit latar transparan dari elemen induk).
- Fitur yang menyentuh browser API (ekspor, clipboard, pointer, fullscreen) wajib dites di Chrome, Edge, dan Firefox.

### 6) Testing Conventions

| Layer | Tool | Perintah |
|-------|------|----------|
| Backend unit | pytest | `cd backend && .venv/Scripts/python.exe -m pytest -q` (atau `docker-compose exec -T backend pytest -v`) |
| Frontend logika murni | `node --test` (Node 24, type stripping) | `cd frontend && npm run test:diagram` / `npm run test:sql-helper` |
| UI diagram (opsional, di luar dependensi) | playwright-core + Chrome | lihat header `dev-docs/modules/diagram-canvas/qa-browser.mjs` |
| Lint | ESLint (next lint) | `cd frontend && npm run lint` |
| Type check | TypeScript | `cd frontend && npm run type-check` |
| Build | Next.js | `cd frontend && npm run build` |
| UI | Manual, checklist per modul | `dev-docs/modules/{modul}/QA_CHECKLIST.md` |

- Test backend di `backend/tests/test_{modul}.py`, nama `test_{deskripsi}`. Setiap bug parser yang diperbaiki **wajib** punya regression test dengan input minimal yang mereproduksinya.
- Test frontend di `frontend/scripts/test-{modul}.mjs` (pola sama dengan `test-sql-helper.mjs`). Belum ada Vitest/Playwright; menambah dependensi test perlu persetujuan user.
- QA UI wajib dijalankan minimal di **1366x768** (laptop user) dan **1920x1080**, plus browser zoom 125%, dalam tema dark dan light.

### 7) Documentation Conventions

- Rencana per modul: `dev-docs/modules/{modul}/PLAN.md` (+ `QA_CHECKLIST.md` untuk perubahan UI).
- Task baru/selesai: `dev-docs/ai/TASKS.md`. Bug open: `dev-docs/ai/KNOWN_ISSUES.md`.
- Laporan task: `reports/task/{backend|frontend}/YYYY-MM-DD-{task}.md` (template `ai-rules/TASK_REPORT_TEMPLATE.md`), sertakan hasil QA dan screenshot sebelum/sesudah untuk perubahan UI.
- Commit log harian: `dev-docs/commit-logs/YYYY-MM-DD.md`.
- Handoff sesi: `SESSION_NOTES.md` di root `msf-app/`.

---

## Checklist Sebelum Menyatakan Task Selesai

- [ ] Bug direproduksi dan buktinya dicatat
- [ ] Regression test ditambahkan (jika logika)
- [ ] `lint`, `type-check`, `build`, `pytest`, `node --test` lolos
- [ ] QA checklist modul diisi jujur (✅/❌/belum dites)
- [ ] Tidak ada class Tailwind tidak valid, emoji, atau tinggi hardcode baru
- [ ] Dokumentasi (TASKS, KNOWN_ISSUES, commit log, task report) diperbarui
- [ ] Tidak ada `git push` oleh AI
