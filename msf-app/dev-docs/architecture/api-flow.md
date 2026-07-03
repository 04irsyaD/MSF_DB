# API / Request Flow Architecture — MSF-APP

> **Status:** OUTPUT FILE — Diupdate saat ada perubahan middleware atau API flow.

---

## Web Request Flow (Fullstack)

```
[Browser]
    |
    └──→ [msf-frontend container: Next.js :3001]
               |
               ├── SSR Page Render (GET requests via server component)
               |
               └──→ [msf-backend container: FastAPI :8001]
                          |
                          ├── Middleware: X-API-Key check (jika MSF_API_KEY diset)
                          ├── Router (FastAPI APIRouter)
                          ├── Service Layer (sql_parser, ai_provider, db_connector, dll)
                          └── Response JSON
```

---

## API Call Flow (Frontend → Backend)

Frontend memanggil backend menggunakan `fetch` melalui `src/lib/api.ts`.

- **Auth:** Header `X-API-Key: {NEXT_PUBLIC_MSF_API_KEY}` dikirim di setiap request
- **Endpoint pattern:** `http://msf-backend:8000/api/v1/{resource}`
- **Format:** JSON request/response

---

## Mutation Flow (Generate Document)

```
[User input DDL / DB Connection]
    |
    └──→ POST /api/v1/generate
               |
               ├── Validasi input (Pydantic schema)
               ├── SQLParser.parse(ddl) → TableMetadata[]
               ├── job_queue.enqueue(job)  ← job berjalan di background
               └── Response: { job_id }

[Polling status]
    └──→ GET /api/v1/jobs/{job_id}/status

[Download hasil]
    └──→ GET /api/v1/jobs/{job_id}/download  → .docx file
```

---

## Import/Upload Flow

- Tidak ada file upload saat ini — DDL diinput sebagai plain text
- DB Connection menggunakan host/port/user/pass yang dikirim via JSON body

---

## Debug Flow (Local)

```bash
# Backend logs
docker-compose logs -f backend

# Frontend logs
docker-compose logs -f frontend

# Backend test
docker-compose exec -T backend pytest -v
```

- API docs tersedia di `http://localhost:8001/docs` (Swagger UI — FastAPI auto-generate)
