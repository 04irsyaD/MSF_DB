# Operations — Template Dokumen DOCX

> **Status:** OPERATIONS DOC — prosedur setup dan pemeliharaan di server.
> **Terkait:** ADR-006, `planning/spec-template-dokumentasi-tsd.md` section 9.

---

## 1. Apa

Berkas template Word di `backend/templates/` yang diisi `docxtpl` saat pengguna memilih
`structure_template = msf_tsd`. Template aslinya yang menjadi dokumen keluaran; kode hanya mengisi
titik-titik datanya.

Berkas yang ada saat ini:

| Berkas | Dipakai oleh | Ukuran |
| --- | --- | --- |
| `tsd.docx` | `structure_template = msf_tsd` | sekitar 1,7 MB |

## 2. Kenapa butuh setup di server

Direktori template adalah **bind mount**, bukan bagian dari image. `docker-compose.yml` memasang:

```yaml
    volumes:
      - ./backend/templates:/app/templates  # Template Word
```

Artinya isi direktori **host** menimpa isi direktori di dalam image. Bila repositori tidak ter-clone
utuh di server, atau direktori host kosong, template hilang dan generate dengan `msf_tsd` gagal
dengan `FileNotFoundError` meskipun image-nya benar.

Ini bukan hipotetis: berkas `.docx` sempat tertelan aturan `*.docx` di `.gitignore` sehingga tidak
pernah masuk repositori sama sekali. Negasi `!backend/templates/*.docx` sekarang mencegahnya, dan
ada test yang menjaganya.

## 3. Prasyarat

* Repositori ter-clone utuh di server, termasuk `backend/templates/tsd.docx`
* Container `msf2-backend` dibangun dari `requirements.txt` yang memuat `docxtpl`
* Variabel `TEMPLATES_DIR` bernilai `/app/templates` (bawaan; lihat `.env`)

## 4. Langkah setup

1. Pastikan berkas template ikut ter-clone:

```bash
ls -la backend/templates/
```

Harus menampilkan `tsd.docx`. Bila kosong, periksa apakah `.gitignore` di repositori masih memuat
negasi `!backend/templates/*.docx`.

2. Bangun ulang dan jalankan container:

```bash
docker compose build backend && docker compose up -d backend
```

3. Pastikan template terlihat dari dalam container:

```bash
docker exec msf2-backend ls -la /app/templates
```

## 5. Verifikasi

Berhasil bila perintah pada langkah 3 menampilkan `tsd.docx` dengan ukuran bukan nol, dan generate
dengan `structure_template = msf_tsd` menghasilkan berkas DOCX tanpa error.

Verifikasi dependensi di dalam container:

```bash
docker exec msf2-backend python -c "import docxtpl; print(docxtpl.__version__)"
```

## 6. Troubleshooting

| Gejala | Sebab | Tindakan |
| --- | --- | --- |
| Job gagal dengan `Berkas template 'tsd.docx' tidak ditemukan` | Direktori host kosong menimpa isi image | Periksa `ls backend/templates/` di host, lalu `git pull` |
| `ls /app/templates` kosong padahal host berisi | Bind mount tidak terpasang | Periksa blok `volumes` pada `docker-compose.yml`, lalu `docker compose up -d --force-recreate backend` |
| `ModuleNotFoundError: docxtpl` | Image dibangun sebelum dependensi ditambahkan | `docker compose build --no-cache backend` |
| Render gagal dengan `Encountered unknown tag 'endfor'` | Tag perulangan tersusun salah di template | Perulangan baris butuh tiga baris: tag `for`, isi, tag `endfor`. Jalankan ulang skrip penyiapan, jangan menyunting tag manual di Word |
| Berkas hasil ditolak karena melebihi batas | Jumlah tabel terlalu besar untuk `MAX_OUTPUT_SIZE_MB` | Kurangi jumlah tabel, atau naikkan nilainya di `.env` secara sadar |

## 7. Pemeliharaan

**Mengganti atau memperbarui template.** Template adalah **kode**, bukan data. Tidak ada endpoint
upload, dan tidak boleh ada. `docxtpl` menjalankan Jinja2, sehingga template yang dapat dikendalikan
pengguna berarti eksekusi ekspresi di server, sementara endpoint generate dapat diakses anonim.

Prosedurnya:

1. Jalankan ulang skrip penyiapan di mesin pengembangan:

```bash
python scripts/siapkan_template_tsd.py <dokumen-sumber.docx> templates/tsd.docx --buang-gambar-besar 0.5
```

2. Jalankan test template: `pytest tests/test_template_tsd.py`
3. Commit, review, lalu `git pull` di server
4. Restart container: `docker compose restart backend`

**Menambah template baru.** Tambahkan nilai pada `StructureTemplate` di `app/models/schemas.py` dan
entri pada `_BERKAS_TEMPLATE` di `app/services/renderers/docx_template_renderer.py`. Nama berkas
wajib konstanta di kode; nilai dari request tidak boleh pernah dirangkai menjadi path.

**Catatan kredensial.** Berkas ini berada di dalam repositori dan ikut ter-push ke GitHub. Dilarang
menuliskan password, token, IP server aktual, atau secret apa pun di sini. Rujuk `.env` atau
`prod-docs/` bila diperlukan.
