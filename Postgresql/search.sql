CREATE OR REPLACE FUNCTION search_all(keyword TEXT)
RETURNS TABLE (
    location TEXT,
    row_data JSONB
) AS $$
DECLARE
    r RECORD;
    v_sql TEXT;
BEGIN
    FOR r IN
        SELECT table_schema, table_name, column_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name NOT LIKE 'pg_%'
          AND data_type IN ('text', 'character varying', 'character', 'citext')
    LOOP
        v_sql := format(
            'SELECT %L AS location, to_jsonb(t) AS row_data
             FROM %I.%I t
             WHERE %I ILIKE %L',
            r.table_schema || '.' || r.table_name || '.' || r.column_name,
            r.table_schema, r.table_name,
            r.column_name,
            '%' || keyword || '%'
        );

        RETURN QUERY EXECUTE v_sql;
    END LOOP;
END;
$$ LANGUAGE plpgsql;


-- now you can search across all text columns in all tables
SELECT * FROM search_all('TR-1-LSM-1');
-- use this to search by data
