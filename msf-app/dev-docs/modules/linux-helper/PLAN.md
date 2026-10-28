# Linux Helper — Development Plan

> **Status:** Fase 1–5 SELESAI (2026-10-20). Konten Level 1–3 BUTUH REVIEW manusia + QA visual/axe manual di browser.
> **Tanggal:** 2026-10-20
> **Modul:** Linux Helper (`/linux-helper`, client standalone)
> **Referensi tampilan:** Mock v2 "Level 0 Dasar Terminal" (keycap, gaya terminal, level bertingkat)

---

## 1. Latar Belakang

Tim sering setting server DB (install PostgreSQL/MySQL, buka remote access, firewall, backup) tetapi
tidak semua anggota hafal command Linux. SQL Helper sudah membantu di sisi SQL, belum ada yang membantu
di sisi server/OS.

Linux Helper mengisi celah itu, dengan pendekatan yang **berbeda** dari SQL Helper:

| | SQL Helper | Linux Helper |
|---|---|---|
| Bentuk | Katalog skrip (kartu/tabel + drawer) | Jalur belajar bertingkat + runbook step-by-step |
| Unit konten | Satu skrip SQL lepas | Shortcut keyboard, command satuan, runbook berurutan |
| Visual | Kartu + badge + chip filter | Keycap (`<kbd>`), blok terminal (`$` prompt), checklist progress |
| Konteks | Engine DB | Lingkungan (Desktop / SSH) + distro (Ubuntu / RHEL) |

## 2. Tujuan

| # | Tujuan | Indikator keberhasilan |
|---|--------|------------------------|
| G1 | Pemula bisa mulai dari nol | Level 0 berisi shortcut & command dasar (buka terminal, clear, stop, copy/paste, SSH) |
| G2 | Bertahap sampai setup server DB | 4 level: Dasar → Navigasi & File → Sistem & Jaringan → Runbook DB |
| G3 | Tampilan punya identitas sendiri | Keycap, blok terminal, level stepper; tidak memakai layout kartu SQL Helper |
| G4 | Aman disalin ke server | Label risiko + konfirmasi untuk command destruktif |
| G5 | Aksesibel | Navigasi keyboard penuh, `<kbd>` semantik, lolos axe (0 critical/serious) |

## 3. Non-Goals

- **Tidak** menjalankan command dari browser (tidak ada web terminal / SSH client).
- **Tidak** menambah ketergantungan backend (100% client standalone, data JSON dibundel).
- **Tidak** mengubah kode SQL Helper maupun `/shortcuts` (zero regression).
- Tidak ada akun; progress & preferensi hanya di `localStorage`.
- Fase awal hanya Ubuntu/Debian dan RHEL/Rocky. Distro lain menyusul bila dibutuhkan.

## 4. Prinsip

- **Anti-Monster Rule**: tiap file < 500 baris (target < 200).
- Tidak ada `git push` otomatis.
- Tidak ada dependensi baru kecuali benar-benar perlu. Pakai yang sudah ada: `zod`, `fuse.js`, `shiki`, `@radix-ui/react-dialog`, `lucide-react`.
- Pakai ulang util SQL Helper lewat import (`clipboard`, `useLocalStorage`, `interpolate`, `riskMeta`).
  Ekstraksi ke `src/lib/` ditunda agar SQL Helper tidak tersentuh.
- Teks UI dipusatkan di `lib/labels.ts`. Konten berbahasa Indonesia, istilah teknis tetap Inggris.

---

## 5. Struktur Level & Konten

| Level | Nama | Isi | Bentuk |
|-------|------|-----|--------|
| 0 | Dasar Terminal | Cara masuk server (SSH dari Windows/macOS), shortcut keyboard, command dasar | Kartu keycap + blok terminal |
| 1 | Navigasi & File | `cd`, `ls`, `cp`, `mv`, `rm`, `mkdir`, `cat`, `less`, `nano`/`vim` dasar, `find`, `grep`, `tar` | Blok terminal per kategori |
| 2 | Sistem & Jaringan | `systemctl`, `journalctl`, `df`, `du`, `free`, `top`, `chmod`, `chown`, `useradd`, `ss`, `ping`, `curl`, `ufw`/`firewalld` | Blok terminal per kategori |
| 3 | Runbook Server DB | Install PostgreSQL, install MySQL, buka remote access, firewall port DB, backup & restore, troubleshoot DB down | Runbook step-by-step + variabel global |

