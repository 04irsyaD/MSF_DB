# Rencana Implementasi — Template TSD dengan docxtpl (Batch 4)

> **Untuk pekerja agentik:** REQUIRED SUB-SKILL: gunakan superpowers:subagent-driven-development
> (disarankan) atau superpowers:executing-plans untuk mengerjakan rencana ini task demi task.
> Langkah memakai sintaks checkbox (`- [ ]`) untuk pelacakan.

**Goal:** Menghasilkan dokumen DOCX berbentuk Technical Specification Document dengan mengisi
template Word aslinya, bukan membangun ulang tampilannya.

**Architecture:** `DocumentModel` dari Batch 3 dirender lewat `docxtpl`, yaitu Jinja2 di dalam
berkas Word. Template asli yang menjadi dokumen keluarannya, sehingga sampul, kop, header, footer,
penomoran, dan seluruh gaya bertahan tanpa satu baris kode pun yang menirunya.

**Tech Stack:** Python 3.11, `docxtpl`, Jinja2 sandbox, `python-docx` 1.1.2, pytest, ruff.

**Sumber:** `planning/spec-template-dokumentasi-tsd.md` Batch 4, dan pelajaran dari 43 skrip
percobaan v1 di `AI OLLMA/summary/scripts/`.

## Global Constraints

Berlaku untuk setiap task tanpa perlu diulang.

- Bekerja **hanya** di branch `dev`. Dilarang commit maupun push ke `main` (AGENTS.md §1 poin 1-2).
- **AI tidak menjalankan `git commit` maupun `git push`.** AI menyiapkan perubahan beserta teks
  pesan commit; eksekusi oleh human developer (`dev-docs/ai/CURRENT_STATE.md` §1b).
- Satu task menghasilkan satu commit (AGENTS.md §1 poin 5).
- Dilarang emoji di kode maupun dokumentasi. `test_tanpa_emoji.py` memindai seluruh `app/` dan akan
  menangkapnya secara otomatis.
- Batas ukuran berkas: Service maksimal 800 baris, rekomendasi 400.
- **Template hanya berasal dari repositori.** Tidak ada endpoint upload template, sekarang maupun
  nanti (spec §9.1).
- **Nilai dari request tidak pernah menyentuh path berkas.** Pemetaan Enum ke nama berkas adalah
  konstanta di kode (spec §9.2).
- `ruff` wajib lulus pada berkas yang disentuh; 195 test yang ada wajib tetap hijau.
- Bahasa komentar dan nama test mengikuti berkas sekitarnya: Bahasa Indonesia.

**Perintah verifikasi baku**, dijalankan dari `v2/msf-db/backend`:

```bash
./.venv/Scripts/python.exe -m pytest -q
```

```bash
./.venv/Scripts/python.exe -m ruff check app tests
```

Container `msf2-backend` tidak mem-bind-mount kode aplikasi, sehingga verifikasi memakai venv lokal.

---

## GERBANG: dua izin yang wajib ada sebelum Task 1

Rencana ini **tidak boleh dimulai** sebelum keduanya diberikan pengguna.

1. **Izin menambah dependensi `docxtpl` beserta `jinja2`** (AGENTS.md §6, spec §13 asumsi 2).
2. **Konfirmasi bahwa bentuk TSD adalah target keluaran yang diinginkan** (spec §13 asumsi 1).
   Seluruh rencana ini bertumpu padanya.

Batch 1 sampai 3 sudah selesai dan tidak bergantung pada gerbang ini.

---

## Temuan yang mengubah rencana sebelum ditulis

### `.gitignore` akan menelan templatenya

`v2/msf-db/.gitignore` baris 32 memuat `*.docx`, dan `.gitignore` root baris 77 juga. Berkas
template yang diletakkan di `backend/templates/` karena itu **diabaikan git secara diam-diam**.
Tanpa perbaikan, template tidak pernah masuk repositori, tidak pernah ikut ter-clone di server, dan
prinsip "template hanya dari repo" pada spec §9.1 runtuh tanpa satu pun pesan error.

Diverifikasi dengan:

```
git check-ignore -v v2/msf-db/backend/templates/contoh.docx
-> v2/msf-db/.gitignore:32:*.docx
```

Ditangani di Task 1.

### Tag Jinja tidak akan pecah karena disisipkan lewat kode

Risiko klasik `docxtpl` adalah Word memecah `{{ nama }}` menjadi beberapa run akibat autocorrect
atau pemeriksa ejaan, sehingga tag rusak. Risiko itu **hanya muncul bila tag diketik manusia di
Word**.

Rencana ini menyisipkan tag lewat `python-docx`, yang menulis satu run utuh per sel. Masalah
tersebut karena itu tidak berlaku, dan spec §8 baris pertama menjadi tidak relevan selama penyiapan
template tetap terskrip. Bila kelak seseorang menyunting template di Word, risiko itu kembali.

### Struktur template sudah dipetakan

Dari inspeksi read-only `AI OLLMA/summary/template/template_dokumentasi.docx`:

| Unsur | Jumlah | Peran |
| --- | --- | --- |
| Tabel `No · Nama Tabel · Deskripsi Tabel` | 1, berisi 120 baris | Daftar induk, satu baris per tabel database |
| Tabel `No · Nama Field · Tipe Data · Deskripsi Field` | 109 | Satu per tabel database |
| Heading 3 `3.4.N Tabel t_XXX` | 114 | Judul tiap seksi per tabel |
| Gambar | 25, satu berukuran 5,2 MB | 14 diagram ERD dan aset kop |
| Textbox, content control, placeholder | 0 | Tidak ada elemen tersembunyi |

