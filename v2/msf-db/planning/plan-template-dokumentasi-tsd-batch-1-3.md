# Rencana Implementasi — Dokumentasi Berbasis Template TSD (Batch 1-3)

> **Untuk pekerja agentik:** REQUIRED SUB-SKILL: gunakan superpowers:subagent-driven-development
> (disarankan) atau superpowers:executing-plans untuk mengerjakan rencana ini task demi task.
> Langkah memakai sintaks checkbox (`- [ ]`) untuk pelacakan.

**Goal:** Mengubah generator dokumentasi dari prosa bebas per tabel menjadi deskripsi per kolom yang
berlandaskan komentar database, dengan parser yang menyaring halusinasi.

**Architecture:** Metadata dan keluaran AI disatukan menjadi `DocumentModel`, sebuah model data
murni. Renderer Markdown membaca model itu. Keluaran AI diparsing baris demi baris dan setiap nama
kolom dicocokkan dengan metadata asli; yang tidak cocok dibuang sebelum masuk dokumen.

**Tech Stack:** Python 3.11, FastAPI, Pydantic v2, SQLAlchemy 2.0, pytest, structlog, ruff.

**Sumber:** `planning/spec-template-dokumentasi-tsd.md`

## Global Constraints

Setiap task tunduk pada seluruh butir ini tanpa perlu diulang di masing-masing task.

- Bekerja **hanya** di branch `dev`. Dilarang commit maupun push ke `main` (AGENTS.md §1 poin 1-2).
- **AI tidak menjalankan `git commit` maupun `git push`.** AI menyiapkan perubahan dan teks pesan
  commit; eksekusi dilakukan human developer (`dev-docs/ai/CURRENT_STATE.md` §1b).
- Satu task menghasilkan satu commit (AGENTS.md §1 poin 5).
- Dilarang emoji di kode maupun dokumentasi. Hanya `✅` dan `❌` yang boleh, dan hanya untuk
  checklist di dokumentasi (AGENTS.md §1 poin 12).
- Batas ukuran berkas: Service maksimal 800 baris dengan rekomendasi 400; Helper maksimal 400 dengan
  rekomendasi 200; berkas test maksimal 800 (`ai-rules/coding-standards/01-file-size-limits.md`).
- Berkas di `ai-rules/` adalah IMMUTABLE. Hanya dibaca.
- Seluruh nilai konfigurasi baru masuk `.env` dan wajib punya pasangan placeholder di `.env.example`
  pada batch yang sama (AGENTS.md §1 poin 3).
- `ruff` wajib lulus pada setiap berkas yang disentuh.
- Seluruh 90 test yang sudah ada wajib tetap hijau.
- Bahasa komentar dan nama test mengikuti berkas sekitarnya: Bahasa Indonesia.

**Perintah verifikasi baku** (dijalankan dari `v2/msf-db/backend`):

```bash
python -m pytest -q
```

```bash
python -m ruff check app tests
```

## Prasyarat sebelum Task 1

Working tree harus bersih. Saat rencana ini ditulis masih ada pekerjaan security-headers yang belum
di-commit. AGENTS.md §2 mensyaratkan working tree bersih sebelum task baru dimulai. **Human developer
menyelesaikan ini lebih dulu.**

## Peta berkas

| Berkas | Tanggung jawab | Task |
| --- | --- | --- |
| `backend/tests/test_doc_generator.py` | Jaring pengaman perilaku generator | 1 |
| `backend/app/services/db_connector.py` | Mengambil komentar tabel dan kolom | 2 |
| `backend/app/services/doc_generator.py` | Orkestrasi metadata dan AI menjadi model | 2, 3, 6, 8 |
| `backend/app/services/ollama_provider.py` | Opsi `seed` dan `temperature` | 3 |
| `backend/app/services/cloud_provider.py` | Opsi `seed` | 3 |
| `backend/app/routers/generate.py` | Meneruskan setting, rate limit endpoint by-code | 4, 5, 10 |
| `backend/app/utils/rate_limit.py` | Limit baru untuk pelacakan job | 5 |
| `backend/app/services/doc_model.py` | Definisi `DocumentModel`, `TableDoc`, `ColumnDoc` | 7 |
| `backend/app/services/ai_column_parser.py` | Sanitasi dan parsing keluaran AI | 6 |
| `backend/app/services/renderers/markdown_renderer.py` | `DocumentModel` menjadi Markdown | 9 |
| `backend/app/models/schemas.py` | Enum `StructureTemplate` | 10 |

## Catatan urutan yang menyimpang dari spec

Spec menempatkan pembersihan emoji sebagai Batch 5, yaitu paling akhir. Rencana ini memindahkannya
ke **Task 6**, sebelum pembuatan renderer.

Alasannya: Task 9 memindahkan `_build_columns_table` ke berkas renderer. Membersihkan emoji setelah
fungsi itu berpindah berarti menyentuh kode yang sama dua kali. Membersihkannya lebih dulu membuat
pemindahan berangkat dari kode yang sudah bersih, dan tetap menjadi commit tersendiri sesuai
AGENTS.md §3B.

## Cakupan rencana ini

Rencana ini mencakup **Batch 1 sampai 3** pada spec. Batch 4 (template TSD dengan `docxtpl`) tidak
termasuk karena bergantung pada izin penambahan dependensi yang belum diberikan (AGENTS.md §6, spec
§13 asumsi 2). Batch 4 mendapat rencana tersendiri setelah izin itu keluar.

Batch 1-3 berdiri sendiri: setelah Task 11 selesai, dokumentasi yang dihasilkan sudah lebih akurat
dan dapat direproduksi, tanpa memerlukan Batch 4.

---

## Task 1: Jaring pengaman untuk DocGenerator

`DocGenerator` adalah satu-satunya service inti tanpa test. Test ini ditulis terhadap keluaran
`generate_from_tables`, bukan terhadap method privat, supaya tetap berlaku setelah Task 9
memindahkan builder ke renderer.

**Files:**
- Create: `backend/tests/test_doc_generator.py`

**Interfaces:**
- Consumes: `DocGenerator(provider, model, language, detail_level, business_context)` dan
  `await DocGenerator.generate_from_tables(tables, project_name, job=None) -> str` sebagaimana ada
  sekarang.
- Produces: `ProviderPalsu` dan `tabel_contoh()` dipakai ulang oleh test pada Task 2, 3, 8, dan 9.

- [ ] **Step 1: Tulis test yang gagal**

Buat `backend/tests/test_doc_generator.py`:

```python
"""Perilaku DocGenerator dikunci di sini sebelum strukturnya diubah."""

import pytest

from app.models.schemas import (
    ColumnMetadata,
    ForeignKeyMetadata,
    IndexMetadata,
    TableMetadata,
)
from app.services.doc_generator import DocGenerator


class ProviderPalsu:
    """Provider AI tiruan. Mencatat prompt terakhir agar isinya bisa diperiksa."""

    def __init__(self, balasan="Tabel ini menyimpan transaksi pembayaran."):
        self.balasan = balasan
        self.prompt_terakhir = None
        self.jumlah_panggilan = 0

    async def generate(self, prompt, model):
        self.prompt_terakhir = prompt
        self.jumlah_panggilan += 1
        if isinstance(self.balasan, Exception):
            raise self.balasan
        return self.balasan


def tabel_contoh(nama="trx_pembayaran"):
    return TableMetadata(
        name=nama,
        schema="public",
        columns=[
            ColumnMetadata(
                name="id", data_type="bigint", is_nullable=False, is_primary_key=True
            ),
            ColumnMetadata(
                name="nasabah_id",
                data_type="bigint",
                is_nullable=False,
                is_foreign_key=True,
            ),
            ColumnMetadata(name="jumlah", data_type="numeric", is_nullable=False),
        ],
        primary_key=["id"],
        foreign_keys=[
            ForeignKeyMetadata(
                column="nasabah_id",
                references_table="mst_nasabah",
                references_column="id",
                on_delete="RESTRICT",
            )
        ],
        indexes=[
            IndexMetadata(name="idx_trx_nasabah", columns=["nasabah_id"], is_unique=False)
        ],
        row_count=1500,
    )


def generator(detail_level="detailed", provider=None):
    return DocGenerator(
        provider=provider or ProviderPalsu(),
        model="model-uji",
        language="Indonesian",
        detail_level=detail_level,
    )


@pytest.mark.asyncio
async def test_dokumen_memuat_judul_dan_jumlah_tabel():
    hasil = await generator().generate_from_tables([tabel_contoh()], "Proyek Uji")

    assert "# Proyek Uji" in hasil
    assert "**Total Tabel:** 1" in hasil


@pytest.mark.asyncio
async def test_setiap_kolom_muncul_di_tabel_markdown():
    hasil = await generator().generate_from_tables([tabel_contoh()], "Proyek Uji")

    for nama_kolom in ("id", "nasabah_id", "jumlah"):
        assert f"`{nama_kolom}`" in hasil


@pytest.mark.asyncio
async def test_relasi_foreign_key_menyebut_tabel_tujuan():
    hasil = await generator().generate_from_tables([tabel_contoh()], "Proyek Uji")

    assert "`mst_nasabah.id`" in hasil
    assert "ON DELETE RESTRICT" in hasil


@pytest.mark.asyncio
async def test_index_hanya_muncul_pada_mode_comprehensive():
    tanpa_index = await generator("detailed").generate_from_tables(
        [tabel_contoh()], "Proyek Uji"
    )
    dengan_index = await generator("comprehensive").generate_from_tables(
        [tabel_contoh()], "Proyek Uji"
    )

    assert "idx_trx_nasabah" not in tanpa_index
    assert "idx_trx_nasabah" in dengan_index


@pytest.mark.asyncio
async def test_ringkasan_relasi_butuh_lebih_dari_satu_tabel():
    satu = await generator("detailed").generate_from_tables(
        [tabel_contoh()], "Proyek Uji"
    )
    dua = await generator("detailed").generate_from_tables(
        [tabel_contoh("trx_pembayaran"), tabel_contoh("trx_pinjaman")], "Proyek Uji"
    )

    assert "Ringkasan Relasi Antar Tabel" not in satu
    assert "Ringkasan Relasi Antar Tabel" in dua


@pytest.mark.asyncio
async def test_dokumen_kosong_saat_tidak_ada_tabel():
    hasil = await generator().generate_from_tables([], "Proyek Uji")

    assert "Tidak ada tabel yang ditemukan" in hasil


@pytest.mark.asyncio
async def test_kegagalan_ai_tidak_membatalkan_dokumen():
    """Satu tabel gagal tidak boleh menjatuhkan seluruh job."""
    rusak = ProviderPalsu(balasan=RuntimeError("model mati"))

    hasil = await generator(provider=rusak).generate_from_tables(
        [tabel_contoh()], "Proyek Uji"
    )

    assert "trx_pembayaran" in hasil
    assert "`jumlah`" in hasil


@pytest.mark.asyncio
async def test_prompt_memuat_nama_dan_kolom_tabel():
    provider = ProviderPalsu()

    await generator(provider=provider).generate_from_tables(
        [tabel_contoh()], "Proyek Uji"
    )

    assert "trx_pembayaran" in provider.prompt_terakhir
    assert "nasabah_id" in provider.prompt_terakhir
```

