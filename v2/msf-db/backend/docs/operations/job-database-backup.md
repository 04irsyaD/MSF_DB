# Database Backup Setup — jobs.db (Riwayat Job)

> **Purpose:** Dokumentasi backup dan restore basis data riwayat job MSF-DB.
> **DILARANG menulis credential aktual di file ini.** Gunakan referensi `.env`.

---

## Overview

**Database:** `jobs.db`
**Type:** SQLite (mode WAL)
**Lokasi di container:** `/app/outputs/jobs.db` (dapat diubah lewat `JOBS_DB_PATH` di `.env`)
**Volume Docker:** `msf2_backend_outputs`
**Backup Schedule:** disarankan harian
**Retention backup:** disarankan 14 hari
**Storage:** lokal di host

### Kenapa ini butuh setup di server

Sebelum v2.2.0, MSF-DB tidak punya aset persisten sama sekali: seluruh riwayat job hidup di memori
dan hilang setiap restart. Mulai v2.2.0, `jobs.db` adalah **aset persisten pertama proyek ini**.
Isinya adalah satu-satunya penghubung antara kode akses `MSF-XXXXXXXXXX` yang dipegang pengguna
dengan pekerjaan mereka. Kehilangan berkas ini berarti seluruh kode akses yang beredar menjadi tidak
berguna.

Yang TIDAK ada di dalamnya: kredensial database target, isi berkas DOCX/PDF, dan data pengguna.
Hanya metadata job.

---

## Prerequisites

- Docker dan Docker Compose terpasang di server
- Container `msf2-backend` pernah berjalan minimal sekali sehingga volume terbentuk
- Ruang disk lapang; ukuran wajar sekitar 1,5 MB untuk 30 hari pemakaian normal

**Check prerequisites:**

```bash
docker volume ls | grep msf2_backend_outputs
```

```bash
docker exec msf2-backend ls -l /app/outputs/jobs.db
```

---

## Cara Backup

SQLite tidak boleh disalin dengan `cp` selagi ada penulisan berjalan, terutama pada mode WAL.
Gunakan perintah `.backup` bawaan SQLite yang aman terhadap penulisan bersamaan.

```bash
docker exec msf2-backend python -c "import sqlite3,os; s=sqlite3.connect(os.getenv('JOBS_DB_PATH','/app/outputs/jobs.db')); d=sqlite3.connect('/app/outputs/jobs-backup.db'); s.backup(d); d.close(); s.close()"
```

```bash
docker cp msf2-backend:/app/outputs/jobs-backup.db "./backup/jobs-$(date +%Y%m%d).db"
```

```bash
docker exec msf2-backend rm /app/outputs/jobs-backup.db
```

### Menjadwalkan harian

Pada Linux, masukkan ketiga perintah di atas ke sebuah skrip lalu daftarkan di cron:

```bash
0 2 * * * /opt/msf-db/backup-jobs-db.sh >> /var/log/msf-jobs-backup.log 2>&1
```

Pada Windows, pakai Task Scheduler dengan pemicu harian yang menjalankan skrip yang sama.

---

## Cara Restore

1. Hentikan backend agar tidak ada penulisan selama pemulihan.

```bash
docker compose stop backend
```

2. Salin berkas backup ke dalam volume.

```bash
docker cp "./backup/jobs-20260803.db" msf2-backend:/app/outputs/jobs.db
```

3. Hapus berkas sisa WAL bila ada, agar SQLite tidak memakai jurnal lama.

```bash
docker exec msf2-backend sh -c "rm -f /app/outputs/jobs.db-wal /app/outputs/jobs.db-shm"
```

4. Nyalakan kembali.

```bash
docker compose start backend
```

---

## Verifikasi

Pastikan berkas terbaca, versi skemanya dikenali, dan jumlah barisnya masuk akal:

```bash
docker exec msf2-backend python -c "import sqlite3,os; c=sqlite3.connect(os.getenv('JOBS_DB_PATH','/app/outputs/jobs.db')); print('versi skema:', c.execute('PRAGMA user_version').fetchone()[0]); print('jumlah baris:', c.execute('SELECT COUNT(*) FROM jobs').fetchone()[0]); print('integritas:', c.execute('PRAGMA integrity_check').fetchone()[0])"
```

Keluaran yang benar: versi skema `1`, integritas `ok`.

Verifikasi fungsional: ambil satu kode akses dari basis data lalu lacak lewat API.

```bash
curl -s http://localhost:8001/api/jobs/by-code/MSF-XXXXXXXXXX
```

---

## Troubleshooting

| Gejala | Penyebab | Solusi |
| --- | --- | --- |
| Backend gagal start, log memuat `unable to open database file` | Volume dibuat manual dengan pemilik root, sedangkan container berjalan sebagai `appuser` | `docker run --rm -v msf2_backend_outputs:/data alpine chown -R 1000:1000 /data`, lalu start ulang backend |
| `PRAGMA integrity_check` mengembalikan selain `ok` | Berkas rusak, biasanya karena disalin dengan `cp` saat ada penulisan | Restore dari backup terakhir. Jangan pakai `cp` untuk backup |
| Versi skema lebih besar dari yang didukung kode | Basis data berasal dari versi aplikasi yang lebih baru | Jangan turunkan versi aplikasi. Pakai backup yang sesuai, atau kosongkan `jobs.db` dan terima kehilangan riwayat |
| Ukuran `jobs.db` membengkak jauh di atas perkiraan | Retensi riwayat disetel terlalu panjang | Turunkan `JOB_RECORD_RETENTION_DAYS` di `.env`, lalu restart backend |

### Berkas hasil yatim dari sebelum v2.2.0

Penyapu retensi bekerja dari baris basis data. Berkas DOCX/PDF yang tertinggal di volume **sebelum**
v2.2.0 tidak punya baris pasangan, sehingga tidak akan pernah dihapus otomatis. Bersihkan sekali
secara manual:

```bash
docker exec msf2-backend sh -c "find /app/outputs -name 'msf_doc_*' -mmin +120 -print"
```

Periksa daftarnya lebih dulu, baru hapus:

```bash
docker exec msf2-backend sh -c "find /app/outputs -name 'msf_doc_*' -mmin +120 -delete"
```

---

## Maintenance

| Tindakan | Perintah |
| --- | --- |
| Lihat ukuran basis data | `docker exec msf2-backend ls -lh /app/outputs/jobs.db` |
| Ubah lokasi basis data | Setel `JOBS_DB_PATH` di `.env`, lalu `docker compose up -d backend` |
| Ubah masa simpan riwayat | Setel `JOB_RECORD_RETENTION_DAYS` di `.env`, lalu restart backend |
| Kosongkan riwayat sepenuhnya | Hentikan backend, hapus `jobs.db`, start ulang. Berkas dibuat ulang kosong |

Rollback: menghapus `jobs.db` mengembalikan perilaku ke v2.1.0 tanpa migrasi apa pun, karena tidak
ada konversi skema dari data lama.
