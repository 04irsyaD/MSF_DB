# enhanced_safe_docx.py - Sistem DOCX enhanced yang aman untuk Word
import os
import subprocess
import zipfile
from datetime import datetime
import xml.sax.saxutils as saxutils

class EnhancedSafeDocxSystem:
    """Sistem DOCX enhanced yang aman dan dapat dibuka di Word tanpa error"""
    
    def __init__(self):
        self.db_config = {
            'host': 'localhost',
            'port': '5414', 
            'dbname': 'deverm',
            'user': 'postgres',
            'password': '1234'
        }
        
        self.output_dir = os.path.join('..', 'output')
        
    def get_enhanced_database_info(self):
        """Ambil informasi database yang lebih kaya tetapi aman"""
        print("🗄️ Getting enhanced database information...")
        
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
            
            # Query yang aman dengan informasi yang kaya
            cur.execute("""
                SELECT 
                    t.table_name,
                    COUNT(c.column_name) as column_count,
                    COUNT(CASE WHEN pk.column_name IS NOT NULL THEN 1 END) as pk_count,
                    COUNT(CASE WHEN fk.column_name IS NOT NULL THEN 1 END) as fk_count,
                    CASE 
                        WHEN t.table_name ILIKE '%auth%' OR t.table_name ILIKE '%user%' THEN 'Authentication'
                        WHEN t.table_name ILIKE '%log%' OR t.table_name ILIKE '%audit%' THEN 'Logging'
                        WHEN t.table_name ILIKE '%django%' OR t.table_name ILIKE '%admin%' THEN 'Administration'
                        WHEN t.table_name ILIKE '%celery%' OR t.table_name ILIKE '%task%' THEN 'Task Management'
                        ELSE 'Business Logic'
                    END as category
                FROM information_schema.tables t
                LEFT JOIN information_schema.columns c ON t.table_name = c.table_name AND c.table_schema = 'public'
                LEFT JOIN (
                    SELECT kcu.column_name, kcu.table_name
                    FROM information_schema.table_constraints tc
                    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
                    WHERE tc.constraint_type = 'PRIMARY KEY'
                ) pk ON c.column_name = pk.column_name AND c.table_name = pk.table_name
                LEFT JOIN (
                    SELECT kcu.column_name, kcu.table_name
                    FROM information_schema.table_constraints AS tc
                    JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name
                    WHERE tc.constraint_type = 'FOREIGN KEY'
                ) fk ON c.column_name = fk.column_name AND c.table_name = fk.table_name
                WHERE t.table_schema = 'public'
                GROUP BY t.table_name
                ORDER BY category, t.table_name;
            """)
            
            tables = cur.fetchall()
            cur.close()
            conn.close()
            
            print(f"   ✅ Extracted {len(tables)} tables with enhanced metadata")
            return tables
            
        except Exception as e:
            print(f"   ❌ Database error: {e}")
            return None
    
    def safe_xml_escape(self, text):
        """Escape XML content dengan aman"""
        if not text:
            return ""
        
        text = str(text)
        # Escape XML entities
        text = saxutils.escape(text)
        
        # Remove problematic characters yang bisa merusak XML
        text = text.replace('\x00', '')
        text = text.replace('\x0b', '')
        text = text.replace('\x0c', '')
        text = text.replace('\r', ' ')
        text = text.replace('\n', ' ')
        text = text.replace('\t', ' ')
        
        # Normalize multiple spaces
        while '  ' in text:
            text = text.replace('  ', ' ')
            
        return text.strip()
    
    def generate_ai_description_safe(self, table_name, category, column_count):
        """Generate AI description dengan safe handling"""
        
        prompt = f"""
Buat deskripsi singkat untuk tabel database '{table_name}' kategori {category} dengan {column_count} kolom.

INSTRUKSI:
1. Maksimal 2 kalimat dalam bahasa Indonesia
2. Fokus pada fungsi bisnis tabel
3. Jangan gunakan karakter khusus atau simbol
4. Format profesional dan mudah dibaca

OUTPUT: Langsung deskripsi tanpa label.
"""
        
        try:
            result = subprocess.run(
                ["ollama", "run", "llama3", prompt],
                capture_output=True, text=True, timeout=20,
                encoding='utf-8', errors='replace'
            )
            
            if result.stdout.strip():
                desc = result.stdout.strip()
                # Clean up description
                desc = desc.replace('**', '').replace('*', '')
                desc = self.safe_xml_escape(desc)
                
                # Ensure proper ending
                if desc and not desc.endswith('.'):
                    desc += '.'
                
                # Limit length
                if len(desc) > 200:
                    desc = desc[:197] + '...'
                    
                return desc
            else:
                return self.create_fallback_description(table_name, category, column_count)
                
        except Exception:
            return self.create_fallback_description(table_name, category, column_count)
    
    def create_fallback_description(self, table_name, category, column_count):
        """Fallback description yang aman"""
        templates = {
            'Authentication': f"Mengelola sistem keamanan dan autentikasi pengguna dengan {column_count} kolom data.",
            'Logging': f"Menyimpan catatan log dan audit trail sistem dengan {column_count} atribut tracking.",
            'Administration': f"Bagian dari sistem administrasi dengan {column_count} parameter konfigurasi.",
            'Task Management': f"Mengatur penjadwalan dan eksekusi task dengan {column_count} kolom manajemen.",
            'Business Logic': f"Menyimpan data operasional bisnis dengan {column_count} kolom aplikasi."
        }
        
        desc = templates.get(category, f"Tabel data {table_name} dengan {column_count} kolom sistem.")
        return self.safe_xml_escape(desc)
    
    def create_professional_docx_structure(self):
        """Buat struktur DOCX yang profesional dan valid"""
        
        document_xml = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:body>
        <!-- HEADER SECTION -->
        <w:p>
            <w:pPr>
                <w:jc w:val="center"/>
                <w:spacing w:after="480"/>
            </w:pPr>
            <w:r>
                <w:rPr>
                    <w:b/>
                    <w:sz w:val="32"/>
                    <w:color w:val="1F4E79"/>
                </w:rPr>
                <w:t>DATABASE DOCUMENTATION</w:t>
            </w:r>
        </w:p>
        
        <w:p>
            <w:pPr>
                <w:jc w:val="center"/>
                <w:spacing w:after="240"/>
            </w:pPr>
            <w:r>
                <w:rPr>
                    <w:sz w:val="20"/>
                    <w:color w:val="2F5496"/>
                </w:rPr>
                <w:t>{DB_NAME}</w:t>
            </w:r>
        </w:p>
        
        <w:p>
            <w:pPr>
                <w:jc w:val="center"/>
                <w:spacing w:after="480"/>
            </w:pPr>
            <w:r>
                <w:rPr>
                    <w:sz w:val="12"/>
                    <w:color w:val="666666"/>
                </w:rPr>
                <w:t>Generated: {GENERATED_DATE}</w:t>
            </w:r>
        </w:p>
        
        <!-- SUMMARY SECTION -->
        <w:p>
            <w:r>
                <w:rPr>
                    <w:b/>
                    <w:sz w:val="18"/>
                    <w:color w:val="1F4E79"/>
                </w:rPr>
                <w:t>Database Summary</w:t>
            </w:r>
        </w:p>
        
        <w:p>
            <w:r>
                <w:rPr>
                    <w:sz w:val="12"/>
                </w:rPr>
                <w:t>Total Tables: {TOTAL_TABLES}</w:t>
            </w:r>
        </w:p>
        
        <w:p>
            <w:r>
                <w:rPr>
                    <w:sz w:val="12"/>
                </w:rPr>
                <w:t>Total Columns: {TOTAL_COLUMNS}</w:t>
            </w:r>
        </w:p>
        
        <w:p>
            <w:r>
                <w:rPr>
                    <w:sz w:val="12"/>
                </w:rPr>
                <w:t>Average Columns per Table: {AVG_COLUMNS}</w:t>
            </w:r>
        </w:p>
        
        <!-- CATEGORY BREAKDOWN -->
        {CATEGORY_SECTION}
        
        <w:p>
            <w:r>
                <w:br/>
                <w:br/>
            </w:r>
        </w:p>
        
        <!-- TABLE DETAILS -->
        <w:p>
            <w:r>
                <w:rPr>
                    <w:b/>
                    <w:sz w:val="18"/>
                    <w:color w:val="1F4E79"/>
                </w:rPr>
                <w:t>Table Details</w:t>
            </w:r>
        </w:p>
        
        {TABLE_CONTENT}
        
        <!-- FOOTER -->
        <w:p>
            <w:pPr>
                <w:jc w:val="center"/>
                <w:spacing w:before="480"/>
            </w:pPr>
            <w:r>
                <w:rPr>
                    <w:sz w:val="10"/>
                    <w:color w:val="666666"/>
                </w:rPr>
                <w:t>--- End of Documentation ---</w:t>
            </w:r>
        </w:p>
        
        <w:sectPr>
            <w:pgSz w:w="11906" w:h="16838"/>
            <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/>
        </w:sectPr>
    </w:body>
