# Module Map — Pemetaan Kode Berkas

> **Status:** CODE MAP — Indeks rujukan berkas untuk setiap modul fungsional.

---

## Pemetaan Modul Kode MSF-DB

| Modul Fungsional | Folder/Berkas Backend | Folder/Berkas Frontend |
|------------------|-----------------------|------------------------|
| **Job Queue & Core** | `backend/app/background/job_queue.py` | `frontend/src/hooks/useGenerate.ts` |
| **Job Persistence (SQLite)** | `backend/app/background/job_store.py` | — |
| **Rate Limiting** | `backend/app/utils/rate_limit.py` + registrasi di `backend/app/main.py` | `frontend/src/lib/api.ts` (penanganan 429) |
| **Operations Docs** | `backend/docs/operations/` | — |
| **DDL Parsing** | `backend/app/services/sql_parser.py` | `frontend/src/components/generator/SqlEditor.tsx` |
| **DB Metadata extraction** | `backend/app/services/db_connector.py` | `frontend/src/components/generator/DbConnector.tsx` |
| **Docx/PDF Exporter** | `backend/app/services/exporters/` | `frontend/src/components/generator/DocPreview.tsx` |
| **AI Integration** | `backend/app/services/ai_provider.py` | `frontend/src/components/generator/GeneratePanel.tsx` |
| **Shortcuts Manager** | `backend/app/routers/shortcuts.py` | `frontend/src/app/shortcuts/` |
| **Admin Stats & logs** | `backend/app/routers/admin.py` | `frontend/src/app/admin/` |
| **Security API Key** | `backend/app/main.py` | `frontend/src/lib/api.ts` |
