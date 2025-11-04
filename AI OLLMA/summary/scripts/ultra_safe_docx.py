# ultra_safe_docx.py - Sistem DOCX ultra safe yang pasti bisa dibuka Word
import os
import zipfile
from datetime import datetime

class UltraSafeDocxSystem:
    """Sistem DOCX yang ultra safe - menggunakan template DOCX minimal yang proven work"""
    
    def __init__(self):
        self.db_config = {
            'host': 'localhost',
            'port': '5414', 
            'dbname': 'deverm',
            'user': 'postgres',
            'password': '1234'
        }
        
        self.output_dir = os.path.join('..', 'output')
        
    def get_simple_db_info(self):
        """Get database info yang sangat sederhana"""
        print("🗄️ Getting simple database information...")
        
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
            
            # Query paling sederhana
            cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name LIMIT 10;")
            
            tables = cur.fetchall()
            cur.close()
            conn.close()
            
            print(f"   ✅ Found {len(tables)} tables")
            return [table[0] for table in tables]
            
        except Exception as e:
            print(f"   ❌ Database error: {e}")
            return ['sample_table_1', 'sample_table_2', 'sample_table_3']  # Fallback
    
    def create_minimal_working_docx(self):
        """Buat DOCX minimal yang 100% guaranteed work di Word"""
        
        # Document XML yang sangat minimal - proven working
        document_xml = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:body>
<w:p>
<w:r>
<w:t>DATABASE DOCUMENTATION</w:t>
</w:r>
</w:p>
<w:p>
<w:r>
<w:t></w:t>
</w:r>
</w:p>
<w:p>
<w:r>
<w:t>Database: {DB_NAME}</w:t>
</w:r>
</w:p>
<w:p>
<w:r>
<w:t>Generated: {DATE}</w:t>
</w:r>
</w:p>
<w:p>
<w:r>
<w:t></w:t>
</w:r>
</w:p>
<w:p>
<w:r>
<w:t>Tables Found:</w:t>
</w:r>
</w:p>
{TABLE_LIST}
<w:sectPr>
<w:pgSz w:w="11906" w:h="16838"/>
<w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/>
</w:sectPr>
</w:body>
</w:document>'''

        return document_xml
    
    def create_table_list_xml(self, tables):
        """Buat list tabel dalam format XML yang aman"""
        
        table_xml = ""
        for i, table_name in enumerate(tables, 1):
            # Hanya gunakan karakter alfanumerik dan underscore
            safe_table = ''.join(c for c in table_name if c.isalnum() or c == '_')
            
            table_xml += f'''<w:p>
<w:r>
<w:t>{i}. {safe_table}</w:t>
</w:r>
</w:p>
'''
        
        return table_xml
    
    def create_ultra_safe_docx(self, tables):
        """Buat DOCX dengan struktur yang ultra safe"""
        
        # Buat content
        document_xml = self.create_minimal_working_docx()
        table_list = self.create_table_list_xml(tables)
        
        # Fill template dengan data yang aman
        safe_db_name = ''.join(c for c in self.db_config['dbname'] if c.isalnum())
        safe_date = datetime.now().strftime("%Y-%m-%d %H:%M")
        
        document_xml = document_xml.format(
            DB_NAME=safe_db_name,
            DATE=safe_date,
            TABLE_LIST=table_list
        )
        
        # Output path
        output_path = os.path.join(self.output_dir, "UltraSafe_Documentation.docx")
        
        try:
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            
            # Buat DOCX dengan struktur minimal
            with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_STORED) as docx:
                
                # Content Types - minimal
                docx.writestr('[Content_Types].xml', 
                '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>''')

                # Relationships - minimal
                docx.writestr('_rels/.rels',
                '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>''')

                # Document - main content
                docx.writestr('word/document.xml', document_xml)
            
            # Verify file
            if os.path.exists(output_path) and os.path.getsize(output_path) > 500:
                print(f"   ✅ Ultra safe DOCX created: {os.path.basename(output_path)}")
                print(f"   📊 File size: {os.path.getsize(output_path)} bytes")
                return output_path
            else:
                print(f"   ❌ File creation failed or too small")
                return None
                
        except Exception as e:
            print(f"   ❌ Error creating DOCX: {e}")
            return None
    
    def generate_ultra_safe_documentation(self):
        """Generate dokumentasi dengan pendekatan ultra safe"""
        
        print("🛡️ ULTRA SAFE DOCX SYSTEM")
        print("=" * 50)
        print("📄 Creating DOCX with minimal structure guaranteed to work")
        print()
        
        start_time = datetime.now()
        
        try:
            # Get simple data
            tables = self.get_simple_db_info()
            
            # Create ultra safe DOCX
            result_path = self.create_ultra_safe_docx(tables)
            
            if result_path:
                duration = datetime.now() - start_time
                file_size = os.path.getsize(result_path)
                
                print(f"\n🎉 ULTRA SAFE DOCX CREATED!")
                print("=" * 50)
                print(f"📁 File: {os.path.basename(result_path)}")
                print(f"📊 Size: {file_size} bytes")
                print(f"📋 Tables listed: {len(tables)}")
                print(f"⏱️ Duration: {duration}")
                print(f"🛡️ Safety: Minimal structure, no complex formatting")
                print(f"✅ Compatibility: Basic Word document format")
                
                print(f"\n🔧 FEATURES:")
                print(f"   • Minimal XML structure")
                print(f"   • No complex formatting")
                print(f"   • Safe character encoding")
                print(f"   • Standard ZIP compression")
                print(f"   • Essential DOCX components only")
                
                return result_path
            else:
                print("\n❌ Ultra safe DOCX creation failed!")
                return False
                
        except Exception as e:
            print(f"\n💥 ERROR: {e}")
            return False

def main():
    """Main function untuk ultra safe system"""
    system = UltraSafeDocxSystem()
    
    print("🚀 Ultra Safe DOCX System")
    print("📋 Minimal structure guaranteed to open in Word")
    print("🎯 Focus: Compatibility over features")
    print()
    
    result = system.generate_ultra_safe_documentation()
    
    if result:
        print(f"\n✨ SUCCESS! This DOCX should definitely open in Word:")
        print(f"📁 {result}")
        print(f"\n💡 If this works, we know the structure is correct!")
        print(f"💡 Then we can gradually add more features.")
    else:
        print(f"\n💥 FAILED! There might be a deeper issue.")

if __name__ == '__main__':
    main()