# MSF-APP — API Contract Reference

Dokumentasi lengkap semua endpoint API backend.
Versi Swagger interaktif tersedia di: http://localhost:8000/docs

---

## Base URL

```
Development: http://localhost:8000
Docker:      http://backend:8000  (internal)
```

---

## Generate Documentation

### POST `/api/generate/from-ddl`

Generate dokumentasi dari SQL DDL yang di-paste langsung.

**Request Body:**
```json
{
  "sql_content": "CREATE TABLE users (\n  id SERIAL PRIMARY KEY,\n  email VARCHAR(255) NOT NULL\n);",
  "project_name": "Dokumentasi DB Produksi",
  "project_description": "Database untuk aplikasi e-commerce",
  "author": "Irsyad",
  "language": "Indonesian",
  "detail_level": "detailed",
  "business_context": "Sistem manajemen pengguna untuk platform belanja online",
  "ai_provider": "ollama",
  "model": "llama3.2",
  "output_format": "docx"
}
```

**Response (200):**
```json
{
  "job_id": "01234567-89ab-cdef-0123-456789abcdef",
  "status": "queued",
  "created_at": "2025-01-15T10:30:00Z",
  "estimated_seconds": 30
}
```

---

### POST `/api/generate/from-db`

Generate dokumentasi dengan koneksi langsung ke database.

**Request Body:**
```json
{
  "connection": {
    "engine": "postgresql",
    "host": "localhost",
    "port": 5432,
    "database": "mydb",
    "username": "postgres",
    "password": "secret",
    "schema_name": "public"
  },
  "project_name": "Dokumentasi DB",
  "language": "Indonesian",
  "detail_level": "comprehensive",
  "ai_provider": "ollama",
  "model": "llama3.2",
  "output_format": "docx",
  "include_views": true,
  "include_functions": false,
  "table_filter": ["users", "orders", "products"]
}
```

**Atau dengan connection string:**
```json
{
  "connection": {
    "engine": "postgresql",
    "connection_string": "postgresql://postgres:secret@localhost:5432/mydb"
  },
  ...
}
```

**Response (200):** sama seperti `/from-ddl`

---

### GET `/api/jobs/{job_id}`

Cek status job yang sedang berjalan (untuk polling).

**Response (200):**
```json
{
  "job_id": "01234567-89ab-cdef-0123-456789abcdef",
  "status": "processing",
  "progress": 45,
  "tables_total": 10,
  "tables_processed": 4,
  "current_table": "orders",
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-01-15T10:30:30Z",
  "completed_at": null,
  "error_message": null,
  "preview_markdown": "# Dokumentasi Database\n\n## Tabel: users\n...",
  "download_url": null
}
```

**Saat status = "done":**
```json
{
  "status": "done",
  "progress": 100,
  "completed_at": "2025-01-15T10:31:00Z",
  "download_url": "/api/jobs/01234567-89ab-cdef-0123-456789abcdef/download"
}
```

---

### GET `/api/jobs/{job_id}/download`

Download file hasil dokumentasi (DOCX/PDF).

**Response:** File binary dengan header:
```
Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document
Content-Disposition: attachment; filename="Dokumentasi_DB_Produksi.docx"
```

---

## Database

### POST `/api/db/test-connection`

Test apakah koneksi ke database berhasil.

**Request Body:**
```json
{
  "engine": "postgresql",
  "host": "localhost",
  "port": 5432,
  "database": "mydb",
  "username": "postgres",
  "password": "secret"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Koneksi berhasil",
  "engine": "postgresql",
  "server_version": "PostgreSQL 16.1",
  "tables_count": 15
}
```

---

### POST `/api/db/metadata`

Ambil metadata dari database (list tabel, kolom, FK, dll).

**Request Body:** sama seperti `/test-connection` + optional filters

