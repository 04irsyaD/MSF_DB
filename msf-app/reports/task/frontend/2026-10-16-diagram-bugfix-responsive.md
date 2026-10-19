# LAPORAN TASK FRONTEND + BACKEND

Tanggal: 2026-10-16
Task: MSF Diagram — bugfix layout, viewport, fullscreen, dan parser DDL (T-034 s/d T-039)
Repo: MSF_DB (`msf-app/`)
Branch: `feat/diagram-fix` (dari `dev`)
Commit: belum commit (menunggu QA manual developer)
Dikerjakan oleh: Claude Opus 5.5

1) Deskripsi Perubahan

Perbaikan seluruh bug di [PLAN.md](../../../dev-docs/modules/diagram-canvas/PLAN.md) (D-01 s/d D-12, C-01 s/d C-21, P-01 s/d P-08) plus fitur fullscreen:

- **Halaman `/diagram`:** tombol Rerender/Tarik Skema jadi footer tetap di luar area scroll (tidak lagi menumpuk textarea); tinggi halaman `lg` sesuai header + padding nyata; di bawah `lg` halaman scroll biasa dengan tinggi minimum per pane; select template terkontrol + konfirmasi sebelum menimpa kode; penjaga race request; draft DDL tersimpan di `sessionStorage`; petunjuk saat dialek berubah; tipografi minimal 11px/12px; emoji di nama template dihapus.
- **Kanvas:** `DiagramCanvas.tsx` (890 baris) dipecah menjadi 5 komponen/hook + 3 modul logika murni. Kanvas mengikuti tinggi parent; Fit memakai ukuran asli (`ResizeObserver`) dan memperhitungkan toolbar; Fit dipicu oleh data/layout baru (bukan jumlah tabel); zoom berporos (tombol = tengah, Ctrl+scroll = kursor); drag dibagi zoom; Pointer Events untuk mouse, touch, dan pinch; SVG relasi mengikuti bounding box (tidak terpotong); layout deterministik dengan level DAG yang benar dan pemisah kartu bertumpuk; panah selalu menghadap tabel tujuan; kunci tabel `schema.nama`; ekspor PNG ikut tema dan tanpa efek hover.
- **Fullscreen:** tombol baru di toolbar, overlay via portal ke `body` (karena animasi `fade-in-up` meninggalkan `transform` yang merusak `position: fixed`), Esc bertahap bersama modal Mermaid, kunci scroll body, focus trap.
- **Mermaid:** dedup relasi per tabel + kolom; nama entitas disanitasi; clipboard dengan fallback dan toast error.
- **MaintenanceModal:** badge ringkas (ikon, teks saat hover/fokus), `backdrop-blur-xs` diganti class v3 yang valid, akses `sessionStorage` dibungkus `try/catch`, warning `exhaustive-deps` diperbaiki.
- **Parser DDL (backend):** ditulis ulang. Tipe dicocokkan di awal definisi setelah nama kolom (dengan batas kata, alternatif terpanjang dulu, tipe tak dikenal dikembalikan apa adanya); dukungan `ALTER TABLE ... ADD [CONSTRAINT] PRIMARY KEY/FOREIGN KEY/UNIQUE` (gaya pg_dump), identifier `[x]`/`` `x` ``/`"x"`, `CREATE TEMPORARY/UNLOGGED/GLOBAL TEMPORARY TABLE`, `CONSTRAINT ... UNIQUE`, schema dari prefix dengan default per dialek; penghapus komentar dan penghitung kurung sadar string literal.

1) Tujuan dan Manfaat

- Diagram tidak lagi terpotong dan tombol tidak menumpuk di laptop layar kecil (1366x666).
- Fit selalu menampilkan seluruh diagram; zoom/drag terasa natural; bisa dipakai di HP/tablet.
- Mode fullscreen untuk layar kecil.
- Data diagram benar: tipe kolom sesuai DDL, relasi dari dump `pg_dump`/MySQL Workbench tergambar. Parser yang sama dipakai generate dokumentasi AI, jadi kualitas dokumen ikut naik.
- Kode diagram bisa dites otomatis (11 unit test + 16 regression test parser).

1) Daftar File yang Diubah

Backend:

- `backend/app/services/sql_parser.py` (ditulis ulang)
- `backend/tests/test_sql_parser.py` (+16 test)

Frontend:

- `frontend/src/app/diagram/page.tsx`
- `frontend/src/app/diagram/templates.ts` (hapus emoji di nama)
- `frontend/src/components/diagram/DiagramCanvas.tsx` (ditulis ulang)
- `frontend/src/components/diagram/DiagramToolbar.tsx` (baru)
- `frontend/src/components/diagram/TableCard.tsx` (baru)
- `frontend/src/components/diagram/RelationLines.tsx` (baru)
- `frontend/src/components/diagram/useCanvasViewport.ts` (baru)
- `frontend/src/components/diagram/MermaidExportModal.tsx`
- `frontend/src/components/common/MaintenanceModal.tsx`
- `frontend/src/lib/diagram/constants.ts`, `geometry.ts`, `layouts.ts` (baru)
- `frontend/src/lib/mermaidGenerator.ts`
- `frontend/scripts/test-diagram.mjs`, `frontend/scripts/fixtures/diagram-templates.json` (baru)
- `frontend/package.json` (script `test:diagram`), `frontend/tsconfig.json` (`allowImportingTsExtensions`)

Dokumentasi: `dev-docs/ai/CODING_RULES.md` (baru), `dev-docs/modules/diagram-canvas/*` (baru), `dev-docs/ai/{TASKS,KNOWN_ISSUES,START_HERE}.md`, `.agents/AGENTS.md`.

