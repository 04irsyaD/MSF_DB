-- the comand from database 
--from chatgpt  
# 📘 README – Konfigurasi & Penggunaan PostgreSQL

## 📦 Deskripsi

Proyek ini menggunakan **PostgreSQL** sebagai sistem manajemen basis data relasional (RDBMS). PostgreSQL dipilih karena stabil, aman, mendukung fitur lanjutan seperti indexing, JSONB, transaksi ACID, dan skalabilitas tinggi.

---

## 🧰 Teknologi

- **PostgreSQL** versi 12+
- ORM/Query tool: *(Opsional, sebutkan jika menggunakan Sequelize, TypeORM, Prisma, dsb)*
- Bahasa backend: *(contoh: Node.js, Python, Java, dsb)*

---

## ⚙️ Setup Database

### 1. Instalasi PostgreSQL

**Linux (Ubuntu):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

**Mac (via Homebrew):**
```bash
brew install postgresql
```

### 2. Menjalankan PostgreSQL
```bash
sudo service postgresql start
```

### 3. Masuk ke PostgreSQL CLI
```bash
sudo -u postgres psql
```

---

## 🛠️ Konfigurasi Awal

### Membuat User dan Database
```sql
-- Buat user baru
CREATE USER nama_user WITH PASSWORD 'passwordku';

-- Buat database
CREATE DATABASE nama_database OWNER nama_user;

-- Berikan hak akses
GRANT ALL PRIVILEGES ON DATABASE nama_database TO nama_user;
```

---

## 📁 Struktur Tabel (Contoh)
```sql
CREATE TABLE laporan (
  id SERIAL PRIMARY KEY,
  judul VARCHAR(255) NOT NULL,
  isi TEXT,
  status VARCHAR(50),
  tanggal_laporan DATE DEFAULT CURRENT_DATE
);
```

---

## 🔍 Query SQL Umum

### Insert Data
```sql
INSERT INTO laporan (judul, isi, status) 
VALUES ('Laporan Mingguan', 'Isi laporan...', 'draft');
```

### Select Data
```sql
SELECT * FROM laporan WHERE status = 'draft';
```

### Update Data
```sql
UPDATE laporan SET status = 'selesai' WHERE id = 1;
```

### Delete Data
```sql
DELETE FROM laporan WHERE id = 2;
```

---

## 🔁 Manajemen Sequence

### Atur sequence ke angka tertentu (misal: 150)
```sql
SELECT setval('laporan_id_seq', 150);
```

### Cek nama sequence dari kolom SERIAL
```sql
SELECT pg_get_serial_sequence('laporan', 'id');
```

### Cek nilai berikutnya dari sequence
```sql
SELECT nextval('laporan_id_seq');
```

---

## 🔐 Tips Keamanan

- Jangan pernah commit file `.env` yang berisi username/password database.
- Gunakan user database dengan hak akses minimal di lingkungan produksi.
- Selalu backup database secara berkala.

---

## 📤 Backup & Restore

### Backup:
```bash
pg_dump -U nama_user -F c -b -v -f backup_db.dump nama_database
```

### Restore:
```bash
pg_restore -U nama_user -d nama_database -v backup_db.dump
```

---

## 🧪 Testing Koneksi (dengan psql)
```bash
psql -U nama_user -d nama_database -h localhost -p 5432
```

---

## 📎 Referensi

- [PostgreSQL Official Docs](https://www.postgresql.org/docs/)
- [pgAdmin](https://www.pgadmin.org/) – GUI untuk manajemen database PostgreSQL
- [DB Fiddle](https://www.db-fiddle.com/) – Untuk mencoba query SQL online

---

