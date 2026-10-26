# Module: Linux Helper (Client Standalone)

| Item | Value |
|------|-------|
| State | Dalam pengembangan — Level 0–3 fungsional; konten Level 1–3 butuh review |
| Route Prefix | `/linux-helper` |
| Middleware | None (Public Client Standalone) |
| Dependencies | `zod`, `fuse.js`, `shiki`, `@radix-ui/react-dialog`, `lucide-react`, `sonner` |
| Type | Client-Side SPA Component (Zero Backend Dependency) |

## Purpose

Modul **Linux Helper** adalah jalur belajar terminal Linux bertingkat untuk tim yang menyiapkan server
database, tetapi tidak semuanya hafal command Linux. Berbeda dari SQL Helper (katalog skrip), Linux Helper
berupa **level bertingkat** (0–3) dari shortcut keyboard dasar sampai **runbook step-by-step** setup server DB.
Seluruh data dibundel pada build (JSON), jalan 100% di browser tanpa backend.

## Struktur Level

| Level | Nama | Bentuk |
|-------|------|--------|
| 0 | Dasar Terminal | Panel SSH + kartu shortcut keyboard (keycap) + command dasar |
| 1 | Navigasi & File | Kartu command (navigasi, file, teks, arsip) |
| 2 | Sistem & Jaringan | Kartu command (service, log, disk, proses, izin, user, jaringan, firewall) |
| 3 | Runbook Server DB | Runbook step-by-step dengan variabel, verify, error umum, export `.sh` |

## Keamanan (anti command-injection)

Variabel runbook (Level 3) divalidasi **whitelist per tipe** (`identifier/number/port/ip/cidr/path/string`) di
`lib/validateParam.ts`; metacharacter shell (`;` `|` `&` `` ` `` `$(` `>` `<` spasi) ditolak. **Hanya nilai yang
lolos validasi** yang di-interpolasi ke command yang ditampilkan/disalin/diekspor — nilai invalid dibiarkan
`{{placeholder}}`. Password **bukan** variabel (ditulis literal + catatan). Command `high` di Level 1–2 memaksa
buka drawer + konfirmasi checkbox sebelum bisa disalin.

## Quick Links

- Rencana & status pengembangan → [PLAN.md](./PLAN.md)
- Halaman rute → `frontend/src/app/linux-helper/page.tsx`
- Kode fitur → `frontend/src/features/linux-helper/`
- Data konten (JSON) → `frontend/src/features/linux-helper/data/`
- Validasi data → `npm run validate:linux-helper` (`scripts/validate-linux-helper.mjs`)

## Catatan

- Konten command Level 1–2 dan runbook Level 3 (termasuk varian RHEL/Rocky) **belum diuji di server asli** dan
  perlu direview orang yang paham server sebelum dipakai produksi.
- Reuse presentasional dari SQL Helper: `RiskBadge`, `CategoryBadge`, util `copyToClipboard`, `useLocalStorage`.
- `CommandPalette` (Ctrl/⌘+K) tersedia untuk cari cepat lintas item. QA visual/axe di browser masih perlu dilakukan manual.

---

> Mengikuti **Anti-Monster Rule** dan pedoman `ai-rules/modules-template/` — setiap file < 500 baris (terbesar 144).
