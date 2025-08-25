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
    pgd.description AS column_description
FROM information_schema.columns c
LEFT JOIN pg_catalog.pg_statio_all_tables as st
    ON c.table_schema = st.schemaname AND c.table_name = st.relname
LEFT JOIN pg_catalog.pg_description pgd
    ON pgd.objoid = st.relid AND pgd.objsubid = c.ordinal_position
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
# 7. Buat ERD dengan Graphviz
# ==============================
dot = Digraph(comment="ERD PostgreSQL", format="png")
dot.attr("node", shape="box")

# Tambah node tabel
for table in df_tables["table_name"].unique():
    dot.node(table)

# Tambah edge untuk relasi FK
for _, row in df_fk.iterrows():
    dot.edge(row["source_table"], row["target_table"], 
             label=f"{row['source_column']} → {row['target_column']}")

erd_file = "ERD_PostgreSQL.png"
dot.render("ERD_PostgreSQL", format="png", cleanup=True)

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
    doc.add_picture(erd_file, width=Inches(6))
    doc.add_paragraph("Gambar: ERD hasil generate otomatis dari relasi PK-FK.")

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
    
    word_table = doc.add_table(rows=1, cols=6)
    word_table.style = 'Table Grid'
    hdr_cells = word_table.rows[0].cells
    hdr_cells[0].text = 'NO'
    hdr_cells[1].text = 'Nama Kolom'
    hdr_cells[2].text = 'Tipe Data'
    hdr_cells[3].text = 'Null'
    hdr_cells[4].text = 'Default'
    hdr_cells[5].text = 'Deskripsi'

    for i, row in enumerate(subset.itertuples(), start=1):
        row_cells = word_table.add_row().cells
        row_cells[0].text = str(i)
        row_cells[1].text = str(row.column_name)
        row_cells[2].text = str(row.data_type)
        row_cells[3].text = str(row.is_nullable)
        row_cells[4].text = str(row.column_default)
        row_cells[5].text = str(row.column_description) if row.column_description else ""

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
print(f"✅ ERD berhasil dibuat: {os.path.abspath(erd_file)}")
