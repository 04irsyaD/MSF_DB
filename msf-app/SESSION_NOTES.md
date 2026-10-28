# Session Notes — MSF DB

Catatan handoff antar sesi. Baca ini dulu sebelum lanjut kerja.
Terakhir diperbarui: 2026-10-27.

---

## 0000d. Audit keamanan dependensi + header (2026-10-28) — belum di-commit

- Backend (`pip-audit`): venv lokal punya pillow 12.3.0 (38 CVE), pypdf 6.19.0 (11), certifi lama — semuanya turunan
  xhtml2pdf/httpx yang tidak dipin. `requirements.txt` diberi batas minimum `pillow>=13.0.0`, `pypdf>=6.21.2`,
  `certifi>=2026.10.19` (juga memaksa layer pip Docker di Render di-build ulang). Setelahnya pip-audit
  requirements.txt + requirements-dev.txt + venv: 0 vuln. pytest 126 passed.
- Frontend: `npm audit fix` (tanpa --force) -> zod 4.6.7, postcss-selector-parser 6.1.5 (hanya package-lock).
- `frontend/next.config.js`: header keamanan semua halaman (X-Frame-Options DENY, CSP `frame-ancestors 'none'`,
  nosniff, Referrer-Policy, Permissions-Policy) + `poweredByHeader: false`. CSP penuh belum (perlu uji Monaco/CDN).
- [x] Upgrade (disetujui user) Next 14.2.18 -> **15.5.28** (pin persis), React 18 -> **19**, `@types/react(-dom)` 19,
  `eslint-config-next` 15.5.28, `"overrides": {"postcss": "$postcss"}` (postcss bawaan Next yang rentan). Next 14 EOL
  dan kena 3 critical RCE. Tanpa perubahan kode. Hasil: npm audit 0 vuln (termasuk dev), type-check/lint/build lolos,
  smoke test Playwright Firefox+Chrome (semua halaman, Monaco, diagram+PNG, schema compare, tema, menu mobile, header,
  rewrite /api) lolos. Lint: 5 warning exhaustive-deps lama. Satu error blob NS_BINDING_ABORTED Firefox sekali saat uji
  coba, tidak bisa diulang (0/12, juga di Next 14 live) -> timing worker Monaco.
- Node lokal laptop kantor TIDAK perlu di-upgrade (keputusan user 2026-10-28, tanpa admin); yang penting runtime Vercel 24.x.

## 0000c. QA situs live msf-db.my.id (2026-10-28) — sebagian diperbaiki, belum di-commit

Script QA (Playwright, Firefox + Chrome sistem) ada di scratchpad sesi; temuan diverifikasi langsung di produksi.
Perbaikan diverifikasi di build produksi lokal (frontend :3100 -> backend lokal :8765), Firefox + Chrome.

- [x] TINGGI `backend/app/services/sql_parser.py::_parse_column` — dulu `DATA_TYPE_PATTERN.search(line)` mencari di
  seluruh baris (nama kolom ikut), jadi `updated_by_id uuid`→DATE, `timestamptz`/`TIMESTAMP`→TIME, `settings JSONB`→SET,
  dst. Sekarang `COLUMN_TYPE_PATTERN.match(line, name_match.end())`: tipe dibaca tepat setelah nama kolom, apa adanya
  (`TIMESTAMPTZ(6)`, `INT4`, `TIMESTAMP WITH TIME ZONE`, `TEXT[]`, `public.enum`). `max_length` dibaca dari tipe.
  Test: `tests/test_sql_parser.py::TestSQLParserColumnTypes` (5 test). pytest 126 passed.
- [x] TINGGI Unduh PNG diagram gagal di Firefox (`html-to-image` 1.11.13 `e is undefined` saat embed font).
  `DiagramCanvas.tsx::getFontEmbedCss` menyusun @font-face sendiri (font next/font same-origin -> data URL, di-cache)
  dan dioper via `fontEmbedCSS`; kalau gagal tetap unduh dengan `skipFonts`.
- [x] SEDANG Teks dashboard: "100% Data Lokal" -> "Kredensial Tidak Disimpan"; "Pemrosesan Lokal" -> "Hanya Struktur"
  (jujur soal server MSF DB + DeepSeek/OpenAI bila dipilih); kartu koneksi -> "PostgreSQL atau MySQL yang dapat diakses
  dari internet" (SQL Server tidak didukung, SQLite hanya dev).