---

## Peta berkas

| Berkas | Tanggung jawab | Task |
| --- | --- | --- |
| `v2/msf-db/.gitignore` | Negasi agar template dapat masuk repo | 1 |
| `backend/requirements.txt` | Dependensi `docxtpl` dengan versi dipin | 1 |
| `backend/scripts/siapkan_template_tsd.py` | Skrip sekali jalan: dokumen jadi menjadi template | 2 |
| `backend/templates/tsd.docx` | Template hasil penyiapan | 2 |
| `backend/app/services/renderers/docx_template_renderer.py` | `DocumentModel` menjadi DOCX | 3 |
| `backend/app/models/schemas.py` | Nilai Enum `MSF_TSD` | 4 |
| `backend/app/routers/generate.py` | Memilih renderer sesuai `structure_template` | 4 |
| `backend/docs/operations/document-templates.md` | Prosedur server | 5 |
| `dev-docs/decisions/006-template-docx-docxtpl.md` | ADR-006 | 5 |

---

## Task 1: Buka gerbang dependensi dan git

Task ini tidak menghasilkan fitur, tetapi tanpanya tiga task berikutnya tidak dapat diverifikasi.

**Files:**
- Modify: `v2/msf-db/.gitignore`
- Modify: `backend/requirements.txt`
- Create: `backend/tests/test_template_tersedia.py`

**Interfaces:**
- Produces: paket `docxtpl` dapat diimpor; berkas `.docx` di `backend/templates/` dapat di-track git.

- [ ] **Step 1: Verifikasi kompatibilitas sebelum memasang apa pun**

Jalankan:

```bash
./.venv/Scripts/python.exe -m pip install --dry-run docxtpl
```

Harapan: resolusi berhasil **tanpa** menurunkan atau menaikkan `python-docx` dari 1.1.2. Bila
penyelesai meminta versi `python-docx` yang berbeda, **hentikan task ini** dan laporkan ke pengguna;
mengubah pustaka inti memerlukan izin terpisah (AGENTS.md §6).

- [ ] **Step 2: Tulis test yang gagal**

Buat `backend/tests/test_template_tersedia.py`:

```python
"""Prasyarat Batch 4: dependensi ada, dan template tidak ditelan .gitignore."""

import subprocess
from pathlib import Path

AKAR_REPO = Path(__file__).resolve().parents[4]
TEMPLATE_REPO = "v2/msf-db/backend/templates/tsd.docx"


def test_docxtpl_dapat_diimpor():
    import docxtpl

    assert hasattr(docxtpl, "DocxTemplate")


def test_python_docx_tetap_di_versi_terkunci():
    """docxtpl tidak boleh diam-diam menggeser pustaka inti."""
    import docx

    assert docx.__version__ == "1.1.2"


def test_template_tidak_diabaikan_git():
    """
    .gitignore memuat *.docx. Tanpa negasi, template tidak pernah masuk repo
    dan prinsip template-hanya-dari-repo runtuh tanpa pesan error apa pun.
    """
    hasil = subprocess.run(
        ["git", "check-ignore", TEMPLATE_REPO],
        cwd=AKAR_REPO,
        capture_output=True,
        text=True,
    )

    assert hasil.returncode != 0, f"{TEMPLATE_REPO} diabaikan git"
```

- [ ] **Step 3: Jalankan test untuk memastikan gagal**

Jalankan: `./.venv/Scripts/python.exe -m pytest tests/test_template_tersedia.py -v`
Harapan: `test_docxtpl_dapat_diimpor` GAGAL dengan `ModuleNotFoundError`, dan
`test_template_tidak_diabaikan_git` GAGAL karena aturan `*.docx` masih berlaku.

- [ ] **Step 4: Tambahkan negasi .gitignore**

Di `v2/msf-db/.gitignore`, tepat setelah baris `*.docx`, sisipkan:

```gitignore
# Template dokumen WAJIB masuk repo. Prinsip keamanan pada
# planning/spec-template-dokumentasi-tsd.md section 9.1 mensyaratkan template
# hanya berasal dari repositori, tidak pernah dari unggahan pengguna. Tanpa
# negasi ini, aturan *.docx di atas menelannya tanpa pesan error apa pun.
!backend/templates/*.docx
```

- [ ] **Step 5: Tambahkan dependensi**

Di `backend/requirements.txt`, pada bagian DOCUMENT GENERATION, setelah baris `python-docx`:

```
docxtpl==0.16.8                 # Jinja2 di dalam Word; mengisi template, bukan menirunya
```

Versi disesuaikan dengan hasil Step 1 bila penyelesai memilih versi lain yang tetap menjaga
`python-docx==1.1.2`.

Pasang:

```bash
./.venv/Scripts/python.exe -m pip install -r requirements.txt
```

- [ ] **Step 6: Jalankan test untuk memastikan lulus**

Jalankan: `./.venv/Scripts/python.exe -m pytest tests/test_template_tersedia.py -v`
Harapan: `test_docxtpl_dapat_diimpor` dan `test_python_docx_tetap_di_versi_terkunci` LULUS.
`test_template_tidak_diabaikan_git` LULUS karena negasi sudah berlaku, meskipun berkasnya belum ada
— `git check-ignore` menilai aturan, bukan keberadaan berkas.

- [ ] **Step 7: Jalankan seluruh test dan linter**

Jalankan: `./.venv/Scripts/python.exe -m pytest -q`
Jalankan: `./.venv/Scripts/python.exe -m ruff check app tests`

- [ ] **Step 8: Siapkan commit**