- [ ] **Step 2: Jalankan test untuk memastikan hasilnya sesuai harapan**

Jalankan: `python -m pytest tests/test_doc_generator.py -v`

Harapan: seluruh test LULUS. Task ini mengunci perilaku yang sudah ada, bukan menambah perilaku
baru, sehingga kegagalan di sini berarti asumsi tentang kode saat ini keliru dan harus diselidiki
sebelum lanjut.

- [ ] **Step 3: Jalankan seluruh test dan linter**

Jalankan: `python -m pytest -q`
Harapan: 90 test lama plus 8 test baru, seluruhnya lulus.

Jalankan: `python -m ruff check app tests`
Harapan: tanpa pelanggaran pada berkas baru.

- [ ] **Step 4: Perbarui dokumentasi**

Di `dev-docs/ai/CURRENT_STATE.md` bagian 1, ubah jumlah test backend dari 90 menjadi 98 dan
tambahkan `test_doc_generator.py` ke daftar berkas test.

- [ ] **Step 5: Siapkan commit**

Perubahan disiapkan, **eksekusi oleh human developer**:

```bash
git add v2/msf-db/backend/tests/test_doc_generator.py v2/msf-db/dev-docs/ai/CURRENT_STATE.md
```

Pesan commit:

```
test: kunci perilaku DocGenerator sebelum refactor

DocGenerator satu-satunya service inti tanpa test. Delapan test
ditulis terhadap keluaran generate_from_tables, bukan method privat,
agar tetap berlaku setelah builder dipindah ke renderer.
```

---

## Task 2: Ambil komentar tabel dan kolom dari database

Sumber fakta terbaik untuk deskripsi kolom adalah komentar yang ditulis DBA di dalam database.
SQLAlchemy sudah menyediakannya lewat inspector; tidak diperlukan SQL mentah.

**Files:**
- Modify: `backend/app/services/db_connector.py:296-305` dan `:408-416`
- Modify: `backend/app/services/doc_generator.py:270-293` dan `:182-246`
- Create: `backend/tests/test_db_comments.py`

**Interfaces:**
- Consumes: `ColumnMetadata.column_comment` dan `TableMetadata.table_comment` yang sudah
  dideklarasikan di `schemas.py:130` dan `schemas.py:156`.
- Produces: kedua field itu kini terisi, dipakai Task 9 sebagai jalur pertama rantai pengisian.

**Catatan tentang umur kode task ini:** perubahan pada `db_connector.py` bersifat permanen, tetapi
perubahan tampilan di `doc_generator.py` kelak digantikan renderer pada Task 11. Itu disengaja, dan
bukan pekerjaan terbuang: task ini menghasilkan perbaikan yang langsung terlihat setelah commit-nya,
dan seluruh test di `test_db_comments.py` tetap lulus setelah Task 11 karena renderer menampilkan
komentar yang sama. Bila salah satu test itu gagal setelah Task 11, berarti renderer kehilangan
perilaku yang seharusnya dipertahankan.

- [ ] **Step 1: Tulis test yang gagal**

Buat `backend/tests/test_db_comments.py`:

```python
"""Komentar database adalah fakta dari DBA, bukan tebakan AI."""

import pytest

from app.models.schemas import ColumnMetadata, TableMetadata
from app.services.doc_generator import DocGenerator


class ProviderDiam:
    async def generate(self, prompt, model):
        return "Deskripsi dari AI."


def tabel_berkomentar():
    return TableMetadata(
        name="mst_nasabah",
        schema="public",
        table_comment="Data induk nasabah aktif.",
        columns=[
            ColumnMetadata(
                name="id",
                data_type="bigint",
                is_nullable=False,
                is_primary_key=True,
                column_comment="Nomor identitas internal nasabah.",
            ),
            ColumnMetadata(name="nama", data_type="varchar", is_nullable=False),
        ],
        primary_key=["id"],
    )


def generator():
    return DocGenerator(
        provider=ProviderDiam(),
        model="model-uji",
        language="Indonesian",
        detail_level="detailed",
    )


@pytest.mark.asyncio
async def test_komentar_kolom_muncul_di_tabel_markdown():
    hasil = await generator().generate_from_tables([tabel_berkomentar()], "Proyek Uji")

    assert "Nomor identitas internal nasabah." in hasil


@pytest.mark.asyncio
async def test_komentar_tabel_muncul_sebagai_catatan_skema():
    hasil = await generator().generate_from_tables([tabel_berkomentar()], "Proyek Uji")

    assert "Data induk nasabah aktif." in hasil


@pytest.mark.asyncio
async def test_komentar_ikut_masuk_prompt_sebagai_konteks():
    """Komentar yang sudah ada mencegah AI menebak ulang hal yang sudah diketahui."""

    class ProviderPerekam:
        def __init__(self):
            self.prompt = None

        async def generate(self, prompt, model):
            self.prompt = prompt
            return "Deskripsi."

    provider = ProviderPerekam()
    gen = DocGenerator(
        provider=provider,
        model="model-uji",
        language="Indonesian",
        detail_level="detailed",
    )

    await gen.generate_from_tables([tabel_berkomentar()], "Proyek Uji")

    assert "Data induk nasabah aktif." in provider.prompt


def test_tabel_tanpa_komentar_tetap_valid():
    tabel = TableMetadata(name="t_kosong", schema="public")

    assert tabel.table_comment is None
```

- [ ] **Step 2: Jalankan test untuk memastikan gagal**

Jalankan: `python -m pytest tests/test_db_comments.py -v`

Harapan: tiga test pertama GAGAL karena komentar belum pernah dibaca maupun ditampilkan.

- [ ] **Step 3: Isi komentar di db_connector**

Di `backend/app/services/db_connector.py`, method `_get_single_table`, ubah pembentukan
`ColumnMetadata` (sekarang di baris 298-305) menjadi:

```python
        columns = []
        for col in raw_columns:
            columns.append(ColumnMetadata(
                name=col["name"],
                data_type=str(col["type"]),
                is_nullable=col.get("nullable", True),
                default_value=str(col["default"]) if col.get("default") is not None else None,
                is_primary_key=False,
                is_foreign_key=False,
                column_comment=col.get("comment"),
            ))
```

Masih di method yang sama, sisipkan pengambilan komentar tabel tepat sebelum blok `return
TableMetadata(...)` (sekarang baris 408). Dibungkus try/except mengikuti idiom berkas ini, karena
SQLite tidak mendukungnya:

```python
        # Komentar tabel tidak didukung setiap engine; SQLite melempar
        # NotImplementedError. Ketiadaannya bukan kegagalan.
        try:
            info_komentar = inspector.get_table_comment(table_name, schema=schema)
            table_comment = (info_komentar or {}).get("text")
        except Exception:
            table_comment = None
```

Lalu tambahkan `table_comment=table_comment,` ke pemanggilan `TableMetadata(...)`.

- [ ] **Step 4: Tampilkan komentar kolom di tabel Markdown**

Di `backend/app/services/doc_generator.py`, method `_build_columns_table`, ganti penyusunan `notes`
(sekarang baris 290) menjadi:

```python
            keterangan = list(flags)
            if col.column_comment:
                keterangan.append(col.column_comment.strip())
            notes = " · ".join(keterangan) if keterangan else "-"
```

- [ ] **Step 5: Tampilkan komentar tabel dan kirim ke prompt**

Di `_generate_table_doc`, sisipkan catatan skema sebelum deskripsi AI. Ganti kedua blok `return`
(baris 163-180) sehingga setiap cabang bahasa menyisipkan variabel berikut, yang dihitung di awal
method:

```python
        catatan = ""
        if table.table_comment:
            label = "Catatan skema" if self.language == OutputLanguage.INDONESIAN else "Schema note"
            catatan = f"> {label}: {table.table_comment.strip()}\n\n"
```

Sisipkan `{catatan}` tepat sebelum `{ai_description}` pada kedua f-string.

Di `_build_prompt`, sisipkan komentar tabel sebagai konteks. Tambahkan tepat setelah perhitungan
`row_hint`:

```python
        komentar_text = ""
        if table.table_comment:
            label = (
                "Komentar tabel dari database"
                if self.language == OutputLanguage.INDONESIAN
                else "Table comment from database"
            )
            komentar_text = f"\n{label}: {table.table_comment.strip()}"
```

Sisipkan `{komentar_text}` pada kedua f-string prompt, tepat setelah `{row_hint}`.

- [ ] **Step 6: Jalankan test untuk memastikan lulus**

Jalankan: `python -m pytest tests/test_db_comments.py tests/test_doc_generator.py -v`
Harapan: seluruhnya LULUS. Test Task 1 tetap hijau karena tabel contoh di sana tidak punya komentar,
sehingga jalurnya tidak berubah.

- [ ] **Step 7: Jalankan seluruh test dan linter**

Jalankan: `python -m pytest -q`
Jalankan: `python -m ruff check app tests`

- [ ] **Step 8: Perbarui dokumentasi**

- `dev-docs/CHANGELOG.md`: tambahkan entri di bagian `[Unreleased]` bahwa komentar tabel dan kolom
  dari database kini dipakai sebagai sumber deskripsi.
- `dev-docs/ai/CURRENT_STATE.md`: perbarui jumlah test.
- `dev-docs/ai/MODULE_MAP.md`: catat bahwa `db_connector` kini mengambil komentar.

- [ ] **Step 9: Siapkan commit**

```bash
git add v2/msf-db/backend/app/services/db_connector.py v2/msf-db/backend/app/services/doc_generator.py v2/msf-db/backend/tests/test_db_comments.py v2/msf-db/dev-docs/
```

```
feat: pakai komentar tabel dan kolom dari database

Komentar yang ditulis DBA adalah fakta, bukan tebakan. Sebelumnya
field column_comment dan table_comment hanya dideklarasikan di
schema tanpa pernah diisi maupun dibaca.
```

---

## Task 3: Keluaran AI yang dapat direproduksi

