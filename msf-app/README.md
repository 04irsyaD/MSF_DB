# MSF-APP — Database Documentation Platform

Aplikasi utama MSF_DB untuk generate dokumentasi database secara otomatis menggunakan AI.
Bagian dari repository [MSF_DB](https://github.com/04irsyaD/MSF_DB).

---

## Fitur Utama

- **Generate Docs dari DDL** — Paste SQL DDL, AI langsung generate dokumentasi Word (.docx)
- **Generate Docs dari Live DB** — Koneksi langsung ke database, ambil metadata otomatis
- **Multi-Database** — PostgreSQL, MySQL, SQL Server, SQLite, MongoDB
- **Dual AI Provider** — Ollama (offline/lokal) + Cloud AI (DeepSeek, OpenAI)
- **SQL Shortcuts Browser** — Library shortcut SQL per database engine
- **Background Processing** — Generate berjalan di background, notifikasi saat selesai
- **Multi-bahasa Output** — Indonesia / English
- **Multi-level Detail** — Simple / Detailed / Comprehensive

---

## Stack Teknologi

### Frontend (`frontend/`)
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Monaco Editor (SQL editor)
- SWR (data fetching & polling)
- Radix UI (komponen)
- Sonner (notifikasi toast)

### Backend (`backend/`)
- FastAPI + Uvicorn
- SQLAlchemy 2.x (multi-DB connector)
- python-docx (Word generation)
- httpx (async HTTP client untuk Ollama/cloud AI)
- Pydantic v2

### Infrastructure
- Docker + Docker Compose
- Ollama (AI lokal)
- PostgreSQL (untuk testing)

---

## Quick Start

### Prasyarat
- Docker Desktop terinstall dan running
- Git

### 1. Clone & Masuk Folder

```bash
git clone https://github.com/04irsyaD/MSF_DB.git
cd MSF_DB/msf-app
```

### 2. Setup Environment

```bash
cp .env.example .env
# Edit .env sesuai kebutuhanmu (lihat bagian Environment Variables)
```

### 3. Jalankan Semua Service

```bash
docker-compose up -d
```

### 4. Pull Model AI (pertama kali saja)

```bash
docker exec -it msf-ollama ollama pull llama3.2
```

### 5. Akses Aplikasi

| Service | URL |
|---------|-----|
| Frontend (UI) | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |
| Ollama | http://localhost:11434 |

---

## Struktur Folder

```
msf-app/
├── frontend/                   # Next.js 14 App
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx            # Redirect ke /generate
│   │   │   ├── generate/
│   │   │   │   └── page.tsx        # Halaman utama (split pane)
│   │   │   ├── shortcuts/
│   │   │   │   └── page.tsx        # SQL Shortcuts browser
│   │   │   └── settings/
│   │   │       └── page.tsx        # Pengaturan AI & koneksi
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── Header.tsx
│   │   │   ├── generator/
│   │   │   │   ├── SqlEditor.tsx       # Monaco Editor SQL
│   │   │   │   ├── DbConnector.tsx     # Form koneksi DB
│   │   │   │   ├── DocPreview.tsx      # Preview hasil dokumentasi
│   │   │   │   ├── GeneratePanel.tsx   # Settings + trigger generate
│   │   │   │   └── JobStatus.tsx       # Background job notifikasi
│   │   │   └── shortcuts/
│   │   │       ├── ShortcutCard.tsx
│   │   │       └── ShortcutFilter.tsx
│   │   ├── hooks/
│   │   │   ├── useGenerate.ts          # Hook untuk background job polling
│   │   │   └── useOllamaModels.ts      # Hook fetch available models
│   │   ├── lib/
│   │   │   ├── api.ts                  # API client (fetch wrapper)
│   │   │   └── types.ts                # TypeScript types
│   │   └── styles/
│   │       └── globals.css
│   ├── package.json
│   ├── next.config.js
│   └── tailwind.config.ts
│
├── backend/                    # FastAPI App
│   ├── app/
│   │   ├── main.py                 # Entry point FastAPI
│   │   ├── routers/
│   │   │   ├── generate.py         # POST /api/generate (background job)
│   │   │   ├── export.py           # POST /api/export/docx
│   │   │   ├── database.py         # POST /api/db/connect + metadata
│   │   │   ├── shortcuts.py        # GET /api/shortcuts
│   │   │   └── ai.py               # GET /api/ai/models + provider
│   │   ├── services/
│   │   │   ├── sql_parser.py       # Parse SQL DDL → metadata
│   │   │   ├── db_connector.py     # Koneksi DB multi-engine
│   │   │   ├── ai_provider.py      # AI provider abstraction (base)
│   │   │   ├── ollama_provider.py  # Ollama implementation
│   │   │   ├── cloud_provider.py   # DeepSeek/OpenAI implementation
│   │   │   ├── doc_generator.py    # Generate Markdown dari metadata
│   │   │   └── exporters/
│   │   │       ├── docx_exporter.py    # Word export
│   │   │       └── pdf_exporter.py     # PDF export (fase 2)
│   │   ├── models/
│   │   │   └── schemas.py          # Pydantic request/response models
│   │   └── background/
│   │       └── job_queue.py        # In-memory job queue
│   ├── templates/
│   │   └── default.docx            # Template Word default
│   ├── shortcuts_data/
│   │   ├── postgresql.json         # Shortcut SQL PostgreSQL
│   │   ├── mysql.json              # Shortcut SQL MySQL
│   │   ├── sqlserver.json          # Shortcut SQL Server
│   │   └── mongodb.json            # Shortcut MongoDB
│   ├── requirements.txt
│   └── Dockerfile
│
├── docker-compose.yml          # Orchestration semua service
├── .env.example                # Template environment variables
├── .gitignore
└── README.md                   # File ini
```

---

## Environment Variables

Lihat file `.env.example` untuk daftar lengkap.

| Variable | Default | Keterangan |
|----------|---------|------------|
| `OLLAMA_BASE_URL` | `http://ollama:11434` | URL Ollama service |
| `OLLAMA_DEFAULT_MODEL` | `llama3.2` | Model default |
| `DEEPSEEK_API_KEY` | _(kosong)_ | API key DeepSeek (opsional) |
| `OPENAI_API_KEY` | _(kosong)_ | API key OpenAI (opsional) |
| `DEFAULT_LANGUAGE` | `Indonesian` | Bahasa output default |
| `DEFAULT_DETAIL_LEVEL` | `detailed` | Level detail default |
| `MAX_JOB_RETENTION_MINUTES` | `60` | Berapa lama job disimpan di memory |

---

## API Endpoints

### Generate Documentation
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `POST` | `/api/generate/from-ddl` | Generate dari SQL DDL |
| `POST` | `/api/generate/from-db` | Generate dari live DB |
| `GET` | `/api/jobs/{job_id}` | Cek status job |
| `GET` | `/api/jobs/{job_id}/download` | Download hasil (DOCX) |

### Database
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `POST` | `/api/db/test-connection` | Test koneksi DB |
| `POST` | `/api/db/metadata` | Ambil metadata dari DB |

### AI
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/ai/models` | List model Ollama tersedia |
| `GET` | `/api/ai/providers` | List provider aktif |
| `POST` | `/api/ai/test` | Test koneksi AI provider |

### Shortcuts
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/shortcuts` | List semua shortcut |
| `GET` | `/api/shortcuts?engine=postgresql` | Filter by engine |
| `GET` | `/api/shortcuts?category=monitoring` | Filter by kategori |

### Export
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `POST` | `/api/export/docx` | Markdown → Word |
| `POST` | `/api/export/pdf` | Markdown → PDF _(fase 2)_ |

### Health
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/health` | Health check semua service |

---

## Background Job Flow

```
1. User klik "Generate"
2. POST /api/generate/from-ddl → return job_id langsung
3. Background task mulai (AI processing per tabel)
4. Frontend polling GET /api/jobs/{job_id} setiap 2 detik
5. Saat status = "done" → toast notifikasi muncul
6. User klik notif → download file DOCX
```

**Job statuses:** `queued` → `processing` → `done` / `error`

---

## Database yang Didukung

| Engine | Status | Driver Python |
|--------|--------|---------------|
| PostgreSQL | ✅ MVP | psycopg2-binary |
| MySQL / MariaDB | ✅ MVP | pymysql |
| SQL Server | ⏳ v2.1 | pyodbc |
| SQLite | ✅ MVP | built-in |
| MongoDB | ⏳ v2.1 | pymongo |

---

## AI Provider yang Didukung

| Provider | Status | Keterangan |
|----------|--------|------------|
| Ollama (lokal) | ✅ MVP | Offline, gratis, privacy-first |
| DeepSeek | ⏳ v2.1 | Butuh API key |
| OpenAI | ⏳ v2.1 | Butuh API key |

---

## Roadmap

| Versi | Fitur |
|-------|-------|
| **v2.0 (MVP)** | Generate DOCX, Ollama, PostgreSQL + MySQL + SQLite, SQL Shortcuts |
| **v2.1** | SQL Server, MongoDB, DeepSeek/OpenAI, ERD diagram |
| **v2.2** | Export PDF, upload custom template DOCX |
| **v2.3** | Sync ke Google Drive, riwayat dokumen |
| **v3.0** | Home server deployment |

---

## Lisensi

MIT License — lihat [LICENSE](../LICENSE)
