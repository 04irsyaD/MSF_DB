# Security Headers Setup — HTTP Response Headers

> **Purpose:** Dokumentasi security headers yang dipasang backend MSF-DB dan cara menyetelnya.
> **DILARANG menulis credential aktual di file ini.** Gunakan referensi `.env`.

---

## Overview

**Komponen:** `app/utils/security_headers.py`, didaftarkan sebagai middleware di `app/main.py`
**Berlaku pada:** SELURUH respons backend, termasuk respons error dan penolakan API key
**Perlu setup server?** Tidak. Header dipasang aplikasi, bukan web server
**Satu-satunya yang dapat dikonfigurasi:** `HSTS_ENABLED`

### Kenapa ini ada

Standar keamanan proyek (`ai-rules/security/part-b`) mewajibkan security headers dipasang tanpa
diminta. Sebelum ini backend MSF-DB tidak memasang satu pun. Konteks yang membuatnya penting:
aplikasi ini dapat diakses publik lewat Cloudflare Tunnel dan tidak memiliki sistem login.

### Header yang dipasang

| Header | Nilai | Kegunaan |
| --- | --- | --- |
| `X-Content-Type-Options` | `nosniff` | Mencegah browser menebak tipe konten |
| `X-Frame-Options` | `DENY` | Mencegah clickjacking. `DENY`, bukan `SAMEORIGIN`, karena tidak ada halaman yang perlu menyematkan backend dalam frame |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Path lengkap tidak bocor ke situs lain |
| `Permissions-Policy` | `geolocation=(), microphone=(), camera=()` | Aplikasi tidak butuh satu pun API perangkat |
| `Cross-Origin-Opener-Policy` | `same-origin` | Memutus hubungan window dengan pembuka lintas origin |
| `Cross-Origin-Resource-Policy` | `same-origin` | Situs lain tidak dapat memuat berkas hasil generate sebagai sumber daya |
| `X-Permitted-Cross-Domain-Policies` | `none` | Mencegah akses lintas domain lewat Flash/PDF |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | **Hanya bila `HSTS_ENABLED=true`** |

### Yang sengaja TIDAK dipasang

| Header | Alasan |
| --- | --- |
| `X-XSS-Protection` | Sudah deprecated dan dihapus browser modern sejak 2019. Standar melarang memakainya |
| `Cross-Origin-Embedder-Policy` | `require-corp` memblokir sumber daya lintas origin yang tidak menyatakan izin. Halaman `/docs` memuat aset Swagger UI dari CDN, sehingga memasangnya akan mematahkan dokumentasi API. COEP lebih tepat dipasang di lapisan frontend, bukan pada API |
| `Content-Security-Policy` | Belum dipasang. CSP terutama relevan pada dokumen HTML, dan penerapannya di Next.js menuntut nonce agar hidrasi serta Monaco Editor tidak rusak. Direncanakan sebagai batch tersendiri dengan mode Report-Only lebih dulu |
| Atribut cookie `Secure`, `HttpOnly`, `SameSite` | Aplikasi ini tidak memakai cookie sama sekali. Tidak ada sesi, tidak ada login |
| Subresource Integrity | Tidak ada satu pun script atau style yang dimuat dari CDN pada frontend |

---

## Prerequisites

- Backend berjalan (`msf2-backend`)

**Check prerequisites:**

```bash
docker exec msf2-backend printenv HSTS_ENABLED
```

---

## HSTS — kapan boleh dinyalakan

Nilai bawaan `false`, dan itu **wajib dipertahankan selama pengembangan lokal**.

Browser mengingat HSTS **per host**, bukan per port atau per aplikasi. Mengirimnya sekali dari
`http://localhost` membuat browser memaksa HTTPS untuk **seluruh `localhost`** selama satu tahun,
termasuk proyek lain yang tidak ada hubungannya dengan MSF-DB. Membatalkannya menuntut pembersihan
manual di `chrome://net-internals/#hsts`, dan banyak orang tidak tahu tempat itu.

**Nyalakan hanya bila seluruh syarat ini terpenuhi:**

1. Aplikasi dilayani lewat HTTPS pada domain sungguhan, bukan `localhost`
2. Sertifikatnya sah dan diperbarui otomatis
3. Anda yakin tidak akan kembali ke HTTP pada domain itu selama setahun ke depan

Setel di `.env` lalu buat ulang container:

```bash
docker compose up -d backend
```

`docker compose restart backend` TIDAK cukup; container harus dibuat ulang agar environment terbaca.

---

## Verifikasi

Periksa header pada respons mana pun:

```bash
curl -s -D - -o /dev/null http://localhost:8001/api/health
```

Yang benar: tujuh header pada tabel di atas muncul, dan `Strict-Transport-Security` **tidak** ada
selama `HSTS_ENABLED=false`.

Pastikan unduhan tidak terblokir `Cross-Origin-Resource-Policy`:

```bash
curl -s -o /dev/null -w "%{http_code} %{size_download}\n" http://localhost:3002/api/jobs/JOB_ID/download
```

Pastikan dokumentasi API tetap ter-render:

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8001/docs
```

---

## Troubleshooting

| Gejala | Penyebab | Solusi |
| --- | --- | --- |
| Browser memaksa HTTPS di `localhost` dan aplikasi tidak dapat dibuka | HSTS pernah dikirim dari localhost | Buka `chrome://net-internals/#hsts`, masukkan `localhost` pada bagian Delete domain security policies |
| Unduhan dokumen gagal dari halaman lain | `Cross-Origin-Resource-Policy: same-origin` | Memang disengaja. Unduhan harus melalui origin yang sama; frontend sudah memakai rewrite same-origin |
| Halaman `/docs` kosong atau aset gagal dimuat | Kemungkinan COEP ikut terpasang | COEP sengaja tidak dipasang. Periksa apakah ada proxy di depan yang menambahkannya |
| Header tidak muncul sama sekali | Container belum dibuat ulang setelah perubahan kode | `docker compose up -d --build backend` |
| Aplikasi tidak dapat disematkan di iframe | `X-Frame-Options: DENY` | Memang disengaja. Bila suatu saat perlu, ubah ke `SAMEORIGIN` di `security_headers.py`, jangan dihapus |

---

## Maintenance

| Tindakan | Cara |
| --- | --- |
| Menambah atau mengubah header | `app/utils/security_headers.py`, kamus `SECURITY_HEADERS` |
| Menambah CSP | Batch tersendiri. Mulai dari `Content-Security-Policy-Report-Only` sesuai anjuran standar, amati pelanggarannya, baru tegakkan |
| Menonaktifkan sebuah header sementara | Tidak ada saklar per header. Sengaja: mematikan security header harus terlihat di diff kode, bukan tersembunyi di env |
