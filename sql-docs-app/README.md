# 📚 SQL to Docs - Streamlit App

Web app sederhana untuk generate dokumentasi dari SQL!

## 🚀 Quick Start

```powershell
# 1. Install dependencies
pip install streamlit ollama

# 2. Jalankan app
cd "sql-docs-app"
streamlit run app.py
```

Browser akan otomatis terbuka di **http://localhost:8501**

## 🎯 Cara Pakai

1. **Paste SQL** di text area (CREATE TABLE statements)
2. **Pilih Model** di sidebar (llama3, mistral, dll)
3. **Klik Generate** → tunggu AI proses
4. **Download** hasil Markdown atau JSON

## 📸 Screenshot

```
┌─────────────────────────────────────────┐
│  📚 SQL to Documentation Generator      │
├─────────────────────────────────────────┤
│  📝 Paste SQL Query:                    │
│  ┌─────────────────────────────────────┐│
│  │ CREATE TABLE users (               ││
│  │   id serial PRIMARY KEY,           ││
│  │   name varchar(100)                ││
│  │ );                                 ││
│  └─────────────────────────────────────┘│
│                                         │
│  [🚀 Generate Docs]                     │
│                                         │
│  ─────────────────────────────────────  │
│  📄 Markdown | 👁️ Preview | 📊 JSON    │
│  ┌─────────────────────────────────────┐│
│  │ # Dokumentasi Database Schema      ││
│  │ ## 1. users                        ││
│  │ ...                                ││
│  └─────────────────────────────────────┘│
│  [📥 Download Markdown]                 │
└─────────────────────────────────────────┘
```

## ⚠️ Requirements

- Python 3.8+
- Ollama running (`ollama serve`)
- Model tersedia (misal `ollama pull llama3`)

## 🎨 Features

- ✅ Paste SQL langsung
- ✅ Multiple tables sekaligus
- ✅ AI generate deskripsi (ID/EN)
- ✅ Preview Markdown
- ✅ Download MD/JSON
- ✅ Pilih model Ollama
