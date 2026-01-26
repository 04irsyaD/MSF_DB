-- Database Query Shortcut Collection
-- Comprehensive database tools and scripts

# 🗃️ Database Query Shortcut Collection

## 📦 Deskripsi

Repository ini adalah **comprehensive database toolkit** yang berisi koleksi lengkap scripts, queries, aplikasi, dan tools untuk berbagai sistem database dan development frameworks. Dirancang sebagai shortcut dan reference untuk developer yang bekerja dengan multiple database systems dan modern web frameworks.

---

## 🧰 Teknologi

- **PostgreSQL** versi 12+ - Database utama RDBMS
- **Oracle Database** - Enterprise database solution
- **SQLite** - Embedded database untuk development
- **MongoDB** - NoSQL document database
- **MySQL** - Alternative RDBMS
- ORM/Query tool: Sequelize, TypeORM, Prisma, Mongoose
- Bahasa backend: Node.js, Python, Java, PHP

---

## 📁 Project Structure Overview

```
🗃️ Query-Shortcut-Database/
├── 📊 Database Scripts & Queries
│   ├── 🐘 Postgresql/          # PostgreSQL queries, functions, triggers
│   ├── 🐬 Mysql/              # MySQL configurations & queries  
│   └── 🔄 Migration/          # Database migration scripts
│
├── 🚀 Applications
│   ├── 🎯 laravel/            # Laravel applications
│   │   ├── example-app/       # Complete Laravel example
│   │   └── metod-saw/         # SAW method implementation
│   └── 🌐 nextjs-website/     # Next.js web application
│
├── 🐳 DevOps & Infrastructure  
│   ├── docker/                # Docker configurations
│   └── dev_/                  # Development environments
│
├── 🤖 AI & Automation
│   ├── AI OLLMA/              # AI templates & solutions
│   ├── 📊 Excel/              # VBA automation scripts
│   └── 🐍 py/                 # Python utilities
│
└── 📚 Documentation
    └── query dokumen/         # Additional query documentation
```

### 🎯 Key Components

- **Multi-Database Support** - PostgreSQL, MySQL, Oracle, SQLite, MongoDB
- **Web Applications** - Laravel & Next.js implementations  
- **Automation Tools** - Excel VBA, Python scripts, AI templates
- **Docker Environment** - Containerized development setup
- **Query Collections** - Ready-to-use database queries

---

## 🚀 Quick Start Guide

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for Next.js)
- PHP 8.0+ & Composer (for Laravel)
- Python 3.8+ (for scripts)

### 1. Clone & Setup
```bash
git clone <repository-url>
cd Query-Shrocut-database
```

### 2. Start Database Services
```bash
# Start databases with Docker
docker-compose up -d postgres mongodb

# Verify services
docker-compose ps
```

### 3. Quick Database Setup
```bash
# Import PostgreSQL configurations
psql -U postgres -h localhost -f Postgresql/config/config.sql
```

---

## ⚙️ Setup Database

### 1. Instalasi PostgreSQL

**Linux (Ubuntu):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

**Mac (via Homebrew):**
```bash
brew install postgresql
```

### 2. Menjalankan PostgreSQL
```bash
sudo service postgresql start
```

### 3. Masuk ke PostgreSQL CLI
```bash
sudo -u postgres psql
```

---

## 🔶 Setup Oracle Database

### 1. Instalasi Oracle Database

**Using Docker (Recommended):**
```bash
docker pull container-registry.oracle.com/database/express:21.3.0-xe
docker run -d --name oracle-xe \
  -p 1521:1521 -p 5500:5500 \
  -e ORACLE_PWD=mypassword \
  container-registry.oracle.com/database/express:21.3.0-xe
```

**Manual Installation (Linux):**
```bash
# Download dari Oracle website
# Extract dan jalankan installer
./runInstaller -silent -responseFile /path/to/db_install.rsp
```

