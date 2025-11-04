# quick_fix.py - Solusi cepat untuk masalah template
import os
import subprocess
from dotenv import load_dotenv
from db_reader import get_db_metadata

load_dotenv()

def create_simple_template_based_docs():
    """Buat dokumentasi sederhana tanpa menunggu analisis template yang lama"""
    
    print("🚀 SOLUSI CEPAT: Membuat dokumentasi database")
    
    # Config database
    DB_CONFIG = {
        'host': os.getenv('DB_HOST', 'localhost'),
        'port': os.getenv('DB_PORT', '5432'),
        'dbname': os.getenv('DB_NAME', 'db_universitas'),
        'user': os.getenv('DB_USER', 'postgres'),
        'password': os.getenv('DB_PASSWORD', 'password_here')
    }
    
    print("1️⃣ Mengambil data database...")
    try:
        tables = get_db_metadata(DB_CONFIG['host'], DB_CONFIG['dbname'], 
                               DB_CONFIG['user'], DB_CONFIG['password'], 
                               port=DB_CONFIG['port'])
        print(f"   ✅ Ditemukan {len(tables)} tabel")
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return
    
    # Ambil 5 tabel pertama untuk demo
    sample_tables = dict(list(tables.items())[:5])
    
    print("2️⃣ Membuat deskripsi dengan AI (mode cepat)...")
    
    tables_data = []
    for i, (table_name, cols) in enumerate(sample_tables.items(), 1):
        print(f"   {i}/5: {table_name}")
        
        col_names = [c['name'] for c in cols]
        
        # Prompt singkat untuk Ollama
        prompt = f"Jelaskan fungsi tabel '{table_name}' dengan kolom: {', '.join(col_names[:5])}. Jawab dalam 1 kalimat."
        
        try:
            result = subprocess.run(
                ["ollama", "run", "llama3", prompt],
                capture_output=True, text=True, timeout=15,
                encoding='utf-8', errors='replace'
            )
            desc = result.stdout.strip() if result.stdout.strip() else f"Tabel {table_name} menyimpan data dengan {len(cols)} kolom."
            
        except Exception:
            desc = f"Tabel {table_name} menyimpan data dengan kolom: {', '.join(col_names[:3])}..."
        
        tables_data.append({
            'table_name': table_name,
            'description': desc,
            'columns': cols
        })
    
    print("3️⃣ Membuat dokumen...")
    
    # Buat dokumen text sederhana
    output_text = f"""
DOKUMENTASI DATABASE: {DB_CONFIG['dbname']}
Tanggal: 3 November 2025
Total Tabel: {len(tables)} (Menampilkan 5 tabel pertama)

========================================

"""
    
    for table in tables_data:
        output_text += f"""
TABEL: {table['table_name']}
Deskripsi: {table['description']}
Jumlah Kolom: {len(table['columns'])}

Kolom-kolom:
"""
        for col in table['columns']:
            output_text += f"  • {col['name']} ({col['type']}) - {'NOT NULL' if col['nullable'] == 'NO' else 'NULL'}\n"
        
        output_text += "\n" + "="*50 + "\n"
    
    # Simpan ke file
    output_path = os.path.join('..', 'output', 'Quick_Documentation.txt')
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(output_text)
    
    print(f"✅ Dokumentasi cepat selesai: {output_path}")
    
    # Juga buat versi DOCX sederhana
    try:
        from doc_generator import generate_document
        docx_path = os.path.join('..', 'output', 'Quick_Documentation.docx')
        generate_document(
            os.path.join('..', 'template', 'template_dokumentasi.docx'),
            docx_path,
            DB_CONFIG['dbname'],
            tables_data
        )
        print(f"✅ DOCX juga dibuat: {docx_path}")
    except Exception as e:
        print(f"⚠️ DOCX gagal: {e}")
    
    return output_path

if __name__ == '__main__':
    create_simple_template_based_docs()