- [x] SEDANG Lacak kode tidak ada -> "Kode pelacakan tidak ditemukan atau sudah kedaluwarsa" (`hooks/useGenerate.ts::trackJob`,
  hanya bila 404 berisi JSON backend; pesan umum `getFriendlyErrorMessage` tidak diubah).
- [x] SEDANG Drawer mobile menutup setelah pilih halaman (`Sidebar.tsx` Link `onClick={onClose}`, tombol X diberi aria-label).
- [x] SEDANG Menu "Settings" dihapus dari sidebar (halaman `/settings` tetap redirect untuk link lama). `Header.tsx`:
  ROUTE_MAP + `/generate`, `/linux-helper`; default rute tak dikenal (404) jadi "MSF DB", bukan "AI Generator".
- [ ] SEDANG Frontend Vercel tanpa X-Frame-Options/CSP/nosniff (backend sudah lengkap).
- [ ] RENDAH Diagram diam-diam membuang FK ke tabel di luar DDL; mobile Generate toolbar terpotong; pill "Mode Maintenance"
  menutupi konten mobile; favicon 404; judul tab sama semua halaman; tombol ikon tanpa aria-label.
- Info: AI Generator di produksi selalu disabled (Ollama offline di Render). Nama file PNG berjam sudah live.

## 0000b. Nama file unduhan ERD pakai jam (2026-10-27) — belum di-commit

- `components/diagram/DiagramCanvas.tsx` (handler download PNG): nama file dari `toISOString().slice(0,10)` (tanggal
  UTC saja, sering bentrok jadi "(1)", "(2)", dan sebelum jam 07.00 WIB tanggalnya kemarin) diganti jadi
  `msf-database-diagram-YYYY-MM-DD_HHmmss.png` dengan jam lokal browser. Verifikasi: `npm run type-check` lolos.

## 0000a. Schema Compare dwibahasa EN/ID (2026-10-27) — belum di-commit

- Semua teks Schema Compare pindah ke `features/schema-compare/lib/i18n.ts` (`STRINGS.en/id`, `useT()` via
  `I18nProvider` di `SchemaComparePage`). `lib/view.ts::buildNotices` dan `lib/explain.ts` menerima `t: Strings`;
  `OBJECT_LABELS` dihapus (ganti `t.objects`). Error backend diterjemahkan dari `error_code` (`ConnectForm::describeError`);
  error disimpan mentah supaya pesan ikut berganti saat bahasa diganti.
- Toggle EN/ID di kanan atas halaman. Hook bahasa landing dipindah ke `src/lib/useLang.ts` (key `msfdb-lang`, default
  `en`) dan dipakai landing + Schema Compare, jadi pilihan terbawa antar halaman. Halaman workspace lain belum dwibahasa.
- Permintaan user: teks "Konek langsung" diganti "Koneksi database" / "Database connection"; tab ini sekarang default
  dan di depan ("Unggah file" / "Upload file" kedua). Subjudul Header ikut diganti.
- Verifikasi: type-check, lint, build OK; Playwright di build produksi (EN default + tab koneksi aktif, error auth
  EN→ID, compare ID→EN, peringatan akses, pilihan bahasa terbawa ke landing).

---

## 0000. Schema Compare: koneksi database + 2 bug fix (2026-10-27) — belum di-commit

**Koneksi langsung (PostgreSQL saja):** tiap slot Acuan/Target punya tab "Upload file" | "Konek langsung".
- Backend `POST /api/schema-compare/catalog` (`routers/schema_compare.py`, `services/schema_catalog.py`): HANYA query
  `pg_catalog` yang tetap (tanpa SQL dari user), tanpa SELECT/COUNT ke tabel user, tanpa baca tabel migrasi
  (`app_migration` selalu null). `SET TRANSACTION READ ONLY` + `SET LOCAL statement_timeout 15s` (bukan startup
  `options`, supaya jalan di pooler Supabase/Neon), `NullPool`, lewat guard anti-SSRF lama. Mengembalikan baris
  mentah + info akses (`is_superuser`, jumlah tabel yang bisa di-SELECT via `has_any_column_privilege`).
