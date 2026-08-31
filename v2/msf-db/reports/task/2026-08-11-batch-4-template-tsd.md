# Laporan Task — Batch 4 Template TSD dengan docxtpl

> **Tanggal:** 2026-08-11
> **Branch:** `dev`
> **Rujukan:** `planning/plan-template-dokumentasi-tsd-batch-4.md`, ADR-006
> **Status commit:** perubahan disiapkan AI, **eksekusi commit oleh human developer**

---

## 1. Summary

1. Keluaran DOCX kini dapat berbentuk Technical Specification Document dengan mengisi template Word
   aslinya lewat `docxtpl`, bukan menirunya dengan kode. Ini membalik strategi v1 yang menghasilkan
   43 skrip tanpa pernah konvergen.
2. Dokumen TSD terisi 7,7 MB diubah menjadi kerangka 1,7 MB lewat skrip yang dapat diulang. Dokumen
   sumber tidak pernah diubah.
3. Tiga asumsi pada rencana terbukti salah saat dikerjakan dan diperbaiki: urutan elemen dokumen
   tidak seragam, struktur perulangan `docxtpl` membutuhkan tiga baris, dan gambar terbesar bersifat
   anchored sehingga luput dari `inline_shapes`.
4. Satu lubang keamanan diam-diam ditutup: `.gitignore` menelan berkas template sehingga prinsip
   "template hanya dari repositori" runtuh tanpa pesan error.
5. Test naik dari 195 menjadi 222, seluruhnya lulus.

## 2. Files changed

### Berkas baru

| Berkas | Isi |
| --- | --- |
| `backend/scripts/siapkan_template_tsd.py` | Skrip penyiapan template, dapat diulang |
| `backend/templates/tsd.docx` | Template TSD hasil penyiapan, 1,7 MB |
| `backend/app/services/renderers/docx_template_renderer.py` | `DocumentModel` menjadi DOCX lewat docxtpl |
| `backend/docs/operations/document-templates.md` | Prosedur server dan jebakan bind mount |
| `dev-docs/decisions/006-template-docx-docxtpl.md` | ADR-006 |
| `backend/tests/test_template_tersedia.py` | Prasyarat dependensi dan gitignore |
| `backend/tests/test_template_tsd.py` | Struktur template dan render sungguhan |
| `backend/tests/test_docx_template_renderer.py` | Renderer, sandbox, keamanan path |
| `backend/tests/test_generate_structure_routing.py` | Pemilihan renderer dan batas ukuran |
| `reports/task/2026-08-11-batch-4-template-tsd.md` | Laporan ini |

### Berkas diubah

| Berkas | Perubahan |
| --- | --- |
| `v2/msf-db/.gitignore` | Negasi `!backend/templates/*.docx` |
| `backend/requirements.txt` | `docxtpl==0.20.2` |
| `backend/app/models/schemas.py` | Nilai enum `MSF_TSD` |
| `backend/app/routers/generate.py` | `pilih_keluaran_docx`, `batasi_ukuran_keluaran`, model dialirkan ke renderer |
| `backend/tests/test_structure_template.py` | Menyesuaikan jumlah nilai enum |
| `.env.example` | `MAX_OUTPUT_SIZE_MB` |
| `dev-docs/CHANGELOG.md`, `ai/CURRENT_STATE.md`, `ai/MODULE_MAP.md`, `ai/TASKS.md` | Sinkronisasi |

## 3. Verify commands

Dijalankan dari `v2/msf-db/backend`:

```bash
./.venv/Scripts/python.exe -m pytest -q
```

```bash
./.venv/Scripts/python.exe -m ruff check app tests scripts
```

Hasil: **222 passed**. Ruff bersih pada seluruh berkas baru dan berkas yang disentuh; satu-satunya
sisa pada berkas tersentuh adalah `asyncio` menganggur di `generate.py`, yang sudah ada sebelumnya
dan tercatat sebagai T-021.

## 4. Temuan selama pengerjaan

### 4.1 `.gitignore` menelan berkas template

`v2/msf-db/.gitignore` baris 32 memuat `*.docx`. Template yang diletakkan di `backend/templates/`
karena itu diabaikan git tanpa satu pun pesan error: tidak masuk repositori, tidak ikut ter-clone di
server, dan prinsip "template hanya dari repositori" pada spec section 9.1 runtuh secara diam-diam.
Ditutup dengan negasi beserta test penjaga.

Jebakan tambahan yang perlu diketahui: `git check-ignore -v` mengembalikan **exit 0 juga ketika yang
cocok adalah pola negasi**, padahal artinya berkas tersebut justru tidak diabaikan. Pemeriksaan
karena itu memakai `git status --porcelain`, yang tidak dapat dibaca terbalik.

### 4.2 Urutan elemen dokumen tidak seragam

Rencana berasumsi setiap seksi berbentuk `Heading 3` diikuti tabel lalu paragraf pemisah. Kenyataan
dari 109 tabel field: 61 langsung sesudah heading, **46 didahului paragraf kosong**, dan 2 didahului
caption. Deteksi berbasis kedekatan menyisakan puluhan tabel yatim.

