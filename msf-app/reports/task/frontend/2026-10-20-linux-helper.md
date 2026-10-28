# LAPORAN TASK FRONTEND

Tanggal: 2026-10-20
Task: linux-helper (modul baru, Level 0–3)
Repo: msf-app
Branch: dev
Commit: (belum di-commit — menunggu Human Developer; sesuai AGENTS.md, AI tidak melakukan git push)

---

## 1) Deskripsi Perubahan

Menambahkan modul baru **Linux Helper** (`/linux-helper`) — jalur belajar terminal Linux bertingkat (Level 0–3)
untuk tim yang menyiapkan server database tetapi belum hafal command Linux. Arsitektur **client standalone**
(data JSON dibundel saat build, 100% jalan di browser, zero backend). Dikerjakan dari `dev-docs/modules/linux-helper/PLAN.md`.

Fitur per fase:
1. **Fondasi & Navbar (Fase 1):** route + Suspense wrapper, schema Zod, labels terpusat, loader data (validasi saat load), hook filter (level/env/distro/q ↔ URL), item navbar "Linux Helper" (ikon `SquareTerminal`), skrip `npm run validate:linux-helper`.
2. **Level 0 Dasar Terminal (Fase 2):** panel SSH, kartu shortcut keyboard bergaya `<kbd>` (`Keycap`), command dasar, filter Desktop/SSH, pagination 6/halaman. (Atas permintaan user: fitur "tandai hafal" dibatalkan; command memakai layout kartu ala SQL Helper + drawer.)
3. **Level 1 & 2 Command (Fase 3):** 48 command (navigasi/file/teks/arsip, service/log/disk/proses/izin/user/jaringan/firewall), filter kategori (`CategoryChips`), pencarian fuzzy Fuse.js, varian per distro (`resolve.ts`), label risiko + konfirmasi `high`, highlight Shiki bash (lazy).
4. **Level 3 Runbook DB (Fase 4):** 6 runbook (install PostgreSQL/MySQL, remote access, firewall port DB, backup & restore, troubleshoot DB down) dengan form variabel, checklist + progress, `verify`, error umum, export `.sh`.

## 2) Tujuan dan Manfaat

- **Bantu setup server DB:** dari shortcut dasar sampai runbook install/backup/firewall, tanpa harus hafal command.
- **Keamanan (anti command-injection):** variabel runbook divalidasi whitelist per tipe (`identifier/number/port/ip/cidr/path/string`); metachar shell ditolak; hanya nilai valid yang di-interpolasi (invalid tetap `{{placeholder}}`); password bukan variabel; command `high` wajib konfirmasi sebelum salin.
- **Zero regression:** SQL Helper dan `/shortcuts` tidak diubah. Reuse presentasional (`RiskBadge`, `CategoryBadge`) + util murni (`copyToClipboard`, `useLocalStorage`) lewat import.
- **Identitas sendiri + konsisten:** keycap & runbook punya identitas sendiri, sementara kartu command mengikuti gaya SQL Helper (atas permintaan user).

## 3) Daftar File yang Dibuat & Diubah

Route & skrip:
- `frontend/src/app/linux-helper/page.tsx` [NEW]
- `frontend/scripts/validate-linux-helper.mjs` [NEW]
- `frontend/package.json` [MODIFY] (script `validate:linux-helper`)
- `frontend/src/components/layout/Sidebar.tsx` [MODIFY] (navbar item + ikon `SquareTerminal`)

`frontend/src/features/linux-helper/`:
- `lib/`: `schema.ts`, `labels.ts`, `resolve.ts`, `search.ts`, `shiki.ts`, `validateParam.ts`, `runbook.ts`, `exportScript.ts` [NEW]
- `data/`: `index.ts`, `level-0.json`, `level-1.json`, `level-2.json`, `runbooks/index.json` [NEW]
- `hooks/`: `useLinuxFilters.ts` [NEW]
- `components/`: `LinuxHelperPage.tsx`, `LevelStepper.tsx`, `EnvDistroFilter.tsx`, `CategoryChips.tsx`, `Keycap.tsx`, `TerminalBlock.tsx`, `ShortcutCard.tsx`, `SshAccessPanel.tsx`, `CommandCard.tsx`, `CommandDrawer.tsx`, `ShellHighlight.tsx`, `RiskBanner.tsx`, `Level0View.tsx`, `CommandLevelView.tsx`, `Level3View.tsx`, `RunbookView.tsx`, `RunbookStepItem.tsx`, `RunbookVars.tsx`, `Pagination.tsx`, `CommandPalette.tsx` [NEW]
- `hooks/useProgress.ts` [DELETED] (dibuat di Fase 2, dibatalkan atas permintaan user)

Dokumentasi:
- `dev-docs/modules/linux-helper/README.md` [NEW]
- `dev-docs/modules/linux-helper/PLAN.md` [MODIFY] (status Fase 1–5)
- `dev-docs/modules/README.md` [MODIFY] (entri modul)
- `dev-docs/CHANGELOG.md` [MODIFY]
- `msf-app/SESSION_NOTES.md` [MODIFY] (handoff)

## 4) Verifikasi (QA otomatis & review kode, 2026-10-20)

| # | Skenario | Hasil | Detail |
|---|----------|:-----:|--------|
| 1 | `npm run validate:linux-helper` | ✅ | 63 item (9 shortcut + 48 command + 6 runbook), unik & konsisten |
| 2 | `npm run type-check` | ✅ | 0 error |
| 3 | `npm run lint` | ✅ | 0 isu di linux-helper (warning tersisa di file lama) |
| 4 | `npm run build` | ✅ | route `/linux-helper` ter-build (20.5 kB; Shiki lazy chunk) |
| 5 | Dev server + route | ✅ | HTTP 200, compile bersih (1453 modul), 0 warning/error di log server |
| 6 | Path Shiki (bash + tema) | ✅ | diverifikasi di node (`codeToHtml` menghasilkan `<pre>`) |
| 7 | Validator anti-injection | ✅ | 14/14 — input jahat (`;` `\|` `&` `$(` `` ` `` spasi) ditolak, valid diterima |
| 8 | Ukuran file (< 500 baris) | ✅ | Terbesar 144 baris |
| 9 | Zero regression SQL Helper / `/shortcuts` | ✅ | Tidak ada file kedua modul itu yang diubah |
| 10 | Larangan git push | ✅ | Tidak ada `git push`/`git commit` dijalankan |

## 5) Belum Selesai / Tindak Lanjut

- **Review konten manusia:** command Level 1–2 (`rm -rf`, `chmod`, `chown`, `kill`, `ufw`/`firewalld`, `useradd`) dan 6 runbook, khususnya **varian RHEL/Rocky** yang belum diuji di server asli.
- **QA visual + axe runtime:** belum bisa di environment ini (tanpa headless browser; halaman client-rendered). Perlu dibuka manual di browser.
- **Commit/push:** menunggu Human Developer (AI tidak push). Draft commit log untuk `commit-logs/2026-10-20.md` saat commit.

Catatan: `CommandPalette` (Ctrl/⌘+K) sudah selesai (tidak lagi ditunda).
