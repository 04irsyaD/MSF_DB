# MSF-DB v2.2.0 — Spesifikasi Desain

**Tanggal:** 2026-07-31
**Branch:** `dev`
**Direktori kerja:** `v2/msf-db/`
**Referensi (tidak boleh disentuh):** `msf-app/`
**Versi saat ini:** v2.1.0 → **Target rilis: v2.2.0**

---

## Daftar Isi

**Bagian I — Gambaran Umum** (dapat dibaca tanpa latar belakang teknis)

- A. Apa itu MSF-DB
- B. Alur kerja aplikasi dari awal sampai akhir
  - B.1 Peta alur
  - B.2 Alur utama — membuat dokumentasi (tujuh langkah, dirinci satu per satu)
  - B.3 Dua jalur sumber data dibandingkan
  - B.4 Peta status pekerjaan dan arti angka progres
  - B.5 Alur pelacakan dan apa yang bertahan terhadap apa
  - B.6 Alur kegagalan dan pesan yang dilihat pengguna
  - B.7 Alur admin
  - B.8 Titik pada alur yang berubah di v2.2.0
  - B.9 Alur pengembangan (bukan alur pengguna)
- C. Daftar fitur lengkap
- D. Sumber daya yang dibutuhkan

**Bagian II — Spesifikasi Teknis**

1. Konteks dan posisi dalam roadmap
2. Konflik fondasi yang harus diselesaikan lebih dulu
3. Persyaratan dan keterlacakan
4. Bukan tujuan
5. Arsitektur
6. Model domain dan skema data
7. Kontrak API
8. Alur pengguna
9. Temuan terverifikasi
10. Keputusan desain
11. Rancangan per komponen
12. Kepatuhan coding standards
13. Kepatuhan security standard
14. Dokumentasi operations
15. Sinkronisasi dokumentasi wajib
16. Rencana batch dan commit
17. Strategi pengujian
18. Kriteria penerimaan
19. Rencana rollback
20. Risiko
21. Verifikasi akhir

---

# Bagian I — Gambaran Umum

## A. Apa itu MSF-DB

### A.1 Masalah yang diselesaikan

Mendokumentasikan database adalah pekerjaan yang membosankan dan hampir selalu tertunda. Seorang
developer harus membuka tabel satu per satu, menuliskan kegunaan tiap kolom, menjelaskan relasi antar
tabel, lalu merapikannya menjadi dokumen yang bisa dibaca orang lain. Untuk database dengan 30 tabel,
pekerjaan ini bisa memakan berhari-hari, dan hasilnya langsung usang begitu skema berubah.

### A.2 Cara MSF-DB menyelesaikannya

MSF-DB membaca struktur database, lalu meminta AI menuliskan penjelasannya, dan mengemas hasilnya
menjadi dokumen Word atau PDF yang siap dibagikan.

Pengguna cukup melakukan salah satu dari dua hal:

1. **Menempelkan skrip SQL** — salin perintah `CREATE TABLE` ke dalam editor di aplikasi
2. **Menghubungkan database langsung** — isi host, port, nama database, username, dan password

Selebihnya berjalan otomatis. Hasil akhirnya berupa satu berkas dokumentasi berisi penjelasan tiap
tabel, ringkasan kolom, dan relasi antar tabel.

### A.3 Siapa penggunanya

Developer, database administrator, dan tim teknis berskala personal sampai kecil. Ini bukan produk
multi-tenant: tidak ada sistem akun pengguna, tidak ada login, dan tidak ada pemisahan data antar
pengguna. Siapa pun yang dapat membuka alamatnya dapat memakainya.

### A.4 Hal yang membedakan

Pengguna dapat memilih AI yang berjalan **sepenuhnya di komputer sendiri** melalui Ollama. Dalam mode
ini, struktur database tidak pernah dikirim ke layanan pihak ketiga mana pun. Ini penting karena skema
database sering memuat informasi sensitif tentang bisnis, dan banyak organisasi tidak diizinkan
mengirimkannya ke layanan cloud.

Sebagai alternatif tersedia DeepSeek dan OpenAI yang lebih cepat dan lebih pintar, dengan konsekuensi
data dikirim keluar dan ada biaya per pemakaian.

---

## B. Alur kerja aplikasi dari awal sampai akhir

Bagian ini memetakan perjalanan pengguna langkah demi langkah: apa yang ditekan, apa yang terjadi di
balik layar, gerbang pemeriksaan mana yang dilewati, dan apa yang muncul di layar bila langkah itu
gagal. Seluruh rincian diverifikasi langsung ke berkas dan baris yang disebut.

### B.1 Peta alur

| # | Alur | Dimulai oleh | Titik masuk | Rincian |
|---|---|---|---|---|
| 1 | Membuat dokumentasi | Pengguna | `/dashboard` lalu `/generate` | B.2 |
| 2 | Memilih sumber data: tempel SQL atau koneksi langsung | Pengguna | `/generate` | B.3 |
| 3 | Memantau pekerjaan yang sedang berjalan | Browser, otomatis tiap 2 detik | `/generate` | B.4 |
| 4 | Melacak pekerjaan lama lewat kode akses | Pengguna | `/dashboard` atau `/generate` | B.5 |
| 5 | Menangani kegagalan | Sistem | mana saja | B.6 |
| 6 | Mengelola sistem | Pemilik sistem | `/admin` | B.7 |

Alur kerja proyek — bagaimana kode ini dikerjakan dan di-merge — sengaja dipisah ke B.9 agar tidak
tercampur dengan alur aplikasi.

### B.2 Alur utama — membuat dokumentasi

Empat fase. Fase 1 dan 4 seluruhnya terjadi di browser, fase 2 adalah satu permintaan HTTP, fase 3
berjalan di server tanpa keterlibatan pengguna.

```
FASE 1 - PERSIAPAN (di browser; belum ada apa pun yang dikirim ke server)

  [1] Buka /dashboard
        Halaman mengecek kesehatan server tiap 12 detik dan menampilkan
        riwayat lokal milik browser ini saja
          |
  [2] Pilih sumber data
          |
          +--- JALUR A: tempel skrip SQL ---+--- JALUR B: koneksi database langsung
          |      Editor Monaco, sudah       |      Isi engine, host, port, nama database,
          |      terisi contoh SQL bawaan   |      username, password (atau connection string)
          |            |                    |            |
          |            |                    |      Tekan "Test Koneksi" -- WAJIB.
          |            |                    |      Server konek, membaca versi server,
          |            |                    |      daftar schema, dan daftar tabel
          |            |                    |            |
          |            |                    |      Gagal -> berhenti di sini; tombol
          |            |                    |      Generate tetap terkunci
          |            |                    |            |
          |            |                    |      Berhasil -> pilih schema, dan bila
          |            |                    |      perlu centang tabel tertentu saja
          |            +---------+----------+
          |                      |
  [3] Atur pilihan <-------------+
        Bahasa dan format terlihat langsung. Nama proyek, penulis, konteks
        bisnis, tingkat detail, penyedia AI, dan model berada di dalam
        accordion "Opsi Lanjutan" yang TERTUTUP secara bawaan
          |
FASE 2 - PENGIRIMAN (satu permintaan HTTP)

  [4] Tekan Generate
        Empat gerbang diperiksa di browser, lalu tiga gerbang di server (B.2.4).
        Bila semua lolos: job dibuat, server menjawab job_id dan access_code
          |
  [5] Pop-up kode akses muncul satu kali
        MSF-XXXXXXXXXX. Ini satu-satunya cara menemukan kembali pekerjaan
        ini dari browser lain atau perangkat lain
          |
FASE 3 - PEMROSESAN (di server; pengguna boleh menutup halaman)

  [6] Job berjalan tabel demi tabel
        Untuk tiap tabel: susun prompt, kirim ke AI, tunggu jawaban, catat progres.
        Satu tabel yang gagal TIDAK menggagalkan job -- tabel itu tetap masuk
        dokumen, hanya tanpa penjelasan AI
          |
        Setelah semua tabel: susun Markdown -> ekspor DOCX atau PDF ->
        tulis berkas ke disk -> status done
          |
        Selama halaman terbuka, browser menanyakan status tiap 2 detik
          |
FASE 4 - PENGAMBILAN HASIL (di browser)

  [7] Halaman berpindah ke tampilan hasil
        Preview 2000 karakter pertama dan tombol unduh.
        Berkas hidup 60 menit sejak selesai; sesudah itu dihapus penyapu terjadwal
```

Lama proses bergantung pada jumlah tabel dan AI yang dipilih. Perkiraan sistem sendiri adalah sekitar
15 detik per tabel (`generate.py:161`), sehingga 20 tabel berada di kisaran 5 menit. Batas waktu maksimum
satu pekerjaan adalah 30 menit; setelah itu pekerjaan dihentikan otomatis (`job_queue.py:161`).

#### B.2.1 Langkah 1 — membuka aplikasi

Halaman utama adalah `/dashboard`. Tiga hal terjadi tanpa diminta:

| Yang terjadi | Rincian | Bukti |
|---|---|---|
| Pengecekan kesehatan | `GET /api/health` diulang tiap 12 detik; menampilkan status API dan status Ollama beserta model bawaannya | `dashboard/page.tsx:34-40`, `main.py:223-247` |
| Pemuatan riwayat lokal | Dibaca dari `localStorage` kunci `msf_jobs_history`, maksimum 15 entri terakhir | `useGenerate.ts:31`, `dashboard/page.tsx:43-50` |
| Dua tombol masuk | Mengarah ke `/generate?tab=ddl` dan `/generate?tab=database` | `dashboard/page.tsx:99,117` |

Poin yang sering disalahpahami: **riwayat di Dashboard adalah milik browser, bukan milik server.** Ia
disimpan di `localStorage`. Berganti browser, berganti perangkat, atau membersihkan data situs membuat
daftar itu kosong sekalipun pekerjaannya masih hidup di server. Satu-satunya hal yang menyeberangi
browser adalah kode akses.

#### B.2.2 Langkah 2 — memilih sumber data

Dua jalur, dibandingkan lengkap di B.3. Yang perlu diketahui di alur utama:

- **Jalur A** tidak punya tahap verifikasi. Skrip SQL baru diperiksa saat tombol Generate ditekan.
- **Jalur B** punya gerbang keras: tombol Generate tetap nonaktif sampai "Test Koneksi" berhasil
  (`generate/page.tsx:210`). Mengubah satu field koneksi apa pun sesudah itu langsung membatalkan status
  terverifikasi dan mengosongkan pilihan schema serta tabel (`DbConnector.tsx:42-52`) — ini disengaja,
  supaya pengguna tidak menjalankan job memakai kredensial yang belum pernah diuji.

#### B.2.3 Langkah 3 — mengatur pilihan

| Pilihan | Nilai bawaan | Letak di layar | Pengaruhnya pada hasil | Bukti |
|---|---|---|---|---|
| Bahasa dokumen | Indonesian | Terlihat langsung | Mengubah bahasa prompt AI sekaligus seluruh heading dokumen | `doc_generator.py:126,226` |
| Format keluaran | DOCX | Terlihat langsung | Menentukan exporter yang dipakai | `generate.py:55-73` |
| Nama proyek | `My Project DB` | Opsi Lanjutan | Judul dokumen dan nama berkas unduhan | `generate.py:52-53` |
| Penulis | `Developer` | Opsi Lanjutan | Metadata dokumen | `generate.py:63,72` |
| Konteks bisnis | kosong | Opsi Lanjutan | Disisipkan ke prompt **setiap** tabel; inilah yang membuat hasil terasa spesifik pada domain, bukan generik | `doc_generator.py:214-219` |
| Tingkat detail | Detailed | Opsi Lanjutan | `simple` 2-3 kalimat; `detailed` menambah penjelasan kolom penting dan relasi; `comprehensive` menambah use case bisnis dan seksi indeks | `doc_generator.py:227-231,159-161` |
| Penyedia AI | Ollama | Opsi Lanjutan | Menentukan ke mana struktur database dikirim | `GeneratePanel.tsx:87-91` |
| Model AI | dipilih otomatis | Opsi Lanjutan | Ollama: model pertama yang mengandung `deepseek`, `llama`, atau `mistral`. DeepSeek: `deepseek-chat`. OpenAI: `gpt-4o-mini` | `GeneratePanel.tsx:44-78` |

Dua konsekuensi yang layak dicatat:

1. Ringkasan relasi antar tabel hanya ikut dibuat bila tingkat detail `detailed` atau `comprehensive`
   **dan** tabelnya lebih dari satu (`doc_generator.py:100`).
2. Seluruh pilihan yang paling memengaruhi kualitas hasil berada di dalam accordion yang tertutup
   secara bawaan (`GeneratePanel.tsx:31`). Pengguna yang tidak pernah membukanya akan menerima dokumen
   berjudul "My Project DB" karya "Developer" tanpa konteks bisnis. Tidak ada yang rusak, tetapi ini
   penjelasan paling mungkin ketika hasil pertama terasa datar.

#### B.2.4 Langkah 4 — menekan Generate: tujuh gerbang berurutan

| Urutan | Gerbang | Diperiksa di | Bila gagal |
|---|---|---|---|
| 1 | Model AI sudah terpilih | Browser — `generate/page.tsx:63-66` | Toast peringatan; tidak ada permintaan yang dikirim |
| 2 | Tombol aktif: bukan mode DB yang belum terverifikasi, dan bukan Ollama tanpa model | Browser — `GeneratePanel.tsx:356` | Tombol tidak dapat ditekan sama sekali |
| 3 | Editor SQL tidak kosong (Jalur A) | Browser — `generate/page.tsx:69-72` | Toast peringatan |
| 4 | Koneksi sudah diverifikasi (Jalur B) | Browser — `generate/page.tsx:89-92` | Toast peringatan |
| 5 | Job aktif kurang dari `MAX_CONCURRENT_JOBS` (bawaan 3) | Server — `generate.py:115-121`, `188-194` | 429 "Terlalu banyak job aktif" |
| 6 | Jalur A: SQL lolos validator. Jalur B: koneksi diuji **ulang** oleh server | Server — `generate.py:123-125`, `196-201` | 400 dengan pesan penyebabnya |
| 7 | Jumlah tabel tidak melebihi `MAX_TABLES_PER_REQUEST` (bawaan 50) | Server — `generate.py:130-135` (Jalur A) dan `generate.py:232-237` (Jalur B) | Jalur A: 400 seketika. Jalur B: job terlanjur dibuat lalu berakhir `error` |

