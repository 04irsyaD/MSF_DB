# Start Here — Petunjuk Orientasi AI

> **Status:** ORIENTATION — Berkas utama orientasi asisten AI baru.

Selamat datang di proyek **MSF-DB**! Sebagai AI, sebelum menulis kode apa pun, Anda **wajib** membaca panduan orientasi ini terlebih dahulu agar pekerjaan Anda tidak menimbulkan bug regresi.

---

## 1. Langkah Pertama (Onboarding Check)
1.  **Baca Aturan Kontrak**: Pahami berkas [ai-rules/AGENTS.md](../../ai-rules/AGENTS.md).
2.  **Verifikasi Lingkungan**: Pastikan Anda menjalankan perintah git dan docker langsung dari root directory `msf-app/`.
3.  **Pelajari Arsitektur**: Pahami alur data Next.js ↔ FastAPI di berkas [planning/architecture.md](../../planning/architecture.md).

---

## 2. Alur Pengerjaan Task
Setiap kali Anda menerima tugas (misal memodifikasi API atau UI):
1.  Buka [dev-docs/ai/CURRENT_STATE.md](./CURRENT_STATE.md) untuk melihat masalah yang belum selesai (*technical debt*).
2.  Tulis rencana minimalis (maksimal 5 baris) ke pengguna sebelum mulai coding.
3.  Lakukan perubahan kode secara modular (dilarang menembus batas baris berkas di `ai-rules/coding-standards/01-file-limits.md`).
4.  Jalankan pytest di backend:
    ```bash
    docker-compose exec -T backend pytest -v
    ```
5.  Catat pekerjaan Anda di [dev-docs/commit-logs/](./../commit-logs/) dan perbarui berkas indeks [dev-docs/COMMIT_LOG.md](./../COMMIT_LOG.md).
6.  **PENTING**: Dilarang keras menjalankan perintah `git push`!
