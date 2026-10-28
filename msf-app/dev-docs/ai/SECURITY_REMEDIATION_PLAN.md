# SECURITY_REMEDIATION_PLAN.md — Rencana Perbaikan Keamanan Backend

> **Status:** OUTPUT FILE — Rencana kerja. Dibuat 2026-10-16 dari hasil audit backend (ai-rules security, OWASP Top 10, coding standards).
> **Task tracker:** `dev-docs/ai/TASKS.md` (T-021 s/d T-033).
> **Aturan kerja:** 1 batch = 1 commit di branch `dev`. Push dilakukan manual oleh developer (AGENTS.md). Backend auto-deploy di Render dari `dev`, jadi setiap push langsung live.

---

## 1. Ringkasan Temuan

| # | Temuan | Severity | OWASP | Batch |
|---|--------|----------|-------|-------|
| 1 | SSRF lewat export PDF (xhtml2pdf fetch `<img>`/`<link>`) — terbukti via PoC lokal | Critical | A10 | 1 |
| 2 | SSRF lewat koneksi DB (`host`/`connection_string` bebas) + SQLite path bebas (bisa membuat file di server) — terbukti via PoC lokal | Critical | A10, A01 | 2 |
| 3 | `connection_string` (berisi password) dan SQL penuh tercatat di log, log bisa dibaca via `/api/admin/logs` | Critical | A09, A02 | 3 |
| 4 | 48 kerentanan di 7 package (starlette, python-multipart, cryptography, markdown, anyio, python-dotenv, pytest) | High | A06 | 4 |
| 5 | Export/parser sinkron di dalam `async def` + payload tanpa batas ukuran membekukan seluruh server | High | A04 | 5 |
| 6 | Semua endpoint publik tanpa auth/rate limit, kredit AI (DeepSeek) bisa dihabiskan orang lain, satu user bisa memblokir antrean global | High | A01, A04 | 6, 7 |
| 7 | Security headers tidak ada, `/docs` + `/openapi.json` terbuka di produksi | Medium | A05 | 8 |
| 8 | Passcode/API key dibandingkan dengan `!=`, tanpa batas percobaan login admin | Medium | A07 | 9 |
| 9 | `str(e)` dikirim ke client di banyak endpoint | Medium | A05 | 10 |
| 10 | `data/msf_jobs.db` ter-track di git, `.env.example` tanpa `ADMIN_PASSCODE`, default `admin123` di docker-compose | Medium | A05 | 0 |
| 11 | Kode akses job 40-bit tanpa rate limit, cleanup tidak menghapus baris SQLite | Medium | A01 | 11 |
| 12 | Coding standards: `schemas.py` 352 baris (> 300), dead code SQL f-string, duplikasi, `except: pass` | Low | — | 12 |

---

## 2. Urutan Batch

Urutan disusun berdasarkan severity dan dependensi. Batch 0–3 dikerjakan dulu karena celahnya sudah live.

### Batch 0 — Housekeeping (T-021)

**File:** `.gitignore`, `.env.example`, `docker-compose.yml`

- `git rm --cached data/msf_jobs.db`, tambah `data/*.db` dan `*.db-journal` ke `.gitignore`.
- `.env.example`: tambah placeholder `ADMIN_PASSCODE=`, plus variabel baru dari batch berikutnya (ditambah bertahap di batch masing-masing).
- `docker-compose.yml`: ganti `ADMIN_PASSCODE=${ADMIN_PASSCODE:-admin123}` menjadi `${ADMIN_PASSCODE:-}` (admin nonaktif kalau tidak di-set). Sama untuk `SECRET_KEY` default.

**Selesai jika:** `git ls-files | grep '\.db$'` kosong, compose tidak punya passcode default.

---

### Batch 1 — SSRF di PDF exporter (T-022) — Critical

**File:** `backend/app/services/exporters/pdf_exporter.py`, `backend/tests/test_pdf_exporter.py` (baru)

1. Matikan HTML mentah di Markdown: buat instance `markdown.Markdown(...)`, lalu `md.preprocessors.deregister("html_block")` dan `md.inlinePatterns.deregister("html")`, sehingga tag HTML ikut ter-escape sebagai teks.
2. Tambah `link_callback` di `pisa.CreatePDF(...)` yang **menolak semua resource eksternal** (`http`, `https`, `file`, `data`, path relatif) dengan mengembalikan string kosong. Ini juga menutup sintaks gambar Markdown `![x](http://...)` yang tetap menghasilkan `<img>`.
3. Jalankan export di thread (lihat Batch 5) — boleh digabung di sini kalau mudah.

