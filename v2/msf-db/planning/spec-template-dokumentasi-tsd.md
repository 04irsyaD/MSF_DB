# Spec — Dokumentasi Berbasis Template TSD

> **Status:** Draft, menunggu review pengguna
> **Tanggal:** 2026-08-11
> **Branch:** `dev`
> **Terkait:** ADR-006 (akan dibuat pada Batch 4), `dev-docs/ai/TECHNICAL_DEBT.md`

---

## 1. Masalah

Keluhan awal: dokumen hasil generate strukturnya acak dan isinya mengarang.

Penelusuran kode menemukan penyebab yang lebih spesifik daripada dugaan awal.

### 1.1 Struktur rusak karena heading liar

Struktur dokumen terdiri dari dua lapis. Lapis deterministik dibangun Python
(`_build_header`, `_build_columns_table`, `_build_fk_section`, `_build_index_section`,
`_build_relations_summary`) dan sudah konsisten. Lapis non-deterministik hanya satu blok:
`{ai_description}` di `doc_generator.py:166`.

Prompt melarang heading di `doc_generator.py:246` tetapi tidak ada penegakan apa pun. Keluaran AI
ditempel apa adanya. Ketika `llama3.2` melanggar dan mengeluarkan `## Tujuan Tabel`, heading itu
masuk ke Markdown, lalu `docx_exporter.py:130` menerjemahkannya menjadi Heading 2 Word — sederajat
dengan heading resmi `## Tabel: nama`. Hierarki dokumen rusak dan daftar isi Word menjadi kacau.

### 1.2 AI menebak hal yang jawabannya sudah tersedia

Empat sumber data sudah ada tetapi tidak pernah sampai ke AI:

| Data | Status | Bukti |
| --- | --- | --- |
| `table_comment`, `column_comment` | Dideklarasikan, tidak pernah diisi maupun dibaca | Hanya muncul di `schemas.py:130` dan `schemas.py:156` |
| `project_description` | Dikirim frontend, divalidasi, lalu dibuang | Dikirim di `page.tsx:77`, tidak pernah masuk dict `settings` di `generate.py:152` |
| Views dan Functions | Diambil dari database, lalu dibuang | Diambil di `generate.py:246`, hanya `metadata.tables` diteruskan |
| `max_length`, `primary_key` | Terisi, tidak pernah dipakai | Nol kemunculan di `doc_generator.py` |

`column_comment` adalah komentar asli DBA di dalam database. Selama ini AI disuruh menebak makna
kolom dari namanya saja, padahal jawabannya kemungkinan sudah tertulis di sana.

### 1.3 Keluaran tidak dapat direproduksi

`ollama_provider.py:65` memakai `temperature: 0.3` dan `top_p: 0.9` tanpa `seed`. Input identik
menghasilkan keluaran berbeda setiap kali dijalankan.

### 1.4 Pelajaran dari percobaan v1

`AI OLLMA/summary/` berisi 43 skrip yang menyerang masalah yang sama. Inspeksi read-only terhadap
`template/template_dokumentasi.docx` menghasilkan:

```
document.xml : 5,5 MB          Paragraf   : 7.620
Tabel        : 117             Gambar     : 25 (satu 5,2 MB)
Textbox      : 0               Content control : 0
Placeholder  : 0
```

Tidak ada elemen tersembunyi. `python-docx` melihat 117 dari 117 tabel. Strukturnya tidak pernah
sulit dibaca.

Kegagalan v1 berasal dari strategi **replikasi**: membangun ulang tampilan dokumen dari nol dan
mencocokkan font, border, serta lebar kolom satu per satu lewat XML mentah. Nama skripnya
membuktikan itu — `column_width_analyzer`, `perfect_column_width_generator`,
`xml_perfect_width_generator`, `header_perfect_docx`. `SOLUSI_EXACT_TEMPLATE_FINAL.md` tertanggal
4 November mengklaim selesai 100%, tetapi lima skrip berikutnya bertanggal 13 November.

Penyebab kedua: berkas itu bukan template melainkan dokumen TSD yang sudah terisi penuh, tanpa satu
pun penanda tempat isi. Setiap skrip harus menebak di mana konten masuk, dan setiap skrip menebak
berbeda.