- Anti penyalahgunaan: rate limit 20 req/10 mnt per IP (`utils/rate_limit.py`), lockout 5 auth gagal/15 mnt **per
  target** (host+port+db+user; penting karena lewat Vercel semua IP = IP Vercel) + 10/15 mnt per IP, maks 2 jalan
  bersamaan. Tanpa riwayat: kredensial tak disimpan. Log audit `schema_compare_catalog` = IP, sidik target HMAC
  (kunci acak per proses, `db_url_guard.target_fingerprint`), outcome — tanpa password/host.
- Frontend: snapshot disusun di browser oleh `core/catalog.ts` (disalin dari `db-schema-compare`, sama dengan CLI)
  → divalidasi `validateSnapshot`. Form `ConnectForm.tsx` (password dikosongkan setelah sukses, tak ada storage),
  resep SQL role `schema_reader` tanpa GRANT SELECT, peringatan kuning kalau akun superuser/bisa baca data, tombol
  unduh snapshot. `lib/live.ts`, tipe `SchemaCatalogResponse` di `lib/types.ts`, `api.fetchSchemaCatalog`.
- Batasan: backend Render menolak host privat → DB di VPN tetap pakai CLI. MySQL belum.

**Repo `db-schema-compare` (di luar MSF_DB, sumber `core/`):** penyusunan snapshot dipisah dari
`adapters/postgres.ts` ke `src/core/catalog.ts` (murni). Fix differ: tipe sekeluarga melebar tapi panjang mengecil
(`char(50)`→`varchar(10)`) sekarang critical (dulu info); SPEC + 2 test ditambah. Core frontend disalin ulang
(normalizer/naming/catalog baru).

**Fix upload:** file snapshot dari `> file.json` di Windows PowerShell 5.1 (UTF-16LE) dulu ditolak; sekarang
`SnapshotSlot` decode sesuai BOM.

Verifikasi: backend 125 test lolos (4 integrasi PG asli via `TEST_PG_URL`, termasuk bukti `pg_stat_user_tables`
tak berubah = isi tabel tak disentuh); CLI 81 test lolos (termasuk integrasi `TEST_PG_HOST`); snapshot koneksi
langsung identik dengan snapshot CLI untuk DB yang sama; e2e Playwright Firefox (password salah, konek, peringatan
akses, password tak di DOM/storage, upload UTF-16, muat contoh); type-check, lint, build OK.

---

## 000. Fix navigasi Diagram (2026-10-26) — belum di-commit

`frontend/src/components/diagram/DiagramCanvas.tsx`: kanvas dulu tidak bisa digeser (cek target `svg-overlay` tak pernah
kena karena SVG `pointer-events-none`), tak ada scroll mouse, auto-fit tak jalan saat rerender dgn jumlah tabel sama,
zoom min fit 0.45, layout grid pakai tinggi tabel tertinggi → tabel ke-3 di y≈1180 (tak terlihat). Sekarang: seret area
kosong / scroll = geser, Ctrl+scroll = zoom ke kursor, fit tiap layout dihitung (hindari toolbar), grid masonry, tinggi
per baris/kolom, drag tabel dibagi zoom, tinggi header/baris dikunci (HEADER_HEIGHT 46, row 28) supaya titik garis pas.
Dites Playwright (Firefox) + type-check OK.

**Relasi virtual (2026-10-26, belum di-commit):** garis antar kolom tanpa FK di SQL. Hover baris kolom → titik ● di kanan
→ tarik ke kolom tabel lain → popup "Apakah benar tabel A terhubung ke tabel B melalui kolom ini?" (Tukar arah / Batal /
Ya, hubungkan; peringatan kalau tipe beda / tujuan bukan PK) → garis putus-putus amber + ikon `Link2` di kedua kolom.
Klik garis → popup hapus. Disimpan di localStorage `msf-diagram-virtual-relations` (per browser, kunci nama tabel+kolom,
tidak dibagi ke orang lain). Ikut layout, hover-highlight, PNG, dan Mermaid (`}o..||` "(virtual)").
File baru: `components/diagram/useVirtualRelations.ts`, `VirtualRelationModal.tsx`; ubah `DiagramCanvas.tsx`,
`MermaidExportModal.tsx`, `lib/mermaidGenerator.ts`. Belum: export/import JSON, saran otomatis dari nama kolom, "Salin
sebagai SQL (ALTER TABLE ADD FOREIGN KEY)".