**Test:**
- Markdown berisi `<img src="http://127.0.0.1:PORT/x">`, `<link href=...>`, dan `![x](http://127.0.0.1:PORT/y)` → server HTTP lokal di test menerima **0 request**.
- Markdown normal (heading, tabel, code block) tetap menghasilkan PDF valid (`%PDF` di awal bytes).

**Selesai jika:** PoC dari audit (`poc.py`) melaporkan `SSRF hits: []`.

---

### Batch 2 — SSRF koneksi DB + SQLite (T-023) — Critical

**File:** `backend/app/services/db_connector.py`, `backend/app/services/db_url_guard.py` (baru), `backend/app/models/schemas.py`, `frontend/src/components/generator/DbConnector.tsx`, test baru `backend/tests/test_db_url_guard.py`

**Keputusan desain:**
- **SQLite dinonaktifkan untuk koneksi live** di backend yang di-hosting. "File lokal" berarti file di server, bukan di laptop user, jadi fiturnya memang tidak bermakna di produksi. Dikontrol env `ALLOW_SQLITE_CONNECTION` (default `false`, set `true` hanya di dev lokal). Mode DDL dengan dialek SQLite **tetap jalan** (tidak terpengaruh).
- **Host privat diblokir** di produksi. Dikontrol env `ALLOW_PRIVATE_DB_HOSTS` (default `false`; `true` di docker-compose lokal karena DB-nya pakai hostname `postgres`).

**Langkah:**
1. Modul `db_url_guard.py` berisi `validate_connection(conn) -> URL`:
   - Kalau `connection_string` diisi: parse dengan `sqlalchemy.engine.make_url`. Tolak kalau gagal parse.
   - Whitelist driver per engine: `postgresql`/`postgresql+psycopg2`, `mysql+pymysql`, `sqlite` (hanya kalau diizinkan). Driver harus cocok dengan `conn.engine`.
   - Whitelist query param: hanya `sslmode`, `charset`, `connect_timeout`. Param lain (mis. `sslrootcert`, `passfile`, `options`, `service`, `init_command`) ditolak supaya tidak bisa membaca file server atau menjalankan perintah saat connect.
   - Resolve host (`socket.getaddrinfo`), tolak kalau **salah satu** IP `is_private`, `is_loopback`, `is_link_local`, `is_reserved`, `is_multicast`, atau `is_unspecified` (IPv4 dan IPv6, termasuk IPv4-mapped).
   - Anti DNS-rebinding: konek ke IP hasil resolve, bukan hostname (Postgres via `connect_args={"hostaddr": ip}`; MySQL dengan host diganti IP).
2. `build_connection_url` dan `get_metadata_sync` memakai hasil `validate_connection`. `get_metadata_sync` juga diberi `connect_args` timeout (sekarang tidak ada).
3. Pesan error koneksi dipetakan ke kategori umum (`AUTH_FAILED`, `HOST_UNREACHABLE`, `TIMEOUT`, `DB_NOT_FOUND`, `HOST_NOT_ALLOWED`) supaya tidak bisa dipakai untuk port scanning. Detail mentah hanya masuk log.
4. Frontend `DbConnector.tsx`: sembunyikan opsi "SQLite (Local File)" kecuali backend mengizinkan (tambah field `sqlite_connection_enabled` di respons `/api/health` atau endpoint config kecil), dan tampilkan pesan error kategori dengan bahasa yang jelas.

**Test:** `127.0.0.1`, `localhost`, `10.x`, `169.254.169.254`, `[::1]`, `0.0.0.0`, hostname yang resolve ke IP privat, `sqlite:///` saat dinonaktifkan, driver tidak cocok, param `sslrootcert` → semua ditolak. Host publik valid → lolos validasi (tanpa konek sungguhan, `getaddrinfo` di-mock).

---

### Batch 3 — Redaksi log (T-024) — Critical

**File:** `backend/app/utils/redact.py` (baru), `backend/app/routers/generate.py`, `backend/app/utils/logger.py`