### 1.5 Struktur TSD justru sangat teratur

```
Kerahasiaan / Kendali Dokumen / Riwayat Dokumen / Lembar Pengesahan
Daftar Isi / Daftar Gambar / Daftar Tabel
1. Pendahuluan            1.1 Latar Belakang, 1.2 Maksud dan Tujuan
2. Overview Sistem        2.1 Kebutuhan Business
3. Arsitektur Sistem
   3.2.1.x Table Relation Fitur ...   14 diagram ERD berupa gambar
   3.3 Definisi Tabel                 1 tabel induk, 120 baris
   3.4 Deskripsi Field
       3.4.1 Tabel t_Access           berulang sekitar 109 kali
```

| Pola header tabel | Jumlah | Peran |
| --- | --- | --- |
| `No · Nama Field · Tipe Data · Deskripsi Field` | 109 | Satu per tabel database |
| `No · Nama Tabel · Deskripsi Tabel` | 1 (120 baris) | Daftar induk seluruh tabel |
| `Nama · Posisi · Tanggal · Paraf` | 2 | Lembar pengesahan |

---

## 2. Keputusan

Adopsi **`docxtpl`** dengan template TSD yang dibersihkan, dan **batalkan** rencana empat template
Markdown karangan sendiri.

Alasan:

1. Bentuk dokumen yang diinginkan sudah ada, sudah dipakai, dan sudah disetujui. Mengarang template
   baru adalah pekerjaan sia-sia.
2. `docxtpl` mengisi dokumen aslinya, tidak merekonstruksinya. Fidelitas 100% didapat tanpa usaha,
   dan seluruh perang lebar kolom serta border yang menghabiskan 43 skrip menjadi tidak relevan.
3. Keluaran AI masuk ke **sel tabel**. Sel tabel tidak bisa memuat heading liar dan tidak bisa
   meliar panjangnya. Masalah struktur acak hilang karena bentuknya tidak lagi memungkinkan, bukan
   karena ditambal.

Alternatif yang ditolak:

- **Template visual DOCX** (varian gaya, halaman sampul, header/footer via python-docx). Ini persis
  strategi replikasi yang sudah terbukti gagal di v1. Ditolak.
- **Empat template struktur Markdown.** Menjadi mubazir setelah template TSD nyata ditemukan.
- **AI menafsirkan template saat runtime.** Akan membuat keluaran lebih acak, bukan kurang. Kalau
  AI dipakai untuk memetakan template, itu sekali di awal dengan hasil direview manusia.

### 2.1 Non-goals

Tidak dikerjakan pada spec ini:

- Upload template oleh pengguna
- Varian template visual
- Paritas PDF dengan bentuk TSD
- Generate diagram ERD
- Struktur dokumen yang didefinisikan bebas oleh pengguna

---

## 3. Arsitektur

### 3.1 Perubahan alur

Sekarang:

```
metadata -> AI (prosa bebas per tabel) -> Markdown -> DOCX / PDF
```

Menjadi:

```
metadata + AI (deskripsi per kolom) -> DocumentModel -> MarkdownRenderer -> preview, PDF
                                                     -> DocxTemplateRenderer -> DOCX (docxtpl)
```

Markdown berhenti menjadi sumber kebenaran untuk DOCX dan tetap dipakai untuk preview job serta
PDF. `DocumentModel` menjadi satu-satunya sumber untuk kedua renderer.

### 3.2 DocumentModel

Model data murni, tanpa pengetahuan tentang Markdown, Word, maupun HTTP.

```
DocumentModel
    project_name, project_description, author, generated_at
    tables: list[TableDoc]

TableDoc
    name, schema, comment, summary, columns: list[ColumnDoc]
    foreign_keys, indexes

ColumnDoc
    no, name, data_type_label, description, source
```

`source` bernilai `db_comment`, `ai`, atau `fallback`. Field ini memungkinkan pelaporan seberapa
besar porsi dokumen yang berlandaskan fakta dibanding tebakan AI.

### 3.3 Kontrak keluaran AI yang baru

