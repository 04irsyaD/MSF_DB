# ADR-006 — Template DOCX diisi dengan docxtpl, bukan ditiru dengan python-docx

> **Status:** Accepted
> **Tanggal:** 2026-08-11
> **Terkait:** `planning/spec-template-dokumentasi-tsd.md`, ADR-002 (custom SQL parser)

---

## Context

Pengguna menginginkan keluaran dokumentasi berbentuk Technical Specification Document sesuai
template resmi yang sudah dipakai dan disetujui, bukan bentuk karangan baru.

Upaya pertama pernah dilakukan di `AI OLLMA/summary/` dan gagal. Bukti kegagalannya bukan opini:

* 43 skrip Python menyerang masalah yang sama, dengan nama yang menceritakan sendiri urutan
  keputusasaannya — `quick_fix`, `super_quick`, `ultra_safe_docx`, `perfect_template_docx`,
  `final_template_system`, `ultimate_adaptive_system`.
* `SOLUSI_EXACT_TEMPLATE_FINAL.md` bertanggal 4 November mengklaim seluruh masalah selesai 100%.
  Lima skrip berikutnya bertanggal 13 November.

Inspeksi read-only terhadap dokumen sumber menjelaskan sebabnya, dan sebabnya **bukan** kesulitan
membaca dokumen:

```
document.xml : 5,5 MB          Paragraf        : 7.620
Tabel        : 117             Gambar          : 25 (satu 5,0 MB)
Textbox      : 0               Content control : 0
Placeholder  : 0
```

Tidak ada elemen tersembunyi. `python-docx` melihat 117 dari 117 tabel. Dua sebab sebenarnya:

1. **Strategi replikasi.** Skrip v1 membangun ulang tampilan dokumen dari nol dan mencocokkan font,
   border, serta lebar kolom satu per satu lewat XML mentah. Nama skripnya membuktikan medan
   perangnya: `column_width_analyzer`, `perfect_column_width_generator`,
   `xml_perfect_width_generator`, `header_perfect_docx`. Pekerjaan seperti itu tidak pernah
   konvergen karena selalu ada satu properti visual lagi yang meleset.
2. **Berkasnya bukan template.** Itu dokumen TSD terisi penuh tanpa satu pun penanda tempat isi.
   Setiap skrip harus menebak di mana konten masuk, dan setiap skrip menebak berbeda.

---

## Decision

Adopsi **`docxtpl`**, yaitu Jinja2 di dalam berkas Word. Dokumen aslinya yang menjadi keluaran;
kode hanya mengisi titik data. Fidelitas terhadap sampul, kop, header, footer, penomoran, dan gaya
didapat tanpa satu baris kode pun yang menirunya, sehingga perang lebar kolom dan border menjadi
tidak relevan.

Rancangannya:

1. **Template diperlakukan sebagai KODE, bukan data.** Hanya berasal dari repositori, tidak pernah
   dari unggahan pengguna. `docxtpl` menjalankan Jinja2, sehingga template yang dapat dikendalikan
   pengguna berarti eksekusi ekspresi di server, sementara endpoint generate dapat diakses anonim.
2. **Render memakai `jinja2.sandbox.SandboxedEnvironment`** sebagai pertahanan berlapis, meskipun
   template sudah tepercaya.
3. **Nama berkas template adalah konstanta di kode**, dipetakan dari nilai Enum tertutup. Nilai dari
   request tidak pernah dirangkai menjadi path, sehingga tidak ada jalan bagi `../`. Hasil resolusi
   path diverifikasi ulang masih berada di dalam `TEMPLATES_DIR`.
4. **Penyiapan template terskrip, bukan manual.** `scripts/siapkan_template_tsd.py` mengubah dokumen
   sumber menjadi kerangka: menyisakan satu seksi contoh sebagai badan perulangan, memangkas tabel
   induk, membuang entri daftar isi lama beserta seksi view, dan menyisipkan seluruh tag. Dapat
   diulang bila dokumen sumber diperbarui, dan dokumen sumber tidak pernah diubah.
5. **Tag disisipkan lewat `python-docx`, bukan diketik di Word.** Word memecah tag yang diketik
   manusia menjadi beberapa run karena autocorrect, dan tag yang terbelah membuat render gagal.
   Penyisipan lewat kode selalu mendarat dalam satu run.
6. **`standard` tetap memakai jalur Markdown lama** dan menjadi bawaan, sehingga job tersimpan dan
   request frontend versi lama tidak terpengaruh.

Alternatif yang ditolak:

* **Replikasi dengan `python-docx`.** Jalur v1 yang terbukti tidak konvergen setelah 43 skrip.
  Menolaknya adalah inti keputusan ini.
* **Template visual sebagai varian gaya** (sampul, header, footer dibangun kode). Sama saja dengan
  replikasi, hanya berganti nama.
* **AI menafsirkan template saat runtime.** Akan mengembalikan ketidakpastian yang baru saja
  dihilangkan Batch 1-3. Bila AI dipakai memetakan template, itu sekali di awal dengan hasil
  direview manusia, bukan pada setiap generate.
* **Endpoint upload template.** Memberi penyerang anonim kemampuan mengeksekusi ekspresi di server.

---

## Consequences

### Positive

* Fidelitas 100% terhadap template resmi, didapat tanpa usaha pemeliharaan visual.
* Keluaran AI masuk ke sel tabel, yang tidak dapat memuat heading liar maupun panjang yang meliar.
  Masalah struktur acak hilang karena bentuknya tidak lagi memungkinkan.
* Menambah template baru berarti menambah satu entri pemetaan, bukan menulis renderer baru.
* Ukuran template turun dari 7,7 MB menjadi 1,7 MB setelah gambar berat dilepas beserta relasinya.

### Trade-offs

* Dependensi baru `docxtpl` dan `jinja2` masuk ke supply chain, dipin di `requirements.txt`.
* Direktori template menjadi aset operasional yang harus ada di server. Terdokumentasi di
  `backend/docs/operations/document-templates.md`.
* PDF tidak mengikuti bentuk TSD. `PdfExporter` memakai jalur render terpisah dengan CSS sendiri,
  dan paritas penuh memerlukan penyatuan jalur render.
* 14 diagram ERD tetap gambar statis. Tidak dapat digenerate.

### Risks

* **Bind mount menimpa isi image.** `./backend/templates:/app/templates` membuat direktori host
  menang. Direktori host yang kosong berarti template hilang tanpa pesan error. Mitigasi: pesan
  error renderer menyebut lokasi yang diharapkan dan merujuk operations docs.
* **`.gitignore` sempat menelan template.** Aturan `*.docx` membuat berkas template tidak pernah
  masuk repositori. Mitigasi: negasi `!backend/templates/*.docx` beserta test yang menjaganya.
* **Waktu generate.** Database sebesar TSD berisi sekitar 119 tabel, sedangkan
  `MAX_TABLES_PER_REQUEST` bawaan 50. Menaikkannya melemahkan kontrol antrean pada endpoint publik
  tanpa autentikasi, sehingga kenaikan hanya lewat env pada deployment yang membutuhkannya dan
  wajib disertai penurunan `RATE_LIMIT_GENERATE`.

### Rollback

Set `structure_template` kembali ke `standard`, yang merupakan bawaan. Renderer `docxtpl` tidak
pernah dipanggil dan jalur Markdown lama sepenuhnya utuh. Dependensi boleh tetap terpasang tanpa
efek. Tidak ada migrasi skema database, sehingga tidak ada konversi data yang perlu dibalik.
