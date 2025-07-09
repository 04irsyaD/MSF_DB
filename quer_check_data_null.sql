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