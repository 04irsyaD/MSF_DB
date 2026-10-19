# Session Notes — MSF DB

Catatan handoff antar sesi. Baca ini dulu sebelum lanjut kerja.
Terakhir diperbarui: 2026-10-16.

---

## 0. Terbaru (2026-10-16) — Bugfix MSF Diagram

- Branch **`feat/diagram-fix`** (dari `dev`), **belum commit / belum push**.
- Semua bug di `dev-docs/modules/diagram-canvas/PLAN.md` dikerjakan: layout halaman, kanvas (Fit, zoom, drag, touch), fullscreen, ekspor PNG, Mermaid, dan **parser DDL backend ditulis ulang** (`showtime_id INT` dulu terbaca `TIME`).
- Verifikasi: lint/type-check/build OK, `npm run test:diagram` 11/11, pytest 53/53, QA browser Chrome 71/72, Edge 71/72, Firefox 70/70 (gagal hanya `/favicon.ico` 404, I-012), termasuk zoom browser 125%/150%.
- **Sisa sebelum push:** Live DB Connector (ditunda sampai Supabase siap). Isi "Gate Push" di `dev-docs/modules/diagram-canvas/QA_CHECKLIST.md`.
- Aturan AI baru: `dev-docs/ai/CODING_RULES.md`. Laporan: `reports/task/frontend/2026-10-16-diagram-bugfix-responsive.md`.
- Catatan: `frontend/.env.local` `BACKEND_URL` mengarah ke backend Render (parser lama). Untuk tes parser lokal jalankan dev dengan `BACKEND_URL=http://localhost:8000`.

---

## 1. Status saat ini

- Repo git: `MSF_DB/`, branch **`dev`**.
- Frontend (Next.js 14) **sudah di Vercel**. Backend (FastAPI) **belum di-deploy**.
- Perubahan di bawah (bagian 2) **BELUM di-commit**:

```
M msf-app/frontend/src/app/admin/page.tsx
M msf-app/frontend/src/app/layout.tsx
M msf-app/frontend/src/app/page.tsx
M msf-app/frontend/src/components/generator/SqlEditor.tsx
M msf-app/frontend/src/components/layout/AppLayout.tsx
M msf-app/frontend/src/styles/globals.css
?? msfdb-landing-handoff.zip   (bahan desain landing, bukan kode — jangan di-commit)
```

`npm run build` dan `npm run lint` lolos (warning lint yang tersisa ada di file lain dan sudah ada sebelumnya).

> Folder `MSF_DB/v2/msf-db/` adalah salinan lama frontend — tidak dipakai, tidak diubah.

---

## 2. Yang sudah dikerjakan (2026-10-15)

### a. Redesign landing page (`src/app/page.tsx`)
- Diganti dengan desain gelap dari `msfdb-landing-handoff.zip` (`page.reference.tsx`).
- Toggle bahasa **EN/ID** di navbar; default English; disimpan di `localStorage` key `msfdb-lang`; `<html lang>` ikut berubah. Semua teks ada di objek `dict`.
- **Bug di file referensi sudah diperbaiki**: dulu pilihan ID hilang setelah reload (effect menyimpan "en" default sebelum nilai tersimpan dibaca). Sekarang `localStorage` hanya ditulis saat user klik EN/ID.
- CTA mengarah ke `/dashboard`.
- Root `<div data-page="landing">` dipakai CSS untuk background `#020617`, smooth scroll, dan scrollbar gelap khusus landing (`html:has([data-page="landing"])` di `globals.css`).
- Metadata description di `layout.tsx` diganti ke bahasa Inggris.

### b. Workspace default dark (sync dengan landing)
- `layout.tsx`: `ThemeProvider defaultTheme="dark"` (sebelumnya `light`). Toggle matahari/bulan di sidebar tetap jalan.
- Bagian yang dulu tetap terang di mode dark, sudah diperbaiki:
  - Banner "Koneksi API Bermasalah" → varian `dark:` (`AppLayout.tsx`)
  - Monaco editor ikut tema: `vs-dark` / `vs` via `useTheme` (`SqlEditor.tsx`)
  - Ikon gembok Admin (`admin/page.tsx`)
  - `globals.css`: fallback `.dark` untuk `bg-gray-50/50` dan badge berwarna (`bg-{red,amber,emerald,blue,purple}-50/100`, border `-100/200`, text `-700/800/900`). Warna teal **sengaja tidak** di-override karena komponennya sudah punya `dark:` sendiri.
