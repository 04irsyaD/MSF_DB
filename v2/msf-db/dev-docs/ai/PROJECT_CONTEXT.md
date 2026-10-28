# Project Context — Spesifikasi Teknis MSF-DB

> **Status:** TECH SPEC — Detail lingkungan pengerjaan proyek.

---

## 1. Stack Teknologi & Versi

| Komponen | Teknologi | Keterangan |
|----------|-----------|------------|
| **Backend** | Python 3.11-slim, FastAPI | Berjalan di kontainer `msf-backend` |
| **Frontend** | Node.js 20, Next.js 14 | Berjalan di kontainer `msf-frontend` |
| **Database Internal** | SQLite (in-memory) | Mengelola status antrean pekerjaan |
| **AI LLM Engine** | Ollama | Terhubung ke model lokal (default: `llama3.2`) |

---

## 2. Alokasi Port & Endpoint

| Service | Port | Endpoint URL | Keterangan |
|---------|------|--------------|------------|
| **Frontend UI** | 3001 (host) / 3000 (internal) | `http://localhost:3001` | Halaman web utama |
| **Backend API** | 8001 (host) / 8000 (internal) | `http://localhost:8001` | REST API Server |
| **Ollama LLM** | 11434 (host) | `http://host.docker.internal:11434` | Endpoint koneksi LLM |

---

## 3. Variabel Lingkungan (.env) yang Krusial

*   `MSF_API_KEY`: Kunci keamanan API (jika dikonfigurasi, frontend wajib mengirimkan header `X-API-Key`).
*   `ADMIN_PASSCODE`: Kata sandi untuk masuk ke halaman portal Admin (default: `admin123`).
*   `NEXT_PUBLIC_MSF_API_KEY`: Kunci API di sisi frontend (harus sama dengan `MSF_API_KEY` di backend).
*   `OLLAMA_BASE_URL`: URL untuk menghubungi Ollama (diatur ke `http://host.docker.internal:11434` untuk koneksi dari dalam kontainer Docker ke host).

---

## 4. UI/UX Template & Framework

Bagian ini dirujuk AGENTS.md poin 10 tetapi sebelumnya belum pernah ada, sehingga aturan UI/UX tidak
dapat ditelusuri ke fakta proyek. Diisi pada 2026-08-14.

*   **Tidak ada HTML template pihak ketiga** yang disediakan pengguna. Tidak memakai Metronic,
    AdminLTE, maupun Stisla.
*   **Framework UI: Tailwind CSS 3.4** di atas Next.js 14.2 dan React 18.3. Inilah framework
    established yang dimaksud AGENTS.md poin 10 cabang kedua.
*   **Dilarang membuat CSS framework sendiri.** Komponen baru wajib meniru pola komponen yang sudah
    ada. Contoh acuan: selector Detail Level dan Struktur Dokumen di
    `frontend/src/components/generator/GeneratePanel.tsx`, keduanya memakai kelas Tailwind yang sama
    persis.
*   **Verifikasi frontend hanya lewat `npm run build`.** Tidak ada framework test (TD-012), dan
    ESLint tidak dapat dijalankan karena `.eslintrc.json` tidak ada (TD-011).
