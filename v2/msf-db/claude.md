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
- Frontend: Next.js (port 3001 in v2)
- AI: Ollama local + DeepSeek + OpenAI
- Job storage: SQLite at /app/outputs/jobs.db (v2 upgrade)

## Key Files
- Backend entry: backend/app/main.py
- Job queue: backend/app/background/job_queue.py
- Generate router: backend/app/routers/generate.py
- Admin router: backend/app/routers/admin.py
- Frontend pages: frontend/src/app/*/page.tsx
- API calls: frontend/src/lib/api.ts
- Types: frontend/src/lib/types.ts

## Known Issues Fixed in v2
- Download endpoint used in-memory bytes but checked file path -> fixed by writing to disk
- Admin passcode was admin123 default -> enforced strong default warning
- Settings page was a stub redirect -> built as real page
- Job history lost on restart -> migrated to SQLite
- No rate limiting per IP -> added slowapi
- pyodbc for SQL Server was commented out -> enabled

## v2 Port Mapping
- Frontend: 3001 (was 3000)
- Backend: 8001 (was 8000)
- PostgreSQL: 5433 (was 5432)
- Ollama: 11435 (was 11434)