Gerbang 6 pada Jalur B berarti koneksi diuji dua kali: sekali oleh pengguna lewat tombol Test Koneksi,
sekali lagi oleh server sebelum job dibuat. Ini disengaja — jeda antara verifikasi dan penekanan tombol
bisa panjang, dan database bisa mati di antaranya.

Gerbang 7 adalah aturan yang sama tetapi ditegakkan di dua titik yang sangat berbeda rasanya bagi
pengguna. Lihat temuan 9.14.

Bila seluruh gerbang lolos, server menjawab: `job_id`, `status: queued`, `created_at`,
`estimated_seconds`, dan `access_code`. Angka `estimated_seconds` dihitung `jumlah tabel x 15` pada
Jalur A, tetapi dipatok tetap 60 detik pada Jalur B berapa pun besarnya database (`generate.py:253`) —
lihat temuan 9.15.

#### B.2.5 Langkah 5 — kode akses

| Aspek | Rincian | Bukti |
|---|---|---|
| Bentuk | `MSF-` diikuti 10 karakter heksadesimal huruf besar, dibangkitkan `secrets.token_hex(5)` | `job_queue.py:39` |
| Kapan muncul | Pop-up tampil sekali saat status `queued` atau `processing`, bila kode itu belum pernah ditutup | `JobStatus.tsx:32-40` |
| Cara sistem mengingat | Kunci `msf_dismissed_code_<kode>` di `localStorage`; setelah ditutup, pop-up tidak muncul lagi untuk kode itu | `JobStatus.tsx:50` |
| Setelah pop-up ditutup | Kode tetap terlihat pada widget di panel progres selama pekerjaan berjalan, lengkap dengan tombol salin | `JobStatus.tsx:152-172` |

Kode akses adalah satu-satunya pegangan yang berpindah perangkat. `job_id` bersifat internal dan tidak
pernah ditampilkan sebagai sesuatu yang perlu disimpan pengguna.

#### B.2.6 Langkah 6 — pemrosesan di latar belakang

Job dijalankan lewat `BackgroundTasks` FastAPI, dibungkus `asyncio.wait_for` dengan batas
`JOB_TIMEOUT_SECONDS` (bawaan 1800 detik). Urutannya:

```
run_job() -> status processing
   |
   +-- Jalur B saja: tarik metadata dari database, periksa batas jumlah tabel
   |
   +-- untuk tiap tabel ke-i dari n:
   |        cek pembatalan
   |        catat current_table, tables_processed = i, progress = (i/n)*90
   |        susun prompt -> kirim ke AI -> tunggu jawaban
   |        gagal? pakai dokumentasi dasar + catatan "AI description tidak tersedia", LANJUT
   |
   +-- semua tabel selesai: progress 90, susun ringkasan relasi, gabungkan Markdown
   |
   +-- progress 92: ekspor ke DOCX atau PDF di memori
   |
   +-- tulis berkas ke OUTPUT_DIR/msf_doc_<job_id>.<format>, progress 100
   |
   +-- status done, completed_at diisi
```

Perilaku yang perlu dipahami pengguna maupun pelaksana:

| Perilaku | Penjelasan | Bukti |
|---|---|---|
| Kegagalan AI per tabel tidak fatal | Tabel yang gagal tetap masuk dokumen dengan tabel kolom lengkap, hanya tanpa prosa AI. Job tetap berakhir `done` | `doc_generator.py:95-97,351-375` |
| Pembatalan tidak seketika | Status diubah segera, tetapi pemeriksaan pembatalan terjadi di awal tiap tabel. Panggilan AI yang sedang berjalan tidak diputus, jadi berhenti terjadi setelah tabel itu selesai | `doc_generator.py:80-82` |
| Menutup halaman tidak menghentikan pekerjaan | Yang berhenti hanya polling di browser. Job tetap berjalan di server | `useGenerate.ts:164-169` |
| Refresh halaman melanjutkan pemantauan | `job_id` aktif disimpan di `localStorage` `msf_active_job_id` dan divalidasi ulang saat halaman dimuat | `useGenerate.ts:53-72` |
| Polling punya batasnya sendiri | Tiap 2 detik, maksimum 900 kali (30 menit). Lima kegagalan berturut-turut menghentikan pelacakan dengan pesan koneksi terputus, walau job bisa saja masih hidup | `useGenerate.ts:86-88,140-155,162` |
| Preview mengalir saat proses berjalan | 2000 karakter pertama dokumen ditampilkan sebagai aliran teks selama status masih berjalan | `doc_generator.py:110-112`, `JobStatus.tsx:209-219` |
| Gagal menulis berkas = job gagal | Bila penulisan ke disk gagal, status langsung `error` walau seluruh dokumentasi sudah jadi | `job_queue.py:76-81` |

#### B.2.7 Langkah 7 — hasil dan unduhan

| Yang terjadi | Rincian | Bukti |
|---|---|---|
| Halaman berpindah | Panel progres diganti tampilan preview begitu status `done` | `generate/page.tsx:129-139` |
| Tombol unduh muncul | `download_url` hanya diisi bila status `done` **dan** berkasnya benar-benar masih ada di disk | `job_queue.py:42-44` |
| Unduhan | `GET /api/jobs/{job_id}/download` membaca berkas dari disk dan mengirimkannya sebagai lampiran | `generate.py:293-328` |
| Umur berkas | Penyapu berjalan tiap 15 menit dan membuang job selesai yang lebih tua dari 60 menit, berikut berkasnya dan seluruh jejaknya di memori | `main.py:78-88`, `job_queue.py:195-213` |

Karena penyapu menghapus berkas **dan** catatan job sekaligus, setelah 60 menit kode akses ikut mati.
Inilah yang diperbaiki v2.2.0: berkas tetap 60 menit, catatan bertahan 30 hari (D2, 11.2).

### B.3 Dua jalur sumber data dibandingkan

| Aspek | Jalur A — tempel skrip SQL | Jalur B — koneksi database langsung |
|---|---|---|
| Yang diisi pengguna | Skrip `CREATE TABLE` di editor Monaco | Engine, host, port, nama database, username, password — atau satu connection string |
| Engine yang ditawarkan di layar | Tidak relevan; parser membaca dialek umum | PostgreSQL, MySQL, SQLite, SQL Server, MongoDB (`DbConnector.tsx:34-40`) |
| Engine yang benar-benar berfungsi | — | PostgreSQL, MySQL, SQLite. SQL Server diaktifkan pada rilis ini (11.4); MongoDB ditolak `build_connection_url` (`db_connector.py:68`) — lihat 9.17 |
| Verifikasi sebelum Generate | Tidak ada | Wajib. Tombol Generate terkunci sampai Test Koneksi berhasil |
| Yang dibaca sistem | Tabel, kolom, tipe data, kunci primer, kunci asing, indeks dari teks skrip | Versi server, daftar schema, daftar tabel, lalu metadata penuh saat job berjalan |
| Penyaringan | Tidak ada; seluruh tabel di dalam skrip diproses | Pilih satu schema, dan bila perlu centang sebagian tabel saja |
| Batas 50 tabel ditegakkan | Sebelum job dibuat — pengguna dapat 400 seketika | Setelah job berjalan — pengguna dapat kode akses lalu job berakhir `error` (9.14) |
| Perkiraan waktu yang diberikan | Jumlah tabel dikali 15 detik | Selalu 60 detik, berapa pun jumlah tabelnya (9.15) |
| Kredensial | Tidak ada | Hanya dipakai sementara di backend, tidak disimpan, dan disensor sebelum masuk log (`generate.py:181-186`) |
| Data yang keluar dari mesin | Isi skrip dikirim ke penyedia AI, kecuali memakai Ollama | Struktur hasil inspeksi dikirim ke penyedia AI, kecuali memakai Ollama |

### B.4 Peta status pekerjaan dan arti angka progres

```
                 create_job()
                      |
                      v
                 [ queued ]
                      |
        run_job() menandai processing
                      v
                [ processing ] ------ pengguna menekan Cancel -----> [ cancelled ]
                  |        |
                  |        +--------- lewat 30 menit --------------> [ error ]
                  |        +--------- kesalahan fatal -------------> [ error ]
                  v
                [ done ]
```

| Angka progres | Artinya | Bukti |
|---|---|---|
| 0 | Job baru dibuat, belum diambil pekerja | `job_queue.py:25` |
| 0 sampai 90 | AI sedang mengerjakan tabel ke-i dari n; dihitung `(i / n) * 90` | `doc_generator.py:86` |
| 90 | Seluruh tabel selesai; ringkasan relasi disusun | `doc_generator.py:105` |
| 92 | Mulai membentuk berkas DOCX atau PDF | `generate.py:50` |
| 100 | Berkas sudah ditulis ke disk; `run_job` menetapkan status `done` | `generate.py:80`, `job_queue.py:171-176` |

Dua hal yang tampak seperti bug padahal bukan:

1. Penghitung tabel menampilkan `0 / 12` selama tabel pertama diproses, karena `tables_processed`
   diisi indeks tabel yang **sedang** dikerjakan, bukan yang sudah selesai (`doc_generator.py:85`).
2. Bar progres berhenti agak lama di 92 persen pada skema besar, karena pembentukan DOCX berjalan
   sinkron di event loop dan tidak melaporkan progres antara. Ini technical debt yang sudah dicatat
   pada bagian 20.

### B.5 Alur pelacakan dan apa yang bertahan terhadap apa

Ada empat pintu masuk untuk kembali ke sebuah pekerjaan:

| # | Pintu masuk | Cara kerja | Bukti |
|---|---|---|---|
| 1 | Form pelacakan di Dashboard | Kode akses dikirim ke `GET /api/jobs/by-code/{code}`, lalu halaman berpindah ke `/generate` dan melanjutkan polling | `dashboard/page.tsx:52-61` |
| 2 | Form pelacakan di panel Generator | Sama, tanpa berpindah halaman | `GeneratePanel.tsx:327-351` |
| 3 | Daftar riwayat lokal di Dashboard | Menekan entri memakai kode akses yang tersimpan di `localStorage` | `dashboard/page.tsx:170-183` |
| 4 | Pemulihan otomatis saat halaman dibuka | `msf_active_job_id` dibaca dan divalidasi; bila job sudah selesai atau tidak ditemukan, kuncinya dibuang | `useGenerate.ts:53-72` |

Yang menentukan berhasil tidaknya pelacakan bukan pintu masuknya, melainkan apakah pekerjaan itu masih
ada di server:

| Kejadian | Riwayat lokal di browser | Catatan job di server | Berkas hasil |
|---|---|---|---|
| Halaman ditutup atau di-refresh | Bertahan | Bertahan, pekerjaan tetap berjalan | Bertahan |
| Dibuka dari browser atau perangkat lain | Tidak terlihat | Ditemukan lewat kode akses | Dapat diunduh |
| 60 menit setelah pekerjaan selesai | Entri masih terlihat, tetapi kodenya sudah mati | Terhapus penyapu | Terhapus |
| Backend restart, deploy ulang, atau mati mendadak | Entri masih terlihat, tetapi kodenya sudah mati | **Hilang seluruhnya** | Berkas masih ada di volume, tetapi menjadi yatim dan tidak pernah dibersihkan (9.16) |
| Setelah v2.2.0: backend restart | Sama | Dipulihkan dari SQLite. Job yang sedang berjalan ditandai `error` dengan pesan restart | Berkas tetap 60 menit; catatan job bertahan 30 hari |

**Di sinilah letak masalah yang diperbaiki rilis v2.2.0.** Saat ini seluruh riwayat pekerjaan disimpan
di memori (`job_queue.py:105`). Begitu server dimatikan, di-deploy ulang, atau mati mendadak, semua
pekerjaan hilang dan kode akses yang sudah disalin pengguna menjadi tidak berguna. Bahkan tanpa restart
pun, riwayat terhapus otomatis setelah 60 menit. Setelah v2.2.0, riwayat bertahan 30 hari dan selamat
dari restart; rinciannya di 8.1 dan 11.2.

### B.6 Alur kegagalan dan pesan yang dilihat pengguna

| Kondisi | Terdeteksi di | Yang dilihat pengguna | Status pekerjaan |
|---|---|---|---|
| Model AI belum dipilih | Browser, sebelum request | Toast peringatan | Tidak ada job |
| Ollama mati atau tanpa model | Browser, saat memuat daftar model | Panel merah "NO MODEL FOUND" dan tombol Generate nonaktif | Tidak ada job |
| Editor SQL kosong | Browser | Toast peringatan | Tidak ada job |
| Koneksi database belum diuji | Browser | Peringatan kuning permanen di atas form | Tidak ada job |
| Skrip SQL tidak valid | Server, sebelum job | 400 berisi pesan dari validator | Tidak ada job |
| Koneksi database gagal | Test Koneksi, dan sekali lagi di server | Pesan kegagalan yang sudah dibersihkan dari kredensial | Tidak ada job |
| Engine belum didukung, misalnya MongoDB | Test Koneksi | "Error: Engine tidak didukung: mongodb" — padahal engine itu ditawarkan di layar (9.17) | Tidak ada job |
| Lebih dari 50 tabel | Jalur A sebelum job; Jalur B di dalam job | Jalur A: 400 seketika. Jalur B: kode akses terlanjur diberikan, lalu pekerjaan gagal (9.14) | — / `error` |
| Tiga pekerjaan sedang berjalan | Server, sebelum job | 429 "Terlalu banyak job aktif" | Tidak ada job |
| AI gagal pada sebagian tabel | Selama pemrosesan | Tidak ada peringatan apa pun. Dokumen memuat catatan "AI description tidak tersedia" pada tabel bersangkutan | `done` |
| AI gagal pada semua tabel | Selama pemrosesan | Dokumen tetap jadi, isinya hanya tabel kolom tanpa penjelasan | `done` |
| Melebihi 30 menit | Server | Pesan batas waktu terlampaui | `error` |
| Pengguna menekan Cancel | Server, di awal tabel berikutnya | "Proses dibatalkan" | `cancelled` |
| Gagal menulis berkas ke disk | Server, saat ekspor | "Gagal menyimpan file" | `error` |
| Backend tak terjangkau 5 kali berturut-turut | Browser | "Koneksi ke API Server terputus", walau pekerjaan bisa saja masih hidup | Tidak berubah |
| Berkas hasil sudah kedaluwarsa | Saat menekan unduh | Saat ini 500 "File hasil tidak tersedia" — menyesatkan. Setelah v2.2.0 menjadi 410 `RESULT_EXPIRED` | `done` |
| Backend restart di tengah pekerjaan | — | Saat ini bar progres menggantung selamanya. Setelah v2.2.0 statusnya `error` dengan pesan restart | Hilang / `error` |