**Layar penuh diagram (2026-10-26, belum di-commit):** tombol `Maximize2`/`Minimize2` paling kanan toolbar (ikon Fit diganti
`Scan` biar tak tertukar). Kanvas di-`createPortal` ke `body` jadi `fixed inset-0 z-[100] bg-background` (portal wajib:
`animate-fade-in-up` di halaman meninggalkan `transform` → `fixed` terkurung) + `document.documentElement.requestFullscreen()`
(seluruh halaman, bukan elemen, supaya modal z-[200] & toast tetap tampil). Esc mengupas satu lapis: fullscreen browser →
modal → layar penuh. Fit ulang saat masuk/keluar, scroll body dikunci. Dites Playwright Firefox + type-check OK.

**Hapus garis FK + relasi virtual jadi hijau (2026-10-26, belum di-commit):** semua garis bisa diklik → popup hapus.
FK asli (dari SQL) cuma *disembunyikan*: localStorage `msf-diagram-hidden-relations` (hook generik `useStoredRelations`
di `useVirtualRelations.ts`, ekspor `useHiddenRelations`), SQL tak berubah. Tombol "N relasi FK disembunyikan · Tampilkan"
di kiri bawah kanvas; menarik ulang kolom FK yang disembunyikan = tampilkan lagi (tanpa popup). FK tersembunyi ikut tak
dipakai layout & tak diekspor ke Mermaid (tanda `FK` kolom tetap, `mermaidGenerator` cek `col.is_foreign_key`). Relasi
virtual sekarang tampil **sama persis** dengan FK asli (permintaan user): hijau accent, garis penuh, ikon `Link` yang
sama hanya di kolom asal (detail "Relasi virtual" di tooltip ikon). Garis preview saat menarik tetap putus-putus. Export
Mermaid masih membedakan (`}o..||` + "(virtual)"). Amber tersisa hanya ikon PK & kotak peringatan di modal. Dites Playwright (buat/hapus virtual, sembunyikan/tampilkan FK, reload, Mermaid) + type-check/lint OK.

**Geser garis relasi (2026-10-27, belum di-commit):** bagian tegak garis hijau (elbow H→V→H) bisa diseret kiri/kanan
(pegangan transparan `data-line-handle`, kursor ↔). Geseran disimpan relatif dari posisi otomatis di localStorage
`msf-diagram-relation-offsets` (hook `useRelationOffsets` di `useVirtualRelations.ts`, kunci = relationId), jadi tetap
masuk akal kalau tabel dipindah/ganti layout. Dibatasi di celah antar tabel (margin 10px) supaya tak masuk ke bawah
kartu. Klik = popup hapus (ditunda 250ms), dobel-klik = kembali otomatis; tombol "N garis digeser · Reset posisi" di kiri
bawah (ditumpuk dgn tombol FK tersembunyi). Belum: geser segmen datar / tambah titik belok bebas. Dites Playwright
Firefox (geser, batas, reload, klik, dobel-klik) + type-check OK.

---

## 00. Patch keamanan Node/PHP/Laravel (2026-10-23) — BELUM SELESAI, belum di-commit

Pemicu: Node.js security release 21 Okt 2026 (10 CVE, RCE Brotli CVE-2026-111497; Node 20 EOL tanpa patch),
PHP "PHP2Shell" CVE-2026-109618/109619 (fix 8.3.36), Laravel TokenGuard bypass CVE-2026-114509 (fix 12.68.0;
hanya `auth:api` + MySQL/MariaDB — project ini pgsql & tak pakai TokenGuard, jadi risiko rendah).

Sudah diubah (path relatif root repo `MSF_DB/`):
- `node:20-alpine` → `node:24-alpine`: `msf-app/frontend/Dockerfile`, `v2/msf-db/frontend/Dockerfile`, `sql-docs-generator/frontend/Dockerfile`
- `msf-app/frontend/package.json`: `"engines": { "node": "24.x" }` (untuk Vercel)
- `php:8.3-fpm` → `php:8.3.36-fpm`: `laravel/metod-saw/Dockerfile`, `dev_/laravel-docker/Dockerfile`
- `laravel/framework` `^12.0` → `^12.68`: `laravel/example-app/composer.json`, `laravel/metod-saw/src/composer.json`

