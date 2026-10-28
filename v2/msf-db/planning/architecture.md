# System Architecture — MSF-DB

> **Status:** PLANNING DATA — Berkas adopsi sistem saat ini.

---

## 1. Topologi Komponen (Component Topology)
Platform MSF-DB menggunakan arsitektur modular yang membagi tanggung jawab ke dalam beberapa komponen utama:

```
                  ┌────────────────────────┐
                  │   Client Browser       │
                  │   (Next.js UI)         │
                  └───────────┬────────────┘
                              │ HTTP / Event Stream
                              ▼
                  ┌────────────────────────┐
                  │   FastAPI Backend      │
                  │   (Python App Server)  │
                  └──────┬───────────┬─────┘
                         │           │
        Kueri Skema DB   │           │ Prompts & API Calls
                         ▼           ▼
        ┌──────────────────┐       ┌────────────────────────┐
        │ Target Database  │       │  LLM / AI Provider     │
        │ (Live PG/MySQL)  │       │  (Ollama/DeepSeek/OA)  │
        └──────────────────┘       └────────────────────────┘
```

---

## 2. Deskripsi Komponen

### A. Frontend (Next.js 14)
*   **Peran**: Menyediakan antarmuka pengguna (UI) modern dengan tema *Light Mode* premium (emerald-gray).
*   **Teknologi**: Next.js App Router, TypeScript, Tailwind CSS, Lucide Icons, Monaco Editor (untuk menulis SQL DDL).
*   **Komunikasi**: Mengirim request ke Backend API menggunakan Axios kustom di `api.ts`, menggunakan **SWR** untuk polling status progres pekerjaan latar belakang, dan menangani download via link `/api/jobs/{job_id}/download`.

### B. Backend (FastAPI)
*   **Peran**: Melayani REST API endpoint, mengelola antrean pekerjaan koding (`JobQueue`), mem-parser skrip SQL DDL, mengekstrak metadata dari database hidup, dan menginstruksikan LLM untuk men-generate dokumen.
*   **Teknologi**: FastAPI, Pydantic (untuk skema request/response), SQLAlchemy (untuk koneksi target database), python-docx & reportlab (untuk ekspor Word/PDF).
*   **Middleware**: APIKeyMiddleware untuk memvalidasi header `X-API-Key` jika di-set di berkas `.env`.

### C. AI Providers
*   **Ollama (Lokal)**: Digunakan secara default (misal dengan model `llama3.2` atau `deepseek-coder`). Terkoneksi via endpoint HTTP `http://host.docker.internal:11434`.
*   **Cloud AI (DeepSeek & OpenAI)**: Terkoneksi secara aman via API internet publik dengan validasi token/key dari `.env` pengguna.
