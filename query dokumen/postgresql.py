from sqlalchemy import create_engine
import pandas as pd
from docx import Document
from docx.shared import Inches
from graphviz import Digraph
import os

# ==============================
# 1. Koneksi Database
# ==============================
username = "postgres"     # ganti dengan username PostgreSQL kamu
password = "1234"     # ganti dengan password PostgreSQL kamu
host = "localhost"
port = "5414"
database = "erm"       # ganti dengan nama database kamu

engine = create_engine(f"postgresql+psycopg2://{username}:{password}@{host}:{port}/{database}")

# ==============================
# 2. Ambil Metadata Tables & Columns
# ==============================
query_tables = """
SELECT
    c.table_name,
    c.column_name,
    c.data_type,
    c.is_nullable,
    c.column_default,
    pgd.description AS column_description,
    CASE 
        WHEN pk.column_name IS NOT NULL THEN 'PK'
        WHEN fk.column_name IS NOT NULL THEN 'FK'
        ELSE ''
    END AS key_type
FROM information_schema.columns c
LEFT JOIN pg_catalog.pg_statio_all_tables as st
    ON c.table_schema = st.schemaname AND c.table_name = st.relname
LEFT JOIN pg_catalog.pg_description pgd
    ON pgd.objoid = st.relid AND pgd.objsubid = c.ordinal_position
LEFT JOIN (
    SELECT kcu.table_name, kcu.column_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
    WHERE tc.constraint_type = 'PRIMARY KEY'
      AND tc.table_schema = 'public'
) pk ON c.table_name = pk.table_name AND c.column_name = pk.column_name
LEFT JOIN (
    SELECT kcu.table_name, kcu.column_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_schema = 'public'
) fk ON c.table_name = fk.table_name AND c.column_name = fk.column_name
WHERE c.table_schema = 'public'
ORDER BY c.table_name, c.ordinal_position;
"""
df_tables = pd.read_sql(query_tables, engine)

# ==============================
# 3. Functions
# ==============================
query_functions = """
SELECT 
    n.nspname AS schema,
    p.proname AS function_name,
    pg_catalog.pg_get_function_result(p.oid) AS return_type,
    pg_catalog.pg_get_function_arguments(p.oid) AS arguments,
    d.description AS description
FROM pg_proc p
LEFT JOIN pg_namespace n ON n.oid = p.pronamespace
LEFT JOIN pg_description d ON d.objoid = p.oid
WHERE n.nspname NOT IN ('pg_catalog', 'information_schema')
ORDER BY n.nspname, p.proname;
"""
df_functions = pd.read_sql(query_functions, engine)

# ==============================
# 4. Triggers
# ==============================
query_triggers = """
SELECT 
    t.tgname AS trigger_name,
    c.relname AS table_name,
    pg_catalog.pg_get_triggerdef(t.oid, true) AS definition
FROM pg_trigger t
JOIN pg_class c ON c.oid = t.tgrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE NOT t.tgisinternal
  AND n.nspname = 'public'
ORDER BY c.relname, t.tgname;
"""
df_triggers = pd.read_sql(query_triggers, engine)

# ==============================
# 5. Views
# ==============================
query_views = """
SELECT 
    table_name,
    view_definition
FROM information_schema.views
WHERE table_schema = 'public'
ORDER BY table_name;
"""
df_views = pd.read_sql(query_views, engine)

# ==============================
# 6. Foreign Keys (Relasi)
# ==============================
query_fk = """
SELECT
    tc.table_name AS source_table,
    kcu.column_name AS source_column,
    ccu.table_name AS target_table,
    ccu.column_name AS target_column,
    tc.constraint_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
   AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
   AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public';
"""
df_fk = pd.read_sql(query_fk, engine)

# ==============================
# 7. Buat ERD dengan Graphviz - A4 OPTIMIZED
# ==============================
def create_table_html(table_name, columns_df):
    """Create HTML table representation for Graphviz"""
    table_columns = columns_df[columns_df['table_name'] == table_name]
    
    # Limit columns to prevent overflow (show max 8 columns)
    max_columns = 8
    show_more = len(table_columns) > max_columns
    display_columns = table_columns.head(max_columns)
    
    html = f'''<
    <TABLE BORDER="1" CELLBORDER="1" CELLSPACING="0" CELLPADDING="2">
        <TR><TD BGCOLOR="#2E75B6" ALIGN="CENTER"><FONT COLOR="white" POINT-SIZE="10"><B>{table_name}</B></FONT></TD></TR>'''
    
    for _, col in display_columns.iterrows():
        # Truncate long data types
        data_type = str(col['data_type'])[:15]
        if len(str(col['data_type'])) > 15:
            data_type += "..."
            
        # Color code based on key type
        bgcolor = ""
        if col['key_type'] == 'PK':
            bgcolor = ' BGCOLOR="#FFD700"'  # Gold for Primary Key
        elif col['key_type'] == 'FK':
            bgcolor = ' BGCOLOR="#87CEEB"'  # Sky blue for Foreign Key
            
        # Create column row
        key_indicator = f" [{col['key_type']}]" if col['key_type'] else ""
        html += f'<TR><TD{bgcolor} ALIGN="LEFT"><FONT POINT-SIZE="9">{col["column_name"]}{key_indicator} : {data_type}</FONT></TD></TR>'
    
    if show_more:
        remaining = len(table_columns) - max_columns
        html += f'<TR><TD BGCOLOR="#F0F0F0" ALIGN="CENTER"><FONT POINT-SIZE="8"><I>... and {remaining} more columns</I></FONT></TD></TR>'
    
    html += '</TABLE>>'
    return html

