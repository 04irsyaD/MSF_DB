# column_width_analyzer.py - Analisis lebar kolom template
import os
import zipfile

def analyze_template_column_widths():
    """Analisis lebar kolom dari template untuk replikasi exact"""
    
    template_path = os.path.join('..', 'template', 'template_dokumentasi.docx')
    
    if not os.path.exists(template_path):
        print(f"❌ Template tidak ditemukan: {template_path}")
        return None
    
    print("📐 TEMPLATE COLUMN WIDTH ANALYZER")
    print("=" * 60)
    
    try:
        from docx import Document
        
        doc = Document(template_path)
        
        print("📊 ANALYZING TABLE COLUMN WIDTHS:")
        print("-" * 40)
        
        column_widths = []
        
        for table_idx, table in enumerate(doc.tables):
            print(f"\n📋 TABLE {table_idx + 1}:")
            print(f"   Columns: {len(table.columns)}")
            
            table_widths = []
            total_width = 0
            
            for col_idx, column in enumerate(table.columns):
                # Get column width in inches
                col_width = column.width
                col_width_inches = col_width.inches if col_width else 0
                col_width_cm = col_width_inches * 2.54 if col_width_inches else 0
                
                table_widths.append({
                    'column_index': col_idx,
                    'width_inches': col_width_inches,
                    'width_cm': col_width_cm,
                    'width_twips': col_width.twips if col_width else 0
                })
                
                total_width += col_width_inches
                
                print(f"   Col {col_idx + 1}: {col_width_inches:.2f} inches ({col_width_cm:.2f} cm)")
            
            print(f"   Total table width: {total_width:.2f} inches")
            
            # Calculate percentages
            if total_width > 0:
                print(f"   Column width percentages:")
                for i, col_data in enumerate(table_widths):
                    percentage = (col_data['width_inches'] / total_width) * 100
                    table_widths[i]['percentage'] = percentage
                    print(f"     Col {i + 1}: {percentage:.1f}%")
            
            column_widths.append({
                'table_index': table_idx,
                'columns': table_widths,
                'total_width': total_width
            })
        
        return column_widths
        
    except Exception as e:
        print(f"❌ Error analyzing column widths: {e}")
        return None

def analyze_template_xml_widths():
    """Analisis column widths dari XML level"""
    
    template_path = os.path.join('..', 'template', 'template_dokumentasi.docx')
    
    print(f"\n🔍 XML LEVEL COLUMN WIDTH ANALYSIS:")
    print("-" * 40)
    
    try:
        with zipfile.ZipFile(template_path, 'r') as zip_file:
            if 'word/document.xml' in zip_file.namelist():
                doc_xml = zip_file.read('word/document.xml').decode('utf-8')
                
                import re
                
                # Cari table grid definitions
                grid_matches = re.findall(r'<w:tblGrid[^>]*>(.*?)</w:tblGrid>', doc_xml, re.DOTALL)
                
                if grid_matches:
                    print(f"   📐 Found {len(grid_matches)} table grid(s)")
                    
                    for i, grid in enumerate(grid_matches):
                        print(f"\n   Table {i + 1} Grid:")
                        
                        # Extract grid columns
                        col_matches = re.findall(r'<w:gridCol w:w="(\d+)"', grid)
                        
                        if col_matches:
                            total_twips = sum(int(width) for width in col_matches)
                            
                            print(f"     Columns found: {len(col_matches)}")
                            print(f"     Column widths (twips):")
                            
                            for j, width in enumerate(col_matches):
                                width_twips = int(width)
                                width_inches = width_twips / 1440  # 1440 twips = 1 inch
                                width_cm = width_inches * 2.54
                                percentage = (width_twips / total_twips) * 100
                                
                                print(f"       Col {j + 1}: {width_twips} twips ({width_inches:.2f}\" / {width_cm:.2f}cm / {percentage:.1f}%)")
                            
                            print(f"     Total width: {total_twips} twips ({total_twips/1440:.2f} inches)")
                            
                            return {
                                'column_widths_twips': [int(w) for w in col_matches],
                                'total_width_twips': total_twips,
                                'column_count': len(col_matches)
                            }
                
        return None
        
    except Exception as e:
        print(f"   ❌ Error analyzing XML widths: {e}")
        return None

def print_width_implementation_guide(column_data, xml_data):
    """Print panduan implementasi untuk column widths"""
    
    print(f"\n📋 COLUMN WIDTH IMPLEMENTATION GUIDE:")
    print("=" * 60)
    
    if xml_data:
        print(f"Template Column Configuration:")
        print(f"  Total Columns: {xml_data['column_count']}")
        print(f"  Total Width: {xml_data['total_width_twips']} twips ({xml_data['total_width_twips']/1440:.2f} inches)")
        
        print(f"\nColumn Width Settings to Apply:")
        for i, width_twips in enumerate(xml_data['column_widths_twips']):
            width_inches = width_twips / 1440
            width_cm = width_inches * 2.54
            percentage = (width_twips / xml_data['total_width_twips']) * 100
            
            print(f"  Column {i + 1}:")
            print(f"    Twips: {width_twips}")
            print(f"    Inches: {width_inches:.3f}")
            print(f"    CM: {width_cm:.2f}")
            print(f"    Percentage: {percentage:.1f}%")
    
    if column_data:
        print(f"\nTemplate Analysis Summary:")
        for table_data in column_data:
            print(f"  Table {table_data['table_index'] + 1}: {len(table_data['columns'])} columns, {table_data['total_width']:.2f}\" total")

def main():
    """Main function"""
    print("🚀 Template Column Width Analyzer")
    print("📐 Analyzing column widths for exact replication")
    print()
    
    # Analyze via python-docx
    column_data = analyze_template_column_widths()
    
    # Analyze via XML
    xml_data = analyze_template_xml_widths()
    
    # Print implementation guide
    print_width_implementation_guide(column_data, xml_data)
    
    if xml_data:
        print(f"\n✅ COLUMN WIDTH DATA EXTRACTED!")
        print(f"📊 {xml_data['column_count']} columns with exact widths")
        print(f"📐 Ready for implementation in table generator")
        
        return xml_data
    else:
        print(f"\n❌ Could not extract column width data")
        return None

if __name__ == '__main__':
    main()