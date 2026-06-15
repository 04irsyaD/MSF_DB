# 🛠️ Development Guide — MSF-APP

Panduan teknis untuk development lokal MSF-APP.

---

## Prasyarat

Pastikan semua tools ini sudah terinstall sebelum mulai:

| Tool | Versi Min | Cara Install | Cek |
|------|-----------|--------------|-----|
| Docker Desktop | 4.x | https://www.docker.com/products/docker-desktop | `docker --version` |
| Node.js | 20 LTS | https://nodejs.org | `node --version` |
| Python | 3.11+ | https://www.python.org | `python --version` |
| Git | 2.x | https://git-scm.com | `git --version` |

**Opsional tapi direkomendasikan:**

| Tool | Fungsi | Install |
|------|--------|---------|
| `uv` | Python package manager (lebih cepat dari pip) | `pip install uv` |
| `pnpm` | Node package manager (lebih cepat dari npm) | `npm install -g pnpm` |
| Ollama (host) | Jalankan Ollama langsung di host (tanpa Docker) | https://ollama.ai |

---

## Setup Pertama Kali

### 1. Clone Repository

```bash
git clone https://github.com/04irsyaD/MSF_DB.git
cd MSF_DB/msf-app
```

### 2. Buat File .env

```bash
cp .env.example .env
```

Edit `.env` — minimal ganti:
- `SECRET_KEY` → string random panjang (bisa generate: `python -c "import secrets; print(secrets.token_hex(32))"`)
- `POSTGRES_PASSWORD` → password yang aman

### 3. Pull Model Ollama (Satu Kali)

> Butuh storage ~2GB untuk llama3.2

**Opsi A — Ollama sudah terinstall di host:**
```bash
ollama pull llama3.2
```

**Opsi B — Pakai Docker (setelah docker-compose up):**
```bash
docker exec -it msf-ollama ollama pull llama3.2
```

### 4. Jalankan Semua Service

```bash
docker-compose up -d
```

Cek semua service running:
```bash
docker-compose ps
```

Expected output:
```
NAME            STATUS          PORTS
msf-ollama      Up (healthy)    0.0.0.0:11434->11434/tcp
msf-backend     Up (healthy)    0.0.0.0:8000->8000/tcp
msf-frontend    Up              0.0.0.0:3000->3000/tcp
msf-postgres    Up (healthy)    0.0.0.0:5432->5432/tcp
```

---

## Development Mode (Tanpa Docker untuk Frontend & Backend)

Untuk development yang lebih cepat (hot reload), jalankan Ollama + PostgreSQL via Docker
tapi frontend & backend dijalankan langsung di host:

### Docker (hanya Ollama + PostgreSQL)

```bash
docker-compose up -d ollama postgres
```

### Backend (terminal 1)

```bash
cd backend

# Buat virtual environment
python -m venv .venv

# Aktivasi venv
# Windows:
.venv\Scripts\activate
# Mac/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set environment (override OLLAMA_BASE_URL untuk mode lokal)
set OLLAMA_BASE_URL=http://localhost:11434  # Windows
# export OLLAMA_BASE_URL=http://localhost:11434  # Mac/Linux

# Jalankan server dengan hot reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend (terminal 2)

```bash
cd frontend

# Install dependencies
npm install