Berubah dari satu blok prosa per tabel menjadi satu deskripsi pendek per kolom.

**Satu panggilan AI per tabel, dan panggilan itu mengembalikan dua hal sekaligus:** satu kalimat
ringkasan tabel yang mengisi kolom `Deskripsi Tabel` di tabel induk, dan satu baris deskripsi untuk
setiap kolom. Jumlah panggilan AI tetap sama dengan sekarang, yaitu sebanyak jumlah tabel.

Format keluaran yang diminta adalah baris `nama_kolom | deskripsi`, bukan JSON. Alasannya
`llama3.2` berukuran 3B dan sering merusak struktur kurung JSON, sedangkan format baris jauh lebih
tahan dan tetap mudah divalidasi.

**Parser berfungsi sebagai penyaring halusinasi.** Setiap baris dicocokkan dengan metadata asli;
nama kolom yang tidak ada di metadata **dibuang**, tidak pernah masuk dokumen. Ini deterministik dan
tidak bergantung pada kepatuhan model.

Rantai pengisian per kolom, berurutan:

1. `column_comment` dari database. Bila ada, dipakai langsung dan **AI tidak ditanya**.
2. Deskripsi AI yang lolos validasi.
3. Fallback deterministik dari metadata: `Primary key`, `Foreign key ke <tabel>.<kolom>`, atau `-`.

Konsekuensi: kolom yang sudah punya komentar database tidak akan pernah dikarang.

### 3.4 Sanitasi

Setiap teks dari AI yang masuk ke sel tabel: baris baru dihapus, sintaks Markdown dilucuti, panjang
dipotong pada batas yang dapat dikonfigurasi. Untuk ringkasan per tabel yang mengisi kolom
`Deskripsi Tabel`, berlaku aturan yang sama ditambah paksaan satu kalimat.

### 3.5 Reproducibility

`seed` ditambahkan ke opsi Ollama dan diekspos lewat env `AI_SEED`. `temperature` untuk tugas
deskripsi per kolom diturunkan ke 0.1 karena ini ekstraksi faktual, bukan penulisan kreatif.
DeepSeek dan OpenAI menerima parameter `seed` juga, dengan jaminan best-effort.

### 3.6 Template dan renderer DOCX

Template `.docx` berisi tag `docxtpl`. Sintaks perulangan di dalam tabel Word memakai `{%tr %}`
untuk baris, bukan `{% %}` biasa:

```
{{ project_name }}

Tabel induk:
{%tr for t in tables %}{{ loop.index }} | {{ t.name }} | {{ t.summary }}{%tr endfor %}

Per tabel:
{% for t in tables %}
  Heading: 3.4.{{ loop.index }} Tabel {{ t.name }}
  {%tr for c in t.columns %}{{ c.no }} | {{ c.name }} | {{ c.data_type_label }} | {{ c.description }}{%tr endfor %}
{% endfor %}
```

`structure_template` menjadi Enum Pydantic tertutup dengan dua nilai pada fase ini:

| Nilai | Renderer | Keterangan |
| --- | --- | --- |
| `standard` | Markdown lama, `DocxExporter` | Bawaan. Perilaku sekarang dipertahankan persis. Aktif sejak Batch 3 |
| `msf_tsd` | `docxtpl` + template TSD | Bentuk Technical Specification Document. Baru ditambahkan ke Enum pada Batch 4 |

### 3.7 Batas ukuran berkas

`doc_generator.py` saat ini 375 baris; batas Service adalah 800 maksimal dengan rekomendasi 400.
Pemecahan yang direncanakan:

| Berkas | Isi |
| --- | --- |
| `services/doc_model.py` | Definisi `DocumentModel`, `TableDoc`, `ColumnDoc` |
| `services/doc_generator.py` | Orkestrasi: metadata + AI menjadi `DocumentModel` |
| `services/ai_column_parser.py` | Parsing dan validasi keluaran AI terhadap metadata |
| `services/renderers/markdown_renderer.py` | `DocumentModel` menjadi Markdown |
| `services/renderers/docx_template_renderer.py` | `DocumentModel` menjadi DOCX lewat `docxtpl` |

---

## 4. Pembagian batch