1. Helper `redact_connection(dict)` yang menyamarkan `password` dan password di dalam `connection_string` (pakai `make_url(...).render_as_string(hide_password=True)`).
2. Log request generate hanya berisi **metadata**: panjang SQL, jumlah tabel, provider, model, format. Tidak lagi mencatat `sql_content`, `business_context`, atau response berisi `access_code`.
3. Tambah processor structlog global yang menyamarkan key sensitif (`password`, `connection_string`, `api_key`, `authorization`, `x-admin-passcode`) sebagai jaring pengaman.

**Tindakan manual setelah deploy:** kalau pernah tes koneksi ke DB sungguhan lewat backend Render, **ganti password DB tersebut**, karena password itu mungkin sudah tercatat di log Render.

**Test:** log hasil `generate_from_db` dengan `connection_string` berisi password → string password tidak muncul di output log.

---

### Batch 4 — Upgrade dependency (T-025) — High

**File:** `backend/requirements.txt`, `backend/requirements-dev.txt` (baru), `backend/Dockerfile`

1. Upgrade `fastapi` ke versi terbaru yang menarik `starlette` tanpa CVE, lalu `python-multipart`, `cryptography`, `markdown`, `anyio`, `python-dotenv` ke versi perbaikan (lihat output pip-audit).
2. Pindahkan `pytest`, `pytest-asyncio`, `pytest-cov`, `ruff` ke `requirements-dev.txt` supaya tidak ikut ke image produksi. Hapus duplikasi baris `httpx`.
3. Dockerfile: jadikan multi-stage (build dengan `gcc`, runtime tanpa `gcc`) — opsional, kalau tidak menambah risiko build di Render.
4. Tambah langkah `pip-audit -r requirements.txt` ke `.github/workflows/` (CI) supaya ketahuan lebih awal.

**Selesai jika:** `pip-audit` bersih, 32+ test lolos, server bisa start dan `/health` 200 secara lokal.

**Risiko:** upgrade FastAPI/Starlette bisa mengubah perilaku middleware (`BaseHTTPMiddleware`) atau exception handler. Wajib jalankan seluruh test + cek manual endpoint utama sebelum push.

---

### Batch 5 — Anti-DoS: event loop & batas ukuran (T-026) — High

**File:** `backend/app/routers/export.py`, `backend/app/routers/generate.py`, `backend/app/models/schemas.py`

1. Bungkus `PdfExporter.export`, `DocxExporter.export`, `SQLParser.parse`, dan `SQLParser.validate_sql` dengan `await asyncio.to_thread(...)`.
2. Batas ukuran input:
   - `ExportRequest.markdown_content`: `max_length=1_000_000`; `author`: `max_length=100`.
   - `ParseDDLRequest.sql_content`: `max_length=500_000`; `dialect`: enum/Literal, bukan string bebas.
   - `GenerateSettings.model`: `max_length=100`.
   - `GenerateFromDBRequest.table_filter`: maksimal 200 item.
3. Batas body request global (mis. 2 MB) via middleware yang mengecek `Content-Length`.

**Test:** payload melebihi batas → 422. Export PDF besar tidak memblokir `/health` (request paralel tetap dijawab).

---

### Batch 6 — Autentikasi server-to-server (T-027) — High

**Masalah:** `MSF_API_KEY` sengaja dikosongkan karena kalau dipakai, frontend harus mengirim `NEXT_PUBLIC_MSF_API_KEY` yang terlihat di browser.

**Solusi:** key disuntikkan **di server Vercel**, bukan di browser.

**File:** `frontend/src/middleware.ts` (baru), `frontend/src/lib/api.ts`, `frontend/src/app/admin/page.tsx`, `backend/app/main.py`

1. Next.js middleware untuk matcher `/api/:path*` menambahkan header `X-API-Key: process.env.MSF_API_KEY` (env server-only, tanpa prefix `NEXT_PUBLIC_`) via `NextResponse.next({ request: { headers } })`, sehingga ikut terkirim saat rewrite ke backend.
2. Hapus pemakaian `NEXT_PUBLIC_MSF_API_KEY` di `api.ts`.
3. Perbaiki `admin/page.tsx` yang masih hardcode `http://localhost:3001/api/admin/...` menjadi path relatif `/api/admin/...` (sekarang halaman admin tidak bisa jalan di produksi).
4. Backend: pembandingan API key memakai `secrets.compare_digest`. `/health` tetap publik (dipakai health check Render).