Target konten awal: Level 0 ± 20 item, Level 1–2 ± 40 command, Level 3 ± 4–6 runbook.

### Contoh isi Level 0

Shortcut keyboard:

| Aksi | Shortcut | Lingkungan |
|---|---|---|
| Buka terminal | `Ctrl + Alt + T` | Desktop (Ubuntu/GNOME) |
| Bersihkan layar | `Ctrl + L` / `clear` | Desktop + SSH |
| Hentikan command | `Ctrl + C` | Desktop + SSH |
| Copy / paste | `Ctrl + Shift + C` / `Ctrl + Shift + V` | Desktop (peringatan: `Ctrl + C` = stop) |
| Auto-complete | `Tab` | Desktop + SSH |
| Cari riwayat | `Ctrl + R` | Desktop + SSH |
| Awal / akhir baris | `Ctrl + A` / `Ctrl + E` | Desktop + SSH |
| Hapus satu baris | `Ctrl + U` | Desktop + SSH |
| Keluar | `Ctrl + D` / `exit` | Desktop + SSH |

Cara masuk ke server: `ssh user@host`, `ssh -p 2222 user@host`, buka Windows Terminal (`Win + X`).

Command dasar: `pwd`, `ls -la`, `cd`, `whoami`, `history`, `sudo`, `man`, `clear`, `exit`.

---

## 6. Model Data (Zod)

File: `features/linux-helper/lib/schema.ts`. Data: `features/linux-helper/data/*.json`.

```ts
const LevelSchema = z.enum(["0", "1", "2", "3"]);
const EnvSchema = z.enum(["desktop", "ssh"]);
const DistroSchema = z.enum(["ubuntu", "rhel"]);
const RiskSchema = z.enum(["low", "medium", "high"]);

// Shortcut keyboard (Level 0)
const ShortcutSchema = z.object({
  id: z.string(),
  level: LevelSchema,
  title: z.string(),                       // "Bersihkan layar"
  keys: z.array(z.array(z.string())),      // [["Ctrl","L"]] → kombinasi alternatif
  altCommand: z.string().optional(),       // "clear"
  env: z.array(EnvSchema).min(1),
  note: z.string().optional(),             // "Hanya Ubuntu/GNOME"
  warning: z.string().optional(),          // "Ctrl+C biasa = stop"
});

// Command satuan (Level 0–2)
const CommandSchema = z.object({
  id: z.string(),
  level: LevelSchema,
  category: z.string(),                    // "navigasi", "service", "network", ...
  title: z.string(),
  command: z.string(),                     // boleh berisi {{placeholder}}
  variants: z.partialRecord(DistroSchema, z.string()).optional(), // beda per distro (zod v4: partialRecord, bukan record)
  explain: z.array(z.object({ part: z.string(), meaning: z.string() })).default([]),
  risk: RiskSchema.default("low"),
  tags: z.array(z.string()).default([]),
});

// Runbook (Level 3)
const RunbookSchema = z.object({
  id: z.string(),
  title: z.string(),
  icon: z.string().optional(),
  description: z.string(),
  vars: z.array(LinuxParamSchema),         // LinuxParamSchema (bukan reuse) — tipe port/ip/cidr/path utk validasi anti-injection
  steps: z.array(z.object({
    id: z.string(),
    title: z.string(),
    commands: z.array(z.string()),         // boleh {{var}}
    variants: z.partialRecord(DistroSchema, z.array(z.string())).optional(),
    verify: z.string().optional(),         // command cek hasil
    commonErrors: z.array(z.object({ error: z.string(), fix: z.string() })).default([]),
    risk: RiskSchema.default("low"),
  })).min(1),
});
```

Validasi lewat skrip `scripts/validate-linux-helper.mjs` (`npm run validate:linux-helper`),
pola yang sama dengan `validate:data`.

---

## 7. Struktur Folder