AGENTS.md §1 poin 5 mewajibkan satu perubahan kecil per commit. Fitur dipecah menjadi empat batch
berurutan.

### Batch 0 — prasyarat, dikerjakan pengguna

Commit pekerjaan security-headers yang masih menggantung di working tree. AGENTS.md §2 mensyaratkan
working tree bersih sebelum task baru dimulai.

### Batch 1 — jaring pengaman

Buat `backend/tests/test_doc_generator.py` yang mengunci perilaku saat ini. Tanpa perubahan
perilaku. `DocGenerator` adalah satu-satunya service inti tanpa test; menambah cabang logika ke
sana tanpa test lebih dulu berarti menumpuk risiko.

Cakupan: seluruh builder section sebagai fungsi murni, dengan provider yang di-mock.

### Batch 2 — grounding data

Bersifat aditif, tanpa breaking change.

- `db_connector` mengambil `table_comment` dan `column_comment` untuk PostgreSQL, MySQL, dan SQL Server
- Komentar tabel ditampilkan sebagai catatan skema; komentar kolom mengisi kolom keterangan
- Komentar disanitasi dan dipotong panjangnya sebelum dipakai, sesuai §9.4
- `project_description` diteruskan ke `settings` di kedua router
- `seed` dan penurunan `temperature`
- **Rate limit pada `GET /api/jobs/by-code/{access_code}`**, karena batch inilah yang mulai
  mengalirkan isi komentar database ke endpoint publik tersebut (§9.5)
- `CURRENT_STATE.md` §1a diperbarui: `jobs.db` tidak lagi dapat dinyatakan bebas data sensitif

### Batch 3 — kontrak AI baru dan DocumentModel

- `DocumentModel` dan pemecahan berkas sesuai §3.7
- Kontrak keluaran AI per kolom, parser sebagai penyaring halusinasi
- `MarkdownRenderer` dibangun dari `DocumentModel`
- Sanitasi
- `structure_template` ditambahkan dengan nilai `standard` saja pada tahap ini

### Batch 4 — template TSD

- Bersihkan `template_dokumentasi.docx`: sisakan satu section `3.4.x` sebagai contoh, hapus sisanya,
  buang gambar berat, sisipkan tag `docxtpl`
- Tambah dependensi `docxtpl` dengan versi dipin, setelah kompatibilitasnya dengan
  `python-docx==1.1.2` diverifikasi
- `DocxTemplateRenderer` memakai `jinja2.sandbox.SandboxedEnvironment` (§9.1)
- Pemetaan Enum ke nama berkas template sebagai konstanta di kode; nilai request tidak pernah
  menyentuh path (§9.2)
- Nilai `msf_tsd` diaktifkan
- `MAX_OUTPUT_SIZE_MB` dihidupkan (§9.6)
- ADR-006 dan operations docs

### Batch 5 — terpisah, tidak dicampur

Bersihkan emoji yang dipakai sebagai penanda primary key dan foreign key di `_build_columns_table`
(`doc_generator.py:283-285`) serta penanda peringatan di `_fallback_table_doc`
(`doc_generator.py:356`). Melanggar AGENTS.md §1 poin 12. Dipisah karena §3B melarang mencampur
fitur dengan refactor dalam satu batch.

---

## 5. Perubahan API dan skema

`GenerateSettings` bertambah satu field:

```
structure_template: StructureTemplate = StructureTemplate.STANDARD
```

Wajib Enum Pydantic tertutup, bukan string bebas, sesuai AGENTS.md §1 poin 9. Endpoint generate
publik tanpa autentikasi, sehingga tidak ada bentuk bebas yang diterima.

Default `standard` menjaga kompatibilitas: job lama di SQLite dan request frontend versi lama tetap
berfungsi tanpa perubahan.

Titik yang mudah terlewat: dict `settings` disusun manual per key di `generate.py:152` dan
`generate.py:227`. Field baru harus ditambahkan di **kedua** tempat.

---

## 6. Error handling