SISA (dikerjakan di laptop lain yang punya Docker/PHP):
1. `composer.lock` masih Laravel lama (12.33.0 / 12.40.1) → jalankan di `laravel/example-app` dan `laravel/metod-saw/src`:
   `composer update laravel/framework -W` (tanpa PHP lokal: `docker run --rm -v "$(pwd):/app" -w /app composer:2 update laravel/framework -W --ignore-platform-reqs`)
2. `docker compose build --pull` lalu `up -d` untuk image Node/PHP baru; `n8n/`: `docker compose pull` (`n8nio/n8n:latest`)
3. Redeploy Vercel, cek Settings → Node.js Version = 24.x
4. ~~Node lokal laptop kantor~~ — tidak perlu (keputusan user 2026-10-28: laptop kantor tanpa admin, v24.15.0 cukup)

---

## 0. Linux Helper — modul baru (2026-10-20)

Plan: `dev-docs/modules/linux-helper/PLAN.md`. **Fase 1 & 2 SELESAI**, belum di-commit.

File di `frontend/src/features/linux-helper/`:
- `lib/`: `schema.ts`, `labels.ts`
- `data/`: `index.ts` (validasi Zod saat load), `level-0.json` (18 item), `level-1/2.json` (kosong), `runbooks/index.json` (kosong)
- `hooks/`: `useLinuxFilters.ts` (level/env/distro/q ↔ URL)
- `components/`: `LinuxHelperPage.tsx` (orkestrator), `Level0View.tsx`, `LevelStepper.tsx`, `EnvDistroFilter.tsx`,
  `Keycap.tsx`, `ShortcutCard.tsx`, `TerminalBlock.tsx`, `SshAccessPanel.tsx`, `CommandCard.tsx`, `CommandDrawer.tsx`

**REVISI DESAIN (permintaan user):** fitur "tandai hafal" DIBATALKAN (`useProgress.ts` dihapus). Command kini pakai
**layout kartu ala SQL Helper** (badge + judul + deskripsi + preview command + Copy + "View Details" drawer); shortcut
tetap keycap. Reuse `RiskBadge`/`CategoryBadge` dari `@/features/sql-helper/components/Badges`. `CommandSchema` dapat
field `description` (wajib) + `note` (opsional, di drawer). Ini membatalkan sebagian G3 di PLAN (dulu "jangan pakai kartu SQL Helper").
Lain: `src/app/linux-helper/page.tsx`, `scripts/validate-linux-helper.mjs` + script `validate:linux-helper`,
`src/components/layout/Sidebar.tsx` (navbar "Linux Helper", ikon `SquareTerminal`, setelah Schema Compare).

Keputusan desain: data per-level = objek `{ shortcuts, commands }`; runbook di `data/runbooks/index.json` (array).
**`LinuxParamSchema` dibuat sendiri** (bukan reuse `ParamSchema` SQL Helper) + tipe `port/ip/cidr/path` —
dari analisis: `validateParamValue` SQL Helper cuma identifier/number & tak menolak metachar shell (penting Fase 4
anti command-injection). Reuse util SQL Helper lewat import: `copyToClipboard` (`@/lib/clipboard`), `useLocalStorage`.
SQL Helper & `/shortcuts` tidak diubah.
DoD lolos tiap fase: `validate:linux-helper`, `type-check`, `lint` (0 isu), `build` (route 8.7 kB). File terbesar 112 baris.

**Fase 3 SELESAI (2026-10-20):** Level 1 (17 command) & Level 2 (22) aktif. Baru di `lib/`: `resolve.ts` (varian distro),
`search.ts` (Fuse), `shiki.ts` (highlight bash lazy). Baru di `components/`: `CommandLevelView` (orkestrasi L1/L2),
`CategoryChips`, `ShellHighlight`, `RiskBanner`. `CommandCard`/`CommandDrawer` kini distro-aware; command `high` paksa
buka drawer + konfirmasi checkbox sebelum copy. Reuse `RiskBadge`/`CategoryBadge` SQL Helper. DoD lolos (route 15 kB).

**PERLU REVIEW:** konten command Level 1–2 (`rm -rf`=high, `chmod/chown/kill/ufw/useradd`=medium) belum diverifikasi
orang yang paham server; varian RHEL dari pengetahuan umum, belum diuji di RHEL/Rocky asli.

