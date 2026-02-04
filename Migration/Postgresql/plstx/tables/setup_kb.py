"""Setup Knowledge Base - Run once"""
import psycopg2

DB_CONFIG = {
    "host": "localhost",
    "port": 5414,
    "database": "knowledge_db",
    "user": "postgres",
    "password": "1234"
}

SQL_STATEMENTS = [
    # Create table for columns/tables
    """
    CREATE TABLE IF NOT EXISTS doc_knowledge_base (
        id SERIAL PRIMARY KEY,
        table_name VARCHAR(100) NOT NULL,
        column_name VARCHAR(100),
        description TEXT NOT NULL,
        category VARCHAR(50),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        CONSTRAINT uq_knowledge_base UNIQUE(table_name, column_name)
    )
    """,
    
    # Create table for PREFIX PATTERNS (t_m_, t_t_, L_, etc)
    """
    CREATE TABLE IF NOT EXISTS doc_prefix_patterns (
        id SERIAL PRIMARY KEY,
        prefix VARCHAR(50) NOT NULL UNIQUE,
        description TEXT NOT NULL,
        category VARCHAR(50),
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
    )
    """,
    
    # Create indexes
    "CREATE INDEX IF NOT EXISTS idx_kb_table_name ON doc_knowledge_base(table_name)",
    "CREATE INDEX IF NOT EXISTS idx_kb_column_name ON doc_knowledge_base(column_name)",
    "CREATE INDEX IF NOT EXISTS idx_prefix_pattern ON doc_prefix_patterns(prefix)",
]

# Table/Column prefix patterns
PREFIX_PATTERNS = [
    # Table prefixes
    ('t_m_', 'Tabel Master', 'table'),
    ('t_t_', 'Tabel Transaksi', 'table'),
    ('t_r_', 'Tabel Relasi/Reference', 'table'),
    ('t_h_', 'Tabel History', 'table'),
    ('t_l_', 'Tabel Log', 'table'),
    ('m_', 'Master Data', 'table'),
    ('M_', 'Master Data', 'table'),
    ('L_', 'Log Data', 'table'),
    ('l_', 'Log Data', 'table'),
    ('H_', 'History Data', 'table'),
    ('h_', 'History Data', 'table'),
    ('R_', 'Reference/Relasi', 'table'),
    ('r_', 'Reference/Relasi', 'table'),
    ('TRX_', 'Transaksi', 'table'),
    ('trx_', 'Transaksi', 'table'),
    ('REF_', 'Reference Data', 'table'),
    ('ref_', 'Reference Data', 'table'),
    ('SM_', 'System Module', 'table'),
    ('sm_', 'System Module', 'table'),
]

# Common columns data
COMMON_COLUMNS = [
    ('*', 'id', 'Primary key unik'),
    ('*', 'uuid', 'Identifier unik UUID'),
    ('*', 'created_at', 'Waktu pembuatan record'),
    ('*', 'updated_at', 'Waktu update terakhir'),
    ('*', 'deleted_at', 'Waktu penghapusan (soft delete)'),
    ('*', 'created_by', 'ID user pembuat'),
    ('*', 'created_by_id', 'ID user pembuat'),
    ('*', 'updated_by', 'ID user pengubah'),
    ('*', 'updated_by_id', 'ID user pengubah'),
    ('*', 'is_active', 'Status aktif record'),
    ('*', 'is_deleted', 'Status terhapus'),
    ('*', 'status', 'Status record'),
    ('*', 'code', 'Kode unik'),
    ('*', 'name', 'Nama'),
    ('*', 'description', 'Deskripsi'),
    ('*', 'notes', 'Catatan tambahan'),
    ('*', 'sort_order', 'Urutan tampilan'),
    ('*', 'order_data', 'Urutan data'),
    ('*', 'parent_id', 'FK ke parent'),
    ('*', 'email', 'Alamat email'),
    ('*', 'phone', 'Nomor telepon'),
    ('*', 'address', 'Alamat lengkap'),
]

def main():
    print("🔧 Setup Knowledge Base...")
    
    conn = psycopg2.connect(**DB_CONFIG)
    conn.autocommit = True
    cur = conn.cursor()
    
    # Create table & indexes
    for sql in SQL_STATEMENTS:
        try:
            cur.execute(sql)
            print("✅ Table/Index created")
        except Exception as e:
            print(f"⚠️ {e}")
    
    # Insert common columns
    insert_sql = """
        INSERT INTO doc_knowledge_base (table_name, column_name, description, category)
        VALUES (%s, %s, %s, 'common')
        ON CONFLICT (table_name, column_name) DO UPDATE SET description = EXCLUDED.description
    """
    
    for table_name, column_name, description in COMMON_COLUMNS:
        try:
            cur.execute(insert_sql, (table_name, column_name, description))
        except Exception as e:
            print(f"⚠️ {e}")
    
    print(f"✅ Inserted {len(COMMON_COLUMNS)} common columns")
    
    # Insert prefix patterns
    prefix_sql = """
        INSERT INTO doc_prefix_patterns (prefix, description, category)
        VALUES (%s, %s, %s)
        ON CONFLICT (prefix) DO UPDATE SET description = EXCLUDED.description
    """
    
    for prefix, description, category in PREFIX_PATTERNS:
        try:
            cur.execute(prefix_sql, (prefix, description, category))
        except Exception as e:
            print(f"⚠️ {e}")
    
    print(f"✅ Inserted {len(PREFIX_PATTERNS)} prefix patterns")
    
    # Check counts
    cur.execute("SELECT COUNT(*) FROM doc_knowledge_base")
    kb_count = cur.fetchone()[0]
    cur.execute("SELECT COUNT(*) FROM doc_prefix_patterns")
    prefix_count = cur.fetchone()[0]
    
    print(f"📊 Knowledge base: {kb_count} rows")
    print(f"📊 Prefix patterns: {prefix_count} rows")
    
    cur.close()
    conn.close()
    print("✅ Done!")

if __name__ == '__main__':
    main()
