# 🔄 n8n - Workflow Automation

Setup n8n untuk workflow automation.

---

## 🚀 Quick Start

### 1. Jalankan n8n

```powershell
cd "c:\Users\ROG\Documents\query db\n8n"
docker-compose up -d
```

### 2. Akses n8n

Buka browser: **http://localhost:5678**

Login:
- **Username:** `admin`
- **Password:** `admin123` \ 'Admin123'

---

## 📁 Struktur Folder

```
n8n/
├── docker-compose.yml    # Docker configuration
├── README.md             # File ini
└── workflows/            # Folder untuk export workflows
```

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

# Update n8n ke versi terbaru
docker-compose pull
docker-compose up -d
```

---

## ⚙️ Configuration

### Ganti Password (Recommended!)

Edit `docker-compose.yml`:
```yaml
- N8N_BASIC_AUTH_USER=your_username
- N8N_BASIC_AUTH_PASSWORD=your_secure_password
```

### Pakai PostgreSQL (Production)

Uncomment bagian `postgres` di `docker-compose.yml`, lalu ubah config n8n:
```yaml
- DB_TYPE=postgresdb
- DB_POSTGRESDB_HOST=postgres
- DB_POSTGRESDB_PORT=5432
- DB_POSTGRESDB_DATABASE=n8n
- DB_POSTGRESDB_USER=n8n
- DB_POSTGRESDB_PASSWORD=n8n_password
```

---

## 🔗 Useful Links

- [n8n Documentation](https://docs.n8n.io/)
- [n8n Community](https://community.n8n.io/)
- [Workflow Templates](https://n8n.io/workflows)

---

## 💡 Tips

1. **Backup workflows** - Export ke folder `workflows/`
2. **Webhook URL** - Untuk production, ganti `WEBHOOK_URL` ke domain kamu
3. **Credentials** - Simpan credentials dengan aman di n8n