**Fase 4 SELESAI (2026-10-20):** Level 3 Runbook aktif dengan 6 runbook (install PostgreSQL/MySQL, remote access, firewall
port DB, backup & restore, troubleshoot DB down). Lib baru: `validateParam.ts` (whitelist anti-injection per tipe),
`runbook.ts` (interpolasi + resolve distro), `exportScript.ts` (export `.sh` + header peringatan). Komponen: `Level3View`,
`RunbookView`, `RunbookStepItem`, `RunbookVars`. Keamanan: hanya nilai lolos validasi yang di-interpolasi (invalid tetap
`{{placeholder}}`); password bukan variabel (literal + catatan); export disabled bila var wajib invalid. DoD lolos.

**PERLU REVIEW (makin penting):** semua konten runbook + varian RHEL ditulis dari pengetahuan umum, BELUM diuji di server
asli. Step destruktif (`pg_hba` buka akses = high, restore DB = high) perlu dicek orang yang paham server DB.

**Fase 5 + CommandPalette SELESAI (2026-10-20):** `CommandPalette` (Ctrl/⌘+K, `CommandPalette.tsx`) — cari cepat lintas
shortcut/command/runbook (Fuse), navigasi keyboard, lompat ke level + filter item; tombol hint ⌘K di samping search.
Dokumentasi: `dev-docs/modules/linux-helper/README.md`, entri `modules/README.md`, CHANGELOG (`[Unreleased]`), laporan task
`reports/task/frontend/2026-10-20-linux-helper.md`. QA otomatis lolos (validate 63 item, type-check, lint, build route ~21 kB,
dev server fresh HTTP 200). Catatan: 500 `__webpack_modules__` saat dev HMR muncul setelah banyak edit = cache korup, hilang
setelah `rm -rf .next` + restart (build produksi selalu bersih).

**SISA (butuh manusia / di luar environment):** (1) review konten command & runbook + varian RHEL oleh orang yang paham
server; (2) QA visual + axe di browser (buka manual); (3) commit/push oleh Human Developer (AI tidak push) — belum di-commit.
Modul fungsional Level 0–3.

---

## 1. Status saat ini

- Repo git: `MSF_DB/`, branch **`dev`**.
- Frontend (Next.js 14) **sudah di Vercel**. Backend (FastAPI) **belum di-deploy**.
- Perubahan di bawah (bagian 2) **BELUM di-commit**:

```
M msf-app/frontend/src/app/admin/page.tsx
M msf-app/frontend/src/app/layout.tsx
M msf-app/frontend/src/app/page.tsx
M msf-app/frontend/src/components/generator/SqlEditor.tsx
M msf-app/frontend/src/components/layout/AppLayout.tsx
M msf-app/frontend/src/styles/globals.css
?? msfdb-landing-handoff.zip   (bahan desain landing, bukan kode — jangan di-commit)
```

`npm run build` dan `npm run lint` lolos (warning lint yang tersisa ada di file lain dan sudah ada sebelumnya).

> Folder `MSF_DB/v2/msf-db/` adalah salinan lama frontend — tidak dipakai, tidak diubah.

---

## 2. Yang sudah dikerjakan (2026-10-15)

### a. Redesign landing page (`src/app/page.tsx`)
- Diganti dengan desain gelap dari `msfdb-landing-handoff.zip` (`page.reference.tsx`).
- Toggle bahasa **EN/ID** di navbar; default English; disimpan di `localStorage` key `msfdb-lang`; `<html lang>` ikut berubah. Semua teks ada di objek `dict`.
- **Bug di file referensi sudah diperbaiki**: dulu pilihan ID hilang setelah reload (effect menyimpan "en" default sebelum nilai tersimpan dibaca). Sekarang `localStorage` hanya ditulis saat user klik EN/ID.
- CTA mengarah ke `/dashboard`.
- Root `<div data-page="landing">` dipakai CSS untuk background `#020617`, smooth scroll, dan scrollbar gelap khusus landing (`html:has([data-page="landing"])` di `globals.css`).
- Metadata description di `layout.tsx` diganti ke bahasa Inggris.