| Kondisi | Perilaku |
| --- | --- |
| Berkas template tidak ditemukan | Job gagal dengan pesan yang menyebut nama berkas dan lokasi yang diharapkan. Bukan 500 generik |
| Tag `docxtpl` rusak karena Word memecah run | Render gagal dengan pesan yang menyebut tag bermasalah |
| Keluaran AI tidak dapat diparsing sama sekali | Seluruh kolom jatuh ke rantai fallback. Dokumen tetap terbit, tidak pernah kosong |
| Nama kolom halusinasi | Dibuang diam-diam oleh parser, dicatat di log dengan hitungannya |
| AI gagal total untuk satu tabel | Perilaku sekarang dipertahankan: fallback per tabel, job berlanjut |

Prinsipnya: dokumen selalu terbit. Kegagalan AI menurunkan kualitas isi, tidak pernah membatalkan
job.

---

## 7. Testing

| Berkas | Cakupan |
| --- | --- |
| `test_doc_generator.py` | Builder section sebagai fungsi murni, provider di-mock |
| `test_ai_column_parser.py` | Nama kolom tak dikenal dibuang; baris cacat; keluaran kosong; rantai fallback |
| `test_doc_model.py` | Pembentukan `DocumentModel` dari metadata, penetapan `source` |
| `test_docx_template_renderer.py` | Render dengan template fixture kecil, dibaca ulang untuk memastikan isi masuk |

90 test yang ada wajib tetap hijau. Verifikasi: `pytest` di dalam container backend.

---

## 8. Risiko

| Risiko | Mitigasi |
| --- | --- |
| Word memecah `{{ tag }}` menjadi beberapa run sehingga render gagal | Tag diketik sekali jalan tanpa autocorrect, atau disisipkan lewat Find & Replace. Test render menangkapnya lebih awal |
| Jinja2 berarti eksekusi ekspresi, berpotensi SSTI | Template **hanya** dari repo, tidak pernah dari upload. Dinyatakan sebagai batasan keras |
| `docxtpl` bentrok dengan pin `python-docx==1.1.2` | Verifikasi kompatibilitas versi sebelum menambahkan ke `requirements.txt`. Bila bentrok, keputusan dikembalikan ke pengguna |
| Bind mount `./backend/templates:/app/templates` menimpa template bawaan image | Wajib didokumentasikan di operations docs. Folder host kosong di server berarti template hilang tanpa pesan error |
| Waktu generate melonjak | Daftar induk TSD 120 baris berarti sekitar 119 tabel. `MAX_TABLES_PER_REQUEST` sekarang 50 dan harus dinaikkan. Estimasi satu dokumen penuh mendekati 30 menit dengan `llama3.2`. Formula `estimated_seconds` perlu disesuaikan |
| 14 diagram ERD tidak dapat digenerate | Dibiarkan statis di template pada fase ini. Keputusan penyediaan gambar ditunda |
| Template 8 MB terbawa ke setiap hasil | Gambar berat dibuang saat pembersihan template di Batch 4 |

---

## 9. Security

Merujuk `ai-rules/security/` Part A, D, E, I, K, dan M. Fitur ini menambah permukaan serangan baru,
sehingga bagian ini bersifat mengikat, bukan saran.

Konteks yang membingkai seluruh bagian ini: aplikasi terbuka ke internet lewat Cloudflare Tunnel,
`MSF_API_KEY` masih kosong, dan seluruh endpoint dapat diakses anonim
(`dev-docs/ai/CURRENT_STATE.md` §1a).

### 9.1 SSTI lewat docxtpl — risiko terbesar yang baru

`docxtpl` menjalankan Jinja2. Me-render template berarti **mengeksekusi ekspresi**, dan Part E
melarang konstruksi semacam `eval`. Template karena itu diperlakukan sebagai **kode, bukan data**.

Aturan yang mengikat:

1. Template **hanya** berasal dari repositori. Tidak ada endpoint upload template, sekarang maupun
   nanti. Membuka upload berarti memberi penyerang anonim kemampuan mengeksekusi ekspresi di server.
2. Perubahan template melewati code review seperti perubahan kode, bukan diganti saat runtime.
3. `docxtpl` dirender memakai `jinja2.sandbox.SandboxedEnvironment` sebagai pertahanan berlapis,
   meskipun template sudah tepercaya.

