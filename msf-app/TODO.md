# MSF-DB — Technical Backlog

> File ini melacak semua pekerjaan teknis, bug, dan hutang teknis (technical debt) yang perlu diselesaikan.
> Format status: `- [ ]` Belum dikerjakan, `- [/]` Sedang dikerjakan, `- [x]` Selesai.

---

## 🔴 MUST DO (Prioritas Utama - Blocker)

### Testing & Quality Assurance
- [x] Setup infrastruktur testing `pytest` (`conftest.py`, `pytest.ini`, `tests/`)
- [x] Buat unit test untuk `SQLParser` (dialek, comments, edge cases)
- [x] Buat unit test untuk validasi skema Pydantic (`schemas.py`)
- [x] Buat integration test untuk endpoint `/api/health`
- [x] Buat integration test untuk `JobQueue` state machine

### Resilience & AI Reliability
- [x] Implementasikan retry dengan exponential backoff + jitter untuk semua pemanggilan AI provider
- [x] Tambahkan batas waktu job-level timeout (maksimum 30 menit) menggunakan `asyncio.wait_for`
- [x] Tangani error status `429` (Rate Limit) dari DeepSeek secara spesifik dan berikan informasi yang jelas ke pengguna
- [x] Pindahkan penyimpanan file output DOCX/PDF dari direktori temp sistem ke Docker volume persistent `/app/outputs`
- [x] Admin Portal & Live Log Monitor (dengan rotasi log dan verifikasi passcode)

### Validasi & Security
- [x] Batasi ukuran maksimum input `sql_content` (500KB) untuk mencegah eksploitasi memori
- [x] Enforce batas jumlah tabel maksimum per permintaan (`MAX_TABLES_PER_REQUEST`) di level router
- [x] Buat logika validasi port database yang valid (1-65535) di level Pydantic
- [x] Validasi input koneksi database: wajib mengisi salah satu dari `connection_string` atau parameter manual (`host` + `database`)

---

## 🟡 SHOULD DO (Prioritas Menengah - Penting)

### Database Engines (v2.1)
- [ ] Implementasi driver koneksi dan parser metadata untuk **SQL Server** (menggunakan `pyodbc`)
- [ ] Implementasi driver koneksi dan parser metadata untuk **MongoDB** (menggunakan `pymongo`)

### User Experience & UI (v2.2)
- [ ] Tambahkan toggle Dark/Light Mode di Sidebar menggunakan `next-themes`
- [ ] Hasilkan diagram ERD (Entity Relationship Diagram) visual secara otomatis dari skema DDL menggunakan `mermaid.js`
- [ ] Simpan riwayat dokumentasi terakhir di `localStorage` browser pengguna agar tidak hilang saat refresh
- [ ] Buat agar riwayat status pekerjaan tersimpan secara persistent di database lokal (SQLite) alih-alih hanya di memori server

---

## 🟢 NICE TO HAVE (Prioritas Rendah)

- [ ] Buat fitur "Share Link" dengan URL unik untuk membagikan hasil dokumentasi ke anggota tim
- [ ] Tambahkan dukungan bahasa tambahan untuk dokumentasi selain Indonesia dan Inggris
- [ ] Buat integrasi webhook untuk mengirimkan notifikasi (misal ke Discord atau Slack) saat dokumentasi selesai dibuat
- [ ] Terapkan rate limiting per alamat IP menggunakan `slowapi` di backend FastAPI
- [ ] Buat Docker image khusus Ollama dengan dukungan akselerasi GPU Nvidia secara out-of-the-box