**Urutan deploy (penting, supaya tidak downtime):**
1. Set `MSF_API_KEY` (nilai acak panjang) di Vercel → deploy frontend dulu. Backend belum mengecek, jadi header ekstra tidak berpengaruh.
2. Set `MSF_API_KEY` yang sama di Render → backend restart dan mulai menolak request tanpa key.
3. Cek `https://msf-db-backend.onrender.com/api/stats` langsung → harus 401; lewat `https://msf-db.my.id/api/stats` → 200.

---

### Batch 7 — Rate limit & batas biaya AI (T-028) — High

**File:** `backend/app/utils/rate_limit.py` (baru), `backend/app/routers/generate.py`, `backend/app/routers/ai.py`, `backend/app/services/doc_generator.py`

1. Rate limiter in-memory sederhana (sliding window per key), cukup karena backend 1 worker. Alternatif: library `slowapi`.
2. Identitas client: setelah Batch 6, request sah selalu lewat Vercel, jadi IP asli dibaca dari header `X-Forwarded-For` (entri paling kiri) — **hanya** dipercaya kalau request membawa API key yang valid. Uvicorn dijalankan dengan `--proxy-headers`.
3. Batas awal (bisa diatur via env):
   - `POST /api/generate/*`: 5 per jam per IP.
   - `POST /api/ai/test`: 10 per jam per IP.
   - `POST /api/db/*`: 20 per 10 menit per IP.
   - `POST /api/export/*`: 30 per 10 menit per IP.
   - Lain-lain: 120 per menit per IP.
4. Batas biaya AI:
   - Whitelist `model` per provider (dari `list_models()`); model di luar daftar ditolak 422.
   - Kuota global harian `MAX_AI_JOBS_PER_DAY` (mis. 50) untuk provider berbayar.
5. Batas job aktif **per IP** (mis. 1) selain batas global, supaya satu orang tidak bisa memblokir antrean untuk semua user.

**Test:** request ke-6 generate dalam satu jam → 429; model tidak dikenal → 422.

---

### Batch 8 — Security headers & docs (T-029) — Medium

**File:** `backend/app/main.py`, `backend/app/middleware/security_headers.py` (baru)

