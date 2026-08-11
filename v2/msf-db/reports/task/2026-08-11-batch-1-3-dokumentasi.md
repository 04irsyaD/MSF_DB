# Laporan Task — Batch 1-3 Dokumentasi Berbasis Komentar Database

> **Tanggal:** 2026-08-11
> **Branch:** `dev`
> **Rujukan:** `planning/spec-template-dokumentasi-tsd.md`, `planning/plan-template-dokumentasi-tsd-batch-1-3.md`
> **Status commit:** perubahan disiapkan AI, **eksekusi commit oleh human developer** (`CURRENT_STATE.md` §1b)

---

## 1. Summary

1. Keluhan awal "struktur dokumen acak dan isinya mengarang" ditelusuri ke tiga sebab konkret: keluaran AI ditempel tanpa penyaringan sehingga heading liar merusak hierarki Word, komentar database tidak pernah dibaca sehingga AI menebak hal yang jawabannya sudah tersedia, dan sampling AI tanpa `seed` sehingga hasil tidak dapat direproduksi.
2. Kontrak keluaran AI diubah dari prosa bebas per tabel menjadi satu baris `nama_kolom | deskripsi` per kolom. Parser membuang setiap nama kolom yang tidak ada di metadata asli, sehingga penyaringan halusinasi bersifat deterministik dan tidak bergantung pada kepatuhan model.
3. `DocumentModel` diperkenalkan sebagai bentuk data antara, dengan renderer Markdown sebagai konsumen pertamanya. `doc_generator.py` menyusut dari 375 menjadi 248 baris.
4. Dua temuan keamanan muncul selama pengerjaan dan langsung ditutup: endpoint pelacakan job tanpa rate limit, dan `key_style` slowapi bawaan yang membuat rate limit apa pun pada endpoint ber-path-variabel menjadi tidak berfungsi.
5. Test backend naik dari 90 menjadi 195, seluruhnya lulus.

## 2. Files changed

### Berkas baru

| Berkas | Isi |
| --- | --- |
| `backend/app/services/doc_model.py` | `DocumentModel`, `TableDoc`, `ColumnDoc`, pelacakan asal deskripsi |
| `backend/app/services/ai_column_parser.py` | Sanitasi teks dan parser penyaring halusinasi |
| `backend/app/services/renderers/__init__.py` | Paket renderer |
| `backend/app/services/renderers/markdown_renderer.py` | `DocumentModel` menjadi Markdown |
| `backend/tests/test_doc_generator.py` | Jaring pengaman perilaku generator |
| `backend/tests/test_db_comments.py` | Komentar database dipakai sebagai sumber deskripsi |
| `backend/tests/test_ai_determinism.py` | Seed dan temperature |
| `backend/tests/test_generate_settings.py` | `project_description` diteruskan |
| `backend/tests/test_tanpa_emoji.py` | Penjaga larangan emoji, memindai seluruh `app/` |
| `backend/tests/test_doc_model.py` | Model dokumen |
| `backend/tests/test_ai_column_parser.py` | Parser dan sanitasi |
| `backend/tests/test_doc_model_builder.py` | Rantai pengisian deskripsi |
| `backend/tests/test_markdown_renderer.py` | Renderer |
| `backend/tests/test_structure_template.py` | Enum dan kompatibilitas |
| `reports/task/2026-08-11-batch-1-3-dokumentasi.md` | Laporan ini |

### Berkas diubah

| Berkas | Perubahan |
| --- | --- |
| `backend/app/services/db_connector.py` | Mengisi `column_comment` dan `table_comment` lewat inspector |
| `backend/app/services/doc_generator.py` | `build_document_model`, rantai pengisian, prompt per kolom; delapan builder lama dihapus |
| `backend/app/services/ai_provider.py` | `ai_seed()` dan `ai_temperature()` |
| `backend/app/services/ollama_provider.py` | `bangun_payload()` dengan seed |
| `backend/app/services/cloud_provider.py` | Seed dan temperature untuk DeepSeek dan OpenAI |
| `backend/app/services/exporters/docx_exporter.py` | Emoji pada komentar dihapus |
| `backend/app/models/schemas.py` | Enum `StructureTemplate`, field `structure_template` |
| `backend/app/routers/generate.py` | Meneruskan `project_description` dan `structure_template`; rate limit `by-code` |
| `backend/app/utils/rate_limit.py` | `job_lookup_limit()`, `key_style="endpoint"` |
| `backend/tests/test_rate_limit.py` | Dua test endpoint `by-code` |
| `.env.example` | `AI_SEED`, `AI_TEMPERATURE`, `RATE_LIMIT_JOB_LOOKUP` |
| `dev-docs/CHANGELOG.md`, `ai/CURRENT_STATE.md`, `ai/MODULE_MAP.md`, `ai/TASKS.md` | Sinkronisasi |

## 3. Verify commands

Dijalankan dari `v2/msf-db/backend` memakai venv lokal:

```bash
./.venv/Scripts/python.exe -m pytest -q
```

```bash
./.venv/Scripts/python.exe -m ruff check app tests
```

Hasil: **195 passed**. Ruff bersih pada seluruh berkas baru dan berkas `app/` yang disentuh.

