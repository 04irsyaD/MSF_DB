# Database & Data Model — MSF-DB

> **Status:** PLANNING DATA — Berkas adopsi sistem saat ini.

---

## 1. Penyimpanan Data Pekerjaan (Job Queue Store)

> **Diperbarui 2026-08-03 (v2.2.0).** Antrean job kini **persisten**, tidak lagi murni in-memory.
> Job aktif tetap hidup di memori sebagai lapisan cepat, tetapi setiap perubahan status ikut ditulis
> ke SQLite (`jobs.db`) sehingga riwayat dan kode akses selamat dari restart backend. Skema tabel dan
> alasan tiap keputusannya ada di `dev-docs/architecture/database.md`; keputusan arsitekturnya di
> `dev-docs/decisions/005-persistent-job-queue-sqlite.md`.
>
> Seluruh atribut kelas `Job` di bawah dipetakan satu-lawan-satu menjadi kolom tabel, ditambah satu
> kolom turunan `file_purged`. Tidak ada atribut yang dihilangkan.

Kelas `Job` menyimpan status pekerjaan dengan struktur objek sebagai berikut:

```python
class Job:
    job_id: str                      # UUID unik pekerjaan
    project_name: str                # Nama proyek database yang didokumentasikan
    status: JobStatus                # Status pekerjaan: queued, processing, done, error, cancelled
    progress: int                    # Persentase progres keseluruhan (0-100)
    tables_total: int                # Jumlah total tabel yang dianalisis
    tables_processed: int            # Jumlah tabel yang selesai diproses
    current_table: Optional[str]     # Nama tabel yang sedang diproses oleh LLM saat ini
    created_at: str                  # Waktu pembuatan pekerjaan (ISO format UTC)
    updated_at: str                  # Waktu pembaruan status pekerjaan
    completed_at: Optional[str]      # Waktu penyelesaian pekerjaan
    error_message: Optional[str]     # Pesan kesalahan jika status pekerjaan ERROR
    preview_markdown: Optional[str]  # Cuplikan preview dokumentasi real-time
    result_filepath: Optional[str]   # Lokasi penyimpanan file hasil ekspor (.docx/.pdf) di disk kontainer
    result_filename: Optional[str]   # Nama file rekomendasi untuk diunduh
    output_format: str               # Format keluaran: docx atau pdf
    ai_provider: Optional[str]       # Provider AI yang digunakan (ollama, openai, deepseek)
    db_engine: Optional[str]         # Jenis mesin database target (postgresql, mysql, sqlite, sqlserver)
    access_code: str                 # Kode akses unik untuk pelacakan pengguna (format: MSF-[HEX_10_CHAR])
```

---

## 2. Struktur Ekstraksi Metadata Database Target
Ketika menghubungkan ke database eksternal untuk ekstraksi skema, sistem memetakan objek database ke dalam Pydantic Model berikut di `backend/app/models/schemas.py`:

### A. ColumnMetadata
Menyimpan informasi lengkap dari setiap kolom tabel:
*   `name` (str): Nama kolom.
*   `data_type` (str): Tipe data kolom (misal: `VARCHAR`, `INTEGER`).
*   `is_nullable` (bool): Apakah kolom boleh kosong (`NULL`).
*   `default_value` (Optional[str]): Nilai default kolom.
*   `max_length` (Optional[int]): Batas panjang tipe data (jika ada).
*   `is_primary_key` (bool): Penanda kunci primer.
*   `is_foreign_key` (bool): Penanda kunci asing.
*   `column_comment` (Optional[str]): Komentar/keterangan kolom di skema DB.

### B. TableMetadata
Menampung metadata lengkap untuk satu tabel:
*   `name` (str): Nama tabel.
*   `schema` (str): Nama skema database (default: `public` untuk Postgres).
*   `columns` (List[ColumnMetadata]): Daftar kolom di dalam tabel.
*   `primary_key` (List[str]): Kolom yang menjadi primary key.
*   `foreign_keys` (List[ForeignKeyMetadata]): Hubungan kunci asing ke tabel lain.
*   `indexes` (List[IndexMetadata]): Daftar indeks pada tabel tersebut.
*   `row_count` (Optional[int]): Estimasi jumlah baris data.
*   `table_comment` (Optional[str]): Komentar/keterangan tabel.