```bash
git add v2/msf-db/.gitignore v2/msf-db/backend/requirements.txt v2/msf-db/backend/tests/test_template_tersedia.py
```

```
chore: tambah docxtpl dan izinkan template docx masuk repo

.gitignore memuat *.docx sehingga template akan diabaikan secara
diam-diam. Negasi ditambahkan karena template wajib berasal dari
repo, tidak pernah dari unggahan pengguna.
```

---

## Task 2: Ubah dokumen TSD menjadi template

Ini task paling rawan. Dokumen sumber adalah TSD terisi penuh berukuran 8 MB tanpa satu pun
placeholder. Yang dibutuhkan adalah kerangka dengan satu contoh seksi sebagai badan perulangan.

Pekerjaan dilakukan lewat skrip, bukan penyuntingan manual di Word, karena dua alasan: hasilnya
dapat diulang bila template sumber diperbarui, dan tag yang disisipkan lewat `python-docx` selalu
mendarat dalam satu run sehingga tidak pernah pecah.

**Files:**
- Create: `backend/scripts/siapkan_template_tsd.py`
- Create: `backend/templates/tsd.docx` (keluaran skrip)
- Create: `backend/tests/test_template_tsd.py`

**Interfaces:**
- Produces: `backend/templates/tsd.docx` dengan variabel `project_name`, `generated_at`, `author`,
  dan perulangan atas `tables`, tiap `t` memiliki `name`, `summary`, dan `columns` berisi `no`,
  `name`, `data_type_label`, `description`.

- [ ] **Step 1: Tulis test yang gagal**

Buat `backend/tests/test_template_tsd.py`:

```python
"""Template TSD wajib berupa kerangka, bukan dokumen terisi."""

from pathlib import Path

import pytest

TEMPLATE = Path(__file__).resolve().parent.parent / "templates" / "tsd.docx"


@pytest.fixture(scope="module")
def dokumen():
    if not TEMPLATE.exists():
        pytest.skip("templates/tsd.docx belum dibuat")
    from docx import Document

    return Document(str(TEMPLATE))


def _teks_penuh(dokumen) -> str:
    bagian = [p.text for p in dokumen.paragraphs]
    for tabel in dokumen.tables:
        for baris in tabel.rows:
            bagian.extend(sel.text for sel in baris.cells)
    return "\n".join(bagian)


def test_ukuran_template_wajar():
    """Sumbernya 8 MB. Template yang masih membawa gambar berat akan
    memperbesar setiap dokumen hasil generate."""
    if not TEMPLATE.exists():
        pytest.skip("templates/tsd.docx belum dibuat")

    assert TEMPLATE.stat().st_size < 2_000_000


def test_seksi_per_tabel_hanya_tersisa_satu(dokumen):
    """109 seksi berulang harus menyusut menjadi satu badan perulangan."""
    header_field = [
        t
        for t in dokumen.tables
        if t.rows and [s.text.strip() for s in t.rows[0].cells][:2]
        == ["No", "Nama Field"]
    ]

    assert len(header_field) == 1


def test_tabel_induk_hanya_menyisakan_satu_baris_data(dokumen):
    induk = [
        t
        for t in dokumen.tables
        if t.rows and [s.text.strip() for s in t.rows[0].cells][:2]
        == ["No", "Nama Tabel"]
    ]

    assert len(induk) == 1
    assert len(induk[0].rows) == 2


def test_tag_perulangan_terpasang(dokumen):
    teks = _teks_penuh(dokumen)

    assert "{%tr for" in teks
    assert "{%tr endfor %}" in teks
    assert "{% for t in tables %}" in teks or "{%p for t in tables %}" in teks


def test_variabel_utama_terpasang(dokumen):
    teks = _teks_penuh(dokumen)

    for variabel in ("project_name", "generated_at"):
        assert "{{ " + variabel + " }}" in teks


def test_tag_tidak_pecah_antar_run(dokumen):
    """
    Tag yang terbelah beberapa run membuat render gagal. Penyisipan lewat
    python-docx mencegahnya; test ini menjaga agar penyuntingan manual di
    Word tidak merusaknya tanpa ketahuan.
    """
    for paragraf in dokumen.paragraphs:
        if "{%" in paragraf.text or "{{" in paragraf.text:
            utuh = any(
                "{%" in run.text or "{{" in run.text for run in paragraf.runs
            )
            assert utuh, f"tag pecah antar run: {paragraf.text[:60]}"


def test_data_nyata_sudah_dibuang(dokumen):
    """Nama tabel dari dokumen sumber tidak boleh tertinggal di template."""
    teks = _teks_penuh(dokumen)

    assert "t_ChainAnalysis" not in teks
    assert "t_BusinessUnit" not in teks
```

- [ ] **Step 2: Jalankan test untuk memastikan gagal**

Jalankan: `./.venv/Scripts/python.exe -m pytest tests/test_template_tsd.py -v`
Harapan: seluruhnya DILEWATI karena `templates/tsd.docx` belum ada. Skip di sini sah: berkasnya
memang belum dibuat, dan test menjadi aktif otomatis setelah Step 4.

- [ ] **Step 3: Tulis skrip penyiapan**

Buat `backend/scripts/siapkan_template_tsd.py`:

