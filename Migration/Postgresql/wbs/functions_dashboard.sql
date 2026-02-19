-- ============================================
-- FUNCTIONS DASHBOARD WBS DENGAN PARAMETER TAHUN
-- ============================================

-- ============================================
-- 1. FUNCTION: Persentase Concern/Unconcern
-- ============================================
CREATE OR REPLACE FUNCTION fn_dashboard_concern_percentage(
    p_year INTEGER DEFAULT NULL  -- NULL = semua tahun
)
RETURNS TABLE (
    status VARCHAR,
    jumlah BIGINT,
    persentase NUMERIC
)
LANGUAGE SQL STABLE
AS $$
    SELECT 
        mac.name_concern::VARCHAR AS status,
        COUNT(*) AS jumlah,
        ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) AS persentase
    FROM "T_REPORT" tr 
    RIGHT JOIN "T_REPORT_CONCERN" trc ON tr.id = trc.report_id
    LEFT JOIN "M_ACTION_CONCERN" mac ON trc.action_id = mac.id 
    WHERE tr.deleted_at IS NULL
      AND (p_year IS NULL OR EXTRACT(YEAR FROM tr.created_at) = p_year)
    GROUP BY mac.name_concern
    ORDER BY jumlah DESC;
$$;

-- Cara pakai:
-- SELECT * FROM fn_dashboard_concern_percentage(2024);  -- Filter tahun 2024
-- SELECT * FROM fn_dashboard_concern_percentage();       -- Semua tahun


-- ============================================
-- 2. FUNCTION: Summary Pengaduan/Pemeriksaan/Validasi
-- ============================================
CREATE OR REPLACE FUNCTION fn_dashboard_report_summary(
    p_year INTEGER DEFAULT NULL
)
RETURNS TABLE (
    total_pengaduan BIGINT,
    total_pemeriksaan BIGINT,
    total_validasi BIGINT,
    total_tidak_sesuai BIGINT,
    total_cek_kelengkapan BIGINT
)
LANGUAGE SQL STABLE
AS $$
    SELECT 
        COUNT(DISTINCT tr.id) AS total_pengaduan,
        COUNT(DISTINCT tri.id) AS total_pemeriksaan,
        COUNT(DISTINCT trv.id) AS total_validasi,
        COUNT(msr.id) AS total_tidak_sesuai,
        COUNT(msr2.id) AS total_cek_kelengkapan
    FROM "T_REPORT" tr 
    LEFT JOIN "T_REPORT_INSPECTION" tri 
        ON tr.id = tri.report_id AND tri.deleted_at IS NULL
    LEFT JOIN "T_REPORT_VALIDATION" trv 
        ON tr.id = trv.report_id AND trv.deleted_at IS NULL
    LEFT JOIN "M_STATUS_REPORT" msr 
        ON tr.status_report_id = msr.id AND msr.name_status = 'TIDAK SESUAI'
    LEFT JOIN "M_STATUS_REPORT" msr2 
        ON tr.status_report_id = msr2.id AND msr2.name_status IN ('NEW', 'DRAFT')
    WHERE tr.deleted_at IS NULL
      AND (p_year IS NULL OR EXTRACT(YEAR FROM tr.created_at) = p_year);
$$;

-- Cara pakai:
-- SELECT * FROM fn_dashboard_report_summary(2024);
-- SELECT * FROM fn_dashboard_report_summary();


-- ============================================
-- 3. FUNCTION: Jenis Pengaduan by Identity
-- ============================================
CREATE OR REPLACE FUNCTION fn_dashboard_report_by_identity(
    p_year INTEGER DEFAULT NULL
)
RETURNS TABLE (
    jenis_laporan VARCHAR,
    jenis_pengguna VARCHAR,
    jumlah_pengguna BIGINT,
    total_pengaduan BIGINT
)
LANGUAGE SQL STABLE
AS $$
    SELECT 
        mtr.name_type_short_idn::VARCHAR AS jenis_laporan,
        mi.identity_title_eng::VARCHAR AS jenis_pengguna,
        COUNT(mi.id) AS jumlah_pengguna,
        COUNT(DISTINCT mtr.id) AS total_pengaduan
    FROM "T_REPORT" tr 
    LEFT JOIN "M_IDENTITY" mi ON tr.identity_id = mi.id 
    LEFT JOIN "R_SELECT_TYPE_REPORT" rstr ON tr.id = rstr.report_id 
    LEFT JOIN "M_TYPE_REPORT" mtr ON rstr.type_report_id = mtr.id 
    WHERE tr.deleted_at IS NULL
      AND (p_year IS NULL OR EXTRACT(YEAR FROM tr.created_at) = p_year)
    GROUP BY mi.identity_title_eng, mtr.name_type_short_idn;
