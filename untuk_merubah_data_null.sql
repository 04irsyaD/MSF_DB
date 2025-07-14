DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 't_irisklist'
          AND table_schema = 'public'
          AND data_type IN ('character varying', 'text', 'char')
    LOOP
        RAISE NOTICE 'Mengubah kolom: %', r.column_name;
        EXECUTE format(
            'UPDATE t_irisklist SET %I = NULL WHERE %I = '''';',
            r.column_name, r.column_name
        );
    END LOOP;
END$$;