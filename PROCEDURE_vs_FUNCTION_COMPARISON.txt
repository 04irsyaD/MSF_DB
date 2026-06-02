# PERBANDINGAN LENGKAP: PROCEDURE vs FUNCTION di PostgreSQL

## 📊 TABEL PERBANDINGAN LENGKAP

| ASPEK | PROCEDURE | FUNCTION |
|-------|-----------|----------|
| **Definisi** | Blok kode yang tidak return value | Blok kode yang return value/table |
| **Return Value** | Tidak langsung, pakai OUT parameter | Return langsung dengan RETURNS TABLE |
| **Cara Panggil** | `CALL sp_name(param)` | `SELECT * FROM fn_name(param)` |
| **Syntax Panggilan** | Kompleks (BEGIN/CALL/FETCH/COMMIT) | Simpel (SELECT) |
| **RETURN QUERY** | ❌ Tidak support | ✅ Support |
| **REFCURSOR** | ✅ Support (dengan BEGIN/FETCH) | ⚠️ Support tapi jarang |
| **Performa** | ⚡⚡ Sedang | ⚡⚡⚡ Cepat |
| **Keamanan** | ✅✅ Tinggi (logic tersembunyi) | ✅ Tinggi (logic tersembunyi) |
| **SECURITY DEFINER** | ✅ Support | ✅ Support |
| **Audit Log** | ✅ Mudah ditambah | ⚠️ Bisa tapi susah |
| **Aplikasi Integration** | ❌ Ribet (pakai cursor) | ✅ Mudah (SELECT statement) |
| **Filter Hasil** | ❌ Tidak bisa WHERE | ✅ Bisa pakai WHERE/GROUP BY |
| **Join Dengan Tabel** | ❌ Susah | ✅ Mudah |
| **Aggregate Lagi** | ❌ Susah | ✅ Mudah |
| **Data Masking** | ✅ Fleksibel | ⚠️ Terbatas |
| **Error Handling** | ✅ TRY/CATCH detail | ✅ EXCEPTION |
| **Transaction Control** | ✅ BEGIN/COMMIT/ROLLBACK | ⚠️ Terbatas |
| **Parameter Fleksibel** | ✅ IN/OUT/INOUT | ✅ IN DEFAULT |

---

## 🎯 PENGGUNAAN PER USE CASE

### 1️⃣ DASHBOARD / REPORT REAL-TIME
```
✅ FUNCTION (RECOMMENDED)
   - Simpel dipanggil
   - Performa tinggi
   - Mudah di-filter
   
❌ PROCEDURE
   - Ribet dengan cursor
   - Lambat karena transaksi overhead
```

### 2️⃣ DATA RAHASIA / SENSITIF
```
✅ FUNCTION + SECURITY DEFINER
   - Logic tersembunyi
   - Cukup aman
   - Simpel

✅✅ PROCEDURE + SECURITY DEFINER + AUDIT LOG
   - Logic 100% tersembunyi
   - Audit log terekam
   - Paling aman
```

### 3️⃣ BATCH JOB / BULK INSERT
```
❌ FUNCTION
   - Tidak support transaksi kompleks

✅✅ PROCEDURE (RECOMMENDED)
   - Kontrol penuh BEGIN/COMMIT/ROLLBACK
   - Error handling detail
   - Rollback otomatis
```

### 4️⃣ API REST / WEB APPLICATION
```
✅✅ FUNCTION (RECOMMENDED)
   - Return JSON langsung
   - Mudah di-serialize
   - Performa tinggi

❌ PROCEDURE
   - Cursor susah di-serialize
   - Kompleks implementasi
```

### 5️⃣ ETL / DATA PIPELINE
```
❌ FUNCTION
   - Terbatas kontrol flow

✅✅ PROCEDURE (RECOMMENDED)
   - Kontrol flow kompleks
   - Multi-step transaction
   - Error handling robust
```

### 6️⃣ FILTERING DINAMIS
```
✅✅ FUNCTION (RECOMMENDED)
   - SELECT * FROM fn() WHERE ...
   - GROUP BY, HAVING, ORDER BY
   - Flexible query

❌ PROCEDURE
   - Tidak bisa filter hasil
```

---

## 💻 CONTOH KODE

### PROCEDURE SYNTAX
```sql
CREATE OR REPLACE PROCEDURE sp_laporan(
    p_tahun INTEGER DEFAULT EXTRACT(YEAR FROM NOW()),
    INOUT cur REFCURSOR
)
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
BEGIN
    OPEN cur FOR
    SELECT * FROM ... WHERE EXTRACT(YEAR FROM created_at) = p_tahun;
END;
$$;

-- PAKAI:
BEGIN;
CALL sp_laporan(2020, 'cur');
FETCH ALL IN "cur";
COMMIT;
```

### FUNCTION SYNTAX
```sql
CREATE OR REPLACE FUNCTION fn_laporan(
    p_tahun INTEGER DEFAULT EXTRACT(YEAR FROM NOW()),
    p_bulan INTEGER DEFAULT NULL
)
RETURNS TABLE (
    tahun INTEGER,
    bulan INTEGER,
    data VARCHAR,
    total BIGINT
)
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        EXTRACT(YEAR FROM created_at)::INTEGER,
        EXTRACT(MONTH FROM created_at)::INTEGER,
        column_name::VARCHAR,
        COUNT(*)::BIGINT
    FROM tabel
    WHERE EXTRACT(YEAR FROM created_at) = p_tahun
      AND (p_bulan IS NULL OR EXTRACT(MONTH FROM created_at) = p_bulan)
    GROUP BY EXTRACT(YEAR FROM created_at), EXTRACT(MONTH FROM created_at), column_name;
END;
$$;

-- PAKAI:
SELECT * FROM fn_laporan(2020);           -- Simpel!
SELECT * FROM fn_laporan(2020, 1);        -- Dengan bulan
SELECT * FROM fn_laporan(2020) WHERE total > 50;  -- Bisa filter!
```