1. Middleware menambahkan header: `Strict-Transport-Security: max-age=31536000; includeSubDomains`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`, `Content-Security-Policy: default-src 'none'; frame-ancestors 'none'` (backend hanya melayani JSON/file), `Cache-Control: no-store` untuk endpoint admin dan job.
2. `/docs`, `/redoc`, `/openapi.json` hanya aktif kalau env `ENABLE_DOCS=true` (default `false` di produksi, `true` di docker-compose lokal).
3. CORS: `allow_credentials=False` (frontend tidak memakai cookie ke backend).

**Test:** semua header muncul di respons `/health`; `/docs` 404 saat `ENABLE_DOCS` tidak di-set.

---

### Batch 9 — Hardening admin (T-030) — Medium

**File:** `backend/app/routers/admin.py`

1. `secrets.compare_digest` untuk passcode.
2. Lockout: 5 kali gagal dalam 15 menit per IP → 429 selama 15 menit. Percobaan gagal dicatat ke log (tanpa nilai passcode).
3. Tolak `ADMIN_PASSCODE` yang terlalu pendek (< 16 karakter) saat startup: admin dinonaktifkan dan log warning.
4. `/api/admin/logs`: baris log tetap disaring oleh processor redaksi Batch 3.

**Test:** 6 percobaan salah → 429; passcode benar setelah lockout habis → 200.

---

### Batch 10 — Sanitasi pesan error (T-031) — Medium

**File:** `backend/app/routers/export.py`, `admin.py`, `ai.py`, `generate.py`, `backend/app/services/cloud_provider.py`, `ollama_provider.py`, `backend/app/background/job_queue.py`

1. Ganti `detail=f"...: {str(e)}"` dengan pesan umum + `error_code`, dan catat detail lengkap ke log beserta `request_id`.
2. Error DeepSeek/OpenAI/Ollama: jangan sertakan `response.text`. Simpan hanya status code dan kategori.
3. `job.error_message` yang tampil ke user memakai pesan yang aman. Error parser DDL tetap boleh informatif (itu input milik user sendiri), tapi dipotong maksimal 300 karakter.
4. Tambah middleware `request_id` (header `X-Request-ID`) supaya error di UI bisa dicocokkan dengan log.

---

### Batch 11 — Kode akses job & retensi (T-032) — Medium

**File:** `backend/app/background/job_queue.py`, `job_store.py`, `backend/app/routers/generate.py`

1. Perpanjang `access_code` ke 64-bit (`secrets.token_hex(8)`), format tetap diawali `MSF-`. Kode lama tetap valid sampai kedaluwarsa (retensi 60 menit).
2. Rate limit `GET /api/jobs/by-code/*` (mis. 20 per 10 menit per IP) lewat limiter Batch 7.
3. `cleanup_old_jobs` juga menghapus baris di SQLite (`job_store.delete_job_row`), bukan cuma di memori.
4. `GET /api/stats` publik: pertimbangkan dipindah ke admin atau dikurangi isinya.

---

### Batch 12 — Coding standards (T-033) — Low

**File:** `backend/app/models/schemas.py` → paket `backend/app/models/schemas/`, `db_connector.py`, router-router terkait

1. Pecah `schemas.py` (352 baris, batas Model 300) menjadi `schemas/enums.py`, `db.py`, `generate.py`, `ai.py`, `shortcuts.py`, `common.py`. `schemas/__init__.py` me-re-export semua nama supaya import lama tidak berubah.
2. Hapus dead code `_get_table_count_query` (SQL disusun dengan f-string).
3. Dedup: `safe_filename()` di `app/utils/filenames.py` (dipakai 3 tempat), pakai `get_provider()` di `ai.py` (ganti 2 `prov_map`), `ensure_job_capacity()` untuk cek antrean (dipakai 2 tempat).
4. Ganti `except Exception: pass` yang menelan error penting dengan `logger.warning(...)`.
5. Ganti nama field `schema` di model Pydantic (warning "shadows an attribute") dengan `schema_name` + `alias="schema"` agar kontrak API tidak berubah.

**Selesai jika:** semua file di bawah batas, `ruff check` bersih, test lolos, kontrak `API_CONTRACT.md` tidak berubah.

---

## 3. Variabel Environment Baru

| Variabel | Default produksi | docker-compose lokal | Batch |
|----------|------------------|----------------------|-------|
| `ALLOW_SQLITE_CONNECTION` | `false` | `true` | 2 |
| `ALLOW_PRIVATE_DB_HOSTS` | `false` | `true` | 2 |
| `MSF_API_KEY` (backend + Vercel server-only) | nilai acak 32+ byte | kosong | 6 |
| `RATE_LIMIT_*` | sesuai Batch 7 | longgar | 7 |
| `MAX_AI_JOBS_PER_DAY` | `50` | `0` (tanpa batas) | 7 |
| `ENABLE_DOCS` | `false` | `true` | 8 |

Setiap batch yang menambah variabel wajib meng-update `.env.example`, `docker-compose.yml`, dan `render.yaml` di commit yang sama.

---

## 4. Verifikasi Akhir (setelah semua batch)

- [ ] `pytest` lolos semua (test lama + test keamanan baru).
- [ ] `pip-audit -r requirements.txt` bersih.
- [ ] `bandit -r app` tanpa temuan High.
- [ ] PoC audit diulang: SSRF PDF 0 hit, SQLite ditolak, host privat ditolak.
- [ ] Security Pre-Merge Checklist (`ai-rules/security/part-i-security-pre-merge-checklist.md`) diisi sebelum merge `dev` → `main`.
- [ ] Cek produksi: `msf-db.my.id/api/health` 200, akses langsung ke onrender.com tanpa key → 401, header keamanan muncul.
- [ ] Update dokumentasi: `dev-docs/CHANGELOG.md`, `dev-docs/ai/KNOWN_ISSUES.md`, `dev-docs/ai/TECHNICAL_DEBT.md`, `API_CONTRACT.md` (kode error baru, 401/429), `SESSION_NOTES.md`, dan laporan di `reports/task/backend/`.

---

## 5. Di Luar Cakupan (dicatat untuk nanti)

- Prompt injection lewat komentar DDL / `business_context`: dampaknya hanya ke isi dokumen milik user sendiri setelah Batch 1 menutup jalur SSRF. Mitigasi lanjutan (memisahkan instruksi dan data di prompt) masuk backlog.
- Persistensi riwayat job di Render free (disk ephemeral) — keterbatasan yang sudah diterima.
- Pengurangan polling `/api/health` dari frontend — sudah ada di TODO `SESSION_NOTES.md`, relevan juga untuk rate limit Batch 7 (health dikecualikan dari limiter).
