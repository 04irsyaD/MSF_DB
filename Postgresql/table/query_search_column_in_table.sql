SELECT table_name, column_name
FROM information_schema.columns
WHERE column_name = 'VRSN'
  AND table_schema = 'public';
-- You can change 'VRSN' to any column name you want to search for
-- and 'public' to the desired schema if needed.