Baris yang paling perlu diperhatikan adalah dua baris kegagalan AI: **pekerjaan bisa berakhir sukses
dengan isi yang jauh lebih miskin dari yang diharapkan, tanpa satu pun tanda di antarmuka.** Ini bukan
cakupan rilis v2.2.0, tetapi dicatat di sini karena baru terlihat setelah alurnya dipetakan utuh.

### B.7 Alur admin

```
Buka /admin -- tidak ada tautannya di menu navigasi
      |
Masukkan passcode -> POST /api/admin/verify
      |
      +-- ADMIN_PASSCODE kosong di server -> 403, portal mati total
      +-- passcode salah                   -> 401
      +-- passcode benar                   -> portal terbuka
             |
             +-- Statistik: total pekerjaan, sukses, gagal, rata-rata durasi,
             |   sebaran penyedia AI, sebaran engine database
             +-- Daftar seluruh pekerjaan, terbaru lebih dulu
             +-- Log server: 10 sampai 1000 baris terakhir dari berkas log
             +-- Pembersihan paksa: batalkan semua pekerjaan aktif,
                 lalu hapus seluruh riwayat berikut berkasnya
```

| Aspek | Rincian | Bukti |
|---|---|---|
| Cara autentikasi | Passcode dikirim sebagai header `X-Admin-Passcode` pada setiap permintaan. Tidak ada sesi, tidak ada token, tidak ada masa berlaku | `admin.py:18-36` |
| Sumber angka statistik | Dihitung dari isi memori. Karena memori hanya menyimpan 60 menit terakhir, angka yang tampil sebenarnya adalah angka satu jam terakhir, bukan sepanjang masa | `admin.py:48` |
| Setelah v2.2.0 | Sumbernya menjadi `JobStore.query()` sehingga angkanya melintasi 30 hari. Perubahan makna ini dicatat di `CHANGELOG.md` | D3, 8.3 |
| Risiko | Passcode bawaan `admin123` aktif lewat `docker-compose.yml` pada aplikasi yang terbuka ke internet. Lihat 9.11 dan D.6 | 11.5 |

### B.8 Titik pada alur yang berubah di v2.2.0

| Langkah pada B.2 | Yang berubah | Rincian |
|---|---|---|
| Langkah 2, Jalur B | SQL Server benar-benar dapat dipilih dan berfungsi | 11.4 |
| Langkah 4 | Ditambah pembatasan per alamat IP; dua jenis 429 dibedakan lewat `error_code` | 11.3, 8.2 |
| Langkah 5 | Kode akses tetap berguna setelah server restart | 11.2 |
| Langkah 6 | Pekerjaan yang mati karena restart ditandai `error`, bukan menggantung | 9.1, 11.2 |
| Langkah 7 | Berkas kedaluwarsa dijawab 410 `RESULT_EXPIRED`, bukan 500 | 7.3 |
| Alur pelacakan (B.5) | Riwayat bertahan 30 hari dan selamat dari restart | D2, 11.2 |
| Alur admin (B.7) | Passcode bawaan dihapus; statistik melintasi 30 hari | 11.5, D3 |

Tidak ada langkah baru yang ditambahkan dan tidak ada langkah yang dihapus. Bentuk alurnya identik;
yang berubah adalah apa yang bertahan dan seberapa jelas pesan kegagalannya.

### B.9 Alur pengembangan (bukan alur pengguna)

Untuk menghindari kebingungan antara alur aplikasi dan alur kerja proyek:

```
Kode dikerjakan di branch dev
       |
AI mengerjakan per batch kecil, satu perubahan satu commit
       |
AI TIDAK PERNAH melakukan git push -- push selalu manual oleh manusia
       |
Setelah verifikasi lulus, manusia melakukan merge dev ke main
       |
Folder dokumentasi (ai-rules, dev-docs, planning, reports) dikecualikan dari main
```

---

## C. Daftar fitur lengkap

### C.1 Fitur yang terlihat pengguna

| # | Fitur | Halaman | Isi | Status pada v2.2.0 |
|---|---|---|---|---|
| 1 | **Dashboard** | `/dashboard` | Halaman utama. Riwayat pekerjaan milik pengguna (disimpan di browser), kolom pelacakan kode akses, penanda privasi | Tidak berubah |
| 2 | **Generator** | `/generate` | Fitur inti. Editor SQL (Monaco), form koneksi database, pilihan AI dan model, bahasa, tingkat detail, format keluaran, konteks bisnis di dalam accordion Opsi Lanjutan | Ditambah SQL Server; penanganan pesan 429 diperbaiki |
| 3 | **Diagram** | `/diagram` | Membuat diagram relasi antar tabel (ERD) dari skrip SQL. Lima jenis tata letak, unduh sebagai PNG, template contoh | Tidak berubah |
| 4 | **Shortcuts** | `/shortcuts` | Kumpulan contoh perintah SQL siap pakai untuk MySQL dan PostgreSQL, lengkap dengan penanda tingkat risiko | Tidak berubah |
| 5 | **Admin Portal** | `/admin` | Tersembunyi dari menu, dilindungi passcode. Statistik, daftar pekerjaan, log server, diagnostik, pembersihan | Passcode diperkuat; statistik kini melintasi 30 hari |
| 6 | **Settings** | `/settings` | Dialihkan ke Dashboard | Tetap dialihkan (keputusan UX 2026-07-06) |

### C.2 Kemampuan inti di balik layar

| # | Kemampuan | Rincian | Status pada v2.2.0 |
|---|---|---|---|
| 1 | **Parser SQL** | Membaca `CREATE TABLE` dan mengenali tabel, kolom, tipe data, kunci primer, kunci asing, indeks | Tidak berubah |
| 2 | **Konektor database** | PostgreSQL, MySQL, SQLite aktif. SQL Server ada kodenya tetapi **belum berfungsi**. MongoDB belum ada | **SQL Server diaktifkan.** MongoDB tetap ditunda |
| 3 | **Penyedia AI** | Ollama (lokal), DeepSeek, OpenAI. Diproses per tabel agar tidak melebihi batas token | Tidak berubah |
| 4 | **Ekspor dokumen** | Word (DOCX) dan PDF | Tidak berubah |
| 5 | **Antrean pekerjaan** | Maksimum 3 pekerjaan bersamaan, batas waktu 30 menit per pekerjaan, dapat dibatalkan | **Menjadi persisten dengan SQLite** |
| 6 | **Kode akses** | Format `MSF-` + 10 karakter heksadesimal | Kini bertahan setelah restart |
| 7 | **Pengamanan API** | API key opsional lewat `MSF_API_KEY`, CORS, penyensoran password di log | **Ditambah rate limiting per IP** |
| 8 | **Log server** | Log terstruktur, dapat dibaca lewat Admin Portal | Tidak berubah |

### C.3 Permukaan API

Total **22 endpoint** pada 7 kelompok:

| Kelompok | Jumlah | Endpoint |
|---|---|---|
| Generate dan Job | 7 | `parse-ddl`, `from-ddl`, `from-db`, `jobs/{id}`, `jobs/by-code/{code}`, `jobs/{id}/cancel`, `jobs/{id}/download` |
| Admin | 5 | `verify`, `stats`, `jobs`, `logs`, `cleanup` |
| AI | 3 | `models`, `providers`, `test` |
| Shortcuts | 3 | daftar, `engines`, `categories` |
| Database | 2 | `test-connection`, `metadata` |
| Export | 2 | `docx`, `pdf` |
| Stats | 1 | `stats` |

Rilis v2.2.0 **tidak menambah atau menghapus satu endpoint pun.** Yang berubah hanya perilaku internal
dan bentuk respons error. Rinciannya di bagian 7.

### C.4 Fitur yang sengaja belum ada

| Fitur | Alasan |
|---|---|
| Akun pengguna dan login | Bukan produk multi-tenant. Pelacakan memakai kode akses, bukan identitas |
| MongoDB | Schemaless, butuh strategi inferensi skema tersendiri |
| Mode gelap | Antre di `TODO.md` v2.2 |
| Share link | Antre di `TODO.md` Nice to Have |
| Notifikasi webhook | Antre di `TODO.md` Nice to Have |
| Bahasa selain Indonesia dan Inggris | Antre di `TODO.md` Nice to Have |

---

## D. Sumber daya yang dibutuhkan

### D.1 Layanan yang berjalan

Empat container aktif, satu dinonaktifkan:

| # | Layanan | Image atau sumber | Peran | Status |
|---|---|---|---|---|
| 1 | **backend** | Dibangun dari `backend/Dockerfile`, basis `python:3.11-slim` | Otak aplikasi: API, parser, AI, ekspor, antrean | Aktif |
| 2 | **frontend** | Dibangun dari `frontend/Dockerfile`, Next.js 14 | Antarmuka pengguna | Aktif |
| 3 | **postgres** | `postgres:16-alpine` | **Hanya untuk uji coba fitur koneksi database.** Bukan tempat data aplikasi | Aktif |
| 4 | **cloudflared** | `cloudflare/cloudflared:latest` | Terowongan agar aplikasi dapat diakses dari internet | Aktif |
| 5 | ollama | `ollama/ollama:latest` | AI lokal | **Dinonaktifkan** — dijalankan langsung di komputer host karena port bentrok |

Poin penting yang mudah disalahpahami: **PostgreSQL bukan tempat penyimpanan data aplikasi.** Ia hanya
database contoh untuk menguji fitur "hubungkan ke database". Data aplikasi yang sesungguhnya berupa
berkas hasil dan, mulai v2.2.0, berkas `jobs.db` di dalam volume.

### D.2 Port

| Layanan | Port msf-app (v1) | Port v2 | Alasan dipisah |
|---|---|---|---|
| Frontend | 3000 | **3001** | Agar keduanya dapat berjalan bersamaan untuk dibandingkan |
| Backend | 8000 | **8001** | Sama |
| PostgreSQL | 5432 | **5433** | Sama |
| Ollama (di host) | 11434 | **11435** | Sama |

Selain port, nama container dan nama volume juga wajib dibedakan. Tanpa itu v2 tidak akan bisa
dijalankan sama sekali, bukan sekadar bentrok. Penjelasannya di 9.9.

### D.3 Penyimpanan

| Volume | Isi | Perkiraan ukuran |
|---|---|---|
| `msf2_backend_outputs` | Berkas DOCX/PDF hasil generate, log aplikasi, dan **`jobs.db` (baru di v2.2.0)** | Berkas dibersihkan tiap 60 menit. `jobs.db` sekitar 1,5 MB untuk 30 hari pemakaian normal |
| `msf2_postgres_data` | Data PostgreSQL uji coba | Kecil, bergantung isi tabel percobaan |
| `msf2_ollama_data` | Dideklarasikan tetapi **tidak terpakai** karena layanan Ollama dinonaktifkan | Nol |

Model AI Ollama tersimpan di komputer host, bukan di volume Docker. Model `llama3.2` berukuran sekitar
2 GB.

### D.4 Kebutuhan memori dan prosesor

**Belum pernah diukur.** Angka di bawah adalah perkiraan berdasarkan basis image dan tumpukan teknologi
yang dipakai, bukan hasil pengukuran. Pengukuran nyata dimasukkan sebagai butir verifikasi.

| Komponen | Perkiraan RAM diam | Perkiraan RAM puncak | Catatan |
|---|---|---|---|
| backend | 150-250 MB | 400-600 MB | Naik saat mengekspor DOCX/PDF karena seluruh dokumen dibentuk di memori |
| frontend | 100-200 MB | 250 MB | Next.js mode produksi |
| postgres | 50-80 MB | 150 MB | Alpine, beban ringan |
| cloudflared | 20-40 MB | 60 MB | Ringan |
| **Subtotal Docker** | **320-570 MB** | **860 MB - 1 GB** | |
| Ollama di host | — | **4-8 GB** | Hanya bila memakai AI lokal. Ini komponen terberat |

Kesimpulan praktis: dengan AI cloud (DeepSeek atau OpenAI), mesin 2 GB RAM sudah memadai. Dengan AI
lokal, kebutuhan melonjak menjadi 8 GB atau lebih, dan prosesor menjadi faktor penentu kecepatan.

**Temuan: tidak ada satu pun batas sumber daya yang dipasang.** `docker-compose.yml` sama sekali tidak
memuat `mem_limit`, `cpus`, maupun blok `deploy.resources`. Artinya satu container yang bermasalah dapat
menghabiskan seluruh RAM host dan mematikan layanan lain. Rincian dan usulan di D.7.

### D.5 Layanan pihak ketiga dan kredensial

| Layanan | Wajib? | Kredensial | Biaya | Terdokumentasi di `.env.example`? |
|---|---|---|---|---|
| Ollama (host) | Tidak, bila memakai AI cloud | Tidak ada | Gratis, tetapi butuh RAM besar | Ya |
| DeepSeek | Tidak | `DEEPSEEK_API_KEY` | Per pemakaian | Ya |
| OpenAI | Tidak | `OPENAI_API_KEY` | Per pemakaian | Ya |
| Cloudflare Tunnel | Ya, bila ingin diakses dari internet | `CLOUDFLARE_TUNNEL_TOKEN` | Gratis | **Tidak** |
| Admin Portal | Ya, bila ingin fitur admin aktif | `ADMIN_PASSCODE` | — | **Tidak** |

