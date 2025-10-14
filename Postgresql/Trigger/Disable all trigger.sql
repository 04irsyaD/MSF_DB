DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT quote_ident(n.nspname) || '.' || quote_ident(c.relname) AS table_name
        FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relkind = 'r'  -- hanya tabel biasa
          AND n.nspname = 'public'  -- ganti dengan nama schema kamu jika perlu
    LOOP
        EXECUTE 'ALTER TABLE ' || r.table_name || ' DISABLE TRIGGER ALL;';
    END LOOP;
END;
$$;
-- This script disables all triggers on all tables in the 'public' schema.
-- You can change 'public' to the desired schema if needed.
-- Use with caution, as this will affect all triggers in the specified schema.\

ALTER TABLE nama_tabel DISABLE TRIGGER nama_trigger;