Input yang sama harus menghasilkan keluaran yang sama. Tanpa `seed`, dokumen tidak pernah bisa
diverifikasi ulang.

**Files:**
- Modify: `backend/app/services/ollama_provider.py:61-70`
- Modify: `backend/app/services/cloud_provider.py:58-69` dan `:167-178`
- Modify: `.env.example`
- Create: `backend/tests/test_ai_determinism.py`

**Interfaces:**
- Produces: env `AI_SEED` dan `AI_TEMPERATURE` dibaca kedua provider.

- [ ] **Step 1: Tulis test yang gagal**

Buat `backend/tests/test_ai_determinism.py`:

```python
"""Dokumen yang tidak dapat direproduksi tidak dapat diverifikasi."""

from app.services.ollama_provider import OllamaProvider


def test_payload_ollama_memuat_seed(monkeypatch):
    monkeypatch.setenv("AI_SEED", "42")
    provider = OllamaProvider()

    payload = provider.bangun_payload("prompt uji", "llama3.2")

    assert payload["options"]["seed"] == 42


def test_temperature_bawaan_rendah_untuk_tugas_faktual(monkeypatch):
    monkeypatch.delenv("AI_TEMPERATURE", raising=False)
    provider = OllamaProvider()

    payload = provider.bangun_payload("prompt uji", "llama3.2")

    assert payload["options"]["temperature"] == 0.1


def test_temperature_dapat_ditimpa_lewat_env(monkeypatch):
    monkeypatch.setenv("AI_TEMPERATURE", "0.7")
    provider = OllamaProvider()

    payload = provider.bangun_payload("prompt uji", "llama3.2")

    assert payload["options"]["temperature"] == 0.7


def test_seed_kosong_berarti_tidak_dikirim(monkeypatch):
    """Seed kosong harus berarti perilaku lama, bukan seed nol."""
    monkeypatch.setenv("AI_SEED", "")
    provider = OllamaProvider()

    payload = provider.bangun_payload("prompt uji", "llama3.2")

    assert "seed" not in payload["options"]
```

- [ ] **Step 2: Jalankan test untuk memastikan gagal**

Jalankan: `python -m pytest tests/test_ai_determinism.py -v`
Harapan: GAGAL dengan `AttributeError` karena `bangun_payload` belum ada.

- [ ] **Step 3: Ekstrak pembentukan payload dan tambahkan seed**

Kedua pembaca env ditempatkan di `backend/app/services/ai_provider.py`, bukan di salah satu
provider. `ai_provider.py` adalah modul dasar yang sudah diimpor kedua provider, sehingga
`cloud_provider` tidak perlu mengimpor dari `ollama_provider` — arah ketergantungan seperti itu akan
menyesatkan.

Tambahkan di `backend/app/services/ai_provider.py`:

```python
def ai_seed():
    """None berarti tidak dikirim, sehingga perilaku lama dipertahankan."""
    nilai = os.getenv("AI_SEED", "").strip()
    if not nilai:
        return None
    try:
        return int(nilai)
    except ValueError:
        return None


def ai_temperature():
    try:
        return float(os.getenv("AI_TEMPERATURE", "0.1"))
    except ValueError:
        return 0.1
```

Pastikan `import os` sudah ada di `ai_provider.py`; tambahkan bila belum.

Tambahkan method pada `OllamaProvider` di `backend/app/services/ollama_provider.py`, dengan impor
`from app.services.ai_provider import ai_seed, ai_temperature` di bagian impor berkas itu:

```python
    def bangun_payload(self, prompt: str, model: str) -> dict:
        """Payload dipisah dari pemanggilan agar dapat diuji tanpa jaringan."""
        options = {
            "temperature": ai_temperature(),
            "num_predict": 2048,
            "top_p": 0.9,
        }
        seed = ai_seed()
        if seed is not None:
            options["seed"] = seed
        return {
            "model": model,
            "prompt": prompt,
            "stream": False,
            "options": options,
        }
```

Di method `generate`, ganti literal `payload = {...}` (baris 61-70) menjadi:

```python
        payload = self.bangun_payload(prompt, model)
```

- [ ] **Step 4: Terapkan hal yang sama pada provider cloud**

Di `backend/app/services/cloud_provider.py`, tambahkan impor
`from app.services.ai_provider import ai_seed, ai_temperature` di bagian impor.

Pada `DeepSeekProvider.generate` dan `OpenAIProvider.generate`, ganti `"temperature": 0.3,` menjadi
`"temperature": ai_temperature(),` dan sisipkan sesudah pembentukan `payload`:

```python
        seed = ai_seed()
        if seed is not None:
            payload["seed"] = seed
```

- [ ] **Step 5: Tambahkan placeholder ke .env.example**

Sisipkan di bagian AI pada `.env.example`:

```
# Seed AI. Kosongkan untuk perilaku lama yang tidak dapat direproduksi.
# Diisi angka agar input yang sama menghasilkan keluaran yang sama.
AI_SEED=42
# Temperature AI. Rendah karena tugasnya ekstraksi fakta, bukan menulis kreatif.
AI_TEMPERATURE=0.1
```

- [ ] **Step 6: Jalankan test untuk memastikan lulus**

Jalankan: `python -m pytest tests/test_ai_determinism.py -v`
Harapan: LULUS.

- [ ] **Step 7: Jalankan seluruh test dan linter**

Jalankan: `python -m pytest -q`
Jalankan: `python -m ruff check app tests`

- [ ] **Step 8: Perbarui dokumentasi**

`dev-docs/CHANGELOG.md` dan `dev-docs/ai/CURRENT_STATE.md`.

- [ ] **Step 9: Siapkan commit**

```bash
git add v2/msf-db/backend/app/services/ollama_provider.py v2/msf-db/backend/app/services/cloud_provider.py v2/msf-db/backend/tests/test_ai_determinism.py v2/msf-db/.env.example v2/msf-db/dev-docs/
```

```
feat: seed dan temperature AI dapat dikonfigurasi

Tanpa seed, dokumen yang sama tidak pernah dapat dihasilkan ulang
sehingga tidak dapat diverifikasi. Temperature diturunkan ke 0.1
karena tugasnya ekstraksi fakta.
```

---

## Task 4: Teruskan project_description yang selama ini dibuang

Frontend mengirimnya di `page.tsx:77` dan backend memvalidasinya di `schemas.py:200`, lalu nilainya
hilang karena tidak pernah dimasukkan ke dict `settings`.

**Files:**
- Modify: `backend/app/routers/generate.py:152-161` dan `:227-236`
- Modify: `backend/app/services/doc_generator.py:45-57`
- Create: `backend/tests/test_generate_settings.py`

**Interfaces:**
- Consumes: `GenerateSettings.project_description`.
- Produces: `DocGenerator.__init__` menerima `project_description`, dipakai Task 8.

- [ ] **Step 1: Tulis test yang gagal**

Buat `backend/tests/test_generate_settings.py`:

```python
"""Setting yang divalidasi tapi dibuang adalah janji palsu ke pengguna."""

import pytest

from app.services.doc_generator import DocGenerator


class ProviderPerekam:
    def __init__(self):
        self.prompt = None

    async def generate(self, prompt, model):
        self.prompt = prompt
        return "Deskripsi."


def test_doc_generator_menerima_project_description():
    gen = DocGenerator(
        provider=ProviderPerekam(),
        model="model-uji",
        project_description="Sistem manajemen risiko operasional.",
    )

    assert gen.project_description == "Sistem manajemen risiko operasional."


def test_project_description_bawaan_none():
    gen = DocGenerator(provider=ProviderPerekam(), model="model-uji")

    assert gen.project_description is None
```

Tambahkan pemeriksaan router pada berkas yang sama:

```python
def test_kedua_router_meneruskan_project_description():
    """Dict settings disusun manual di dua tempat; mudah terlewat satu."""
    import inspect

    from app.routers import generate as modul

    sumber = inspect.getsource(modul)

    assert sumber.count('"project_description": payload.project_description') == 2
```

- [ ] **Step 2: Jalankan test untuk memastikan gagal**

Jalankan: `python -m pytest tests/test_generate_settings.py -v`
Harapan: GAGAL karena parameter dan key tersebut belum ada.

- [ ] **Step 3: Tambahkan parameter pada DocGenerator**

Di `backend/app/services/doc_generator.py`, tambahkan pada `__init__` setelah `business_context`:

```python
        project_description: Optional[str] = None,
```

dan pada badan method:

```python
        self.project_description = project_description
```

- [ ] **Step 4: Teruskan dari kedua router**

Di `backend/app/routers/generate.py`, tambahkan baris berikut ke **kedua** dict `settings`, yaitu di
`generate_from_ddl` (sekitar baris 152) dan `generate_from_db` (sekitar baris 227):

```python
        "project_description": payload.project_description,
```

Di `_run_generate_job`, teruskan ke generator:

```python
            project_description=settings.get("project_description"),
```

- [ ] **Step 5: Jalankan test untuk memastikan lulus**

Jalankan: `python -m pytest tests/test_generate_settings.py -v`
Harapan: LULUS.

- [ ] **Step 6: Jalankan seluruh test dan linter**

Jalankan: `python -m pytest -q`
Jalankan: `python -m ruff check app tests`

- [ ] **Step 7: Siapkan commit**

```bash
git add v2/msf-db/backend/app/routers/generate.py v2/msf-db/backend/app/services/doc_generator.py v2/msf-db/backend/tests/test_generate_settings.py
```

```
fix: teruskan project_description yang selama ini dibuang

Frontend mengirim dan backend memvalidasi field ini, lalu nilainya
hilang karena tidak pernah masuk dict settings di kedua router.
```

---

## Task 5: Rate limit untuk endpoint pelacakan job

Spec §9.5. `GET /api/jobs/by-code/{access_code}` tidak memiliki rate limit sama sekali, sedangkan
Task 2 mulai mengalirkan isi komentar database ke endpoint publik itu lewat `preview_markdown`.

`access_code` memakai `secrets.token_hex(5)` (`job_queue.py:47`), yaitu 40 bit entropi. Kuat, tetapi
enumerasinya tidak dibatasi apa pun.

**Files:**
- Modify: `backend/app/utils/rate_limit.py`
- Modify: `backend/app/routers/generate.py:289-298`
- Modify: `.env.example`
- Modify: `backend/tests/test_rate_limit.py`

**Interfaces:**
- Produces: `job_lookup_limit()` di `rate_limit.py`, mengikuti pola `generate_limit()` yang sudah ada.

- [ ] **Step 1: Tulis test yang gagal**

Tambahkan ke `backend/tests/test_rate_limit.py`:

```python
def test_endpoint_by_code_dibatasi(client, monkeypatch):
    """Kode akses 40 bit tetap dapat dienumerasi bila tidak ada limit."""
    monkeypatch.setenv("RATE_LIMIT_JOB_LOOKUP", "3/minute")

    status = [
        client.get(f"/api/jobs/by-code/MSF-{i:010X}").status_code for i in range(5)
    ]

    assert 429 in status
```

- [ ] **Step 2: Jalankan test untuk memastikan gagal**

Jalankan: `python -m pytest tests/test_rate_limit.py::test_endpoint_by_code_dibatasi -v`
Harapan: GAGAL karena seluruh permintaan mengembalikan 404, tidak pernah 429.

- [ ] **Step 3: Tambahkan definisi limit**

Di `backend/app/utils/rate_limit.py`, setelah `admin_verify_limit`:

```python
def job_lookup_limit() -> str:
    """
    Pelacakan job memakai kode akses 40 bit. Kuat terhadap tebakan tunggal,
    tetapi tanpa limit, enumerasinya tidak dibatasi apa pun.
    """
    return os.getenv("RATE_LIMIT_JOB_LOOKUP", "30/minute")
```

- [ ] **Step 4: Pasang limit pada endpoint**

Di `backend/app/routers/generate.py`, ubah impor menjadi:

```python
from app.utils.rate_limit import generate_limit, job_lookup_limit, limiter
```

Ubah deklarasi endpoint (sekarang baris 289-291) menjadi:

```python
@router.get("/jobs/by-code/{access_code}", response_model=JobStatusResponse)
@limiter.limit(job_lookup_limit)
async def get_job_by_code(request: Request, access_code: str):
```

Parameter `request` wajib bernama persis itu dan bertipe `Request` karena dekorator slowapi
mencarinya berdasarkan nama, sama seperti pada kedua endpoint generate.

- [ ] **Step 5: Tambahkan placeholder ke .env.example**

```
# Limit pelacakan job lewat kode akses. Mencegah enumerasi kode akses.
RATE_LIMIT_JOB_LOOKUP=30/minute
```

- [ ] **Step 6: Jalankan test untuk memastikan lulus**

Jalankan: `python -m pytest tests/test_rate_limit.py -v`
Harapan: LULUS, termasuk seluruh test rate limit yang sudah ada.

- [ ] **Step 7: Jalankan seluruh test dan linter**

Jalankan: `python -m pytest -q`
Jalankan: `python -m ruff check app tests`

- [ ] **Step 8: Perbarui dokumentasi keamanan**

Di `dev-docs/ai/CURRENT_STATE.md` bagian 1a, perbarui dua hal:

1. Pernyataan bahwa `jobs.db` tidak memuat satu pun kredensial tidak lagi berlaku sepenuhnya.
   Komentar database dapat memuat catatan internal dan kini tersimpan lewat `preview_markdown`.
2. Catat bahwa endpoint pelacakan job kini memiliki rate limit.

- [ ] **Step 9: Siapkan commit**

```bash
git add v2/msf-db/backend/app/utils/rate_limit.py v2/msf-db/backend/app/routers/generate.py v2/msf-db/backend/tests/test_rate_limit.py v2/msf-db/.env.example v2/msf-db/dev-docs/ai/CURRENT_STATE.md
```

```
fix: batasi laju endpoint pelacakan job

Endpoint by-code sebelumnya tanpa limit sama sekali, sementara
komentar database kini mengalir ke preview_markdown yang
dikembalikan endpoint publik itu.
```

---

## Task 6: Hapus emoji dari keluaran generator

AGENTS.md §1 poin 12 melarang emoji di kode. Dikerjakan sebelum Task 9 supaya pemindahan fungsi ke
renderer berangkat dari kode yang sudah bersih, dan tetap menjadi commit tersendiri sesuai §3B.

**Files:**
- Modify: `backend/app/services/doc_generator.py:283-285` dan `:356`
- Create: `backend/tests/test_tanpa_emoji.py`

- [ ] **Step 1: Tulis test yang gagal**

Buat `backend/tests/test_tanpa_emoji.py`:

```python
"""AGENTS.md poin 12: dilarang emoji di kode maupun keluarannya."""

from pathlib import Path

import pytest

from app.models.schemas import ColumnMetadata, ForeignKeyMetadata, TableMetadata
from app.services.doc_generator import DocGenerator

BERKAS_DIPERIKSA = [
    "app/services/doc_generator.py",
    "app/services/ai_column_parser.py",
    "app/services/doc_model.py",
    "app/services/renderers/markdown_renderer.py",
]


def _mengandung_emoji(teks: str) -> bool:
    return any(ord(karakter) > 0x2100 for karakter in teks)


@pytest.mark.parametrize("relatif", BERKAS_DIPERIKSA)
def test_berkas_sumber_tanpa_emoji(relatif):
    berkas = Path(__file__).resolve().parent.parent / relatif
    if not berkas.exists():
        pytest.skip(f"{relatif} belum dibuat pada task ini")

    assert not _mengandung_emoji(berkas.read_text(encoding="utf-8"))


class ProviderGagal:
    async def generate(self, prompt, model):
        raise RuntimeError("model mati")


@pytest.mark.asyncio
async def test_keluaran_dokumen_tanpa_emoji():
    tabel = TableMetadata(
        name="t_uji",
        schema="public",
        columns=[
            ColumnMetadata(
                name="id", data_type="bigint", is_nullable=False, is_primary_key=True
            ),
            ColumnMetadata(name="ref_id", data_type="bigint", is_foreign_key=True),
        ],
        primary_key=["id"],
        foreign_keys=[
            ForeignKeyMetadata(
                column="ref_id", references_table="t_lain", references_column="id"
            )
        ],
    )
    gen = DocGenerator(provider=ProviderGagal(), model="model-uji")

    hasil = await gen.generate_from_tables([tabel], "Proyek Uji")

    assert not _mengandung_emoji(hasil)
```

Test ini sengaja juga menyebut berkas yang belum ada. `pytest.skip` membuatnya lewat sekarang, dan
berlaku otomatis begitu Task 7 dan 9 membuat berkas tersebut.

- [ ] **Step 2: Jalankan test untuk memastikan gagal**

Jalankan: `python -m pytest tests/test_tanpa_emoji.py -v`
Harapan: GAGAL pada `doc_generator.py` dan pada keluaran dokumen, karena penanda kunci, rantai, dan
peringatan masih berupa emoji.

- [ ] **Step 3: Ganti penanda kolom**

Di `_build_columns_table`, ganti ketiga baris penanda (sekarang baris 282-287):

```python
            if col.is_primary_key:
                flags.append("PK")
            if col.is_foreign_key:
                flags.append("FK")
```

- [ ] **Step 4: Ganti penanda peringatan pada fallback**

Di `_fallback_table_doc`, ganti baris 356:

```python
        note = f"\n> Catatan: deskripsi AI tidak tersedia. {error[:100]}\n"
```

- [ ] **Step 5: Jalankan test untuk memastikan lulus**

Jalankan: `python -m pytest tests/test_tanpa_emoji.py -v`
Harapan: LULUS, dengan sebagian test dilewati karena berkasnya belum ada.

- [ ] **Step 6: Jalankan seluruh test dan linter**

Jalankan: `python -m pytest -q`
Jalankan: `python -m ruff check app tests`

- [ ] **Step 7: Siapkan commit**

```bash
git add v2/msf-db/backend/app/services/doc_generator.py v2/msf-db/backend/tests/test_tanpa_emoji.py
```

```
refactor: hapus emoji dari keluaran generator

AGENTS.md poin 12 melarang emoji di kode. Penanda PK, FK, dan
peringatan diganti teks biasa. Test menjaga agar tidak masuk lagi.
```

---

## Task 7: Model dokumen

Bentuk data antara metadata database dan renderer. Tanpa pengetahuan tentang Markdown, Word, maupun
HTTP.

**Files:**
- Create: `backend/app/services/doc_model.py`
- Create: `backend/tests/test_doc_model.py`

**Interfaces:**
- Produces: `ColumnDoc`, `TableDoc`, `DocumentModel`, konstanta `SUMBER_KOMENTAR_DB`, `SUMBER_AI`,
  `SUMBER_FALLBACK`, dan `DocumentModel.ringkasan_sumber() -> dict[str, int]`. Dipakai Task 8 dan 9.

- [ ] **Step 1: Tulis test yang gagal**

Buat `backend/tests/test_doc_model.py`:

```python
"""Model dokumen memisahkan isi dari cara menampilkannya."""

from app.services.doc_model import (
    SUMBER_AI,
    SUMBER_FALLBACK,
    SUMBER_KOMENTAR_DB,
    ColumnDoc,
    DocumentModel,
    TableDoc,
)


def model_contoh():
    kolom = [
        ColumnDoc(
            no=1,
            name="id",
            data_type_label="bigint",
            description="Nomor identitas.",
            source=SUMBER_KOMENTAR_DB,
        ),
        ColumnDoc(
            no=2,
            name="nama",
            data_type_label="varchar",
            description="Nama nasabah.",
            source=SUMBER_AI,
        ),
        ColumnDoc(
            no=3,
            name="ref_id",
            data_type_label="bigint",
            description="Referensi ke t_lain.id",
            source=SUMBER_FALLBACK,
        ),
    ]
    tabel = TableDoc(
        name="mst_nasabah",
        schema="public",
        comment="Data induk nasabah.",
        summary="Menyimpan data induk nasabah.",
        columns=kolom,
    )
    return DocumentModel(
        project_name="Proyek Uji",
        generated_at="11 August 2026",
        tables=[tabel],
    )


def test_ringkasan_sumber_menghitung_setiap_asal_deskripsi():
    hasil = model_contoh().ringkasan_sumber()

    assert hasil[SUMBER_KOMENTAR_DB] == 1
    assert hasil[SUMBER_AI] == 1
    assert hasil[SUMBER_FALLBACK] == 1


def test_ringkasan_sumber_pada_dokumen_kosong():
    kosong = DocumentModel(project_name="Kosong", generated_at="11 August 2026")

    hasil = kosong.ringkasan_sumber()

    assert hasil[SUMBER_AI] == 0


def test_nomor_kolom_dipertahankan_apa_adanya():
    """Nomor dipakai kolom No pada template dan tidak boleh dihitung ulang renderer."""
    tabel = model_contoh().tables[0]

    assert [k.no for k in tabel.columns] == [1, 2, 3]
```

- [ ] **Step 2: Jalankan test untuk memastikan gagal**

