# test_template.py - Test template tanpa Ollama
import os
from datetime import datetime
from scripts.doc_generator import generate_document
from scripts.db_reader import get_db_metadata
from dotenv import load_dotenv

load_dotenv()

# Database config
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': os.getenv('DB_PORT', '5432'),
    'dbname': os.getenv('DB_NAME', 'db_universitas'),
    'user': os.getenv('DB_USER', 'postgres'),
    'password': os.getenv('DB_PASSWORD', 'password_here')
}
DB_SCHEMA = os.getenv('DB_SCHEMA', 'public')

def test_template_with_real_data():
    print('🔍 Mengambil metadata database...')
    
    # Ambil metadata database
    tables = get_db_metadata(DB_CONFIG['host'], DB_CONFIG['dbname'], 
                           DB_CONFIG['user'], DB_CONFIG['password'], 
                           port=DB_CONFIG['port'], schema=DB_SCHEMA)
    
    print(f'   Ditemukan {len(tables)} tabel.')
    
    # Ambil 3 tabel pertama dan buat deskripsi default
    limited_tables = dict(list(tables.items())[:3])
    
    tables_data = []
    for table_name, cols in limited_tables.items():
        col_names = [c['name'] for c in cols]
        
        # Buat deskripsi default (tanpa Ollama)
        desc = f"Tabel {table_name} menyimpan data dengan kolom: {', '.join(col_names[:5])}{'...' if len(col_names) > 5 else ''}. Total {len(col_names)} kolom."
        
        tables_data.append({
            'table_name': table_name,
            'description': desc,
            'columns': cols
        })
        
        print(f'   ✅ {table_name}: {len(cols)} kolom')
    
    print('📄 Mengisi template dokumentasi...')
    
    template_path = os.path.join('template', 'template_dokumentasi.docx')
    output_path = os.path.join('output', 'Test_Dokumentasi.docx')
    
    try:
        generate_document(template_path, output_path, DB_CONFIG['dbname'], tables_data)
        print(f'✅ Test dokumentasi berhasil dibuat: {output_path}')
        
        # Print data yang di-generate untuk debugging
        print(f'\n📋 Data yang di-generate:')
        print(f'   Database: {DB_CONFIG["dbname"]}')
        print(f'   Tanggal: {datetime.now().strftime("%d %B %Y")}')
        print(f'   Jumlah tabel: {len(tables_data)}')
        
        for i, table in enumerate(tables_data, 1):
            print(f'   {i}. {table["table_name"]} ({len(table["columns"])} kolom)')
            print(f'      {table["description"][:80]}...')
            
    except Exception as e:
        print(f'❌ Error: {e}')

if __name__ == '__main__':
    test_template_with_real_data()