Diganti dengan deteksi berbasis rentang: seksi 3.4 menempati elemen body 357 sampai 699, dan
seluruh isinya dibuang kecuali satu heading contoh beserta satu tabel field.

### 4.3 Perulangan docxtpl membutuhkan tiga baris

Rencana menaruh `{%tr for %}`, isi, dan `{%tr endfor %}` pada satu baris. Render gagal dengan
`Encountered unknown tag 'endfor'`.

Sebabnya: pada `docxtpl`, **seluruh baris yang memuat tag `{%tr %}` digantikan oleh tag itu**, jadi
barisnya tidak bertahan. Menaruh ketiganya pada satu baris membuat baris isi ikut lenyap. Susunan
yang benar: baris tag `for`, baris isi, baris tag `endfor`.

Test struktur saja tidak menangkap ini; yang membongkarnya adalah test render end-to-end.

### 4.4 Gambar terbesar bersifat anchored

Gambar 5 MB pada dokumen sumber adalah drawing anchored alias mengambang, dan `inline_shapes` hanya
melihat gambar inline. Ditambah, menghapus elemen gambar saja tidak mengecilkan berkas: relasinya
harus ikut dilepas dengan `drop_rel`, kalau tidak berkas medianya tetap ikut tersimpan di dalam
paket. Setelah keduanya diperbaiki, ukuran turun dari 6,72 MB menjadi 1,70 MB.

### 4.5 Nilai enum sampai sebagai string biasa

`GenerateSettings` memakai `use_enum_values`, sehingga nilai yang diterima router adalah string,
bukan anggota enum. Karena `StructureTemplate` adalah `str` Enum, perbandingan dan lookup dict tetap
bekerja. Dikunci dengan test agar tidak menjadi jebakan diam-diam bila kelak enum diubah.

## 5. Keputusan isi yang diambil AI dan perlu dikonfirmasi

Tiga hal berikut adalah keputusan **isi**, bukan teknis. Tercatat sebagai T-024.

| Keputusan | Alasan |
| --- | --- |
| Seksi 3.5 Deskripsi Field View dibuang (9 elemen) | Generator tidak menghasilkan dokumentasi view, sehingga setiap dokumen hasil akan membawa daftar view milik sistem lama |
| 113 entri daftar isi tingkat tiga dibuang | Isinya nama tabel sistem lama yang akan tampil di setiap dokumen sampai pengguna menekan F9 |
| Tiga gambar di atas 0,5 MB dibuang, termasuk ERD 5 MB | Diagram milik sistem lain akan ikut di setiap dokumen hasil, sekaligus beban ukuran berkas |

Skrip penyiapan dapat dijalankan ulang dengan ambang berbeda; dokumen sumber tidak pernah diubah.

## 6. Belum layak merge ke `main`

1. **T-016** smoke test UI alur generate belum dijalankan.
2. **T-023** frontend belum menampilkan pilihan `structure_template`, sehingga `msf_tsd` belum dapat
   dipilih pengguna akhir.
3. **Verifikasi container**: image backend perlu dibangun ulang. Container tidak mem-bind-mount kode
   aplikasi, sehingga seluruh pekerjaan Batch 1-4 belum pernah diuji di lingkungan yang menyerupai
   produksi.
4. **Security Pre-Merge Checklist** `ai-rules/security/part-i` belum dijalankan penuh.

## 7. Usulan perubahan README

AGENTS.md §1 poin 8 mewajibkan AI mengusulkan, bukan menerapkan. Usulan untuk `backend/README.md`:
tambahkan `MAX_OUTPUT_SIZE_MB` ke daftar variabel lingkungan, dan satu paragraf yang menjelaskan
`structure_template` beserta konsekuensinya bahwa template berasal dari repositori dan tidak dapat
diunggah. Menunggu keputusan pengguna.

## 8. Utang yang sengaja ditinggalkan

| Butir | Rujukan |
| --- | --- |
| `generate.py` kini 425 baris, melewati batas Route 200 | T-018 sudah mencatat rencana ekstraksi ke `services/generation_service.py` |
| Utang lint baseline, termasuk `asyncio` menganggur di `generate.py` | T-021 |
| PDF tidak mengikuti bentuk TSD | ADR-006 Trade-offs |
| 14 diagram ERD tetap gambar statis | ADR-006 Trade-offs |
| `MAX_TABLES_PER_REQUEST` tetap 50 di repo | spec section 9.6 |

---

## 9. Hasil smoke test di container (2026-08-14)

Image dibangun ulang dan seluruh Batch 1-4 diuji di luar venv lokal untuk pertama kalinya.

| Pemeriksaan | Hasil |
| --- | --- |
| Dependensi di container | `docxtpl 0.20.2`, `python-docx 1.1.2` |
| Bind mount template | `tsd.docx` 1,78 MB terlihat di `/app/templates` |
| Pytest di container | 220 passed, 1 skipped, 1 error pra-ada |
| Generate `msf_tsd` lewat API | HTTP 200, DOCX 1,78 MB, nol sisa tag Jinja |

### 9.1 Rantai fallback terbukti tanpa direkayasa