- Sudah dicek visual di 8 route (dashboard, generate, diagram, sql-helper, schema-compare, shortcuts, settings, admin) untuk mode dark dan light.

---

## 3. Rencana deploy backend — Render (gratis)

**Keputusan:** pakai **Render, workspace Hobby ($0) + Instance Type "Free"**.
Alternatif yang dicek dan ditolak: Koyeb (akun baru harus berbayar), Hugging Face Spaces (Docker Spaces dilaporkan berbayar), Railway/Fly.io (tidak ada free permanen). Opsi lanjutan nanti: Oracle Cloud Always Free VM (tanpa sleep, butuh kartu kredit + setup sendiri).

### Soal kartu kredit
- User **tidak punya kartu kredit yang ada saldonya** → prioritaskan opsi tanpa kartu.
- Render (artikel resmi 2026) bilang free tier tanpa kartu, tapi staff Render di forum menyebut sebagian akun diminta verifikasi kartu (charge $1 lalu dikembalikan) untuk anti-abuse. Jadi: **coba daftar dulu tanpa kartu**.
- Kalau Render minta kartu: verifikasi $1 akan gagal dengan kartu kosong. Opsi: isi saldo sedikit / pakai kartu debit virtual Visa/Mastercard yang bisa transaksi online; atau cari host lain yang benar-benar tanpa kartu.
- Oracle Cloud Always Free juga butuh verifikasi kartu → kemungkinan tidak bisa untuk saat ini.

### Kuota Hobby (dari halaman pricing yang dilihat user)
- 5 GB bandwidth/bulan ($0.15/GB setelahnya), 500 build minutes, 2 custom domain, 25 service.
- Instance Free: 512 MB RAM, ~750 jam/bulan, **sleep setelah 15 menit idle**, cold start ±1 menit.
- **Biaya hanya muncul kalau** salah pilih instance type (bukan "Free"), bandwidth > 5 GB, atau bikin Postgres di Render (tidak perlu — backend pakai SQLite).

### Persiapan yang sudah dicek (2026-10-15)
- Repo GitHub: `04irsyaD/MSF_DB`. Kode backend di **`origin/dev` = lokal**; `main` ketinggalan (belum ada `job_store.py`). → **Deploy dari branch `dev`.**
- Backend dites lokal dengan env ala Render, tanpa Ollama: startup OK (cuma warning Ollama), `/health` → 200 `"status":"degraded"`, `/api/shortcuts` 200, CORS `msf-db.my.id` OK.
- `OUTPUT_DIR` **wajib di-set** (`/app/outputs`): default-nya SQLite menulis ke `/data` yang tidak bisa ditulis user non-root di container.
- Folder `templates/` tidak ada di repo → aman, docx exporter pakai `Document()` kosong.
- `MSF_API_KEY` biarkan kosong (kalau di-set, frontend harus kirim `NEXT_PUBLIC_MSF_API_KEY` yang toh terlihat di browser).
- **File `render.yaml` sudah dibuat di root repo (`MSF_DB/render.yaml`)** — belum di-commit/push.

### Cara frontend Vercel menghubungi backend (PENTING)
Frontend memanggil path relatif `/api/...`, lalu `next.config.js` me-*rewrite* ke `BACKEND_URL` → `NEXT_PUBLIC_API_URL` → default `http://backend:8000` (hostname Docker, **tidak ada di Vercel** → kemungkinan penyebab error 500 di produksi sekarang).
Karena request lewat server Vercel, CORS sebenarnya tidak terpakai; `CORS_ORIGINS` tetap diisi untuk jaga-jaga.
Rewrite dibaca saat **build** → setelah ganti env di Vercel wajib **Redeploy**.