### b. Workspace default dark (sync dengan landing)
- `layout.tsx`: `ThemeProvider defaultTheme="dark"` (sebelumnya `light`). Toggle matahari/bulan di sidebar tetap jalan.
- Bagian yang dulu tetap terang di mode dark, sudah diperbaiki:
  - Banner "Koneksi API Bermasalah" → varian `dark:` (`AppLayout.tsx`)
  - Monaco editor ikut tema: `vs-dark` / `vs` via `useTheme` (`SqlEditor.tsx`)
  - Ikon gembok Admin (`admin/page.tsx`)
  - `globals.css`: fallback `.dark` untuk `bg-gray-50/50` dan badge berwarna (`bg-{red,amber,emerald,blue,purple}-50/100`, border `-100/200`, text `-700/800/900`). Warna teal **sengaja tidak** di-override karena komponennya sudah punya `dark:` sendiri.
- Sudah dicek visual di 8 route (dashboard, generate, diagram, sql-helper, schema-compare, shortcuts, settings, admin) untuk mode dark dan light.

---

## 3. Rencana deploy backend — Render (gratis)

**Keputusan:** pakai **Render, workspace Hobby ($0) + Instance Type "Free"**.
Alternatif yang dicek dan ditolak: Koyeb (akun baru harus berbayar), Hugging Face Spaces (Docker Spaces dilaporkan berbayar), Railway/Fly.io (tidak ada free permanen). Opsi lanjutan nanti: Oracle Cloud Always Free VM (tanpa sleep, butuh kartu kredit + setup sendiri).

### Soal kartu kredit
- User **tidak punya kartu kredit yang ada saldonya** → prioritaskan opsi tanpa kartu.
- Render (artikel resmi 2026) bilang free tier tanpa kartu, tapi staff Render di forum menyebut sebagian akun diminta verifikasi kartu (charge $1 lalu dikembalikan) untuk anti-abuse. Jadi: **coba daftar dulu tanpa kartu**.
- Kalau Render minta kartu: verifikasi $1 akan gagal dengan kartu kosong. Opsi: isi saldo sedikit / pakai kartu debit virtual Visa/Mastercard yang bisa transaksi online; atau cari host lain yang benar-benar tanpa kartu.
- Oracle Cloud Always Free juga butuh verifikasi kartu → kemungkinan tidak bisa untuk saat ini.

### Kuota Hobby (dari halaman pricing yang dilihat user)
- 5 GB bandwidth/bulan ($0.15/GB setelahnya), 500 build minutes, 2 custom domain, 25 service.
- Instance Free: 512 MB RAM, ~750 jam/bulan, **sleep setelah 15 menit idle**, cold start ±1 menit.
- **Biaya hanya muncul kalau** salah pilih instance type (bukan "Free"), bandwidth > 5 GB, atau bikin Postgres di Render (tidak perlu — backend pakai SQLite).

### Persiapan yang sudah dicek (2026-10-15)
- Repo GitHub: `04irsyaD/MSF_DB`. Kode backend di **`origin/dev` = lokal**; `main` ketinggalan (belum ada `job_store.py`). → **Deploy dari branch `dev`.**
- Backend dites lokal dengan env ala Render, tanpa Ollama: startup OK (cuma warning Ollama), `/health` → 200 `"status":"degraded"`, `/api/shortcuts` 200, CORS `msf-db.my.id` OK.
- `OUTPUT_DIR` **wajib di-set** (`/app/outputs`): default-nya SQLite menulis ke `/data` yang tidak bisa ditulis user non-root di container.
- Folder `templates/` tidak ada di repo → aman, docx exporter pakai `Document()` kosong.
- `MSF_API_KEY` biarkan kosong (kalau di-set, frontend harus kirim `NEXT_PUBLIC_MSF_API_KEY` yang toh terlihat di browser).
- **File `render.yaml` sudah dibuat di root repo (`MSF_DB/render.yaml`)** — belum di-commit/push.

### Cara frontend Vercel menghubungi backend (PENTING)
Frontend memanggil path relatif `/api/...`, lalu `next.config.js` me-*rewrite* ke `BACKEND_URL` → `NEXT_PUBLIC_API_URL` → default `http://backend:8000` (hostname Docker, **tidak ada di Vercel** → kemungkinan penyebab error 500 di produksi sekarang).
Karena request lewat server Vercel, CORS sebenarnya tidak terpakai; `CORS_ORIGINS` tetap diisi untuk jaga-jaga.
Rewrite dibaca saat **build** → setelah ganti env di Vercel wajib **Redeploy**.