### 2. Koneksi ke Oracle
```bash
# SQL*Plus
sqlplus sys/mypassword@localhost:1521/XE as sysdba

# SQL Developer atau DBeaver untuk GUI
```

### 3. Konfigurasi User Oracle
```sql
-- Buat user baru
CREATE USER myuser IDENTIFIED BY mypassword;

-- Grant privileges
GRANT CONNECT, RESOURCE, DBA TO myuser;
GRANT CREATE SESSION TO myuser;
GRANT CREATE TABLE TO myuser;
GRANT CREATE VIEW TO myuser;

-- Set default tablespace
ALTER USER myuser DEFAULT TABLESPACE USERS;
ALTER USER myuser QUOTA UNLIMITED ON USERS;
```

---

## 📱 Setup SQLite

### 1. Instalasi SQLite

**Linux (Ubuntu):**
```bash
sudo apt update
sudo apt install sqlite3
```

**Windows:**
```bash
# Download dari https://sqlite.org/download.html
# Extract dan add ke PATH
```

**Mac:**
```bash
brew install sqlite
```

### 2. Membuat Database SQLite
```bash
# Buat database baru
sqlite3 mydatabase.db

# Import dari file SQL
sqlite3 mydatabase.db < schema.sql
```

### 3. Basic Commands SQLite
```sql
-- List all tables
.tables

-- Show schema
.schema table_name

-- Export to CSV
.mode csv
.output data.csv
SELECT * FROM table_name;
.output stdout

-- Import CSV
.mode csv
.import data.csv table_name
```

---

## 🍃 Setup MongoDB

### 1. Instalasi MongoDB

**Using Docker:**
```bash
docker pull mongo:latest
docker run -d --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:latest
```

**Linux (Ubuntu):**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install mongodb-org
```

**Windows:**
```bash
# Download MongoDB Community Server dari mongodb.com
# Install menggunakan MSI installer
```

### 2. Koneksi MongoDB
```bash
# MongoDB Shell
mongosh "mongodb://admin:password@localhost:27017"

# MongoDB Compass untuk GUI
# Connection string: mongodb://admin:password@localhost:27017
```

### 3. Basic MongoDB Operations
```javascript
// Pilih database
use myDatabase

// Buat collection dan insert data
db.users.insertOne({
  name: "John Doe",
  email: "john@example.com",
  age: 30
})

// Find data
db.users.find({ age: { $gte: 25 } })

// Update data
db.users.updateOne(
  { name: "John Doe" },
  { $set: { age: 31 } }
)

// Delete data
db.users.deleteOne({ name: "John Doe" })
```

---

## 🛠️ Konfigurasi Awal

### Membuat User dan Database
```sql
-- Buat user baru
CREATE USER nama_user WITH PASSWORD 'passwordku';

-- Buat database
CREATE DATABASE nama_database OWNER nama_user;

-- Berikan hak akses
GRANT ALL PRIVILEGES ON DATABASE nama_database TO nama_user;
```

---

## 📁 Struktur Tabel (Contoh)
```sql
CREATE TABLE laporan (
  id SERIAL PRIMARY KEY,
  judul VARCHAR(255) NOT NULL,
  isi TEXT,
  status VARCHAR(50),
  tanggal_laporan DATE DEFAULT CURRENT_DATE
);
```

---

## 🔍 Query SQL Umum

### Insert Data
```sql
INSERT INTO laporan (judul, isi, status) 
VALUES ('Laporan Mingguan', 'Isi laporan...', 'draft');
```

### Select Data
```sql
SELECT * FROM laporan WHERE status = 'draft';
```

### Update Data
```sql
UPDATE laporan SET status = 'selesai' WHERE id = 1;
```

### Delete Data
```sql
DELETE FROM laporan WHERE id = 2;
```

---

## 🔶 Query Oracle Umum

### Table Management
```sql
-- Create table dengan constraint
CREATE TABLE employees (
  emp_id NUMBER PRIMARY KEY,
  first_name VARCHAR2(50) NOT NULL,
  last_name VARCHAR2(50) NOT NULL,
  email VARCHAR2(100) UNIQUE,
  hire_date DATE DEFAULT SYSDATE,
  salary NUMBER(10,2)
);