**Catatan lingkungan penting.** Container `msf2-backend` **tidak** mem-bind-mount kode aplikasi; `docker-compose.yml` hanya memasang `templates`, `shortcuts_data`, dan volume outputs. Perubahan ini tidak akan terlihat di container sampai image di-rebuild. Baseline container melaporkan 89 passed dengan 1 error akibat image yang lebih tua, sedangkan venv lokal melaporkan 90 passed sebelum pekerjaan ini dimulai.

## 4. Temuan selama pengerjaan

### 4.1 Rate limit yang tidak berfungsi

Setelah `RATE_LIMIT_JOB_LOOKUP` dipasang, test tetap gagal: permintaan keempat dan kelima lolos. Sebabnya `key_style` bawaan slowapi bernilai `"url"`, yang menamai bucket limit dari path permintaan. Karena kode akses berada di dalam path, setiap tebakan menempati bucket berbeda dan limit tidak pernah menggigit — persis serangan yang hendak dicegah yang justru lolos.

Diperbaiki dengan `key_style="endpoint"`. Endpoint lain memakai path tetap sehingga perilakunya tidak berubah. Diberi komentar permanen di kode dan dicatat di `CURRENT_STATE.md` §1a agar tidak dikembalikan ke bawaan.

Pelajaran: test yang memakai lima kode akses berbeda yang membongkarnya. Test yang lebih longgar akan lolos dan memberi rasa aman palsu.

### 4.2 Perubahan asumsi keamanan

`CURRENT_STATE.md` §1a sebelumnya menyatakan `jobs.db` tidak memuat data sensitif. Sejak komentar database dipakai, isinya mengalir ke `preview_markdown` yang tersimpan di `jobs.db` dan dikembalikan dua endpoint tanpa autentikasi. Pernyataan itu sudah diperbarui.

### 4.3 Emoji di berkas di luar rencana

Rencana hanya menyebut `doc_generator.py`. Pemindaian menemukan satu emoji juga di komentar `docx_exporter.py`. Keduanya dibersihkan dalam commit yang sama karena berasal dari aturan dan jenis pekerjaan yang identik.

## 5. Penyimpangan dari rencana, beserta alasannya

| Penyimpangan | Alasan |
| --- | --- |
| `ai_seed()` dan `ai_temperature()` ditempatkan di `ai_provider.py`, bukan `ollama_provider.py` | Menaruhnya di provider lokal memaksa `cloud_provider` bergantung padanya, arah ketergantungan yang menyesatkan |
| `ColumnDoc` membawa `nullable`, `is_primary_key`, `is_foreign_key` | Rencana meniadakan kolom Nullable dan penanda PK/FK. Spec §3.6 mewajibkan `standard` mempertahankan perilaku lama, dan menghilangkannya mengurangi informasi yang selama ini terlihat pengguna |
| Renderer memakai tanda panah Unicode, bukan `->` | Mempertahankan keluaran lama persis |
| Deteksi emoji memakai rentang sebenarnya, bukan ambang `> 0x2100` | Ambang kasar akan ikut menandai tanda panah dan titik tengah yang merupakan tanda baca tipografis, bukan ikon |
| Dua test yang menurut rencana perlu disesuaikan pada Task 11 ternyata lulus tanpa diubah | Keluaran renderer terbukti setara dengan jalur lama |
| Pembersihan emoji dikerjakan sebelum renderer, bukan paling akhir | Task 10 memindahkan fungsi yang sama; membersihkan lebih dulu menghindari menyentuh kode itu dua kali |
| Label Nullable bahasa Inggris diperbaiki | Jalur lama selalu menulis "Ya" untuk kolom nullable bahkan dalam bahasa Inggris, akibat rangkaian ternary yang keliru. Renderer adalah kode baru, sehingga bug itu tidak dibawa serta |

## 6. Belum layak merge ke `main`

Belum. Yang tersisa:

1. **T-016 masih terbuka**: smoke test UI alur generate belum dijalankan.
2. **Verifikasi container**: image backend perlu di-rebuild agar perubahan ini benar-benar diuji di lingkungan yang menyerupai produksi.
3. **Security Pre-Merge Checklist** (`ai-rules/security/part-i-security-pre-merge-checklist.md`) belum dijalankan.
4. **Frontend belum menyesuaikan** `structure_template`. Tidak mendesak karena field ini punya bawaan, tetapi perlu sebelum Batch 4.

## 7. Usulan perubahan README

AGENTS.md §1 poin 8 mewajibkan AI **mengusulkan**, bukan menerapkan. Usulan untuk `backend/README.md`: tambahkan tiga variabel lingkungan baru (`AI_SEED`, `AI_TEMPERATURE`, `RATE_LIMIT_JOB_LOOKUP`) dan satu paragraf yang menjelaskan bahwa deskripsi kolom bersumber dari komentar database lebih dulu, baru AI, lalu metadata. Menunggu keputusan pengguna.

## 8. Utang yang sengaja ditinggalkan

| Butir | Rujukan |
| --- | --- |
| Tujuh pelanggaran lint baseline di berkas yang disentuh, seluruhnya sudah ada sebelumnya | T-021, TD-010 |
| Payload `from-ddl` dicatat utuh ke log termasuk `sql_content` | T-022, spec §9.7 |
| `MAX_TABLES_PER_REQUEST` tetap 50 di repo | spec §9.6 — menaikkannya melemahkan kontrol antrean pada endpoint publik tanpa auth |
| Views dan Functions masih dibuang | Tidak diperlukan bentuk TSD |
| `MSF_API_KEY` masih kosong, seluruh endpoint anonim | spec §9.9 — di luar cakupan |