### 9.2 Path traversal pada pemilihan template

Pola yang **dilarang**: merangkai nama berkas template dari input pengguna, misalnya
`os.path.join(TEMPLATES_DIR, payload.structure_template)`. Itu membuka `../../` menuju berkas apa
pun yang terbaca proses.

Yang dipakai: pemetaan konstan di dalam kode dari nilai Enum ke nama berkas. Nilai dari request
tidak pernah menyentuh path. Sebagai lapis kedua, path hasil resolusi diverifikasi masih berada di
dalam `TEMPLATES_DIR` sebelum dibuka.

### 9.3 Berkas .docx adalah arsip zip

Template `.docx` adalah zip berisi XML, sehingga secara umum rentan terhadap zip bomb dan ekspansi
entitas XML. Selama template hanya berasal dari repo, risikonya rendah dan tidak memerlukan
penanganan khusus.

Poin ini ditulis eksplisit agar keputusan "tanpa upload" di §9.1 tidak dibatalkan diam-diam di masa
depan tanpa menyadari konsekuensinya.

### 9.4 Prompt injection dari database target — baru sejak Batch 2

Ini risiko paling halus di spec ini. `table_comment` dan `column_comment` berasal dari database
milik pengguna, yang dari sudut pandang backend adalah **input tidak tepercaya**. Komentar dapat
memuat teks yang diarahkan ke model, misalnya perintah untuk mengabaikan instruksi sebelumnya.

Radius ledakannya sudah dibatasi oleh desain di §3.3: parser membuang nama kolom yang tidak ada di
metadata, sehingga injeksi **tidak dapat menyisipkan baris palsu** ke dalam tabel. Yang masih dapat
dipengaruhi adalah teks deskripsi, dan teks itu berakhir di dokumen Word yang dibaca manusia.

Mitigasi:

- Komentar dimasukkan ke prompt sebagai data dengan pembatas eksplisit, bukan disatukan begitu saja
  dengan instruksi
- Panjang komentar dipotong sebelum masuk prompt
- Komentar yang dipakai langsung lewat jalur pertama rantai §3.3 tetap melewati sanitasi §3.4.
  Jalur itu tidak melibatkan AI sama sekali, tetapi teksnya tetap masuk dokumen, sehingga sanitasi
  tetap wajib

### 9.5 Kebocoran data: komentar database masuk ke penyimpanan dan endpoint publik

`CURRENT_STATE.md` §1a mencatat `jobs.db` tidak memuat satu pun kredensial. **Batch 2 mengubah
asumsi itu.** Komentar database dapat memuat catatan internal, nama orang, atau aturan bisnis, dan
komentar tersebut mengalir ke `preview_markdown` yang disimpan di `jobs.db`.

`preview_markdown` dikembalikan oleh `GET /api/jobs/{job_id}` dan `GET /api/jobs/by-code/{code}`.
Keduanya tanpa autentikasi.

Temuan tambahan: `rate_limit` hanya dipasang di dua endpoint generate dan admin verify.
**`/api/jobs/by-code/{access_code}` tidak memiliki rate limit sama sekali.** `access_code` dibuat
dengan `secrets.token_hex(5)` (`job_queue.py:47`), yaitu 40 bit entropi — secara kriptografis benar,
tetapi enumerasinya tidak dibatasi apa pun.

Tindakan yang menjadi bagian dari spec ini:

- Tambahkan rate limit ke endpoint `by-code` pada Batch 2, yaitu batch yang memperkenalkan risikonya
- Perbarui pernyataan `CURRENT_STATE.md` §1a agar tidak lagi menyatakan `jobs.db` bebas data sensitif
- Catat implikasinya terhadap retensi data merujuk Part K

### 9.6 Menaikkan `MAX_TABLES_PER_REQUEST` melemahkan kontrol yang sudah ada

Ini konsekuensi keamanan, bukan sekadar performa.

Keadaan sekarang: batas 50 tabel dengan estimasi 15 detik per tabel berarti satu job paling lama
sekitar 12 menit, dengan `MAX_CONCURRENT_JOBS` bernilai 3.

