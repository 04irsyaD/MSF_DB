# ADR-005 — Persistent Job Queue dengan SQLite

> **Status:** Accepted
> **Tanggal:** 2026-08-03
> **Men-supersede:** [ADR-004 — In-Memory Job Queue](004-in-memory-job-queue.md)

---

## Context

Dua dokumen fondasi proyek ini saling bertentangan, dan konflik tersebut tidak pernah diselesaikan.

`planning/prd.md`, Persyaratan Non-Fungsional — Keandalan menyatakan antrean pekerjaan harus
persisten dan harus pulih otomatis dari basis data SQLite lokal bila container backend mati atau
restart.

ADR-004, berstatus Accepted sejak 2026-06-27, mencantumkan "job hilang saat backend restart" sebagai
trade-off yang diterima.

Akibat nyata dari keadaan sebelum keputusan ini:

- Seluruh riwayat job hidup di dictionary memori. Restart, deploy ulang, atau crash menghapus
  semuanya, dan setiap kode akses `MSF-XXXXXXXXXX` yang sudah disalin pengguna menjadi tidak berguna.
- Bahkan tanpa restart, riwayat terhapus otomatis setelah 60 menit.
- Berkas hasil yang tertinggal di volume menjadi yatim dan tidak pernah dibersihkan siapa pun.

Membiarkan kedua dokumen bertolak belakang berbahaya untuk sesi kerja berikutnya: siapa pun yang
membaca ADR-004 akan menyimpulkan persistensi adalah kesalahan yang harus dikembalikan.

---

## Decision

**PRD menang.** Implementasi menyesuaikan cetak biru, dan ADR-004 di-supersede secara formal.

Antrean job menjadi persisten dengan SQLite melalui komponen baru
`backend/app/background/job_store.py`.

Rancangannya:

1. **Memori sebagai lapisan cepat, SQLite sebagai kebenaran yang bertahan.** Job aktif tetap hidup di
   memori. Setiap `Job.update()` memanggil callback `on_change` yang menulis barisnya ke SQLite.
2. **`JobStore` ditempatkan di `background/`, bukan `services/`,** karena ia melayani antrean job dan
   bukan logika domain. Ia tidak menjalankan job, tidak menghapus berkas dari disk, dan tidak
   mengetahui HTTP.
3. **Rekonsiliasi job yatim saat startup.** Job yang tertinggal `queued` atau `processing` ditandai
   `error`. Ini syarat kebenaran, bukan penyempurnaan: gerbang `MAX_CONCURRENT_JOBS` dihitung dari
   job aktif, sehingga tanpa rekonsiliasi tiga job yatim akan menolak setiap generate baru secara
   permanen dengan 429.
4. **`list_jobs()` tetap murni dari memori.** Gerbang konkurensi tidak boleh melihat riwayat penuh,
   karena itulah yang membuat job yatim mematikan fitur generate.
5. **Job hasil hidrasi adalah snapshot baca-saja** (`on_change` bernilai None). Aman karena hanya job
   `queued`/`processing` yang dimutasi, dan job seperti itu selalu ada di memori setelah rehidrasi.
6. **Retensi dua tingkat.** Berkas hasil dibatasi menit (`MAX_JOB_RETENTION_MINUTES`, bawaan 60),
   baris riwayat dibatasi hari (`JOB_RECORD_RETENTION_DAYS`, bawaan 30). Satu angka untuk keduanya
   akan membatalkan tujuan persistensi.
7. **Skema diberi versi** lewat `PRAGMA user_version`, sehingga perubahan skema di masa depan dapat
   mendeteksi dan menolak basis data yang lebih baru daripada kode, tanpa menambah Alembic.

Alternatif yang ditolak:

- **Redis:** menambah container dan dependensi operasional untuk kebutuhan yang hanya sekitar 1,5 MB
  data. Alasan penolakan yang sama masih berlaku seperti pada ADR-004.
- **PostgreSQL yang sudah ada di compose:** layanan itu adalah database CONTOH untuk menguji fitur
  koneksi database, bukan penyimpanan aplikasi. Memakainya akan mencampur dua peran yang berbeda.
- **SQLAlchemy ORM:** proyek sudah memakai SQLAlchemy untuk koneksi database target pengguna.
  Memakainya juga untuk penyimpanan internal mengaburkan batas antara keduanya. Modul `sqlite3`
  bawaan sudah cukup untuk satu tabel.

---

## Consequences

### Positive

- Kode akses tetap berguna setelah restart, deploy ulang, dan crash. Ini alasan utama rilis v2.2.0.
- Job yang mati karena restart terbaca `error` dengan pesan yang jelas, bukan progress bar yang
  menggantung selamanya.
- Riwayat bertahan 30 hari, sehingga statistik Admin Portal menjadi bermakna.
- Berkas hasil baru tidak lagi menjadi yatim, karena barisnya bertahan dan penyapu dapat menemukannya.
- `MAX_JOB_RETENTION_MINUTES` yang selama ini config mati kini benar-benar dibaca.

### Trade-offs

- `jobs.db` adalah aset persisten pertama proyek ini, sehingga prosedur backup dan restore menjadi
  kewajiban baru. Terdokumentasi di `backend/docs/operations/job-database-backup.md`.
- Setiap `Job.update()` kini melakukan satu penulisan SQLite. Beban ini kecil (satu baris, mode WAL)
  tetapi bukan nol.
- Masih belum bisa scale horizontal. Backend tetap `--workers 1`.

### Risks

- Volume yang terlanjur dibuat manual dengan pemilik root membuat SQLite gagal menulis dan backend
  gagal start. Mitigasi terdokumentasi di operations docs.
- `DocxExporter.export()` masih memblokir event loop. Bila kelak dibungkus `to_thread`, asumsi bahwa
  seluruh `job.update()` berjalan di satu event loop akan pecah. Mitigasi: `JobStore` sudah dibuat
  aman-thread sejak awal dengan satu lock.

### Rollback

Menghapus `jobs.db` mengembalikan perilaku ke v2.1.0. Tidak ada migrasi dari data lama, sehingga
tidak ada konversi skema yang perlu dibalik. Sistem akan membuat basis data baru yang kosong.