# Set environment
# Buat file .env.local:
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Jalankan dev server
npm run dev
```

---

## URL Penting

| Service | URL | Keterangan |
|---------|-----|------------|
| **UI** | http://localhost:3000 | Aplikasi utama |
| **API** | http://localhost:8000 | Backend REST API |
| **Swagger** | http://localhost:8000/docs | API documentation interaktif |
| **ReDoc** | http://localhost:8000/redoc | API documentation alternatif |
| **Ollama** | http://localhost:11434 | Ollama API |
| **PostgreSQL** | localhost:5432 | DB untuk testing |

---

## Struktur Kode Backend

```
backend/app/
├── main.py              ← Entry point, setup FastAPI, register routers
├── routers/             ← Endpoint HTTP per fitur
│   ├── generate.py      ← POST /api/generate/*
│   ├── export.py        ← POST /api/export/*
│   ├── database.py      ← POST /api/db/*
│   ├── shortcuts.py     ← GET /api/shortcuts
│   └── ai.py            ← GET /api/ai/*
├── services/            ← Business logic (tidak ada HTTP di sini)
│   ├── sql_parser.py    ← Parse DDL
│   ├── db_connector.py  ← Koneksi DB
│   ├── ai_provider.py   ← Base class AI provider
│   ├── ollama_provider.py
│   ├── cloud_provider.py
│   ├── doc_generator.py ← Generate Markdown dari metadata
│   └── exporters/
│       └── docx_exporter.py
├── models/
│   └── schemas.py       ← Pydantic models (request/response)
└── background/
    └── job_queue.py     ← In-memory job management
```

### Cara Tambah DB Engine Baru

1. Buka `services/db_connector.py`
2. Tambah engine di `SUPPORTED_ENGINES` dict
3. Tambah connection string builder
4. Tambah metadata extractor method
5. Update `schemas.py` jika perlu field baru
6. Test dengan `pytest tests/test_db_connector.py`

### Cara Tambah AI Provider Baru

1. Buka `services/ai_provider.py` — lihat interface `AIProvider`
2. Buat file baru: `services/nama_provider.py`
3. Implement semua method: `generate()`, `list_models()`, `health_check()`
4. Register di `routers/ai.py`

---

## Struktur Kode Frontend

```
frontend/src/
├── app/                 ← Next.js App Router pages
│   ├── layout.tsx       ← Root layout (sidebar, header)
│   ├── page.tsx         ← Redirect ke /generate
│   ├── generate/
│   │   └── page.tsx     ← Halaman utama
│   ├── shortcuts/
│   │   └── page.tsx
│   └── settings/
│       └── page.tsx
├── components/          ← React components
│   ├── layout/          ← Sidebar, Header
│   ├── generator/       ← Komponen halaman generate
│   └── shortcuts/       ← Komponen halaman shortcuts
├── hooks/               ← Custom React hooks
├── lib/
│   ├── api.ts           ← Semua API calls ke backend
│   └── types.ts         ← TypeScript types & interfaces
└── styles/
    └── globals.css      ← Global styles & CSS variables
```

### Cara Tambah Halaman Baru

1. Buat folder baru di `src/app/nama-halaman/`
2. Buat `page.tsx` di dalamnya
3. Tambah link ke sidebar di `components/layout/Sidebar.tsx`

### Cara Tambah API Call Baru

1. Buka `lib/api.ts`
2. Tambah function baru mengikuti pola yang ada
3. Tambah TypeScript type di `lib/types.ts` jika perlu

---

## Perintah Umum

```bash
# Lihat log semua service
docker-compose logs -f

# Lihat log service tertentu
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f ollama

# Restart service tertentu (setelah update kode)
docker-compose restart backend
docker-compose restart frontend

# Rebuild image (setelah ubah Dockerfile atau requirements.txt)
docker-compose build backend
docker-compose build frontend
docker-compose up -d --build

# Stop semua service
docker-compose down

# Stop dan hapus semua data (HATI-HATI: data postgres hilang)
docker-compose down -v

# Masuk ke container
docker exec -it msf-backend bash
docker exec -it msf-postgres psql -U msf_user -d msf_test

# Lihat model Ollama yang terinstall
docker exec -it msf-ollama ollama list
```

---

## Testing

### Backend Tests

```bash
cd backend
source .venv/bin/activate  # atau .venv\Scripts\activate di Windows

# Run semua tests
pytest

# Run dengan coverage report
pytest --cov=app --cov-report=html

# Run test spesifik
pytest tests/test_sql_parser.py
pytest tests/test_db_connector.py -v

# Buka coverage report
open htmlcov/index.html  # Mac
start htmlcov/index.html  # Windows
```

### Frontend Type Check

```bash
cd frontend
npm run type-check
npm run lint
```

---

## Troubleshooting

### Ollama tidak bisa diakses

```bash
# Cek apakah Ollama container running
docker ps | grep ollama

# Cek log
docker logs msf-ollama

# Test langsung
curl http://localhost:11434/api/tags
```

### Backend error "Connection refused" ke Ollama

Pastikan `OLLAMA_BASE_URL` di `.env` sesuai:
- Docker mode: `http://ollama:11434`
- Local mode: `http://localhost:11434`

### PostgreSQL gagal connect

```bash
# Test koneksi
docker exec -it msf-postgres pg_isready -U msf_user -d msf_test

# Lihat log
docker logs msf-postgres
```

### Frontend tidak bisa connect ke backend

Pastikan `NEXT_PUBLIC_API_URL` sudah benar di `.env` atau `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Format Data Shortcuts (JSON)

File shortcut di `backend/shortcuts_data/*.json`:

```json
[
  {
    "id": "pg-show-table-size",
    "title": "Show All Table Sizes",
    "engine": "postgresql",
    "category": "monitoring",
    "risk_level": "safe",
    "sql": "SELECT\n  schemaname,\n  tablename,\n  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size\nFROM pg_tables\nORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;",
    "description": "Menampilkan ukuran semua tabel termasuk index, diurutkan dari yang terbesar.",
    "tags": ["dba", "storage", "monitoring"],
    "version_min": "9.6",
    "notes": "Butuh akses ke pg_tables"
  }
]
```

**Risk levels:** `safe` | `read-only` | `caution` | `dangerous`

---

## Konvensi Kode

### Python (Backend)
- Formatter: **ruff format** (bukan black)
- Linter: **ruff check**
- Type hints: **wajib** di semua function signature
- Docstring: Google style

```bash
ruff format backend/
ruff check backend/ --fix
```

### TypeScript (Frontend)
- Formatter: **Prettier**
- Linter: **ESLint** (konfigurasi Next.js)
- Hindari `any` type

```bash
cd frontend
npm run lint:fix
npm run format
```