Jalankan: `python -m pytest tests/test_doc_model.py -v`
Harapan: GAGAL dengan `ModuleNotFoundError`.

- [ ] **Step 3: Tulis model**

Buat `backend/app/services/doc_model.py`:

```python
"""
Model dokumen — bentuk data antara metadata database dan renderer.

Berkas ini tidak mengetahui Markdown, Word, maupun HTTP. Renderer yang
menerjemahkannya, sehingga satu isi dapat ditampilkan dalam banyak bentuk.
"""

from dataclasses import dataclass, field
from typing import Dict, List, Optional

SUMBER_KOMENTAR_DB = "db_comment"
SUMBER_AI = "ai"
SUMBER_FALLBACK = "fallback"

SEMUA_SUMBER = (SUMBER_KOMENTAR_DB, SUMBER_AI, SUMBER_FALLBACK)


@dataclass
class ColumnDoc:
    no: int
    name: str
    data_type_label: str
    description: str
    source: str


@dataclass
class TableDoc:
    name: str
    schema: str = "public"
    comment: Optional[str] = None
    summary: str = ""
    columns: List[ColumnDoc] = field(default_factory=list)
    foreign_keys: List[object] = field(default_factory=list)
    indexes: List[object] = field(default_factory=list)


@dataclass
class DocumentModel:
    project_name: str
    generated_at: str
    project_description: Optional[str] = None
    author: Optional[str] = None
    tables: List[TableDoc] = field(default_factory=list)

    def ringkasan_sumber(self) -> Dict[str, int]:
        """
        Hitung asal setiap deskripsi kolom.

        Dipakai untuk melaporkan seberapa besar porsi dokumen yang
        berlandaskan fakta dibanding tebakan AI.
        """
        hasil = {sumber: 0 for sumber in SEMUA_SUMBER}
        for tabel in self.tables:
            for kolom in tabel.columns:
                hasil[kolom.source] = hasil.get(kolom.source, 0) + 1
        return hasil
```

- [ ] **Step 4: Jalankan test untuk memastikan lulus**

Jalankan: `python -m pytest tests/test_doc_model.py -v`
Harapan: LULUS.

- [ ] **Step 5: Jalankan seluruh test dan linter**

Jalankan: `python -m pytest -q`
Jalankan: `python -m ruff check app tests`

- [ ] **Step 6: Siapkan commit**

```bash
git add v2/msf-db/backend/app/services/doc_model.py v2/msf-db/backend/tests/test_doc_model.py
```

```
feat: model dokumen sebagai bentuk data antara

DocumentModel memisahkan isi dokumen dari cara menampilkannya,
sehingga satu isi dapat dirender ke banyak bentuk keluaran.
```

---

## Task 8: Parser keluaran AI sebagai penyaring halusinasi

Inti solusi. Setiap nama kolom dari AI dicocokkan dengan metadata asli; yang tidak cocok dibuang
sebelum masuk dokumen. Penyaringan ini deterministik dan tidak bergantung pada kepatuhan model.

**Files:**
- Create: `backend/app/services/ai_column_parser.py`
- Create: `backend/tests/test_ai_column_parser.py`

**Interfaces:**
- Produces:
  - `sanitasi_teks(teks: str, batas: int) -> str`
  - `parse_keluaran_kolom(keluaran: str, kolom_sah: Iterable[str]) -> tuple[str, dict[str, str], int]`
    mengembalikan `(ringkasan, {nama_kolom: deskripsi}, jumlah_ditolak)`
  - konstanta `BATAS_DESKRIPSI = 300`, `BATAS_RINGKASAN = 400`

  Dipakai Task 9.

- [ ] **Step 1: Tulis test yang gagal**

Buat `backend/tests/test_ai_column_parser.py`:

```python
"""Parser adalah penyaring halusinasi, bukan sekadar pembaca teks."""

from app.services.ai_column_parser import (
    BATAS_DESKRIPSI,
    parse_keluaran_kolom,
    sanitasi_teks,
)

KOLOM_SAH = ["id", "nasabah_id", "jumlah"]


def test_kolom_yang_tidak_ada_di_metadata_dibuang():
    """Ini pertahanan utama terhadap halusinasi."""
    keluaran = (
        "id | Nomor identitas.\n"
        "kolom_karangan | Kolom ini tidak pernah ada.\n"
        "jumlah | Nominal pembayaran."
    )

    _, deskripsi, ditolak = parse_keluaran_kolom(keluaran, KOLOM_SAH)

    assert "kolom_karangan" not in deskripsi
    assert ditolak == 1
    assert set(deskripsi) == {"id", "jumlah"}


def test_garis_bawah_pada_nama_kolom_dipertahankan():
    """Sanitasi tidak boleh membuang garis bawah; itu merusak pencocokan nama."""
    keluaran = "nasabah_id | Referensi ke nasabah."

    _, deskripsi, _ = parse_keluaran_kolom(keluaran, KOLOM_SAH)

    assert deskripsi["nasabah_id"] == "Referensi ke nasabah."


def test_ringkasan_diambil_dari_baris_berlabel():
    keluaran = "RINGKASAN: Tabel transaksi pembayaran.\nid | Nomor identitas."

    ringkasan, deskripsi, _ = parse_keluaran_kolom(keluaran, KOLOM_SAH)

    assert ringkasan == "Tabel transaksi pembayaran."
    assert deskripsi["id"] == "Nomor identitas."


def test_pencocokan_nama_tidak_peka_huruf_besar_kecil():
    keluaran = "NASABAH_ID | Referensi nasabah."

    _, deskripsi, ditolak = parse_keluaran_kolom(keluaran, KOLOM_SAH)

    assert deskripsi["nasabah_id"] == "Referensi nasabah."
    assert ditolak == 0


def test_heading_dan_markup_dilucuti():
    """Heading liar dari model kecil itulah yang merusak hierarki dokumen."""
    keluaran = "## Deskripsi\nid | **Nomor** `identitas` internal."

    _, deskripsi, _ = parse_keluaran_kolom(keluaran, KOLOM_SAH)

    assert deskripsi["id"] == "Nomor identitas internal."


def test_baris_tanpa_pemisah_diabaikan_tanpa_error():
    keluaran = "Berikut penjelasannya:\nid | Nomor identitas."

    _, deskripsi, ditolak = parse_keluaran_kolom(keluaran, KOLOM_SAH)

    assert deskripsi == {"id": "Nomor identitas."}
    assert ditolak == 0


def test_keluaran_kosong_menghasilkan_hasil_kosong():
    ringkasan, deskripsi, ditolak = parse_keluaran_kolom("", KOLOM_SAH)

    assert ringkasan == ""
    assert deskripsi == {}
    assert ditolak == 0


def test_keluaran_none_tidak_menjatuhkan_parser():
    ringkasan, deskripsi, _ = parse_keluaran_kolom(None, KOLOM_SAH)

    assert ringkasan == ""
    assert deskripsi == {}


def test_deskripsi_dipotong_pada_batas():
    keluaran = "id | " + ("a" * (BATAS_DESKRIPSI + 200))

    _, deskripsi, _ = parse_keluaran_kolom(keluaran, KOLOM_SAH)

    assert len(deskripsi["id"]) <= BATAS_DESKRIPSI + 3


def test_deskripsi_selalu_satu_baris():
    """Baris baru di dalam sel tabel merusak tabel Markdown."""
    hasil = sanitasi_teks("baris satu\nbaris dua", 100)

    assert "\n" not in hasil
    assert hasil == "baris satu baris dua"


def test_pemisah_di_dalam_deskripsi_tidak_memotong_isi():
    keluaran = "id | Nomor identitas | dipakai lintas modul."

    _, deskripsi, _ = parse_keluaran_kolom(keluaran, KOLOM_SAH)

    assert deskripsi["id"] == "Nomor identitas | dipakai lintas modul."
```

- [ ] **Step 2: Jalankan test untuk memastikan gagal**

Jalankan: `python -m pytest tests/test_ai_column_parser.py -v`
Harapan: GAGAL dengan `ModuleNotFoundError`.

- [ ] **Step 3: Tulis parser**

Buat `backend/app/services/ai_column_parser.py`:

```python
"""
Parsing dan sanitasi keluaran AI untuk deskripsi kolom.

Parser di berkas ini bukan sekadar pembaca teks, melainkan penyaring
halusinasi: nama kolom yang tidak ada di metadata asli dibuang sebelum
sempat masuk dokumen. Penyaringan ini deterministik dan tidak bergantung
pada kepatuhan model terhadap instruksi.
"""

import re
from typing import Dict, Iterable, Optional, Tuple

BATAS_DESKRIPSI = 300
BATAS_RINGKASAN = 400
BATAS_NAMA = 128

LABEL_RINGKASAN = "RINGKASAN:"

# Garis bawah sengaja TIDAK ikut dilucuti. Garis bawah lazim pada nama
# kolom, dan membuangnya akan merusak pencocokan dengan metadata.
_POLA_MARKUP = re.compile(r"[*`#>\[\]]")


def sanitasi_teks(teks: Optional[str], batas: int) -> str:
    """Ratakan menjadi satu baris, lucuti markup, lalu potong panjangnya."""
    if not teks:
        return ""
    satu_baris = " ".join(str(teks).split())
    bersih = _POLA_MARKUP.sub("", satu_baris).strip()
    if len(bersih) > batas:
        bersih = bersih[:batas].rstrip() + "..."
    return bersih


def parse_keluaran_kolom(
    keluaran: Optional[str], kolom_sah: Iterable[str]
) -> Tuple[str, Dict[str, str], int]:
    """
    Kembalikan (ringkasan, {nama_kolom: deskripsi}, jumlah_ditolak).

    Nama kolom dicocokkan tanpa peka huruf besar kecil terhadap metadata.
    Yang tidak cocok dihitung sebagai ditolak dan tidak pernah dikembalikan.
    """
    peta_sah = {nama.lower(): nama for nama in kolom_sah}
    ringkasan = ""
    hasil: Dict[str, str] = {}
    ditolak = 0

    for baris in (keluaran or "").splitlines():
        baris = baris.strip()
        if not baris:
            continue

        if baris.upper().startswith(LABEL_RINGKASAN):
            ringkasan = sanitasi_teks(baris.split(":", 1)[1], BATAS_RINGKASAN)
            continue

        if "|" not in baris:
            continue

        nama_mentah, deskripsi_mentah = baris.split("|", 1)
        nama = sanitasi_teks(nama_mentah, BATAS_NAMA).lower()
        nama_asli = peta_sah.get(nama)

        if nama_asli is None:
            ditolak += 1
            continue

        deskripsi = sanitasi_teks(deskripsi_mentah, BATAS_DESKRIPSI)
        if deskripsi:
            hasil[nama_asli] = deskripsi

    return ringkasan, hasil, ditolak