```python
"""
Ubah dokumen TSD terisi menjadi template docxtpl. Dijalankan manual, sekali,
atau diulang bila dokumen sumber diperbarui.

Pendekatannya sengaja mengisi template aslinya, bukan membangun ulang
tampilannya. Percobaan v1 di AI OLLMA/summary/scripts/ menghasilkan 43 skrip
karena menempuh jalur replikasi: mencocokkan font, border, dan lebar kolom
satu per satu lewat XML mentah, pekerjaan yang tidak pernah selesai.

Pakai:
    python scripts/siapkan_template_tsd.py <sumber.docx> <keluaran.docx>
"""

import sys
from pathlib import Path

from docx import Document

HEADER_FIELD = ["No", "Nama Field", "Tipe Data", "Deskripsi Field"]
HEADER_INDUK = ["No", "Nama Tabel", "Deskripsi Tabel"]


def _header(tabel) -> list:
    if not tabel.rows:
        return []
    return [sel.text.strip() for sel in tabel.rows[0].cells]


def _buang(elemen) -> None:
    elemen.getparent().remove(elemen)


def _tulis_sel(sel, teks: str) -> None:
    """Menulis satu run utuh sehingga tag Jinja tidak pernah pecah."""
    sel.text = ""
    sel.paragraphs[0].add_run(teks)


def siapkan(sumber: Path, keluaran: Path) -> None:
    dokumen = Document(str(sumber))

    tabel_field = [t for t in dokumen.tables if _header(t) == HEADER_FIELD]
    tabel_induk = [t for t in dokumen.tables if _header(t) == HEADER_INDUK]

    if not tabel_field or not tabel_induk:
        raise SystemExit("Struktur tabel tidak dikenali; periksa dokumen sumber.")

    print(f"Ditemukan {len(tabel_field)} tabel field, {len(tabel_induk)} tabel induk.")

    # Sisakan tabel field pertama sebagai badan perulangan.
    for tabel in tabel_field[1:]:
        _buang(tabel._tbl)

    contoh = tabel_field[0]
    for baris in list(contoh.rows[2:]):
        _buang(baris._tr)
    sel = contoh.rows[1].cells
    _tulis_sel(sel[0], "{%tr for c in t.columns %}{{ c.no }}")
    _tulis_sel(sel[1], "{{ c.name }}")
    _tulis_sel(sel[2], "{{ c.data_type_label }}")
    _tulis_sel(sel[3], "{{ c.description }}{%tr endfor %}")

    # Tabel induk: sisakan satu baris data sebagai badan perulangan.
    induk = tabel_induk[0]
    for baris in list(induk.rows[2:]):
        _buang(baris._tr)
    sel = induk.rows[1].cells
    _tulis_sel(sel[0], "{%tr for t in tables %}{{ loop.index }}")
    _tulis_sel(sel[1], "{{ t.name }}")
    _tulis_sel(sel[2], "{{ t.summary }}{%tr endfor %}")

    # Heading seksi per tabel: sisakan satu, jadikan judul dinamis.
    heading = [
        p
        for p in dokumen.paragraphs
        if p.style.name == "Heading 3" and "Tabel" in p.text
    ]
    print(f"Ditemukan {len(heading)} heading seksi per tabel.")
    for paragraf in heading[1:]:
        _buang(paragraf._p)
    if heading:
        judul = heading[0]
        judul.text = ""
        judul.add_run("3.4.{{ loop.index }} Tabel {{ t.name }}")

    dokumen.save(str(keluaran))
    print(f"Template ditulis ke {keluaran}")
    print(
        "LANGKAH MANUAL WAJIB: buka di Word, sisipkan {%p for t in tables %} "
        "sebelum heading seksi dan {%p endfor %} setelah tabel field, lalu "
        "hapus gambar berat yang tidak diperlukan."
    )


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit(__doc__)
    siapkan(Path(sys.argv[1]), Path(sys.argv[2]))
```

- [ ] **Step 4: Jalankan skrip terhadap dokumen sumber**

```bash
./.venv/Scripts/python.exe scripts/siapkan_template_tsd.py "../../../AI OLLMA/summary/template/template_dokumentasi.docx" templates/tsd.docx
```

Harapan: laporan menyebut sekitar 109 tabel field dan sekitar 114 heading, lalu berkas tertulis.

- [ ] **Step 5: Selesaikan bagian yang harus dikerjakan manusia**

Dua hal tidak dapat diselesaikan skrip dengan aman dan **wajib dikerjakan pengguna di Word**:

1. Sisipkan paragraf `{%p for t in tables %}` tepat sebelum heading seksi per tabel, dan
   `{%p endfor %}` tepat setelah tabel field. Menyisipkan paragraf pada posisi yang benar di antara
   elemen body memerlukan penilaian visual terhadap tata letak.
2. Hapus gambar berat yang tidak diperlukan, terutama berkas 5,2 MB. Menentukan gambar mana yang
   tetap relevan adalah keputusan isi, bukan keputusan teknis.

Setelah itu simpan ulang dari Word. Test `test_tag_tidak_pecah_antar_run` akan menangkap bila Word
memecah tag yang diketik manual.

- [ ] **Step 6: Jalankan test untuk memastikan lulus**

Jalankan: `./.venv/Scripts/python.exe -m pytest tests/test_template_tsd.py -v`
Harapan: seluruh delapan test LULUS, tidak ada lagi yang dilewati.

Bila `test_ukuran_template_wajar` gagal, gambar berat belum dibuang. Bila
`test_data_nyata_sudah_dibuang` gagal, masih ada seksi dari dokumen sumber yang tertinggal.

- [ ] **Step 7: Jalankan seluruh test dan linter**

Jalankan: `./.venv/Scripts/python.exe -m pytest -q`
Jalankan: `./.venv/Scripts/python.exe -m ruff check app tests scripts`

- [ ] **Step 8: Siapkan commit**

```bash
git add v2/msf-db/backend/scripts/siapkan_template_tsd.py v2/msf-db/backend/templates/tsd.docx v2/msf-db/backend/tests/test_template_tsd.py
```

