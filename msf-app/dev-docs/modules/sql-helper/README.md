# Module: SQL Helper (Client Standalone)

| Item | Value |
|------|-------|
| State | Production / Optimization |
| Route Prefix | `/sql-helper` |
| Middleware | None (Public Client Standalone) |
| Dependencies | `@/data/shortcuts/shortcutsData`, `lucide-react`, `sonner` |
| Type | Client-Side SPA Component (Zero Backend Dependency) |

## Purpose

Modul **SQL Helper** menyediakan konsol referensi dan template skrip DBA kueri siap pakai (PostgreSQL, MySQL) dengan arsitektur *client standalone*. Seluruh data kueri di-bundling langsung pada build frontend Next.js sehingga tetap dapat diakses meskipun server backend Python sedang tidak aktif (*offline / maintenance*).

## Quick Links

- Views & Komponen UI → [views.md](./views.md)
- Data Shortcuts Lokal → `frontend/src/data/shortcuts/`
- Halaman Rute → `frontend/src/app/sql-helper/page.tsx`

---

> Mengikuti **Anti-Monster Rule** dan pedoman `ai-rules/modules-template/`.
