-- ============================================
-- SCRIPT GENERATE DUMMY DATA UNTUK TEST PERFORMA
-- ============================================
-- ⚠️ JALANKAN DI DATABASE TEST/DEV, JANGAN DI PRODUCTION!
-- ============================================

-- ============================================
-- 1. Cek struktur tabel dulu (opsional)
-- ============================================
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'T_REPORT';
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'T_REPORT_CONCERN';
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'M_ACTION_CONCERN';
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'M_IDENTITY';
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'M_STATUS_REPORT';

-- ============================================
-- 2. Insert Master Data (jika belum ada)
-- ============================================

-- Master Action Concern
INSERT INTO "M_ACTION_CONCERN" (id, name_concern, created_at, updated_at)
SELECT gen.id, 
       CASE gen.id 
           WHEN 1 THEN 'CONCERN'
           WHEN 2 THEN 'UNCONCERN'
           WHEN 3 THEN 'PENDING'
       END,
       NOW(), NOW()
FROM generate_series(1, 3) AS gen(id)
WHERE NOT EXISTS (SELECT 1 FROM "M_ACTION_CONCERN" WHERE id = gen.id);

-- Master Identity
INSERT INTO "M_IDENTITY" (id, identity_title_eng, created_at, updated_at)
SELECT gen.id,
       CASE gen.id
           WHEN 1 THEN 'Employee'
           WHEN 2 THEN 'Vendor'
           WHEN 3 THEN 'Customer'
           WHEN 4 THEN 'Anonymous'
           WHEN 5 THEN 'Public'
       END,
       NOW(), NOW()
FROM generate_series(1, 5) AS gen(id)
WHERE NOT EXISTS (SELECT 1 FROM "M_IDENTITY" WHERE id = gen.id);

-- Master Status Report
INSERT INTO "M_STATUS_REPORT" (id, name_status, created_at, updated_at)
SELECT gen.id,
       CASE gen.id
           WHEN 1 THEN 'NEW'
           WHEN 2 THEN 'DRAFT'
           WHEN 3 THEN 'TIDAK SESUAI'
           WHEN 4 THEN 'SESUAI'
           WHEN 5 THEN 'CLOSED'
       END,
       NOW(), NOW()
FROM generate_series(1, 5) AS gen(id)
WHERE NOT EXISTS (SELECT 1 FROM "M_STATUS_REPORT" WHERE id = gen.id);

-- Master Type Report
INSERT INTO "M_TYPE_REPORT" (id, name_type_short_idn, created_at, updated_at)
SELECT gen.id,
       CASE gen.id
           WHEN 1 THEN 'FRAUD'
           WHEN 2 THEN 'KORUPSI'
           WHEN 3 THEN 'PELECEHAN'
           WHEN 4 THEN 'LAINNYA'
       END,
       NOW(), NOW()
FROM generate_series(1, 4) AS gen(id)
WHERE NOT EXISTS (SELECT 1 FROM "M_TYPE_REPORT" WHERE id = gen.id);


-- ============================================
-- 3. Generate Dummy T_REPORT (100.000 rows)
-- ============================================
-- Ubah angka 100000 sesuai kebutuhan test
-- Prefix "TEST-" untuk membedakan data dummy dengan data asli

DO $$
DECLARE
    batch_size INT := 10000;  -- Insert per batch
    total_rows INT := 100000; -- Total dummy data
    i INT := 0;
    v_identity_ids UUID[];
    v_status_ids UUID[];
BEGIN
    -- Ambil existing UUIDs dari master tables
    SELECT ARRAY_AGG(id) INTO v_identity_ids FROM "M_IDENTITY";
    SELECT ARRAY_AGG(id) INTO v_status_ids FROM "M_STATUS_REPORT";
    
    WHILE i < total_rows LOOP
        INSERT INTO "T_REPORT" (
            id,
            trid,
            passcode,
            wbs_code,
            identity_id,
            status_report_id,
            name,
            email,
            instution,
            phone_number,
            created_at,
            updated_at,
            deleted_at,
            is_active,
            is_public
        )
        SELECT 
            uuid_generate_v4(),
            -- trid: TEST-TRID-00000001
            'TEST-TRID-' || LPAD((i + row_num)::TEXT, 8, '0'),
            -- passcode: random 6 digit
            LPAD((RANDOM() * 999999)::INT::TEXT, 6, '0'),
            -- wbs_code: TEST-00000001
            'TEST-' || LPAD((i + row_num)::TEXT, 8, '0'),
            -- identity_id dari master table (UUID)
            v_identity_ids[1 + (RANDOM() * (ARRAY_LENGTH(v_identity_ids, 1) - 1))::INT],
            -- status_report_id dari master table (UUID)
            v_status_ids[1 + (RANDOM() * (ARRAY_LENGTH(v_status_ids, 1) - 1))::INT],
            -- name
            'Test User ' || (i + row_num),
            -- email
            'testuser' || (i + row_num) || '@test.com',
            -- instution
            'Test Institution ' || ((RANDOM() * 10)::INT + 1),
            -- phone_number
            '08' || LPAD((RANDOM() * 999999999)::BIGINT::TEXT, 10, '0'),
            -- created_at: Random date dalam 3 tahun terakhir
            NOW() - (RANDOM() * INTERVAL '1095 days'),
            -- updated_at
            NOW(),
            -- deleted_at: 5% data deleted
            CASE WHEN RANDOM() < 0.05 THEN NOW() ELSE NULL END,
            -- is_active: 95% active
            CASE WHEN RANDOM() < 0.95 THEN TRUE ELSE FALSE END,
            -- is_public: 80% public
            CASE WHEN RANDOM() < 0.80 THEN TRUE ELSE FALSE END
        FROM generate_series(1, batch_size) AS row_num;
        
        i := i + batch_size;
        RAISE NOTICE 'Inserted % rows...', i;
    END LOOP;