$$;

-- Cara pakai:
-- SELECT * FROM fn_dashboard_report_by_identity(2024);


-- ============================================
-- 4. FUNCTION: Total Pengguna per Bulan
-- ============================================
CREATE OR REPLACE FUNCTION fn_dashboard_user_monthly(
    p_year INTEGER DEFAULT NULL
)
RETURNS TABLE (
    tahun INTEGER,
    bulan INTEGER,
    nama_bulan TEXT,
    jenis_pengguna VARCHAR,
    jumlah_pengguna BIGINT
)
LANGUAGE SQL STABLE
AS $$
    SELECT 
        EXTRACT(YEAR FROM tr.created_at)::INTEGER AS tahun,
        EXTRACT(MONTH FROM tr.created_at)::INTEGER AS bulan,
        TO_CHAR(tr.created_at, 'FMMonth') AS nama_bulan,
        mi.identity_title_eng::VARCHAR AS jenis_pengguna,
        COUNT(mi.id) AS jumlah_pengguna
    FROM "T_REPORT" tr 
    LEFT JOIN "M_IDENTITY" mi ON tr.identity_id = mi.id
    WHERE tr.deleted_at IS NULL
      AND (p_year IS NULL OR EXTRACT(YEAR FROM tr.created_at) = p_year)
    GROUP BY 
        EXTRACT(YEAR FROM tr.created_at), 
        EXTRACT(MONTH FROM tr.created_at), 
        TO_CHAR(tr.created_at, 'FMMonth'), 
        mi.identity_title_eng
    ORDER BY tahun DESC, bulan ASC, jumlah_pengguna DESC;
$$;

-- Cara pakai:
-- SELECT * FROM fn_dashboard_user_monthly(2024);
-- SELECT * FROM fn_dashboard_user_monthly();


-- ============================================
-- 5. FUNCTION: Filter dengan Range Tanggal (Lebih Fleksibel)
-- ============================================
CREATE OR REPLACE FUNCTION fn_dashboard_report_summary_range(
    p_start_date DATE DEFAULT NULL,
    p_end_date DATE DEFAULT NULL
)
RETURNS TABLE (
    total_pengaduan BIGINT,
    total_pemeriksaan BIGINT,
    total_validasi BIGINT,
    total_tidak_sesuai BIGINT,
    total_cek_kelengkapan BIGINT
)
LANGUAGE SQL STABLE
AS $$
    SELECT 
        COUNT(DISTINCT tr.id) AS total_pengaduan,
        COUNT(DISTINCT tri.id) AS total_pemeriksaan,
        COUNT(DISTINCT trv.id) AS total_validasi,
        COUNT(msr.id) AS total_tidak_sesuai,
        COUNT(msr2.id) AS total_cek_kelengkapan
    FROM "T_REPORT" tr 
    LEFT JOIN "T_REPORT_INSPECTION" tri 
        ON tr.id = tri.report_id AND tri.deleted_at IS NULL
    LEFT JOIN "T_REPORT_VALIDATION" trv 
        ON tr.id = trv.report_id AND trv.deleted_at IS NULL
    LEFT JOIN "M_STATUS_REPORT" msr 
        ON tr.status_report_id = msr.id AND msr.name_status = 'TIDAK SESUAI'
    LEFT JOIN "M_STATUS_REPORT" msr2 
        ON tr.status_report_id = msr2.id AND msr2.name_status IN ('NEW', 'DRAFT')
    WHERE tr.deleted_at IS NULL
      AND (p_start_date IS NULL OR tr.created_at >= p_start_date)
      AND (p_end_date IS NULL OR tr.created_at <= p_end_date);
$$;

-- Cara pakai:
-- SELECT * FROM fn_dashboard_report_summary_range('2024-01-01', '2024-12-31');
-- SELECT * FROM fn_dashboard_report_summary_range('2024-06-01', '2024-06-30');  -- Bulan Juni


-- ============================================
-- DROP FUNCTIONS (jika perlu hapus)
-- ============================================
-- DROP FUNCTION IF EXISTS fn_dashboard_concern_percentage(INTEGER);
-- DROP FUNCTION IF EXISTS fn_dashboard_report_summary(INTEGER);
-- DROP FUNCTION IF EXISTS fn_dashboard_report_by_identity(INTEGER);
-- DROP FUNCTION IF EXISTS fn_dashboard_user_monthly(INTEGER);
-- DROP FUNCTION IF EXISTS fn_dashboard_report_summary_range(DATE, DATE);
