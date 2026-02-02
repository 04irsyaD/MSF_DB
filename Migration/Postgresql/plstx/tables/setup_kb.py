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
    # Create table
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
    
    # Create indexes
    "CREATE INDEX IF NOT EXISTS idx_kb_table_name ON doc_knowledge_base(table_name)",
    "CREATE INDEX IF NOT EXISTS idx_kb_column_name ON doc_knowledge_base(column_name)",
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
    
    # Check count
    cur.execute("SELECT COUNT(*) FROM doc_knowledge_base")
    count = cur.fetchone()[0]
    print(f"📊 Total rows: {count}")
    
    cur.close()
    conn.close()
    print("✅ Done!")

if __name__ == '__main__':
    main()
