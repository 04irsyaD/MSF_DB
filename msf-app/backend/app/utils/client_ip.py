"""
Identitas IP client untuk lockout / rate limit.

Di Render, koneksi masuk lewat proxy yang MENAMBAHKAN IP penghubung ke ujung
kanan `X-Forwarded-For`. Entri paling kiri bisa diisi bebas oleh client
(spoofable), jadi yang dipakai adalah entri PALING KANAN.

Catatan: request lewat rewrite Vercel akan terbaca sebagai IP egress Vercel.
Identitas yang lebih akurat dijadwalkan setelah Batch 6 (API key server-side).
Tanpa proxy (dev lokal), header ini tidak dijamin keasliannya.
"""

from fastapi import Request


def client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for", "")
    if forwarded:
        last_hop = forwarded.split(",")[-1].strip()
        if last_hop:
            return last_hop
    return request.client.host if request.client else "unknown"
