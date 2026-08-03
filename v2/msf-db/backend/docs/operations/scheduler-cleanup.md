# Scheduler Setup — Pembersihan Berkas dan Riwayat Job

> **Purpose:** Dokumentasi dua pembersihan terjadwal yang berjalan di dalam backend MSF-DB.
> **DILARANG menulis credential aktual di file ini.** Gunakan referensi `.env`.

---

## Overview

**Nama:** cleanup loop
**Jenis:** asyncio task di dalam proses backend, BUKAN cron sistem
**Lokasi kode:** `app/main.py` (lifespan) dan `app/background/job_queue.py`
**Interval:** setiap 15 menit
**Dimulai:** otomatis saat backend start
**Dihentikan:** otomatis saat backend shutdown

### Kenapa ini butuh setup di server

Tidak ada yang perlu dipasang: penjadwal berjalan di dalam proses backend, sehingga tidak
memerlukan cron, supervisor, maupun systemd. Yang perlu dipahami operator adalah **apa yang
dihapusnya**, karena penjadwal ini menghapus data secara permanen dan angkanya diatur lewat `.env`.

### Dua pembersihan dengan umur berbeda

| Pembersihan | Yang dihapus | Yang DIPERTAHANKAN | Diatur oleh | Bawaan |
| --- | --- | --- | --- | --- |
| `purge_expired_files` | Berkas DOCX/PDF di disk | Baris riwayat, ditandai `file_purged` | `MAX_JOB_RETENTION_MINUTES` | 60 menit |
| `purge_expired_records` | Baris riwayat di `jobs.db` | — | `JOB_RECORD_RETENTION_DAYS` | 30 hari |

Pemisahan ini disengaja. Berkas hasil berukuran puluhan MB sehingga dibatasi ruang disk, sedangkan
satu baris riwayat hanya sekitar 1 KB. Menyamakan keduanya membuat kode akses mati setelah satu jam,
yang membatalkan tujuan persistensi.

Akibat yang terlihat pengguna: setelah `MAX_JOB_RETENTION_MINUTES`, kode akses masih dapat dilacak
dan mengembalikan status `done`, tetapi tombol unduh menjawab **410 `RESULT_EXPIRED`**, bukan 404.
Setelah `JOB_RECORD_RETENTION_DAYS`, kode akses menjadi 404.

### Rekonsiliasi saat startup

Terpisah dari kedua pembersihan di atas, backend menjalankan rekonsiliasi satu kali setiap start,
sebelum melayani request. Job yang tertinggal berstatus `queued` atau `processing` (karena backend
mati di tengah pekerjaan) ditandai `error` dengan pesan "Pekerjaan terhenti karena server dimulai
ulang."

Ini bukan kerapian, melainkan syarat kebenaran: gerbang `MAX_CONCURRENT_JOBS` dihitung dari job
aktif, sehingga tanpa rekonsiliasi tiga job yatim akan menolak setiap request generate baru secara
permanen dengan 429.

---

## Prerequisites

- Backend berjalan (`msf2-backend`)
- `.env` sudah memuat `MAX_JOB_RETENTION_MINUTES` dan `JOB_RECORD_RETENTION_DAYS`

**Check prerequisites:**

```bash
docker exec msf2-backend printenv MAX_JOB_RETENTION_MINUTES JOB_RECORD_RETENTION_DAYS
```

---

## Cara Mengubah Retensi

1. Ubah nilainya di `.env` pada direktori `v2/msf-db/`.
2. Terapkan dengan membuat ulang container agar environment terbaca:

```bash
docker compose up -d backend
```

`docker compose restart backend` TIDAK cukup untuk perubahan environment; container harus dibuat ulang.

---

## Verifikasi

Pembersihan hanya menulis log bila benar-benar ada yang dihapus. Pantau lognya:

```bash
docker logs -f msf2-backend | grep -i "Pembersihan terjadwal"
```

Baris yang muncul memuat `berkas_dihapus` dan `baris_dihapus`.

Rekonsiliasi startup dapat diverifikasi setelah restart:

```bash
docker logs msf2-backend | grep -i "Job yatim"
```

Uji cepat tanpa menunggu 15 menit — turunkan retensi berkas menjadi 1 menit, buat satu job,
tunggu siklus berikutnya, lalu coba unduh:

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8001/api/jobs/JOB_ID/download
```

Nilai `410` berarti pembersihan berkas bekerja dan baris riwayatnya bertahan. Kembalikan nilai
retensi setelah pengujian.

---

## Troubleshooting

| Gejala | Penyebab | Solusi |
| --- | --- | --- |
| Berkas hasil tidak pernah dihapus | Backend baru start kurang dari 15 menit lalu | Tunggu satu siklus penuh; penjadwal tidur dulu baru bekerja |
| Log memuat `Error in job cleanup loop` | Kegagalan akses disk atau basis data | Periksa izin volume; lihat `job-database-backup.md` bagian Troubleshooting |
| Riwayat hilang jauh lebih cepat dari 30 hari | `JOB_RECORD_RETENTION_DAYS` diubah, atau container dibuat ulang tanpa `.env` terbaca | Periksa `docker exec msf2-backend printenv` |
| Setiap generate dijawab 429 padahal tidak ada job berjalan | Rekonsiliasi startup gagal | Periksa log startup; sementara pulihkan lewat `POST /api/admin/cleanup` |
| Berkas `msf_doc_*` menumpuk tanpa baris pasangan | Sisa dari sebelum v2.2.0 | Bersihkan manual, lihat `job-database-backup.md` |

---

## Maintenance

| Tindakan | Cara |
| --- | --- |
| Menghentikan sementara pembersihan | Setel `MAX_JOB_RETENTION_MINUTES` dan `JOB_RECORD_RETENTION_DAYS` ke angka besar, lalu `docker compose up -d backend`. Tidak ada saklar mati khusus |
| Memaksa pembersihan sekarang | Restart backend lalu tunggu siklus, atau pakai `POST /api/admin/cleanup` yang menghapus SELURUH riwayat (bukan hanya yang kedaluwarsa) |
| Mengubah interval 15 menit | Perlu perubahan kode di `app/main.py`; belum dapat dikonfigurasi lewat env |

Peringatan: `POST /api/admin/cleanup` bukan versi manual dari penjadwal ini. Endpoint itu
membatalkan seluruh job aktif dan menghapus seluruh riwayat tanpa memandang umur.
