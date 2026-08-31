# Module Map — Pemetaan Kode Berkas

> **Status:** CODE MAP — Indeks rujukan berkas untuk setiap modul fungsional.

---

## Pemetaan Modul Kode MSF-DB

| Modul Fungsional | Folder/Berkas Backend | Folder/Berkas Frontend |
|------------------|-----------------------|------------------------|
| **Job Queue & Core** | `backend/app/background/job_queue.py` | `frontend/src/hooks/useGenerate.ts` |
| **Job Persistence (SQLite)** | `backend/app/background/job_store.py` | — |
| **Rate Limiting** | `backend/app/utils/rate_limit.py` + registrasi di `backend/app/main.py` | `frontend/src/lib/api.ts` (penanganan 429) |
| **Security Headers** | `backend/app/utils/security_headers.py` + registrasi di `backend/app/main.py` | Belum ada; direncanakan di `frontend/next.config.js` |
| **Operations Docs** | `backend/docs/operations/` | — |
| **DDL Parsing** | `backend/app/services/sql_parser.py` | `frontend/src/components/generator/SqlEditor.tsx` |
| **DB Metadata extraction** | `backend/app/services/db_connector.py` — termasuk komentar tabel dan kolom lewat inspector SQLAlchemy | `frontend/src/components/generator/DbConnector.tsx` |
| **Model dokumen** | `backend/app/services/doc_model.py` — `DocumentModel`, `TableDoc`, `ColumnDoc`, pelacakan asal deskripsi | — |
| **Parser keluaran AI** | `backend/app/services/ai_column_parser.py` — sanitasi dan penyaring halusinasi terhadap metadata | — |
| **Renderer** | `backend/app/services/renderers/markdown_renderer.py` — `DocumentModel` menjadi Markdown | — |
| **Renderer template DOCX** | `backend/app/services/renderers/docx_template_renderer.py` + template di `backend/templates/` | `frontend/src/components/generator/GeneratePanel.tsx` selector Struktur Dokumen |
| **Penyiapan template** | `backend/scripts/siapkan_template_tsd.py` — dokumen TSD terisi menjadi kerangka docxtpl | — |
| **Docx/PDF Exporter** | `backend/app/services/exporters/` | `frontend/src/components/generator/DocPreview.tsx` |
| **AI Integration** | `backend/app/services/ai_provider.py` | `frontend/src/components/generator/GeneratePanel.tsx` |
| **Shortcuts Manager** | `backend/app/routers/shortcuts.py` | `frontend/src/app/shortcuts/` |
| **Admin Stats & logs** | `backend/app/routers/admin.py` | `frontend/src/app/admin/` |
| **Security API Key** | `backend/app/main.py` | `frontend/src/lib/api.ts` |
