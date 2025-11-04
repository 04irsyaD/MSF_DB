# final_template_system.py - Sistem final yang menghasilkan DOCX sesuai template
import os
import subprocess
import zipfile
from datetime import datetime

class FinalTemplateDocxSystem:
    """
    Sistem final yang menghasilkan DOCX dengan format template profesional
    HANYA DOCX - TIDAK ADA TXT
    """
    
    def __init__(self):
        self.db_config = {
            'host': 'localhost',
            'port': '5414', 
            'dbname': 'deverm',
            'user': 'postgres',
            'password': '1234'
        }
        
        # Output hanya DOCX
        self.output_dir = os.path.join('..', 'output')
        
    def get_optimized_database_info(self):
        """Ambil informasi database yang dioptimalkan untuk template"""
        print("🗄️ Extracting database information for template...")
        
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
            
            # Query yang lebih comprehensive dan template-friendly
            cur.execute("""
                WITH table_stats AS (
                    SELECT 
                        t.table_name,
                        COUNT(c.column_name) as column_count,
                        COUNT(CASE WHEN pk.column_name IS NOT NULL THEN 1 END) as pk_count,
                        COUNT(CASE WHEN fk.column_name IS NOT NULL THEN 1 END) as fk_count,
                        STRING_AGG(
                            CASE 
                                WHEN pk.column_name IS NOT NULL THEN c.column_name || ' (PK)'
                                WHEN fk.column_name IS NOT NULL THEN c.column_name || ' (FK→' || fk.foreign_table_name || ')'
                                ELSE c.column_name 
                            END, ', '
                            ORDER BY c.ordinal_position
                        ) as columns_detail,
                        CASE 
                            WHEN t.table_name ILIKE '%auth%' OR t.table_name ILIKE '%user%' OR t.table_name ILIKE '%permission%' THEN 'Authentication & Authorization'
                            WHEN t.table_name ILIKE '%log%' OR t.table_name ILIKE '%audit%' OR t.table_name ILIKE '%history%' THEN 'Logging & Audit Trail'
                            WHEN t.table_name ILIKE '%django%' OR t.table_name ILIKE '%admin%' OR t.table_name ILIKE '%system%' THEN 'System Administration'
                            WHEN t.table_name ILIKE '%celery%' OR t.table_name ILIKE '%beat%' OR t.table_name ILIKE '%task%' THEN 'Task Management'
                            WHEN t.table_name ILIKE '%session%' OR t.table_name ILIKE '%token%' THEN 'Session Management'
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
                        SELECT
                            kcu.column_name,
                            kcu.table_name,
                            ccu.table_name AS foreign_table_name
                        FROM information_schema.table_constraints AS tc
                        JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name
                        JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name
                        WHERE tc.constraint_type = 'FOREIGN KEY'
                    ) fk ON c.column_name = fk.column_name AND c.table_name = fk.table_name
                    WHERE t.table_schema = 'public'
                    GROUP BY t.table_name
                )
                SELECT 
                    table_name,
                    column_count,
                    pk_count,
                    fk_count,
                    columns_detail,
                    category
                FROM table_stats
                ORDER BY category, table_name;
            """)
            
            tables = cur.fetchall()
            cur.close()
            conn.close()
            
            print(f"   ✅ Extracted {len(tables)} tables with enhanced metadata")
            return tables
            
        except Exception as e:
            print(f"   ❌ Database error: {e}")
            return None
    
    def generate_template_aware_ai_description(self, table_name, column_count, pk_count, fk_count, category):
        """Generate deskripsi yang benar-benar sesuai dengan style template profesional"""
        
        # Context yang kaya untuk template
        context_info = f"Category: {category}, Columns: {column_count}, PKs: {pk_count}, FKs: {fk_count}"
        
        prompt = f"""
Sebagai expert database architect, buat deskripsi profesional untuk dokumentasi template untuk tabel '{table_name}'.

CONTEXT:
- {context_info}
- Untuk dokumentasi resmi perusahaan
- Audience: Developer dan stakeholder bisnis

REQUIREMENTS:
1. Bahasa Indonesia formal dan profesional
2. Fokus pada VALUE BISNIS tabel dalam sistem
3. 2-3 kalimat yang informatif dan ringkas
4. Jelaskan FUNGSI UTAMA dan PERAN dalam workflow
5. Sebutkan relasi jika penting untuk bisnis

TONE: Profesional, informatif, mudah dipahami

OUTPUT: Langsung deskripsi tanpa label apapun.
"""
        
        try:
            result = subprocess.run(
                ["ollama", "run", "deepseek-r1:8b", prompt],
                capture_output=True, text=True, timeout=30,
                encoding='utf-8', errors='replace'
            )
            
            if result.stdout.strip():
                desc = result.stdout.strip()
                desc = self._polish_description(desc)
                return desc
            else:
                return self._create_professional_fallback(table_name, category, column_count, pk_count, fk_count)
                
        except Exception:
            return self._create_professional_fallback(table_name, category, column_count, pk_count, fk_count)
    
    def _polish_description(self, desc):
        """Polish AI description untuk template quality"""
        # Remove unwanted elements
        unwanted = ["**", "*", "Deskripsi:", "Penjelasan:", "Tabel ini", "Ini adalah"]
        for item in unwanted:
            desc = desc.replace(item, "")
        
        # Clean start
        desc = desc.strip()
        if desc and desc[0].islower():
            desc = desc[0].upper() + desc[1:]
        
        # Ensure proper ending
        if desc and not desc.endswith('.'):
            desc += '.'
        
        # Limit length untuk template
        if len(desc) > 250:
            sentences = desc.split('.')
            desc = sentences[0] + '.'
            if len(desc) < 100 and len(sentences) > 1:
                desc = sentences[0] + '. ' + sentences[1] + '.'
        
        return desc
    
    def _create_professional_fallback(self, table_name, category, column_count, pk_count, fk_count):
        """Fallback descriptions yang sangat profesional"""
        
        templates = {
            'Authentication & Authorization': f"Mengelola sistem keamanan dan kontrol akses pengguna dengan {column_count} atribut autentikasi. Mengintegrasikan mekanisme login, permissions, dan role-based access control untuk menjamin keamanan aplikasi.",
            
            'Logging & Audit Trail': f"Menyimpan catatan komprehensif aktivitas sistem dan audit trail dengan {column_count} kolom tracking. Mendukung compliance requirements dan forensic analysis untuk monitoring keamanan operasional.",
            
            'System Administration': f"Mengelola konfigurasi dan metadata sistem dengan {column_count} parameter administratif. Menyediakan infrastruktur framework untuk content management dan system governance.",
            
            'Task Management': f"Mengatur penjadwalan dan eksekusi background tasks dengan {column_count} kolom konfigurasi. Mendukung asynchronous processing dan automated workflow management untuk optimasi performa sistem.",
            
            'Session Management': f"Mengelola sesi pengguna dan token authentication dengan {column_count} atribut keamanan. Menjamin kontinuitas user experience dan security state management.",
            
            'Business Logic': f"Menyimpan data operasional inti dengan {column_count} kolom yang mendukung logika bisnis utama. Terintegrasi dengan {fk_count} tabel lain untuk workflow aplikasi yang komprehensif."
        }
        
        return templates.get(category, f"Mengelola data {table_name} dengan {column_count} atribut untuk mendukung operasional sistem aplikasi dengan integrasi database yang terintegrasi.")
    
    def create_executive_template_docx(self):
        """Buat template DOCX yang benar-benar professional seperti template perusahaan"""
        
        document_xml = '''<?xml version='1.0' encoding='UTF-8' standalone='yes'?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:body>

<!-- PROFESSIONAL HEADER -->
<w:p>
    <w:pPr><w:jc w:val="center"/><w:spacing w:after="600"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="36"/><w:b/><w:color w:val="1F4E79"/></w:rPr>
    <w:t>DATABASE DOCUMENTATION</w:t></w:r>
</w:p>

<w:p>
    <w:pPr><w:jc w:val="center"/><w:spacing w:after="300"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="28"/><w:color w:val="2F5496"/></w:rPr>
    <w:t>{DB_NAME}</w:t></w:r>
</w:p>

<w:p>
    <w:pPr><w:jc w:val="center"/><w:spacing w:after="600"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="12"/><w:color w:val="666666"/></w:rPr>
    <w:t>Generated: {GENERATED_DATE}</w:t></w:r>
</w:p>

<!-- PAGE BREAK -->
<w:p><w:pPr><w:pageBreakBefore/></w:pPr></w:p>

<!-- EXECUTIVE SUMMARY WITH TABLE -->
<w:p>
    <w:pPr><w:spacing w:after="240"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="24"/><w:b/><w:color w:val="1F4E79"/></w:rPr>
    <w:t>📊 EXECUTIVE SUMMARY</w:t></w:r>
</w:p>

<w:p>
    <w:pPr><w:spacing w:after="240"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="12"/></w:rPr>
    <w:t>This document provides comprehensive documentation of the {DB_NAME} database system, containing {TOTAL_TABLES} tables with {TOTAL_COLUMNS} total columns. The database architecture supports enterprise-level operations with integrated security, audit trails, and business logic components.</w:t></w:r>
</w:p>

<!-- SUMMARY TABLE -->
<w:tbl>
    <w:tblPr>
        <w:tblW w:w="100" w:type="pct"/>
        <w:tblBorders>
            <w:top w:val="single" w:sz="8" w:color="1F4E79"/>
            <w:left w:val="single" w:sz="8" w:color="1F4E79"/>
            <w:bottom w:val="single" w:sz="8" w:color="1F4E79"/>
            <w:right w:val="single" w:sz="8" w:color="1F4E79"/>
            <w:insideH w:val="single" w:sz="4" w:color="C5D0E6"/>
            <w:insideV w:val="single" w:sz="4" w:color="C5D0E6"/>
        </w:tblBorders>
        <w:tblLook w:val="04A0"/>
    </w:tblPr>
    <w:tr>
        <w:trPr><w:tblHeader/></w:trPr>
        <w:tc>
            <w:tcPr><w:shd w:val="clear" w:color="auto" w:fill="1F4E79"/></w:tcPr>
            <w:p><w:pPr><w:jc w:val="center"/></w:pPr>
            <w:r><w:rPr><w:b/><w:color w:val="FFFFFF"/><w:sz w:val="12"/></w:rPr>
            <w:t>Database Metrics</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
            <w:tcPr><w:shd w:val="clear" w:color="auto" w:fill="1F4E79"/></w:tcPr>
            <w:p><w:pPr><w:jc w:val="center"/></w:pPr>
            <w:r><w:rPr><w:b/><w:color w:val="FFFFFF"/><w:sz w:val="12"/></w:rPr>
            <w:t>Value</w:t></w:r></w:p>
        </w:tc>
    </w:tr>
    <w:tr>
        <w:tc>
            <w:tcPr><w:shd w:val="clear" w:color="auto" w:fill="F2F2F2"/></w:tcPr>
            <w:p><w:r><w:rPr><w:sz w:val="11"/></w:rPr><w:t>Total Tables</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
            <w:p><w:pPr><w:jc w:val="center"/></w:pPr>
            <w:r><w:rPr><w:b/><w:sz w:val="11"/></w:rPr><w:t>{TOTAL_TABLES}</w:t></w:r></w:p>
        </w:tc>
    </w:tr>
    <w:tr>
        <w:tc>
            <w:tcPr><w:shd w:val="clear" w:color="auto" w:fill="F2F2F2"/></w:tcPr>
            <w:p><w:r><w:rPr><w:sz w:val="11"/></w:rPr><w:t>Total Columns</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
            <w:p><w:pPr><w:jc w:val="center"/></w:pPr>
            <w:r><w:rPr><w:b/><w:sz w:val="11"/></w:rPr><w:t>{TOTAL_COLUMNS}</w:t></w:r></w:p>
        </w:tc>
    </w:tr>
    <w:tr>
        <w:tc>
            <w:tcPr><w:shd w:val="clear" w:color="auto" w:fill="F2F2F2"/></w:tcPr>
            <w:p><w:r><w:rPr><w:sz w:val="11"/></w:rPr><w:t>Average Columns/Table</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
            <w:p><w:pPr><w:jc w:val="center"/></w:pPr>
            <w:r><w:rPr><w:b/><w:sz w:val="11"/></w:rPr><w:t>{AVG_COLUMNS}</w:t></w:r></w:p>
        </w:tc>
    </w:tr>
</w:tbl>

<w:p><w:r><w:br/></w:r></w:p>

<!-- CATEGORIES BREAKDOWN -->
{CATEGORY_BREAKDOWN}

<w:p><w:r><w:br/></w:r></w:p>

<!-- TABLE DETAILS SECTION -->
<w:p>
    <w:pPr><w:spacing w:before="480" w:after="240"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="24"/><w:b/><w:color w:val="1F4E79"/></w:rPr>
    <w:t>🗄️ TABLE SPECIFICATIONS</w:t></w:r>
</w:p>

{TABLE_CONTENT}

<!-- FOOTER -->
<w:p>
    <w:pPr><w:spacing w:before="720"/><w:jc w:val="center"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="10"/><w:color w:val="666666"/></w:rPr>
    <w:t>--- End of Documentation ---</w:t></w:r>
</w:p>

<w:sectPr>
    <w:pgSz w:w="11906" w:h="16838"/>
    <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/>
    <w:pgNumType w:fmt="decimal"/>
</w:sectPr>

</w:body>
</w:document>'''

        return document_xml
    
    def create_category_breakdown(self, tables_info):
        """Buat breakdown berdasarkan kategori"""
        
        categories = {}
        for table_name, column_count, pk_count, fk_count, columns_detail, category in tables_info:
            if category not in categories:
                categories[category] = []
            categories[category].append(table_name)
        
        category_xml = '''<w:p>
    <w:pPr><w:spacing w:after="120"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="14"/><w:b/><w:color w:val="2F5496"/></w:rPr>
    <w:t>📋 Categories Overview</w:t></w:r>
</w:p>'''
        
        for category, tables in categories.items():
            category_xml += f'''
<w:p>
    <w:pPr><w:spacing w:after="60"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="11"/><w:b/><w:color w:val="70AD47"/></w:rPr>
    <w:t>• {category}</w:t></w:r>
    <w:r><w:rPr><w:sz w:val="11"/></w:rPr>
    <w:t>: {len(tables)} tables</w:t></w:r>
</w:p>'''
        
        return category_xml
    
    def create_professional_table_content(self, tables_info, max_tables=None):
        """Buat konten tabel dengan format yang benar-benar profesional"""
        
        if max_tables:
            tables_to_process = tables_info[:max_tables]
        else:
            tables_to_process = tables_info
            
        print(f"📝 Creating professional template content for {len(tables_to_process)} tables...")
        
        table_content = ""
        current_category = ""
        
        for i, (table_name, column_count, pk_count, fk_count, columns_detail, category) in enumerate(tables_to_process, 1):
            
            # Progress setiap 25 tabel
            if i % 25 == 0:
                print(f"   📊 Progress: {i}/{len(tables_to_process)} tables ({i/len(tables_to_process)*100:.1f}%)")
            
            # Category header
            if category != current_category:
                current_category = category
                table_content += f'''
<w:p>
    <w:pPr><w:spacing w:before="360" w:after="180"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="16"/><w:b/><w:color w:val="2F5496"/></w:rPr>
    <w:t>📂 {category.upper()}</w:t></w:r>
</w:p>'''
            
            # Generate AI description
            description = self.generate_template_aware_ai_description(
                table_name, column_count, pk_count, fk_count, category
            )
            
            # Clean columns untuk display
            columns_clean = columns_detail
            if len(columns_clean) > 400:
                columns_clean = columns_clean[:400] + "..."
            
            # Professional table entry dengan formatting yang konsisten
            table_content += f'''
<w:p>
    <w:pPr><w:spacing w:before="240" w:after="120"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="14"/><w:b/><w:color w:val="1F4E79"/></w:rPr>
    <w:t>{i}. {table_name.upper()}</w:t></w:r>
</w:p>

<w:tbl>
    <w:tblPr>
        <w:tblW w:w="100" w:type="pct"/>
        <w:tblBorders>
            <w:top w:val="single" w:sz="6" w:color="70AD47"/>
            <w:left w:val="single" w:sz="6" w:color="70AD47"/>
            <w:bottom w:val="single" w:sz="6" w:color="70AD47"/>
            <w:right w:val="single" w:sz="6" w:color="70AD47"/>
            <w:insideH w:val="single" w:sz="2" w:color="A9D18E"/>
            <w:insideV w:val="single" w:sz="2" w:color="A9D18E"/>
        </w:tblBorders>
    </w:tblPr>
    <w:tr>
        <w:tc>
            <w:tcPr><w:tcW w:w="25" w:type="pct"/><w:shd w:val="clear" w:color="auto" w:fill="E2EFDA"/></w:tcPr>
            <w:p><w:r><w:rPr><w:b/><w:sz w:val="10"/></w:rPr><w:t>Columns</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
            <w:tcPr><w:tcW w:w="75" w:type="pct"/></w:tcPr>
            <w:p><w:r><w:rPr><w:sz w:val="10"/></w:rPr><w:t>{column_count}</w:t></w:r></w:p>
        </w:tc>
    </w:tr>
    <w:tr>
        <w:tc>
            <w:tcPr><w:shd w:val="clear" w:color="auto" w:fill="E2EFDA"/></w:tcPr>
            <w:p><w:r><w:rPr><w:b/><w:sz w:val="10"/></w:rPr><w:t>Primary Keys</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
            <w:p><w:r><w:rPr><w:sz w:val="10"/></w:rPr><w:t>{pk_count}</w:t></w:r></w:p>
        </w:tc>
    </w:tr>
    <w:tr>
        <w:tc>
            <w:tcPr><w:shd w:val="clear" w:color="auto" w:fill="E2EFDA"/></w:tcPr>
            <w:p><w:r><w:rPr><w:b/><w:sz w:val="10"/></w:rPr><w:t>Foreign Keys</w:t></w:r></w:p>
        </w:tc>
        <w:tc>
            <w:p><w:r><w:rPr><w:sz w:val="10"/></w:rPr><w:t>{fk_count}</w:t></w:r></w:p>
        </w:tc>
    </w:tr>
</w:tbl>

<w:p>
    <w:pPr><w:spacing w:after="120"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="11"/><w:color w:val="595959"/></w:rPr>
    <w:t>📝 </w:t></w:r>
    <w:r><w:rPr><w:sz w:val="11"/></w:rPr>
    <w:t>{description}</w:t></w:r>
</w:p>

<w:p>
    <w:pPr><w:spacing w:after="180"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="9"/><w:color w:val="7F7F7F"/></w:rPr>
    <w:t>🔑 {columns_clean}</w:t></w:r>
</w:p>
'''
        
        print(f"   ✅ Template content created for {len(tables_to_process)} tables")
        return table_content
    
    def generate_final_template_documentation(self, max_tables=None, filename=None):
        """Generate dokumentasi final yang benar-benar sesuai template profesional"""
        
        print("🎯 FINAL TEMPLATE-COMPLIANT DOCUMENTATION SYSTEM")
        print("=" * 70)
        print("📋 Creating DOCX that matches professional template standards")
        
        if max_tables:
            print(f"📊 Processing: {max_tables} tables")
        else:
            print("📊 Processing: ALL tables")
        print()
        
        start_time = datetime.now()
        
        try:
            # Extract data
            tables_info = self.get_optimized_database_info()
            if not tables_info:
                return False
            
            # Process tables
            if max_tables:
                process_tables = tables_info[:max_tables]
            else:
                process_tables = tables_info
            
            # Calculate comprehensive stats
            total_columns = sum(table[1] for table in process_tables)
            avg_columns = round(total_columns / len(process_tables), 1)
            
            # Generate all content
            category_breakdown = self.create_category_breakdown(process_tables)
            table_content = self.create_professional_table_content(process_tables, max_tables)
            
            # Build document
            document_xml = self.create_executive_template_docx()
            
            # Fill all placeholders
            document_xml = document_xml.format(
                DB_NAME=self.db_config['dbname'].upper(),
                GENERATED_DATE=datetime.now().strftime("%B %d, %Y at %H:%M:%S WIB"),
                TOTAL_TABLES=len(process_tables),
                TOTAL_COLUMNS=total_columns,
                AVG_COLUMNS=avg_columns,
                CATEGORY_BREAKDOWN=category_breakdown,
                TABLE_CONTENT=table_content
            )
            
            # Determine output filename
            if filename:
                output_path = os.path.join(self.output_dir, filename)
            elif max_tables:
                output_path = os.path.join(self.output_dir, f"Template_Documentation_{max_tables}_Tables.docx")
            else:
                output_path = os.path.join(self.output_dir, "Template_Complete_Documentation.docx")
            
            # Create professional DOCX
            success = self._build_final_docx(document_xml, output_path)
            
            if success:
                duration = datetime.now() - start_time
                file_size = os.path.getsize(output_path)
                
                print(f"\n🎉 TEMPLATE DOCUMENTATION COMPLETE!")
                print("=" * 70)
                print(f"📁 File: {os.path.basename(output_path)}")
                print(f"📊 Size: {file_size:,} bytes ({file_size/1024:.1f} KB)")
                print(f"📋 Tables: {len(process_tables)}")
                print(f"🔢 Columns: {total_columns}")
                print(f"⏱️ Duration: {duration}")
                print(f"🎨 Format: Executive template with professional styling")
                print(f"🤖 Content: AI-enhanced business descriptions")
                print(f"📊 Structure: Categorized with summary tables")
                
                return output_path
            else:
                print("\n❌ Template documentation generation failed!")
                return False
                
        except Exception as e:
            print(f"\n💥 CRITICAL ERROR: {e}")
            return False
    
    def _build_final_docx(self, document_xml, output_path):
        """Build final DOCX dengan kualitas profesional"""
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
                
                # Professional styles
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
</w:styles>''')
            
            return True
            
        except Exception as e:
            print(f"   ❌ DOCX creation error: {e}")
            return False

def main():
    """Main function dengan opsi lengkap"""
    system = FinalTemplateDocxSystem()
    
    print("🚀 FINAL TEMPLATE-COMPLIANT DOCX SYSTEM")
    print("📋 Professional template documentation generator")
    print("🎯 Output: DOCX ONLY (no TXT files)")
    print()
    
    print("Select processing option:")
    print("1. Quick sample (15 tables)")  
    print("2. Medium batch (75 tables)")
    print("3. Complete database (all 170 tables)")
    print()
    
    choice = input("Enter choice (1-3) [default: 1]: ").strip() or "1"
    
    if choice == "1":
        result = system.generate_final_template_documentation(
            max_tables=15, 
            filename="Template_Sample_Documentation.docx"
        )
    elif choice == "2":
        result = system.generate_final_template_documentation(
            max_tables=75, 
            filename="Template_Medium_Documentation.docx"
        )
    elif choice == "3":
        print("⚠️ Processing all tables will take 15-20 minutes...")
        confirm = input("Continue? (y/n) [y]: ").strip().lower() or "y"
        if confirm == "y":
            result = system.generate_final_template_documentation(
                filename="Template_Complete_All_Tables.docx"
            )
        else:
            print("Cancelled.")
            return
    else:
        print("Invalid choice, using sample...")
        result = system.generate_final_template_documentation(
            max_tables=15, 
            filename="Template_Default_Sample.docx"
        )
    
    if result:
        print(f"\n✨ SUCCESS! Professional DOCX template created!")
        print(f"📁 Check: {result}")
        print(f"🎨 Format: Matches professional template standards")
    else:
        print(f"\n💥 FAILED! Check errors above.")

if __name__ == '__main__':
    main()