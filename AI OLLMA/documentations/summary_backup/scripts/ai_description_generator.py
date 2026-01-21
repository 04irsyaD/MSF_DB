# ai_description_generator.py - AI generator with template context awareness
import subprocess
import json
import os
from datetime import datetime

class TemplateAwareAIGenerator:
    """AI generator yang mempertimbangkan konteks template visual"""
    
    def __init__(self, template_analysis=None, model='llama3'):
        self.model = model
        self.template_analysis = template_analysis or {}
        self.generation_history = []
        
    def analyze_table_context(self, table_name, table_data):
        """Analisis konteks tabel untuk deskripsi yang tepat"""
        columns = table_data.get('columns', [])
        primary_keys = table_data.get('primary_keys', [])
        foreign_keys = table_data.get('foreign_keys', {})
        
        # Analisis kategori tabel
        category = self._categorize_table(table_name, columns)
        
        # Analisis relasi
        relationships = self._analyze_relationships(foreign_keys)
        
        # Analisis struktur data
        data_patterns = self._analyze_data_patterns(columns)
        
        return {
            'category': category,
            'relationships': relationships,
            'data_patterns': data_patterns,
            'complexity': self._assess_complexity(columns, foreign_keys)
        }
    
    def _categorize_table(self, table_name, columns):
        """Kategorisasi tabel berdasarkan nama dan struktur"""
        name_lower = table_name.lower()
        col_names = [col['name'].lower() for col in columns]
        
        # Authentication/Authorization
        if any(word in name_lower for word in ['auth', 'user', 'login', 'permission', 'role', 'group']):
            return 'authentication'
        
        # Logging/Audit
        if any(word in name_lower for word in ['log', 'audit', 'history', 'track', 'event']):
            return 'logging'
        
        # Configuration
        if any(word in name_lower for word in ['config', 'setting', 'parameter', 'option']):
            return 'configuration'
        
        # Content Management
        if any(word in name_lower for word in ['content', 'post', 'article', 'page', 'media']):
            return 'content'
        
        # Financial
        if any(word in name_lower for word in ['payment', 'invoice', 'transaction', 'order', 'price']):
            return 'financial'
        
        # Junction/Relation tables
        if len([col for col in columns if col['is_foreign_key']]) >= 2:
            return 'junction'
        
        # Default
        return 'business_logic'
    
    def _analyze_relationships(self, foreign_keys):
        """Analisis relasi dengan tabel lain"""
        if not foreign_keys:
            return {'type': 'standalone', 'connections': []}
        
        connections = []
        for column, fk_info in foreign_keys.items():
            connections.append({
                'column': column,
                'references': f"{fk_info['references_table']}.{fk_info['references_column']}"
            })
        
        # Tentukan tipe relasi
        if len(connections) == 1:
            rel_type = 'child'  # Child table
        elif len(connections) >= 2:
            rel_type = 'junction'  # Junction table
        else:
            rel_type = 'standalone'
        
        return {
            'type': rel_type,
            'connections': connections
        }
    
    def _analyze_data_patterns(self, columns):
        """Analisis pola data dalam kolom"""
        patterns = {
            'has_timestamps': False,
            'has_status_fields': False,
            'has_metadata': False,
            'has_content_fields': False
        }
        
        for col in columns:
            col_name = col['name'].lower()
            col_type = col['type'].lower()
            
            # Timestamp fields
            if any(word in col_name for word in ['created', 'updated', 'modified', 'date', 'time']):
                patterns['has_timestamps'] = True
            
            # Status/State fields
            if any(word in col_name for word in ['status', 'state', 'active', 'enabled', 'deleted']):
                patterns['has_status_fields'] = True
            
            # Metadata fields
            if any(word in col_name for word in ['meta', 'extra', 'data', 'info', 'detail']):
                patterns['has_metadata'] = True
            
            # Content fields
            if col_type in ['text', 'varchar'] and col.get('max_length', 0) > 255:
                patterns['has_content_fields'] = True
        
        return patterns
    
    def _assess_complexity(self, columns, foreign_keys):
        """Assess kompleksitas tabel"""
        score = 0
        score += len(columns)  # Base complexity from column count
        score += len(foreign_keys) * 2  # Relations add complexity
        
        if score < 5:
            return 'simple'
        elif score < 15:
            return 'moderate'
        else:
            return 'complex'
    
    def generate_description(self, table_name, table_data, context=None):
        """Generate deskripsi dengan konteks template dan AI"""
        print(f"   🤖 Generating description for {table_name}...")
        
        # Analisis konteks
        table_context = self.analyze_table_context(table_name, table_data)
        
        # Buat prompt yang kaya konteks
        prompt = self._build_contextual_prompt(table_name, table_data, table_context, context)
        
        try:
            # Generate dengan AI
            # Pass prompt via stdin to avoid command-line length issues
            result = subprocess.run(
                ["ollama", "run", self.model],
                input=prompt,
                capture_output=True, text=True, timeout=30,
                encoding='utf-8', errors='replace'
            )
            
            if result.stdout.strip():
                description = result.stdout.strip()
                
                # Post-process untuk konsistensi
                description = self._post_process_description(description, table_context)
                
                # Simpan history
                self.generation_history.append({
                    'table': table_name,
                    'description': description,
                    'context': table_context,
                    'timestamp': datetime.now().isoformat()
                })
                
                return description
            else:
                return self._generate_fallback_description(table_name, table_context)
                
        except Exception as e:
            print(f"      ⚠️ AI failed: {e}")
            return self._generate_fallback_description(table_name, table_context)
    
    def _build_contextual_prompt(self, table_name, table_data, table_context, additional_context):
        """Build prompt yang kaya konteks"""
        columns = table_data.get('columns', [])
        
        # Base information
        prompt = f"""
Buat deskripsi profesional untuk tabel database '{table_name}' berdasarkan konteks berikut:

KATEGORI: {table_context['category']}
KOMPLEKSITAS: {table_context['complexity']}
TOTAL KOLOM: {len(columns)}

STRUKTUR KOLOM:
"""
        
        # Add column details
        for col in columns[:8]:  # Limit to first 8 columns
            pk_mark = " (PK)" if col.get('is_primary_key') else ""
            fk_mark = " (FK)" if col.get('is_foreign_key') else ""
            prompt += f"- {col['name']} ({col['type']}){pk_mark}{fk_mark}\n"
        
        if len(columns) > 8:
            prompt += f"... dan {len(columns) - 8} kolom lainnya\n"
        
        # Add relationship context
        relationships = table_context['relationships']
        if relationships['connections']:
            prompt += f"\nRELASI:\n"
            for conn in relationships['connections']:
                prompt += f"- {conn['column']} → {conn['references']}\n"
        
        # Add pattern analysis
        patterns = table_context['data_patterns']
        pattern_desc = []
        if patterns['has_timestamps']:
            pattern_desc.append("timestamps")
        if patterns['has_status_fields']:
            pattern_desc.append("status tracking")
        if patterns['has_content_fields']:
            pattern_desc.append("content storage")
        
        if pattern_desc:
            prompt += f"\nPOLA DATA: {', '.join(pattern_desc)}\n"
        
        # Template context
        if additional_context and 'template_style' in additional_context:
            prompt += f"\nSTYLE TEMPLATE: {additional_context['template_style']}\n"
        
        prompt += f"""
INSTRUKSI:
1. Jelaskan fungsi utama tabel dalam 1-2 kalimat
2. Sebutkan jenis data yang disimpan
3. Jika ada relasi, jelaskan hubungannya dengan tabel lain
4. Gunakan bahasa profesional dan mudah dipahami
5. Fokus pada value bisnis tabel tersebut

FORMAT: Langsung berikan deskripsi tanpa label atau pengantar.
"""
        
        return prompt
    
    def _post_process_description(self, description, context):
        """Post-process deskripsi untuk konsistensi"""
        # Remove common prefixes
        prefixes_to_remove = [
            "Tabel ini adalah",
            "Tabel ini",
            "Ini adalah tabel",
            "Deskripsi:",
            "Penjelasan:"
        ]
        
        for prefix in prefixes_to_remove:
            if description.startswith(prefix):
                description = description[len(prefix):].strip()
        
        # Ensure proper capitalization
        if description and not description[0].isupper():
            description = description[0].upper() + description[1:]
        
        # Ensure it ends with period
        if description and not description.endswith('.'):
            description += '.'
        
        return description
    
    def _generate_fallback_description(self, table_name, context):
        """Generate fallback description berdasarkan konteks"""
        category = context['category']
        complexity = context['complexity']
        relationships = context['relationships']
        
        # Base description by category
        base_descriptions = {
            'authentication': f"Tabel {table_name} mengelola data otentikasi dan otorisasi pengguna sistem.",
            'logging': f"Tabel {table_name} menyimpan log aktivitas dan audit trail untuk monitoring sistem.",
            'configuration': f"Tabel {table_name} berisi pengaturan dan konfigurasi aplikasi.",
            'content': f"Tabel {table_name} menyimpan konten dan informasi yang dikelola dalam sistem.",
            'financial': f"Tabel {table_name} mengelola data transaksi dan informasi keuangan.",
            'junction': f"Tabel {table_name} menghubungkan relasi many-to-many antar entitas sistem.",
            'business_logic': f"Tabel {table_name} menyimpan data operasional utama aplikasi."
        }
        
        description = base_descriptions.get(category, f"Tabel {table_name} menyimpan data aplikasi.")
        
        # Add complexity and relationship info
        if relationships['connections']:
            conn_count = len(relationships['connections'])
            if conn_count == 1:
                description += " Tabel ini terhubung dengan tabel lain melalui foreign key."
            else:
                description += f" Tabel ini memiliki relasi dengan {conn_count} tabel lain."
        
        return description
    
    def get_generation_statistics(self):
        """Dapatkan statistik generation"""
        if not self.generation_history:
            return None
        
        categories = {}
        for entry in self.generation_history:
            cat = entry['context']['category']
            categories[cat] = categories.get(cat, 0) + 1
        
        return {
            'total_generated': len(self.generation_history),
            'categories': categories,
            'success_rate': len([e for e in self.generation_history if e['description']]) / len(self.generation_history)
        }

def create_ai_generator(template_analysis=None):
    """Factory function untuk membuat AI generator"""
    return TemplateAwareAIGenerator(template_analysis)

if __name__ == '__main__':
    # Test the generator
    generator = TemplateAwareAIGenerator()
    
    # Sample table data
    sample_table = {
        'columns': [
            {'name': 'id', 'type': 'integer', 'is_primary_key': True, 'is_foreign_key': False},
            {'name': 'username', 'type': 'varchar', 'is_primary_key': False, 'is_foreign_key': False},
            {'name': 'email', 'type': 'varchar', 'is_primary_key': False, 'is_foreign_key': False},
            {'name': 'created_at', 'type': 'timestamp', 'is_primary_key': False, 'is_foreign_key': False}
        ],
        'primary_keys': ['id'],
        'foreign_keys': {}
    }
    
    description = generator.generate_description('users', sample_table)
    print(f"Generated: {description}")
    
    stats = generator.get_generation_statistics()
    if stats:
        print(f"Stats: {stats}")
