-- check nama owner database



 SELECT u.usename 
 FROM pg_database d
  JOIN pg_user u ON (d.datdba = u.usesysid)
 WHERE d.datname = (SELECT current_database());



-- rubah owner table

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