Percobaan pertama berjalan saat Ollama mati. AI gagal total, namun dokumen **tetap terbit** dengan
deskripsi dari metadata (`Primary key`, `-`). Persyaratan spec section 6 bahwa dokumen selalu terbit
karena itu terbukti pada kondisi nyata, bukan hanya lewat test.

### 9.2 Regresi bahasa yang ditemukan smoke test

Percobaan kedua dengan Ollama hidup memperlihatkan ringkasan tabel keluar Bahasa Indonesia,
sementara **seluruh baris per kolom keluar Bahasa Inggris**. Penyebabnya `_prompt_kolom` tidak
pernah menyebutkan bahasa keluaran; prompt lama memuat "Buat dokumentasi dalam Bahasa Indonesia" dan
instruksi itu hilang saat kontrak keluaran diganti.

Diperbaiki dengan menyatakan bahasa secara eksplisit di prompt, dijaga dua test, dan diverifikasi
ulang lewat generate sungguhan. Seluruh deskripsi kini mengikuti bahasa yang diminta.

Pelajaran: test dengan provider tiruan tidak dapat menangkap cacat prompt. Hanya model sungguhan
yang menunjukkannya.

### 9.3 Temuan lingkungan

| Temuan | Catatan |
| --- | --- |
| `OLLAMA_DEFAULT_MODEL=llama3.2` tidak terpasang di host | Model yang tersedia `llama3:latest`, `deepseek-r1:8b`, `qwen3:30b`. Default di konfigurasi menunjuk model yang tidak ada |
| Error pytest di container | `OSError: could not get source code` dari `pytest_asyncio`, tanda tangan identik dengan baseline sebelum pekerjaan ini. Versi pustaka sama di container dan venv, sehingga bersifat lingkungan |
| Log memuat `sql_content` utuh | Konfirmasi langsung T-022, sebelumnya hanya terbaca dari kode |

---

## 10. Smoke test UI (2026-08-14, T-016 sebagian)

Dijalankan **tanpa Docker**: Docker Desktop dan Ollama mati saat sesi ini, sehingga backend
dijalankan langsung lewat `uvicorn` dari venv dan frontend lewat `next dev`. Pendekatan ini lebih
ringan dan menguji jalur yang sama.

### 10.1 Bug yang menghalangi dan sudah diperbaiki

`frontend/next.config.js` mengarahkan rewrite mode development ke `http://localhost:8080`, yaitu
port **msf-app v1**, sedangkan backend v2 memakai **8001** (lihat `CLAUDE.md` bagian v2 Port
Mapping). Akibatnya frontend v2 dalam mode development berbicara ke backend v1, dan seluruh aplikasi
menampilkan layar "SISTEM SEDANG PEMELIHARAAN".

Tidak pernah ketahuan karena v2 selalu dijalankan lewat Docker dalam mode produksi, dan cabang
produksi menunjuk `http://backend:8000` yang memang benar.

Diperbaiki menjadi `process.env.BACKEND_ORIGIN || "http://localhost:8001"`. Ini kelas bug yang sama
dengan yang dicatat CHANGELOG v2.2.0: nilai di-hardcode sehingga konfigurasi gagal secara diam-diam.

### 10.2 Yang terverifikasi

| Langkah | Hasil |
| --- | --- |
| Halaman `/generate` termuat | 200, layar pemeliharaan hilang setelah perbaikan 10.1 |
| Selector STRUKTUR DOKUMEN tampil | Dua pilihan: STANDARD dan MSF TSD |
| Memilih MSF TSD | Keadaan terpilih berpindah, diperiksa lewat kelas DOM |
| Payload yang diterima backend | `structure_template: msf_tsd` benar-benar terkirim dari UI |
| Job berjalan sampai selesai | `done`, tanpa error |
| Dokumen hasil | Dua tabel menghasilkan dua seksi `3.4.x`, tabel induk dan tabel field terisi, nol sisa tag Jinja |

Keluaran dokumen dari alur UI:

```
3.4.1 Tabel mst_nasabah   |  id    | BIGINT       | Identitas unik ... primary key.
                          |  nama  | VARCHAR(100) | Nama lengkap nasabah, maksimal 100 karakter.
3.4.2 Tabel posts
```

### 10.3 Parser menahan derau model penalaran

Model yang terpakai `deepseek-r1:8b`, yaitu model penalaran yang mengeluarkan blok `<think>`.
**Tidak satu pun bocor ke dokumen.** Parser membuangnya karena baris penalaran tidak berbentuk
`nama | deskripsi`. Penyaringan berbasis daftar putih nama kolom ternyata sekaligus menahan derau
jenis ini, di luar tujuan awalnya sebagai penahan halusinasi.

### 10.4 Yang tidak dapat diselesaikan di lingkungan ini

Pane browser tidak ditampilkan, sehingga tangkapan layar dan klik berbasis koordinat tidak
berfungsi. Interaksi memakai referensi elemen. Verifikasi visual tampilan selector karena itu belum
dilakukan; yang terbukti adalah keberadaan, keadaan terpilih, dan akibatnya pada payload.

Bagian T-016 tentang tampilan dua pesan 429 belum diuji dan tetap terbuka.
