# fix_template.py - Perbaiki masalah template
import os
from scripts.doc_generator import generate_document

def create_simple_template_content():
    """Buat contoh data untuk melihat apakah masalahnya di template atau di data"""
    
    # Data sample yang pasti
    sample_data = [
        {
            'table_name': 'users',
            'description': 'Tabel untuk menyimpan data pengguna sistem.',
            'columns': [
                {'name': 'id', 'type': 'integer', 'nullable': 'NO'},
                {'name': 'username', 'type': 'varchar(50)', 'nullable': 'NO'},
                {'name': 'email', 'type': 'varchar(100)', 'nullable': 'YES'},
                {'name': 'created_at', 'type': 'timestamp', 'nullable': 'NO'}
            ]
        },
        {
            'table_name': 'products',
            'description': 'Tabel untuk menyimpan informasi produk.',
            'columns': [
                {'name': 'id', 'type': 'integer', 'nullable': 'NO'},
                {'name': 'name', 'type': 'varchar(255)', 'nullable': 'NO'},
                {'name': 'price', 'type': 'decimal(10,2)', 'nullable': 'NO'},
                {'name': 'stock', 'type': 'integer', 'nullable': 'YES'}
            ]
        }
    ]
    
    print('🔧 Testing template dengan data sample...')
    
    template_path = os.path.join('template', 'template_dokumentasi.docx')
    output_path = os.path.join('output', 'Sample_Test.docx')
    
    try:
        result_path = generate_document(template_path, output_path, 'sample_database', sample_data)
        print(f'✅ Sample dokumen berhasil dibuat: {result_path}')
        
        # Cek ukuran file
        if os.path.exists(output_path):
            size = os.path.getsize(output_path)
            print(f'   Ukuran file: {size} bytes')
            
            if size < 1000:
                print('⚠️  File terlalu kecil - kemungkinan template tidak memiliki placeholder yang benar')
                print('   Template mungkin hanya berisi teks statis tanpa {{variabel}} Jinja2')
            else:
                print('✅ File berukuran normal - template kemungkinan bekerja')
        
        print(f'\n📋 Data yang dikirim ke template:')
        print(f'   db_name: "sample_database"')
        from datetime import datetime
        print(f'   generated_date: "{datetime.now().strftime("%d %B %Y")}"')
        print(f'   tables: {len(sample_data)} tabel')
        
        for table in sample_data:
            print(f'   - {table["table_name"]}: {len(table["columns"])} kolom')
            print(f'     Deskripsi: {table["description"]}')
            
    except Exception as e:
        print(f'❌ Error saat membuat dokumen: {e}')
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    create_simple_template_content()