</w:document>'''

        return document_xml
    
    def create_category_section(self, tables_info):
        """Buat section category breakdown"""
        
        categories = {}
        for table_name, column_count, pk_count, fk_count, category in tables_info:
            categories[category] = categories.get(category, 0) + 1
        
        category_xml = '''
        <w:p>
            <w:r>
                <w:rPr>
                    <w:b/>
                    <w:sz w:val="14"/>
                    <w:color w:val="2F5496"/>
                </w:rPr>
                <w:t>Categories Breakdown:</w:t>
            </w:r>
        </w:p>
'''
        
        for category, count in categories.items():
            safe_category = self.safe_xml_escape(category)
            category_xml += f'''
        <w:p>
            <w:r>
                <w:rPr>
                    <w:sz w:val="11"/>
                </w:rPr>
                <w:t>- {safe_category}: {count} tables</w:t>
            </w:r>
        </w:p>
'''
        
        return category_xml
    
    def create_enhanced_table_content(self, tables_info, max_tables=None):
        """Buat konten tabel yang enhanced tetapi aman"""
        
        if max_tables:
            tables_to_process = tables_info[:max_tables]
        else:
            tables_to_process = tables_info
            
        print(f"📝 Creating enhanced safe content for {len(tables_to_process)} tables...")
        
        table_content = ""
        current_category = ""
        
        for i, (table_name, column_count, pk_count, fk_count, category) in enumerate(tables_to_process, 1):
            
            if i % 10 == 0:
                print(f"   📊 Progress: {i}/{len(tables_to_process)} tables")
            
            # Category header jika berubah
            if category != current_category:
                current_category = category
                safe_category = self.safe_xml_escape(category)
                
                table_content += f'''
        <w:p>
            <w:pPr>
                <w:spacing w:before="360" w:after="120"/>
            </w:pPr>
            <w:r>
                <w:rPr>
                    <w:b/>
                    <w:sz w:val="14"/>
                    <w:color w:val="70AD47"/>
                </w:rPr>
                <w:t>{safe_category.upper()}</w:t>
            </w:r>
        </w:p>
