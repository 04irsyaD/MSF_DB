-- Script untuk memeriksa tabel dan kolom yang memiliki data NULL di PostgreSQL

DO $$
DECLARE
    r RECORD;
    c RECORD;
    v_sql TEXT;
    has_null BOOLEAN;
BEGIN
    FOR r IN
        SELECT table_schema, table_name
        FROM information_schema.tables
        WHERE table_type = 'BASE TABLE'
          AND table_schema NOT IN ('pg_catalog', 'information_schema')
    LOOP
        has_null := FALSE;

        -- Loop kolom untuk tabel tersebut
        FOR c IN
            SELECT column_name
            FROM information_schema.columns
            WHERE table_schema = r.table_schema
              AND table_name = r.table_name
        LOOP
            v_sql := FORMAT(
                'SELECT 1 FROM %I.%I WHERE %I IS NULL LIMIT 1',
                r.table_schema, r.table_name, c.column_name
            );

            BEGIN
                EXECUTE v_sql;
                IF FOUND THEN
                    has_null := TRUE;
                    EXIT; -- satu kolom NULL cukup, lanjut ke tabel berikutnya
                END IF;
            EXCEPTION
                WHEN OTHERS THEN
                    CONTINUE; -- Lewati error
            END;
        END LOOP;

        IF has_null THEN
            RAISE NOTICE 'TABEL DENGAN DATA NULL: %.%', r.table_schema, r.table_name;
        END IF;
    END LOOP;
END $$;