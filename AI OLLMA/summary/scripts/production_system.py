# production_system.py - Sistem produksi tanpa dependencies eksternal
import os
import subprocess
import json
from datetime import datetime

class ProductionDocumentationSystem:
    """Sistem dokumentasi database production-ready"""
    
    def __init__(self):
        # Konfigurasi langsung tanpa dotenv
        self.db_config = {
            'host': 'localhost',
            'port': '5414',  # Sesuai dengan .env yang ada
            'dbname': 'deverm',
            'user': 'postgres', 
            'password': '1234'
        }
        
        self.template_path = os.path.join('..', 'template', 'template_dokumentasi.docx')
        self.output_path = os.path.join('..', 'output', 'Production_Documentation.docx')
        
        self.stats = {
            'start_time': datetime.now(),
            'tables_processed': 0,
            'descriptions_generated': 0,
            'errors': []
        }
    
    def get_database_tables(self):
        """Ambil daftar tabel dari database"""
        print("🗄️ Mengambil daftar tabel dari database...")
        
        try:
            import psycopg2
            
            conn = psycopg2.connect(
                host=self.db_config['host'],
                port=self.db_config['port'], 
                dbname=self.db_config['dbname'],
                user=self.db_config['user'],
                password=self.db_config['password']
            )
            
            cur = conn.cursor()
            
            # Query untuk mendapatkan tabel dan kolom
            cur.execute("""
                SELECT 
                    t.table_name,
                    c.column_name,
                    c.data_type,
                    c.is_nullable,
                    CASE WHEN pk.column_name IS NOT NULL THEN true ELSE false END as is_primary_key
                FROM information_schema.tables t
                LEFT JOIN information_schema.columns c ON t.table_name = c.table_name
                LEFT JOIN (
                    SELECT kcu.column_name, kcu.table_name
                    FROM information_schema.table_constraints tc
                    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
                    WHERE tc.constraint_type = 'PRIMARY KEY'
                ) pk ON c.column_name = pk.column_name AND c.table_name = pk.table_name
                WHERE t.table_schema = 'public' AND c.table_schema = 'public'
                ORDER BY t.table_name, c.ordinal_position;
            """)
            
            rows = cur.fetchall()
            cur.close()
            conn.close()
            
            # Organize data
            tables = {}
            for table_name, column_name, data_type, is_nullable, is_primary_key in rows:
                if table_name not in tables:
                    tables[table_name] = []
                
                tables[table_name].append({
                    'name': column_name,
                    'type': data_type,
                    'nullable': is_nullable,
                    'is_primary_key': is_primary_key
                })
            
            print(f"   ✅ Ditemukan {len(tables)} tabel dengan total {sum(len(cols) for cols in tables.values())} kolom")
            return tables
            
        except Exception as e:
            print(f"   ❌ Error: {e}")
            self.stats['errors'].append(f"Database: {e}")
            return None
    
    def generate_ai_description(self, table_name, columns):
        """Generate deskripsi tabel menggunakan AI"""
        print(f"   🤖 Generating description for {table_name}...")
        
        # Analisis kolom untuk konteks
        column_names = [col['name'] for col in columns]
        primary_keys = [col['name'] for col in columns if col['is_primary_key']]
        
        # Kategorisasi tabel
        category = self.categorize_table(table_name, column_names)
        
        # Prompt untuk Ollama
        prompt = f"""
Buat deskripsi profesional untuk tabel database '{table_name}' berdasarkan informasi berikut:

KATEGORI: {category}
KOLOM ({len(columns)}): {', '.join(column_names[:8])}{'...' if len(columns) > 8 else ''}
PRIMARY KEY: {', '.join(primary_keys) if primary_keys else 'Tidak ada'}

INSTRUKSI:
1. Jelaskan fungsi utama tabel dalam 1-2 kalimat
2. Sebutkan jenis data yang disimpan
3. Gunakan bahasa Indonesia yang profesional
4. Fokus pada kegunaan bisnis tabel

Berikan deskripsi langsung tanpa pengantar.
"""
        
        try:
            result = subprocess.run(
                ["ollama", "run", "llama3", prompt],
                capture_output=True, text=True, timeout=30,
                encoding='utf-8', errors='replace'
            )
            
            if result.stdout.strip():
                description = result.stdout.strip()
                # Clean up description
                description = self.clean_description(description)
                self.stats['descriptions_generated'] += 1
                return description
            else:
                return self.generate_fallback_description(table_name, category, len(columns))
                
        except Exception as e:
            print(f"      ⚠️ AI failed: {e}")
            return self.generate_fallback_description(table_name, category, len(columns))
    
    def categorize_table(self, table_name, column_names):
        """Kategorisasi tabel berdasarkan nama dan kolom"""
        name_lower = table_name.lower()
        cols_text = ' '.join(column_names).lower()
        
        if any(word in name_lower for word in ['auth', 'user', 'login', 'permission']):
            return 'Authentication & Authorization'
        elif any(word in name_lower for word in ['log', 'audit', 'history']):
            return 'Logging & Audit'
        elif any(word in name_lower for word in ['config', 'setting', 'parameter']):
            return 'Configuration'
        elif any(word in cols_text for word in ['price', 'amount', 'payment']):
            return 'Financial'
        elif len([c for c in column_names if c.endswith('_id')]) >= 2:
            return 'Relationship'
        else:
            return 'Business Logic'
    
    def clean_description(self, description):
        """Bersihkan deskripsi dari AI"""
        # Remove common prefixes
        prefixes = ["Tabel ini", "Ini adalah", "Deskripsi:", "Penjelasan:"]
        for prefix in prefixes:
            if description.startswith(prefix):
                description = description[len(prefix):].strip()
        
        # Ensure proper capitalization
        if description and not description[0].isupper():
            description = description[0].upper() + description[1:]
        
        # Ensure ends with period
        if description and not description.endswith('.'):
            description += '.'
            
        return description
    
    def generate_fallback_description(self, table_name, category, column_count):
        """Generate deskripsi fallback berkualitas"""
        fallbacks = {
            'Authentication & Authorization': f"Tabel {table_name} mengelola sistem otentikasi dan otorisasi pengguna dengan {column_count} atribut keamanan.",
            'Logging & Audit': f"Tabel {table_name} menyimpan catatan aktivitas sistem dan audit trail dengan {column_count} kolom tracking.",
            'Configuration': f"Tabel {table_name} berisi pengaturan dan konfigurasi aplikasi dalam {column_count} parameter.",
            'Financial': f"Tabel {table_name} mengelola data keuangan dan transaksi dengan {column_count} kolom finansial.",
            'Relationship': f"Tabel {table_name} menghubungkan entitas dalam sistem melalui {column_count} kolom relasional.",
            'Business Logic': f"Tabel {table_name} menyimpan data operasional utama dengan {column_count} kolom bisnis."
        }
        
        return fallbacks.get(category, f"Tabel {table_name} menyimpan data aplikasi dengan {column_count} kolom.")
    
    def create_text_documentation(self, tables_data):
        """Buat dokumentasi dalam format text (fallback)"""
        print("📄 Membuat dokumentasi format text...")
        
        doc_content = f"""
DOKUMENTASI DATABASE: {self.db_config['dbname']}
Generated: {datetime.now().strftime('%d %B %Y, %H:%M:%S')}
Total Tabel: {len(tables_data)}

{'='*80}

"""
        
        for i, table_data in enumerate(tables_data, 1):
            doc_content += f"""
{i}. TABEL: {table_data['table_name']}
{'-'*50}

Deskripsi: {table_data['description']}

Kolom ({len(table_data['columns'])}):
"""
            
            for col in table_data['columns']:
                pk_mark = " (PK)" if col['is_primary_key'] else ""
                null_mark = "NULL" if col['nullable'] == 'YES' else "NOT NULL"
                doc_content += f"  • {col['name']} - {col['type']} - {null_mark}{pk_mark}\n"
            
            doc_content += f"\n{'='*80}\n"
        
        # Save text file
        text_output = self.output_path.replace('.docx', '.txt')
        with open(text_output, 'w', encoding='utf-8') as f:
            f.write(doc_content)
        
        print(f"   ✅ Text documentation: {text_output}")
        return text_output
    
    def run_production_process(self, max_tables=None):
        """Jalankan proses produksi lengkap"""
        
        print("🎯 PRODUCTION DATABASE DOCUMENTATION SYSTEM")
        print("="*60)
        
        # Step 1: Get database schema
        tables = self.get_database_tables()
        if not tables:
            return False
        
        # Limit untuk testing
        if max_tables:
            tables = dict(list(tables.items())[:max_tables])
            print(f"🎯 Processing first {max_tables} tables for testing")
        
        # Step 2: Generate descriptions
        print(f"\n🤖 Generating AI descriptions for {len(tables)} tables...")
        
        tables_data = []
        for i, (table_name, columns) in enumerate(tables.items(), 1):
            print(f"📝 {i:2d}/{len(tables)}: {table_name}")
            
            try:
                description = self.generate_ai_description(table_name, columns)
                
                tables_data.append({
                    'table_name': table_name,
                    'description': description,
                    'columns': columns
                })
                
                self.stats['tables_processed'] += 1
                
            except Exception as e:
                print(f"   ❌ Error: {e}")
                self.stats['errors'].append(f"{table_name}: {e}")
        
        # Step 3: Create documentation
        print(f"\n📄 Creating documentation...")
        
        # Always create text version
        text_file = self.create_text_documentation(tables_data)
        
        # Try to create DOCX if possible
        try:
            from docxtpl import DocxTemplate
            
            if os.path.exists(self.template_path):
                doc = DocxTemplate(self.template_path)
                context = {
                    'db_name': self.db_config['dbname'],
                    'generated_date': datetime.now().strftime("%d %B %Y"),
                    'tables': tables_data
                }
                doc.render(context)
                
                os.makedirs(os.path.dirname(self.output_path), exist_ok=True)
                doc.save(self.output_path)
                
                print(f"   ✅ DOCX documentation: {self.output_path}")
                docx_created = True
            else:
                print(f"   ⚠️ Template not found: {self.template_path}")
                docx_created = False
                
        except Exception as e:
            print(f"   ⚠️ DOCX creation failed: {e}")
            docx_created = False
        
        # Final report
        duration = datetime.now() - self.stats['start_time']
        
        print(f"\n✅ DOCUMENTATION COMPLETED!")
        print("="*60)
        print(f"⏱️ Duration: {duration}")
        print(f"📊 Tables processed: {self.stats['tables_processed']}")
        print(f"🤖 AI descriptions: {self.stats['descriptions_generated']}")
        print(f"📄 Text file: ✅")
        print(f"📄 DOCX file: {'✅' if docx_created else '❌'}")
        
        if self.stats['errors']:
            print(f"⚠️ Errors: {len(self.stats['errors'])}")
        
        return True

def main():
    """Main function"""
    system = ProductionDocumentationSystem()
    
    # Run with 5 tables for testing
    success = system.run_production_process(max_tables=5)
    
    if success:
        print(f"\n🎉 SUCCESS! Check the output folder.")
    else:
        print(f"\n💥 FAILED! Check errors above.")

if __name__ == '__main__':
    main()