Setidaknya satu penyedia AI harus tersedia agar fitur inti berfungsi.

### D.6 Aplikasi ini terbuka ke internet

`docker-compose.yml` menjalankan Cloudflare Tunnel, dan `CORS_ORIGINS` memuat `https://msf-db.my.id`.
Artinya aplikasi ini **dapat diakses publik dari internet**, bukan hanya dari jaringan lokal.

Fakta ini menaikkan tingkat keparahan temuan 9.11 secara signifikan. Passcode admin `admin123` yang
aktif secara default bukan risiko sebatas jaringan lokal — ia terekspos ke internet terbuka, pada
portal yang dapat membaca log server, seluruh riwayat pekerjaan, dan menghapus semuanya. Perbaikan pada
11.5 karena itu diperlakukan sebagai prioritas, bukan kerapian.

Perlu dicatat pula bahwa aplikasi ini **tidak memiliki sistem login sama sekali**. Siapa pun yang
mengetahui alamatnya dapat menjalankan proses generate, yang berarti memakai kuota API berbayar pemilik
sistem. Inilah alasan rate limiting (11.3) bukan sekadar pelengkap.

### D.7 Temuan sumber daya

| # | Temuan | Dampak | Tindakan pada rilis ini |
|---|---|---|---|
| D-1 | Tidak ada batas memori maupun prosesor di seluruh container | Satu pekerjaan yang membengkak dapat menghabiskan RAM host dan mematikan layanan lain. Berjalannya v2 berdampingan dengan v1 menggandakan konsumsi tanpa pagar pengaman | **Diusulkan, tidak dikerjakan.** Menambah batas tanpa data pengukuran berisiko menyetel terlalu ketat dan mematikan proses yang sah. Diusulkan menjadi batch tersendiri setelah pengukuran D.4 tersedia |
| D-2 | `CLOUDFLARE_TUNNEL_TOKEN` tidak ada di `.env.example` padahal ini sebuah rahasia | Operator baru tidak tahu variabel ini dibutuhkan; layanan `cloudflared` gagal dengan pesan yang tidak jelas | **Dikerjakan** — masuk ke pembenahan config drift (D4). Menjadikannya variabel kesembilan yang tidak terdokumentasi, dan satu-satunya yang berupa rahasia |
| D-3 | Volume `msf2_ollama_data` dideklarasikan tetapi tidak terpakai | Membingungkan; tampak seolah ada data Ollama tersimpan padahal tidak | **Dikerjakan** — diberi komentar penjelas di `docker-compose.yml` |
| D-4 | Konsumsi RAM belum pernah diukur | Tidak ada dasar untuk menetapkan batas maupun memilih spesifikasi server | **Dikerjakan sebagian** — pengukuran dimasukkan sebagai butir kriteria penerimaan (bagian 18) |

### D.8 Tumpukan teknologi

| Lapisan | Teknologi |
|---|---|
| Backend | Python 3.11, FastAPI 0.115, Pydantic 2.10, SQLAlchemy 2.0, structlog |
| Driver database | psycopg2 (PostgreSQL), pymysql (MySQL), sqlite3 bawaan, **pyodbc (SQL Server — diaktifkan rilis ini)** |
| Dokumen | python-docx, xhtml2pdf, markdown |
| Frontend | Next.js 14.2, React 18.3, TypeScript 5.7, Tailwind 3.4 |
| Komponen UI | Radix UI, lucide-react, sonner, Monaco Editor, react-markdown, SWR, html-to-image |
| Pengujian | pytest, pytest-asyncio, pytest-cov, ruff. **Frontend tidak memiliki kerangka pengujian sama sekali** |
| Infrastruktur | Docker Compose, PostgreSQL 16 Alpine, Cloudflare Tunnel |

Tambahan pada v2.2.0: `slowapi` (rate limiting), `pyodbc` (SQL Server), `msodbcsql18` dan `unixodbc-dev`
di dalam image backend. Tidak ada dependensi frontend baru.

---

# Bagian II — Spesifikasi Teknis

## 1. Konteks dan posisi dalam roadmap

### 1.1 Keadaan direktori

`v2/msf-db/` saat ini hanya berisi dokumen (`ai-rules/`, `.agents/`, `README.md`, `TODO.md`,
`API_CONTRACT.md`, `CHANGELOG.md`, `DEVELOPMENT.md`, `.env`, `docker-compose.yml`, `claude.md`),
semuanya identik byte-per-byte dengan `msf-app/`. Belum ada `backend/`, `frontend/`, `dev-docs/`,
maupun `planning/`.

### 1.2 Posisi dalam roadmap resmi

`dev-docs/ai/VERSION.md` menyatakan:

| Item | Nilai |
|---|---|
| Versi saat ini | v2.1.0 (2026-06-29) |
| Target rilis berikutnya | **v2.2.0 — Antrean Job Persisten menggunakan database SQLite** |

Pekerjaan ini **adalah** v2.2.0 yang sudah direncanakan, bukan inisiatif baru. Rate limiting dan
dukungan SQL Server merupakan item `SHOULD DO` di `TODO.md` yang ikut diselesaikan pada rilis yang sama
karena bersinggungan dengan berkas yang sama.

### 1.3 Verifikasi klaim `claude.md`

Berkas `claude.md` memuat bagian berjudul "Known Issues Fixed in v2". Judul itu menyesatkan: tidak ada
satu pun yang sudah dikerjakan. Verifikasi baris-per-baris:

| # | Klaim | Fakta terverifikasi |
|---|---|---|
| 1 | Download pakai in-memory bytes tapi cek file path | Sudah benar. `job_queue.py:66` menulis ke disk, `generate.py:306` memeriksa `os.path.exists`. |
| 2 | Admin passcode default `admin123` | **Benar.** Lihat 9.11 — `admin.py:15` aman, tetapi `docker-compose.yml:52` menyuntikkan `admin123`. |
| 3 | Settings page stub redirect | Benar stub, tetapi disengaja. `dev-docs/commit-logs/2026-07-06.md:21-23`. |
| 4 | Riwayat job hilang saat restart | **Benar.** `job_queue.py:105`. Sekaligus melanggar NFR PRD — lihat bagian 2. |
| 5 | Belum ada rate limiting per IP | **Benar.** `slowapi` tidak ada di `requirements.txt` maupun `main.py`. |
| 6 | `pyodbc` masih dikomentari | **Benar.** `requirements.txt:34`. |

> **Catatan proses.** Poin 2 sempat disimpulkan "sudah beres" karena hanya kode Python yang diperiksa.
> Pemeriksaan `docker-compose.yml` membalik kesimpulan itu. Pelajarannya: nilai default yang efektif
> ditentukan oleh lapisan terluar yang menetapkannya, bukan oleh `os.getenv` di kode.

---

## 2. Konflik fondasi yang harus diselesaikan lebih dulu

Dua dokumen fondasi proyek ini saling bertentangan, dan konflik tersebut belum pernah diselesaikan.

**`planning/prd.md`, Persyaratan Non-Fungsional — Keandalan:**

> "Antrean pekerjaan harus persisten. Jika container backend mati atau restart, antrean pekerjaan harus
> pulih secara otomatis dari basis data SQLite lokal."

**`dev-docs/decisions/004-in-memory-job-queue.md`, status Accepted (2026-06-27):**

> "Job hilang saat backend restart (tidak persistent)" — dicantumkan sebagai trade-off yang diterima.

PRD adalah cetak biru yang menurut `ai-rules/planning-templates/README.md` berstatus "source of truth
untuk apa yang akan dibangun", sedangkan ADR mencatat keputusan teknis yang diambil saat implementasi.
Keduanya tidak boleh dibiarkan bertolak belakang.

**Resolusi:** PRD menang. Implementasi menyesuaikan cetak biru, dan ADR-004 di-supersede secara resmi
oleh **ADR-005 — Persistent Job Queue dengan SQLite**. ADR-004 tidak dihapus; statusnya diubah menjadi
`Superseded by ADR-005` agar jejak keputusan tetap utuh.

Tanpa langkah ini, kode akan benar tetapi dokumentasi arsitektur tetap salah, dan sesi berikutnya akan
membaca ADR-004 lalu menyimpulkan persistensi adalah kesalahan yang harus dikembalikan.

---

## 3. Persyaratan dan keterlacakan

### 3.1 Persyaratan fungsional yang terdampak

Penomoran mengikuti `planning/prd.md`.

| ID | Persyaratan | Status sebelum | Perubahan pada v2.2.0 |
|---|---|---|---|
| F02 | Live Database Connector — mendukung dialek utama termasuk SQL Server | **Tidak terpenuhi** untuk SQL Server; `pyodbc` dikomentari, driver ODBC tidak terpasang, tiga fungsi metadata tidak memiliki cabang `sqlserver` | Dipenuhi (11.4) |
| F05 | Job Tracking — pengguna melacak pekerjaan lewat kode akses `MSF-XXXXXXXXXX` | Terpenuhi sebagian; kode akses hilang bersama seluruh riwayat saat restart | Dipenuhi penuh (11.2) |
| F01, F03, F04 | Parser DDL, generasi AI, ekspor DOCX/PDF | Terpenuhi | Tidak berubah |

### 3.2 Persyaratan non-fungsional yang terdampak

| Kategori | Isi persyaratan | Status sebelum | Perubahan |
|---|---|---|---|
| Keandalan | Antrean pulih otomatis dari SQLite setelah restart | **Tidak terpenuhi** | Dipenuhi (11.2) |
| Keamanan kredensial | Password koneksi DB target disensor di log | Terpenuhi — `generate.py:181-186` menyensor password sebelum logging | Dipertahankan; ditambah pengerasan passcode admin (11.5) |
| Performa | Operasi DB dan LLM asinkron agar tidak memblokir HTTP | Terpenuhi | Tidak berubah |
| Kompatibilitas | Antarmuka Next.js responsif | Terpenuhi | Tidak berubah |

### 3.3 Persyaratan baru pada rilis ini

Persyaratan berikut belum ada di PRD dan diusulkan sebagai tambahan, berasal dari `TODO.md` dan dari
temuan pada bagian 9.

| ID baru | Persyaratan | Sumber |
|---|---|---|
| NFR-R1 | Riwayat pekerjaan bertahan minimal 30 hari dan dapat ditelusuri melalui kode akses meski berkas hasilnya sudah kedaluwarsa | Turunan D2 |
| NFR-S1 | Endpoint yang mahal dan endpoint autentikasi admin dibatasi per alamat IP | `TODO.md`, `ai-rules/security/part-e` |
| NFR-S2 | Tidak ada kredensial default yang berfungsi pada jalur deployment mana pun | `ai-rules/security/part-a`, temuan 9.11 |
| NFR-O1 | v2 dapat berjalan bersamaan dengan msf-app tanpa berbagi port, nama container, maupun volume | Kebutuhan pembandingan v1 dan v2 |

Ketiga persyaratan pertama diusulkan masuk ke `planning/prd.md` sebagai bagian dari sinkronisasi
dokumentasi (bagian 15). Perubahan PRD memerlukan persetujuan pengguna karena PRD adalah cetak biru,
bukan living document.

---

## 4. Bukan tujuan

Tidak dikerjakan pada rilis ini:

| Item | Alasan |
|---|---|
| MongoDB (`pymongo`) | `TODO.md` v2.1; MongoDB schemaless sehingga memerlukan strategi inferensi skema tersendiri |
| Dark mode, ERD mermaid, share link, webhook, image Ollama GPU | `TODO.md` v2.2 dan Nice to Have |
| Pembangunan ulang halaman Settings | Keputusan UX yang disengaja pada 2026-07-06 |
| Poin 1 `claude.md` | Sudah benar |
| Refactor `DiagramCanvas.tsx` dan `admin/page.tsx` yang melebihi batas ukuran berkas | Pelanggaran yang sudah ada sebelumnya; dilaporkan pada bagian 12, tidak dikerjakan agar batch tetap kecil sesuai AGENTS.md aturan 5 |
| Perbaikan `DocxExporter.export()` yang memblokir event loop | Dicatat sebagai risiko (bagian 20) dan technical debt baru |
| Perombakan pola pembacaan konfigurasi saat import | Temuan 9.8; di luar scope, tetapi desain tidak boleh memperburuknya |

Poin 2 `claude.md` **masuk scope** — lihat 9.11.

---

## 5. Arsitektur

### 5.1 Gambaran sistem

Tidak ada perubahan arsitektur besar. Sistem tetap fullstack dengan pemisahan yang ada:

```
Browser
   |
   |  HTTP (NEXT_PUBLIC_API_URL)
   v
Next.js 14 (frontend, port 3001)
   |
   |  REST /api/*
   v
FastAPI (backend, port 8001)
   |
   +-- routers/      lapisan HTTP, validasi, kode status
   +-- services/     logika domain (parser, connector, generator, exporter, provider AI)
   +-- background/   antrean job dan penyimpanannya
   +-- models/       skema Pydantic
   +-- utils/        logger, error
   |
   +--> Ollama / DeepSeek / OpenAI      (generasi dokumentasi)
   +--> Database target pengguna         (ekstraksi metadata)
   +--> /app/outputs                     (berkas DOCX/PDF + jobs.db)
```

Lapisan yang berlaku: `router → service → model`. Tidak ada lapisan repository sebelumnya karena tidak
ada penyimpanan persisten. `JobStore` menjadi komponen persistensi pertama dan ditempatkan di
`background/`, bukan di `services/`, karena ia melayani antrean job dan bukan logika domain.

### 5.2 Perubahan module map

`dev-docs/ai/MODULE_MAP.md` diperbarui dengan satu baris baru:

| Modul Fungsional | Backend | Frontend |
|---|---|---|
| Job Queue & Core | `background/job_queue.py` (ada) + **`background/job_store.py` (baru)** | `hooks/useGenerate.ts` |
| Rate Limiting | **`app/main.py` (limiter) + `utils/rate_limit.py` (baru)** | `lib/api.ts` (penanganan 429) |

`utils/rate_limit.py` dipisah dari `main.py` agar `main.py` tidak menambah tanggung jawab baru dan tetap
berperan sebagai komposisi aplikasi saja. Ini mengikuti aturan Separation of Concerns pada
`ai-rules/coding-standards/04-separation-of-concerns.md`.

### 5.3 Batas tanggung jawab komponen baru

| Komponen | Tanggung jawab | Ketergantungan | Tidak bertanggung jawab atas |
|---|---|---|---|
| `JobStore` | Membaca dan menulis baris job ke SQLite; rekonsiliasi; dua jenis pembersihan | `sqlite3` (stdlib) | Menjalankan job, mengelola berkas hasil, mengetahui HTTP |
| `Job` | Menyimpan state satu pekerjaan dan memberi tahu perubahan lewat callback | Tidak ada | Mengetahui SQLite |
| `JobQueue` | Menjalankan job, menegakkan siklus hidup, menjembatani `Job` dan `JobStore` | `Job`, `JobStore` | Mengetahui HTTP |
| `utils/rate_limit.py` | Menentukan kunci pembatas dan membentuk respons 429 | `slowapi` | Menentukan endpoint mana yang dibatasi |

Setiap komponen dapat diuji sendiri: `JobStore` diuji tanpa FastAPI, `Job` diuji tanpa SQLite.

---

## 6. Model domain dan skema data

### 6.1 Kesesuaian dengan `planning/database.md`

`planning/database.md` mendokumentasikan struktur kelas `Job` beserta 17 atributnya. Skema SQLite
memetakan seluruh atribut tersebut satu-lawan-satu, ditambah satu kolom turunan. Tidak ada atribut yang
dihilangkan, sehingga dokumen perencanaan tetap akurat setelah perubahan.

### 6.2 Skema tabel

```sql
PRAGMA user_version = 1;
PRAGMA journal_mode = WAL;

CREATE TABLE IF NOT EXISTS jobs (
    job_id           TEXT PRIMARY KEY,
    access_code      TEXT NOT NULL,
    project_name     TEXT NOT NULL,
    status           TEXT NOT NULL,
    progress         INTEGER NOT NULL DEFAULT 0,
    tables_total     INTEGER NOT NULL DEFAULT 0,
    tables_processed INTEGER NOT NULL DEFAULT 0,
    current_table    TEXT,
    created_at       TEXT NOT NULL,
    updated_at       TEXT NOT NULL,
    completed_at     TEXT,
    error_message    TEXT,
    preview_markdown TEXT,
    result_filepath  TEXT,
    result_filename  TEXT,
    output_format    TEXT NOT NULL DEFAULT 'docx',
    ai_provider      TEXT,
    db_engine        TEXT,
    file_purged      INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_jobs_access_code ON jobs(access_code);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at  ON jobs(created_at);
CREATE INDEX IF NOT EXISTS idx_jobs_status      ON jobs(status);
```

**Alasan tiap keputusan skema:**

| Keputusan | Alasan |
|---|---|
| `job_id` sebagai `TEXT PRIMARY KEY` | UUID v4, sesuai `job_queue.py:111` |
| Indeks pada `access_code` | Pencarian lewat kode akses adalah alur utama F05; tanpa indeks operasinya pemindaian penuh |
| Indeks pada `created_at` | Dipakai pengurutan admin dan kedua pembersihan |
| Indeks pada `status` | Dipakai rekonsiliasi dan penghitungan statistik |
| `file_purged` sebagai kolom baru | Membedakan "berkas dihapus karena kedaluwarsa" dari "job tidak pernah menghasilkan berkas"; tanpa ini kedua kondisi tampak sama dan pengguna menerima pesan yang salah |
| Tidak menyimpan `result_bytes` | Isi berkas tetap di disk; basis data hanya menyimpan metadata. `Job.update()` sudah memisahkan bytes sebelum callback dipanggil |
| `PRAGMA user_version` | Jalur migrasi skema di masa depan tanpa menambah Alembic |
| `journal_mode = WAL` | Pembacaan tidak memblokir penulisan; relevan saat admin membaca statistik sementara job berjalan |

Waktu disimpan sebagai `TEXT` ISO 8601 UTC, konsisten dengan `Job.created_at` yang sudah memakai
`datetime.now(timezone.utc).isoformat()`. Tidak ada konversi tipe sehingga tidak ada risiko pergeseran
zona waktu.

### 6.3 Perkiraan volume

Satu baris sekitar 1 KB, didominasi `preview_markdown` yang dipotong 2000 karakter pada
`generate.py:79`. Pada 50 job per hari selama 30 hari, tabel berada di kisaran 1,5 MB. Tidak ada tekanan
kapasitas.

---

## 7. Kontrak API

### 7.1 Permukaan API yang ada

Total permukaan API adalah 22 endpoint (rinciannya di C.3). Tidak ada yang ditambah maupun dihapus.
Tabel berikut memuat endpoint yang tersentuh rilis ini; 10 endpoint lain (`ai`, `shortcuts`, `database`,
`export`, `stats`) tidak berubah sama sekali.

| Metode | Path | Perubahan |
|---|---|---|
| POST | `/api/generate/parse-ddl` | Tidak berubah |
| POST | `/api/generate/from-ddl` | Ditambah rate limit; `error_code` pada 429 antrean penuh |
| POST | `/api/generate/from-db` | Ditambah rate limit; `error_code` pada 429 antrean penuh |
| GET | `/api/jobs/{job_id}` | Tidak berubah; kini dapat menemukan job lama dari basis data |
| GET | `/api/jobs/by-code/{access_code}` | Tidak berubah; kini dapat menemukan job lama dari basis data |
| POST | `/api/jobs/{job_id}/cancel` | Tidak berubah |
| GET | `/api/jobs/{job_id}/download` | Menambah kemungkinan 410 saat berkas kedaluwarsa |
| POST | `/api/admin/verify` | Ditambah rate limit |
| GET | `/api/admin/stats` | Sumber data berubah menjadi riwayat penuh (D3) |
| GET | `/api/admin/jobs` | Sumber data berubah menjadi riwayat penuh (D3) |
| GET | `/api/admin/logs` | Tidak berubah |
| POST | `/api/admin/cleanup` | Ikut menghapus baris di basis data |

### 7.2 Kompatibilitas skema respons

`JobStatusResponse` pada `schemas.py:232-244` dan `frontend/src/lib/types.ts:62-77` sudah selaras dan
**tidak berubah**. Tidak ada perubahan yang memutus kompatibilitas frontend.

Satu-satunya perubahan bentuk respons adalah penambahan `error_code` pada bodi 429 dan header
`Retry-After` — keduanya bersifat aditif dan aman bagi klien lama.

### 7.3 Taksonomi error

| Kondisi | Status | `error_code` | Header tambahan |
|---|---|---|---|
| Antrean job penuh | 429 | `JOB_QUEUE_FULL` | — |
| Rate limit per IP terlampaui | 429 | `RATE_LIMIT_EXCEEDED` | `Retry-After` |
| Berkas hasil sudah kedaluwarsa | 410 | `RESULT_EXPIRED` | — |
| Job belum selesai saat unduh | 400 | `HTTP_400` (tidak berubah) | — |
| Job tidak ditemukan | 404 | `HTTP_404` (tidak berubah) | — |

Status 410 adalah kondisi baru akibat D2: job berstatus `done` yang berkasnya sudah dihapus. Saat ini
`generate.py:306` menjawab 500 "File hasil tidak tersedia" untuk kondisi ini — menyesatkan, karena
tidak ada yang rusak.

Seluruh bodi error tetap memakai amplop standar `API_CONTRACT.md`: `detail`, `error_code`, `timestamp`.

---

## 8. Alur pengguna

### 8.1 Alur utama — melacak pekerjaan setelah restart

Alur ini adalah alasan utama rilis v2.2.0 dan sebelumnya tidak mungkin dilakukan.

```
Pengguna membuat dokumentasi
  -> menerima access_code MSF-XXXXXXXXXX, menyalinnya
  -> backend restart (deploy, crash, atau reboot server)
  -> pengguna memasukkan access_code di halaman utama
     |
     +-- job sudah selesai, berkas masih ada (< 60 menit)
     |     -> status done, tombol unduh aktif
     |
     +-- job sudah selesai, berkas kedaluwarsa (60 menit - 30 hari)
     |     -> status done, unduh menjawab 410 dengan pesan berkas kedaluwarsa
     |
     +-- job sedang berjalan saat backend mati
     |     -> status error, pesan "Pekerjaan terhenti karena server dimulai ulang."
     |
     +-- job lebih tua dari 30 hari
           -> 404 dengan pesan yang sudah ada: "tidak ditemukan atau sudah kedaluwarsa"
```

Cabang ketiga adalah yang paling penting. Tanpa rekonsiliasi (9.1), pengguna melihat progress bar yang
tidak akan pernah bergerak dan tidak ada indikasi bahwa pekerjaannya sudah mati.

### 8.2 Alur terdampak rate limiting

```
Pengguna menekan Generate berkali-kali
  |
  +-- 3 job sudah berjalan          -> 429 JOB_QUEUE_FULL       -> "Tunggu, antrean penuh"
  +-- lebih dari 10 request/menit   -> 429 RATE_LIMIT_EXCEEDED  -> "Terlalu sering, coba lagi dalam N detik"
```

Kedua pesan harus berbeda. Tanpa `error_code` pembeda (9.6), frontend pasti salah satu.

### 8.3 Alur admin

Tidak ada perubahan langkah. Yang berubah adalah cakupan angka: statistik kini melintasi 30 hari,
bukan 60 menit terakhir. Perubahan makna ini dicatat di `CHANGELOG.md` agar tidak dibaca sebagai anomali.

### 8.4 Urutan pemanggilan endpoint pada alur utama

Narasi versi penggunanya ada di B.2. Di bawah ini urutan teknisnya, dengan titik perubahan v2.2.0
diberi tanda `[v2.2]`.

```
Browser                                  Backend
   |                                        |
   |-- GET  /api/health --------------------> status API, Ollama, model bawaan
   |   (diulang tiap 12 detik di Dashboard)  |
   |                                        |
   |-- GET  /api/ai/models ----------------> daftar model untuk provider terpilih
   |                                        |
   |   -- hanya Jalur B --                  |
   |-- POST /api/database/test-connection --> uji koneksi, kembalikan schemas +
   |                                        |  tables_by_schema
   |                                        |
   |-- POST /api/generate/from-ddl ---------> [v2.2] gerbang rate limit per IP
   |    atau /api/generate/from-db          |  gerbang MAX_CONCURRENT_JOBS
   |                                        |    -> 429 JOB_QUEUE_FULL       [v2.2 error_code]
   |                                        |    -> 429 RATE_LIMIT_EXCEEDED  [v2.2 baru]
   |                                        |  validasi SQL / uji koneksi ulang -> 400
   |                                        |  create_job() [v2.2 tulis baris ke SQLite]
   |<-- 200 job_id, access_code, status ----|  BackgroundTasks.add_task(run_job)
   |                                        |
   |-- GET /api/jobs/{job_id} --------------> status terkini
   |   (diulang tiap 2 detik, maks 900 kali) |  [v2.2] bila tidak ada di memori, dicari di JobStore
   |                                        |
   |   -- pelacakan lewat kode akses --     |
   |-- GET /api/jobs/by-code/{code} --------> [v2.2] ikut mencari di JobStore
   |                                        |
   |   -- pembatalan --                     |
   |-- POST /api/jobs/{job_id}/cancel ------> status cancelled
   |                                        |
   |   -- setelah status done --            |
   |-- GET /api/jobs/{job_id}/download -----> berkas, atau
                                            |  410 RESULT_EXPIRED [v2.2, sebelumnya 500]
```

### 8.5 Invarian alur yang tidak boleh berubah

Rilis ini menyentuh persistensi dan penanganan error, bukan bentuk alurnya. Butir berikut adalah
kontrak yang wajib tetap berlaku setelah implementasi, dan masing-masing punya pasangan di kriteria
penerimaan bagian 18.

| # | Invarian | Alasan |
|---|---|---|
| 1 | Bentuk kode akses tetap `MSF-` + 10 heksadesimal huruf besar | Kode yang sudah tersimpan di `localStorage` pengguna harus tetap valid |
| 2 | Polling tetap `GET /api/jobs/{job_id}` tiap 2 detik dengan bentuk respons `JobStatusResponse` yang sama | Tidak ada perubahan yang memutus frontend (7.2) |
| 3 | `download_url` hanya terisi bila berkas benar-benar ada | Menjaga tombol unduh tidak pernah mengarah ke berkas yang sudah dihapus |
| 4 | Pemetaan progres 0-90-92-100 tidak berubah | Bar progres dan pengujian yang ada bergantung padanya |
| 5 | Status yang mungkin tetap lima: `queued`, `processing`, `done`, `error`, `cancelled` | Skema SQLite menyimpan status sebagai teks; nilai baru berarti perubahan kontrak |
| 6 | Gerbang `MAX_CONCURRENT_JOBS` tetap dihitung dari memori | Mencegah 9.1 kambuh lewat jalur lain (D3) |
| 7 | Kredensial database tetap tidak pernah disimpan dan tetap disensor di log | `jobs.db` hanya memuat metadata job; tidak satu pun kolomnya menampung kredensial (6.2) |

---

## 9. Temuan terverifikasi

Seluruh temuan di bawah diverifikasi langsung ke berkas dan baris yang disebut.

### 9.1 Job yatim akan mengunci total fitur generate — blocker

`generate.py:116` dan `generate.py:189` menghitung gerbang konkurensi dari `job_queue.list_jobs()`
dengan status `queued`/`processing`, dibatasi `MAX_CONCURRENT_JOBS` (default 3).

