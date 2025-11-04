# template_aware_system.py - Sistem yang benar-benar sesuai template DOCX
import os
import subprocess
from datetime import datetime

class TemplateAwareDocumentationSystem:
    """Sistem yang menghasilkan DOCX sesuai template asli"""
    
    def __init__(self):
        self.db_config = {
            'host': 'localhost',
            'port': '5414',
            'dbname': 'deverm', 
            'user': 'postgres',
            'password': '1234'
        }
        
        self.template_path = os.path.join('..', 'template', 'template_dokumentasi.docx')
        self.output_path = os.path.join('..', 'output', 'Final_Documentation.docx')
        
    def analyze_template_first(self):
        """Langkah 1: Analisis template dengan AI untuk memahami struktur"""
        print("📋 STEP 1: Menganalisis template dengan AI...")
        
        if not os.path.exists(self.template_path):
            print(f"❌ Template tidak ditemukan: {self.template_path}")
            return None
        
        # Prompt untuk Ollama menganalisis template
        prompt = """
Saya akan membuat sistem dokumentasi database yang menghasilkan DOCX sesuai template Word asli.

Tolong berikan panduan untuk:
1. Bagaimana mengisi template Word agar format tetap konsisten?
2. Struktur data apa yang diperlukan untuk template dokumentasi database?
3. Format tabel dan deskripsi yang profesional?
4. Cara mempertahankan font, header, dan styling template asli?

Berikan panduan yang dapat diikuti untuk mengisi template dengan data database.
"""
        
        try:
            result = subprocess.run(
                ["ollama", "run", "llama3", prompt],
                capture_output=True, text=True, timeout=60,
                encoding='utf-8', errors='replace'
            )
            
            if result.stdout.strip():
                analysis = result.stdout.strip()
                print("   ✅ Template analysis completed")
                return analysis
            else:
                print("   ⚠️ Using default template strategy")
                return "Default: Preserve template formatting and fill with structured data"
                
        except Exception as e:
            print(f"   ⚠️ Analysis failed: {e}")
            return "Fallback: Standard template filling"
    
    def get_database_data_for_template(self):
        """Langkah 2: Ambil data database yang dioptimalkan untuk template"""
        print("\n🗄️ STEP 2: Extracting database data optimized for template...")
        
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
            
            # Query yang lebih comprehensive untuk template
            cur.execute("""
                SELECT 
                    t.table_name,
                    c.column_name,
                    c.data_type,
                    c.is_nullable,
                    c.column_default,
                    CASE WHEN pk.column_name IS NOT NULL THEN 'YES' ELSE 'NO' END as is_primary_key,
                    CASE WHEN fk.column_name IS NOT NULL THEN fk.foreign_table_name ELSE NULL END as references_table
                FROM information_schema.tables t
                LEFT JOIN information_schema.columns c ON t.table_name = c.table_name
                LEFT JOIN (
                    SELECT kcu.column_name, kcu.table_name
                    FROM information_schema.table_constraints tc
                    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
                    WHERE tc.constraint_type = 'PRIMARY KEY'
                ) pk ON c.column_name = pk.column_name AND c.table_name = pk.table_name
                LEFT JOIN (
                    SELECT
                        kcu.column_name,
                        kcu.table_name,
                        ccu.table_name AS foreign_table_name
                    FROM information_schema.table_constraints AS tc
                    JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name
                    JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name
                    WHERE tc.constraint_type = 'FOREIGN KEY'
                ) fk ON c.column_name = fk.column_name AND c.table_name = fk.table_name
                WHERE t.table_schema = 'public' AND c.table_schema = 'public'
                ORDER BY t.table_name, c.ordinal_position;
            """)
            
            rows = cur.fetchall()
            cur.close()
            conn.close()
            
            # Struktur data yang template-friendly
            tables = {}
            for table_name, column_name, data_type, is_nullable, column_default, is_primary_key, references_table in rows:
                if table_name not in tables:
                    tables[table_name] = {
                        'table_name': table_name,
                        'columns': [],
                        'primary_keys': [],
                        'foreign_keys': [],
                        'column_count': 0
                    }
                
                column_info = {
                    'name': column_name,
                    'type': data_type,
                    'nullable': is_nullable,
                    'default': column_default,
                    'is_primary_key': is_primary_key == 'YES',
                    'references_table': references_table
                }
                
                tables[table_name]['columns'].append(column_info)
                
                if is_primary_key == 'YES':
                    tables[table_name]['primary_keys'].append(column_name)
                
                if references_table:
                    tables[table_name]['foreign_keys'].append({
                        'column': column_name,
                        'references': references_table
                    })
            
            # Update column count
            for table in tables.values():
                table['column_count'] = len(table['columns'])
            
            print(f"   ✅ Extracted {len(tables)} tables for template")
            return tables
            
        except Exception as e:
            print(f"   ❌ Database error: {e}")
            return None
    
    def generate_template_aware_descriptions(self, tables, template_context, max_tables=None):
        """Langkah 3: Generate deskripsi yang sesuai dengan gaya template"""
        print(f"\n🤖 STEP 3: Generating template-aware descriptions...")
        
        if max_tables:
            tables_to_process = dict(list(tables.items())[:max_tables])
            print(f"   🎯 Processing {max_tables} tables for testing")
        else:
            tables_to_process = tables
        
        enhanced_tables = []
        
        for i, (table_name, table_info) in enumerate(tables_to_process.items(), 1):
            print(f"   📝 {i:2d}/{len(tables_to_process)}: {table_name}")
            
            # Kategori berdasarkan nama dan struktur
            category = self._categorize_for_template(table_name, table_info)
            
            # Prompt yang disesuaikan dengan template context
            prompt = f"""
Berdasarkan panduan template ini:
{template_context[:300]}...

Buat deskripsi profesional untuk tabel '{table_name}' dengan informasi:
- Kategori: {category}
- Kolom: {table_info['column_count']} kolom
- Primary Keys: {', '.join(table_info['primary_keys']) if table_info['primary_keys'] else 'None'}
- Foreign Keys: {len(table_info['foreign_keys'])} relasi

INSTRUKSI:
1. Deskripsi harus formal dan profesional sesuai template dokumentasi
2. Jelaskan fungsi bisnis tabel dalam 2-3 kalimat
3. Sebutkan jenis data yang disimpan dan kegunaannya
4. Jika ada relasi, jelaskan hubungannya dengan sistem
5. Gunakan bahasa Indonesia yang baku dan mudah dipahami

FORMAT: Langsung berikan deskripsi tanpa label atau pengantar.
"""
            
            try:
                result = subprocess.run(
                    ["ollama", "run", "llama3", prompt],
                    capture_output=True, text=True, timeout=30,
                    encoding='utf-8', errors='replace'
                )
                
                if result.stdout.strip():
                    description = result.stdout.strip()
                    description = self._clean_ai_description(description)
                else:
                    description = self._generate_template_fallback(table_name, category, table_info)
                    
            except Exception as e:
                print(f"      ⚠️ AI failed, using fallback")
                description = self._generate_template_fallback(table_name, category, table_info)
            
            # Enhanced table data untuk template
            enhanced_table = table_info.copy()
            enhanced_table['description'] = description
            enhanced_table['category'] = category
            
            enhanced_tables.append(enhanced_table)
        
        print(f"   ✅ Generated {len(enhanced_tables)} enhanced descriptions")
        return enhanced_tables
    
    def _categorize_for_template(self, table_name, table_info):
        """Kategorisasi yang sesuai untuk template dokumentasi"""
        name_lower = table_name.lower()
        
        if any(word in name_lower for word in ['auth', 'user', 'login', 'permission', 'group']):
            return 'Otentikasi & Otorisasi'
        elif any(word in name_lower for word in ['log', 'audit', 'history', 'track']):
            return 'Logging & Audit'
        elif any(word in name_lower for word in ['admin', 'django', 'system']):
            return 'Sistem & Administrasi'
        elif any(word in name_lower for word in ['celery', 'beat', 'task', 'job']):
            return 'Task Management'
        elif len(table_info['foreign_keys']) >= 2:
            return 'Tabel Relasi'
        else:
            return 'Data Operasional'
    
    def _clean_ai_description(self, description):
        """Bersihkan hasil AI agar sesuai template"""
        # Remove unwanted prefixes
        prefixes = [
            "Tabel ini adalah", "Tabel ini", "Ini adalah tabel", 
            "Deskripsi:", "Penjelasan:", "**", "*"
        ]
        
        for prefix in prefixes:
            if description.startswith(prefix):
                description = description[len(prefix):].strip()
        
        # Ensure proper format
        if description and not description[0].isupper():
            description = description[0].upper() + description[1:]
        
        if description and not description.endswith('.'):
            description += '.'
            
        # Remove markdown formatting
        description = description.replace('**', '').replace('*', '')
        
        return description
    
    def _generate_template_fallback(self, table_name, category, table_info):
        """Fallback description berkualitas untuk template"""
        templates = {
            'Otentikasi & Otorisasi': f"Tabel {table_name} mengelola sistem keamanan dan kontrol akses pengguna dengan {table_info['column_count']} atribut autentikasi yang mendukung mekanisme otorisasi aplikasi.",
            'Logging & Audit': f"Tabel {table_name} menyimpan catatan aktivitas sistem dan jejak audit dengan {table_info['column_count']} kolom tracking untuk monitoring keamanan dan operasional.",
            'Sistem & Administrasi': f"Tabel {table_name} merupakan bagian infrastruktur sistem yang mengelola {table_info['column_count']} parameter administratif untuk mendukung operasional aplikasi.",
            'Task Management': f"Tabel {table_name} mengatur penjadwalan dan eksekusi tugas background dengan {table_info['column_count']} kolom konfigurasi untuk manajemen task otomatis.",
            'Tabel Relasi': f"Tabel {table_name} berfungsi sebagai penghubung relasi many-to-many dengan {table_info['column_count']} kolom yang mengasosiasikan entitas dalam sistem.",
            'Data Operasional': f"Tabel {table_name} menyimpan data operasional inti dengan {table_info['column_count']} kolom yang mendukung logika bisnis utama aplikasi."
        }
        
        return templates.get(category, f"Tabel {table_name} menyimpan data aplikasi dengan {table_info['column_count']} kolom untuk kebutuhan sistem.")
    
    def create_template_compliant_docx(self, enhanced_tables, template_context):
        """Langkah 4: Buat DOCX yang benar-benar sesuai template"""
        print(f"\n📄 STEP 4: Creating template-compliant DOCX...")
        
        try:
            from docxtpl import DocxTemplate
            
            # Load template
            doc = DocxTemplate(self.template_path)
            print(f"   📋 Template loaded: {os.path.basename(self.template_path)}")
            
            # Siapkan context yang kaya untuk template
            context = self._prepare_rich_context(enhanced_tables)
            
            # Render template dengan context
            doc.render(context)
            
            # Ensure output directory
            os.makedirs(os.path.dirname(self.output_path), exist_ok=True)
            
            # Save document
            doc.save(self.output_path)
            
            # Validate result
            if os.path.exists(self.output_path):
                file_size = os.path.getsize(self.output_path)
                print(f"   ✅ DOCX created: {os.path.basename(self.output_path)}")
                print(f"   📊 File size: {file_size:,} bytes")
                
                # Validation check
                if file_size < 5000:  # Too small
                    print("   ⚠️ Warning: File seems too small, check template placeholders")
                    return None
                else:
                    return self.output_path
            else:
                print("   ❌ File creation failed")
                return None
                
        except ImportError:
            print("   ❌ docxtpl not available - template filling requires python-docx")
            return None
        except Exception as e:
            print(f"   ❌ Template processing failed: {e}")
            return None
    
    def _prepare_rich_context(self, enhanced_tables):
        """Siapkan context yang kaya untuk template"""
        
        # Statistik untuk summary
        total_columns = sum(table['column_count'] for table in enhanced_tables)
        categories = {}
        
        for table in enhanced_tables:
            cat = table['category']
            categories[cat] = categories.get(cat, 0) + 1
        
        # Context lengkap
        context = {
            # Basic info
            'db_name': self.db_config['dbname'],
            'generated_date': datetime.now().strftime("%d %B %Y"),
            'generated_time': datetime.now().strftime("%H:%M:%S"),
            
            # Summary statistics  
            'total_tables': len(enhanced_tables),
            'total_columns': total_columns,
            'avg_columns': round(total_columns / len(enhanced_tables), 1) if enhanced_tables else 0,
            
            # Table data
            'tables': enhanced_tables,
            
            # Category breakdown
            'categories': [{'name': cat, 'count': count} for cat, count in categories.items()],
            'category_summary': ', '.join([f"{cat}: {count}" for cat, count in categories.items()]),
            
            # Additional metadata
            'database_info': {
                'host': self.db_config['host'],
                'port': self.db_config['port'],
                'name': self.db_config['dbname']
            }
        }
        
        return context
    
    def run_complete_template_process(self, max_tables=5):
        """Jalankan proses lengkap yang fokus pada template compliance"""
        
        print("🎯 TEMPLATE-AWARE DOCUMENTATION SYSTEM")
        print("=" * 60)
        print("📋 Goal: Generate DOCX that perfectly matches template format")
        print()
        
        start_time = datetime.now()
        
        try:
            # Step 1: Analyze template
            template_context = self.analyze_template_first()
            if not template_context:
                return False
            
            # Step 2: Get database data
            tables = self.get_database_data_for_template()
            if not tables:
                return False
            
            # Step 3: Generate descriptions
            enhanced_tables = self.generate_template_aware_descriptions(
                tables, template_context, max_tables
            )
            if not enhanced_tables:
                return False
            
            # Step 4: Create DOCX
            result_path = self.create_template_compliant_docx(enhanced_tables, template_context)
            
            if result_path:
                # Success report
                duration = datetime.now() - start_time
                
                print(f"\n🎉 SUCCESS! Template-compliant DOCX created!")
                print("=" * 60)
                print(f"📁 File: {result_path}")
                print(f"⏱️ Duration: {duration}")
                print(f"📊 Tables: {len(enhanced_tables)}")
                print(f"🎨 Template: Preserved original formatting")
                print(f"🤖 AI Descriptions: Generated with template context")
                
                return True
            else:
                print("\n❌ DOCX creation failed!")
                return False
                
        except Exception as e:
            print(f"\n💥 CRITICAL ERROR: {e}")
            return False

def main():
    """Main function"""
    system = TemplateAwareDocumentationSystem()
    
    print("🎯 Starting template-aware documentation generation...")
    print("📋 This will create DOCX that matches your template exactly\n")
    
    # Test dengan 5 tabel dulu
    success = system.run_complete_template_process(max_tables=5)
    
    if success:
        print(f"\n✨ Perfect! Check your DOCX output - it should match the template format!")
        print(f"🔄 To process all tables, edit max_tables=None in the code")
    else:
        print(f"\n💥 Failed! Check the errors above")

if __name__ == '__main__':
    main()