END $$;


-- ============================================
-- 4. Generate Dummy T_REPORT_CONCERN
-- ============================================
-- Setiap report punya 1-2 concern

INSERT INTO "T_REPORT_CONCERN" (id, report_id, action_id, created_at, updated_at)
SELECT 
    uuid_generate_v4(),
    tr.id,
    (RANDOM() * 2 + 1)::INT,  -- action_id 1-3
    tr.created_at,
    NOW()
FROM "T_REPORT" tr
WHERE NOT EXISTS (
    SELECT 1 FROM "T_REPORT_CONCERN" trc WHERE trc.report_id = tr.id
);


-- ============================================
-- 5. Generate Dummy T_REPORT_INSPECTION
-- ============================================
-- 60% report punya inspection

INSERT INTO "T_REPORT_INSPECTION" (id, report_id, created_at, updated_at, deleted_at)
SELECT 
    uuid_generate_v4(),
    tr.id,
    tr.created_at + INTERVAL '7 days',
    NOW(),
    NULL
FROM "T_REPORT" tr
WHERE RANDOM() < 0.6  -- 60% report
AND NOT EXISTS (
    SELECT 1 FROM "T_REPORT_INSPECTION" tri WHERE tri.report_id = tr.id
);


-- ============================================
-- 6. Generate Dummy T_REPORT_VALIDATION
-- ============================================
-- 40% report punya validation

INSERT INTO "T_REPORT_VALIDATION" (id, report_id, created_at, updated_at, deleted_at)
SELECT 
    uuid_generate_v4(),
    tr.id,
    tr.created_at + INTERVAL '14 days',
    NOW(),
    NULL
FROM "T_REPORT" tr
WHERE RANDOM() < 0.4  -- 40% report
AND NOT EXISTS (
    SELECT 1 FROM "T_REPORT_VALIDATION" trv WHERE trv.report_id = tr.id
);


-- ============================================
-- 7. Generate Dummy R_SELECT_TYPE_REPORT
-- ============================================

INSERT INTO "R_SELECT_TYPE_REPORT" (id, report_id, type_report_id, created_at, updated_at)
SELECT 
    uuid_generate_v4(),
    tr.id,
    (RANDOM() * 3 + 1)::INT,  -- type_report_id 1-4
    tr.created_at,
    NOW()
FROM "T_REPORT" tr
WHERE NOT EXISTS (
    SELECT 1 FROM "R_SELECT_TYPE_REPORT" rstr WHERE rstr.report_id = tr.id
);


-- ============================================
-- 8. Verifikasi Data
-- ============================================
SELECT 'T_REPORT' AS table_name, COUNT(*) AS total FROM "T_REPORT"
UNION ALL
SELECT 'T_REPORT_CONCERN', COUNT(*) FROM "T_REPORT_CONCERN"
UNION ALL
SELECT 'T_REPORT_INSPECTION', COUNT(*) FROM "T_REPORT_INSPECTION"
UNION ALL
SELECT 'T_REPORT_VALIDATION', COUNT(*) FROM "T_REPORT_VALIDATION"
UNION ALL
SELECT 'R_SELECT_TYPE_REPORT', COUNT(*) FROM "R_SELECT_TYPE_REPORT";


-- ============================================
-- 9. TEST PERFORMA FUNCTION
-- ============================================

-- Test 1: Concern Percentage
EXPLAIN ANALYZE SELECT * FROM fn_dashboard_concern_percentage(2025);
EXPLAIN ANALYZE SELECT * FROM fn_dashboard_concern_percentage(2024);
EXPLAIN ANALYZE SELECT * FROM fn_dashboard_concern_percentage();  -- All years

-- Test 2: Report Summary
EXPLAIN ANALYZE SELECT * FROM fn_dashboard_report_summary(2025);
EXPLAIN ANALYZE SELECT * FROM fn_dashboard_report_summary();

-- Test 3: Report by Identity
EXPLAIN ANALYZE SELECT * FROM fn_dashboard_report_by_identity(2025);

-- Test 4: User Monthly
EXPLAIN ANALYZE SELECT * FROM fn_dashboard_user_monthly(2025);

-- Test 5: Range Date
EXPLAIN ANALYZE SELECT * FROM fn_dashboard_report_summary_range('2025-01-01', '2025-12-31');


-- ============================================
-- 10. CLEANUP - Hapus Dummy Data (HATI-HATI!)
-- ============================================
-- ⚠️ UNCOMMENT JIKA MAU HAPUS DUMMY DATA
-- Data dummy diidentifikasi dari wbs_code LIKE 'TEST-%'

-- DELETE FROM "R_SELECT_TYPE_REPORT" WHERE report_id IN (SELECT id FROM "T_REPORT" WHERE wbs_code LIKE 'TEST-%');
-- DELETE FROM "T_REPORT_VALIDATION" WHERE report_id IN (SELECT id FROM "T_REPORT" WHERE wbs_code LIKE 'TEST-%');
-- DELETE FROM "T_REPORT_INSPECTION" WHERE report_id IN (SELECT id FROM "T_REPORT" WHERE wbs_code LIKE 'TEST-%');
-- DELETE FROM "T_REPORT_CONCERN" WHERE report_id IN (SELECT id FROM "T_REPORT" WHERE wbs_code LIKE 'TEST-%');
-- DELETE FROM "T_REPORT" WHERE wbs_code LIKE 'TEST-%';

-- VACUUM ANALYZE "T_REPORT";
-- VACUUM ANALYZE "T_REPORT_CONCERN";
-- VACUUM ANALYZE "T_REPORT_INSPECTION";
-- VACUUM ANALYZE "T_REPORT_VALIDATION";
