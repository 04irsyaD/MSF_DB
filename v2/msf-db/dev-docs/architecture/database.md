# Database Architecture — MSF-APP

> **Status:** OUTPUT FILE — Diupdate saat ada perubahan skema atau koneksi database.

---

## Connection Map

| Connection | Driver | Host | Schema / Database | Notes |
|-----------|--------|------|-------------------|-------|
| Internal Job Store | SQLite (berkas) | — | `JOBS_DB_PATH`, bawaan `/app/outputs/jobs.db` | Riwayat job persisten sejak v2.2.0. Bertahan terhadap restart |
| Internal Job Queue | Memori proses | — | — | Lapisan cepat untuk job aktif; menulis balik ke Job Store lewat callback |
| User's Target DB | PostgreSQL / MySQL / SQLite / SQL Server | User-provided | User-provided | Koneksi live saat user pakai fitur DB Connector |
| Test PostgreSQL | PostgreSQL 16 | `msf2-postgres` | `msf_test` | Database CONTOH untuk menguji fitur koneksi. BUKAN penyimpanan aplikasi |

Sejak **v2.2.0**, MSF-DB memiliki penyimpanan persisten sendiri berupa `jobs.db`. Sebelumnya seluruh
data job hanya di memori dan hilang setiap restart. Lihat [ADR-005](../decisions/005-persistent-job-queue-sqlite.md).

---

## Skema `jobs.db` (versi 1)

```sql
PRAGMA user_version = 1;
PRAGMA journal_mode = WAL;

CREATE TABLE IF NOT EXISTS jobs (
    job_id           TEXT PRIMARY KEY,
    access_code      TEXT NOT NULL,
    project_name     TEXT NOT NULL,
    status           TEXT NOT NULL,
    progress         INTEGER NOT NULL DEFAULT 0,
    tables_total     INTEGER NOT NULL DEFAULT 0,
    tables_processed INTEGER NOT NULL DEFAULT 0,
    current_table    TEXT,
    created_at       TEXT NOT NULL,
    updated_at       TEXT NOT NULL,
    completed_at     TEXT,
    error_message    TEXT,
    preview_markdown TEXT,
    result_filepath  TEXT,
    result_filename  TEXT,
    output_format    TEXT NOT NULL DEFAULT 'docx',
    ai_provider      TEXT,
    db_engine        TEXT,
    file_purged      INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_jobs_access_code ON jobs(access_code);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at  ON jobs(created_at);
CREATE INDEX IF NOT EXISTS idx_jobs_status      ON jobs(status);
```

| Keputusan skema | Alasan |
|---|---|
| Indeks pada `access_code` | Pencarian lewat kode akses adalah alur utama F05; tanpa indeks operasinya pemindaian penuh |
| Indeks pada `created_at` | Dipakai pengurutan admin dan kedua pembersihan |
| Indeks pada `status` | Dipakai rekonsiliasi startup |
| Kolom `file_purged` | Membedakan "berkas dihapus karena kedaluwarsa" dari "job tidak pernah menghasilkan berkas". Tanpa ini keduanya tampak sama dan pengguna menerima pesan yang salah |
| Tidak menyimpan isi berkas | Basis data hanya memuat metadata. Isi DOCX/PDF tetap di disk |
| Waktu sebagai TEXT ISO 8601 UTC | Konsisten dengan `Job.created_at` yang sudah memakai `datetime.now(timezone.utc).isoformat()`; tidak ada konversi tipe sehingga tidak ada risiko pergeseran zona waktu |
| `PRAGMA user_version` | Jalur migrasi skema di masa depan tanpa menambah Alembic. Kode menolak basis data dengan versi lebih baru |
| `journal_mode = WAL` | Pembacaan tidak memblokir penulisan; relevan saat admin membaca statistik sementara job berjalan |

**Tidak ada kolom yang menampung kredensial database target.** Kredensial hanya dipakai sementara di
memori backend dan disensor sebelum masuk log.

Perkiraan volume: sekitar 1 KB per baris, didominasi `preview_markdown` yang dipotong 2000 karakter.
Pada 50 job per hari selama 30 hari, tabel berada di kisaran 1,5 MB.

Backup dan restore: `backend/docs/operations/job-database-backup.md`.

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
