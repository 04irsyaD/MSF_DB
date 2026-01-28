# 📚 SQL to Documentation Generator

Generate dokumentasi otomatis dari SQL views menggunakan **AI lokal (Ollama)**.

---

## 🚀 Quick Start

### 1. Install Ollama

Download dan install dari: [https://ollama.com](https://ollama.com)

### 2. Download AI Model

```powershell
ollama pull llama3.2
```

### 3. Install Python Dependencies

```powershell
pip install -r requirements.txt
```

### 4. Jalankan Script

```powershell
python sql_to_docs.py
```

---

## 📁 Struktur Folder

```
views/
├── README.md           # File ini
├── requirements.txt    # Python dependencies
├── sql_to_docs.py      # Main script
└── output/             # Hasil dokumentasi
    ├── *.md            # Format Markdown
    └── *.docx          # Format Word
```

---

## ⚙️ Konfigurasi

Edit bagian `CONFIG` di `sql_to_docs.py`:

```python
CONFIG = {
    "sql_file": r"..\final_view.sql",  # Path ke file SQL
    "output_dir": r".\output",          # Folder output
    "model": "llama3.2",                # Model Ollama
    "output_formats": ["md", "docx"],   # Format output
}
```

### Model Alternatif

| Model | Command | Keterangan |
|-------|---------|------------|
| Llama 3.2 | `ollama pull llama3.2` | ✅ Rekomendasi, ringan |
| CodeLlama | `ollama pull codellama` | Bagus untuk code |
| Mistral | `ollama pull mistral` | Alternatif bagus |
| Qwen Coder | `ollama pull qwen2.5-coder` | Khusus coding |

---

## 📋 Output

Script akan generate:

1. **Markdown (.md)** - Bisa dibuka di VS Code, GitHub, dll
2. **Word (.docx)** - Untuk dokumentasi formal

### Contoh Output

```markdown
## 1. `v_risk_owner`

### Deskripsi
View ini menampilkan daftar Risk Owner per Business Unit...

### Kolom Output
| Kolom | Deskripsi |
|-------|-----------|
| Bussiness Unit | Nama unit bisnis |
| Period | Periode tahun |

### Tabel Sumber
- `t_riskowner` - Data utama risk owner
- `t_object` - Master lookup

### Filter & Kondisi
- ENDDA = '2999-01-01' (data aktif)
- ISACT = true
```

---

## 🔧 Troubleshooting

### Ollama tidak jalan

```powershell
# Cek status Ollama
ollama list

# Jalankan Ollama
ollama serve
```

### Error import module

```powershell
# Reinstall dependencies
pip install --upgrade -r requirements.txt
```

### Model terlalu lambat

Gunakan model yang lebih kecil:
```python
CONFIG = {
    "model": "llama3.2:1b",  # Model 1B parameter, lebih cepat
}
```

---

## 📝 License

MIT License - Free to use and modify.