# Create the ERD graph with A4 optimization
dot = Digraph(comment="ERD PostgreSQL", format="png")

# A4 size optimization settings
dot.attr(size='11.7,8.3!')       # A4 landscape (width x height in inches)
dot.attr(ratio='fill')           # Fill the specified size
dot.attr(rankdir='TB')           # Top to Bottom layout
dot.attr(ranksep='0.8')          # Space between table levels
dot.attr(nodesep='0.6')          # Space between tables horizontally  
dot.attr(margin='0.4')           # Margins around the diagram
dot.attr(dpi='300')              # High resolution
dot.attr(overlap='false')        # Prevent overlapping
dot.attr(splines='ortho')        # Orthogonal edges (cleaner look)

# Node styling
dot.attr('node', 
         shape='plaintext',
         fontname='Arial',
         fontsize='10')

# Edge styling
dot.attr('edge', 
         fontname='Arial',
         fontsize='8',
         color='#333333',
         arrowsize='0.8')

# Add table nodes with detailed information
tables = df_tables["table_name"].unique()
for table in tables:
    table_html = create_table_html(table, df_tables)
    dot.node(table, table_html)

# Add relationships with better labels
for _, row in df_fk.iterrows():
    # Create cleaner relationship labels
    label = f"{row['source_column']}"
    dot.edge(row["source_table"], row["target_table"], 
             label=label,
             color='#666666',
             fontcolor='#666666')

# Render the ERD
erd_file = "ERD_PostgreSQL_A4.png"
dot.render("ERD_PostgreSQL_A4", format="png", cleanup=True)

# Alternative: Create a simplified version for very large databases
def create_simplified_erd():
    """Create a simplified ERD showing only table names and relationships"""
    dot_simple = Digraph(comment="ERD PostgreSQL Simplified", format="png")
    
    # A4 settings for simplified version
    dot_simple.attr(size='11.7,8.3!')
    dot_simple.attr(ratio='fill')
    dot_simple.attr(rankdir='LR')     # Left to Right for better width usage
    dot_simple.attr(ranksep='1.0')
    dot_simple.attr(nodesep='0.8')
    dot_simple.attr(margin='0.4')
    dot_simple.attr(dpi='300')
    
    # Simple box styling
    dot_simple.attr('node', 
                   shape='box',
                   style='filled',
                   fillcolor='lightblue',
                   fontname='Arial',
                   fontsize='12')
    
    dot_simple.attr('edge',
                   fontname='Arial',
                   fontsize='10',
                   arrowsize='1.0')
    
    # Add simple table nodes (just names)
    for table in tables:
        table_count = len(df_tables[df_tables['table_name'] == table])
        dot_simple.node(table, f"{table}\\n({table_count} cols)")
    
    # Add relationships
    for _, row in df_fk.iterrows():
        dot_simple.edge(row["source_table"], row["target_table"])
    
    return dot_simple

# Create simplified version if there are too many tables
if len(tables) > 15:  # If more than 15 tables, create simplified version too
    dot_simple = create_simplified_erd()
    erd_simple_file = "ERD_PostgreSQL_Simple.png"
    dot_simple.render("ERD_PostgreSQL_Simple", format="png", cleanup=True)
    print(f"✅ Simplified ERD created: {os.path.abspath(erd_simple_file)}")

# ==============================
# 8. Buat Dokumen Word
# ==============================
doc = Document()
doc.add_heading('📘 Dokumentasi Database', 0)

# Ringkasan umum
doc.add_heading('1. Ringkasan Umum', level=1)
doc.add_paragraph(f"Nama Database : {database}")
doc.add_paragraph("Tujuan/Fungsi : ")
doc.add_paragraph("Digunakan oleh Aplikasi : ")
doc.add_paragraph("Environment : Development / Staging / Production")
doc.add_paragraph("Versi DBMS : PostgreSQL")

# Arsitektur
doc.add_heading('2. Arsitektur Database', level=1)
doc.add_paragraph("Jenis Database : PostgreSQL")
doc.add_paragraph("Versi DBMS : (isi sesuai server)")
doc.add_paragraph("Topologi : Standalone / Replication / Cluster")
doc.add_paragraph("Diagram Arsitektur :")

# Sisipkan ERD
if os.path.exists(erd_file):
    doc.add_picture(erd_file, width=Inches(7))
    doc.add_paragraph("Gambar: ERD hasil generate otomatis dengan detail kolom dan relasi PK-FK.")