-- Create sequence untuk auto increment
CREATE SEQUENCE emp_seq START WITH 1 INCREMENT BY 1;

-- Create trigger untuk auto increment
CREATE OR REPLACE TRIGGER emp_trigger
BEFORE INSERT ON employees
FOR EACH ROW
BEGIN
  :NEW.emp_id := emp_seq.NEXTVAL;
END;
```

### Data Manipulation
```sql
-- Insert dengan sequence
INSERT INTO employees (first_name, last_name, email, salary)
VALUES ('John', 'Doe', 'john.doe@company.com', 50000);

-- Select dengan pagination
SELECT * FROM (
  SELECT ROWNUM rn, emp.*
  FROM employees emp
  WHERE ROWNUM <= 20
)
WHERE rn > 10;

-- Update dengan join
UPDATE employees e
SET salary = salary * 1.1
WHERE EXISTS (
  SELECT 1 FROM departments d
  WHERE d.dept_id = e.dept_id
  AND d.dept_name = 'IT'
);
```

### Oracle Specific Functions
```sql
-- Date functions
SELECT SYSDATE FROM DUAL;
SELECT ADD_MONTHS(SYSDATE, 6) FROM DUAL;
SELECT LAST_DAY(SYSDATE) FROM DUAL;

-- String functions
SELECT SUBSTR('Hello World', 1, 5) FROM DUAL;
SELECT INSTR('Hello World', 'World') FROM DUAL;
SELECT REGEXP_REPLACE('123-456-7890', '[^0-9]', '') FROM DUAL;

-- Analytical functions
SELECT emp_id, salary,
       ROW_NUMBER() OVER (ORDER BY salary DESC) as rank,
       LAG(salary) OVER (ORDER BY salary) as prev_salary
FROM employees;
```

---

## 📱 Query SQLite Umum

### Database Operations
```sql
-- Attach multiple databases
ATTACH DATABASE 'backup.db' AS backup;

-- Copy table between databases
CREATE TABLE backup.employees AS SELECT * FROM main.employees;

-- Detach database
DETACH DATABASE backup;
```

### Table Management
```sql
-- Create table dengan auto increment
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price REAL DEFAULT 0.0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Add column (SQLite limitation workaround)
ALTER TABLE products ADD COLUMN description TEXT;

-- Create index
CREATE INDEX idx_products_name ON products(name);
```

### Data Queries
```sql
-- Full text search
CREATE VIRTUAL TABLE products_fts USING fts5(name, description);
SELECT * FROM products_fts WHERE products_fts MATCH 'laptop';

-- JSON operations (SQLite 3.38+)
SELECT json_extract(metadata, '$.category') as category
FROM products
WHERE json_valid(metadata);

-- Common Table Expressions
WITH RECURSIVE category_tree AS (
  SELECT id, name, parent_id, 0 as level
  FROM categories WHERE parent_id IS NULL
  UNION ALL
  SELECT c.id, c.name, c.parent_id, ct.level + 1
  FROM categories c
  JOIN category_tree ct ON c.parent_id = ct.id
)
SELECT * FROM category_tree;
```

---

## 🍃 MongoDB Query Umum

### Collection Operations
```javascript
// Create collection dengan validation
db.createCollection("products", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "price"],
      properties: {
        name: { bsonType: "string" },
        price: { bsonType: "number", minimum: 0 },
        categories: { bsonType: "array", items: { bsonType: "string" } }
      }
    }
  }
})