Periksa bahwa templatenya benar-benar ter-stage; bila tidak muncul, negasi `.gitignore` dari Task 1
belum berlaku.

```
feat: template TSD sebagai kerangka docxtpl

Dokumen TSD terisi diubah menjadi template dengan satu seksi contoh
sebagai badan perulangan. Skrip penyiapan disertakan agar dapat
diulang bila dokumen sumber diperbarui.
```

---

## Task 3: Renderer DOCX berbasis template

**Files:**
- Modify: `backend/app/models/schemas.py`
- Modify: `backend/tests/test_structure_template.py`
- Create: `backend/app/services/renderers/docx_template_renderer.py`
- Create: `backend/tests/test_docx_template_renderer.py`

**Interfaces:**
- Consumes: `DocumentModel`, `TableDoc`, `ColumnDoc` dari Batch 3.
- Produces: nilai enum `StructureTemplate.MSF_TSD`, dan
  `render_docx(model: DocumentModel, template: StructureTemplate, author: Optional[str]) -> bytes`.

**Kenapa nilai enum ditambahkan di sini, bukan di Task 4:** pemetaan `_BERKAS_TEMPLATE` di renderer
memerlukan `MSF_TSD` sebagai kunci, sehingga renderer tidak dapat ditulis maupun diuji tanpanya.
Menambahkan nilai enum lebih dulu tidak membuatnya dapat dipakai pengguna — router baru mengarahkan
ke renderer pada Task 4 — tetapi menghilangkan ketergantungan mundur antar task.

- [ ] **Step 1: Tulis test yang gagal**

Buat `backend/tests/test_docx_template_renderer.py`:

```python
"""Renderer mengisi template; keamanannya bertumpu pada sandbox dan enum."""

import pytest
from docx import Document

from app.models.schemas import StructureTemplate
from app.services.doc_model import SUMBER_AI, ColumnDoc, DocumentModel, TableDoc
from app.services.renderers import docx_template_renderer as modul
from app.services.renderers.docx_template_renderer import render_docx


def model_contoh():
    return DocumentModel(
        project_name="Proyek Uji",
        generated_at="11 August 2026",
        tables=[
            TableDoc(
                name="t_access",
                summary="Menyimpan hak akses.",
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
        ],
    )


def _template_kecil(tujuan, isi_tambahan=""):
    """Template fixture, bukan template TSD asli, agar test tetap cepat."""
    dokumen = Document()
    dokumen.add_paragraph("{{ project_name }}")
    dokumen.add_paragraph("{{ generated_at }}")
    if isi_tambahan:
        dokumen.add_paragraph(isi_tambahan)
    tabel = dokumen.add_table(rows=2, cols=2)
    tabel.rows[0].cells[0].text = "No"
    tabel.rows[0].cells[1].text = "Nama Tabel"
    tabel.rows[1].cells[0].text = "{%tr for t in tables %}{{ loop.index }}"
    tabel.rows[1].cells[1].text = "{{ t.name }}{%tr endfor %}"
    dokumen.save(str(tujuan))


@pytest.fixture
def templates_dir(tmp_path, monkeypatch):
    monkeypatch.setattr(modul, "TEMPLATES_DIR", str(tmp_path))
    return tmp_path


def _teks(data: bytes, tmp_path) -> str:
    berkas = tmp_path / "hasil.docx"
    berkas.write_bytes(data)
    dokumen = Document(str(berkas))
    bagian = [p.text for p in dokumen.paragraphs]
    for tabel in dokumen.tables:
        for baris in tabel.rows:
            bagian.extend(sel.text for sel in baris.cells)
    return "\n".join(bagian)


def test_variabel_dan_perulangan_terisi(templates_dir, tmp_path):
    _template_kecil(templates_dir / "tsd.docx")

    hasil = render_docx(model_contoh(), StructureTemplate.MSF_TSD)

    teks = _teks(hasil, tmp_path)
    assert "Proyek Uji" in teks
    assert "t_access" in teks


def test_template_tidak_ada_memberi_pesan_jelas(templates_dir):
    with pytest.raises(FileNotFoundError) as info:
        render_docx(model_contoh(), StructureTemplate.MSF_TSD)

    assert "tsd.docx" in str(info.value)


def test_template_tanpa_berkas_terpetakan_ditolak(templates_dir):
    """Nilai enum yang belum punya berkas tidak boleh jatuh ke path tebakan."""
    with pytest.raises(ValueError):
        render_docx(model_contoh(), StructureTemplate.STANDARD)


def test_ekspresi_berbahaya_diblokir_sandbox(templates_dir, tmp_path):
    """
    docxtpl menjalankan Jinja2. Tanpa sandbox, ekspresi di dalam template
    dapat menjangkau atribut internal Python.
    """
    from jinja2.exceptions import SecurityError

    _template_kecil(
        templates_dir / "tsd.docx",
        isi_tambahan="{{ project_name.__class__.__mro__ }}",
    )

    with pytest.raises(SecurityError):
        render_docx(model_contoh(), StructureTemplate.MSF_TSD)


def test_nilai_request_tidak_pernah_menyentuh_path():
    """Pemetaan enum ke nama berkas wajib konstan di kode."""
    import inspect

    sumber = inspect.getsource(modul)

    assert "os.path.join(TEMPLATES_DIR" not in sumber
    assert "_BERKAS_TEMPLATE" in sumber


def test_penulis_masuk_konteks(templates_dir, tmp_path):
    _template_kecil(templates_dir / "tsd.docx", isi_tambahan="{{ author }}")

    hasil = render_docx(model_contoh(), StructureTemplate.MSF_TSD, author="Irsyad")

    assert "Irsyad" in _teks(hasil, tmp_path)
```

