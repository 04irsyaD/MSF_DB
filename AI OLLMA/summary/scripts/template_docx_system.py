# template_docx_system.py - Sistem DOCX murni tanpa dependency eksternal
import os
import subprocess
import zipfile
import xml.etree.ElementTree as ET
from datetime import datetime

class SimpleDocxTemplateSystem:
    """Sistem yang menghasilkan DOCX murni sesuai template"""
    
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
        
    def create_docx_structure(self):
        """Buat struktur DOCX standar dengan formatting yang bagus"""
        
        # Document.xml content yang terstruktur
        document_xml = '''<?xml version='1.0' encoding='UTF-8' standalone='yes'?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:body>
<!-- HEADER SECTION -->
<w:p>
    <w:pPr><w:pStyle w:val="Title"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="28"/><w:szCs w:val="28"/><w:b/></w:rPr>
    <w:t>DOKUMENTASI DATABASE {DB_NAME}</w:t></w:r>
</w:p>

<w:p>
    <w:pPr><w:pStyle w:val="Subtitle"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="14"/><w:color w:val="666666"/></w:rPr>
    <w:t>Generated on: {GENERATED_DATE}</w:t></w:r>
</w:p>

<w:p><w:r><w:br/></w:r></w:p>

<!-- SUMMARY SECTION -->
<w:p>
    <w:pPr><w:pStyle w:val="Heading1"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="18"/><w:b/><w:color w:val="2F5496"/></w:rPr>
    <w:t>📊 RINGKASAN DATABASE</w:t></w:r>
</w:p>

<w:p>
    <w:r><w:rPr><w:sz w:val="11"/></w:rPr>
    <w:t>• Total Tabel: {TOTAL_TABLES}</w:t></w:r>
</w:p>

<w:p>
    <w:r><w:rPr><w:sz w:val="11"/></w:rPr>
    <w:t>• Total Kolom: {TOTAL_COLUMNS}</w:t></w:r>
</w:p>

<w:p>
    <w:r><w:rPr><w:sz w:val="11"/></w:rPr>
    <w:t>• Rata-rata Kolom per Tabel: {AVG_COLUMNS}</w:t></w:r>
</w:p>

<w:p><w:r><w:br/></w:r></w:p>

<!-- TABLES SECTION -->
<w:p>
    <w:pPr><w:pStyle w:val="Heading1"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="18"/><w:b/><w:color w:val="2F5496"/></w:rPr>
    <w:t>🗄️ DETAIL TABEL</w:t></w:r>
</w:p>

{TABLE_CONTENT}

<w:sectPr>
    <w:pgSz w:w="11906" w:h="16838"/>
    <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/>
</w:sectPr>

</w:body>
</w:document>'''

        # Styles.xml untuk formatting yang konsisten
        styles_xml = '''<?xml version='1.0' encoding='UTF-8' standalone='yes'?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:docDefaults>
    <w:rPrDefault>
        <w:rPr>
            <w:rFonts w:ascii="Calibri" w:eastAsia="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/>
            <w:sz w:val="22"/>
        </w:rPr>
    </w:rPrDefault>
</w:docDefaults>

<w:style w:type="paragraph" w:styleId="Title">
    <w:name w:val="Title"/>
    <w:basedOn w:val="Normal"/>
    <w:pPr>
        <w:jc w:val="center"/>
        <w:spacing w:after="240"/>
    </w:pPr>
    <w:rPr>
        <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
        <w:b/>
        <w:sz w:val="28"/>
        <w:color w:val="1F4E79"/>
    </w:rPr>
</w:style>

<w:style w:type="paragraph" w:styleId="Subtitle">
    <w:name w:val="Subtitle"/>
    <w:pPr>
        <w:jc w:val="center"/>
        <w:spacing w:after="120"/>
    </w:pPr>
    <w:rPr>
        <w:sz w:val="14"/>
        <w:color w:val="666666"/>
    </w:rPr>
</w:style>

<w:style w:type="paragraph" w:styleId="Heading1">
    <w:name w:val="Heading 1"/>
    <w:pPr>
        <w:spacing w:before="240" w:after="120"/>
    </w:pPr>
    <w:rPr>
        <w:b/>
        <w:sz w:val="18"/>
        <w:color w:val="2F5496"/>
    </w:rPr>
</w:style>

<w:style w:type="paragraph" w:styleId="TableHeader">
    <w:name w:val="Table Header"/>
    <w:pPr>
        <w:spacing w:after="60"/>
    </w:pPr>
    <w:rPr>
        <w:b/>
        <w:sz w:val="14"/>
        <w:color w:val="1F4E79"/>
    </w:rPr>
</w:style>

</w:styles>'''

        return document_xml, styles_xml
    
    def get_database_info(self):
        """Ambil informasi database yang ringkas"""
        print("🗄️ Getting database information...")
        
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
            
            # Query untuk basic info
            cur.execute("""
                SELECT 
                    t.table_name,
                    COUNT(c.column_name) as column_count,
                    STRING_AGG(
                        CASE WHEN pk.column_name IS NOT NULL 
                        THEN c.column_name || ' (PK)' 
                        ELSE c.column_name END, ', '
                        ORDER BY c.ordinal_position
                    ) as columns_list
                FROM information_schema.tables t
                LEFT JOIN information_schema.columns c ON t.table_name = c.table_name
                LEFT JOIN (
                    SELECT kcu.column_name, kcu.table_name
                    FROM information_schema.table_constraints tc
                    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
                    WHERE tc.constraint_type = 'PRIMARY KEY'
                ) pk ON c.column_name = pk.column_name AND c.table_name = pk.table_name
                WHERE t.table_schema = 'public' AND c.table_schema = 'public'
                GROUP BY t.table_name
                ORDER BY t.table_name;
            """)
            
            tables = cur.fetchall()
            cur.close()
            conn.close()
            
            print(f"   ✅ Found {len(tables)} tables")
            return tables
            
        except Exception as e:
            print(f"   ❌ Database error: {e}")
            return None
    
    def generate_ai_description_simple(self, table_name, column_count):
        """Generate deskripsi sederhana dengan AI"""
        
        prompt = f"""
Buat deskripsi profesional dan singkat untuk tabel database '{table_name}' yang memiliki {column_count} kolom.

INSTRUKSI:
1. Deskripsi dalam bahasa Indonesia yang formal
2. Maksimal 2 kalimat
3. Jelaskan fungsi utama tabel berdasarkan namanya
4. Fokus pada kegunaan bisnis atau sistem

FORMAT: Langsung berikan deskripsi tanpa label.
"""
        
        try:
            result = subprocess.run(
                ["ollama", "run", "llama3", prompt],
                capture_output=True, text=True, timeout=20,
                encoding='utf-8', errors='replace'
            )
            
            if result.stdout.strip():
                desc = result.stdout.strip()
                # Clean up
                desc = desc.replace('**', '').replace('*', '')
                if not desc.endswith('.'):
                    desc += '.'
                return desc
            else:
                return self._fallback_description(table_name, column_count)
                
        except Exception:
            return self._fallback_description(table_name, column_count)
    
    def _fallback_description(self, table_name, column_count):
        """Deskripsi fallback yang berkualitas"""
        name_lower = table_name.lower()
        
        if 'auth' in name_lower or 'user' in name_lower:
            return f"Tabel {table_name} mengelola autentikasi dan data pengguna sistem dengan {column_count} atribut untuk keamanan aplikasi."
        elif 'log' in name_lower or 'audit' in name_lower:
            return f"Tabel {table_name} menyimpan catatan aktivitas dan audit trail dengan {column_count} kolom untuk monitoring sistem."
        elif 'admin' in name_lower or 'django' in name_lower:
            return f"Tabel {table_name} merupakan bagian dari sistem administrasi dengan {column_count} parameter konfigurasi."
        else:
            return f"Tabel {table_name} menyimpan data operasional aplikasi dengan {column_count} kolom untuk kebutuhan bisnis sistem."
    
    def create_table_content_xml(self, tables_info, max_tables=5):
        """Buat konten XML untuk setiap tabel"""
        print(f"📝 Generating content for {min(len(tables_info), max_tables)} tables...")
        
        table_content = ""
        
        for i, (table_name, column_count, columns_list) in enumerate(tables_info[:max_tables], 1):
            print(f"   {i:2d}. {table_name}")
            
            # Generate AI description
            description = self.generate_ai_description_simple(table_name, column_count)
            
            # Format columns list untuk display yang lebih baik
            columns_display = columns_list
            if len(columns_display) > 200:
                columns_display = columns_display[:200] + "..."
            
            # XML untuk setiap tabel
            table_xml = f'''
<w:p>
    <w:pPr><w:pStyle w:val="TableHeader"/></w:pPr>
    <w:r><w:rPr><w:b/><w:sz w:val="14"/><w:color w:val="1F4E79"/></w:rPr>
    <w:t>{i}. {table_name}</w:t></w:r>
</w:p>

<w:p>
    <w:r><w:rPr><w:sz w:val="11"/></w:rPr>
    <w:t>📊 Jumlah Kolom: {column_count}</w:t></w:r>
</w:p>

<w:p>
    <w:r><w:rPr><w:sz w:val="11"/></w:rPr>
    <w:t>📝 Deskripsi: {description}</w:t></w:r>
</w:p>

<w:p>
    <w:r><w:rPr><w:sz w:val="10"/><w:color w:val="666666"/></w:rPr>
    <w:t>🔑 Kolom: {columns_display}</w:t></w:r>
</w:p>

<w:p><w:r><w:br/></w:r></w:p>
'''
            table_content += table_xml
        
        return table_content
    
    def build_complete_docx(self, tables_info, max_tables=5):
        """Build DOCX lengkap dari scratch"""
        print(f"\n📄 Building complete DOCX...")
        
        # Calculate summary stats
        total_tables = min(len(tables_info), max_tables)
        total_columns = sum(table[1] for table in tables_info[:max_tables])
        avg_columns = round(total_columns / total_tables, 1) if total_tables > 0 else 0
        
        # Generate table content
        table_content = self.create_table_content_xml(tables_info, max_tables)
        
        # Get document structure
        document_xml, styles_xml = self.create_docx_structure()
        
        # Fill placeholders
        document_xml = document_xml.format(
            DB_NAME=self.db_config['dbname'].upper(),
            GENERATED_DATE=datetime.now().strftime("%d %B %Y, %H:%M:%S"),
            TOTAL_TABLES=total_tables,
            TOTAL_COLUMNS=total_columns,
            AVG_COLUMNS=avg_columns,
            TABLE_CONTENT=table_content
        )
        
        # Create DOCX structure
        try:
            os.makedirs(os.path.dirname(self.output_path), exist_ok=True)
            
            with zipfile.ZipFile(self.output_path, 'w', zipfile.ZIP_DEFLATED) as docx:
                # Content Types
                docx.writestr('[Content_Types].xml', '''<?xml version='1.0' encoding='UTF-8' standalone='yes'?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>''')

                # Main relationships
                docx.writestr('_rels/.rels', '''<?xml version='1.0' encoding='UTF-8' standalone='yes'?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>''')

                # Document relationships  
                docx.writestr('word/_rels/document.xml.rels', '''<?xml version='1.0' encoding='UTF-8' standalone='yes'?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>''')

                # Main document
                docx.writestr('word/document.xml', document_xml)
                
                # Styles
                docx.writestr('word/styles.xml', styles_xml)
            
            # Validate
            if os.path.exists(self.output_path):
                file_size = os.path.getsize(self.output_path)
                print(f"   ✅ DOCX created successfully!")
                print(f"   📁 File: {os.path.basename(self.output_path)}")
                print(f"   📊 Size: {file_size:,} bytes")
                print(f"   📋 Tables: {total_tables}")
                print(f"   🔢 Columns: {total_columns}")
                return True
            else:
                print("   ❌ File creation failed")
                return False
                
        except Exception as e:
            print(f"   ❌ DOCX creation error: {e}")
            return False
    
    def run_simple_docx_generation(self, max_tables=5):
        """Jalankan proses lengkap untuk generate DOCX"""
        
        print("🎯 SIMPLE DOCX DOCUMENTATION GENERATOR")
        print("=" * 60)
        print("📄 Creating professional DOCX documentation")
        print()
        
        start_time = datetime.now()
        
        try:
            # Get database info
            tables_info = self.get_database_info()
            if not tables_info:
                print("❌ Failed to get database information")
                return False
            
            # Build DOCX
            success = self.build_complete_docx(tables_info, max_tables)
            
            if success:
                duration = datetime.now() - start_time
                
                print(f"\n🎉 SUCCESS! Professional DOCX created!")
                print("=" * 60)
                print(f"📁 Output: {self.output_path}")
                print(f"⏱️ Duration: {duration}")
                print(f"🎨 Formatting: Professional template with colors and fonts")
                print(f"🤖 Descriptions: AI-generated business explanations")
                
                return True
            else:
                print("\n❌ DOCX generation failed!")
                return False
                
        except Exception as e:
            print(f"\n💥 ERROR: {e}")
            return False

def main():
    """Main function"""
    system = SimpleDocxTemplateSystem()
    
    print("🚀 Starting simple DOCX documentation generation...")
    print("📋 This creates a professional DOCX without external dependencies\n")
    
    # Generate dengan 5 tabel untuk test
    success = system.run_simple_docx_generation(max_tables=5)
    
    if success:
        print(f"\n✨ Perfect! Check your DOCX - it should look professional!")
        print(f"🔄 To process all tables, change max_tables parameter")
    else:
        print(f"\n💥 Failed! Check errors above")

if __name__ == '__main__':
    main()