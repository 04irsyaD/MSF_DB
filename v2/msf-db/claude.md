# Claude Working Notes — MSF DB v2

## Project
AI-powered database documentation platform.
Working directory: `v2/msf-db/`
Original reference: `msf-app/` (do not touch)

## Rules
- Follow AGENTS.md in ai-rules/ strictly
- No git push — human does all pushes
- Work on `dev` branch only
- All secrets in .env, never in code

## Architecture
- Backend: FastAPI (port 8001 in v2)
- Frontend: Next.js (port 3002 in v2)
- AI: Ollama local + DeepSeek + OpenAI
- Job storage: SQLite at /app/outputs/jobs.db (v2.2.0)

## Key Files
- Backend entry: backend/app/main.py
- Job queue: backend/app/background/job_queue.py
- Job store (SQLite): backend/app/background/job_store.py
- Rate limiting: backend/app/utils/rate_limit.py
- Generate router: backend/app/routers/generate.py
- Admin router: backend/app/routers/admin.py
- Operations docs: backend/docs/operations/
- Frontend pages: frontend/src/app/*/page.tsx
- API calls: frontend/src/lib/api.ts
- Types: frontend/src/lib/types.ts

## Status Perbaikan (diperbarui 2026-08-03, v2.2.0)

Bagian ini sebelumnya berjudul "Known Issues Fixed in v2" dan menyesatkan: pada saat ditulis,
tidak satu pun dari daftarnya sudah dikerjakan. Status sebenarnya per rilis v2.2.0:

| Klaim lama | Status sebenarnya |
|---|---|
| Download pakai in-memory bytes tapi cek file path | **Sudah benar sejak awal.** `job_queue.py` memang menulis ke disk; tidak ada yang perlu diperbaiki |
| Admin passcode default admin123 | **SELESAI di v2.2.0.** Fallback di docker-compose dihapus dan perbandingan memakai `compare_digest` |
| Settings page stub redirect | **BUKAN bug.** Redirect adalah keputusan UX yang disengaja pada 2026-07-06 dan tetap dipertahankan |
| Job history hilang saat restart | **SELESAI di v2.2.0.** Persisten dengan SQLite, lihat ADR-005 |
| Belum ada rate limiting per IP | **SELESAI di v2.2.0.** slowapi, tiga endpoint dibatasi |
| pyodbc SQL Server dikomentari | **SELESAI di v2.2.0.** `pyodbc` aktif dan `msodbcsql18` terpasang di image |

## v2 Port Mapping
- Frontend: 3002 (msf-app memakai 3001)
- Backend: 8001 (msf-app memakai 8080)
- PostgreSQL: 5434 (5433 sudah dipakai proyek lain di mesin dev)
- Ollama: 11435 (msf-app memakai 11434)

Container diberi awalan `msf2-` dan volume `msf2_` agar v2 dapat berjalan bersamaan dengan msf-app.
