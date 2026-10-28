# LAPORAN TASK BACKEND

Tanggal: 2026-10-02
Task: sqlite-persistent-job-queue
Repo: msf-app
Branch: dev
Commit: (pending)

---

## 1) Deskripsi Perubahan

Implementasi SQLite persistence layer untuk Job Queue backend.
Sebelumnya, seluruh status job disimpan secara in-memory di `Dict[str, Job]` —
artinya jika backend di-restart, semua job aktif hilang tanpa jejak.

### Pendekatan Implementasi

Dipilih `sqlite3` (built-in Python) alih-alih `aiosqlite` untuk menghindari
penambahan dependency baru. Operasi DB berjalan secara synchronous (tidak
memblokir event loop karena dipanggil dari `Job.update()` yang sudah
dieksekusi dalam konteks thread worker).

### File Baru: `job_store.py`

Modul tipis yang mengekspos 5 fungsi:
- `init_db()` — buat tabel + index jika belum ada (idempotent)
- `upsert_job(dict)` — INSERT OR UPDATE satu job
- `get_job_row(job_id)` — ambil satu job dari DB
- `get_inflight_jobs()` — ambil semua job status queued/processing (untuk startup restore)
- `delete_job_row(job_id)` — hapus baris job dari DB

### Modifikasi: `job_queue.py`

| Titik Modifikasi | Perubahan |
|-----------------|-----------|
| Import | Tambah `from app.background import job_store` |
| `Job.update()` | Tambah `job_store.upsert_job()` setelah setiap update state |
| `Job._to_store_dict()` | Method baru — serialisasi Job ke dict untuk SQLite |
| `JobQueue.__init__()` | Panggil `init_db()` + `_restore_inflight_jobs()` |
| `JobQueue._restore_inflight_jobs()` | Method baru — load in-flight jobs dan tandai ERROR |
| `JobQueue.create_job()` | Tambah `upsert_job()` setelah buat job baru |
| `JobQueue.delete_job()` | Tambah `delete_job_row()` saat hapus job |

**Desain penting:** semua `job_store` call dibungkus `try/except pass` — jika SQLite
gagal (disk penuh, permission error), alur utama job generation tetap berjalan.
Persistence adalah "nice to have", bukan blocker.

### Perilaku Saat Restart

```
Backend restart
    |
    v
JobQueue.__init__()
    |
    +-- init_db() → schema siap
    |
    +-- _restore_inflight_jobs()
         |
         +-- SELECT jobs WHERE status IN ('queued', 'processing')
         |
         +-- Untuk setiap job yang ditemukan:
              status = ERROR
              error_message = "Pekerjaan ini tidak selesai karena backend di-restart. Silakan ulangi."
              |
              +-- Tampil di Dashboard user dengan badge merah
```

---

## 2) Tujuan dan Manfaat

- **Tidak ada job ghost:** Setelah restart, user tidak perlu menebak apakah
  pekerjaan mereka selesai atau tidak — langsung terlihat statusnya.
- **Zero breaking change:** Semua router, schema Pydantic, dan API contract
  tidak berubah. Test suite existing (32 test) tidak perlu dimodifikasi.
- **Zero new dependency:** `sqlite3` sudah built-in Python — tidak ada entry
  baru di `requirements.txt`.
- **Fault-tolerant:** Kegagalan SQLite tidak mengganggu generate job.

---

## 3) Daftar File yang Diubah dan Dibuat

- `backend/app/background/job_store.py` [NEW]
- `backend/app/background/job_queue.py` [MODIFY]
- `dev-docs/ai/TASKS.md` [MODIFY]
- `dev-docs/ai/PROJECT_MENTAL_MODEL.md` [MODIFY]
- `dev-docs/commit-logs/2026-10-02.md` [MODIFY]
- `dev-docs/COMMIT_LOG.md` [MODIFY]
- `TODO.md` [MODIFY]

---

## 4) Verifikasi

| # | Skenario | Ekspektasi | Status |
|---|----------|------------|--------|
| 1 | `pytest` backend 32 test | Semua pass, interface tidak berubah | PASS (tidak ada modifikasi test) |
| 2 | `init_db()` dipanggil saat startup | File `msf_jobs.db` terbentuk di OUTPUT_DIR | PASS (manual) |
| 3 | `create_job()` → row tersimpan di DB | SQLite berisi baris dengan status=queued | PASS (manual) |
| 4 | `Job.update(status=DONE)` → row diupdate | SQLite berisi status=done | PASS (manual) |
| 5 | Restart backend → in-flight job muncul sebagai ERROR | Dashboard user tampil badge merah dengan pesan informatif | PASS (manual) |
| 6 | Anti-Monster Rule | `job_store.py` = 95 baris, `job_queue.py` < 280 baris | PASS |
| 7 | Git Push Ban | Tidak ada `git push` dijalankan | PASS |

---

## 5) Catatan untuk Developer

- **Lokasi DB:** `$OUTPUT_DIR/msf_jobs.db`. Jika tidak di-set, fallback ke `/tmp/`.
  Untuk Docker: pastikan `OUTPUT_DIR` menunjuk ke volume persistent.
- **Schema sederhana:** Tidak ada migration system. Jika schema perlu berubah
  di masa depan, cukup hapus file `.db` lama (data job lama hilang, tapi itu
  acceptable untuk developer tool skala kecil).
- **`preview_markdown` bisa besar:** Untuk database dengan banyak tabel, kolom
  `preview_markdown` di SQLite bisa berukuran besar. Jika jadi masalah di masa
  depan, bisa dipisah ke tabel terpisah atau disimpan sebagai file.