```
frontend/src/
├── app/linux-helper/page.tsx              # Suspense wrapper (pola sama dgn sql-helper)
└── features/linux-helper/
    ├── components/
    │   ├── LinuxHelperPage.tsx            # orkestrasi level, filter, search
    │   ├── LevelStepper.tsx               # 4 level + progress
    │   ├── EnvDistroFilter.tsx            # Desktop/SSH + Ubuntu/RHEL
    │   ├── Keycap.tsx                     # <kbd> bergaya tombol keyboard
    │   ├── ShortcutCard.tsx               # kartu shortcut + tandai hafal
    │   ├── SshAccessPanel.tsx             # "Cara masuk ke server"
    │   ├── TerminalBlock.tsx              # blok $ command + # komentar + copy on hover
    │   ├── CommandExplain.tsx             # pecah command per flag
    │   ├── RunbookView.tsx                # langkah + checklist + progress
    │   ├── RunbookVars.tsx                # variabel global
    │   └── CommandPalette.tsx             # Ctrl/⌘+K (Fase 4)
    ├── data/
    │   ├── index.ts                       # load + validasi + export
    │   ├── level-0.json
    │   ├── level-1.json
    │   ├── level-2.json
    │   └── runbooks/*.json
    ├── hooks/
    │   ├── useProgress.ts                 # item hafal & step selesai (localStorage)
    │   └── useLinuxFilters.ts             # level/env/distro/q ↔ URL
    └── lib/
        ├── schema.ts
        ├── labels.ts
        ├── resolve.ts                     # pilih varian distro + interpolasi {{var}}
        └── exportScript.ts                # runbook → .sh
```

Navbar (`components/layout/Sidebar.tsx`): tambah item setelah **SQL Helper**:

```ts
{ label: "Linux Helper", href: "/linux-helper", icon: SquareTerminal, description: "Shortcut & command server" }
```

Ikon `Terminal` sudah dipakai "SQL Shortcuts", jadi pakai `SquareTerminal` agar tidak tertukar.

---

## 8. Fase Pengerjaan

### Fase 1 — Fondasi & Navbar (0.5–1 hari) ✅ SELESAI 2026-10-20

- [x] Route `app/linux-helper/page.tsx` + `LinuxHelperPage` (Suspense wrapper, header, level stepper, empty state)
- [x] Item navbar "Linux Helper" di `Sidebar.tsx` (ikon `SquareTerminal`, setelah Schema Compare)
- [x] `schema.ts`, `labels.ts`, `data/index.ts` (validasi Zod saat load)
- [x] Skrip `validate:linux-helper` + entri di `package.json`
- [x] `useLinuxFilters` (level, env, distro, q ↔ URL)
- Catatan: data per-level berbentuk objek `{ shortcuts, commands }`; runbook di `data/runbooks/index.json`.
  `ParamSchema` SQL Helper **tidak** di-reuse mentah — dibuat `LinuxParamSchema` dengan tipe tambahan
  `port/ip/cidr/path` (hasil analisis: validasi SQL Helper hanya identifier/number, tak menolak metachar shell).
  Gerbang DoD lolos: `validate:linux-helper`, `type-check`, `lint`, `build`.

### Fase 2 — Level 0 Dasar Terminal (1–1.5 hari) ✅ SELESAI 2026-10-20

- [x] `Keycap` (`<kbd>`, border-b-2, kontras teks foreground/muted)
- [x] `ShortcutCard` + badge Desktop/SSH + note + warning + tandai hafal
- [x] `SshAccessPanel` (contoh `ssh user@host`, port custom, tip Windows Terminal Win+X)
- [x] `TerminalBlock` (prompt `$`, komentar `#` redup, copy on hover & focus-visible)
- [x] `LevelStepper`
- [x] `EnvDistroFilter` (distro disembunyikan di Level 0 via prop `showDistro`)
- [x] Konten `level-0.json` (18 item: 9 shortcut + 9 command dasar)
- Tambahan: `Level0View` (orkestrasi section SSH/shortcut/command + filter env & search).

**REVISI DESAIN (2026-10-20, atas permintaan user) — membatalkan sebagian G3:**
- **Fitur "tandai hafal" DIBATALKAN** → `useProgress.ts` dihapus, tombol di kartu dibuang.
- **Command pakai layout kartu ala SQL Helper** (badge Level/kategori/risk + judul + deskripsi + preview + tombol Copy
  + "View Details" → drawer). Shortcut **tetap** pakai keycap. Komponen: `CommandCard`, `CommandDrawer` (radix Dialog).