// Create index
db.products.createIndex({ name: "text", description: "text" })
db.products.createIndex({ "categories": 1 })
db.products.createIndex({ "price": 1, "createdAt": -1 })
```

### Advanced Queries
```javascript
// Aggregation pipeline
db.orders.aggregate([
  { $match: { status: "completed" } },
  { $group: {
    _id: "$customerId",
    totalOrders: { $sum: 1 },
    totalAmount: { $sum: "$amount" },
    avgAmount: { $avg: "$amount" }
  }},
  { $sort: { totalAmount: -1 } },
  { $limit: 10 }
])

// Text search
db.products.find({ $text: { $search: "laptop gaming" } })

// Geospatial queries
db.stores.find({
  location: {
    $near: {
      $geometry: { type: "Point", coordinates: [-73.9857, 40.7484] },
      $maxDistance: 1000
    }
  }
})

// Array operations
db.products.find({ categories: { $in: ["electronics", "computers"] } })
db.products.find({ "reviews.rating": { $gte: 4 } })
```

### Data Manipulation
```javascript
// Bulk operations
db.products.bulkWrite([
  { insertOne: { document: { name: "Product 1", price: 100 } } },
  { updateOne: { 
    filter: { _id: ObjectId("...") },
    update: { $set: { price: 120 } }
  }},
  { deleteOne: { filter: { name: "Old Product" } } }
])

# Upsert operation
db.products.updateOne(
  { sku: "ABC123" },
  { $set: { name: "Updated Product", price: 150 } },
  { upsert: true }
)
```

---

## 🎯 Laravel Applications

### 📱 Example App (`laravel/example-app/`)
Complete Laravel application dengan fitur lengkap:

#### Setup & Installation
```bash
cd laravel/example-app

# Install dependencies
composer install
npm install

# Environment setup
cp .env.example .env
php artisan key:generate

# Database setup
php artisan migrate
php artisan db:seed

# Development server
php artisan serve
# Frontend assets
npm run dev
```

#### Available Features
- Authentication system
- CRUD operations
- Database migrations
- API endpoints
- Admin dashboard

### 🔢 Method SAW (`laravel/metod-saw/`)
Implementasi metode Simple Additive Weighting untuk decision support system:

#### Docker Setup
```bash
cd laravel/metod-saw

# Build dan run dengan Docker
docker-compose up -d

# Access application: http://localhost:8080
```

#### SAW Method Features
- Multi-criteria decision making
- Weight calculation
- Alternative ranking
- Result visualization

---

## 🌐 Next.js Website (`nextjs-website/`)

Modern React-based website dengan TypeScript dan Tailwind CSS:

### Setup & Development
```bash
cd nextjs-website

# Install dependencies
npm install

# Development server
npm run dev
# Access: http://localhost:3000

# Production build
npm run build
npm start
```

### Available Scripts
```bash
npm run dev        # Development server
npm run build      # Production build
npm run start      # Production server
npm run lint       # ESLint check
npm run type-check # TypeScript check
```

---

## 📊 Excel VBA Automation (`Excel/`)

Koleksi VBA scripts untuk otomatisasi Excel:

### 📋 Available Scripts

#### 1. **Asset Data Management** (`excel_asset_data.vba`)
- Import/export asset data
- Data validation dan cleaning
- Report generation

#### 2. **Data Comparison Tool** (`excel_compare_data.vba`)
- Side-by-side data comparison
- Highlight differences
- Generate comparison report

#### 3. **KPEI Health Check** (`excel_healcheck_kpei.VBA`)
- System status monitoring
- Performance metrics
- Alert generation

#### 4. **Asset Merging** (`excel_merge_asset.vba`)
- Consolidate asset data
- Remove duplicates
- Master file creation

#### 5. **Column Query Filter** (`query_filter_by_column_in_excel.VBA`)
- Dynamic filter creation
- Multi-column filtering
- Export filtered results

### 🔧 Installation & Usage

#### Enable VBA in Excel
1. File → Options → Trust Center
2. Trust Center Settings → Macro Settings
3. Enable "Enable all macros"

#### Import VBA Scripts
1. Press `Alt + F11` (VBA Editor)
2. File → Import File
3. Select `.vba` file
4. Run macros from Developer tab

---

## 🤖 AI Integration (`AI OLLMA/`)

AI templates dan solutions untuk automation:

### 📁 Summary Tools (`AI OLLMA/summary/`)

#### Available Tools
- **create_template.py** - Template generation tool
- **debug_data.py** - Data debugging utilities
- **fix_template.py** - Template repair tool
- **test_template.py** - Template testing framework

#### Documentation Files
- [FINAL_SOLUTION_GUIDE.md](AI%20OLLMA/summary/FINAL_SOLUTION_GUIDE.md) - Comprehensive solution guide
- [PANDUAN_FINAL_SYSTEM.md](AI%20OLLMA/summary/PANDUAN_FINAL_SYSTEM.md) - Final system guidelines
- [README_SYSTEM.md](AI%20OLLMA/summary/README_SYSTEM.md) - System documentation

### 🛠️ Usage Examples

#### Template Creation
```python
# create_template.py
from template_creator import TemplateCreator

