# super_quick.py - Dokumentasi tanpa AI (instant)
import os
from dotenv import load_dotenv
from db_reader import get_db_metadata

load_dotenv()

def create_instant_docs():
    """Buat dokumentasi instant tanpa AI"""
    
    print("⚡ SUPER CEPAT: Dokumentasi tanpa AI")
    
    DB_CONFIG = {
        'host': os.getenv('DB_HOST', 'localhost'),
        'port': os.getenv('DB_PORT', '5432'),
        'dbname': os.getenv('DB_NAME', 'db_universitas'),
        'user': os.getenv('DB_USER', 'postgres'),
        'password': os.getenv('DB_PASSWORD', 'password_here')
    }
    
    # Ambil semua tabel
    tables = get_db_metadata(DB_CONFIG['host'], DB_CONFIG['dbname'], 
                           DB_CONFIG['user'], DB_CONFIG['password'], 
                           port=DB_CONFIG['port'])
    
    print(f"📋 Membuat dokumentasi untuk {len(tables)} tabel...")
    
    # Generate data tanpa AI
    tables_data = []
    for table_name, cols in tables.items():
        # Deskripsi template based
        primary_keys = [c for c in cols if 'id' in c['name'].lower()]
        foreign_keys = [c for c in cols if c['name'].endswith('_id')]
        
        if 'user' in table_name.lower():
            desc = f"Tabel {table_name} menyimpan informasi pengguna dan data terkait autentikasi."
        elif 'auth' in table_name.lower():
            desc = f"Tabel {table_name} bagian dari sistem otentikasi dan otorisasi."
        elif 'log' in table_name.lower() or 'audit' in table_name.lower():
            desc = f"Tabel {table_name} menyimpan catatan log dan audit sistem."
        elif len(foreign_keys) > 1:
            desc = f"Tabel {table_name} merupakan tabel relasi yang menghubungkan entitas lain."
        else:
            desc = f"Tabel {table_name} menyimpan data operasional dengan {len(cols)} kolom."
        
        tables_data.append({
            'table_name': table_name,
            'description': desc,
            'columns': cols
        })
    
    # Buat DOCX
    try:
        from doc_generator import generate_document
        output_path = os.path.join('..', 'output', 'Instant_Documentation.docx')
        generate_document(
            os.path.join('..', 'template', 'template_dokumentasi.docx'),
            output_path,
            DB_CONFIG['dbname'],
            tables_data
        )
        print(f"✅ INSTANT DOCX: {output_path}")
        print(f"   📊 {len(tables)} tabel berhasil didokumentasikan")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == '__main__':
    create_instant_docs()