Bila batas dinaikkan ke sekitar 150 demi menampung TSD berisi 119 tabel, satu job menjadi 30 hingga
40 menit. Tiga job konkuren mengunci antrean lebih dari satu jam. Endpoint generate publik tanpa
autentikasi dengan limit 10 permintaan per menit per IP, sehingga **penyerang cukup mengirim tiga
permintaan untuk memenuhi antrean**, dan seluruh pengguna sah ditolak dengan 429 selama satu jam
berikutnya.

Ketentuan:

- **Default di repo tetap 50.** Kenaikan hanya lewat env pada deployment yang memang membutuhkannya
- Deployment yang menaikkannya wajib menurunkan `RATE_LIMIT_GENERATE` secara proporsional
- `MAX_OUTPUT_SIZE_MB` sudah ada di `.env.example` tetapi tidak dibaca kode mana pun. Batch 4
  menghidupkannya, karena template TSD memperbesar ukuran keluaran

### 9.7 Kebocoran lewat log

`generate.py:120` mencatat seluruh payload `from-ddl`, termasuk `sql_content` utuh. Jalur `from-db`
menyamarkan password (`generate.py:199`), tetapi jalur `from-ddl` tidak menyamarkan apa pun. Skema
database pengguna dengan demikian tersalin utuh ke log.

Meneruskan `project_description` menambah teks bebas dari pengguna ke log yang sama.

Rekomendasi: batasi logging payload pada field non-sensitif dan berhenti mencatat `sql_content`
secara utuh. Ini di luar jalur kritis fitur, sehingga diusulkan sebagai batch terpisah agar tidak
mencampur perbaikan dengan fitur (AGENTS.md §3B).

### 9.8 Dependensi baru

`docxtpl` beserta `jinja2` masuk ke supply chain proyek. Sesuai Part M dan Part I: versi dipin
eksplisit di `requirements.txt` dengan komentar peruntukan, dan kompatibilitasnya dengan
`python-docx==1.1.2` diverifikasi sebelum ditambahkan.

### 9.9 Yang tidak berubah, dan jangan dianggap berubah

Fitur ini **tidak menambahkan autentikasi**. `MSF_API_KEY` tetap kosong dan seluruh endpoint tetap
anonim. Spec ini tidak memperbaiki hal tersebut dan tidak boleh dibaca seolah memperbaikinya.
Seluruh mitigasi di atas berdiri di atas asumsi bahwa penyerang anonim dapat memanggil setiap
endpoint.

### 9.10 Checklist pre-merge

Sebelum merge ke `main`, jalankan Security Pre-Merge Checklist di
`ai-rules/security/part-i-security-pre-merge-checklist.md`, dengan perhatian khusus pada:
tidak ada jalur template dari input pengguna, tidak ada endpoint upload, sandbox Jinja2 aktif, rate
limit `by-code` terpasang, dan default `MAX_TABLES_PER_REQUEST` tidak dinaikkan di repo.

---

## 10. Kepatuhan ai-rules