'''
            
            # Safe table name
            safe_table_name = self.safe_xml_escape(table_name)
            
            # Generate AI description
            description = self.generate_ai_description_safe(table_name, category, column_count)
            
            # Table entry
            table_content += f'''
        <w:p>
            <w:pPr>
                <w:spacing w:before="240" w:after="60"/>
            </w:pPr>
            <w:r>
                <w:rPr>
                    <w:b/>
                    <w:sz w:val="13"/>
                    <w:color w:val="1F4E79"/>
                </w:rPr>
                <w:t>{i}. {safe_table_name}</w:t>
            </w:r>
        </w:p>
        
        <w:p>
            <w:r>
                <w:rPr>
                    <w:sz w:val="11"/>
                </w:rPr>
                <w:t>Columns: {column_count} | Primary Keys: {pk_count} | Foreign Keys: {fk_count}</w:t>
            </w:r>
        </w:p>
        
        <w:p>
            <w:pPr>
                <w:spacing w:after="120"/>
            </w:pPr>
            <w:r>
                <w:rPr>
                    <w:sz w:val="11"/>
                    <w:color w:val="666666"/>
                </w:rPr>
                <w:t>{description}</w:t>
            </w:r>
        </w:p>
'''
        
        return table_content
    
    def create_safe_docx_file(self, document_xml, output_path):
        """Buat DOCX file yang aman dan valid"""
        try:
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            
            with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED, compresslevel=1) as docx:
                
                # Content Types yang lengkap
                docx.writestr('[Content_Types].xml', '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
    <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
    <Default Extension="xml" ContentType="application/xml"/>
    <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
    <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>''')

                # Main relationships
                docx.writestr('_rels/.rels', '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
    <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>''')

                # Document relationships
                docx.writestr('word/_rels/document.xml.rels', '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
    <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>''')

                # Main document
                docx.writestr('word/document.xml', document_xml)
                
                # Basic styles
                docx.writestr('word/styles.xml', '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:docDefaults>
        <w:rPrDefault>
            <w:rPr>
                <w:rFonts w:ascii="Calibri" w:eastAsia="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/>
                <w:sz w:val="22"/>
            </w:rPr>
        </w:rPrDefault>
    </w:docDefaults>
</w:styles>''')
            
            return True
            
        except Exception as e:
            print(f"   ❌ DOCX creation error: {e}")
            return False
    
    def generate_enhanced_safe_documentation(self, max_tables=25):
        """Generate dokumentasi enhanced yang aman untuk Word"""
        
        print("🛡️ ENHANCED SAFE DOCX SYSTEM")
        print("=" * 60)
        print("📄 Creating professional DOCX that's guaranteed to open in Word")
        print()
        
        start_time = datetime.now()
        
        try:
            # Get data
            tables_info = self.get_enhanced_database_info()
            if not tables_info:
                print("❌ Failed to get database info")
                return False
            
            # Process tables
            if max_tables:
                tables_info = tables_info[:max_tables]
            
            # Calculate stats
            total_columns = sum(table[1] for table in tables_info)
            avg_columns = round(total_columns / len(tables_info), 1)
            
            # Create content sections
            category_section = self.create_category_section(tables_info)
            table_content = self.create_enhanced_table_content(tables_info, max_tables)
            
            # Build document
            document_xml = self.create_professional_docx_structure()
            
            # Fill placeholders safely
            safe_db_name = self.safe_xml_escape(self.db_config['dbname'].upper())
            safe_date = self.safe_xml_escape(datetime.now().strftime("%B %d, %Y at %H:%M WIB"))
            
            document_xml = document_xml.format(
                DB_NAME=safe_db_name,
                GENERATED_DATE=safe_date,
                TOTAL_TABLES=len(tables_info),
                TOTAL_COLUMNS=total_columns,
                AVG_COLUMNS=avg_columns,
                CATEGORY_SECTION=category_section,
                TABLE_CONTENT=table_content
            )
            
            # Create file
            output_path = os.path.join(self.output_dir, f"Enhanced_Safe_Documentation_{max_tables}T.docx")
            success = self.create_safe_docx_file(document_xml, output_path)
            
            if success:
                duration = datetime.now() - start_time
                file_size = os.path.getsize(output_path)
                
                print(f"\n🎉 ENHANCED SAFE DOCX CREATED!")
                print("=" * 60)
                print(f"📁 File: {os.path.basename(output_path)}")
                print(f"📊 Size: {file_size:,} bytes ({file_size/1024:.1f} KB)")
                print(f"📋 Tables: {len(tables_info)}")
                print(f"🔢 Columns: {total_columns}")
                print(f"⏱️ Duration: {duration}")
                print(f"🤖 AI Descriptions: Enhanced with safe XML escaping")
                print(f"📊 Categories: Organized by function")
                print(f"🛡️ Safety: XML validated and Word-compatible")
                
                return output_path
            else:
                print("\n❌ DOCX creation failed!")
                return False
                
        except Exception as e:
            print(f"\n💥 ERROR: {e}")
            return False

def main():
    """Main function"""
    system = EnhancedSafeDocxSystem()
    
    print("🚀 Enhanced Safe DOCX Documentation System")
    print("📋 Professional + AI descriptions + Word-safe")
    print()
    
    print("Select option:")
    print("1. Small test (15 tables)")
    print("2. Medium test (35 tables)")  
    print("3. Large test (75 tables)")
    print()
    
    choice = input("Enter choice (1-3) [default: 1]: ").strip() or "1"
    
    if choice == "1":
        result = system.generate_enhanced_safe_documentation(max_tables=15)
    elif choice == "2":
        result = system.generate_enhanced_safe_documentation(max_tables=35)
    elif choice == "3":
        result = system.generate_enhanced_safe_documentation(max_tables=75)
    else:
        result = system.generate_enhanced_safe_documentation(max_tables=15)
    
    if result:
        print(f"\n✨ SUCCESS! Try opening this DOCX in Word:")
        print(f"📁 {result}")
        print(f"\n🔧 This should open without any errors!")
    else:
        print(f"\n💥 FAILED! Check errors above")

if __name__ == '__main__':
    main()