```

- [ ] **Step 4: Jalankan test untuk memastikan lulus**

Jalankan: `python -m pytest tests/test_ai_column_parser.py -v`
Harapan: seluruh 11 test LULUS.

- [ ] **Step 5: Jalankan seluruh test dan linter**

Jalankan: `python -m pytest -q`
Jalankan: `python -m ruff check app tests`

- [ ] **Step 6: Siapkan commit**

```bash
git add v2/msf-db/backend/app/services/ai_column_parser.py v2/msf-db/backend/tests/test_ai_column_parser.py
```

```
feat: parser keluaran AI sebagai penyaring halusinasi

Nama kolom yang tidak ada di metadata dibuang sebelum masuk dokumen.
Penyaringan deterministik, tidak bergantung kepatuhan model.
```

---

## Task 9: Bangun DocumentModel dengan rantai pengisian

Menyatukan Task 7 dan 8. Kolom yang sudah punya komentar database tidak pernah ditanyakan ke AI,
sehingga tidak mungkin dikarang.

**Files:**
- Modify: `backend/app/services/doc_generator.py`
- Create: `backend/tests/test_doc_model_builder.py`

**Interfaces:**
- Consumes: `parse_keluaran_kolom`, `sanitasi_teks` dari Task 8; `DocumentModel`, `TableDoc`,
  `ColumnDoc`, konstanta sumber dari Task 7.
- Produces: `await DocGenerator.build_document_model(tables, project_name, job=None) -> DocumentModel`.
  Dipakai Task 10.

- [ ] **Step 1: Tulis test yang gagal**

Buat `backend/tests/test_doc_model_builder.py`:

```python
"""Rantai pengisian menentukan seberapa besar dokumen berlandaskan fakta."""

import pytest

from app.models.schemas import ColumnMetadata, ForeignKeyMetadata, TableMetadata
from app.services.doc_generator import DocGenerator
from app.services.doc_model import SUMBER_AI, SUMBER_FALLBACK, SUMBER_KOMENTAR_DB


class ProviderPalsu:
    def __init__(self, balasan=""):
        self.balasan = balasan
        self.prompt_terakhir = None
        self.jumlah_panggilan = 0

    async def generate(self, prompt, model):
        self.prompt_terakhir = prompt
        self.jumlah_panggilan += 1
        return self.balasan


def tabel_campuran():
    return TableMetadata(
        name="trx_pembayaran",
        schema="public",
        columns=[
            ColumnMetadata(
                name="id",
                data_type="bigint",
                is_primary_key=True,
                column_comment="Nomor identitas transaksi.",
            ),
            ColumnMetadata(name="jumlah", data_type="numeric"),
            ColumnMetadata(name="nasabah_id", data_type="bigint", is_foreign_key=True),
        ],
        primary_key=["id"],
        foreign_keys=[
            ForeignKeyMetadata(
                column="nasabah_id", references_table="mst_nasabah", references_column="id"
            )
        ],
    )


def generator(balasan=""):
    return DocGenerator(
        provider=ProviderPalsu(balasan), model="model-uji", language="Indonesian"
    )


@pytest.mark.asyncio
async def test_komentar_database_menang_atas_ai():
    gen = generator("id | Deskripsi karangan AI.\njumlah | Nominal.")

    model = await gen.build_document_model([tabel_campuran()], "Proyek Uji")
    kolom = {k.name: k for k in model.tables[0].columns}

    assert kolom["id"].description == "Nomor identitas transaksi."
    assert kolom["id"].source == SUMBER_KOMENTAR_DB


@pytest.mark.asyncio
async def test_ai_mengisi_kolom_tanpa_komentar():
    gen = generator("jumlah | Nominal pembayaran.")

    model = await gen.build_document_model([tabel_campuran()], "Proyek Uji")
    kolom = {k.name: k for k in model.tables[0].columns}

    assert kolom["jumlah"].description == "Nominal pembayaran."
    assert kolom["jumlah"].source == SUMBER_AI


@pytest.mark.asyncio
async def test_fallback_dipakai_saat_ai_diam():
    gen = generator("")

    model = await gen.build_document_model([tabel_campuran()], "Proyek Uji")
    kolom = {k.name: k for k in model.tables[0].columns}

    assert kolom["nasabah_id"].source == SUMBER_FALLBACK
    assert "mst_nasabah.id" in kolom["nasabah_id"].description
    assert kolom["jumlah"].description == "-"


@pytest.mark.asyncio
async def test_ai_tidak_dipanggil_bila_semua_kolom_berkomentar():
    """Menghemat panggilan sekaligus menutup peluang mengarang."""
    tabel = TableMetadata(
        name="t_lengkap",
        schema="public",
        columns=[
            ColumnMetadata(name="id", data_type="bigint", column_comment="Identitas.")
        ],
    )
    provider = ProviderPalsu("id | karangan")
    gen = DocGenerator(provider=provider, model="model-uji", language="Indonesian")

    await gen.build_document_model([tabel], "Proyek Uji")

    assert provider.jumlah_panggilan == 0


@pytest.mark.asyncio
async def test_kegagalan_ai_tidak_menjatuhkan_pembangunan_model():
    class ProviderRusak:
        async def generate(self, prompt, model):
            raise RuntimeError("model mati")

    gen = DocGenerator(
        provider=ProviderRusak(), model="model-uji", language="Indonesian"
    )

    model = await gen.build_document_model([tabel_campuran()], "Proyek Uji")

    assert len(model.tables[0].columns) == 3
    assert model.tables[0].columns[1].source == SUMBER_FALLBACK


@pytest.mark.asyncio
async def test_nomor_kolom_berurutan_mulai_dari_satu():
    model = await generator().build_document_model([tabel_campuran()], "Proyek Uji")

    assert [k.no for k in model.tables[0].columns] == [1, 2, 3]


@pytest.mark.asyncio
async def test_ringkasan_tabel_diambil_dari_keluaran_ai():
    gen = generator("RINGKASAN: Mencatat transaksi pembayaran.\njumlah | Nominal.")

    model = await gen.build_document_model([tabel_campuran()], "Proyek Uji")

    assert model.tables[0].summary == "Mencatat transaksi pembayaran."


@pytest.mark.asyncio
async def test_prompt_hanya_meminta_kolom_yang_belum_berkomentar():
    provider = ProviderPalsu("")
    gen = DocGenerator(provider=provider, model="model-uji", language="Indonesian")

    await gen.build_document_model([tabel_campuran()], "Proyek Uji")

    assert "jumlah" in provider.prompt_terakhir
    assert "nasabah_id" in provider.prompt_terakhir
```

- [ ] **Step 2: Jalankan test untuk memastikan gagal**

Jalankan: `python -m pytest tests/test_doc_model_builder.py -v`
Harapan: GAGAL dengan `AttributeError` karena `build_document_model` belum ada.

- [ ] **Step 3: Tambahkan impor dan method pembangun**

Di `backend/app/services/doc_generator.py`, tambahkan impor:

```python
from datetime import datetime, timezone

from app.services.ai_column_parser import (
    BATAS_RINGKASAN,
    parse_keluaran_kolom,
    sanitasi_teks,
)
from app.services.doc_model import (
    SUMBER_AI,
    SUMBER_FALLBACK,
    SUMBER_KOMENTAR_DB,
    ColumnDoc,
    DocumentModel,
    TableDoc,
)
```

Tambahkan method berikut pada kelas `DocGenerator`:

```python
    def _deskripsi_fallback(self, kolom, tabel) -> str:
        """Dipakai saat komentar database kosong dan AI tidak memberi hasil."""
        if kolom.is_primary_key:
            return "Primary key"
        for fk in tabel.foreign_keys:
            if fk.column == kolom.name:
                return f"Referensi ke {fk.references_table}.{fk.references_column}"
        return "-"

    def _prompt_kolom(self, tabel, nama_kolom_diminta) -> str:
        """
        Minta satu baris per kolom, bukan prosa bebas.

        Format baris jauh lebih tahan dibanding JSON pada model kecil,
        dan tetap mudah divalidasi terhadap metadata.
        """
        baris_kolom = []
        for kolom in tabel.columns:
            penanda = []
            if kolom.is_primary_key:
                penanda.append("PRIMARY KEY")
            if kolom.is_foreign_key:
                penanda.append("FOREIGN KEY")
            keterangan = f" [{', '.join(penanda)}]" if penanda else ""
            sudah = " (sudah ada keterangan)" if kolom.column_comment else ""
            baris_kolom.append(
                f"- {kolom.name} ({kolom.data_type}){keterangan}{sudah}"
            )

        konteks = ""
        if tabel.table_comment:
            konteks += f"\nKeterangan tabel: {tabel.table_comment.strip()}"
        if self.business_context:
            konteks += f"\nKonteks bisnis: {self.business_context}"
        if self.project_description:
            konteks += f"\nDeskripsi proyek: {self.project_description}"

        diminta = ", ".join(nama_kolom_diminta)

        return f"""Kamu ahli dokumentasi database. Tabel: {tabel.name}

Kolom:
{chr(10).join(baris_kolom)}{konteks}

Tulis jawaban dalam format berikut, tanpa tambahan apa pun:
RINGKASAN: <satu kalimat tentang kegunaan tabel ini>
<nama_kolom> | <deskripsi singkat satu kalimat>

Tulis satu baris untuk setiap kolom berikut saja: {diminta}
Pakai nama kolom persis seperti tertulis di atas.
Jangan menambah kolom yang tidak ada dalam daftar."""

    async def build_document_model(
        self, tables, project_name: str, job=None
    ) -> DocumentModel:
        """Satukan metadata dan keluaran AI menjadi model dokumen."""
        model = DocumentModel(
            project_name=project_name,
            generated_at=datetime.now(timezone.utc).strftime("%d %B %Y"),
            project_description=self.project_description,
        )

        total = len(tables)
        if job:
            job.update(tables_total=total, tables_processed=0)

        for indeks, tabel in enumerate(tables):
            if job:
                if job.status == JobStatus.CANCELLED:
                    raise RuntimeError("Job dibatalkan oleh pengguna.")
                job.update(
                    current_table=tabel.name,
                    tables_processed=indeks,
                    progress=int((indeks / total) * 90) if total else 0,
                    status=JobStatus.PROCESSING,
                )

            model.tables.append(await self._bangun_tabel(tabel))

        if job:
            job.update(tables_processed=total, progress=90)

        return model

    async def _bangun_tabel(self, tabel) -> TableDoc:
        tanpa_komentar = [k.name for k in tabel.columns if not k.column_comment]

        ringkasan = ""
        deskripsi_ai = {}
        if tanpa_komentar:
            try:
                keluaran = await self.provider.generate(
                    self._prompt_kolom(tabel, tanpa_komentar), self.model
                )
                ringkasan, deskripsi_ai, ditolak = parse_keluaran_kolom(
                    keluaran, [k.name for k in tabel.columns]
                )
                if ditolak:
                    logger.warning(
                        "Kolom karangan dibuang parser",
                        tabel=tabel.name,
                        jumlah=ditolak,
                    )
            except Exception as e:
                logger.error(
                    "Gagal ambil deskripsi kolom", tabel=tabel.name, error=str(e)
                )

        kolom_doc = []
        for nomor, kolom in enumerate(tabel.columns, start=1):
            if kolom.column_comment:
                deskripsi = sanitasi_teks(kolom.column_comment, BATAS_RINGKASAN)
                sumber = SUMBER_KOMENTAR_DB
            elif kolom.name in deskripsi_ai:
                deskripsi = deskripsi_ai[kolom.name]
                sumber = SUMBER_AI
            else:
                deskripsi = self._deskripsi_fallback(kolom, tabel)
                sumber = SUMBER_FALLBACK

            kolom_doc.append(
                ColumnDoc(
                    no=nomor,
                    name=kolom.name,
                    data_type_label=kolom.data_type,
                    description=deskripsi,
                    source=sumber,
                )
            )

        return TableDoc(
            name=tabel.name,
            schema=tabel.schema,
            comment=tabel.table_comment,
            summary=ringkasan,
            columns=kolom_doc,
            foreign_keys=list(tabel.foreign_keys),
            indexes=list(tabel.indexes),
        )