| Aturan | Penerapan |
| --- | --- |
| §1 poin 1, 2 — dilarang commit dan push ke `main` | Seluruh pekerjaan di `dev` |
| §1 poin 3 — berkas sensitif | `AI_SEED` dan `TEMPLATES_DIR` ditambahkan ke `.env.example` pada batch yang sama |
| §1 poin 5 — batch kecil | Lima batch terpisah, satu commit per batch |
| §1 poin 7 — sinkronisasi dokumentasi | Lihat §11 |
| §1 poin 9 — validasi input | `structure_template` sebagai Enum tertutup. Tanpa upload template |
| Security Part A — kredensial | Tidak ada secret baru di kode. `AI_SEED`, `TEMPLATES_DIR`, `MAX_OUTPUT_SIZE_MB` lewat `.env` |
| Security Part D — validasi input dan sanitasi keluaran | §3.3 parser sebagai penyaring, §3.4 sanitasi, §9.4 komentar database sebagai input tidak tepercaya |
| Security Part E — dilarang eval | §9.1 sandbox Jinja2, template hanya dari repo, §9.2 tanpa path dari input pengguna |
| Security Part I — pre-merge checklist | §9.10 |
| Security Part K — perlindungan data | §9.5 komentar database mengalir ke `jobs.db` dan endpoint publik |
| Security Part M — container dan deployment | §9.8 pin versi dependensi, §8 jebakan bind mount template |
| §1 poin 11 — operations docs | Wajib pada Batch 4: `backend/docs/operations/document-templates.md`, karena ada langkah setup di server |
| §1 poin 12 — dilarang emoji | Template TSD dan seluruh keluaran baru tanpa emoji. Emoji lama dibersihkan di Batch 5. Spec ini pun menyebut emoji tanpa mereproduksinya |
| §1 poin 13 — coding standards | Pemecahan berkas sesuai §3.7 agar tidak menembus rekomendasi 400 baris |
| §1 poin 14 — dilarang kredensial di .md dalam folder kode | Operations docs merujuk `.env`, tidak memuat nilai |
| §3B — jangan campur fitur dan refactor | Pembersihan emoji dipisah ke Batch 5 |
| §6 — scope guardrails | `docxtpl` adalah dependensi baru dan **membutuhkan izin eksplisit pengguna** sebelum Batch 4 |
| §8 — output akhir | Setiap batch menghasilkan summary, daftar berkas, perintah verifikasi |
| `ai-rules/` immutable | Hanya dibaca, tidak disentuh |

**Commit dan push tetap dieksekusi pengguna.** Sesuai `dev-docs/ai/CURRENT_STATE.md` §1b, sejak
2026-08-04 AI menyiapkan perubahan beserta pesan commit tetapi tidak menjalankannya.

---

## 11. Definition of done per batch

Setiap batch belum selesai sebelum seluruh butir ini terpenuhi:

1. `pytest` hijau di dalam container backend
2. `ruff` lulus pada seluruh berkas yang disentuh
3. `dev-docs/CHANGELOG.md` diperbarui
4. `dev-docs/ai/CURRENT_STATE.md`, `MODULE_MAP.md`, `TASKS.md` diperbarui bila terdampak
5. `dev-docs/COMMIT_LOG.md` dan `dev-docs/commit-logs/YYYY-MM-DD.md` diisi
6. `reports/task/YYYY-MM-DD-{task}.md` dibuat
7. Usulan perubahan `backend/README.md` disampaikan bila ada perubahan modul — **diusulkan, tidak
   langsung diterapkan**, sesuai AGENTS.md §1 poin 8
8. Butir §9 yang relevan dengan batch tersebut sudah diterapkan dan diverifikasi
9. Pesan commit disiapkan, eksekusi diserahkan ke pengguna

Tambahan Batch 4: ADR-006, `backend/docs/operations/document-templates.md`, dan Security Pre-Merge
Checklist §9.10 dijalankan penuh sebelum merge ke `main`.

---

## 12. Rollback

| Batch | Cara membalik |
| --- | --- |
| 1 | Hapus berkas test. Tidak ada perilaku yang berubah |
| 2 | Aditif. Kolom komentar kosong bila query dibalik; dokumen tetap terbit |
| 3 | `structure_template` bawaan `standard` mempertahankan keluaran lama. Balik commit bila perlu |
| 4 | Set `structure_template` ke `standard`. Renderer `docxtpl` tidak pernah dipanggil. Dependensi boleh tetap terpasang tanpa efek |

Tidak ada migrasi skema database pada seluruh batch, sehingga tidak ada konversi data yang perlu
dibalik.

---

## 13. Asumsi yang menunggu konfirmasi

1. **Bentuk TSD adalah target keluaran yang diinginkan.** Seluruh spec ini bertumpu pada asumsi
   tersebut. Bila TSD hanya salah satu contoh dan kebutuhan sebenarnya lebih longgar, §3.6 dan Batch
   4 harus dirancang ulang.
2. **Penambahan dependensi `docxtpl` diizinkan.** AGENTS.md §6 mewajibkan izin eksplisit. Batch 1
   sampai 3 tidak bergantung pada ini dan dapat berjalan lebih dulu.
3. **`MAX_TABLES_PER_REQUEST` boleh dinaikkan melewati 50.** Tanpa ini, database berisi 119 tabel
   tidak dapat didokumentasikan sama sekali.