**Response (200):**
```json
{
  "engine": "postgresql",
  "database": "mydb",
  "schema": "public",
  "tables": [
    {
      "name": "users",
      "schema": "public",
      "columns": [
        {
          "name": "id",
          "data_type": "integer",
          "is_nullable": false,
          "is_primary_key": true,
          "is_foreign_key": false
        }
      ],
      "primary_key": ["id"],
      "foreign_keys": [],
      "indexes": [
        {
          "name": "users_pkey",
          "columns": ["id"],
          "is_unique": true
        }
      ]
    }
  ]
}
```

---

## AI

### GET `/api/ai/models?provider=ollama`

List model yang tersedia untuk provider tertentu.

**Response (200):**
```json
{
  "provider": "ollama",
  "is_available": true,
  "models": [
    {
      "name": "llama3.2",
      "size": "2.0 GB",
      "modified_at": "2025-01-10T12:00:00Z"
    },
    {
      "name": "mistral",
      "size": "4.1 GB",
      "modified_at": "2025-01-08T09:00:00Z"
    }
  ]
}
```

---

### GET `/api/ai/providers`

List semua provider yang dikonfigurasi dan status ketersediaannya.

**Response (200):**
```json
[
  {
    "name": "ollama",
    "label": "Ollama (Lokal)",
    "is_available": true,
    "base_url": "http://localhost:11434"
  },
  {
    "name": "deepseek",
    "label": "DeepSeek",
    "is_available": false,
    "reason": "API key tidak dikonfigurasi"
  }
]
```

---

## Shortcuts

### GET `/api/shortcuts`

List semua shortcut SQL dengan filter opsional.

**Query Parameters:**
| Param | Type | Default | Keterangan |
|-------|------|---------|------------|
| `engine` | string | null | Filter: postgresql, mysql, sqlserver, mongodb |
| `category` | string | null | Filter: monitoring, dba, data, config, index |
| `risk_level` | string | null | Filter: safe, read-only, caution, dangerous |
| `q` | string | null | Search by title/description |
| `limit` | int | 50 | Max hasil |
| `offset` | int | 0 | Pagination |

**Response (200):**
```json
{
  "total": 25,
  "items": [
    {
      "id": "pg-show-table-size",
      "title": "Show All Table Sizes",
      "engine": "postgresql",
      "category": "monitoring",
      "risk_level": "safe",
      "sql": "SELECT ...",
      "description": "Menampilkan ukuran semua tabel...",
      "tags": ["dba", "storage"],
      "version_min": "9.6"
    }
  ]
}
```

---

## Health

### GET `/health`

Health check semua service.

**Response (200):**
```json
{
  "status": "healthy",
  "services": {
    "api": "up",
    "ollama": "up",
    "ollama_model": "llama3.2"
  },
  "version": "2.0.0"
}
```

**Response (503) jika ada service down:**
```json
{
  "status": "degraded",
  "services": {
    "api": "up",
    "ollama": "down"
  }
}
```

---

## Error Responses

Semua error mengikuti format yang konsisten:

```json
{
  "detail": "Pesan error yang jelas",
  "error_code": "OLLAMA_UNAVAILABLE",
  "timestamp": "2025-01-15T10:30:00Z"
}
```

**HTTP Status Codes:**
| Code | Keterangan |
|------|------------|
| `400` | Request tidak valid (validasi gagal) |
| `404` | Job ID tidak ditemukan |
| `422` | Unprocessable entity (Pydantic validation error) |
| `503` | Service tidak tersedia (Ollama down, dll) |
| `500` | Internal server error |

---

## Catatan Penting untuk Frontend

1. **Polling interval**: Gunakan SWR dengan `refreshInterval: 2000` (2 detik) saat polling job status
2. **Stop polling**: Hentikan polling saat status `done` atau `error`
3. **Download**: Lakukan `window.open(download_url)` atau fetch dengan blob untuk download file
4. **Error handling**: Selalu handle case di mana Ollama tidak tersedia (user belum pull model)
5. **Timeout**: Request generate bisa memakan waktu lama (>5 menit untuk schema besar) — jangan timeout terlalu cepat
