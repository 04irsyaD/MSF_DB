SELECT table_name, column_name
FROM information_schema.columns
WHERE column_name = 'SNBUCD'
  AND table_schema = 'public';  -- atau schema lain jika tidak pakai public
-- Ganti 'public' dengan schema yang sesuai jika perlu
-- Jika ingin mencari di semua schema, hapus kondisi table_schema
-- Jika ingin mencari kolom dengan nama lain, ganti 'SNBUCD' dengan nama kolom yang diinginkan
-- Hasil akan menampilkan nama tabel dan kolom yang sesuai dengan kriteria