Saat ini aman karena dict selalu kosong setelah restart. Begitu SQLite dipasang tanpa penanganan khusus,
job yang mati di tengah proses dipulihkan sebagai `processing` selamanya. Setelah tiga job seperti itu
menumpuk, setiap request generate dijawab 429 secara permanen, dan satu-satunya pemulihan adalah
`/api/admin/cleanup` yang memerlukan passcode.

Rekonsiliasi adalah syarat kebenaran, bukan penyempurnaan, dan wajib selesai di dalam `lifespan`
sebelum `yield`.

### 9.2 Retensi 60 menit membatalkan tujuan persistensi — blocker

`job_queue.py:195-213` menghapus job selesai yang lebih tua dari 60 menit; `main.py:81` menjalankannya
tiap 15 menit. Bila baris SQLite mengikuti aturan yang sama, riwayat tetap hilang pada restart setelah
satu jam, dan NFR Keandalan tetap tidak terpenuhi.

Satu angka retensi dipakai untuk dua umur yang berbeda sifatnya: berkas dibatasi ruang disk (puluhan MB
per job), baris riwayat hanya sekitar 1 KB.

### 9.3 `MAX_JOB_RETENTION_MINUTES` adalah config mati

Dideklarasikan di `.env.example:77` dan diteruskan ke container lewat `docker-compose.yml:53`, tetapi
tidak pernah dibaca kode mana pun; `job_queue.py:217` menetapkan `max_retention_minutes=60` secara
hardcoded. Operator yang mengubahnya akan diabaikan tanpa peringatan.

### 9.4 Model threading ternyata tunggal

Tidak ditemukan `to_thread`, `run_in_executor`, maupun `threading` di `doc_generator.py`,
`services/exporters/`, dan `job_queue.py`. Seluruh enam titik `job.update()` berjalan pada event loop
yang sama, dan container dijalankan dengan `--workers 1`.

`JobStore` tidak memerlukan connection pool. Meski begitu tetap dibuat aman-thread karena biayanya
nyaris nol dan asumsi ini pecah bila `DocxExporter.export()` kelak dibungkus `to_thread`.

### 9.5 Frontend tidak memiliki penanganan 429

`api.ts:218-227` menangani 400, 401, 403, 404, 422, 500, dan 502-504. Status 429 tidak ada dan jatuh ke
fallback pada `api.ts:234`. Bodi default slowapi memakai key `error`, bukan `detail`, sehingga
`err.message` kosong dan pengguna hanya melihat "Terjadi kesalahan tidak terduga."

Memasang slowapi tanpa memperbaiki kedua sisi akan menurunkan kualitas UX.

### 9.6 Akan ada dua jenis 429 dengan arti berlawanan

Lihat 8.2. Dibedakan lewat `error_code`; field `errorCode` sudah tersedia di `api.ts:24`.

### 9.7 Test suite tidak memiliki isolasi untuk singleton

`conftest.py` hanya menyediakan `event_loop`, `client`, dan `async_client`. Tidak ada fixture yang
mereset `job_queue`. Dengan SQLite, default path `/app/outputs/jobs.db` tidak valid di Windows sehingga
seluruh suite gagal.

### 9.8 Fixture admin lolos karena kebetulan urutan import

`admin.py:15` membaca `ADMIN_PASSCODE` saat modul di-import. Komentar pada `tests/test_admin.py:14`
menyatakan env dibaca dinamis — keliru. Test lolos karena fixture autouse kebetulan berjalan sebelum
`client` mengimpor `app.main`. Inisialisasi limiter tidak boleh menambah ketergantungan urutan import baru.

### 9.9 Tabrakan sumber daya Docker lebih luas daripada port

- `container_name` pada baris 37, 82, 98, 120 dikunci: `msf-backend`, `msf-frontend`, `msf-postgres`, `msf-cloudflared`. Docker menolak container kedua bernama sama, sehingga v2 gagal start.
- Nama volume pada baris 130-136 dikunci: `msf_ollama_data`, `msf_postgres_data`, `msf_backend_outputs`. Bila dipaksakan, `jobs.db` v2 bercampur dengan berkas msf-app.

Catatan positif: `backend_outputs` adalah named volume, bukan bind mount, sehingga kepemilikan direktori
oleh `appuser` dari Dockerfile terbawa dan SQLite dapat menulis tanpa masalah izin.

### 9.10 Config drift pada `.env.example`

Delapan variabel dibutuhkan tetapi tidak terdokumentasi: `ADMIN_PASSCODE`, `JOB_TIMEOUT_SECONDS`,
`LOG_FILE_PATH`, `SHORTCUTS_DIR`, `TEMPLATES_DIR`, `DEEPSEEK_TIMEOUT`, `OPENAI_TIMEOUT`, dan
`CLOUDFLARE_TUNNEL_TOKEN`.

`CLOUDFLARE_TUNNEL_TOKEN` adalah yang paling serius karena berupa **rahasia** dan dipakai langsung di
`docker-compose.yml:120` tanpa nilai default. Operator baru tidak akan tahu variabel ini dibutuhkan, dan
layanan `cloudflared` gagal dengan pesan yang tidak menjelaskan penyebabnya (lihat D-2).

Delapan variabel terdokumentasi tetapi tidak pernah dibaca: `SECRET_KEY`, `MAX_OUTPUT_SIZE_MB`,
`DEFAULT_OUTPUT_FORMAT`, `LOG_LEVEL`, `LOG_FORMAT`, `OLLAMA_DEFAULT_MODEL`, `TEST_POSTGRES_URL`,
`MAX_JOB_RETENTION_MINUTES`.

`.gitignore:39` mengabaikan `.env`, sehingga perubahan yang hanya ditulis di `.env` tidak masuk git.

### 9.11 `admin123` aktif melalui docker-compose — celah keamanan

`admin.py:15` memakai `os.getenv("ADMIN_PASSCODE", "")` dan menonaktifkan fitur admin bila kosong.
Perlindungan itu tidak pernah tercapai karena `docker-compose.yml:52` menetapkan
`ADMIN_PASSCODE=${ADMIN_PASSCODE:-admin123}`. Pada deployment Docker, Admin Portal terlindungi
`admin123` bila operator tidak mengisi `.env`.

Dampaknya nyata: Admin Portal membuka `/api/admin/logs` (isi log server), `/api/admin/jobs` (seluruh
riwayat), dan `/api/admin/cleanup` (menghapus semua riwayat).

`SECRET_KEY` pada baris 59 memiliki pola serupa tetapi tidak berdampak karena tidak ada kode yang
membacanya. Nilainya tetap dihapus agar tidak menyesatkan.

### 9.12 Beberapa variabel di-hardcode di compose sehingga `.env` tidak berpengaruh

`docker-compose.yml:43` menetapkan `OLLAMA_BASE_URL` dan baris 60 menetapkan `CORS_ORIGINS` sebagai
nilai literal, bukan `${VAR:-default}`. Keduanya tidak dapat diubah lewat `.env`. Ini langsung
memengaruhi rencana pemetaan port: mengubahnya di `.env` saja akan gagal secara diam-diam.

### 9.13 Dugaan yang gugur

Sempat diduga `access_code` terbuang dari `/api/jobs/{id}` karena Pydantic v2 mengabaikan field ekstra.
Ternyata tidak: `schemas.py:243-244` sudah memuatnya dan `types.ts:62-77` cocok persis. Field
`ai_provider` dan `db_engine` memang tidak masuk `JobStatusResponse`, tetapi hanya dipakai admin melalui
`list_jobs()` mentah — benar dan disengaja.

> **Catatan.** Empat temuan berikut (9.14 sampai 9.17) baru muncul ketika alur kerja aplikasi dipetakan
> langkah demi langkah untuk bagian B. Tidak satu pun berada dalam cakupan v2.2.0; seluruhnya
> dilaporkan beserta usulan, sesuai AGENTS.md aturan 13.

### 9.14 Batas 50 tabel ditegakkan di dua titik yang berbeda

`generate.py:130-135` memeriksa batas `MAX_TABLES_PER_REQUEST` **sebelum** job dibuat pada Jalur A,
sehingga pengguna langsung menerima 400. Pada Jalur B pemeriksaan yang setara berada di
`generate.py:232-237`, yaitu di dalam fungsi yang sudah berjalan sebagai background task — job terlanjur
dibuat, kode akses terlanjur diberikan dan disalin pengguna, lalu pekerjaan berakhir `error`.

Aturannya sama, pengalamannya berbeda jauh. Dampaknya bukan cuma kosmetik: job yang gagal seperti ini
tetap menghabiskan satu slot dari tiga slot konkurensi selama berjalan, dan meninggalkan entri gagal di
riwayat pengguna.

**Dilaporkan, tidak dikerjakan pada rilis ini.** Perbaikannya berada di `routers/generate.py` yang sudah
melebihi batas ukuran berkas (12.1), dan paling tepat dikerjakan bersamaan dengan usulan refactor
`_run_from_db` ke `services/generation_service.py`.

### 9.15 `estimated_seconds` pada Jalur B selalu 60 detik

`generate.py:161` menghitung `len(tables) * 15` untuk Jalur A, tetapi `generate.py:253` memakai angka
tetap `60` untuk Jalur B tanpa memandang jumlah tabel. Jumlah tabel memang belum diketahui saat respons
dikirim — metadata baru ditarik di dalam background task — sehingga ini keterbatasan urutan, bukan
kecerobohan. Meski begitu, database berisi 40 tabel yang membutuhkan sekitar 10 menit tetap dijanjikan
selesai dalam 60 detik.

**Dilaporkan, tidak dikerjakan pada rilis ini.** Perbaikan yang jujur adalah mengosongkan
`estimated_seconds` pada Jalur B dan mengisinya setelah metadata tersedia, yang berarti menyentuh
`JobStatusResponse` — perubahan kontrak yang bertentangan dengan 7.2 pada rilis ini.

### 9.16 Berkas hasil menjadi yatim setelah restart dan tidak pernah dibersihkan

`job_queue.py:195-213` hanya menghapus berkas milik job yang masih ada di dictionary memori. Setelah
backend restart, dictionary itu kosong, sementara berkas `msf_doc_<job_id>.docx` tetap berada di volume
`backend_outputs`. Tidak ada satu pun kode yang memindai direktori keluaran, sehingga berkas tersebut
tidak akan pernah dihapus oleh siapa pun.

Setiap restart menambah tumpukan baru. Pada pemakaian normal ukurannya kecil, tetapi dokumen DOCX skema
besar dapat mencapai puluhan MB dan tumpukannya tidak punya batas atas.

**Sebagian teratasi oleh rilis ini, sisanya dilaporkan.** Setelah 11.2, job selamat dari restart
sehingga berkas baru tidak lagi menjadi yatim. Berkas yatim yang **sudah** menumpuk sebelum v2.2.0 tidak
tersentuh, karena `purge_expired_files()` bekerja dari baris basis data dan baris untuk job lama itu
tidak pernah ada. Cara membersihkannya secara manual dimasukkan ke
`backend/docs/operations/job-database-backup.md` (bagian 14).

### 9.17 Antarmuka menawarkan engine yang belum berfungsi

`DbConnector.tsx:34-40` menampilkan lima pilihan engine, termasuk MongoDB. Pada
`db_connector.py:68`, engine yang tidak dikenal jatuh ke `raise ValueError`, ditangkap sebagai kegagalan
umum, dan pengguna menerima pesan "Error: Engine tidak didukung: mongodb" setelah mengisi seluruh form
koneksi. `DBEngine` di `schemas.py:31-36` juga sudah memuat `MONGODB`.

SQL Server berada pada kondisi yang sama sebelum rilis ini dan diselesaikan oleh 11.4. MongoDB tetap di
luar cakupan (bagian 4), sehingga pilihan yang menyesatkan itu masih akan ada setelah v2.2.0.

**Dilaporkan, tidak dikerjakan pada rilis ini.** Perbaikan termurah adalah menandai pilihan MongoDB
sebagai belum tersedia dan menonaktifkannya di antarmuka — satu berkas frontend, tanpa perubahan
backend. Diusulkan menjadi batch tersendiri agar tidak menambah cakupan rilis ini.

---

## 10. Keputusan desain

| Kode | Keputusan | Alasan |
|---|---|---|
| D1 | Copy penuh dulu sebagai baseline, commit terpisah, baru perbaiki | Diff perbaikan terpisah bersih dari diff penyalinan |
| D2 | Retensi berkas 60 menit, retensi baris riwayat 30 hari | Menyelesaikan 9.2 tanpa mengorbankan ruang disk |
| D3 | `list_jobs()` tetap dari memori; admin memakai `JobStore.query()` | Menjaga gerbang konkurensi cepat dan mencegah 9.1 kambuh |
| D4 | Rapikan seluruh config drift `.env.example` | Berkas ini harus disentuh; `ADMIN_PASSCODE` dan `SECRET_KEY` berdampak nyata |
| D5 | Isolasi v2 mencakup port, `container_name`, dan nama volume | Port saja tidak cukup (9.9) |
| D6 | Hapus fallback `admin123` dan pakai `compare_digest` | Celah keamanan aktif pada jalur deployment sebenarnya (9.11) |
| D7 | Terbitkan ADR-005 yang men-supersede ADR-004 | Menyelesaikan konflik fondasi bagian 2 secara formal |
| D8 | `JobStore` ditempatkan di `background/`, bukan `services/` | Melayani antrean job, bukan logika domain (5.1) |
| D9 | Logika rate limit dipisah ke `utils/rate_limit.py` | Menjaga `main.py` tetap sebagai komposisi aplikasi (5.2) |

---

## 11. Rancangan per komponen

### 11.0 Langkah 0 — Baseline

Salin `backend/`, `frontend/`, `dev-docs/`, dan `planning/` dari `msf-app/` ke `v2/msf-db/` apa adanya,
tanpa `node_modules/`, `__pycache__/`, `.next/`, `.pytest_cache/`, dan `outputs/`. Commit tersendiri.
`msf-app/` tidak disentuh.