Perbarui juga `backend/tests/test_structure_template.py`, menggantikan
`test_enum_hanya_memuat_nilai_yang_sudah_didukung` dari Batch 3:

```python
def test_enum_memuat_dua_nilai_yang_didukung():
    assert [t.value for t in StructureTemplate] == ["standard", "msf_tsd"]


def test_nilai_baru_diterima_generate_settings():
    setting = GenerateSettings(structure_template="msf_tsd")

    assert setting.structure_template == StructureTemplate.MSF_TSD
```

- [ ] **Step 2: Jalankan test untuk memastikan gagal**

Jalankan: `./.venv/Scripts/python.exe -m pytest tests/test_docx_template_renderer.py tests/test_structure_template.py -v`
Harapan: GAGAL dengan `ModuleNotFoundError` untuk renderer, dan `AttributeError` untuk
`StructureTemplate.MSF_TSD`.

- [ ] **Step 3: Tambahkan nilai enum**

Di `backend/app/models/schemas.py`, pada `StructureTemplate`:

```python
    STANDARD = "standard"
    MSF_TSD = "msf_tsd"
```

- [ ] **Step 4: Tulis renderer**

Buat `backend/app/services/renderers/docx_template_renderer.py`:

```python
"""
DocumentModel menjadi DOCX dengan mengisi template Word.

Template diperlakukan sebagai KODE, bukan data: hanya berasal dari
repositori, tidak pernah dari unggahan pengguna. docxtpl menjalankan Jinja2,
sehingga template yang dapat dikendalikan pengguna berarti eksekusi ekspresi
di server. Lihat planning/spec-template-dokumentasi-tsd.md section 9.1.
"""

import os
from io import BytesIO
from pathlib import Path
from typing import Optional

import structlog
from docxtpl import DocxTemplate
from jinja2.sandbox import SandboxedEnvironment

from app.models.schemas import StructureTemplate
from app.services.doc_model import DocumentModel

logger = structlog.get_logger()

TEMPLATES_DIR = os.getenv("TEMPLATES_DIR", "/app/templates")

# Pemetaan konstan. Nilai dari request TIDAK PERNAH dirangkai menjadi path,
# sehingga tidak ada jalan bagi "../" untuk menjangkau berkas lain.
_BERKAS_TEMPLATE = {
    StructureTemplate.MSF_TSD: "tsd.docx",
}


def _path_template(template: StructureTemplate) -> Path:
    nama = _BERKAS_TEMPLATE.get(template)
    if nama is None:
        raise ValueError(f"Template '{template}' tidak memiliki berkas terpetakan.")

    akar = Path(TEMPLATES_DIR).resolve()
    berkas = (akar / nama).resolve()

    # Lapis kedua: pastikan hasil resolusi tetap di dalam TEMPLATES_DIR.
    if akar != berkas.parent:
        raise ValueError("Path template keluar dari direktori template.")

    if not berkas.exists():
        raise FileNotFoundError(
            f"Berkas template '{nama}' tidak ditemukan di {akar}. "
            "Pada deployment Docker, direktori ini adalah bind mount; "
            "lihat backend/docs/operations/document-templates.md."
        )
    return berkas


def _konteks(model: DocumentModel, author: Optional[str]) -> dict:
    return {
        "project_name": model.project_name,
        "project_description": model.project_description or "",
        "generated_at": model.generated_at,
        "author": author or model.author or "",
        "tables": model.tables,
    }


def render_docx(
    model: DocumentModel,
    template: StructureTemplate = StructureTemplate.MSF_TSD,
    author: Optional[str] = None,
) -> bytes:
    """Isi template dengan model, kembalikan berkas DOCX sebagai bytes."""
    berkas = _path_template(template)

    dokumen = DocxTemplate(str(berkas))
    lingkungan = SandboxedEnvironment(autoescape=False)
    dokumen.render(_konteks(model, author), lingkungan)

    penyangga = BytesIO()
    dokumen.save(penyangga)
    penyangga.seek(0)

    logger.info(
        "Dokumen DOCX dirender dari template",
        template=str(template),
        tabel=len(model.tables),
    )
    return penyangga.getvalue()
```

- [ ] **Step 5: Jalankan test untuk memastikan lulus**

Jalankan: `./.venv/Scripts/python.exe -m pytest tests/test_docx_template_renderer.py tests/test_structure_template.py -v`
Harapan: seluruhnya LULUS.

- [ ] **Step 6: Jalankan seluruh test dan linter**

Jalankan: `./.venv/Scripts/python.exe -m pytest -q`
Jalankan: `./.venv/Scripts/python.exe -m ruff check app tests`

Harapan: seluruh test Batch 1-3 tetap hijau. Nilai enum baru belum terjangkau jalur generate,
sehingga perilaku yang ada belum berubah.

- [ ] **Step 7: Siapkan commit**

```bash
git add v2/msf-db/backend/app/models/schemas.py v2/msf-db/backend/app/services/renderers/docx_template_renderer.py v2/msf-db/backend/tests/
```

```
feat: renderer DOCX berbasis template docxtpl

Template diisi, bukan ditiru, sehingga sampul, kop, dan seluruh gaya
bertahan tanpa kode yang menirunya. Jinja2 dijalankan di dalam
sandbox dan nama berkas template dipetakan konstan dari enum.
```

---

## Task 4: Aktifkan msf_tsd pada jalur generate

**Files:**
- Modify: `backend/app/routers/generate.py`
- Modify: `.env.example`
- Create: `backend/tests/test_generate_structure_routing.py`

