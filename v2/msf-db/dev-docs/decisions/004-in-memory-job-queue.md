# ADR-004 — In-Memory Job Queue

> **Status:** Superseded by [ADR-005](005-persistent-job-queue-sqlite.md)
> **Tanggal:** 2026-06-27
> **Di-supersede:** 2026-08-03

> **Catatan.** Isi di bawah sengaja TIDAK diubah agar jejak keputusan tetap utuh.
> Trade-off "job hilang saat backend restart" ternyata bertentangan dengan
> Persyaratan Non-Fungsional Keandalan di `planning/prd.md`, dan konflik itu
> diselesaikan oleh ADR-005 dengan memenangkan PRD.

---

## Context

Generate dokumen AI membutuhkan waktu 10–60 detik tergantung model. Request tidak boleh memblokir HTTP response. Dibutuhkan mekanisme background processing dengan polling status.

Constraint:
- Project adalah developer tool skala personal/kecil
- Tidak ada infrastruktur Redis/RabbitMQ
- Kemudahan setup lebih penting dari durability job

---

## Decision

Menggunakan **Python `asyncio.Queue` in-memory** di `backend/app/background/job_queue.py`.

Flow:
1. Request masuk → job dibuat → job ID dikembalikan ke client
2. Job diproses oleh background worker task yang berjalan sepanjang lifetime app
3. Client polling `/api/v1/jobs/{job_id}/status` sampai selesai
4. Client download hasil dari `/api/v1/jobs/{job_id}/download`

Alternatif yang ditolak:
- **Redis + Celery:** membutuhkan Redis container tambahan, overkill untuk skala ini
- **RQ (Redis Queue):** sama, membutuhkan Redis
- **FastAPI BackgroundTasks:** tidak bisa di-monitor statusnya dengan mudah

---

## Consequences

### Positive

- Zero external dependency untuk queueing
- Setup trivial — queue hidup bersama app process
- Performa cukup untuk satu user

### Trade-offs

- Job hilang saat backend restart (tidak persistent)
- Tidak bisa scale horizontal (single process)

### Risks

- Jika backend crash saat generate sedang berjalan, job hilang dan user harus retry — diterima sebagai trade-off untuk developer tool
- Mitigasi: status job menampilkan error state yang jelas jika terjadi kegagalan
