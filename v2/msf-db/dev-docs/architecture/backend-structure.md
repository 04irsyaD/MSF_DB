# Backend Structure — MSF-APP

> **Status:** OUTPUT FILE — Diupdate saat ada perubahan struktur backend.

---

## Top-Level Backend Layout

| Path | Role |
|------|------|
| `backend/app/main.py` | Entry point FastAPI, middleware setup (CORS, X-API-Key), router registration |
| `backend/app/routers/` | FastAPI APIRouter per domain: `generate.py`, `shortcuts.py`, `admin.py`, `db_connect.py` |
| `backend/app/services/` | Business logic: `sql_parser.py`, `ai_provider.py`, `db_connector.py`, `exporters/` |
| `backend/app/background/` | Antrean job: `job_queue.py` (eksekusi dan siklus hidup) + `job_store.py` (persistensi SQLite, sejak v2.2.0) |
| `backend/app/utils/` | `logger.py`, `errors.py`, dan `rate_limit.py` (sejak v2.2.0) |
| `backend/app/models/` | Pydantic schemas untuk request/response validation |
| `backend/docs/operations/` | Dokumentasi operations yang ikut ter-deploy bersama kode (pengecualian resmi AGENTS.md aturan 11) |
| `backend/tests/` | Pytest test suite (79 test cases) |
| `backend/requirements.txt` | Dependency Python |
| `backend/Dockerfile` | Docker build config, termasuk pemasangan `msodbcsql18` untuk SQL Server |

---

## Batas Tanggung Jawab Komponen Antrean (v2.2.0)

Lapisan yang berlaku tetap `router -> service -> model`. `JobStore` adalah komponen persistensi
pertama proyek ini dan ditempatkan di `background/`, bukan `services/`, karena ia melayani antrean
job dan bukan logika domain.

| Komponen | Bertanggung jawab atas | Bergantung pada | TIDAK bertanggung jawab atas |
|---|---|---|---|
| `JobStore` | Membaca dan menulis baris job ke SQLite, rekonsiliasi, dua jenis pembersihan | `sqlite3` (stdlib) | Menjalankan job, menghapus berkas hasil, mengetahui HTTP |
| `Job` | State satu pekerjaan dan pemberitahuan perubahan lewat callback `on_change` | Tidak ada | Mengetahui SQLite |
| `JobQueue` | Menjalankan job, menegakkan siklus hidup, menjembatani `Job` dan `JobStore`, menghapus berkas | `Job`, `JobStore` | Mengetahui HTTP |
| `utils/rate_limit.py` | Menentukan kunci pembatas dan membentuk respons 429 | `slowapi` | Menentukan endpoint mana yang dibatasi |

Setiap komponen dapat diuji sendiri: `JobStore` diuji tanpa FastAPI, `Job` diuji tanpa SQLite.

**Invarian penting:** hanya job yang berada di memori yang boleh dimutasi. Job yang dihidrasi dari
`JobStore` adalah snapshot baca-saja dengan `on_change` bernilai None. Aman karena hanya job
`queued`/`processing` yang dimutasi, dan job seperti itu selalu ada di memori setelah rehidrasi.

`list_jobs()` sengaja tetap murni dari memori. Gerbang `MAX_CONCURRENT_JOBS` dihitung dari sana, dan
menghitungnya dari riwayat penuh akan membuat job yatim mematikan fitur generate secara permanen.

---

## Service Layer

| Service | File | Tanggung Jawab |
|---------|------|----------------|
| SQL Parser | `services/sql_parser.py` | Parse DDL text → `TableMetadata[]`. Mendukung PostgreSQL, MySQL, SQLite. Algoritma regex + parentheses depth counting. |
| AI Provider | `services/ai_provider.py` | Multi-provider AI: Ollama (offline) / DeepSeek / OpenAI. Auto-detect availability. |
| DB Connector | `services/db_connector.py` | Koneksi live ke database (PostgreSQL, MySQL) → extract schema metadata |
| Docx Exporter | `services/exporters/` | Generate file .docx dari TableMetadata menggunakan AI-generated description |
| Job Queue | `background/job_queue.py` | In-memory async queue untuk proses generate dokumen di background |

---

## Router / API Endpoints

| Router | File | Prefix |
|--------|------|--------|
| Generate | `routers/generate.py` | `/api/v1/generate` |
| Shortcuts | `routers/shortcuts.py` | `/api/v1/shortcuts` |
| Admin | `routers/admin.py` | `/api/v1/admin` |
| DB Connect | `routers/db_connect.py` | `/api/v1/db-connect` |

---

## Middleware & Security

| Middleware | Applied To | Tujuan |
|-----------|------------|--------|
| CORS | Semua endpoint | Allow frontend origin |
| X-API-Key check | Semua endpoint (jika `MSF_API_KEY` diset) | Autentikasi request |

---

## Command / Run

```bash
# Di dalam container
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Testing
pytest -v --tb=short
```
