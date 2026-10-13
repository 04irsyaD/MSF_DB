# LAPORAN TASK FRONTEND & BACKEND

Tanggal: 2026-10-02
Task: technical-debt-header-refactor-and-pytest-fix
Repo: msf-app
Branch: dev
Commit: (pending)

---

## 1) Deskripsi Perubahan

Menyelesaikan dua item technical debt (Jalur A) yang ditemukan dari sesi analisis:

### A1 — Refactor `Header.tsx` ke ROUTE_MAP Pattern (TD-005)

Sebelumnya `getPageInfo()` menggunakan if-else chain:

```tsx
// BEFORE — tidak scalable, setiap rute baru butuh tambah if-else
const getPageInfo = () => {
  if (pathname.startsWith("/dashboard")) return { title: "Dashboard", ... };
  if (pathname.startsWith("/sql-helper")) return { title: "SQL Helper", ... };
  if (pathname.startsWith("/diagram"))   return { title: "MSF Diagram", ... };
  // ...dst
};
```

Setelah refactor menggunakan konstanta `ROUTE_MAP` array + pure function:

```tsx
// AFTER — tambah rute baru = satu baris di ROUTE_MAP, logika tidak berubah
const ROUTE_MAP: Array<{ prefix: string; info: PageInfo }> = [
  { prefix: "/dashboard",  info: { title: "Dashboard",    ..., icon: LayoutDashboard } },
  { prefix: "/sql-helper", info: { title: "SQL Helper",   ..., icon: Database        } },
  { prefix: "/diagram",    info: { title: "MSF Diagram",  ..., icon: Layers          } },
  // ...dst
];

const getPageInfo = (pathname: string): PageInfo =>
  ROUTE_MAP.find(({ prefix }) => pathname.startsWith(prefix))?.info ?? DEFAULT_PAGE;
```

Keuntungan tambahan:
- Interface `PageInfo` eksplisit → TypeScript type-safe penuh
- `DEFAULT_PAGE` diekstrak sebagai konstanta terpisah
- `getPageInfo` sekarang pure function (menerima pathname sebagai arg, tidak capture dari closure)

### A2 — Fix `conftest.py` Deprecated `event_loop` Fixture (TD-004)

`pytest.ini` sudah memiliki `asyncio_mode = auto` sejak awal, tapi `conftest.py` masih mendefinisikan `event_loop` fixture custom secara manual. Ini menyebabkan `DeprecationWarning` dari `pytest-asyncio >= 0.21` karena fixture tersebut redundant dan berkonflik.

```python
# BEFORE — menyebabkan DeprecationWarning
@pytest.fixture(scope="session")
def event_loop():
    """Create event loop untuk async tests."""
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    yield loop
    loop.close()
```

```python
# AFTER — dihapus sepenuhnya, asyncio_mode=auto di pytest.ini sudah menangani ini
# (tidak ada fixture event_loop, import asyncio juga dihapus)
```

---

## 2) Tujuan dan Manfaat

- **Scalability (`Header.tsx`):** Developer (atau AI) yang ingin menambah halaman baru cukup menambah satu entry di `ROUTE_MAP` tanpa memahami logika if-else sebelumnya.
- **Type Safety:** Interface `PageInfo` eksplisit mencegah typo pada key `title`, `desc`, `icon`.
- **Bersih dari Warning (`conftest.py`):** Menghapus `DeprecationWarning` pytest-asyncio yang muncul setiap kali `pytest` dijalankan, sehingga output test lebih bersih dan sinyal warning yang genuine tidak tenggelam.

---

## 3) Daftar File yang Diubah

- `frontend/src/components/layout/Header.tsx` [MODIFY]
- `backend/conftest.py` [MODIFY]
- `TODO.md` [MODIFY]
- `dev-docs/ai/TECHNICAL_DEBT.md` [MODIFY]
- `reports/task/frontend/2026-10-02-technical-debt-header-and-pytest.md` [NEW]

---

## 4) Verifikasi

| # | Pengujian | Ekspektasi | Hasil |
|---|-----------|------------|-------|
| 1 | Buka `/dashboard` | Header tampil "Dashboard" + icon LayoutDashboard | PASS |
| 2 | Buka `/sql-helper` | Header tampil "SQL Helper" + icon Database | PASS |
| 3 | Buka `/diagram` | Header tampil "MSF Diagram" + icon Layers | PASS |
| 4 | Buka `/admin` | Header tampil "Admin Portal" + icon ShieldAlert | PASS |
| 5 | Buka `/generate` (default) | Header tampil "AI Generator" + icon Sparkles | PASS |
| 6 | TypeScript check | `npx tsc --noEmit` → 0 error | PASS |
| 7 | pytest jalan | 32 passed, 0 DeprecationWarning terkait event_loop | PASS |
| 8 | Anti-Monster Rule | `Header.tsx` = 78 baris (< 500) | PASS |
| 9 | Git Push Ban | Tidak ada `git push` dijalankan | PASS |

---

## 5) Catatan untuk Developer

- `ROUTE_MAP` menggunakan `Array<{ prefix, info }>` bukan `Record<string, PageInfo>` — ini disengaja agar urutan matching bisa dikontrol (gunakan array `.find()` bukan object key lookup yang tidak berurutan).
- Jika ada rute yang overlap prefix (misal `/sql` dan `/sql-helper`), pastikan yang lebih spesifik diletakkan lebih dahulu di array.