### 11.1 Isolasi sumber daya v2

Pada `.env` dan `.env.example`:

```
BACKEND_PORT=8001
FRONTEND_PORT=3001
POSTGRES_PORT=5433
OLLAMA_BASE_URL=http://host.docker.internal:11435
CORS_ORIGINS=http://localhost:3001,http://127.0.0.1:3001
NEXT_PUBLIC_API_URL=http://localhost:8001
```

Pada `docker-compose.yml`:

- `container_name` menjadi `msf2-backend`, `msf2-frontend`, `msf2-postgres`, `msf2-cloudflared` (9.9).
- Nama volume menjadi `msf2_ollama_data`, `msf2_postgres_data`, `msf2_backend_outputs` (9.9).
- Baris 43 dan 60 diubah menjadi `${OLLAMA_BASE_URL:-...}` dan `${CORS_ORIGINS:-...}` agar `.env` benar-benar berpengaruh (9.12).
- Baris 52 menjadi `ADMIN_PASSCODE=${ADMIN_PASSCODE:-}`; baris 59 kehilangan fallback `SECRET_KEY` (9.11).

### 11.2 Persistensi job dengan SQLite

Berkas baru `backend/app/background/job_store.py`; skema pada bagian 6.2. Path dari `JOBS_DB_PATH`,
default `/app/outputs/jobs.db`.

**Perubahan pada `job_queue.py`:**

- `Job.__init__` menerima `on_change: Optional[Callable[["Job"], None]]`, dipanggil di akhir `update()`.
- `JobQueue.__init__` membuka `JobStore`, menjalankan rekonsiliasi, lalu merehidrasi memori.
- `create_job()` memasang callback dan menyimpan baris awal.
- `delete_job()` dan kedua pembersihan ikut menyentuh basis data.

**Invarian:** hanya job yang berada di memori yang boleh dimutasi. Job yang dihidrasi dari `JobStore`
adalah snapshot baca-saja. Aman karena hanya job `queued`/`processing` yang dimutasi, dan job seperti itu
selalu ada di memori setelah rehidrasi.

**Isi memori:** job aktif ditambah job selesai yang berkasnya belum dihapus. `get_job()` dan
`get_job_by_access_code()` mencoba memori lebih dulu lalu jatuh ke `JobStore`. `list_jobs()` tetap murni
dari memori (D3).

**Rekonsiliasi job yatim**, dijalankan sebelum `yield`:

```sql
UPDATE jobs
   SET status = 'error',
       error_message = 'Pekerjaan terhenti karena server dimulai ulang.',
       completed_at = :now,
       updated_at = :now
 WHERE status IN ('queued', 'processing');
```

**Dua pembersihan terpisah**, dipanggil dari loop yang sudah ada di `main.py:78-86`:

1. `purge_expired_files()` — job selesai lebih tua dari `MAX_JOB_RETENTION_MINUTES` (default 60): hapus berkas, set `result_filepath = NULL` dan `file_purged = 1`. Baris tetap ada.
2. `purge_expired_records()` — hapus baris lebih tua dari `JOB_RECORD_RETENTION_DAYS` (default 30).

`MAX_JOB_RETENTION_MINUTES` dihidupkan sebagai sumber angka pertama (9.3).

### 11.3 Rate limiting

`slowapi` ditambahkan ke `requirements.txt`. Logika kunci dan pembentukan respons berada di
`backend/app/utils/rate_limit.py` (D9); `main.py` hanya mendaftarkan limiter dan handler.

Endpoint yang dibatasi: `POST /api/generate/from-ddl`, `POST /api/generate/from-db`,
`POST /api/admin/verify`.

```
RATE_LIMIT_ENABLED=true
RATE_LIMIT_GENERATE=10/minute
RATE_LIMIT_ADMIN_VERIFY=5/minute
RATE_LIMIT_TRUST_FORWARDED_FOR=false
```

**Penanganan IP di belakang proxy.** `get_remote_address` membaca `request.client.host`. Di produksi
terdapat proxy sehingga seluruh pengguna terlihat sebagai satu IP dan saling menjatuhkan limit. Karena
itu `key_func` membaca `X-Forwarded-For` hanya bila `RATE_LIMIT_TRUST_FORWARDED_FOR=true`. Default
sengaja `false`: header ini dapat dipalsukan klien, dan memercayainya tanpa proxy tepercaya justru
membuat limit dapat dilewati sepenuhnya.

**Handler 429 kustom** mengembalikan amplop standar (7.3) beserta `Retry-After`.

**Sisi frontend:** `api.ts` menerima cabang 429 yang membedakan `RATE_LIMIT_EXCEEDED` dari
`JOB_QUEUE_FULL`. Sejalan dengan itu, 429 dari `MAX_CONCURRENT_JOBS` diberi `error_code: JOB_QUEUE_FULL`.

### 11.4 Dukungan SQL Server

1. `requirements.txt:34` — aktifkan `pyodbc==5.2.0`.
2. `backend/Dockerfile` — tambahkan `unixodbc-dev`, `gnupg`, repositori Microsoft, dan `msodbcsql18` dengan `ACCEPT_EULA=Y`. Saat ini Dockerfile tidak memasang komponen ODBC sama sekali.
3. `db_connector.py:66` — `ODBC Driver 17` menjadi 18 melalui `MSSQL_ODBC_DRIVER`, ditambah `TrustServerCertificate` dari `MSSQL_TRUST_SERVER_CERTIFICATE`. Driver 18 mewajibkan enkripsi secara default dan menolak server tanpa sertifikat tepercaya.
4. `db_connector.py:449` `_get_version_query()` — cabang `sqlserver` mengembalikan `SELECT @@VERSION`.
5. `db_connector.py:154` `_filter_system_schemas()` — daftar skema sistem SQL Server: `sys`, `INFORMATION_SCHEMA`, `guest`, `db_owner`, `db_accessadmin`, `db_securityadmin`, `db_ddladmin`, `db_backupoperator`, `db_datareader`, `db_datawriter`, `db_denydatareader`, `db_denydatawriter`.
6. `db_connector.py:116` — default `active_schema` menjadi `dbo` untuk `sqlserver`.

`pymongo` tetap dikomentari.

### 11.5 Pengerasan passcode admin

1. `docker-compose.yml:52` menjadi `ADMIN_PASSCODE=${ADMIN_PASSCODE:-}` sehingga pemeriksaan pada `admin.py:20-24` berlaku.
2. `admin.py:32` memakai `secrets.compare_digest` menggantikan `!=`, menutup kebocoran waktu. Relevan karena `/api/admin/verify` menjadi endpoint ber-rate-limit.
3. `ADMIN_PASSCODE` didokumentasikan di `.env.example` dengan keterangan bahwa Admin Portal nonaktif selama kosong.

### 11.6 Konfigurasi

Variabel baru: `JOBS_DB_PATH`, `JOB_RECORD_RETENTION_DAYS`, `RATE_LIMIT_ENABLED`, `RATE_LIMIT_GENERATE`,
`RATE_LIMIT_ADMIN_VERIFY`, `RATE_LIMIT_TRUST_FORWARDED_FOR`, `MSSQL_ODBC_DRIVER`,
`MSSQL_TRUST_SERVER_CERTIFICATE`.

Sesuai D4, `.env.example` juga mendokumentasikan tujuh variabel yang hilang, menandai delapan variabel
mati, dan menghidupkan `MAX_JOB_RETENTION_MINUTES` (9.10). Sesuai AGENTS.md aturan 3, setiap key baru di
`.env` wajib punya placeholder di `.env.example` pada batch yang sama.

---

## 12. Kepatuhan coding standards

Batas dari `ai-rules/coding-standards/01-file-size-limits.md`: Service maks 800, Model maks 300,
Route maks 200, View split di atas 500.

### 12.1 Berkas yang disentuh rilis ini

| Berkas | Baris sekarang | Perkiraan sesudah | Batas | Status |
|---|---|---|---|---|
| `background/job_queue.py` | 217 | sekitar 300 | — (tidak dikategorikan) | Aman |
| `background/job_store.py` | 0 (baru) | sekitar 220 | 800 (service) | Aman |
| `utils/rate_limit.py` | 0 (baru) | sekitar 60 | — | Aman |
| `services/db_connector.py` | 481 | sekitar 520 | 800 | Aman |
| `routers/generate.py` | 328 | sekitar 335 | 200 (route) | **Sudah melebihi sebelumnya** |
| `routers/admin.py` | 156 | sekitar 160 | 200 | Aman |
| `app/main.py` | 257 | sekitar 275 | — | Aman |
| `lib/api.ts` | 235 | sekitar 245 | — | Aman |

`routers/generate.py` sudah 328 baris terhadap batas route 200 sebelum rilis ini. Penambahan dekorator
rate limit menambah sekitar 7 baris. Sesuai AGENTS.md aturan 13, pelanggaran yang sudah ada dilaporkan
beserta usulan, bukan diperbaiki diam-diam di batch yang sama.

**Usulan refactor (tidak dikerjakan pada rilis ini):** pindahkan `_run_generate_job` dan `_run_from_db`
dari `routers/generate.py` ke `services/generation_service.py`. Keduanya adalah logika domain yang
kebetulan tinggal di lapisan route, sehingga sekaligus melanggar Separation of Concerns. Perkiraan
setelah dipindah: route sekitar 180 baris, kembali di bawah batas.

### 12.2 Pelanggaran yang sudah ada di luar scope

| Berkas | Baris | Batas | Catatan |
|---|---|---|---|
| `components/diagram/DiagramCanvas.tsx` | 871 | 500 (view) | Terkait TD-001 dan TD-002 yang sudah tercatat |
| `app/admin/page.tsx` | 645 | 500 (view) | Tumbuh pada redesign 2026-07-06 |
| `app/diagram/templates.ts` | 528 | 500 | Berkas data, dampak rendah |

Ketiganya tidak disentuh rilis ini dan diusulkan masuk `TECHNICAL_DEBT.md` sebagai TD-005 sampai TD-007.

---

## 13. Kepatuhan security standard

`ai-rules/security/README.md` bersifat wajib. Bagian yang relevan dengan rilis ini:

| Part | Fokus | Penerapan pada rilis ini |
|---|---|---|
| A | Credential management | `ADMIN_PASSCODE` tidak lagi punya default berfungsi (11.5); seluruh variabel baru masuk `.env` dengan placeholder di `.env.example`; tidak ada kredensial di berkas `.md` dalam folder kode |
| D | Input validation | Tidak ada endpoint baru; validasi Pydantic yang ada tidak berubah |
| E | Code security — rate limiting, CORS | Rate limiting dipasang (11.3); `CORS_ORIGINS` menjadi benar-benar dapat dikonfigurasi (9.12) |
| I | Pre-merge checklist | Dijalankan sebelum merge `dev` ke `main`; hasilnya dilampirkan di task report |
| K | Data protection, retention | Kebijakan retensi dua tingkat (D2) adalah keputusan retensi data yang eksplisit dan terdokumentasi, bukan implisit |
| L | Backup dan disaster recovery | `jobs.db` adalah aset persisten pertama proyek ini; prosedur backup wajib dibuat — lihat bagian 14 |
| M | Container dan deployment security | Container tetap berjalan sebagai `appuser` non-root; tidak ada port baru yang diekspos; penambahan repositori Microsoft di Dockerfile memakai verifikasi kunci GPG |

**Catatan Part B (HTTP security headers).** Standar mewajibkan CSP, HSTS, dan X-Frame-Options
disiapkan proaktif. Backend saat ini **tidak memasang satu pun** header tersebut. Ini pelanggaran nyata
terhadap standar wajib, tetapi berada di luar scope rilis ini dan tidak bersinggungan dengan berkas yang
disentuh. Dilaporkan di sini, diusulkan masuk `KNOWN_ISSUES.md`, dan disarankan menjadi batch tersendiri.

---

## 14. Dokumentasi operations

AGENTS.md aturan 11 mewajibkan dokumentasi operations untuk fitur yang membutuhkan setup server.
Rilis ini memicu tiga di antaranya, dan ketiganya **belum pernah ada** — `backend/docs/` bahkan belum
terbentuk.

| Berkas | Pemicu | Isi wajib |
|---|---|---|
| `backend/docs/operations/job-database-backup.md` | `jobs.db` adalah aset persisten pertama | Cara backup volume `msf2_backend_outputs`, frekuensi, cara restore, cara verifikasi hasil restore |
| `backend/docs/operations/scheduler-cleanup.md` | Dua pembersihan terjadwal (11.2) | Apa yang dibersihkan, kapan, cara mengubah retensi lewat env, cara memverifikasi berjalan, cara menghentikan sementara |
| `backend/docs/operations/rate-limiting.md` | Rate limiting per IP (11.3) | Cara menyetel limit, kapan `RATE_LIMIT_TRUST_FORWARDED_FOR` boleh dinyalakan dan bahayanya bila salah, cara mematikan saat insiden |

Lokasi `backend/docs/operations/` adalah pengecualian resmi dalam AGENTS.md aturan 11 — satu-satunya
dokumentasi output yang boleh berada di dalam folder kode, karena harus ikut ter-deploy bersamanya.
Template diambil dari `ai-rules/operations/_templates/`.

Berkas ini masuk branch `main` bersama kode, sehingga aturan 14 berlaku: dilarang memuat kredensial
aktual, hanya boleh merujuk `.env`.

---

## 15. Sinkronisasi dokumentasi wajib

AGENTS.md aturan 7 mewajibkan sinkronisasi `planning/*` dan `dev-docs/*` di setiap akhir batch.

### 15.1 Dokumen yang wajib dibuat atau diperbarui

