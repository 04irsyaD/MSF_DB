
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT schemaname, tablename
        FROM pg_tables
        WHERE schemaname = 'public'
    )
    LOOP
        EXECUTE format('ALTER TABLE %I.%I OWNER TO plustixpostgre;', r.schemaname, r.tablename);
    END LOOP;
END $$;