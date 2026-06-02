# 🤖 Telegram Bot - SQL to Documentation

Generate dokumentasi database langsung dari Telegram!

## 🚀 Setup (5 menit)

### 1. Buat Bot di Telegram

1. Buka Telegram, cari **@BotFather**
2. Kirim `/newbot`
3. Ikuti instruksi:
   - Nama bot: `SQL Docs Bot` (atau terserah)
   - Username: `sqldocs_yourname_bot` (harus unik, akhiran `_bot`)
4. Copy **token** yang diberikan

### 2. Install & Run

```powershell
# Install dependencies
cd "c:\Users\ROG\Documents\query db\telegram-sql-docs"
pip install -r requirements.txt

# Edit bot.py, ganti YOUR_BOT_TOKEN_HERE dengan token dari BotFather
# Atau set environment variable:
$env:TELEGRAM_BOT_TOKEN = "123456789:ABCdefGHIjklMNOpqrsTUVwxyz"

# Jalankan bot
python bot.py
```

### 3. Test di Telegram

1. Cari bot kamu di Telegram (pakai username yang tadi dibuat)
2. Klik **Start**
3. Kirim SQL:

```
/docs CREATE TABLE users (
  id serial PRIMARY KEY,
  name varchar(100),
  email varchar(255)
);
```

## 📱 Cara Pakai

### Command `/docs`
```
/docs CREATE TABLE products (id serial, name varchar(200), price numeric);
```

### Langsung Kirim SQL
```
CREATE TABLE orders (
  id serial PRIMARY KEY,
  user_id integer,
  total numeric(10,2),
  status varchar(50)
);
```

Bot akan otomatis detect dan generate docs!

## 📋 Output Example

```
📚 DOKUMENTASI DATABASE
━━━━━━━━━━━━━━━━━━━━━━━

1. users
📝 Tabel untuk menyimpan data pengguna sistem

No  Field               Type            Deskripsi
1   id                  serial          ID unik pengguna
2   name                varchar(100)    Nama lengkap pengguna
3   email               varchar(255)    Alamat email pengguna

✅ Total: 1 table(s)
```

## ⚙️ Konfigurasi

Edit `bot.py`:

```python
# Ganti model Ollama
OLLAMA_MODEL = "llama3:latest"  # atau mistral:latest, gemma:7b
```

## 📁 Struktur

```
telegram-sql-docs/
├── bot.py              # Main bot script
├── requirements.txt    # Dependencies
└── README.md           # File ini
```

## ⚠️ Requirements


## 🔧 Troubleshooting

### Bot tidak respond

### Error timeout

### Ollama error
```powershell
# Pastikan Ollama running
ollama serve

# Check model ada
ollama list
```

## 🚀 Run as Background Service (Optional)

### Windows (Task Scheduler)
1. Buka Task Scheduler
2. Create Basic Task
3. Trigger: At startup
4. Action: Start program → `python bot.py`

### Linux (systemd)
```bash
# /etc/systemd/system/sqldocs-bot.service
[Service]
ExecStart=/usr/bin/python3 /path/to/bot.py
Restart=always
```


Made with ❤️ using python-telegram-bot + Ollama
