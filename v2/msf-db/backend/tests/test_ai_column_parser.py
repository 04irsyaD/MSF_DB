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


def test_deskripsi_kosong_tidak_dicatat():
    """Deskripsi kosong harus jatuh ke rantai fallback, bukan mengisi sel kosong."""
    keluaran = "id | \njumlah | Nominal."

    _, deskripsi, _ = parse_keluaran_kolom(keluaran, KOLOM_SAH)

    assert "id" not in deskripsi
    assert deskripsi["jumlah"] == "Nominal."


def test_seluruh_keluaran_karangan_menghasilkan_nol_deskripsi():
    """Model yang mengarang total tidak boleh menyumbang satu sel pun."""
    keluaran = "alpha | satu\nbeta | dua\ngamma | tiga"

    _, deskripsi, ditolak = parse_keluaran_kolom(keluaran, KOLOM_SAH)

    assert deskripsi == {}
    assert ditolak == 3


def test_sanitasi_menahan_upaya_menyuntik_baris_tabel():
    """
    Komentar database adalah input tidak tepercaya. Pipa dan baris baru di
    dalamnya tidak boleh sampai membentuk baris tabel Markdown baru.
    """
    hasil = sanitasi_teks("jahat\n| x | y |\nlagi", 200)

    assert "\n" not in hasil
