SELECT 
    n.nspname AS schema_name,
    t.relname AS table_name,
    CASE WHEN pk.conname IS NOT NULL THEN 'YES' ELSE 'NO' END AS has_primary_key,
    array_agg(a.attname ORDER BY a.attnum) FILTER (WHERE a.attname IS NOT NULL) AS primary_key_columns
FROM pg_class t
JOIN pg_namespace n ON n.oid = t.relnamespace
LEFT JOIN pg_constraint pk ON pk.conrelid = t.oid AND pk.contype = 'p'
LEFT JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = ANY(pk.conkey)
WHERE t.relkind = 'r'                 -- hanya tabel biasa (bukan view, index, dsb.)
  AND n.nspname = 'public'       -- ganti dengan schema kamu
GROUP BY n.nspname, t.relname, pk.conname
ORDER BY t.relname;