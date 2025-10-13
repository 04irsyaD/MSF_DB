-- This SQL query retrieves detailed information about all columns in all tables
-- ini query untuk check data di dalam table beserta deskripsinya

SELECT 
    c.table_name,
    c.column_name,
    c.data_type,
    c.character_maximum_length,
    c.is_nullable,
    pgd.description AS column_description
FROM information_schema.columns c
LEFT JOIN pg_catalog.pg_statio_all_tables st
       ON c.table_schema = st.schemaname 
      AND c.table_name = st.relname
LEFT JOIN pg_catalog.pg_description pgd 
       ON pgd.objoid = st.relid 
      AND pgd.objsubid = c.ordinal_position
WHERE c.table_schema = 'public'
ORDER BY c.table_name, c.ordinal_position;