- Reuse presentasional `RiskBadge` & `CategoryBadge` dari `@/features/sql-helper/components/Badges` (kopling ringan, dicatat).
- `CommandSchema` ditambah `description` (wajib, dicek validate) + `note` (opsional, tampil di drawer).
- **Pagination** 6 item/halaman (grid 2 kolom) per section (shortcut & command punya halaman sendiri). Komponen
  `Pagination.tsx` (Prev/Next + indikator `n dari m`, muncul hanya bila > 1 halaman). Reset ke hal 1 saat filter/search berubah.
  Gerbang DoD lolos: `validate:linux-helper` (18 item), `type-check`, `lint` (0 isu), `build` (route 9.1 kB).
  File terbesar 112 baris. SQL Helper & `/shortcuts` tidak berubah.

### Fase 3 — Level 1 & 2 Command (1.5–2 hari) ✅ SELESAI 2026-10-20

- [x] Kategori command (`CategoryChips`) + pencarian Fuse.js (`lib/search.ts`)
- [x] Penjelasan per bagian command tampil di drawer (`CommandDrawer`), bukan komponen `CommandExplain` terpisah
- [x] Varian distro (`apt`/`dnf`, `ufw`/`firewalld`, `adduser`/`useradd`) via `lib/resolve.ts` + penanda "Menyesuaikan distro"
- [x] Label risiko + konfirmasi `high` (`RiskBanner` lokal; checkbox gate copy; kartu high-risk paksa buka drawer)
- [x] Highlight `shellscript` via Shiki lazy (`lib/shiki.ts` grammar bash, `ShellHighlight`)
- [x] Konten `level-1.json` (17) & `level-2.json` (22) — total 48 command bersama Level 0
- Komponen baru: `CommandLevelView` (orkestrasi Level 1/2: kategori + Fuse + pagination + drawer).
  Gerbang DoD lolos: `validate` (57 item), `type-check`, `lint` (0 isu), `build` (route 15 kB, Shiki lazy chunk). File terbesar 144 baris.

> **PENTING — konten belum diverifikasi manusia.** Command Level 1–2 (mis. `rm -rf`, `chmod`, `chown`, `kill -9`,
> `ufw`/`firewalld`, `useradd`) perlu direview orang yang paham server sebelum dianggap final (DoD Fase 5).
> `rm -rf` ditandai risk `high`; sisanya `medium`/`low`. Varian RHEL ditulis dari pengetahuan umum, belum diuji di RHEL/Rocky asli.

### Fase 4 — Level 3 Runbook DB (2–3 hari) ✅ SELESAI 2026-10-20

- [x] `RunbookVars` (form variabel global + error validasi per field)
- [x] `RunbookView` + `RunbookStepItem` (checklist langkah, progress bar, verify, common errors, catatan per-step)
- [x] Export runbook ke `.sh` (`lib/exportScript.ts`) dengan header peringatan; tombol disabled bila variabel wajib invalid
- [x] Runbook awal (6): Install PostgreSQL, Install MySQL, Remote access DB, Firewall port DB, Backup & restore, Troubleshoot DB down
- [x] `CommandPalette` `Ctrl/⌘+K` (SELESAI 2026-10-20) — cari cepat lintas shortcut/command/runbook (Fuse), navigasi keyboard, lompat ke level + filter item. Tombol hint ⌘K di samping search.
- Komponen baru: `Level3View`, `RunbookView`, `RunbookStepItem`, `RunbookVars`.
  Lib baru: `validateParam.ts` (whitelist per tipe, anti command-injection), `runbook.ts` (interpolasi + resolve distro), `exportScript.ts`.

