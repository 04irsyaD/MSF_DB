SELECT table_name, column_name
FROM information_schema.columns
WHERE column_name = 'SNBUCD'
  AND table_schema = 'nama_database';