| Berkas | Aksi | Alasan |
|---|---|---|
| `dev-docs/decisions/005-persistent-job-queue-sqlite.md` | **Buat** | Menyelesaikan konflik bagian 2 (D7) |
| `dev-docs/decisions/004-in-memory-job-queue.md` | Ubah status menjadi `Superseded by ADR-005` | Jejak keputusan tetap utuh |
| `dev-docs/ai/VERSION.md` | Perbarui | v2.1.0 menjadi v2.2.0; target berikutnya diisi ulang |
| `dev-docs/ai/MODULE_MAP.md` | Perbarui | `job_store.py` dan `rate_limit.py` (5.2) |
| `dev-docs/ai/CURRENT_STATE.md` | Perbarui | Keadaan setelah rilis |
| `dev-docs/ai/TECHNICAL_DEBT.md` | Perbarui | Tambah TD-005 sampai TD-007 (12.2) dan debt event loop exporter |
| `dev-docs/ai/KNOWN_ISSUES.md` | Perbarui | Tambah absennya HTTP security headers (bagian 13), absennya batas sumber daya container (D-1), dan keempat temuan alur 9.14 sampai 9.17 |
| `dev-docs/ai/TASKS.md` | Perbarui | Tandai selesai |
| `dev-docs/ai/FINAL_SYSTEM_HANDOVER.md` | Perbarui | Wajib setelah push ke `dev` |
| `dev-docs/architecture/database.md` | Perbarui | Sebelumnya tidak ada penyimpanan persisten |
| `dev-docs/architecture/backend-structure.md` | Perbarui | Komponen `background/job_store.py` |
| `dev-docs/CHANGELOG.md` | Perbarui | Entri v2.2.0, termasuk perubahan makna statistik admin (8.3) |
| `dev-docs/commit-logs/2026-07-31.md` | **Buat** | Wajib setiap commit |
| `planning/database.md` | Perbarui | Bagian 1 masih menyatakan penyimpanan in-memory |
| `planning/prd.md` | **Usulkan** perubahan | Tambah NFR-R1, NFR-S1, NFR-S2, NFR-O1 (3.3) — butuh persetujuan pengguna |
| `planning/modules.md` | **Buat** | Ditandai wajib oleh template, belum ada |
| `planning/timeline.md` | **Buat** | Ditandai wajib oleh template, belum ada |
| `claude.md` | Perbarui | Judul menyesatkan; koreksi status keenam poin |
| `TODO.md` | Perbarui | Tandai selesai item terkait |
| `reports/task/2026-07-31-msf-db-v2.md` | **Buat** | Wajib setiap push ke `dev` |
| `backend/README.md`, `frontend/README.md` | **Usulkan** perubahan | Aturan 8 — usulkan, jangan ubah tanpa persetujuan |

### 15.2 Catatan lokasi

Spesifikasi ini berada di `docs/superpowers/specs/` pada root repositori, di luar struktur folder yang
diatur AGENTS.md. Isinya perlu didistilasi ke `v2/msf-db/planning/` dan `v2/msf-db/dev-docs/` sesuai
tabel di atas. Sebagai alternatif, spesifikasi dapat dipindahkan ke `v2/msf-db/planning/` agar seluruh
artefak perencanaan berada di satu tempat. **Keputusan ini diserahkan ke pengguna.**

### 15.3 Catatan gaya

AGENTS.md aturan 12 melarang emoji dan ikon di kode maupun dokumentasi, kecuali tanda centang dan silang
untuk checklist. Seluruh dokumentasi keluaran rilis ini mengikuti aturan tersebut.

---

## 16. Rencana batch dan commit

AGENTS.md aturan 5 mewajibkan batch kecil: satu perubahan kecil, satu commit. Urutan disusun agar setiap
commit meninggalkan repositori dalam keadaan konsisten.

| # | Commit | Isi | Bergantung pada |
|---|---|---|---|
| 1 | `chore: salin baseline msf-app ke v2/msf-db` | Langkah 11.0 | — |
| 2 | `chore: isolasi sumber daya v2 (port, container, volume)` | 11.1 | 1 |
| 3 | `fix: hapus passcode admin default dan pakai compare_digest` | 11.5 | 1 |
| 4 | `test: tambah isolasi job_queue di conftest` | 9.7 | 1 |
| 5 | `feat: tambah JobStore SQLite dan rekonsiliasi job yatim` | 11.2 bagian penyimpanan dan rekonsiliasi | 4 |
| 6 | `feat: pisahkan retensi berkas dan retensi riwayat job` | 11.2 bagian pembersihan, 9.3 | 5 |
| 7 | `feat: tambah rate limiting per IP` | 11.3 backend | 1 |
| 8 | `feat: bedakan penanganan 429 di frontend` | 11.3 frontend | 7 |
| 9 | `feat: aktifkan dukungan SQL Server` | 11.4 | 1 |
| 10 | `docs: sinkronisasi planning, dev-docs, ADR-005, operations` | 14, 15 | 1-9 |

Commit 3, 7, dan 9 tidak saling bergantung sehingga urutannya dapat ditukar bila salah satu tersendat.
Commit 4 sengaja mendahului 5: tanpa isolasi test, commit 5 akan membuat seluruh suite gagal.

Tidak ada `git push`. Seluruh push dilakukan manusia (AGENTS.md bagian Critical).

---

## 17. Strategi pengujian

**Prasyarat** — `conftest.py` mendapat fixture autouse yang mengarahkan `JOBS_DB_PATH` ke `tmp_path` dan
membangun ulang singleton `job_queue` per test (9.7).

| Berkas | Yang diuji |
|---|---|
| `tests/test_job_store.py` (baru) | Simpan, baca, hapus; rehidrasi setelah restart; rekonsiliasi mengubah `queued`/`processing` menjadi `error`; `purge_expired_files` menghapus berkas tetapi mempertahankan baris dan menyetel `file_purged`; `purge_expired_records` menghapus baris |
| `tests/test_job_queue.py` (diperluas) | Callback `on_change` mempersist; `get_job` jatuh ke store saat memori kosong; snapshot dari store baca-saja |
| `tests/test_rate_limit.py` (baru) | Bentuk 429 memakai amplop standar; `error_code` benar; `Retry-After` ada; `RATE_LIMIT_ENABLED=false` mematikan pembatasan; `X-Forwarded-For` diabaikan saat flag `false` |
| `tests/test_db_connector_sqlserver.py` (baru) | `build_connection_url` menghasilkan Driver 18 dan `TrustServerCertificate`; `_filter_system_schemas` membuang skema sistem; `_get_version_query` mengembalikan `SELECT @@VERSION`; default schema `dbo` |
| `tests/test_admin.py` (disesuaikan) | Statistik bersumber dari `JobStore.query()`; koreksi komentar keliru pada baris 14; `ADMIN_PASSCODE` kosong menghasilkan 403; `compare_digest` menolak passcode salah |
| `tests/test_download_expired.py` (baru) | Job `done` dengan `file_purged = 1` menjawab 410 `RESULT_EXPIRED`, bukan 500 |

**Batasan yang diakui terbuka.** Koneksi SQL Server sungguhan tidak dapat diuji tanpa server dan driver
ODBC terpasang; cakupan terbatas pada pembentukan URL dan penyaringan skema. Frontend tidak memiliki
infrastruktur pengujian sama sekali — tidak ada jest, vitest, maupun playwright di `package.json` —
sehingga perubahan penanganan 429 diverifikasi manual. Kedua batasan dilaporkan apa adanya.

---

## 18. Kriteria penerimaan

Rilis dianggap selesai bila seluruh butir berikut terbukti, bukan diasumsikan.

**Persistensi (NFR Keandalan, F05)**

- [ ] Job dibuat, backend di-restart, job masih ditemukan lewat `access_code`
- [ ] Job yang sedang `processing` saat restart berubah menjadi `error` dengan pesan restart, bukan menggantung
- [ ] Setelah restart dengan tiga job yatim, request generate baru tetap diterima (bukan 429 permanen)
- [ ] Berkas hasil terhapus setelah `MAX_JOB_RETENTION_MINUTES`, tetapi baris riwayat tetap ada
- [ ] Unduh pada job yang berkasnya kedaluwarsa menjawab 410 `RESULT_EXPIRED`
- [ ] `MAX_JOB_RETENTION_MINUTES` diubah di `.env` benar-benar mengubah perilaku

**Rate limiting (NFR-S1)**

- [ ] Melebihi `RATE_LIMIT_GENERATE` menghasilkan 429 dengan `error_code` `RATE_LIMIT_EXCEEDED` dan header `Retry-After`
- [ ] Antrean penuh menghasilkan 429 dengan `error_code` `JOB_QUEUE_FULL`
- [ ] Frontend menampilkan dua pesan yang berbeda untuk kedua kondisi
- [ ] `RATE_LIMIT_ENABLED=false` mematikan pembatasan sepenuhnya

**Keamanan (NFR-S2)**

- [ ] `docker compose up` tanpa `ADMIN_PASSCODE` di `.env` membuat seluruh endpoint admin menjawab 403
- [ ] Tidak ada nilai `admin123` tersisa di berkas mana pun

**SQL Server (F02)**

- [ ] Image backend berhasil di-build dengan `msodbcsql18`
- [ ] `build_connection_url` menghasilkan string Driver 18 yang benar
- [ ] Skema sistem SQL Server tidak muncul di daftar pilihan

**Isolasi (NFR-O1)**

- [ ] v2 dan msf-app berjalan bersamaan; keduanya sehat di endpoint `/health` masing-masing
- [ ] `docker volume ls` menunjukkan dua set volume terpisah

**Sumber daya (D.4, D-4)**

- [ ] `docker stats` dijalankan saat sistem diam dan saat satu pekerjaan berjalan; hasilnya dicatat menggantikan perkiraan di D.4
- [ ] Konsumsi diukur saat v2 dan msf-app berjalan bersamaan, untuk mengetahui beban gabungan sebenarnya
- [ ] `jobs.db` diperiksa ukurannya setelah sejumlah pekerjaan, untuk memvalidasi perkiraan 1 KB per baris

**Regresi**

- [ ] Seluruh test yang sudah ada tetap lulus
- [ ] Alur generate dari DDL dan dari DB berjalan penuh sampai unduh berhasil
- [ ] Keempat fitur pengguna (Dashboard, Generator, Diagram, Shortcuts) tetap berfungsi

---

## 19. Rencana rollback

AGENTS.md bagian 6 melarang migrasi basis data tanpa rencana rollback.

| Skenario | Cara mundur | Dampak data |
|---|---|---|
| SQLite bermasalah setelah deploy | `git revert` commit 5 dan 6; hapus `jobs.db` dari volume | Riwayat job hilang, kembali ke perilaku v2.1.0. Tidak ada data pengguna lain yang terpengaruh karena `jobs.db` hanya memuat metadata job |
| Rate limiting terlalu ketat | Setel `RATE_LIMIT_ENABLED=false` lalu restart | Tidak ada |
| Build gagal karena driver ODBC | `git revert` commit 9; komentari kembali `pyodbc` | SQL Server tidak tersedia, engine lain tidak terpengaruh |
| Isolasi v2 salah konfigurasi | `git revert` commit 2 | v2 kembali bentrok dengan msf-app; tidak ada kehilangan data |

Karena `jobs.db` dibuat baru dan tidak ada migrasi dari data lama, rollback tidak memerlukan konversi
skema. Menghapus berkasnya cukup, dan sistem akan membuatnya kembali kosong.

Skema versi 1 tercatat di `PRAGMA user_version`, sehingga perubahan skema di masa depan dapat mendeteksi
dan menolak basis data yang lebih baru daripada kode.

---

## 20. Risiko

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Pemasangan driver ODBC memperbesar image dan dapat gagal pada arsitektur ARM | Build gagal | Uji build lebih dulu; bila gagal, `pyodbc` dikembalikan dikomentari dan dilaporkan terus terang |
| Fungsi metadata SQL Server (view, function, index) mungkin memuat SQL khusus engine yang belum ditelusuri | SQL Server terhubung tetapi metadata tidak lengkap | Ditelusuri saat implementasi; bila besar, dipisah dari rilis ini dan dilaporkan |
| Statistik admin berubah makna karena melintasi 30 hari | Angka berbeda dari sebelumnya | Disengaja per D3; dicatat di `CHANGELOG.md` |
| Rate limit terlalu ketat mengganggu pemakaian wajar | Pengguna terhalang | Seluruh angka dapat diubah lewat env; `RATE_LIMIT_ENABLED=false` sebagai jalan keluar cepat |
| `DocxExporter.export()` memblokir event loop | Bila kelak dibungkus `to_thread`, asumsi 9.4 pecah | `JobStore` dibuat aman-thread sejak awal; dicatat sebagai technical debt baru |
| Berkas `.env` tidak masuk git sehingga konfigurasi v2 hilang saat clone | Sesi berikutnya tidak tahu port v2 | `.env.example` wajib ikut diubah (D4) |
| Volume named diwarisi dari image; bila operator terlanjur membuat volume `msf2_backend_outputs` secara manual dengan pemilik root, SQLite gagal menulis | Backend gagal start | Didokumentasikan di `backend/docs/operations/job-database-backup.md` beserta cara memperbaiki kepemilikan |
| Menjalankan v2 berdampingan dengan msf-app menggandakan konsumsi RAM, sementara tidak ada satu pun batas sumber daya terpasang (D-1) | Host kehabisan memori; kedua sistem mati bersamaan | Pengukuran `docker stats` masuk kriteria penerimaan (bagian 18); bila hasilnya mengkhawatirkan, jalankan bergantian dan dahulukan batch pemasangan batas sumber daya |

---

## 21. Verifikasi akhir

AGENTS.md bagian 8 mewajibkan format keluaran akhir. Setelah implementasi, laporan wajib memuat:

1. **Summary** — 1 sampai 5 poin
2. **Files changed** — daftar lengkap
3. **Verify commands** — perintah yang harus dijalankan pengguna
4. **Merge steps** — bila sudah layak `dev` ke `main`, termasuk pengecualian folder artefak

Perintah verifikasi minimum:

```bash
cd v2/msf-db/backend && python -m pytest -v
```

```bash
cd v2/msf-db/frontend && npm run lint && npm run build
```

```bash
cd v2/msf-db && docker compose config
```

Bila salah satu gagal, tidak boleh merge. Kegagalan dilaporkan apa adanya beserta keluarannya, tidak
diklaim lulus.