**KEAMANAN (implementasi temuan analisis G4):**
- `validateParamValue` memakai WHITELIST per tipe (`identifier/number/port/ip/cidr/path/string`); metachar shell (`;` `|` `&` `` ` `` `$(` `>` `<` spasi) ditolak.
- **Hanya nilai yang lolos validasi** yang di-interpolasi ke command yang ditampilkan/disalin/diekspor; nilai invalid dibiarkan `{{placeholder}}` (tidak pernah jadi command berbahaya).
- Password **bukan** variabel — ditulis sebagai literal `ganti_password_kuat` + catatan; mencegah password ikut ter-interpolasi/ter-escape.
  Gerbang DoD lolos: `validate` (63 item), `type-check`, `lint` (0 isu), `build` (route 20.5 kB). File terbesar 144 baris.

> **PENTING — konten runbook belum diverifikasi manusia.** Semua runbook (install/remote/firewall/backup) dan varian RHEL
> ditulis dari pengetahuan umum, **belum diuji di server asli**. Step destruktif ditandai `high` (pg_hba buka akses, restore DB).
> Review oleh orang yang paham server DB wajib sebelum dipakai produksi (DoD Fase 5).

### Fase 5 — QA & Dokumentasi (1 hari) — SEBAGIAN (QA otomatis 2026-10-20)

QA otomatis & review kode (2026-10-20):
- [x] Dev server boot OK, route `/linux-helper` HTTP 200, compile bersih (1453 modul), 0 warning/error di log server
- [x] Path Shiki (bash + tema github) diverifikasi di node — highlight drawer berfungsi
- [x] Validator anti-injection diuji empiris: 14/14 (identifier/cidr/path/ip/port/string menolak `;` `|` `&` `$(` `` ` `` spasi)
- [x] Audit a11y statis: `<kbd>` semantik, label form (`htmlFor`), aria-label di tombol ikon, `aria-pressed` di toggle,
      Dialog punya Title/Description + focus trap (radix), `motion-safe:` untuk animasi. Kartu command pakai pola
      div-onClick sama seperti SQL Helper (jalur keyboard via tombol judul).

Dokumentasi (2026-10-20):
- [x] `dev-docs/modules/linux-helper/README.md` + entri di `modules/README.md`
- [x] `dev-docs/CHANGELOG.md` (blok [Unreleased] → Added) + laporan task `reports/task/frontend/2026-10-20-linux-helper.md`

Belum (butuh browser / manusia):
- [ ] Uji visual manual desktop + mobile, light + dark, dan **axe runtime** — tidak bisa di environment ini (tanpa headless browser; halaman client-rendered). Perlu dibuka manual.
- [ ] **Review konten command & runbook oleh orang yang paham server** (varian RHEL belum diuji di server asli)
- [ ] `commit-logs/YYYY-MM-DD.md` saat commit (menunggu Human Developer melakukan git commit/push)

---

## 9. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|--------|--------|----------|
| Command salah / beda per distro | User salah konfigurasi server | Varian distro eksplisit, review konten, cantumkan versi distro yang diuji |
| Command destruktif disalin tanpa sadar (`rm -rf`, `iptables -F`, `DROP`) | Data/server rusak | Label risiko, konfirmasi checkbox untuk `high`, peringatan di export `.sh` |
| Interpolasi variabel menghasilkan command berbahaya | Command injection saat di-paste | Validasi variabel per tipe (identifier, port, IP/CIDR, path), tolak `;`, `|`, `` ` ``, `$(` |
| Shortcut berbeda per terminal/desktop | Pemula bingung | Label lingkungan + catatan ("hanya GNOME") |
| Import util lintas feature membuat kopling | Refactor SQL Helper berdampak ke Linux Helper | Import terbatas pada util murni; catat sebagai kandidat ekstraksi ke `src/lib/` |
| Scope creep konten | Jadwal molor | Konten per fase, target jumlah item jelas |

## 10. Definition of Done (per fase)

- [ ] Checklist fase selesai
- [ ] `npm run lint`, `npm run type-check`, `npm run build`, `validate:linux-helper` lulus
- [ ] Uji manual desktop + mobile, light + dark tercatat
- [ ] File < 500 baris, tidak ada `any` baru
- [ ] SQL Helper & `/shortcuts` tidak berubah perilakunya
- [ ] Laporan task + CHANGELOG diperbarui

## 11. Urutan & Estimasi

| Fase | Estimasi | Bergantung pada |
|------|----------|-----------------|
| 1 Fondasi & Navbar | 0.5–1 hari | — |
| 2 Level 0 | 1–1.5 hari | Fase 1 |
| 3 Level 1 & 2 | 1.5–2 hari | Fase 1, 2 (komponen `TerminalBlock`) |
| 4 Runbook DB | 2–3 hari | Fase 3 |
| 5 QA & Dokumen | 1 hari | Fase 2–4 |
| **Total** | **± 6–8.5 hari kerja** | |

Fase 1 + 2 sudah bisa dirilis sendiri sebagai versi awal (Level 0 saja).

## 12. Pertanyaan Terbuka

1. Nama menu final: "Linux Helper" atau "Server Helper"?
2. Distro awal cukup Ubuntu + RHEL, atau perlu Debian/CentOS terpisah?
3. Runbook DB mencakup Docker (PostgreSQL/MySQL via container) di fase ini atau menyusul?
4. Perlu mode "Latihan" (kuis shortcut) atau cukup tandai hafal?
