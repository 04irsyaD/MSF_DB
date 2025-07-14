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


-- query untuk mengubah data null pada all table

DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT table_schema, table_name, column_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND data_type IN ('character varying', 'text', 'char')
    LOOP
        RAISE NOTICE 'Memproses: %.% (kolom: %)', r.table_schema, r.table_name, r.column_name;

        EXECUTE format(
            'UPDATE %I.%I SET %I = NULL WHERE %I = '''';',
            r.table_schema,
            r.table_name,
            r.column_name,
            r.column_name
        );
    END LOOP;
END$$;