**Interfaces:**
- Consumes: `render_docx` dan `StructureTemplate.MSF_TSD` dari Task 3.
- Produces: `pilih_keluaran_docx(template, model, markdown, project_name, author, exporter) -> bytes`
  pada `app/routers/generate.py`, dan jalur generate yang menghormati `structure_template`.

- [ ] **Step 1: Tulis test yang gagal**

Buat `backend/tests/test_generate_structure_routing.py`:

```python
"""Pemilihan renderer harus mengikuti structure_template, bukan menebak."""

import pytest

from app.models.schemas import StructureTemplate
from app.routers.generate import pilih_keluaran_docx
from app.services.doc_model import SUMBER_AI, ColumnDoc, DocumentModel, TableDoc


def model_contoh():
    return DocumentModel(
        project_name="Proyek Uji",
        generated_at="11 August 2026",
        tables=[
            TableDoc(
                name="t_uji",
                summary="Ringkasan.",
                columns=[
                    ColumnDoc(
                        no=1,
                        name="id",
                        data_type_label="bigint",
                        description="Identitas.",
                        source=SUMBER_AI,
                    )
                ],
            )
        ],
    )


def test_standard_memakai_exporter_markdown(monkeypatch):
    dipanggil = {}

    def exporter_palsu(markdown_content, project_name, author=None):
        dipanggil["exporter"] = True
        return b"DOCX-LAMA"

    hasil = pilih_keluaran_docx(
        template=StructureTemplate.STANDARD,
        model=model_contoh(),
        markdown="# Judul",
        project_name="Proyek Uji",
        author=None,
        exporter=exporter_palsu,
    )

    assert hasil == b"DOCX-LAMA"
    assert dipanggil["exporter"] is True


def test_msf_tsd_memakai_renderer_template(monkeypatch):
    from app.routers import generate as modul

    monkeypatch.setattr(modul, "render_docx", lambda model, template, author: b"DOCX-TSD")

    hasil = pilih_keluaran_docx(
        template=StructureTemplate.MSF_TSD,
        model=model_contoh(),
        markdown="# Judul",
        project_name="Proyek Uji",
        author=None,
        exporter=lambda **_: b"SALAH",
    )

    assert hasil == b"DOCX-TSD"
```

- [ ] **Step 2: Jalankan test untuk memastikan gagal**

Jalankan: `./.venv/Scripts/python.exe -m pytest tests/test_generate_structure_routing.py -v`
Harapan: GAGAL dengan `ImportError` karena `pilih_keluaran_docx` belum ada.

- [ ] **Step 3: Tambahkan pemilih keluaran di router**

Di `backend/app/routers/generate.py`, tambahkan impor:

```python
from app.models.schemas import StructureTemplate
from app.services.renderers.docx_template_renderer import render_docx
```

Tambahkan fungsi modul, di atas `_run_generate_job`:

```python
def pilih_keluaran_docx(
    template, model, markdown: str, project_name: str, author, exporter
) -> bytes:
    """
    Pilih renderer DOCX sesuai template struktur.

    Dipisah dari _run_generate_job agar dapat diuji tanpa menjalankan job.
    """
    if template == StructureTemplate.MSF_TSD:
        return render_docx(model, StructureTemplate.MSF_TSD, author)
    return exporter(
        markdown_content=markdown, project_name=project_name, author=author
    )
```

Di `_run_generate_job`, ganti pembangunan Markdown dan ekspor DOCX sehingga model ikut tersedia:

```python
        model = await generator.build_document_model(
            tables, settings["project_name"], job=job
        )
        markdown = render_markdown(
            model, settings["language"], settings["detail_level"]
        )
        job.update(
            preview_markdown=(
                markdown[:2000] + "\n\n..." if len(markdown) > 2000 else markdown
            )
        )
```

dan pada cabang DOCX:

```python
            exporter = DocxExporter()
            result_bytes = pilih_keluaran_docx(
                template=settings.get(
                    "structure_template", StructureTemplate.STANDARD
                ),
                model=model,
                markdown=markdown,
                project_name=settings["project_name"],
                author=settings.get("author"),
                exporter=exporter.export,
            )
```

Impor `render_markdown` ditambahkan di bagian impor router.

- [ ] **Step 4: Hidupkan MAX_OUTPUT_SIZE_MB**

Spec §9.6. Setelah `result_bytes` terbentuk, sebelum `job.update`:

```python
        batas_mb = int(os.getenv("MAX_OUTPUT_SIZE_MB", "25"))
        if len(result_bytes) > batas_mb * 1024 * 1024:
            raise ValueError(
                f"Berkas hasil {len(result_bytes) // (1024 * 1024)} MB melebihi "
                f"batas {batas_mb} MB. Kurangi jumlah tabel atau naikkan "
                "MAX_OUTPUT_SIZE_MB."
            )
```

Tambahkan ke `.env.example` bila belum bernilai:

```
# Batas ukuran berkas hasil. Template TSD memperbesar keluaran.
MAX_OUTPUT_SIZE_MB=25
```

- [ ] **Step 5: Jalankan test untuk memastikan lulus**

Jalankan: `./.venv/Scripts/python.exe -m pytest tests/test_generate_structure_routing.py tests/test_structure_template.py -v`
Harapan: LULUS.

- [ ] **Step 6: Jalankan seluruh test dan linter**

Jalankan: `./.venv/Scripts/python.exe -m pytest -q`
Jalankan: `./.venv/Scripts/python.exe -m ruff check app tests`