---

## 🔄 PERBANDINGAN PANGGILAN

### PROCEDURE (Kompleks)
```sql
BEGIN;
CALL sp_laporan_pengguna_procedure(2020, 'cur');
FETCH ALL IN "cur";
COMMIT;
-- Hasil: Data dalam REFCURSOR (susah di-proses)
```

### FUNCTION (Simpel)
```sql
SELECT * FROM fn_laporan_pengguna_function(2020);
-- Hasil: JSON array langsung (mudah di-proses)

-- Bisa filter langsung:
SELECT * FROM fn_laporan_pengguna_function(2020) WHERE total > 100;

-- Bisa aggregate lagi:
SELECT code_identity, SUM(total) 
FROM fn_laporan_pengguna_function(2020) 
GROUP BY code_identity;

-- Bisa join dengan tabel lain:
SELECT f.*, t.column
FROM fn_laporan_pengguna_function(2020) f
LEFT JOIN tabel_lain t ON f.id = t.id;
```

---

## 🎁 INTEGRASI APLIKASI

### JavaScript/Node.js dengan FUNCTION
```javascript
const result = await db.query(
  'SELECT * FROM fn_laporan_pengguna($1)',
  [2020]
);
// result.rows = array langsung, mudah di-process
console.log(result.rows);
```

### JavaScript/Node.js dengan PROCEDURE
```javascript
// Kompleks, harus handle cursor
await db.query('BEGIN');
const cur = await db.query('CALL sp_laporan_pengguna($1, $2)', [2020, 'cur']);
const data = await db.query('FETCH ALL IN "cur"');
await db.query('COMMIT');
// Data susah di-extract, perlu parsing cursor
```

---

## ✅ REKOMENDASI FINAL

### Untuk KASUS LAPORAN PENGGUNA BULANAN:

#### ✅ PILIHAN 1: FUNCTION (RECOMMENDED - 90%)
```sql
-- SIMPEL
-- CEPAT
-- MUDAH DI-INTEGRATE KE APLIKASI
-- CUKUP AMAN dengan SECURITY DEFINER

CREATE OR REPLACE FUNCTION fn_laporan_pengguna(
    p_tahun INTEGER DEFAULT EXTRACT(YEAR FROM NOW()),
    p_bulan INTEGER DEFAULT NULL
)
RETURNS TABLE (
    tahun INTEGER,
    bulan INTEGER,
    code_identity VARCHAR,
    jumlah BIGINT,
    persentase NUMERIC
)
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY SELECT ... ;
END;
$$;

-- PAKAI:
SELECT * FROM fn_laporan_pengguna(2020);
```

#### ✅ PILIHAN 2: PROCEDURE (Jika butuh AUDIT LOG)
```sql
-- LOGIC 100% TERSEMBUNYI
-- KEAMANAN MAKSIMAL
-- AUDIT TRAIL TERCATAT
-- Lebih kompleks implementasi

CREATE OR REPLACE PROCEDURE sp_laporan_pengguna(
    p_tahun INTEGER DEFAULT EXTRACT(YEAR FROM NOW()),
    INOUT cur REFCURSOR
)
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
BEGIN
    -- LOG AKSES
    INSERT INTO audit_log VALUES (...);
    
    OPEN cur FOR SELECT ... ;
END;
$$;

-- PAKAI:
BEGIN;
CALL sp_laporan_pengguna(2020, 'cur');
FETCH ALL IN "cur";
COMMIT;
```

---

## 📌 BEST PRACTICE

| Jenis Operasi | Gunakan |
|---------------|---------|
| SELECT / READ (Dashboard, Report) | **FUNCTION** ✅ |
| INSERT / UPDATE / DELETE | **PROCEDURE** ✅ |
| Bulk Batch Processing | **PROCEDURE** ✅ |
| API / Web Application | **FUNCTION** ✅ |
| Data Pipeline / ETL | **PROCEDURE** ✅ |
| Filtering Dinamis | **FUNCTION** ✅ |
| Transaksi Kompleks | **PROCEDURE** ✅ |

---

## 🏆 KESIMPULAN

### FUNCTION Lebih Baik Untuk:
- ✅ Dashboard real-time
- ✅ Laporan yang sering diakses
- ✅ Web application / API
- ✅ Data tidak SUPER sensitif
- ✅ Performa tinggi
- ✅ Clean & simple code

### PROCEDURE Lebih Baik Untuk:
- ✅ Data SANGAT sensitif (+ audit log)
- ✅ Batch process bulk
- ✅ Multi-step transaction
- ✅ Scheduled job / cron
- ✅ Kompleks error handling
- ✅ Kontrol transaksi penuh

**UNTUK KASUS LAPORAN PENGGUNA ABANG: GUNAKAN FUNCTION** 🎯

Alasan:
1. Simpel dipanggil
2. Performa tinggi
3. Mudah di-integrate ke website/dashboard
4. Cukup aman dengan SECURITY DEFINER
5. Bisa filter hasil dinamis