1) Snapshot Kode (Before → After)

4.1 Deteksi tipe kolom (akar bug `showtime_id INT` tampil `time`)

File: `backend/app/services/sql_parser.py`

Before:

```python
type_match = cls.DATA_TYPE_PATTERN.search(line)   # mencari di seluruh baris, termasuk nama kolom
# DATA_TYPE_PATTERN: (...|DATE|TIME|TIMESTAMP|DATETIME|...) tanpa \b
```

After:

```python
m = re.match(rf"({IDENT})\s*(.*)$", line, re.DOTALL)   # pisahkan nama kolom dulu
data_type = cls._parse_type(m.group(2))                 # cocokkan tipe di AWAL sisa definisi
```

4.2 Tinggi kanvas dan Fit

File: `frontend/src/components/diagram/DiagramCanvas.tsx`, `useCanvasViewport.ts`, `lib/diagram/geometry.ts`

Before:

```tsx
<div className="relative w-full h-[600px] ... overflow-hidden">
const containerHeight = containerRef.current.clientHeight; // selalu 600
```

After:

```tsx
<div className="relative flex-1 min-h-0 w-full">           // ikut tinggi parent
const observer = new ResizeObserver(update);              // ukuran asli
setView(fitViewport(box, size.width, size.height, undefined, toolbarInset(container)));
```

4.3 Tombol menumpuk textarea

File: `frontend/src/app/diagram/page.tsx`

Before:

```tsx
<div className="flex-1 overflow-y-auto ...">
  <div className="h-full flex flex-col ...">
    <textarea className="flex-1 ... min-h-[250px]" />
    <button>Rerender Diagram</button>
```

After:

```tsx
<div className="flex-1 min-h-0 overflow-y-auto ...">   // hanya form yang di-scroll
  <textarea className="flex-1 min-h-[150px] ..." />
</div>
<div className="shrink-0 border-t ..."><button>Rerender Diagram</button></div>   // footer tetap
```

1) Verifikasi UAT (User Acceptance Test)

| # | Tes | Hasil | Detail |
|---|-----|-------|--------|
| 1 | `npm run lint` | ✅ | 0 warning di file yang disentuh; 2 warning lama di file lain |
| 2 | `npm run type-check`, `npm run build` | ✅ | |
| 3 | `npm run test:diagram` | ✅ | 11/11 (10 template x 7 layout tanpa kartu bertumpuk, siklus, self-reference, Fit, zoom berporos) |
| 4 | `npm run test:sql-helper` (regresi) | ✅ | 7/7 |
| 5 | `pytest` backend | ✅ | 53/53, termasuk 16 regression test parser (15 gagal di parser lama) |
| 6 | QA browser Chrome, 60 cek DOM | ✅ 59 / ❌ 1 | satu-satunya gagal: `404 /favicon.ico` di seluruh aplikasi (I-012, di luar scope) |
| 7 | Tombol tidak menumpuk di 6 viewport (1366x666 s/d 390x844) | ✅ | jarak textarea-tombol 29px |
| 8 | Halaman tidak scroll di 1366x666 | ✅ | sempat gagal (overflow 22px) karena `min-h-[560px]`, diturunkan ke 480px |
| 9 | Fit di 10 template x 7 layout, kartu tidak tertutup toolbar | ✅ | sempat gagal di fullscreen (kartu di bawah toolbar), Fit kini mengukur toolbar |
| 10 | Template 8 tabel -> template 8 tabel lain di-fit | ✅ | bug C-03 |
| 11 | Drag tabel di zoom 33% dan 47% menempel kursor | ✅ | selisih < 2px |
| 12 | Geser kanvas dengan jari (390x844), halaman tidak ikut scroll | ✅ | |
| 13 | Fullscreen: ukuran penuh, Fit, fokus, kunci scroll, Esc bertahap dengan modal Mermaid | ✅ | |
| 14 | PNG dark: latar gelap solid | ✅ | sempat gagal (transparan alpha 102), kini komposit latar |
| 15 | Tipe kolom template Bioskop | ✅ | `showtime_id int`, `booking_date timestamp` |
| 16 | FK dari `ALTER TABLE` tergambar lewat UI | ✅ | |
| 17 | Draft DDL pulih setelah pindah halaman; template terakhir menang saat dipilih cepat | ✅ | |
| 18 | Browser zoom 125%/150% (emulasi) | ✅ | sempat jelek di 125%: panel kiri 245px, tab pecah 2 baris -> split dipindah ke breakpoint `xl` |
| 19 | Chrome 155 / Edge 155 / Firefox 130 (72 cek QA browser) | ✅ | 71/72, 71/72, 70/70; gagal hanya favicon (I-012). Touch Firefox tidak dites |
| 20 | Ekspor PNG di Firefox | ✅ | sempat gagal (bug lama: embed font `html-to-image` crash di Firefox) -> fallback `skipFonts` |
| 21 | Live DB Connector | belum dites | ditunda sampai Supabase siap |

Catatan untuk developer:

- Belum di-commit dan **AI tidak melakukan push**. Sisa uji: Live DB Connector (baris 21). Isi Gate Push di QA_CHECKLIST.
- `.next` saat ini berisi build produksi dari verifikasi; `npm run dev` akan membangun ulang otomatis.
- Usulan README (rule AGENTS #8): tambah baris di `frontend/README.md` bagian scripts: `npm run test:diagram` — unit test layout & geometri diagram. Belum diterapkan, menunggu persetujuan.
