-- PostgreSQL stored procedure example
DO $$
DECLARE
    rec RECORD;
    sql_query TEXT;
    result_count INTEGER;
BEGIN
    FOR rec IN 
        SELECT table_name 
        FROM information_schema.columns 
        WHERE table_schema = 'nama_schema' 
        AND column_name = 'nama_kolom'
    LOOP
        sql_query := 'SELECT COUNT(*) FROM ' || rec.table_name || ' WHERE nama_kolom IS NOT NULL';
        EXECUTE sql_query INTO result_count;
        
        RAISE NOTICE 'Table: %, Non-null count: %', rec.table_name, result_count;
    END LOOP;
END $$;

----- Query to check for tables with no rows in a specific schema
SELECT 
    schemaname,
    tablename,
    n_tup_ins as total_rows
FROM pg_stat_user_tables 
WHERE schemaname = 'nama_schema'
AND n_tup_ins = 0
ORDER BY tablename;


--- v2
-- PostgreSQL
SELECT 
    t.table_name,
    COALESCE(s.n_tup_ins, 0) as row_count
FROM information_schema.tables t
LEFT JOIN pg_stat_user_tables s ON t.table_name = s.relname
WHERE t.table_schema = 'nama_schema'
AND t.table_type = 'BASE TABLE'
AND COALESCE(s.n_tup_ins, 0) = 0;