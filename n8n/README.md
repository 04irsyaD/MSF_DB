# 🔄 n8n - Workflow Automation

Setup n8n untuk workflow automation - SQL to Documentation.

---

## 🚀 Quick Start

### 1. Jalankan n8n

```powershell
cd "n8n"
docker-compose up -d
```

### 2. Akses n8n

Buka browser: **http://localhost:5678**

Login:
- **Username:** `admin`
- **Password:** `admin123`

### 3. Import Workflow

1. Buka n8n di browser
2. Klik **"..."** menu → **Import from File**
3. Pilih file `workflows/sql_to_docs_direct_input.json`
4. **Aktifkan** workflow (toggle ON)

---

## 📁 Struktur Folder

```
n8n/
├── docker-compose.yml                    # Docker configuration
├── README.md                             # File ini
└── workflows/
    ├── sql_to_docs_direct_input.json     # Workflow via API/curl
    └── telegram_drive_sql_docs.json      # ⭐ Telegram + Google Drive
```

---

## 🤖 Workflow: Telegram + Google Drive (RECOMMENDED!)

Input via Telegram → Process di n8n → Hasil ke Telegram + Google Drive

### Setup (10 menit):

#### 1. Buat Telegram Bot
1. Buka Telegram, cari **@BotFather**
2. Kirim `/newbot` → ikuti instruksi
3. Dapat **Bot Token** (simpan)

#### 2. Import Workflow
1. Buka n8n: http://localhost:5678
2. Import `workflows/telegram_drive_sql_docs.json`
3. **Setup credentials:**
   - Klik node **"Send to Telegram"** → Add credential → Paste Bot Token
   - Klik node **"Upload to Drive"** → Add credential → Connect Google Account
4. **Enable nodes** (click each disabled node → toggle ON):
   - Send to Telegram
   - Send Help/Error
   - Upload to Drive
5. **Activate** workflow

#### 3. Setup Telegram Webhook
Setelah workflow aktif, set webhook Telegram:

```powershell
# Ganti YOUR_BOT_TOKEN dan YOUR_N8N_URL
$token = "YOUR_BOT_TOKEN"
$webhookUrl = "https://your-n8n-domain.com/webhook/telegram-webhook"

# Untuk local (pakai ngrok):
# $webhookUrl = "https://abc123.ngrok.io/webhook/telegram-webhook"

Invoke-RestMethod -Uri "https://api.telegram.org/bot$token/setWebhook?url=$webhookUrl"
```

#### 4. Test di Telegram!
```
/start
/docs CREATE TABLE users (id serial, name varchar(100));
```

### Flow Diagram:

```
Telegram Message
      ↓
   n8n Webhook
      ↓
  Parse SQL?
   ↙     ↘
 Yes      No
  ↓        ↓
Ollama AI  Send Help
  ↓
Format Output
  ↓
┌─────────────────┐
│ Send Telegram   │ ← Hasil dokumentasi
│ Upload Drive    │ ← File .md
└─────────────────┘
```

### Untuk Local Development (ngrok):

```powershell
# Install ngrok jika belum
# Download dari https://ngrok.com/download

# Expose n8n webhook
ngrok http 5678

# Dapat URL seperti: https://abc123.ngrok.io
# Gunakan untuk webhook Telegram
```

---

## 🎯 Cara Pakai - Direct SQL Input

### Via cURL (Terminal)

```bash
curl -X POST http://localhost:5678/webhook/sql-to-docs \
  -H "Content-Type: application/json" \
  -d '{"sql": "CREATE TABLE users (id serial PRIMARY KEY, name varchar(100));"}'
```

### Via PowerShell

```powershell
$body = @{
    sql = @"
CREATE TABLE users (
    id serial PRIMARY KEY,
    name varchar(100),
    email varchar(255),
    created_at timestamp
);

CREATE TABLE orders (
    id serial PRIMARY KEY,
    user_id integer,
    total numeric(10,2),
    status varchar(50)
);
"@
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5678/webhook/sql-to-docs" -Method POST -Body $body -ContentType "application/json"
```

### Via Postman / Insomnia

1. Method: **POST**
2. URL: `http://localhost:5678/webhook/sql-to-docs`
3. Body (JSON):
```json
{
  "sql": "CREATE TABLE products (id serial PRIMARY KEY, name varchar(200), price numeric(10,2));"
}
```

---

## 📋 Response Format

```json
{
  "markdown": "# 📚 Dokumentasi Database Schema\n...",
  "documentation": [
    {
      "table_name": "users",
      "description": "Tabel untuk menyimpan data pengguna",
      "columns": [
        {"no": 1, "name": "id", "type": "serial", "description": "ID unik pengguna"}
      ]
    }
  ],
  "total_tables": 1
}
```

---

## ⚙️ Workflow Flow

```
[Webhook Input] → [Parse SQL] → [Ollama AI] → [Format Docs] → [Markdown] → [Response]
```

---

## ⚠️ Requirements

- **Ollama** harus running: `ollama serve`
- **Model**: `llama3:latest`

---

## 🛠️ Commands

```powershell
# Start n8n
docker-compose up -d

# Stop n8n
docker-compose down

# Lihat logs
docker-compose logs -f n8n

# Restart n8n
docker-compose restart n8n
```

---

## 🔧 Troubleshooting

### Ollama tidak terkoneksi

Pastikan Ollama running:
```bash
ollama serve
```

### Response kosong

- Pastikan SQL format benar (CREATE TABLE)
- Cek n8n Executions untuk error detail