Harapan: seluruh test Batch 1-3 tetap hijau, karena bawaan `standard` mempertahankan jalur lama.

- [ ] **Step 7: Siapkan commit**

```bash
git add v2/msf-db/backend/app/routers/generate.py v2/msf-db/backend/tests/test_generate_structure_routing.py v2/msf-db/.env.example
```

```
feat: aktifkan structure_template msf_tsd

Nilai msf_tsd mengarahkan keluaran DOCX ke renderer template,
sedangkan standard tetap memakai jalur Markdown lama. Batas ukuran
keluaran dihidupkan karena template TSD memperbesar berkas hasil.
```

---

## Task 5: Dokumentasi operations dan ADR

Fitur ini memerlukan langkah setup di server, sehingga operations docs bersifat **wajib**
(AGENTS.md §1 poin 11).

**Files:**
- Create: `backend/docs/operations/document-templates.md`
- Create: `dev-docs/decisions/006-template-docx-docxtpl.md`
- Modify: `dev-docs/CHANGELOG.md`, `dev-docs/ai/CURRENT_STATE.md`, `ai/MODULE_MAP.md`, `ai/TASKS.md`
- Create: `reports/task/YYYY-MM-DD-batch-4-template-tsd.md`

- [ ] **Step 1: Tulis operations docs**

`backend/docs/operations/document-templates.md` wajib memuat tujuh bagian sesuai
`ai-rules/operations/README.md`: apa, kenapa, prasyarat, langkah setup, verifikasi, troubleshooting,
pemeliharaan.

Isi yang tidak boleh terlewat:

1. **Jebakan bind mount.** `docker-compose.yml` memasang `./backend/templates:/app/templates`.
   Isi direktori host **menimpa** isi image. Bila repositori tidak ter-clone utuh di server, atau
   direktori host kosong, template hilang tanpa pesan error dan generate `msf_tsd` gagal dengan
   `FileNotFoundError`.
2. **Verifikasi**: `docker exec msf2-backend ls -la /app/templates` harus menampilkan `tsd.docx`.
3. **Template adalah kode.** Tidak ada endpoint upload. Mengganti template dilakukan lewat commit
   dan `git pull`, bukan menyalin berkas ke server.
4. **Dilarang menulis kredensial** di berkas ini; berkas berada di dalam repo (AGENTS.md §1 poin 14).

- [ ] **Step 2: Tulis ADR-006**

`dev-docs/decisions/006-template-docx-docxtpl.md`, mengikuti format ADR-005: Context, Decision,
Consequences dengan Positive, Trade-offs, Risks, Rollback.

Context wajib menyebut kegagalan v1: 43 skrip menempuh jalur replikasi, dan
`SOLUSI_EXACT_TEMPLATE_FINAL.md` bertanggal 4 November mengklaim selesai 100% sementara lima skrip
berikutnya bertanggal 13 November.

Alternatif yang ditolak dan alasannya: replikasi lewat `python-docx` (jalur v1 yang terbukti tidak
konvergen), template visual sebagai varian gaya, dan penafsiran template oleh AI saat runtime yang
justru mengembalikan ketidakpastian yang baru saja dihilangkan.

- [ ] **Step 3: Sinkronisasi dokumentasi**

Perbarui `CHANGELOG.md`, `ai/CURRENT_STATE.md`, `ai/MODULE_MAP.md`, `ai/TASKS.md` (tutup T-020),
serta buat laporan task.

Usulkan perubahan `backend/README.md` kepada pengguna, **jangan langsung diterapkan**
(AGENTS.md §1 poin 8).

- [ ] **Step 4: Jalankan Security Pre-Merge Checklist**

`ai-rules/security/part-i-security-pre-merge-checklist.md`, dengan perhatian khusus pada spec §9.10:
tidak ada jalur template dari input pengguna, tidak ada endpoint upload, sandbox Jinja2 aktif, rate
limit `by-code` terpasang, dan bawaan `MAX_TABLES_PER_REQUEST` tidak dinaikkan di repo.

- [ ] **Step 5: Siapkan commit**

```bash
git add v2/msf-db/backend/docs/operations/document-templates.md v2/msf-db/dev-docs/ v2/msf-db/reports/
```

```
docs: operations dan ADR-006 untuk template TSD

Bind mount templates menimpa isi image, sehingga direktori host yang
kosong membuat template hilang tanpa pesan error. Prosedurnya
didokumentasikan sebelum fitur dipakai di server.
```

---

## Setelah Task 5

Yang tetap terbuka dan sengaja tidak dikerjakan:

| Butir | Alasan |
| --- | --- |
| 14 diagram ERD tetap gambar statis di template | Tidak dapat digenerate. Keputusan penyediaan gambar per fitur ditunda sampai ada kebutuhan nyata |
| PDF tidak mengikuti bentuk TSD | `PdfExporter` memakai jalur render terpisah dengan CSS sendiri. Paritas penuh memerlukan penyatuan jalur render, jauh di luar cakupan |
| `MAX_TABLES_PER_REQUEST` tetap 50 di repo | Spec §9.6. Database TSD berisi sekitar 119 tabel, sehingga deployment yang membutuhkannya menaikkan lewat env dan menurunkan `RATE_LIMIT_GENERATE` secara proporsional |
| Waktu generate satu dokumen TSD penuh mendekati 30 menit dengan `llama3.2` | Konsekuensi jumlah tabel, bukan cacat implementasi. Pilihan model lebih cepat diserahkan ke operator |
| Frontend belum menampilkan pilihan `structure_template` | Field punya bawaan sehingga backend tetap berfungsi. Perlu sebelum fitur dapat dipakai pengguna akhir |
