# debug_data.py - untuk debugging data yang dihasilkan
import os
import json
from dotenv import load_dotenv
from scripts.db_reader import get_db_metadata
from scripts.ai_writer import generate_table_description

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

def debug_generated_data():
    print('🔍 Mengambil 2 tabel pertama untuk debugging...')
    
    # Ambil metadata database
    tables = get_db_metadata(DB_CONFIG['host'], DB_CONFIG['dbname'], 
                           DB_CONFIG['user'], DB_CONFIG['password'], 
                           port=DB_CONFIG['port'], schema=DB_SCHEMA)
    
    # Ambil 2 tabel pertama untuk testing
    limited_tables = dict(list(tables.items())[:2])
    
    # Generate data seperti di main.py
    tables_data = []
    for table_name, cols in limited_tables.items():
        print(f'   Memproses tabel: {table_name}')
        col_names = [c['name'] for c in cols]
        desc = generate_table_description(table_name, col_names)
        
        tables_data.append({
            'table_name': table_name,
            'description': desc,
            'columns': cols
        })
    
    # Simpan data ke JSON untuk debugging
    debug_data = {
        'db_name': DB_CONFIG['dbname'],
        'generated_date': '3 November 2025',
        'tables': tables_data
    }
    
    with open('debug_output.json', 'w', encoding='utf-8') as f:
        json.dump(debug_data, f, indent=2, ensure_ascii=False)
    
    print(f'✅ Debug data disimpan ke debug_output.json')
    print(f'   Total tabel: {len(tables_data)}')
    
    # Print sample data
    if tables_data:
        print(f'\n📋 Sample data tabel pertama:')
        sample = tables_data[0]
        print(f'   Nama: {sample["table_name"]}')
        print(f'   Deskripsi: {sample["description"][:100]}...')
        print(f'   Jumlah kolom: {len(sample["columns"])}')

if __name__ == '__main__':
    debug_generated_data()