creator = TemplateCreator()
template = creator.create_db_template({
    'database_type': 'postgresql',
    'table_name': 'users',
    'columns': ['id', 'name', 'email']
})
```

---

## 🐍 Python Utilities (`py/`)

Python scripts untuk data processing:

### Available Scripts

#### test.py
```python
# Main testing and utility script
python py/test.py

# Features:
- Database connection testing
- Data validation utilities  
- Performance benchmarking
- API testing tools
```

### Usage Examples
```bash
# Run database tests
cd py
python test.py --test-db

# Data processing
python test.py --process-data input.csv
```

---

## 🗃️ Database Query Collections

### PostgreSQL Queries (`Postgresql/`)

#### Core Directories
- **config/** - Database configuration scripts
- **Data/** - Data manipulation queries
- **functions/** - Custom PostgreSQL functions
- **table/** - Table operations and utilities
- **Trigger/** - Database triggers

#### Key Files
- **search.sql** - Comprehensive search templates
- **config/config.sql** - Database setup configuration

### Migration Scripts (`Migration/Postgresql/`)

#### Available Migrations
- **column_update.sql** - Column modification scripts
- **pertamina_ticket.sql** - Ticketing system setup
- **pm_merah.sql** - PM Red system migration
- **wbs.sql** - Work Breakdown Structure

---

## 🔁 Manajemen Sequence

### Atur sequence ke angka tertentu (misal: 150)
```sql
SELECT setval('laporan_id_seq', 150);
```

### Cek nama sequence dari kolom SERIAL
```sql
SELECT pg_get_serial_sequence('laporan', 'id');
```

### Cek nilai berikutnya dari sequence
```sql
SELECT nextval('laporan_id_seq');
```

---

## 🔐 Tips Keamanan

- Jangan pernah commit file `.env` yang berisi username/password database.
- Gunakan user database dengan hak akses minimal di lingkungan produksi.
- Selalu backup database secara berkala.

---

## 📤 Backup & Restore

### Backup:
```bash
pg_dump -U nama_user -F c -b -v -f backup_db.dump nama_database
```

### Restore:
```bash
pg_restore -U nama_user -d nama_database -v backup_db.dump
```

---

## 🧪 Testing Koneksi (dengan psql)
```bash
psql -U nama_user -d nama_database -h localhost -p 5432
```

---

## � Database Management Tools

### PostgreSQL Tools
- **pgAdmin** - Web-based GUI
- **DBeaver** - Universal database tool
- **psql** - Command line interface

### Oracle Tools
- **SQL Developer** - Official Oracle IDE
- **Oracle SQL*Plus** - Command line tool
- **Toad** - Third-party GUI tool

### SQLite Tools
- **SQLite Browser** - Simple GUI browser
- **sqlite3** - Command line interface
- **SQLiteStudio** - Feature-rich GUI

### MongoDB Tools
- **MongoDB Compass** - Official GUI
- **mongosh** - Modern shell
- **Robo 3T** - Popular GUI client

---

## 🐳 Docker Compose Setup

### Multi-Database Environment
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  oracle:
    image: container-registry.oracle.com/database/express:21.3.0-xe
    environment:
      ORACLE_PWD: password
    ports:
      - "1521:1521"
      - "5500:5500"
    volumes:
      - oracle_data:/opt/oracle/oradata

  mongodb:
    image: mongo:latest
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  postgres_data:
  oracle_data:
  mongodb_data:
```