# Skema Database
doc.add_heading('3. Skema Database', level=1)
doc.add_paragraph("Nama Schema : public")
doc.add_paragraph("Deskripsi : Schema utama aplikasi")
doc.add_paragraph("ERD : (lihat gambar di atas)")

# ==============================
# 9. Loop per Tabel
# ==============================
doc.add_heading('4. Tabel & Struktur Data', level=1)

for table in df_tables['table_name'].unique():
    doc.add_heading(f"Tabel: {table}", level=2)
    doc.add_paragraph("Deskripsi: (isi deskripsi fungsi tabel ini)")
    
    subset = df_tables[df_tables['table_name'] == table]
    
    word_table = doc.add_table(rows=1, cols=7)  # Added Key Type column
    word_table.style = 'Table Grid'
    hdr_cells = word_table.rows[0].cells
    hdr_cells[0].text = 'NO'
    hdr_cells[1].text = 'Nama Kolom'
    hdr_cells[2].text = 'Tipe Data'
    hdr_cells[3].text = 'Key'
    hdr_cells[4].text = 'Null'
    hdr_cells[5].text = 'Default'
    hdr_cells[6].text = 'Deskripsi'

    for i, row in enumerate(subset.itertuples(), start=1):
        row_cells = word_table.add_row().cells
        row_cells[0].text = str(i)
        row_cells[1].text = str(row.column_name)
        row_cells[2].text = str(row.data_type)
        row_cells[3].text = str(row.key_type) if row.key_type else ""
        row_cells[4].text = str(row.is_nullable)
        row_cells[5].text = str(row.column_default)
        row_cells[6].text = str(row.column_description) if row.column_description else ""

# ==============================
# 10. Functions
# ==============================
doc.add_heading('5. Stored Functions / Procedures', level=1)
if df_functions.empty:
    doc.add_paragraph("Tidak ada function / procedure user-defined.")
else:
    table_func = doc.add_table(rows=1, cols=5)
    table_func.style = 'Table Grid'
    hdr = table_func.rows[0].cells
    hdr[0].text = "Schema"
    hdr[1].text = "Nama Function"
    hdr[2].text = "Return Type"
    hdr[3].text = "Arguments"
    hdr[4].text = "Deskripsi"
    for _, row in df_functions.iterrows():
        r = table_func.add_row().cells
        r[0].text = str(row['schema'])
        r[1].text = str(row['function_name'])
        r[2].text = str(row['return_type'])
        r[3].text = str(row['arguments'])
        r[4].text = str(row['description']) if row['description'] else ""

# ==============================
# 11. Triggers
# ==============================
doc.add_heading('6. Triggers', level=1)
if df_triggers.empty:
    doc.add_paragraph("Tidak ada trigger user-defined.")
else:
    table_trig = doc.add_table(rows=1, cols=3)
    table_trig.style = 'Table Grid'
    hdr = table_trig.rows[0].cells
    hdr[0].text = "Nama Trigger"
    hdr[1].text = "Tabel Target"
    hdr[2].text = "Definisi"
    for _, row in df_triggers.iterrows():
        r = table_trig.add_row().cells
        r[0].text = str(row['trigger_name'])
        r[1].text = str(row['table_name'])
        r[2].text = str(row['definition'])

# ==============================
# 12. Views
# ==============================
doc.add_heading('7. Views', level=1)
if df_views.empty:
    doc.add_paragraph("Tidak ada view user-defined.")
else:
    table_view = doc.add_table(rows=1, cols=2)
    table_view.style = 'Table Grid'
    hdr = table_view.rows[0].cells
    hdr[0].text = "Nama View"
    hdr[1].text = "Definisi"
    for _, row in df_views.iterrows():
        r = table_view.add_row().cells
        r[0].text = str(row['table_name'])
        r[1].text = str(row['view_definition'])

# ==============================
# 13. Bagian Lain
# ==============================
doc.add_heading('8. Security & User Access', level=1)
doc.add_paragraph("(Lengkapi roles, user, policy security)")

doc.add_heading('9. Backup & Recovery', level=1)
doc.add_paragraph("(Lengkapi jadwal backup, prosedur recovery)")

doc.add_heading('10. Monitoring & Maintenance', level=1)
doc.add_paragraph("(Lengkapi tools monitoring & maintenance routine)")

doc.add_heading('11. Change Management', level=1)
doc.add_paragraph("(Lengkapi proses migrasi schema dan catatan perubahan)")

doc.add_heading('12. Referensi & Catatan', level=1)
doc.add_paragraph("(Lengkapi link ke wiki/SOP internal)")

# ==============================
# 14. Simpan Dokumen
# ==============================
output_file = "Dokumentasi_PostgreSQL.docx"
doc.save(output_file)

print(f"✅ Dokumentasi berhasil dibuat: {os.path.abspath(output_file)}")
print(f"✅ ERD A4-optimized berhasil dibuat: {os.path.abspath(erd_file)}")
print(f"📊 Total tabel: {len(tables)}")
print(f"🔗 Total relasi: {len(df_fk)}")