### Langkah deploy
**Opsi A — Blueprint (pakai `render.yaml`, disarankan):**
1. Commit + push `render.yaml` ke branch `dev`.
2. Render → **New → Blueprint** → pilih repo `MSF_DB` → branch `dev`.
3. Render minta isi env `sync: false`: `CORS_ORIGINS` = `https://msf-db.my.id,https://<project>.vercel.app`; `DEEPSEEK_API_KEY` boleh kosong.
4. Pastikan plan tertulis **Free** → Apply. `ADMIN_PASSCODE` dibuat acak → lihat di tab Environment service.

**Opsi B — manual (tanpa commit):**
Render → New → **Web Service** → repo `MSF_DB`, branch `dev`, Root Directory `msf-app/backend`, Runtime **Docker**, Instance Type **Free**, Region Singapore, Health Check Path `/health`. Env vars: salin dari `render.yaml` (PORT, OUTPUT_DIR, LOG_FILE_PATH, SHORTCUTS_DIR, TEMPLATES_DIR, TZ, LOG_LEVEL, MAX_CONCURRENT_JOBS=1, CORS_ORIGINS, ADMIN_PASSCODE kuat, DEEPSEEK_API_KEY opsional).

**Setelah backend Live:**
1. Tes `https://<service>.onrender.com/health` → harus `{"status":"degraded",...}` (degraded = Ollama tidak ada, normal).
2. Vercel → Settings → Environment Variables → `BACKEND_URL=https://<service>.onrender.com` (tanpa `/api`, tanpa slash akhir) untuk Production → **Redeploy**.
3. Buka `https://msf-db.my.id/api/health` → harus sama dengan langkah 1.

### Keterbatasan yang sudah diterima
- **Ollama tidak jalan** di Render free (RAM kecil) → generate AI lokal gagal; pakai DeepSeek/OpenAI.
- **Disk ephemeral** → riwayat job (SQLite di `OUTPUT_DIR`/`data`) dan file DOCX/PDF hilang saat restart/sleep.
- Saat backend tidur, frontend menampilkan banner "Koneksi API Bermasalah" ±1 menit lalu normal.

---

## 4. TODO / langkah berikutnya

- [ ] Review & commit perubahan frontend di bagian 1 (user belum minta commit).
- [x] `render.yaml` dibuat (root repo) — tinggal commit+push ke `dev` kalau pakai Blueprint.
- [x] Backend dicek aman jalan tanpa Ollama (asal `OUTPUT_DIR` di-set).
- [x] Backend **LIVE** di Render: https://msf-db-backend.onrender.com (deploy manual / Opsi B, branch `dev`, Singapore, Free, 2026-10-15). `/health`, `/api/shortcuts`, CORS msf-db.my.id OK.
- [ ] Set `BACKEND_URL=https://msf-db-backend.onrender.com` di Vercel + Redeploy (per 2026-10-15 `msf-db.my.id/api/health` masih 502).
- [ ] Cek Vercel Settings → Git → Production Branch (main/dev?) sebelum merge `dev` → `main`. Saat ini `dev` 31 commit di depan, `main` 2 commit di depan (diverged).
- [ ] Kurangi polling `/api/health`: sekarang `AppLayout` polling tiap 10 detik **termasuk di landing `/`**, dashboard juga tiap 12 detik. Ini makan bandwidth (±90 MB/bulan per tab terbuka 8 jam/hari) dan bikin backend Render tidak pernah tidur. Usulan: skip polling di `/`, perlambat interval.
- [ ] (Opsional) Samakan warna dasar workspace dark (`#0b111e`) dengan landing (`slate-950` / `#020617`).
- [ ] Ganti `ADMIN_PASSCODE` default `admin123` di `docker-compose.yml` / `.env`.

---

## 5. Cara menjalankan lokal

```powershell
# Frontend
cd MSF_DB\msf-app\frontend
npm run dev            # http://localhost:3000

# Backend (terminal lain) — lihat DEVELOPMENT.md untuk setup venv
cd MSF_DB\msf-app\backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Atau semua sekaligus
cd MSF_DB\msf-app
docker-compose up -d
```