### Menjalankan Environment
```bash
# Start semua database
docker-compose up -d

# Check status
docker-compose ps

# Stop semua
docker-compose down
```

---

## 📤 Backup & Migration

### PostgreSQL Backup/Restore
```bash
# Backup
pg_dump -U username -h localhost -p 5432 database_name > backup.sql
pg_dump -U username -F c -b -v -f backup.dump database_name

# Restore
psql -U username -d database_name < backup.sql
pg_restore -U username -d database_name backup.dump
```

### Oracle Backup/Restore
```bash
# Export
expdp username/password@localhost:1521/XE schemas=schema_name directory=DATA_PUMP_DIR dumpfile=backup.dmp

# Import
impdp username/password@localhost:1521/XE schemas=schema_name directory=DATA_PUMP_DIR dumpfile=backup.dmp

# Traditional export/import
exp username/password@localhost:1521/XE file=backup.dmp owner=schema_name
imp username/password@localhost:1521/XE file=backup.dmp fromuser=schema_name touser=new_schema
```

### SQLite Backup
```bash
# Backup (simple copy)
cp database.db backup_database.db

# Dump to SQL
sqlite3 database.db .dump > backup.sql

# Restore from SQL
sqlite3 new_database.db < backup.sql
```

### MongoDB Backup/Restore
```bash
# Backup single database
mongodump --host localhost:27017 --db database_name --out backup_folder

# Backup with authentication
mongodump --host localhost:27017 -u admin -p password --authenticationDatabase admin --db database_name --out backup_folder

# Restore
mongorestore --host localhost:27017 --db database_name backup_folder/database_name

# Export to JSON
mongoexport --host localhost:27017 --db database_name --collection collection_name --out data.json

# Import from JSON
---

## 🛠️ Troubleshooting & Common Issues

### 🐘 PostgreSQL Issues

#### Connection Problems
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql
# or
docker ps | grep postgres

# Test connection
psql -U postgres -h localhost -p 5432 -c "SELECT version();"

# Reset password
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'newpassword';"
```

#### Performance Issues
```sql
-- Check slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC LIMIT 10;

-- Check active connections
SELECT count(*) FROM pg_stat_activity;

-- Terminate hanging connections
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = 'target_db'
AND pid <> pg_backend_pid();
```

### 🔶 Oracle Issues

#### TNS Listener Problems
```bash
# Check listener status
lsnrctl status

# Start listener
lsnrctl start

# Check TNS configuration
tnsping XE
```

#### User Lock Issues
```sql
-- Unlock user account
ALTER USER username ACCOUNT UNLOCK;

-- Reset password
ALTER USER username IDENTIFIED BY newpassword;

-- Check user status
SELECT username, account_status FROM dba_users WHERE username = 'USERNAME';
```

### 📱 SQLite Issues

#### Database Locked
```bash
# Check if database is in use
lsof database.db

# Force unlock (backup first!)
sqlite3 database.db "BEGIN IMMEDIATE; ROLLBACK;"
```

#### Corruption Recovery
```bash
# Check integrity
sqlite3 database.db "PRAGMA integrity_check;"

# Repair database
sqlite3 database.db ".dump" | sqlite3 repaired.db
```

### 🍃 MongoDB Issues

#### Connection Problems
```bash
# Check MongoDB service
sudo systemctl status mongod
# or
docker logs mongodb_container

# Test connection
mongosh "mongodb://localhost:27017"
```