### Langkah deploy
**Opsi A — Blueprint (pakai `render.yaml`, disarankan):**
1. Commit + push `render.yaml` ke branch `dev`.
2. Render → **New → Blueprint** → pilih repo `MSF_DB` → branch `dev`.
3. Render minta isi env `sync: false`: `CORS_ORIGINS` = `https://msf-db.my.id,https://<project>.vercel.app`; `DEEPSEEK_API_KEY` boleh kosong.
4. Pastikan plan tertulis **Free** → Apply. `ADMIN_PASSCODE` dibuat acak → lihat di tab Environment service.

**Opsi B — manual (tanpa commit):**
Render → New → **Web Service** → repo `MSF_DB`, branch `dev`, Root Directory `msf-app/backend`, Runtime **Docker**, Instance Type **Free**, Region Singapore, Health Check Path `/health`. Env vars: salin dari `render.yaml` (PORT, OUTPUT_DIR, LOG_FILE_PATH, SHORTCUTS_DIR, TEMPLATES_DIR, TZ, LOG_LEVEL, MAX_CONCURRENT_JOBS=1, CORS_ORIGINS, ADMIN_PASSCODE kuat, DEEPSEEK_API_KEY opsional).

**Setelah backend Live:**
1. Tes `https://<service>.onrender.com/health` → harus `{"status":"degraded",...}` (degraded = Ollama tidak ada, normal).
2. Vercel → Settings → Environment Variables → `BACKEND_URL=https://<service>.onrender.com` (tanpa `/api`, tanpa slash akhir) untuk Production → **Redeploy**.
3. Buka `https://msf-db.my.id/api/health` → harus sama dengan langkah 1.

### Keterbatasan yang sudah diterima
- **Ollama tidak jalan** di Render free (RAM kecil) → generate AI lokal gagal; pakai DeepSeek/OpenAI.
- **Disk ephemeral** → riwayat job (SQLite di `OUTPUT_DIR`/`data`) dan file DOCX/PDF hilang saat restart/sleep.
- Saat backend tidur, frontend menampilkan banner "Koneksi API Bermasalah" ±1 menit lalu normal.

---

## 4. TODO / langkah berikutnya

- [ ] Review & commit perubahan frontend di bagian 1 (user belum minta commit).
- [x] `render.yaml` dibuat (root repo) — tinggal commit+push ke `dev` kalau pakai Blueprint.
- [x] Backend dicek aman jalan tanpa Ollama (asal `OUTPUT_DIR` di-set).
- [x] Backend **LIVE** di Render: https://msf-db-backend.onrender.com (deploy manual / Opsi B, branch `dev`, Singapore, Free, 2026-10-15). `/health`, `/api/shortcuts`, CORS msf-db.my.id OK.
- [ ] Set `BACKEND_URL=https://msf-db-backend.onrender.com` di Vercel + Redeploy (per 2026-10-15 `msf-db.my.id/api/health` masih 502).
- [ ] Cek Vercel Settings → Git → Production Branch (main/dev?) sebelum merge `dev` → `main`. Saat ini `dev` 31 commit di depan, `main` 2 commit di depan (diverged).
- [ ] Kurangi polling `/api/health`: sekarang `AppLayout` polling tiap 10 detik **termasuk di landing `/`**, dashboard juga tiap 12 detik. Ini makan bandwidth (±90 MB/bulan per tab terbuka 8 jam/hari) dan bikin backend Render tidak pernah tidur. Usulan: skip polling di `/`, perlambat interval.
- [ ] (Opsional) Samakan warna dasar workspace dark (`#0b111e`) dengan landing (`slate-950` / `#020617`).
- [ ] Ganti `ADMIN_PASSCODE` default `admin123` di `docker-compose.yml` / `.env`.

---

## 5. Cara menjalankan lokal

```powershell
# Frontend
cd MSF_DB\msf-app\frontend
npm run dev            # http://localhost:3000

# Backend (terminal lain) — lihat DEVELOPMENT.md untuk setup venv
cd MSF_DB\msf-app\backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Atau semua sekaligus
cd MSF_DB\msf-app
docker-compose up -d
```
