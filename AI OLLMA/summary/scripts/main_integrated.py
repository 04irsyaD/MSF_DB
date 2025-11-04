# main_integrated.py - Sistema integrado completo
import os
from datetime import datetime
from dotenv import load_dotenv

# Import semua komponen yang sudah dibuat
from db_reader import get_db_metadata
from ai_description_generator import TemplateAwareAIGenerator
from doc_generator import TemplatePreservingGenerator

class DatabaseDocumentationSystem:
    """Sistem lengkap untuk dokumentasi database dengan AI Vision"""
    
    def __init__(self):
        # Load konfigurasi
        load_dotenv()
        
        self.db_config = {
            'host': os.getenv('DB_HOST', 'localhost'),
            'port': os.getenv('DB_PORT', '5432'),
            'dbname': os.getenv('DB_NAME', 'db_universitas'),
            'user': os.getenv('DB_USER', 'postgres'),
            'password': os.getenv('DB_PASSWORD', 'password_here')
        }
        
        self.template_path = os.getenv('TEMPLATE_PATH', 
                                     os.path.join(os.path.dirname(__file__), '..', 'template', 'template_dokumentasi.docx'))
        self.output_path = os.getenv('OUTPUT_PATH',
                                   os.path.join(os.path.dirname(__file__), '..', 'output', 'AI_Generated_Documentation.docx'))
        
        # Initialize components
        self.ai_generator = None
        self.doc_generator = None
        
        # Statistics
        self.stats = {
            'start_time': None,
            'end_time': None,
            'tables_processed': 0,
            'ai_generations': 0,
            'errors': []
        }
    
    def run_complete_process(self, max_tables=None, dry_run=False):
        """Jalankan proses lengkap dokumentasi database"""
        
        print("🎯 SISTEMA DOKUMENTASI DATABASE AI")
        print("="*60)
        
        self.stats['start_time'] = datetime.now()
        
        try:
            # Step 1: Analisis Template
            template_analysis = self._step1_analyze_template()
            
            # Step 2: Ambil Database Schema  
            db_schema = self._step2_get_database_schema()
            if not db_schema:
                return False
            
            # Step 3: Setup AI Generator
            self._step3_setup_ai_generator(template_analysis)
            
            # Step 4: Generate Descriptions
            processed_data = self._step4_generate_descriptions(db_schema, max_tables)
            if not processed_data:
                return False
            
            # Step 5: Generate Document
            if not dry_run:
                result_path = self._step5_generate_document(processed_data, template_analysis)
                if result_path:
                    self._step6_finalize_and_report(result_path)
                    return True
            else:
                print("🔍 DRY RUN: Stopping before document generation")
                self._show_dry_run_results(processed_data)
                return True
            
        except Exception as e:
            print(f"❌ CRITICAL ERROR: {e}")
            self.stats['errors'].append(str(e))
            return False
        finally:
            self.stats['end_time'] = datetime.now()
    
    def _step1_analyze_template(self):
        """Step 1: Analisis template dengan AI"""
        print("\n📋 STEP 1: Template Analysis")
        print("-" * 30)
        
        if not os.path.exists(self.template_path):
            print(f"❌ Template tidak ditemukan: {self.template_path}")
            return None
        
        print(f"   📄 Template: {os.path.basename(self.template_path)}")
        
        # Untuk sekarang, gunakan analisis sederhana
        # Nanti bisa diperkaya dengan AI vision
        template_analysis = {
            'style': 'professional',
            'format': 'documentation',
            'preserve_formatting': True,
            'detected_sections': ['header', 'content', 'table_list']
        }
        
        print("   ✅ Template analysis completed")
        return template_analysis
    
    def _step2_get_database_schema(self):
        """Step 2: Ambil schema database lengkap"""
        print("\n🗄️ STEP 2: Database Schema Extraction")
        print("-" * 30)
        
        try:
            print(f"   🔗 Connecting to: {self.db_config['dbname']}@{self.db_config['host']}:{self.db_config['port']}")
            
            db_schema = get_db_metadata(
                self.db_config['host'], 
                self.db_config['dbname'],
                self.db_config['user'], 
                self.db_config['password'],
                port=self.db_config['port']
            )
            
            # Statistik database
            total_tables = len(db_schema)
            total_columns = sum(len(table_info.get('columns', [])) for table_info in db_schema.values())
            
            print(f"   ✅ Schema extracted successfully")
            print(f"   📊 Tables: {total_tables}")
            print(f"   📊 Total columns: {total_columns}")
            print(f"   📊 Avg columns per table: {total_columns/total_tables:.1f}")
            
            return db_schema
            
        except Exception as e:
            print(f"   ❌ Database connection failed: {e}")
            self.stats['errors'].append(f"DB Connection: {e}")
            return None
    
    def _step3_setup_ai_generator(self, template_analysis):
        """Step 3: Setup AI generator dengan konteks template"""
        print("\n🤖 STEP 3: AI Generator Setup")
        print("-" * 30)
        
        self.ai_generator = TemplateAwareAIGenerator(template_analysis)
        print("   ✅ AI Generator initialized")
        
        # Test AI connection
        try:
            test_table = {
                'columns': [{'name': 'test_id', 'type': 'integer', 'is_primary_key': True, 'is_foreign_key': False}],
                'primary_keys': ['test_id'],
                'foreign_keys': {}
            }
            
            test_desc = self.ai_generator.generate_description('test_connection', test_table)
            if test_desc and len(test_desc) > 10:
                print("   ✅ AI connection test passed")
            else:
                print("   ⚠️ AI connection test failed, using fallback mode")
                
        except Exception as e:
            print(f"   ⚠️ AI test failed: {e}")
    
    def _step4_generate_descriptions(self, db_schema, max_tables):
        """Step 4: Generate deskripsi untuk semua tabel"""
        print(f"\n📝 STEP 4: AI Description Generation")
        print("-" * 30)
        
        tables_to_process = db_schema
        if max_tables:
            tables_to_process = dict(list(db_schema.items())[:max_tables])
            print(f"   🎯 Processing {max_tables} tables (testing mode)")
        else:
            print(f"   🎯 Processing all {len(db_schema)} tables")
        
        processed_data = []
        
        for i, (table_name, table_info) in enumerate(tables_to_process.items(), 1):
            print(f"   📄 {i:3d}/{len(tables_to_process)}: {table_name}")
            
            try:
                # Generate description dengan AI
                description = self.ai_generator.generate_description(table_name, table_info)
                
                # Siapkan data lengkap
                processed_table = {
                    'table_name': table_name,
                    'description': description,
                    'columns': table_info.get('columns', []),
                    'primary_keys': table_info.get('primary_keys', []),
                    'foreign_keys': table_info.get('foreign_keys', {}),
                    'constraints': table_info.get('constraints', [])
                }
                
                processed_data.append(processed_table)
                self.stats['tables_processed'] += 1
                self.stats['ai_generations'] += 1
                
            except Exception as e:
                print(f"      ❌ Error processing {table_name}: {e}")
                self.stats['errors'].append(f"Table {table_name}: {e}")
                continue
        
        print(f"   ✅ Generated {len(processed_data)} table descriptions")
        return processed_data
    
    def _step5_generate_document(self, processed_data, template_analysis):
        """Step 5: Generate dokumen final"""
        print(f"\n📄 STEP 5: Document Generation")
        print("-" * 30)
        
        try:
            self.doc_generator = TemplatePreservingGenerator(self.template_path)
            
            result_path = self.doc_generator.generate_with_format_preservation(
                self.output_path,
                self.db_config['dbname'],
                processed_data,
                template_analysis
            )
            
            if result_path and os.path.exists(result_path):
                file_size = os.path.getsize(result_path)
                print(f"   ✅ Document generated: {os.path.basename(result_path)}")
                print(f"   📊 File size: {file_size:,} bytes")
                return result_path
            else:
                print("   ❌ Document generation failed")
                return None
                
        except Exception as e:
            print(f"   ❌ Generation error: {e}")
            self.stats['errors'].append(f"Document generation: {e}")
            return None
    
    def _step6_finalize_and_report(self, result_path):
        """Step 6: Finalisasi dan laporan"""
        print(f"\n✅ STEP 6: Completion Report")
        print("=" * 60)
        
        duration = self.stats['end_time'] - self.stats['start_time']
        
        print(f"🎉 DOKUMENTASI BERHASIL DIBUAT!")
        print(f"📁 File: {result_path}")
        print(f"⏱️ Duration: {duration}")
        print(f"📊 Tables processed: {self.stats['tables_processed']}")
        print(f"🤖 AI generations: {self.stats['ai_generations']}")
        
        if self.stats['errors']:
            print(f"⚠️ Errors encountered: {len(self.stats['errors'])}")
            for error in self.stats['errors'][:3]:  # Show first 3 errors
                print(f"   - {error}")
        
        # AI generation statistics
        if self.ai_generator:
            ai_stats = self.ai_generator.get_generation_statistics()
            if ai_stats:
                print(f"\n📈 AI Statistics:")
                print(f"   Success rate: {ai_stats['success_rate']:.1%}")
                print(f"   Categories: {ai_stats['categories']}")
    
    def _show_dry_run_results(self, processed_data):
        """Tampilkan hasil dry run"""
        print(f"\n🔍 DRY RUN RESULTS")
        print("=" * 60)
        
        print(f"✅ Would process {len(processed_data)} tables")
        
        # Show sample
        if processed_data:
            sample = processed_data[0]
            print(f"\n📄 Sample table: {sample['table_name']}")
            print(f"   Description: {sample['description'][:100]}...")
            print(f"   Columns: {len(sample['columns'])}")
        
        print(f"\n📋 Next steps:")
        print(f"   1. Run without dry_run=True to generate document")
        print(f"   2. Check template format compatibility")
        print(f"   3. Review AI-generated descriptions")

def main():
    """Main function untuk menjalankan sistem"""
    
    # Inisialisasi sistem
    system = DatabaseDocumentationSystem()
    
    print("🎯 PILIHAN MODE:")
    print("1. Testing (5 tabel pertama)")  
    print("2. Full processing (semua tabel)")
    print("3. Dry run (tanpa generate dokumen)")
    
    # Untuk demo, gunakan mode testing
    print("\n🚀 Running in TESTING mode (5 tables)...")
    
    success = system.run_complete_process(max_tables=5, dry_run=False)
    
    if success:
        print(f"\n🎊 SUCCESS! Check the output folder for your documentation.")
    else:
        print(f"\n💥 FAILED! Check the error messages above.")

if __name__ == '__main__':
    main()