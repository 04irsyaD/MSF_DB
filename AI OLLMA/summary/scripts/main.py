# main.py - coordinator script
import os
from dotenv import load_dotenv
from db_reader import get_db_metadata
from ai_writer import generate_table_description
from doc_generator import generate_document
from template_analyzer import analyze_and_prepare_template

# Load environment variables
load_dotenv()

# --- CONFIG from .env file ---
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': os.getenv('DB_PORT', '5432'),
    'dbname': os.getenv('DB_NAME', 'db_universitas'),
    'user': os.getenv('DB_USER', 'postgres'),
    'password': os.getenv('DB_PASSWORD', 'password_here')
}
DB_SCHEMA = os.getenv('DB_SCHEMA', 'public')

# Template and output paths
TEMPLATE_PATH = os.getenv('TEMPLATE_PATH', 
                         os.path.join(os.path.dirname(__file__), '..', 'template', 'template_dokumentasi.docx'))
OUTPUT_PATH = os.getenv('OUTPUT_PATH',
                       os.path.join(os.path.dirname(__file__), '..', 'output', 'Dokumentasi_Auto.docx'))

def main():
    # Langkah 1: Analisis template terlebih dahulu
    print('� LANGKAH 1: Menganalisis template dengan AI...')
    template_info = analyze_and_prepare_template(TEMPLATE_PATH)
    
    if not template_info:
        print('❌ Gagal menganalisis template. Melanjutkan dengan mode default.')
        template_info = {"analysis": "default", "strategy": "default"}
    
    # Langkah 2: Ambil metadata database
    print('\n�🔍 LANGKAH 2: Mengambil metadata database...')
    try:
        tables = get_db_metadata(DB_CONFIG['host'], DB_CONFIG['dbname'], 
                               DB_CONFIG['user'], DB_CONFIG['password'], 
                               port=DB_CONFIG['port'], schema=DB_SCHEMA)
        print(f'   ditemukan {len(tables)} tabel.')
    except Exception as e:
        print(f'❌ Error koneksi database: {e}')
        print('   Pastikan konfigurasi di file .env sudah benar')
        return

    # Limit untuk testing - ubah None menjadi angka untuk membatasi jumlah tabel
    MAX_TABLES = 3  # Hanya proses 3 tabel pertama untuk testing
    
    tables_to_process = dict(list(tables.items())[:MAX_TABLES]) if MAX_TABLES else tables
    
    print(f'\n🤖 LANGKAH 3: Membuat deskripsi sesuai template untuk {len(tables_to_process)} tabel...')
    if MAX_TABLES:
        print(f'   (Mode testing: hanya memproses {MAX_TABLES} tabel pertama)')
    
    # Berikan konteks template ke AI untuk konsistensi
    template_context = f"Template analysis: {template_info.get('analysis', 'default')[:200]}..."
    
    tables_data = []
    
    for i, (table_name, cols) in enumerate(tables_to_process.items(), 1):
        print(f'   Progress: {i}/{len(tables_to_process)} tabel')
        col_names = [c['name'] for c in cols]
        
        try:
            desc = generate_table_description(table_name, col_names, template_context)
        except KeyboardInterrupt:
            print(f'\n⚠️ Proses dihentikan oleh user pada tabel {i}/{len(tables_to_process)}')
            print('   Menggunakan deskripsi default untuk tabel yang belum diproses...')
            desc = f"Tabel {table_name} berisi data dengan kolom: {', '.join(col_names)}."
            break  # Keluar dari loop jika user interrupt
            
        tables_data.append({
            'table_name': table_name,
            'description': desc,
            'columns': cols
        })

    print(f'\n📄 LANGKAH 4: Mengisi template dokumentasi berdasarkan analisis AI...')
    print(f'   Template strategy: {template_info.get("strategy", "default")[:100]}...')
    try:
        # Buat folder output jika belum ada
        os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
        generate_document(TEMPLATE_PATH, OUTPUT_PATH, DB_CONFIG['dbname'], tables_data)
        print(f'✅ Dokumentasi selesai dibuat: {OUTPUT_PATH}')
    except Exception as e:
        print(f'❌ Error membuat dokumentasi: {e}')

if __name__ == '__main__':
    main()