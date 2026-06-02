# Documentation: Build & Run

Panduan singkat untuk membangun dan menjalankan project menggunakan Docker (Windows PowerShell).

Syarat:
- Docker Desktop terpasang dan berjalan di mesin Anda.
- (Opsional) Jika tidak pakai Docker, Anda bisa menjalankan langsung dengan Python.

1) Build image dan jalankan dengan Docker Compose (Docker Compose v2, `docker compose`):

```powershell
# dari root proyek: AI OLLMA
cd "AI OLLMA"

# build image (opsional --no-cache untuk memastikan fresh build)
docker compose build --no-cache

# jalankan service (akan menjalankan script default di docker-compose.yml)
docker compose up --exit-code-from app
```

2) Jika Anda menggunakan docker-compose (v1):

```powershell
docker-compose build --no-cache
docker-compose up --abort-on-container-exit
```

3) Menjalankan script tertentu tanpa rebuild (override command):

```powershell
# contoh: jalankan ai_writer.py
docker compose run --rm app python summary/scripts/ai_writer.py
```

4) Menjalankan tanpa Docker (native Python):

```powershell
# install dependencies
python -m pip install -r "summary/requirements.txt"

# jalankan main.py atau script lainnya
python "summary/scripts/main.py"
```

Catatan tambahan:
- `docker-compose.yml` dan `Dockerfile` juga tersedia di folder `documentations/` untuk referensi. Jika Anda memodifikasi kode di `summary/`, volume mount pada compose sudah mengarah ke `./summary` sehingga perubahan akan terlihat tanpa rebuild saat menggunakan `docker compose run`.
- Jika build gagal, kirimkan log error ke sini dan saya bantu analisis.
