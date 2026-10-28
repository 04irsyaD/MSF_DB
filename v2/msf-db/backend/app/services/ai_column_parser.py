"""
Parsing dan sanitasi keluaran AI untuk deskripsi kolom.

Parser di berkas ini bukan sekadar pembaca teks, melainkan penyaring
halusinasi: nama kolom yang tidak ada di metadata asli dibuang sebelum
sempat masuk dokumen. Penyaringan ini deterministik dan tidak bergantung
pada kepatuhan model terhadap instruksi.

Format baris dipilih menggantikan JSON karena model kecil sering merusak
struktur kurung, sedangkan baris "nama | deskripsi" tetap terbaca meski
model menambah kalimat pengantar atau heading liar.
"""

import re
from typing import Dict, Iterable, Optional, Tuple

BATAS_DESKRIPSI = 300
BATAS_RINGKASAN = 400
BATAS_NAMA = 128

LABEL_RINGKASAN = "RINGKASAN:"

# Garis bawah sengaja TIDAK ikut dilucuti. Garis bawah lazim pada nama kolom,
# dan membuangnya akan merusak pencocokan dengan metadata, yaitu justru
# mekanisme yang menahan halusinasi.
_POLA_MARKUP = re.compile(r"[*`#>\[\]]")


def sanitasi_teks(teks: Optional[str], batas: int) -> str:
    """
    Ratakan menjadi satu baris, lucuti markup, lalu potong panjangnya.

    Perataan baris bukan kosmetik: teks berbaris ganda di dalam sel akan
    merusak tabel Markdown, dan teks ini dapat berasal dari komentar
    database yang merupakan input tidak tepercaya.
    """
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
