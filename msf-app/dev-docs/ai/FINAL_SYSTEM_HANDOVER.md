# FINAL_SYSTEM_HANDOVER.md — MSF-APP

> **CATATAN:** File ini adalah dokumen serah terima untuk engineer atau AI agent baru yang bergabung ke project ini.
> Untuk credential aktual (API key, password), lihat `.env` dan `prod-docs/`.
> **JANGAN tulis credential aktual di file ini.**

---

## 1. Apa Itu MSF-APP?

MSF-APP (MSF Database Documentation Tool) adalah platform web fullstack untuk menghasilkan dokumentasi database secara otomatis berbasis AI. User memasukkan DDL SQL atau menghubungkan database langsung, lalu sistem menghasilkan dokumen Word (.docx) berisi deskripsi tabel, kolom, dan relasi FK yang dihasilkan oleh AI.

---

## 2. Cara Menjalankan Secara Lokal

### Prasyarat

- Docker Desktop terinstall dan berjalan
- Ollama terinstall di host (optional, untuk mode offline AI)

### Start

```bash
cd msf-app
docker-compose up -d
```

- Frontend UI: `http://localhost:3001`
- Backend API: `http://localhost:8001`
- Ollama: `http://localhost:11434` (host, bukan Docker)

### Stop

```bash
docker-compose down
```

### Rebuild (setelah perubahan kode)

```bash
docker-compose build --no-cache
docker-compose up -d --force-recreate
```

---

## 3. Stack Teknologi

| Layer | Teknologi |
|-------|-----------|
| Backend | Python 3.11, FastAPI, Uvicorn |
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| AI Engine | Ollama (offline) / DeepSeek / OpenAI (online) |
| Containerization | Docker Compose (2 services: `msf-backend`, `msf-frontend`) |
| Testing | Pytest (backend), Markdownlint (docs) |

---

## 4. Struktur Project

```
msf-app/
├── .git/                  # Git repository utama
├── ai-rules/              # IMMUTABLE — rules & templates AI
├── backend/               # FastAPI Python app
│   ├── app/
│   │   ├── background/    # Job queue in-memory
│   │   ├── routers/       # API endpoints
│   │   ├── services/      # Business logic (sql_parser, ai_provider, dll)
│   │   └── main.py        # Entry point + middleware
│   └── tests/             # Pytest test suite (32 tests)
├── frontend/              # Next.js TypeScript app
│   ├── src/
│   │   ├── app/           # Next.js App Router pages
│   │   ├── components/    # UI components
│   │   │   ├── diagram/   # DiagramCanvas.tsx — inti diagram ERD
│   │   │   └── generator/ # Form input DDL, DB connector, doc preview
│   │   └── lib/           # API client, utilities
│   └── public/
├── dev-docs/              # OUTPUT AI — dokumentasi development
│   ├── CHANGELOG.md
│   ├── COMMIT_LOG.md
│   ├── commit-logs/       # Daily commit logs: YYYY-MM-DD.md
│   └── ai/                # AI working docs
└── docker-compose.yml
```

---

## 5. Modul Kode Penting

| Modul | File | Keterangan |
|-------|------|------------|
| SQL Parser | `backend/app/services/sql_parser.py` | Regex-based DDL parser, handle PostgreSQL/MySQL/SQLite |
| AI Provider | `backend/app/services/ai_provider.py` | Multi-provider: Ollama / DeepSeek |
| Job Queue | `backend/app/background/job_queue.py` | In-memory async queue untuk generate docs |
| Docx Exporter | `backend/app/services/exporters/` | Generate .docx dari metadata skema |
| Diagram Canvas | `frontend/src/components/diagram/DiagramCanvas.tsx` | ERD viewer custom SVG + 7 layout algorithms |
| API Security | `backend/app/main.py` | X-API-Key middleware |

---

## 6. Variabel Environment Kritis

Lihat `.env` di root `msf-app/` untuk nilai aktual. Key yang wajib ada:

- `MSF_API_KEY` — Kunci keamanan API (backend + frontend harus sama)
- `ADMIN_PASSCODE` — Password halaman admin
- `NEXT_PUBLIC_MSF_API_KEY` — API key di sisi frontend
- `OLLAMA_BASE_URL` — URL Ollama dari dalam Docker (`http://host.docker.internal:11434`)

---

## 7. Cara Menjalankan Test

```bash
# Backend pytest
docker-compose exec -T backend pytest -v --tb=short

# Markdown lint
npx --yes markdownlint-cli2 "**/*.md" "!**/node_modules/**" "!**/.git/**"
```

---

## 8. Branch & Git Policy

- Semua development di branch `dev`
- **DILARANG push langsung ke `main`**
- Git commands dari root `msf-app/`
- AI agent DILARANG `git push` — push dilakukan manual oleh human

---

## 9. Dokumen Referensi Lanjutan

| Dokumen | Lokasi | Isi |
|---------|--------|-----|
| AI Rules | `ai-rules/AGENTS.md` | Kontrak kerja lengkap AI |
| Current State | `dev-docs/ai/CURRENT_STATE.md` | Status test & health sistem |
| Module Map | `dev-docs/ai/MODULE_MAP.md` | Pemetaan file per modul |
| Changelog | `dev-docs/CHANGELOG.md` | Riwayat perubahan |
| Mental Model | `dev-docs/ai/PROJECT_MENTAL_MODEL.md` | Arsitektur dan pola aliran data |
