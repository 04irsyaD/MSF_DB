-- ============================================
-- Knowledge Base untuk SQL Documentation
-- ============================================
-- Tabel ini menyimpan deskripsi custom untuk tabel dan kolom
-- Jika tidak ada di sini, AI akan generate otomatis
-- 
-- Author  : 04irsyaD
-- Created : 2026-02-02
-- ============================================

-- Drop jika sudah ada (hati-hati di production!)
-- DROP TABLE IF EXISTS doc_knowledge_base;

CREATE TABLE IF NOT EXISTS doc_knowledge_base (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    column_name VARCHAR(100),           -- NULL = deskripsi tabel, bukan kolom
    description TEXT NOT NULL,
    category VARCHAR(50),               -- Kategori: 'master', 'transaction', 'log', etc
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by VARCHAR(100),
    
    -- Unique constraint: 1 deskripsi per tabel/kolom
    CONSTRAINT uq_knowledge_base UNIQUE(table_name, column_name)
);

-- Index untuk performa query
CREATE INDEX IF NOT EXISTS idx_kb_table_name ON doc_knowledge_base(table_name);
CREATE INDEX IF NOT EXISTS idx_kb_column_name ON doc_knowledge_base(column_name);

-- Comment
COMMENT ON TABLE doc_knowledge_base IS 'Knowledge base untuk deskripsi tabel dan kolom database';
COMMENT ON COLUMN doc_knowledge_base.table_name IS 'Nama tabel. Gunakan "*" untuk common columns';
COMMENT ON COLUMN doc_knowledge_base.column_name IS 'Nama kolom. NULL jika deskripsi tabel';
COMMENT ON COLUMN doc_knowledge_base.description IS 'Deskripsi dalam Bahasa Indonesia';

-- ============================================
-- INSERT DATA: Common Columns
-- ============================================
-- Kolom-kolom umum yang berlaku untuk semua tabel
-- Gunakan table_name = '*'

INSERT INTO doc_knowledge_base (table_name, column_name, description, category) VALUES
-- Primary Key & ID
('*', 'id', 'Primary key unik', 'common'),
('*', 'uuid', 'Identifier unik UUID', 'common'),

-- Timestamps
('*', 'created_at', 'Waktu pembuatan record', 'common'),
('*', 'updated_at', 'Waktu update terakhir', 'common'),
('*', 'deleted_at', 'Waktu penghapusan (soft delete)', 'common'),

-- Audit fields
('*', 'created_by', 'ID user pembuat', 'common'),
('*', 'created_by_id', 'ID user pembuat', 'common'),
('*', 'updated_by', 'ID user pengubah', 'common'),
('*', 'updated_by_id', 'ID user pengubah', 'common'),
('*', 'deleted_by', 'ID user penghapus', 'common'),
('*', 'deleted_by_id', 'ID user penghapus', 'common'),

-- Status flags
('*', 'is_active', 'Status aktif record', 'common'),
('*', 'is_deleted', 'Status terhapus (soft delete)', 'common'),
('*', 'status', 'Status record', 'common'),

-- Common fields
('*', 'code', 'Kode unik', 'common'),
('*', 'name', 'Nama', 'common'),
('*', 'description', 'Deskripsi', 'common'),
('*', 'notes', 'Catatan tambahan', 'common'),
('*', 'remarks', 'Keterangan', 'common'),

-- Ordering
('*', 'sort_order', 'Urutan tampilan', 'common'),
('*', 'order_data', 'Urutan data', 'common'),
('*', 'sequence', 'Nomor urut', 'common'),

-- Hierarchy
('*', 'parent_id', 'FK ke parent', 'common'),
('*', 'level', 'Level hierarki', 'common'),
('*', 'path', 'Path hierarki', 'common'),

-- Contact
('*', 'email', 'Alamat email', 'common'),
('*', 'phone', 'Nomor telepon', 'common'),
('*', 'phone_number', 'Nomor telepon', 'common'),
('*', 'address', 'Alamat lengkap', 'common'),

-- Files
('*', 'file_name', 'Nama file', 'common'),
('*', 'file_path', 'Path lokasi file', 'common'),
('*', 'file_size', 'Ukuran file', 'common'),
('*', 'file_type', 'Tipe/ekstensi file', 'common'),
('*', 'mime_type', 'MIME type file', 'common'),

-- Dates
('*', 'start_date', 'Tanggal mulai', 'common'),
('*', 'end_date', 'Tanggal selesai', 'common'),
('*', 'effective_date', 'Tanggal berlaku', 'common'),
('*', 'expired_date', 'Tanggal kedaluwarsa', 'common')

