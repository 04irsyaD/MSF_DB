# Architecture — Index

> **Status:** OUTPUT FILE — Indeks arsitektur MSF-APP. Detail di file per aspek.

---

## Daftar Dokumen Arsitektur

| Dokumen | Deskripsi |
|---------|-----------|
| [api-flow.md](./api-flow.md) | Alur request dari browser ke response (web + API flow) |
| [backend-structure.md](./backend-structure.md) | Struktur direktori backend FastAPI |
| [frontend-structure.md](./frontend-structure.md) | Struktur direktori frontend Next.js |
| [database.md](./database.md) | Koneksi database, storage, dan migrasi |

---

## Ringkasan Arsitektur (Overview)

MSF-APP adalah aplikasi **fullstack Dockerized** dengan dua service terpisah:

- **Backend:** FastAPI (Python 3.11) di `msf-backend` container — port 8001 (host) / 8000 (internal)
- **Frontend:** Next.js 14 (TypeScript) di `msf-frontend` container — port 3001 (host) / 3000 (internal)
- **AI Engine:** Ollama berjalan di host (bukan container), diakses via `host.docker.internal:11434`

Komunikasi frontend ↔ backend menggunakan **HTTP REST API** dengan header `X-API-Key` untuk keamanan.