#### Authentication Issues
```javascript
// Create admin user
use admin
db.createUser({
  user: "admin",
  pwd: "password",
  roles: ["root"]
})

// Connect with auth
mongosh "mongodb://admin:password@localhost:27017/admin"
```

### 🎯 Laravel Issues

#### Common Problems
```bash
# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Regenerate autoload
composer dump-autoload

# Fix permissions
chmod -R 755 storage
chmod -R 755 bootstrap/cache
```

#### Database Migration Issues
```bash
# Reset migrations
php artisan migrate:reset
php artisan migrate

# Rollback specific migration
php artisan migrate:rollback --step=1

# Check migration status
php artisan migrate:status
```

### 🌐 Next.js Issues

#### Build Problems
```bash
# Clear cache
rm -rf .next
npm run build

# Check for TypeScript errors
npm run type-check

# Fix dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Runtime Errors
```bash
# Development debugging
npm run dev
# Check console for errors

# Production debugging
NODE_ENV=production npm run build
npm start
```

### 🐳 Docker Issues

#### Container Problems
```bash
# Check container status
docker ps -a

# View container logs
docker logs container_name

# Restart containers
docker-compose restart

# Rebuild containers
docker-compose down
docker-compose up --build -d
```

#### Volume Issues
```bash
# Check volumes
docker volume ls

# Remove unused volumes
docker volume prune

# Backup volume
docker run --rm -v volume_name:/data -v $(pwd):/backup ubuntu tar czf /backup/backup.tar.gz -C /data .
```

### 📊 Excel VBA Issues

#### Macro Security
```vb
' Enable macros in Excel:
' File → Options → Trust Center → Macro Settings
' Select "Enable all macros"

' Trust specific folder:
' Add project folder to Trusted Locations
```

#### Common VBA Errors
```vb
' Handle missing references
On Error Resume Next
Set obj = CreateObject("Excel.Application")
If Err.Number <> 0 Then
    MsgBox "Excel not available"
    Exit Sub
End If
On Error GoTo 0
```

---

## ⚡ Performance Optimization

### Database Optimization
```sql
-- PostgreSQL
ANALYZE;  -- Update table statistics
REINDEX DATABASE database_name;  -- Rebuild indexes

-- Oracle
EXEC DBMS_STATS.GATHER_DATABASE_STATS;
ALTER INDEX index_name REBUILD;

-- MongoDB
db.collection.createIndex({field: 1});  -- Create indexes
db.collection.reIndex();  -- Rebuild indexes
```

### Application Optimization
```bash
# Laravel
php artisan optimize
php artisan config:cache
php artisan route:cache

# Next.js
npm run build  # Optimized production build
npm run analyze  # Bundle analysis
```

---

## 📎 Referensi & Documentation

### PostgreSQL
- [PostgreSQL Official Docs](https://www.postgresql.org/docs/)
- [pgAdmin](https://www.pgadmin.org/) – GUI untuk manajemen database PostgreSQL
- [PostgREST](https://postgrest.org/) – Auto-generated REST API

### Oracle Database
- [Oracle Database Documentation](https://docs.oracle.com/en/database/)
- [Oracle SQL Developer](https://www.oracle.com/database/sqldeveloper/) – Official IDE
- [Oracle Live SQL](https://livesql.oracle.com/) – Online Oracle playground

### SQLite
- [SQLite Official Docs](https://sqlite.org/docs.html)
- [SQLite Browser](https://sqlitebrowser.org/) – GUI tool
- [SQLite Tutorial](https://www.sqlitetutorial.net/) – Comprehensive tutorial

### MongoDB
- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB Compass](https://www.mongodb.com/products/compass) – Official GUI
- [MongoDB University](https://university.mongodb.com/) – Free courses

### Multi-Database Tools
- [DBeaver](https://dbeaver.io/) – Universal database tool
- [DataGrip](https://www.jetbrains.com/datagrip/) – JetBrains database IDE
- [DB Fiddle](https://www.db-fiddle.com/) – Online SQL playground

---

