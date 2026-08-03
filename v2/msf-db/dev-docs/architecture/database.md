# Database Architecture — MSF-APP

> **Status:** OUTPUT FILE — Diupdate saat ada perubahan skema atau koneksi database.

---

## Connection Map

| Connection | Driver | Host | Schema / Database | Notes |
|-----------|--------|------|-------------------|-------|
| Internal Job Queue | SQLite (in-memory) | — | — | Mengelola status job generate, bersifat sementara (hilang saat restart) |
| User's Target DB | PostgreSQL / MySQL | User-provided | User-provided | Koneksi live saat user pakai fitur DB Connector |

MSF-APP **tidak memiliki persistent database sendiri** — data job disimpan in-memory di `job_queue.py`.

---

## Migration Layout

Tidak ada migrasi database internal — tidak ada schema tetap untuk MSF-APP sendiri.

---

## Cross-Database Relationship

Tidak relevan — MSF-APP adalah tool yang menganalisis database eksternal user, bukan memiliki relasi antar database sendiri.

---

## Storage

- Tidak ada file upload yang disimpan ke disk
- File .docx hasil generate disimpan sementara di memory / temp buffer, langsung di-stream ke client
- Tidak ada S3 atau external storage

---

## Operational Commands

| Domain | Command | Notes |
|--------|---------|-------|
| Start backend | `docker-compose up -d` | Dari root `msf-app/` |
| Stop backend | `docker-compose down` | Dari root `msf-app/` |
| Backend test | `docker-compose exec -T backend pytest -v` | 32 test cases |
