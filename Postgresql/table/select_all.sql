SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'your_schema_name'
  AND table_type = 'BASE TABLE';
