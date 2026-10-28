# Module Map — Pemetaan Kode Berkas

> **Status:** CODE MAP — Indeks rujukan berkas untuk setiap modul fungsional.

---

## Pemetaan Modul Kode MSF-DB

| Modul Fungsional | Folder/Berkas Backend | Folder/Berkas Frontend |
|------------------|-----------------------|------------------------|
| **Job Queue & Core** | `backend/app/background/job_queue.py` | `frontend/src/hooks/useGenerate.ts` |
| **DDL Parsing** | `backend/app/services/sql_parser.py` | `frontend/src/components/generator/SqlEditor.tsx` |
| **DB Metadata extraction** | `backend/app/services/db_connector.py` | `frontend/src/components/generator/DbConnector.tsx` |
| **Docx/PDF Exporter** | `backend/app/services/exporters/` | `frontend/src/components/generator/DocPreview.tsx` |
| **AI Integration** | `backend/app/services/ai_provider.py` | `frontend/src/components/generator/GeneratePanel.tsx` |
| **SQL Helper (Standalone)** | — (client-only, no backend) | `frontend/src/app/sql-helper/`, `frontend/src/components/sql-helper/`, `frontend/src/data/shortcuts/` |
| **Shortcuts Manager** | `backend/app/routers/shortcuts.py` | `frontend/src/app/shortcuts/` |
| **Admin Stats & logs** | `backend/app/routers/admin.py` | `frontend/src/app/admin/` |
| **Security API Key** | `backend/app/main.py` | `frontend/src/lib/api.ts` |
| **Dark/Light Mode** | — (client-only) | `frontend/src/components/common/ThemeToggle.tsx`, `frontend/src/app/layout.tsx` (ThemeProvider), `frontend/src/styles/globals.css` |
| **Navigation Header** | — | `frontend/src/components/layout/Header.tsx` (ROUTE_MAP pattern) |
