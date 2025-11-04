# full_docx_system.py - Sistem DOCX lengkap dengan batch processing
import os
import subprocess
import zipfile
from datetime import datetime

class FullDocxDocumentationSystem:
    """Sistem DOCX lengkap yang dapat memproses semua tabel dengan batch processing"""
    
    def __init__(self):
        self.db_config = {
            'host': 'localhost',
            'port': '5414', 
            'dbname': 'deverm',
            'user': 'postgres',
            'password': '1234'
        }
        
        self.output_dir = os.path.join('..', 'output')
        
    def get_all_database_info(self):
        """Ambil semua informasi database"""
        print("🗄️ Getting complete database information...")
        
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
            
            # Query comprehensive untuk semua tabel
            cur.execute("""
                SELECT 
                    t.table_name,
                    COUNT(c.column_name) as column_count,
                    STRING_AGG(
                        CASE 
                            WHEN pk.column_name IS NOT NULL THEN c.column_name || ' (PK)' 
                            WHEN fk.column_name IS NOT NULL THEN c.column_name || ' (FK)' 
                            ELSE c.column_name 
                        END, ', '
                        ORDER BY c.ordinal_position
                    ) as columns_list,
                    COUNT(CASE WHEN pk.column_name IS NOT NULL THEN 1 END) as pk_count,
                    COUNT(CASE WHEN fk.column_name IS NOT NULL THEN 1 END) as fk_count
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
                ORDER BY t.table_name;
            """)
            
            tables = cur.fetchall()
            cur.close()
            conn.close()
            
            print(f"   ✅ Found {len(tables)} tables with complete metadata")
            return tables
            
        except Exception as e:
            print(f"   ❌ Database error: {e}")
            return None
    
    def generate_enhanced_ai_description(self, table_name, column_count, pk_count, fk_count):
        """Generate deskripsi yang lebih kaya dengan AI"""
        
        # Context yang lebih kaya
        relationships = ""
        if pk_count > 0:
            relationships += f"{pk_count} primary key(s), "
        if fk_count > 0:
            relationships += f"{fk_count} foreign key(s), "
        if relationships:
            relationships = relationships.rstrip(", ")
        else:
            relationships = "no relationships"
        
        prompt = f"""
Buat deskripsi profesional untuk tabel database '{table_name}':
- Kolom: {column_count}
- Relasi: {relationships}

PANDUAN:
1. Deskripsi dalam bahasa Indonesia yang formal dan profesional
2. Maksimal 3 kalimat yang informatif
3. Jelaskan fungsi bisnis berdasarkan nama tabel
4. Sebutkan peran dalam sistem jika ada relasi
5. Fokus pada kegunaan praktis

FORMAT: Langsung berikan deskripsi tanpa label atau pengantar.
"""
        
        try:
            result = subprocess.run(
                ["ollama", "run", "llama3", prompt],
                capture_output=True, text=True, timeout=25,
                encoding='utf-8', errors='replace'
            )
            
            if result.stdout.strip():
                desc = result.stdout.strip()
                desc = self._clean_description(desc)
                return desc
            else:
                return self._enhanced_fallback(table_name, column_count, pk_count, fk_count)
                
        except Exception:
            return self._enhanced_fallback(table_name, column_count, pk_count, fk_count)
    
    def _clean_description(self, desc):
        """Clean up AI description"""
        # Remove markdown and unwanted prefixes
        desc = desc.replace('**', '').replace('*', '')
        unwanted_starts = ["Tabel ini", "Ini adalah tabel", "Deskripsi:", "Penjelasan:"]
        
        for start in unwanted_starts:
            if desc.startswith(start):
                desc = desc[len(start):].strip()
                if desc and desc[0].islower():
                    desc = desc[0].upper() + desc[1:]
        
        if desc and not desc.endswith('.'):
            desc += '.'
            
        return desc
    
    def _enhanced_fallback(self, table_name, column_count, pk_count, fk_count):
        """Enhanced fallback descriptions"""
        name_lower = table_name.lower()
        
        # Categorization dengan konteks yang lebih baik
        if any(word in name_lower for word in ['auth', 'user', 'login', 'permission', 'group']):
            return f"Tabel {table_name} mengelola sistem autentikasi dan otorisasi pengguna dengan {column_count} kolom, {pk_count} primary key, dan {fk_count} foreign key untuk keamanan aplikasi."
        elif any(word in name_lower for word in ['log', 'audit', 'history', 'track']):
            return f"Tabel {table_name} menyimpan catatan log dan audit trail sistem dengan {column_count} atribut untuk monitoring dan pelacakan aktivitas."
        elif any(word in name_lower for word in ['django', 'admin', 'system', 'config']):
            return f"Tabel {table_name} merupakan bagian dari infrastruktur framework dengan {column_count} parameter konfigurasi untuk administrasi sistem."
        elif any(word in name_lower for word in ['celery', 'beat', 'task', 'job', 'schedule']):
            return f"Tabel {table_name} mengatur penjadwalan dan eksekusi task background dengan {column_count} kolom untuk manajemen asynchronous processing."
        elif fk_count >= 2:
            return f"Tabel {table_name} berfungsi sebagai junction table dengan {column_count} kolom dan {fk_count} foreign key untuk menghubungkan entitas dalam sistem."
        else:
            return f"Tabel {table_name} menyimpan data operasional aplikasi dengan {column_count} kolom dan struktur relasi {pk_count} PK, {fk_count} FK untuk kebutuhan bisnis."
    
    def create_professional_docx_structure(self):
        """Buat struktur DOCX yang lebih profesional"""
        
        document_xml = '''<?xml version='1.0' encoding='UTF-8' standalone='yes'?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:body>

<!-- COVER PAGE -->
<w:p>
    <w:pPr><w:jc w:val="center"/><w:spacing w:after="480"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="32"/><w:szCs w:val="32"/><w:b/><w:color w:val="1F4E79"/></w:rPr>
    <w:t>📊 DOKUMENTASI DATABASE</w:t></w:r>
</w:p>

<w:p>
    <w:pPr><w:jc w:val="center"/><w:spacing w:after="240"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="24"/><w:b/><w:color w:val="2F5496"/></w:rPr>
    <w:t>{DB_NAME}</w:t></w:r>
</w:p>

<w:p>
    <w:pPr><w:jc w:val="center"/><w:spacing w:after="480"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="14"/><w:color w:val="666666"/></w:rPr>
    <w:t>Generated: {GENERATED_DATE}</w:t></w:r>
</w:p>

<w:p>
    <w:pPr><w:pageBreakBefore/></w:pPr>
</w:p>

<!-- EXECUTIVE SUMMARY -->
<w:p>
    <w:pPr><w:pStyle w:val="Heading1"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="20"/><w:b/><w:color w:val="1F4E79"/></w:rPr>
    <w:t>📋 RINGKASAN EKSEKUTIF</w:t></w:r>
</w:p>

<w:p>
    <w:pPr><w:spacing w:after="120"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="11"/></w:rPr>
    <w:t>Database {DB_NAME} terdiri dari {TOTAL_TABLES} tabel dengan total {TOTAL_COLUMNS} kolom. Sistem ini memiliki rata-rata {AVG_COLUMNS} kolom per tabel dengan struktur relasi yang terintegrasi untuk mendukung operasional aplikasi.</w:t></w:r>
</w:p>

<w:tbl>
    <w:tblPr>
        <w:tblW w:w="5000" w:type="pct"/>
        <w:tblBorders>
            <w:top w:val="single" w:sz="4" w:color="2F5496"/>
            <w:left w:val="single" w:sz="4" w:color="2F5496"/>
            <w:bottom w:val="single" w:sz="4" w:color="2F5496"/>
            <w:right w:val="single" w:sz="4" w:color="2F5496"/>
            <w:insideH w:val="single" w:sz="4" w:color="C5D0E6"/>
            <w:insideV w:val="single" w:sz="4" w:color="C5D0E6"/>
        </w:tblBorders>
    </w:tblPr>
    <w:tr>
        <w:tc><w:tcPr><w:shd w:val="clear" w:color="auto" w:fill="D5E3F7"/></w:tcPr>
        <w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Metrik</w:t></w:r></w:p></w:tc>
        <w:tc><w:tcPr><w:shd w:val="clear" w:color="auto" w:fill="D5E3F7"/></w:tcPr>
        <w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Nilai</w:t></w:r></w:p></w:tc>
    </w:tr>
    <w:tr>
        <w:tc><w:p><w:r><w:t>Total Tabel</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>{TOTAL_TABLES}</w:t></w:r></w:p></w:tc>
    </w:tr>
    <w:tr>
        <w:tc><w:p><w:r><w:t>Total Kolom</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>{TOTAL_COLUMNS}</w:t></w:r></w:p></w:tc>
    </w:tr>
    <w:tr>
        <w:tc><w:p><w:r><w:t>Rata-rata Kolom/Tabel</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>{AVG_COLUMNS}</w:t></w:r></w:p></w:tc>
    </w:tr>
</w:tbl>

<w:p><w:r><w:br/></w:r></w:p>

<!-- DETAIL TABEL -->
<w:p>
    <w:pPr><w:pStyle w:val="Heading1"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="20"/><w:b/><w:color w:val="1F4E79"/></w:rPr>
    <w:t>🗄️ DETAIL TABEL DATABASE</w:t></w:r>
</w:p>

{TABLE_CONTENT}

<w:sectPr>
    <w:pgSz w:w="11906" w:h="16838"/>
    <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/>
</w:sectPr>

</w:body>
</w:document>'''

        return document_xml
    
    def create_table_content_professional(self, tables_info, batch_size=None):
        """Buat konten tabel yang lebih profesional dengan progress"""
        
        total_tables = len(tables_info) 
        if batch_size:
            tables_to_process = tables_info[:batch_size]
        else:
            tables_to_process = tables_info
            
        print(f"📝 Generating professional content for {len(tables_to_process)} tables...")
        
        table_content = ""
        success_count = 0
        
        for i, (table_name, column_count, columns_list, pk_count, fk_count) in enumerate(tables_to_process, 1):
            
            # Progress indicator
            if i % 10 == 0 or i == len(tables_to_process):
                print(f"   📊 Progress: {i}/{len(tables_to_process)} ({i/len(tables_to_process)*100:.1f}%)")
            
            try:
                # Generate description
                description = self.generate_enhanced_ai_description(table_name, column_count, pk_count, fk_count)
                
                # Clean columns for display
                columns_display = columns_list
                if len(columns_display) > 300:
                    columns_display = columns_display[:300] + "..."
                
                # Professional table XML with better formatting
                table_xml = f'''
<w:p>
    <w:pPr><w:spacing w:before="240" w:after="120"/></w:pPr>
    <w:r><w:rPr><w:b/><w:sz w:val="16"/><w:color w:val="1F4E79"/></w:rPr>
    <w:t>{i}. {table_name.upper()}</w:t></w:r>
</w:p>

<w:tbl>
    <w:tblPr>
        <w:tblW w:w="5000" w:type="pct"/>
        <w:tblBorders>
            <w:top w:val="single" w:sz="4" w:color="70AD47"/>
            <w:left w:val="single" w:sz="4" w:color="70AD47"/>
            <w:bottom w:val="single" w:sz="4" w:color="70AD47"/>
            <w:right w:val="single" w:sz="4" w:color="70AD47"/>
            <w:insideH w:val="single" w:sz="2" w:color="E2EFDA"/>
            <w:insideV w:val="single" w:sz="2" w:color="E2EFDA"/>
        </w:tblBorders>
    </w:tblPr>
    <w:tr>
        <w:tc><w:tcPr><w:shd w:val="clear" w:color="auto" w:fill="E2EFDA"/></w:tcPr>
        <w:p><w:r><w:rPr><w:b/><w:sz w:val="10"/></w:rPr><w:t>Kolom</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:rPr><w:sz w:val="10"/></w:rPr><w:t>{column_count}</w:t></w:r></w:p></w:tc>
    </w:tr>
    <w:tr>
        <w:tc><w:tcPr><w:shd w:val="clear" w:color="auto" w:fill="E2EFDA"/></w:tcPr>
        <w:p><w:r><w:rPr><w:b/><w:sz w:val="10"/></w:rPr><w:t>Primary Keys</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:rPr><w:sz w:val="10"/></w:rPr><w:t>{pk_count}</w:t></w:r></w:p></w:tc>
    </w:tr>
    <w:tr>
        <w:tc><w:tcPr><w:shd w:val="clear" w:color="auto" w:fill="E2EFDA"/></w:tcPr>
        <w:p><w:r><w:rPr><w:b/><w:sz w:val="10"/></w:rPr><w:t>Foreign Keys</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:rPr><w:sz w:val="10"/></w:rPr><w:t>{fk_count}</w:t></w:r></w:p></w:tc>
    </w:tr>
</w:tbl>

<w:p>
    <w:pPr><w:spacing w:after="120"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="11"/><w:color w:val="595959"/></w:rPr>
    <w:t>💬 {description}</w:t></w:r>
</w:p>

<w:p>
    <w:pPr><w:spacing w:after="120"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="9"/><w:color w:val="7F7F7F"/></w:rPr>
    <w:t>🔑 {columns_display}</w:t></w:r>
</w:p>
'''
                table_content += table_xml
                success_count += 1
                
            except Exception as e:
                print(f"   ⚠️ Error processing {table_name}: {e}")
                continue
        
        print(f"   ✅ Successfully processed {success_count}/{len(tables_to_process)} tables")
        return table_content
    
    def generate_full_documentation(self, batch_size=None, filename=None):
        """Generate dokumentasi lengkap dengan opsi batch"""
        
        print("🎯 FULL DOCX DOCUMENTATION SYSTEM")
        print("=" * 60)
        
        if batch_size:
            print(f"📊 Processing first {batch_size} tables")
        else:
            print("📊 Processing ALL tables (this may take a while)")
        print()
        
        start_time = datetime.now()
        
        try:
            # Get all data
            tables_info = self.get_all_database_info()
            if not tables_info:
                return False
            
            # Calculate stats
            if batch_size:
                process_tables = tables_info[:batch_size]
            else:
                process_tables = tables_info
                
            total_columns = sum(table[1] for table in process_tables)
            avg_columns = round(total_columns / len(process_tables), 1)
            
            # Generate content
            table_content = self.create_table_content_professional(tables_info, batch_size)
            
            # Create document
            document_xml = self.create_professional_docx_structure()
            
            # Fill template
            document_xml = document_xml.format(
                DB_NAME=self.db_config['dbname'].upper(),
                GENERATED_DATE=datetime.now().strftime("%d %B %Y, %H:%M:%S WIB"),
                TOTAL_TABLES=len(process_tables),
                TOTAL_COLUMNS=total_columns,
                AVG_COLUMNS=avg_columns,
                TABLE_CONTENT=table_content
            )
            
            # Output filename
            if filename:
                output_path = os.path.join(self.output_dir, filename)
            elif batch_size:
                output_path = os.path.join(self.output_dir, f"Documentation_{batch_size}_Tables.docx")
            else:
                output_path = os.path.join(self.output_dir, f"Complete_Database_Documentation.docx")
            
            # Create DOCX
            success = self._create_professional_docx_file(document_xml, output_path)
            
            if success:
                duration = datetime.now() - start_time
                file_size = os.path.getsize(output_path)
                
                print(f"\n🎉 DOCUMENTATION COMPLETE!")
                print("=" * 60)
                print(f"📁 File: {os.path.basename(output_path)}")
                print(f"📊 Size: {file_size:,} bytes")
                print(f"📋 Tables: {len(process_tables)}")
                print(f"🔢 Columns: {total_columns}")
                print(f"⏱️ Duration: {duration}")
                print(f"🎨 Format: Professional with tables and styling")
                
                return output_path
            else:
                print("\n❌ Documentation generation failed!")
                return False
                
        except Exception as e:
            print(f"\n💥 ERROR: {e}")
            return False
    
    def _create_professional_docx_file(self, document_xml, output_path):
        """Create the actual DOCX file"""
        try:
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            
            with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as docx:
                # Content Types
                docx.writestr('[Content_Types].xml', '''<?xml version='1.0' encoding='UTF-8' standalone='yes'?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>''')

                # Relationships
                docx.writestr('_rels/.rels', '''<?xml version='1.0' encoding='UTF-8' standalone='yes'?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>''')

                docx.writestr('word/_rels/document.xml.rels', '''<?xml version='1.0' encoding='UTF-8' standalone='yes'?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>''')

                # Main document
                docx.writestr('word/document.xml', document_xml)
                
                # Enhanced styles
                docx.writestr('word/styles.xml', '''<?xml version='1.0' encoding='UTF-8' standalone='yes'?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:docDefaults>
    <w:rPrDefault>
        <w:rPr>
            <w:rFonts w:ascii="Segoe UI" w:eastAsia="Segoe UI" w:hAnsi="Segoe UI" w:cs="Segoe UI"/>
            <w:sz w:val="22"/>
        </w:rPr>
    </w:rPrDefault>
</w:docDefaults>
<w:style w:type="paragraph" w:styleId="Heading1">
    <w:name w:val="Heading 1"/>
    <w:pPr>
        <w:spacing w:before="480" w:after="240"/>
    </w:pPr>
    <w:rPr>
        <w:rFonts w:ascii="Segoe UI" w:hAnsi="Segoe UI"/>
        <w:b/>
        <w:sz w:val="20"/>
        <w:color w:val="1F4E79"/>
    </w:rPr>
</w:style>
</w:styles>''')
            
            return True
            
        except Exception as e:
            print(f"   ❌ File creation error: {e}")
            return False

def main():
    """Main function dengan opsi"""
    system = FullDocxDocumentationSystem()
    
    print("🚀 FULL DOCX DOCUMENTATION GENERATOR")
    print("📋 Professional database documentation system")
    print()
    
    # Pilihan: test dengan 10 tabel atau semua tabel
    print("Choose an option:")
    print("1. Quick test (10 tables)")  
    print("2. Medium batch (50 tables)")
    print("3. All tables (may take 10+ minutes)")
    print()
    
    choice = input("Enter choice (1-3) [default: 1]: ").strip() or "1"
    
    if choice == "1":
        result = system.generate_full_documentation(batch_size=10, filename="Quick_Test_Documentation.docx")
    elif choice == "2":
        result = system.generate_full_documentation(batch_size=50, filename="Medium_Documentation.docx") 
    elif choice == "3":
        result = system.generate_full_documentation(filename="Complete_All_Tables_Documentation.docx")
    else:
        print("Invalid choice, using quick test...")
        result = system.generate_full_documentation(batch_size=10, filename="Default_Documentation.docx")
    
    if result:
        print(f"\n✨ Success! Check the output folder for your professional DOCX!")
    else:
        print(f"\n💥 Failed! Check errors above.")

if __name__ == '__main__':
    main()