ON CONFLICT (table_name, column_name) DO UPDATE 
SET description = EXCLUDED.description,
    updated_at = NOW();

-- ============================================
-- INSERT DATA: Contoh Tabel Spesifik
-- ============================================
-- Tambahkan deskripsi untuk tabel dan kolom spesifik
-- Ini akan override common columns dan AI

-- Contoh: Tabel sm_user
INSERT INTO doc_knowledge_base (table_name, column_name, description, category) VALUES
('sm_user', NULL, 'Tabel master data pengguna sistem', 'master'),
('sm_user', 'nip', 'Nomor Induk Pegawai', 'master'),
('sm_user', 'username', 'Username untuk login', 'master'),
('sm_user', 'full_name', 'Nama lengkap pengguna', 'master'),
('sm_user', 'role_id', 'FK ke tabel role', 'master'),
('sm_user', 'last_login', 'Waktu login terakhir', 'master')

ON CONFLICT (table_name, column_name) DO UPDATE 
SET description = EXCLUDED.description,
    updated_at = NOW();

-- Contoh: Tabel sm_role  
INSERT INTO doc_knowledge_base (table_name, column_name, description, category) VALUES
('sm_role', NULL, 'Tabel master role/hak akses pengguna', 'master'),
('sm_role', 'role_code', 'Kode unik role', 'master'),
('sm_role', 'role_name', 'Nama role', 'master')

ON CONFLICT (table_name, column_name) DO UPDATE 
SET description = EXCLUDED.description,
    updated_at = NOW();

-- ============================================
-- QUERY HELPER: View untuk lookup
-- ============================================
CREATE OR REPLACE VIEW v_knowledge_base AS
SELECT 
    table_name,
    column_name,
    description,
    category,
    CASE 
        WHEN table_name = '*' THEN 'Common'
        WHEN column_name IS NULL THEN 'Table'
        ELSE 'Column'
    END as type
FROM doc_knowledge_base
ORDER BY 
    CASE WHEN table_name = '*' THEN 1 ELSE 0 END,
    table_name, 
    column_name NULLS FIRST;

-- ============================================
-- FUNCTION: Get description dengan fallback
-- ============================================
CREATE OR REPLACE FUNCTION get_doc_description(
    p_table_name VARCHAR,
    p_column_name VARCHAR DEFAULT NULL
) RETURNS TEXT AS $$
DECLARE
    v_description TEXT;
BEGIN
    -- 1. Cari exact match (tabel + kolom spesifik)
    SELECT description INTO v_description
    FROM doc_knowledge_base
    WHERE table_name = p_table_name 
      AND (column_name = p_column_name OR (p_column_name IS NULL AND column_name IS NULL))
    LIMIT 1;
    
    IF v_description IS NOT NULL THEN
        RETURN v_description;
    END IF;
    
    -- 2. Fallback ke common columns (table_name = '*')
    IF p_column_name IS NOT NULL THEN
        SELECT description INTO v_description
        FROM doc_knowledge_base
        WHERE table_name = '*' AND column_name = p_column_name
        LIMIT 1;
        
        IF v_description IS NOT NULL THEN
            RETURN v_description;
        END IF;
    END IF;
    
    -- 3. Tidak ditemukan
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TEST
-- ============================================
-- SELECT get_doc_description('sm_user', 'nip');         -- 'Nomor Induk Pegawai' (specific)
-- SELECT get_doc_description('sm_user', 'created_at');  -- 'Waktu pembuatan record' (common)
-- SELECT get_doc_description('sm_user', 'xyz');         -- NULL (tidak ada, AI handle)
-- SELECT get_doc_description('sm_user', NULL);          -- 'Tabel master...' (table desc)

-- ============================================
-- CARA TAMBAH DATA BARU
-- ============================================
-- 
-- -- Deskripsi tabel:
-- INSERT INTO doc_knowledge_base (table_name, column_name, description) 
-- VALUES ('nama_tabel', NULL, 'Deskripsi tabel');
-- 
-- -- Deskripsi kolom spesifik:
-- INSERT INTO doc_knowledge_base (table_name, column_name, description) 
-- VALUES ('nama_tabel', 'nama_kolom', 'Deskripsi kolom');
-- 
-- -- Common column (berlaku semua tabel):
-- INSERT INTO doc_knowledge_base (table_name, column_name, description) 
-- VALUES ('*', 'nama_kolom', 'Deskripsi kolom');
