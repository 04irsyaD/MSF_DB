# quality_approach.py - Pendekatan berkualitas untuk dokumentasi database
import os
import subprocess
import json
from datetime import datetime
from dotenv import load_dotenv
from db_reader import get_db_metadata

load_dotenv()

class QualityDocumentationGenerator:
    def __init__(self):
        self.db_config = {
            'host': os.getenv('DB_HOST', 'localhost'),
            'port': os.getenv('DB_PORT', '5432'),
            'dbname': os.getenv('DB_NAME', 'db_universitas'),
            'user': os.getenv('DB_USER', 'postgres'),
            'password': os.getenv('DB_PASSWORD', 'password_here')
        }
        self.template_path = os.path.join('..', 'template', 'template_dokumentasi.docx')
        self.output_path = os.path.join('..', 'output', 'Quality_Documentation.docx')
        
    def step1_analyze_template(self):
        """Langkah 1: Analisis template dengan teliti"""
        print("🔍 LANGKAH 1: Menganalisis template dokumen...")
        
        # Cek apakah template ada
        if not os.path.exists(self.template_path):
            print(f"❌ Template tidak ditemukan: {self.template_path}")
            return False
            
        print(f"   ✅ Template ditemukan: {os.path.basename(self.template_path)}")
        
        # Analisis struktur dengan Ollama
        prompt = f"""
Saya akan membuat dokumentasi database. Tolong analisis template DOCX yang akan saya gunakan dan berikan panduan:

1. Bagaimana struktur dokumen yang baik untuk dokumentasi database?
2. Informasi apa saja yang harus ada untuk setiap tabel?
3. Format deskripsi tabel yang profesional dan informatif?
4. Cara menjelaskan kolom-kolom tabel yang mudah dipahami?

Berikan panduan dalam format yang terstruktur dan dapat diikuti.
"""
        
        try:
            print("   🤖 Meminta panduan dari AI...")
            result = subprocess.run(
                ["ollama", "run", "llama3", prompt],
                capture_output=True, text=True, timeout=60,
                encoding='utf-8', errors='replace'
            )
            
            if result.stdout.strip():
                self.template_guidance = result.stdout.strip()
                print("   ✅ Panduan template berhasil didapat")
                return True
            else:
                print("   ⚠️ Tidak mendapat panduan dari AI, menggunakan default")
                self.template_guidance = "Default: Buat deskripsi yang jelas dan profesional"
                return True
                
        except Exception as e:
            print(f"   ⚠️ Error analisis template: {e}")
            self.template_guidance = "Default guidance"
            return True
    
    def step2_get_database_schema(self):
        """Langkah 2: Ambil skema database dengan detail"""
        print("\n🗄️ LANGKAH 2: Mengambil skema database...")
        
        try:
            tables = get_db_metadata(
                self.db_config['host'], self.db_config['dbname'],
                self.db_config['user'], self.db_config['password'],
                port=self.db_config['port']
            )
            
            print(f"   ✅ Berhasil mengambil {len(tables)} tabel")
            
            # Analisis struktur database
            total_columns = sum(len(cols) for cols in tables.values())
            avg_columns = total_columns / len(tables) if tables else 0
            
            print(f"   📊 Total kolom: {total_columns}")
            print(f"   📈 Rata-rata kolom per tabel: {avg_columns:.1f}")
            
            # Kategorisasi tabel berdasarkan nama
            self.categorize_tables(tables)
            
            self.tables = tables
            return True
            
        except Exception as e:
            print(f"   ❌ Error mengambil database: {e}")
            return False
    
    def categorize_tables(self, tables):
        """Kategorisasi tabel untuk membantu AI membuat deskripsi yang tepat"""
        categories = {
            'auth': [],      # Authentication/Authorization
            'user': [],      # User management  
            'log': [],       # Logging/Audit
            'config': [],    # Configuration
            'content': [],   # Content management
            'relation': [],  # Junction/Relation tables
            'core': []       # Core business logic
        }
        
        for table_name in tables.keys():
            name_lower = table_name.lower()
            
            if any(word in name_lower for word in ['auth', 'permission', 'group', 'role']):
                categories['auth'].append(table_name)
            elif any(word in name_lower for word in ['user', 'profile', 'account']):
                categories['user'].append(table_name)
            elif any(word in name_lower for word in ['log', 'audit', 'history', 'track']):
                categories['log'].append(table_name)
            elif any(word in name_lower for word in ['config', 'setting', 'option']):
                categories['config'].append(table_name)
            elif any(word in name_lower for word in ['content', 'post', 'article', 'page']):
                categories['content'].append(table_name)
            elif len([c for c in tables[table_name] if c['name'].endswith('_id')]) >= 2:
                categories['relation'].append(table_name)
            else:
                categories['core'].append(table_name)
        
        self.table_categories = categories
        
        print("   📂 Kategorisasi tabel:")
        for category, table_list in categories.items():
            if table_list:
                print(f"      {category.upper()}: {len(table_list)} tabel")
    
    def step3_generate_quality_descriptions(self, max_tables=None):
        """Langkah 3: Generate deskripsi berkualitas dengan konteks"""
        print(f"\n🤖 LANGKAH 3: Membuat deskripsi berkualitas...")
        
        tables_to_process = self.tables
        if max_tables:
            tables_to_process = dict(list(self.tables.items())[:max_tables])
            print(f"   (Mode testing: {max_tables} tabel pertama)")
        
        print(f"   Target: {len(tables_to_process)} tabel")
        
        self.tables_data = []
        
        for i, (table_name, cols) in enumerate(tables_to_process.items(), 1):
            print(f"   📝 {i}/{len(tables_to_process)}: {table_name}")
            
            # Tentukan kategori tabel
            category = self.get_table_category(table_name)
            
            # Analisis kolom
            col_names = [c['name'] for c in cols]
            primary_keys = [c['name'] for c in cols if 'id' == c['name'] or c['name'].startswith('id_')]
            foreign_keys = [c['name'] for c in cols if c['name'].endswith('_id')]
            timestamps = [c['name'] for c in cols if any(t in c['name'].lower() for t in ['created', 'updated', 'date', 'time'])]
            
            # Buat prompt kontekstual untuk Ollama
            context_prompt = f"""
Berdasarkan panduan ini:
{self.template_guidance[:500]}...

Buat deskripsi profesional untuk tabel database berikut:

TABEL: {table_name}
KATEGORI: {category}
TOTAL KOLOM: {len(cols)}

KOLOM-KOLOM:
{chr(10).join([f"- {c['name']} ({c['type']})" for c in cols[:10]])}
{'...' if len(cols) > 10 else ''}

ANALISIS:
- Primary Keys: {primary_keys or 'Tidak ada'}
- Foreign Keys: {foreign_keys or 'Tidak ada'}  
- Timestamps: {timestamps or 'Tidak ada'}

Buat deskripsi yang:
1. Menjelaskan fungsi utama tabel
2. Menyebutkan relasi dengan tabel lain (jika ada FK)
3. Menjelaskan jenis data yang disimpan
4. Profesional dan mudah dipahami

Jawab dalam 2-3 kalimat yang padat dan informatif.
"""

            try:
                result = subprocess.run(
                    ["ollama", "run", "llama3", context_prompt],
                    capture_output=True, text=True, timeout=45,
                    encoding='utf-8', errors='replace'
                )
                
                if result.stdout.strip():
                    description = result.stdout.strip()
                else:
                    description = self.generate_fallback_description(table_name, cols, category)
                    
            except Exception as e:
                print(f"      ⚠️ AI timeout, menggunakan fallback...")
                description = self.generate_fallback_description(table_name, cols, category)
            
            self.tables_data.append({
                'table_name': table_name,
                'description': description,
                'columns': cols,
                'category': category,
                'analysis': {
                    'primary_keys': primary_keys,
                    'foreign_keys': foreign_keys,
                    'timestamps': timestamps
                }
            })
            
            print(f"      ✅ {description[:60]}...")
        
        return True
    
    def get_table_category(self, table_name):
        """Dapatkan kategori tabel"""
        for category, table_list in self.table_categories.items():
            if table_name in table_list:
                return category
        return 'core'
    
    def generate_fallback_description(self, table_name, cols, category):
        """Generate deskripsi fallback yang berkualitas"""
        col_count = len(cols)
        
        if category == 'auth':
            return f"Tabel {table_name} merupakan bagian dari sistem otentikasi dan otorisasi yang mengelola {col_count} atribut untuk keamanan aplikasi."
        elif category == 'user':
            return f"Tabel {table_name} menyimpan informasi pengguna dan profil dengan {col_count} kolom yang mencakup data identitas dan preferensi."
        elif category == 'log':
            return f"Tabel {table_name} berfungsi sebagai audit trail dan logging sistem dengan {col_count} kolom untuk melacak aktivitas dan perubahan data."
        elif category == 'relation':
            return f"Tabel {table_name} merupakan tabel relasi yang menghubungkan entitas-entitas lain dalam sistem melalui {col_count} kolom penghubung."
        else:
            return f"Tabel {table_name} menyimpan data operasional utama dengan {col_count} kolom yang mendukung logika bisnis aplikasi."
    
    def step4_create_documentation(self):
        """Langkah 4: Buat dokumentasi final"""
        print(f"\n📄 LANGKAH 4: Membuat dokumentasi final...")
        
        try:
            from doc_generator import generate_document
            
            # Buat folder output jika belum ada
            os.makedirs(os.path.dirname(self.output_path), exist_ok=True)
            
            # Generate dokumen
            result_path = generate_document(
                self.template_path, 
                self.output_path, 
                self.db_config['dbname'], 
                self.tables_data
            )
            
            print(f"   ✅ Dokumentasi berhasil dibuat: {os.path.basename(result_path)}")
            
            # Statistik
            print(f"\n📊 STATISTIK DOKUMENTASI:")
            print(f"   Database: {self.db_config['dbname']}")
            print(f"   Total tabel: {len(self.tables_data)}")
            print(f"   Total kolom: {sum(len(t['columns']) for t in self.tables_data)}")
            print(f"   Tanggal: {datetime.now().strftime('%d %B %Y')}")
            
            # Breakdown per kategori
            category_stats = {}
            for table in self.tables_data:
                cat = table['category']
                category_stats[cat] = category_stats.get(cat, 0) + 1
            
            print(f"   Breakdown kategori:")
            for category, count in category_stats.items():
                print(f"     - {category.upper()}: {count} tabel")
            
            return result_path
            
        except Exception as e:
            print(f"   ❌ Error membuat dokumentasi: {e}")
            return None
    
    def run_quality_process(self, max_tables=5):
        """Jalankan seluruh proses berkualitas"""
        print("🎯 MEMULAI PROSES DOKUMENTASI BERKUALITAS")
        print("="*50)
        
        if not self.step1_analyze_template():
            return False
            
        if not self.step2_get_database_schema():
            return False
            
        if not self.step3_generate_quality_descriptions(max_tables):
            return False
            
        result = self.step4_create_documentation()
        
        if result:
            print("\n" + "="*50)
            print("✅ DOKUMENTASI BERKUALITAS SELESAI!")
            print(f"📁 File: {result}")
            return True
        else:
            print("\n❌ PROSES GAGAL!")
            return False

def main():
    generator = QualityDocumentationGenerator()
    
    # Mulai dengan 5 tabel untuk testing kualitas
    success = generator.run_quality_process(max_tables=5)
    
    if success:
        print(f"\n💡 LANGKAH SELANJUTNYA:")
        print(f"1. Periksa hasil dokumentasi")
        print(f"2. Jika bagus, jalankan ulang tanpa limit untuk semua tabel")
        print(f"3. Sesuaikan template jika diperlukan")

if __name__ == '__main__':
    main()