```

- [ ] **Step 4: Jalankan test untuk memastikan lulus**

Jalankan: `python -m pytest tests/test_doc_model_builder.py -v`
Harapan: seluruh 8 test LULUS.

- [ ] **Step 5: Jalankan seluruh test dan linter**

Jalankan: `python -m pytest -q`
Harapan: seluruh test lama tetap hijau. `generate_from_tables` belum diubah, sehingga jalur lama
masih utuh.

Jalankan: `python -m ruff check app tests`

- [ ] **Step 6: Periksa ukuran berkas**

Jalankan: `python -c "print(sum(1 for _ in open('app/services/doc_generator.py', encoding='utf-8')))"`

Bila hasilnya melewati 400 baris, catat di laporan task sebagai calon pemecahan berikutnya. Batas
keras 800 belum terlampaui, sehingga tidak menghentikan pekerjaan.

- [ ] **Step 7: Siapkan commit**

```bash
git add v2/msf-db/backend/app/services/doc_generator.py v2/msf-db/backend/tests/test_doc_model_builder.py
```

```
feat: bangun DocumentModel dengan rantai pengisian deskripsi

Komentar database dipakai lebih dulu dan kolom yang memilikinya tidak
pernah ditanyakan ke AI. Keluaran AI menjadi pilihan kedua, metadata
menjadi cadangan terakhir.
```

---

## Task 10: Renderer Markdown dari DocumentModel

Memindahkan penyusunan Markdown keluar dari `DocGenerator`. Keluaran wajib tetap setara dengan
sekarang supaya test Task 1 tetap berlaku.

**Files:**
- Create: `backend/app/services/renderers/__init__.py`
- Create: `backend/app/services/renderers/markdown_renderer.py`
- Create: `backend/tests/test_markdown_renderer.py`

**Interfaces:**
- Consumes: `DocumentModel` dari Task 7.
- Produces: `render_markdown(model: DocumentModel, language: str, detail_level: str) -> str`.
  Dipakai Task 11.

- [ ] **Step 1: Tulis test yang gagal**

Buat `backend/tests/test_markdown_renderer.py`:

```python
"""Renderer menerjemahkan model menjadi Markdown tanpa menambah isi."""

from app.services.doc_model import SUMBER_AI, ColumnDoc, DocumentModel, TableDoc
from app.services.renderers.markdown_renderer import render_markdown


def model_contoh(jumlah_tabel=1):
    tabel = [
        TableDoc(
            name=f"t_uji_{i}",
            schema="public",
            comment="Catatan dari DBA.",
            summary="Menyimpan data uji.",
            columns=[
                ColumnDoc(
                    no=1,
                    name="id",
                    data_type_label="bigint",
                    description="Nomor identitas.",
                    source=SUMBER_AI,
                )
            ],
        )
        for i in range(jumlah_tabel)
    ]
    return DocumentModel(
        project_name="Proyek Uji", generated_at="11 August 2026", tables=tabel
    )


def test_judul_dan_jumlah_tabel_muncul():
    hasil = render_markdown(model_contoh(), "Indonesian", "detailed")

    assert "# Proyek Uji" in hasil
    assert "**Total Tabel:** 1" in hasil


def test_nama_tabel_menjadi_heading_tingkat_dua():
    hasil = render_markdown(model_contoh(), "Indonesian", "detailed")

    assert "## Tabel: `t_uji_0`" in hasil


def test_deskripsi_kolom_masuk_ke_sel_tabel():
    hasil = render_markdown(model_contoh(), "Indonesian", "detailed")

    assert "| `id` | `bigint` |" in hasil
    assert "Nomor identitas." in hasil


def test_komentar_tabel_muncul_sebagai_catatan():
    hasil = render_markdown(model_contoh(), "Indonesian", "detailed")

    assert "Catatan dari DBA." in hasil


def test_dokumen_tanpa_tabel_tidak_melempar_error():
    kosong = DocumentModel(project_name="Kosong", generated_at="11 August 2026")

    hasil = render_markdown(kosong, "Indonesian", "detailed")

    assert "Tidak ada tabel yang ditemukan" in hasil


def test_bahasa_inggris_memakai_label_inggris():
    hasil = render_markdown(model_contoh(), "English", "detailed")

    assert "**Total Tables:** 1" in hasil
    assert "## Table: `t_uji_0`" in hasil


def test_deskripsi_tidak_pernah_memuat_baris_baru():
    """Baris baru di dalam sel akan merusak tabel Markdown."""
    hasil = render_markdown(model_contoh(), "Indonesian", "detailed")

    baris_tabel = [b for b in hasil.splitlines() if b.startswith("| `id`")]

    assert len(baris_tabel) == 1
```

- [ ] **Step 2: Jalankan test untuk memastikan gagal**

Jalankan: `python -m pytest tests/test_markdown_renderer.py -v`
Harapan: GAGAL dengan `ModuleNotFoundError`.

- [ ] **Step 3: Buat paket renderer**

Buat `backend/app/services/renderers/__init__.py` berisi satu baris:

```python
"""Renderer mengubah DocumentModel menjadi bentuk keluaran tertentu."""
```

- [ ] **Step 4: Tulis renderer**

Buat `backend/app/services/renderers/markdown_renderer.py`:

```python
"""DocumentModel menjadi Markdown. Dipakai untuk preview job dan ekspor PDF."""

from app.services.doc_model import DocumentModel, TableDoc

_LABEL = {
    "Indonesian": {
        "total": "**Total Tabel:**",
        "tanggal": "**Tanggal Generate:**",
        "daftar": "## Daftar Tabel",
        "tabel": "Tabel",
        "kolom": "### Kolom",
        "header": "| Kolom | Tipe Data | Keterangan |",
        "pemisah": "|-------|-----------|------------|",
        "relasi": "### Relasi (Foreign Key)",
        "index": "### Index",
        "ringkasan": "## Ringkasan Relasi Antar Tabel",
        "catatan": "Catatan skema",
        "kosong": "# Dokumentasi Database\n\n*Tidak ada tabel yang ditemukan.*",
    },
    "English": {
        "total": "**Total Tables:**",
        "tanggal": "**Generated:**",
        "daftar": "## Table of Contents",
        "tabel": "Table",
        "kolom": "### Columns",
        "header": "| Column | Data Type | Notes |",
        "pemisah": "|--------|-----------|-------|",
        "relasi": "### Relationships (Foreign Keys)",
        "index": "### Indexes",
        "ringkasan": "## Table Relationships Summary",
        "catatan": "Schema note",
        "kosong": "# Database Documentation\n\n*No tables found.*",
    },
}


def _label(language: str) -> dict:
    return _LABEL.get(language, _LABEL["Indonesian"])


def render_markdown(
    model: DocumentModel, language: str = "Indonesian", detail_level: str = "detailed"
) -> str:
    """Susun seluruh dokumen. Renderer tidak pernah menambah isi baru."""
    label = _label(language)
    if not model.tables:
        return label["kosong"]

    bagian = [_render_header(model, label)]
    for tabel in model.tables:
        bagian.append(_render_tabel(tabel, label, detail_level))

    if detail_level in ("detailed", "comprehensive") and len(model.tables) > 1:
        ringkasan = _render_ringkasan_relasi(model, label)
        if ringkasan:
            bagian.append(ringkasan)

    return "\n\n---\n\n".join(bagian)


def _render_header(model: DocumentModel, label: dict) -> str:
    daftar = "\n".join(
        f"- [{t.name}](#{t.name.lower().replace(' ', '-')})" for t in model.tables
    )
    deskripsi = f"\n\n{model.project_description}" if model.project_description else ""
    return (
        f"# {model.project_name}{deskripsi}\n\n"
        f"{label['tanggal']} {model.generated_at}\n"
        f"{label['total']} {len(model.tables)}\n\n"
        f"{label['daftar']}\n\n{daftar}"
    )


def _render_tabel(tabel: TableDoc, label: dict, detail_level: str) -> str:
    bagian = [f"## {label['tabel']}: `{tabel.name}`"]

    if tabel.comment:
        bagian.append(f"> {label['catatan']}: {tabel.comment.strip()}")
    if tabel.summary:
        bagian.append(tabel.summary)

    baris = [label["header"], label["pemisah"]]
    for kolom in tabel.columns:
        baris.append(
            f"| `{kolom.name}` | `{kolom.data_type_label}` | {kolom.description} |"
        )
    bagian.append(label["kolom"] + "\n\n" + "\n".join(baris))

    if tabel.foreign_keys:
        garis = []
        for fk in tabel.foreign_keys:
            teks = f"- `{fk.column}` -> `{fk.references_table}.{fk.references_column}`"
            if fk.on_delete:
                teks += f" _(ON DELETE {fk.on_delete})_"
            garis.append(teks)
        bagian.append(label["relasi"] + "\n\n" + "\n".join(garis))

    if tabel.indexes and detail_level == "comprehensive":
        garis = []
        for idx in tabel.indexes:
            kolom_idx = ", ".join(f"`{c}`" for c in idx.columns)
            unik = " _(UNIQUE)_" if idx.is_unique else ""
            garis.append(f"- **{idx.name}**: {kolom_idx}{unik}")
        bagian.append(label["index"] + "\n\n" + "\n".join(garis))

    return "\n\n".join(bagian)


