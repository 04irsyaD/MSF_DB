# Backend Structure — MSF-APP

> **Status:** OUTPUT FILE — Diupdate saat ada perubahan struktur backend.

---

## Top-Level Backend Layout

| Path | Role |
|------|------|
| `backend/app/main.py` | Entry point FastAPI, middleware setup (CORS, X-API-Key), router registration |
| `backend/app/routers/` | FastAPI APIRouter per domain: `generate.py`, `shortcuts.py`, `admin.py`, `db_connect.py` |
| `backend/app/services/` | Business logic: `sql_parser.py`, `ai_provider.py`, `db_connector.py`, `exporters/` |
| `backend/app/background/` | In-memory job queue: `job_queue.py` |
| `backend/app/models/` | Pydantic schemas untuk request/response validation |
| `backend/tests/` | Pytest test suite (32 test cases) |
| `backend/requirements.txt` | Dependency Python |
| `backend/Dockerfile` | Docker build config |

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
