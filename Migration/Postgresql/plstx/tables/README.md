# 📚 SQL Table to Documentation Generator

Generate dokumentasi otomatis dari CREATE TABLE menggunakan **AI lokal (Ollama)**.

---

## 🚀 Quick Start

### 1. Install Ollama (jika belum)

Download dari: [https://ollama.com](https://ollama.com)

### 2. Pastikan model sudah ada

```powershell
ollama list
```

### 3. Install Python Dependencies

```powershell
pip install -r requirements.txt
```

### 4. Jalankan Script

```powershell
python sql_table_to_docs.py
```

---

## 📁 Struktur Folder

```
plstx/
├── sm.sql                  # Source SQL file
└── tables/
    ├── README.md           # File ini
    ├── requirements.txt    # Python dependencies
    ├── sql_table_to_docs.py # Main script
    └── output/             # Hasil dokumentasi
        ├── *.md            # Format Markdown
        └── *.docx          # Format Word
```

---

## ⚙️ Konfigurasi

Edit bagian `CONFIG` di `sql_table_to_docs.py`:

```python
CONFIG = {
    "sql_file": r"..\sm.sql",           # Path ke file SQL
    "output_dir": r".\output",           # Folder output
    "model": "llama3:latest",            # Model Ollama
    "output_formats": ["md", "docx"],    # Format output
}
```

---

## 📋 Output Format

### Markdown Output

```markdown
## 1. `user`

### Deskripsi
Tabel user digunakan untuk menyimpan data pengguna sistem.

### Kolom

| No | Nama Field | Tipe Data | Deskripsi |
|----|------------|-----------|-----------|
| 1 | id | uuid | Primary key, identifier unik |
| 2 | email | varchar | Alamat email pengguna |
| 3 | username | varchar | Username untuk login |
...

### Constraints
| Nama | Tipe | Detail |
|------|------|--------|
| user_pk | PRIMARY KEY | (id) |

### Relasi (Foreign Keys)
```
user
    └──> role (role_id)
```
```

---

## 🔧 Troubleshooting

### Ollama tidak jalan

```powershell
ollama serve
```

### Error import module

```powershell
pip install --user ollama python-docx rich
```

---

## 📝 License

MIT License - Free to use and modify.
