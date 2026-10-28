# Rate Limiting Setup — Pembatasan per Alamat IP

> **Purpose:** Dokumentasi rate limiting per IP pada endpoint mahal dan endpoint autentikasi admin.
> **DILARANG menulis credential aktual di file ini.** Gunakan referensi `.env`.

---

## Overview

**Library:** slowapi
**Lokasi kode:** `app/utils/rate_limit.py`, didaftarkan di `app/main.py`
**Penyimpanan hitungan:** memori proses backend (hilang saat restart, dan tidak dibagi antar worker)
**Endpoint yang dibatasi:**

| Endpoint | Variabel | Bawaan |
| --- | --- | --- |
| `POST /api/generate/from-ddl` | `RATE_LIMIT_GENERATE` | 10/minute |
| `POST /api/generate/from-db` | `RATE_LIMIT_GENERATE` | 10/minute |
| `POST /api/admin/verify` | `RATE_LIMIT_ADMIN_VERIFY` | 5/minute |

### Kenapa ini butuh setup di server

MSF-DB **tidak memiliki sistem login sama sekali** dan dapat diakses publik lewat Cloudflare Tunnel.
Siapa pun yang mengetahui alamatnya dapat menjalankan generate, yang berarti memakai kuota API
berbayar pemilik sistem. Rate limiting karena itu bukan pelengkap, melainkan satu-satunya pagar
biaya yang ada. Pembatasan pada `/api/admin/verify` memperlambat penebakan passcode.

### Dua jenis 429 yang berbeda arti

Klien harus membedakan keduanya lewat `error_code`, bukan lewat status:

| Kondisi | `error_code` | Header `Retry-After` | Arti bagi pengguna |
| --- | --- | --- | --- |
| Tiga job sudah berjalan | `JOB_QUEUE_FULL` | tidak ada | Tunggu pekerjaan lain selesai |
| Melebihi batas per IP | `RATE_LIMIT_EXCEEDED` | ada, dalam detik | Terlalu sering, tunggu sebentar |

---

## Prerequisites

- Backend berjalan (`msf2-backend`)
- `.env` memuat empat variabel `RATE_LIMIT_*`

**Check prerequisites:**

```bash
docker exec msf2-backend printenv RATE_LIMIT_ENABLED RATE_LIMIT_GENERATE RATE_LIMIT_ADMIN_VERIFY RATE_LIMIT_TRUST_FORWARDED_FOR
```

---

## Cara Menyetel

Format nilai mengikuti sintaks slowapi: `<jumlah>/<satuan>`, misalnya `10/minute`, `100/hour`,
`5/second`. Beberapa batas dapat digabung dengan titik koma, misalnya `10/minute;200/hour`.

Ubah di `.env`, lalu terapkan:

```bash
docker compose up -d backend
```

`docker compose restart backend` TIDAK cukup; container harus dibuat ulang agar environment terbaca.

Angka limit dibaca ulang setiap request, sedangkan saklar `RATE_LIMIT_ENABLED` dibaca sekali saat
proses start.

---

## RATE_LIMIT_TRUST_FORWARDED_FOR — kapan boleh dinyalakan

Nilai bawaan `false`, dan sebaiknya tetap begitu.

**Nyalakan HANYA bila** backend berada di belakang proxy tepercaya yang Anda kendalikan (Cloudflare
Tunnel, Nginx, Traefik) DAN proxy itu menimpa header `X-Forwarded-For` dengan alamat asli klien.

**Bahaya bila salah:**

- Dinyalakan tanpa proxy tepercaya: klien mana pun dapat mengirim `X-Forwarded-For` palsu berbeda
  setiap request, sehingga rate limit **dapat dilewati sepenuhnya**. Ini lebih buruk daripada tidak
  memasang rate limit, karena memberi rasa aman yang keliru.
- Dibiarkan `false` padahal ada proxy: seluruh pengguna terlihat sebagai satu alamat IP milik proxy,
  sehingga mereka saling menjatuhkan limit dan sebagian pengguna sah ikut terblokir.

Gejala kasus kedua: banyak pengguna berbeda melaporkan 429 padahal masing-masing baru menekan
Generate sekali.

---

## Verifikasi

Kirim permintaan melebihi batas dan periksa bentuk responsnya:

```bash
for i in $(seq 1 13); do curl -s -o /dev/null -w "%{http_code} " -X POST http://localhost:8001/api/generate/from-ddl -H "Content-Type: application/json" -d '{"sql_content":"CREATE TABLE a (id INT PRIMARY KEY);","ai_provider":"ollama","model":"llama3.2","language":"Indonesian","detail_level":"simple","project_name":"x","author":"D","output_format":"docx"}'; done
```

Lalu lihat isi responsnya:

```bash
curl -s -D - -o /dev/null -X POST http://localhost:8001/api/generate/from-ddl -H "Content-Type: application/json" -d '{"sql_content":"CREATE TABLE a (id INT PRIMARY KEY);","ai_provider":"ollama","model":"llama3.2","language":"Indonesian","detail_level":"simple","project_name":"x","author":"D","output_format":"docx"}'
```

Yang benar: setelah batas terlampaui, status `429`, body memuat `"error_code":"RATE_LIMIT_EXCEEDED"`,
dan header `Retry-After` berisi angka detik.

---

## Cara Mematikan Saat Insiden

Bila pembatasan ternyata terlalu ketat dan mengganggu pemakaian wajar:

```bash
docker compose up -d backend
```

setelah menyetel di `.env`:

```
RATE_LIMIT_ENABLED=false
```

Ini mematikan seluruh pembatasan per IP seketika. Gerbang `MAX_CONCURRENT_JOBS` **tetap berlaku**
dan tidak terpengaruh saklar ini, sehingga sistem masih terlindung dari kelebihan beban job.

Alternatif yang lebih lunak: naikkan angkanya, misalnya `RATE_LIMIT_GENERATE=60/minute`.

---

## Troubleshooting

| Gejala | Penyebab | Solusi |
| --- | --- | --- |
| Semua pengguna kena 429 bersamaan | Backend di belakang proxy dengan `RATE_LIMIT_TRUST_FORWARDED_FOR=false` | Nyalakan flag itu, tetapi hanya bila proxy tepercaya |
| Rate limit tidak pernah aktif | `RATE_LIMIT_ENABLED=false`, atau container tidak dibuat ulang setelah `.env` diubah | Periksa `docker exec msf2-backend printenv` |
| Frontend menampilkan pesan yang salah untuk 429 | Klien membaca status saja, tidak membaca `error_code` | Perbaiki di sisi klien; server sudah mengirim `error_code` |
| Hitungan limit ter-reset sendiri | Backend restart, atau hitungan memang disimpan di memori | Perilaku yang diharapkan. Penyimpanan bersama (Redis) belum dipakai |

---

## Maintenance

| Tindakan | Cara |
| --- | --- |
| Menambah endpoint yang dibatasi | Tambahkan dekorator `@limiter.limit(...)` di router; endpoint wajib punya parameter bernama `request` bertipe `Request` |
| Mengubah pesan 429 | `app/utils/rate_limit.py`, fungsi `rate_limit_exceeded_handler` |
| Menaikkan skala ke banyak worker | Hitungan saat ini per proses. Backend dijalankan dengan `--workers 1`; menambah worker memerlukan penyimpanan bersama seperti Redis |