def _render_ringkasan_relasi(model: DocumentModel, label: dict) -> str:
    garis = []
    for tabel in model.tables:
        for fk in tabel.foreign_keys:
            garis.append(
                f"- `{tabel.name}.{fk.column}` -> "
                f"`{fk.references_table}.{fk.references_column}`"
            )
    if not garis:
        return ""
    return label["ringkasan"] + "\n\n" + "\n".join(garis)
```

- [ ] **Step 5: Jalankan test untuk memastikan lulus**

Jalankan: `python -m pytest tests/test_markdown_renderer.py -v`
Harapan: seluruh 7 test LULUS.

- [ ] **Step 6: Jalankan seluruh test dan linter**

Jalankan: `python -m pytest -q`
Jalankan: `python -m ruff check app tests`

- [ ] **Step 7: Siapkan commit**

```bash
git add v2/msf-db/backend/app/services/renderers/ v2/msf-db/backend/tests/test_markdown_renderer.py
```

```
feat: renderer Markdown membaca DocumentModel

Penyusunan Markdown dipindah keluar dari DocGenerator sehingga satu
isi dapat dirender ke lebih dari satu bentuk keluaran.
```

---

## Task 11: Sambungkan jalur baru dan tambahkan structure_template

Task terakhir. Jalur generate memakai model dan renderer baru, dan field `structure_template`
diperkenalkan dengan bawaan yang menjaga kompatibilitas.

**Files:**
- Modify: `backend/app/models/schemas.py`
- Modify: `backend/app/services/doc_generator.py`
- Modify: `backend/app/routers/generate.py:27-45`, `:152-161`, `:227-236`
- Create: `backend/tests/test_structure_template.py`
- Modify: `backend/tests/test_doc_generator.py`

**Interfaces:**
- Consumes: `build_document_model` dari Task 9, `render_markdown` dari Task 10.
- Produces: `StructureTemplate` Enum pada `schemas.py`, dan `GenerateSettings.structure_template`.

- [ ] **Step 1: Tulis test yang gagal**

Buat `backend/tests/test_structure_template.py`:

```python
"""Field baru tidak boleh memecahkan request maupun job yang sudah ada."""

import pytest
from pydantic import ValidationError

from app.models.schemas import GenerateSettings, StructureTemplate


def test_bawaan_standard_menjaga_kompatibilitas():
    setting = GenerateSettings()

    assert setting.structure_template == StructureTemplate.STANDARD


def test_nilai_di_luar_enum_ditolak():
    """Endpoint publik tanpa auth; bentuk bebas tidak boleh diterima."""
    with pytest.raises(ValidationError):
        GenerateSettings(structure_template="../../etc/passwd")


def test_request_tanpa_field_tetap_valid():
    setting = GenerateSettings(project_name="Proyek Lama")

    assert setting.project_name == "Proyek Lama"
    assert setting.structure_template == StructureTemplate.STANDARD


def test_kedua_router_meneruskan_structure_template():
    import inspect

    from app.routers import generate as modul

    sumber = inspect.getsource(modul)

    assert sumber.count('"structure_template": payload.structure_template') == 2
```

- [ ] **Step 2: Jalankan test untuk memastikan gagal**

Jalankan: `python -m pytest tests/test_structure_template.py -v`
Harapan: GAGAL dengan `ImportError` karena `StructureTemplate` belum ada.

- [ ] **Step 3: Tambahkan Enum dan field**

Di `backend/app/models/schemas.py`, tambahkan setelah `DetailLevel`:

```python
class StructureTemplate(str, Enum):
    """
    Bentuk struktur dokumen.

    Enum tertutup, bukan string bebas: endpoint generate dapat diakses
    anonim, dan nilai ini kelak memilih berkas template. Nilai dari
    request tidak boleh pernah menyentuh path berkas.
    """

    STANDARD = "standard"
```

Tambahkan pada `GenerateSettings` setelah `detail_level`:

```python
    structure_template: StructureTemplate = StructureTemplate.STANDARD
```

- [ ] **Step 4: Teruskan dari kedua router**

Di `backend/app/routers/generate.py`, tambahkan ke **kedua** dict `settings`:

```python
        "structure_template": payload.structure_template,
```

- [ ] **Step 5: Alihkan generate_from_tables ke jalur baru**

Di `backend/app/services/doc_generator.py`, tambahkan impor:

```python
from app.services.renderers.markdown_renderer import render_markdown
```

Ganti isi `generate_from_tables` menjadi pembungkus tipis. Method lama `_generate_table_doc`,
`_build_header`, `_build_columns_table`, `_build_fk_section`, `_build_index_section`,
`_build_relations_summary`, `_build_prompt`, dan `_fallback_table_doc` **dihapus**, karena
tanggung jawabnya sudah pindah ke Task 9 dan 10:

```python
    async def generate_from_tables(
        self, tables, project_name: str, job=None
    ) -> str:
        """Bangun model lalu render menjadi Markdown."""
        model = await self.build_document_model(tables, project_name, job=job)
        markdown = render_markdown(model, self.language, self.detail_level)

        if job:
            preview = (
                markdown[:2000] + "\n\n..." if len(markdown) > 2000 else markdown
            )
            job.update(preview_markdown=preview)

        logger.info(
            "Dokumen selesai dibangun",
            tabel=len(model.tables),
            sumber=model.ringkasan_sumber(),
        )
        return markdown
```

- [ ] **Step 6: Sesuaikan test Task 1 yang bergantung pada perilaku lama**

Dua test pada `tests/test_doc_generator.py` menguji perilaku yang sengaja berubah dan harus
disesuaikan:

`test_prompt_memuat_nama_dan_kolom_tabel` — prompt kini meminta baris per kolom. Ganti badan
assert-nya menjadi:

```python
    assert "trx_pembayaran" in provider.prompt_terakhir
    assert "nasabah_id" in provider.prompt_terakhir
    assert "RINGKASAN:" in provider.prompt_terakhir
```

`test_kegagalan_ai_tidak_membatalkan_dokumen` — kini tabel tetap terbit lewat rantai fallback, bukan
lewat blok catatan. Tambahkan:

```python
    assert "Primary key" in hasil
```

Enam test lainnya pada berkas itu wajib **lulus tanpa diubah**. Bila ada yang gagal, keluaran
renderer belum setara dengan keluaran lama dan itu harus diperbaiki di renderer, bukan di test.

- [ ] **Step 7: Jalankan seluruh test dan linter**

Jalankan: `python -m pytest -q`
Harapan: seluruh test lulus, termasuk 90 test lama.

Jalankan: `python -m ruff check app tests`

- [ ] **Step 8: Verifikasi ukuran berkas**

Jalankan: `python -c "print(sum(1 for _ in open('app/services/doc_generator.py', encoding='utf-8')))"`
Harapan: turun jauh di bawah 400 baris, karena seluruh builder sudah pindah ke renderer.

- [ ] **Step 9: Perbarui dokumentasi**

- `dev-docs/CHANGELOG.md`: catat kontrak keluaran AI per kolom dan pengenalan `structure_template`
- `dev-docs/ai/CURRENT_STATE.md`: jumlah test dan status modul
- `dev-docs/ai/MODULE_MAP.md`: tambahkan `doc_model.py`, `ai_column_parser.py`, `renderers/`
- `dev-docs/ai/TASKS.md`: tandai Batch 1-3 selesai, Batch 4 menunggu izin dependensi
- `dev-docs/COMMIT_LOG.md` dan `dev-docs/commit-logs/YYYY-MM-DD.md`
- `reports/task/YYYY-MM-DD-batch-1-3-dokumentasi.md`
- **Usulkan** perubahan `backend/README.md` kepada pengguna, jangan langsung menerapkannya
  (AGENTS.md §1 poin 8)

- [ ] **Step 10: Siapkan commit**

```bash
git add v2/msf-db/backend/app v2/msf-db/backend/tests v2/msf-db/dev-docs v2/msf-db/reports
```

```
feat: alihkan generate ke DocumentModel dan renderer

generate_from_tables kini membangun model lalu merendernya. Builder
lama dihapus karena tanggung jawabnya sudah pindah. Field
structure_template diperkenalkan dengan bawaan standard sehingga job
dan request lama tidak terpengaruh.
```

---

## Setelah Task 11

Batch 1-3 selesai. Keadaan yang dicapai:

- Deskripsi kolom berlandaskan komentar database bila tersedia
- Nama kolom karangan tidak pernah masuk dokumen
- Keluaran dapat direproduksi dengan `AI_SEED`
- Heading liar tidak lagi mungkin merusak hierarki, karena deskripsi masuk sel tabel
- Endpoint pelacakan job memiliki rate limit
- Struktur kode siap menerima renderer kedua

**Batch 4 belum dapat dimulai** sampai pengguna memberi izin menambah `docxtpl` (AGENTS.md §6) dan
mengonfirmasi bentuk TSD sebagai target keluaran. Rencana tersendiri disusun setelah itu.

**Yang tetap terbuka dan sengaja tidak dikerjakan di rencana ini:**

| Butir | Sumber | Alasan ditunda |
| --- | --- | --- |
| Payload `from-ddl` dicatat utuh ke log termasuk `sql_content` | spec §9.7 | Di luar jalur kritis fitur. Diusulkan sebagai batch tersendiri agar tidak mencampur perbaikan dengan fitur (AGENTS.md §3B) |
| `MAX_TABLES_PER_REQUEST` masih 50 | spec §9.6 | Disengaja. Menaikkannya di repo melemahkan kontrol antrean pada endpoint publik tanpa auth. Kenaikan hanya lewat env di deployment yang membutuhkannya |
| Views dan Functions masih dibuang | spec §1.2 | Tidak diperlukan bentuk TSD. Ditunda sampai ada kebutuhan nyata |
| `MSF_API_KEY` masih kosong, seluruh endpoint anonim | spec §9.9 | Di luar cakupan. Seluruh mitigasi di rencana ini berdiri di atas asumsi penyerang anonim |

Sebelum merge `dev` ke `main`, jalankan Security Pre-Merge Checklist
`ai-rules/security/part-i-security-pre-merge-checklist.md` sesuai spec §9.10.
