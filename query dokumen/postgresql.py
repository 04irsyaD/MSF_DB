import psycopg2
import pandas as pd
from docx import Document

# ==============================
# 1. Koneksi ke Database
# ==============================
conn = psycopg2.connect(
    host="localhost",
    port="5432",
    user="postgres",
    password="password",
    dbname="nama_database"
)

# ==============================
# 2. Ambil Metadata Tabel & Kolom
# ==============================
query = """
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;
"""

df = pd.read_sql(query, conn)

# ==============================
# 3. Buat Dokumen Word
# ==============================
doc = Document()
doc.add_heading('📘 Dokumentasi Database', 0)

# Ringkasan umum
doc.add_heading('1. Ringkasan Umum', level=1)
doc.add_paragraph("Nama Database : nama_database")
doc.add_paragraph("Tujuan/Fungsi : ")
doc.add_paragraph("Digunakan oleh Aplikasi : ")
doc.add_paragraph("Environment : Development / Staging / Production")
doc.add_paragraph("Versi DBMS : PostgreSQL")

# Arsitektur
doc.add_heading('2. Arsitektur Database', level=1)
doc.add_paragraph("Jenis Database : PostgreSQL")
doc.add_paragraph("Versi DBMS : 15.x (contoh)")
doc.add_paragraph("Topologi : Standalone / Replication / Cluster")
doc.add_paragraph("Diagram Arsitektur : (tambahkan jika ada)")

# Skema Database
doc.add_heading('3. Skema Database', level=1)
doc.add_paragraph("Nama Schema : public")
doc.add_paragraph("Deskripsi : Schema utama aplikasi")
doc.add_paragraph("ERD : (lampirkan diagram terpisah jika ada)")

# ==============================
# 4. Loop per Tabel
# ==============================
doc.add_heading('4. Tabel & Struktur Data', level=1)

for table in df['table_name'].unique():
    doc.add_heading(f"Tabel: {table}", level=2)
    doc.add_paragraph("Deskripsi: (isi deskripsi fungsi tabel ini)")
    
    # Filter kolom per tabel
    subset = df[df['table_name'] == table]
    
    # Buat tabel Word
    word_table = doc.add_table(rows=1, cols=5)
    hdr_cells = word_table.rows[0].cells
    hdr_cells[0].text = 'Nama Kolom'
    hdr_cells[1].text = 'Tipe Data'
    hdr_cells[2].text = 'Null'
    hdr_cells[3].text = 'Default'
    hdr_cells[4].text = 'Deskripsi'

    for _, row in subset.iterrows():
        row_cells = word_table.add_row().cells
        row_cells[0].text = str(row['column_name'])
        row_cells[1].text = str(row['data_type'])
        row_cells[2].text = str(row['is_nullable'])
        row_cells[3].text = str(row['column_default'])
        row_cells[4].text = ""  # bisa diisi manual nanti

# ==============================
# 5. Bagian Lain (Security, Backup, dll)
# ==============================
doc.add_heading('5. Stored Procedure, Function, & Trigger', level=1)
doc.add_paragraph("(Lengkapi manual sesuai kebutuhan)")

doc.add_heading('6. Security & User Access', level=1)
doc.add_paragraph("(Lengkapi roles, user, policy security)")

doc.add_heading('7. Backup & Recovery', level=1)
doc.add_paragraph("(Lengkapi jadwal backup, prosedur recovery)")

doc.add_heading('8. Monitoring & Maintenance', level=1)
doc.add_paragraph("(Lengkapi tools monitoring & maintenance routine)")

doc.add_heading('9. Change Management', level=1)
doc.add_paragraph("(Lengkapi proses migrasi schema dan catatan perubahan)")

doc.add_heading('10. Referensi & Catatan', level=1)
doc.add_paragraph("(Lengkapi link ke wiki/SOP internal)")

# ==============================
# 6. Simpan Dokumen
# ==============================
output_file = "Dokumentasi_PostgreSQL.docx"
doc.save(output_file)

print(f"✅ Dokumentasi berhasil dibuat: {output_file}")
