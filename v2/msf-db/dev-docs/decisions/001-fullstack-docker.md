# ADR-001 — Fullstack Docker Compose (FastAPI + Next.js)

> **Status:** Accepted
> **Tanggal:** 2026-06-27

---

## Context

MSF-APP adalah developer tool yang dijalankan secara lokal oleh satu developer. Dibutuhkan stack yang bisa di-setup dengan satu perintah, tanpa konfigurasi server yang rumit.

Constraint:
- Developer menggunakan Windows dengan Docker Desktop
- Project harus bisa dijalankan offline (tanpa cloud deploy)
- Tidak ada tim besar — satu developer, satu AI agent

---

## Decision

Menggunakan **Docker Compose dengan dua service**:
- `msf-backend`: FastAPI Python 3.11
- `msf-frontend`: Next.js 14 TypeScript

Alasan pilih FastAPI: lightweight, auto-generate Swagger docs, native async support, ideal untuk background job queue.
Alasan pilih Next.js: mendukung SSR + SPA hybrid, TypeScript-first, familiar untuk developer modern.

Alternatif yang dipertimbangkan dan ditolak:
- Django: terlalu berat untuk tool internal
- Express.js: kurang type-safe tanpa setup ekstra
- Full Laravel: overkill untuk project ini

---

## Consequences

### Positive

- Setup one-command: `docker-compose up -d`
- Isolasi lingkungan sempurna (tidak polusi Python/Node di host)
- Mudah di-reset: `docker-compose down && docker-compose up -d --build`

### Trade-offs

- Perlu Docker Desktop terinstall
- Hot reload lebih lambat dibanding native (file watching via volume mount)

### Risks

- Volume mount performance di Windows bisa lambat untuk file besar — belum jadi masalah di skala saat ini
