# Database Query Shortcut Collection

Comprehensive database tools, scripts, examples, and references for working across multiple database systems and development stacks.

## Description

This repository is a practical database toolkit that contains reusable scripts, SQL queries, application examples, automation utilities, and documentation for developers who work with multiple database systems and modern web frameworks.

It is designed as a shortcut collection and technical reference for day-to-day database administration, query writing, troubleshooting, migration work, and application development.

## Technologies

- PostgreSQL 12+ as the main relational database reference
- Oracle Database for enterprise database examples
- SQLite for embedded and local development workflows
- MongoDB for NoSQL document database examples
- MySQL for additional relational database references
- ORM and query tools: Sequelize, TypeORM, Prisma, and Mongoose
- Backend languages: Node.js, Python, Java, and PHP

## Project Structure Overview

```text
Query-Shortcut-Database/
|-- Database Scripts & Queries
|   |-- Postgresql/          # PostgreSQL queries, functions, triggers
|   |-- Mysql/               # MySQL configurations and queries
|   `-- Migration/           # Database migration scripts
|
|-- Applications
|   |-- laravel/             # Laravel applications
|   |   |-- example-app/     # Complete Laravel example
|   |   `-- metod-saw/       # SAW method implementation
|   `-- nextjs-website/      # Next.js web application
|
|-- DevOps & Infrastructure
|   |-- docker/              # Docker configurations
|   `-- dev_/                # Development environments
|
|-- AI & Automation
|   |-- AI OLLMA/            # AI templates and solutions
|   |-- Excel/               # VBA automation scripts
|   `-- py/                  # Python utilities
|
|-- Database Documentation
|   |-- sql-docs-generator/  # Next.js + FastAPI + Ollama SQL documentation generator
|   |-- sql-docs-app/        # Lightweight SQL-to-docs app reference
|   |-- telegram-sql-docs/   # Telegram bot for SQL documentation workflows
|   |-- n8n/workflows/       # Automation workflows for SQL-to-docs pipelines
|   `-- query dokumen/       # Additional query documentation and examples
|
`-- Documentation
    `-- AI OLLMA/            # AI documentation and summary tooling
```

## Key Components

- Multi-database support for PostgreSQL, MySQL, Oracle, SQLite, and MongoDB
- Web application examples using Laravel and Next.js
- Automation tools for Excel VBA, Python scripts, and AI templates
- Docker-based development environments
- Ready-to-use query collections for common database tasks
- AI-assisted database documentation from SQL DDL, table schemas, and business context

## Quick Start Guide

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ for Next.js projects
- PHP 8.0+ and Composer for Laravel projects
- Python 3.8+ for utility scripts

### 1. Clone and Set Up

```bash
git clone <repository-url>
cd Query-Shortcut-Database
```

### 2. Start Database Services

```bash
# Start databases with Docker
docker-compose up -d postgres mongodb

# Verify services
docker-compose ps
```

### 3. Quick PostgreSQL Setup

```bash
# Import PostgreSQL configuration
psql -U postgres -h localhost -f Postgresql/config/config.sql
```

## Database Documentation Workflow

This repository includes a database documentation workflow for turning SQL DDL, table structures, and business context into readable technical documentation. The goal is to make database knowledge easier to share across developers, analysts, QA, and operations teams.

### What the Documentation Should Cover

A good database documentation page should include:

- Project or database overview
- Table purpose and business meaning
- Column descriptions, data types, nullability, defaults, and constraints
- Primary keys, foreign keys, and table relationships
- Indexes and performance notes
- Common query examples
- Data ownership and source notes
- Security notes for sensitive columns
- Change history for schema updates or migrations

### Recommended Documentation Output

Use Markdown as the primary output format because it is easy to review, commit, search, and publish.

```text
docs/database/
|-- README.md                 # Database overview
|-- schema-summary.md          # Table and relationship summary
|-- tables/
|   |-- users.md
|   |-- orders.md
|   `-- products.md
|-- erd/
|   `-- database-erd.md
`-- changelog/
    `-- schema-changelog.md
```

### Available Documentation Tools

#### `sql-docs-generator/`

Full SQL documentation generator using:

- Next.js frontend for uploading or pasting SQL
- Python FastAPI backend for parsing SQL
- Ollama local LLM for generating human-readable table documentation
- Markdown output for generated documentation

Quick start:

```bash
cd sql-docs-generator
docker-compose up -d
```

Access:

- Frontend: `http://localhost:3000`
- API: `http://localhost:8000`
- API docs: `http://localhost:8000/docs`

Pull an Ollama model before first use:

```bash
docker exec -it ollama ollama pull llama3
```

#### `sql-docs-app/`

Lightweight SQL-to-documentation app reference for a simple paste-and-generate workflow. It is useful for quick experiments, smaller schemas, or validating documentation prompts before moving them into the full generator.

#### `n8n/workflows/`

Workflow automation for generating database documentation from SQL input.

Important workflow files:

- `sql_to_docs_direct_input.json` - Generate documentation from direct SQL input
- `sql_table_to_docs_workflow.json` - Generate documentation from table-oriented SQL input
- `telegram_drive_sql_docs.json` - Receive SQL through Telegram and upload documentation to Google Drive
- `github_postgresql_telegram.json` - GitHub, PostgreSQL, and Telegram workflow integration

Start n8n:

```powershell
cd "c:\Users\ROG\Documents\query db\n8n"
docker-compose up -d
```

Access n8n at `http://localhost:5678`.

#### `telegram-sql-docs/`

Telegram bot integration for sending SQL snippets and receiving generated documentation. This is useful when database documentation needs to be created from mobile chat, internal team chat, or lightweight operational workflows.

#### `query dokumen/`

Collection of database documentation examples, SQL notes, and helper scripts. Use this folder for reference material, manual documentation drafts, and SQL snippets that are not yet part of the generated docs workflow.

### SQL Documentation API Example

The FastAPI service in `sql-docs-generator/ai-service` exposes `/api/generate`.

```bash
curl -X POST http://localhost:8000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "sql_content": "CREATE TABLE users (id SERIAL PRIMARY KEY, email VARCHAR(255) NOT NULL);",
    "project_name": "Customer Database",
    "language": "English",
    "detail_level": "detailed",
    "business_context": "Stores customer account and authentication data",
    "custom_terms": [
      {
        "term": "customer",
        "definition": "A registered user of the application"
      }
    ]
  }'
```

### Suggested Documentation Template

Use this structure for each generated table document:

````markdown
# Table: table_name

## Purpose

Explain what this table stores and why it exists.

## Columns

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | serial | no | auto | Primary identifier |

## Relationships

- `user_id` references `users.id`

## Common Queries

```sql
SELECT *
FROM table_name
LIMIT 100;
```

## Notes

- Mention business rules, data quality rules, and sensitive fields here.
````

### Documentation Best Practices

- Keep generated documentation in version control.
- Review AI-generated descriptions before publishing.
- Add business context when generating docs so table descriptions are meaningful.
- Use consistent names for tables, columns, and glossary terms.
- Mark sensitive columns such as password, token, phone number, email, address, and identity number.
- Update docs whenever migrations change table structure.
- Keep raw SQL, generated Markdown, and final reviewed docs separate when possible.

### Recommended Workflow

1. Export or collect `CREATE TABLE` statements from the target database.
2. Add project context, business terms, and expected output language.
3. Generate documentation with `sql-docs-generator` or an n8n workflow.
4. Review table and column descriptions manually.
5. Save the reviewed Markdown under `docs/database/` or another project-specific docs folder.
6. Commit documentation together with schema changes or migration updates.

## PostgreSQL Setup

### 1. Install PostgreSQL

Linux Ubuntu:

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

macOS using Homebrew:

```bash
brew install postgresql
```

### 2. Start PostgreSQL

```bash
sudo service postgresql start
```

### 3. Open the PostgreSQL CLI

```bash
sudo -u postgres psql
```

## Oracle Database Setup

### 1. Install Oracle Database

Using Docker, recommended:

```bash
docker pull container-registry.oracle.com/database/express:21.3.0-xe
docker run -d --name oracle-xe \
  -p 1521:1521 -p 5500:5500 \
  -e ORACLE_PWD=mypassword \
  container-registry.oracle.com/database/express:21.3.0-xe
```

Manual installation on Linux:

```bash
# Download from the Oracle website
# Extract the files and run the installer
./runInstaller -silent -responseFile /path/to/db_install.rsp
```

### 2. Connect to Oracle

```bash
# SQL*Plus
sqlplus sys/mypassword@localhost:1521/XE as sysdba

# Use SQL Developer or DBeaver for a GUI workflow
```

### 3. Configure an Oracle User

```sql
-- Create a new user
CREATE USER myuser IDENTIFIED BY mypassword;

-- Grant privileges
GRANT CONNECT, RESOURCE, DBA TO myuser;
GRANT CREATE SESSION TO myuser;
GRANT CREATE TABLE TO myuser;
GRANT CREATE VIEW TO myuser;

-- Set the default tablespace
ALTER USER myuser DEFAULT TABLESPACE USERS;
ALTER USER myuser QUOTA UNLIMITED ON USERS;
```

## SQLite Setup

### 1. Install SQLite

Linux Ubuntu:

```bash
sudo apt update
sudo apt install sqlite3
```

Windows:

```bash
# Download SQLite from https://sqlite.org/download.html
# Extract the files and add SQLite to PATH
```

macOS:

```bash
brew install sqlite
```

### 2. Create a SQLite Database

```bash
# Create a new database
sqlite3 mydatabase.db

# Import from an SQL file
sqlite3 mydatabase.db < schema.sql
```

### 3. Basic SQLite Commands

```sql
-- List all tables
.tables

-- Show table schema
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

## MongoDB Setup

### 1. Install MongoDB

Using Docker:

```bash
docker pull mongo:latest
docker run -d --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:latest
```

Linux Ubuntu:

```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install mongodb-org
```

Windows:

```bash
# Download MongoDB Community Server from mongodb.com
# Install it using the MSI installer
```

### 2. Connect to MongoDB

```bash
# MongoDB Shell
mongosh "mongodb://admin:password@localhost:27017"

# MongoDB Compass GUI connection string:
# mongodb://admin:password@localhost:27017
```

### 3. Basic MongoDB Operations

```javascript
// Select a database
use myDatabase

// Create a collection and insert data
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

## Initial Database Configuration

### Create a User and Database

```sql
-- Create a new user
CREATE USER app_user WITH PASSWORD 'secure_password';

-- Create a database
CREATE DATABASE app_database OWNER app_user;

-- Grant access
GRANT ALL PRIVILEGES ON DATABASE app_database TO app_user;
```

## Example Table Structure

```sql
CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  body TEXT,
  status VARCHAR(50),
  report_date DATE DEFAULT CURRENT_DATE
);
```

## Common SQL Queries

### Insert Data

```sql
INSERT INTO reports (title, body, status)
VALUES ('Weekly Report', 'Report content...', 'draft');
```

### Select Data

```sql
SELECT * FROM reports WHERE status = 'draft';
```

### Update Data

```sql
UPDATE reports SET status = 'completed' WHERE id = 1;
```

### Delete Data

```sql
DELETE FROM reports WHERE id = 2;
```

## Common Oracle Queries

### Table Management

```sql
-- Create a table with constraints
CREATE TABLE employees (
  emp_id NUMBER PRIMARY KEY,
  first_name VARCHAR2(50) NOT NULL,
  last_name VARCHAR2(50) NOT NULL,
  email VARCHAR2(100) UNIQUE,
  hire_date DATE DEFAULT SYSDATE,
  salary NUMBER(10,2)
);

-- Create a sequence for auto increment
CREATE SEQUENCE emp_seq START WITH 1 INCREMENT BY 1;

-- Create a trigger for auto increment
CREATE OR REPLACE TRIGGER emp_trigger
BEFORE INSERT ON employees
FOR EACH ROW
BEGIN
  :NEW.emp_id := emp_seq.NEXTVAL;
END;
```

### Data Manipulation

```sql
-- Insert with a sequence
INSERT INTO employees (first_name, last_name, email, salary)
VALUES ('John', 'Doe', 'john.doe@company.com', 50000);

-- Select with pagination
SELECT * FROM (
  SELECT ROWNUM rn, emp.*
  FROM employees emp
  WHERE ROWNUM <= 20
)
WHERE rn > 10;

-- Update with join-style filtering
UPDATE employees e
SET salary = salary * 1.1
WHERE EXISTS (
  SELECT 1 FROM departments d
  WHERE d.dept_id = e.dept_id
  AND d.dept_name = 'IT'
);
```

### Oracle-Specific Functions

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

## Common SQLite Queries

### Database Operations

```sql
-- Attach multiple databases
ATTACH DATABASE 'backup.db' AS backup;

-- Copy a table between databases
CREATE TABLE backup.employees AS SELECT * FROM main.employees;

-- Detach a database
DETACH DATABASE backup;
```

### Table Management

```sql
-- Create a table with auto increment
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price REAL DEFAULT 0.0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Add a column
ALTER TABLE products ADD COLUMN description TEXT;

-- Create an index
CREATE INDEX idx_products_name ON products(name);
```

### Data Queries

```sql
-- Full-text search
CREATE VIRTUAL TABLE products_fts USING fts5(name, description);
SELECT * FROM products_fts WHERE products_fts MATCH 'laptop';

-- JSON operations in SQLite 3.38+
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

## Common MongoDB Queries

### Collection Operations

```javascript
// Create a collection with validation
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

// Create indexes
db.products.createIndex({ name: "text", description: "text" })
db.products.createIndex({ categories: 1 })
db.products.createIndex({ price: 1, createdAt: -1 })
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

// Upsert operation
db.products.updateOne(
  { sku: "ABC123" },
  { $set: { name: "Updated Product", price: 150 } },
  { upsert: true }
)
```

## Laravel Applications

### Example App: `laravel/example-app/`

Complete Laravel application with common features.

#### Setup and Installation

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

### SAW Method: `laravel/metod-saw/`

Simple Additive Weighting implementation for a decision support system.

#### Docker Setup

```bash
cd laravel/metod-saw

# Build and run with Docker
docker-compose up -d

# Access the application at http://localhost:8080
```

#### SAW Method Features

- Multi-criteria decision making
- Weight calculation
- Alternative ranking
- Result visualization

## Next.js Website: `nextjs-website/`

Modern React-based website using TypeScript and Tailwind CSS.

### Setup and Development

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

## Excel VBA Automation: `Excel/`

Collection of VBA scripts for Excel automation.

### Available Scripts

#### 1. Asset Data Management: `excel_asset_data.vba`

- Import and export asset data
- Data validation and cleaning
- Report generation

#### 2. Data Comparison Tool: `excel_compare_data.vba`

- Side-by-side data comparison
- Difference highlighting
- Comparison report generation

#### 3. KPEI Health Check: `excel_healcheck_kpei.VBA`

- System status monitoring
- Performance metrics
- Alert generation

#### 4. Asset Merging: `excel_merge_asset.vba`

- Asset data consolidation
- Duplicate removal
- Master file creation

#### 5. Column Query Filter: `query_filter_by_column_in_excel.VBA`

- Dynamic filter creation
- Multi-column filtering
- Filtered result export

### Installation and Usage

#### Enable VBA in Excel

1. Open File > Options > Trust Center.
2. Open Trust Center Settings > Macro Settings.
3. Enable macros according to your security policy.

#### Import VBA Scripts

1. Press `Alt + F11` to open the VBA editor.
2. Choose File > Import File.
3. Select the `.vba` file.
4. Run the macro from the Developer tab.

## AI Integration: `AI OLLMA/`

AI templates and solutions for automation workflows.

### Summary Tools: `AI OLLMA/summary/`

#### Available Tools

- `create_template.py` - Template generation tool
- `debug_data.py` - Data debugging utilities
- `fix_template.py` - Template repair tool
- `test_template.py` - Template testing framework

#### Documentation Files

- [FINAL_SOLUTION_GUIDE.md](AI%20OLLMA/summary/FINAL_SOLUTION_GUIDE.md) - Comprehensive solution guide
- [PANDUAN_FINAL_SYSTEM.md](AI%20OLLMA/summary/PANDUAN_FINAL_SYSTEM.md) - Final system guidelines
- [README_SYSTEM.md](AI%20OLLMA/summary/README_SYSTEM.md) - System documentation

### Usage Example

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

## Python Utilities: `py/`

Python scripts for data processing and database utilities.

### Available Scripts

#### `test.py`

```bash
# Main testing and utility script
python py/test.py
```

Features:

- Database connection testing
- Data validation utilities
- Performance benchmarking
- API testing tools

### Usage Examples

```bash
# Run database tests
cd py
python test.py --test-db

# Process data
python test.py --process-data input.csv
```

## Database Query Collections

### PostgreSQL Queries: `Postgresql/`

#### Core Directories

- `config/` - Database configuration scripts
- `Data/` - Data manipulation queries
- `functions/` - Custom PostgreSQL functions
- `table/` - Table operations and utilities
- `Trigger/` - Database triggers

#### Key Files

- `search.sql` - Comprehensive search templates
- `config/config.sql` - Database setup configuration

### Migration Scripts: `Migration/Postgresql/`

#### Available Migrations

- `column_update.sql` - Column modification scripts
- `pertamina_ticket.sql` - Ticketing system setup
- `pm_merah.sql` - PM Red system migration
- `wbs.sql` - Work Breakdown Structure

## Sequence Management

### Set a Sequence to a Specific Value

```sql
SELECT setval('reports_id_seq', 150);
```

### Check the Sequence Name for a SERIAL Column

```sql
SELECT pg_get_serial_sequence('reports', 'id');
```

### Check the Next Sequence Value

```sql
SELECT nextval('reports_id_seq');
```

## Security Tips

- Never commit `.env` files that contain database usernames or passwords.
- Use database accounts with the least privileges required in production.
- Back up databases regularly.

## Backup and Restore

### Backup

```bash
pg_dump -U app_user -F c -b -v -f backup_db.dump app_database
```

### Restore

```bash
pg_restore -U app_user -d app_database -v backup_db.dump
```

## Test a PostgreSQL Connection

```bash
psql -U app_user -d app_database -h localhost -p 5432
```

## Database Management Tools

### PostgreSQL Tools

- pgAdmin - Web-based GUI
- DBeaver - Universal database tool
- psql - Command-line interface

### Oracle Tools

- SQL Developer - Official Oracle IDE
- Oracle SQL*Plus - Command-line tool
- Toad - Third-party GUI tool

### SQLite Tools

- SQLite Browser - Simple GUI browser
- sqlite3 - Command-line interface
- SQLiteStudio - Feature-rich GUI

### MongoDB Tools

- MongoDB Compass - Official GUI
- mongosh - Modern shell
- Robo 3T - Popular GUI client

## Docker Compose Setup

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

### Run the Environment

```bash
# Start all databases
docker-compose up -d

# Check status
docker-compose ps

# Stop all services
docker-compose down
```

## Backup and Migration

### PostgreSQL Backup and Restore

```bash
# Backup
pg_dump -U username -h localhost -p 5432 database_name > backup.sql
pg_dump -U username -F c -b -v -f backup.dump database_name

# Restore
psql -U username -d database_name < backup.sql
pg_restore -U username -d database_name backup.dump
```

### Oracle Backup and Restore

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
# Backup with a simple copy
cp database.db backup_database.db

# Dump to SQL
sqlite3 database.db .dump > backup.sql

# Restore from SQL
sqlite3 new_database.db < backup.sql
```

### MongoDB Backup and Restore

```bash
# Backup a single database
mongodump --host localhost:27017 --db database_name --out backup_folder

# Backup with authentication
mongodump --host localhost:27017 -u admin -p password --authenticationDatabase admin --db database_name --out backup_folder

# Restore
mongorestore --host localhost:27017 --db database_name backup_folder/database_name

# Export to JSON
mongoexport --host localhost:27017 --db database_name --collection collection_name --out data.json

# Import from JSON
mongoimport --host localhost:27017 --db database_name --collection collection_name --file data.json
```

## Troubleshooting and Common Issues

### PostgreSQL Issues

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

### Oracle Issues

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
-- Unlock a user account
ALTER USER username ACCOUNT UNLOCK;

-- Reset password
ALTER USER username IDENTIFIED BY newpassword;

-- Check user status
SELECT username, account_status FROM dba_users WHERE username = 'USERNAME';
```

### SQLite Issues

#### Database Locked

```bash
# Check if the database is in use
lsof database.db

# Force unlock after backing up the database
sqlite3 database.db "BEGIN IMMEDIATE; ROLLBACK;"
```

#### Corruption Recovery

```bash
# Check integrity
sqlite3 database.db "PRAGMA integrity_check;"

# Repair database
sqlite3 database.db ".dump" | sqlite3 repaired.db
```

### MongoDB Issues

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
// Create an admin user
use admin
db.createUser({
  user: "admin",
  pwd: "password",
  roles: ["root"]
})

// Connect with authentication
mongosh "mongodb://admin:password@localhost:27017/admin"
```

### Laravel Issues

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

# Roll back one migration step
php artisan migrate:rollback --step=1

# Check migration status
php artisan migrate:status
```

### Next.js Issues

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

# Production debugging
NODE_ENV=production npm run build
npm start
```

### Docker Issues

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

# Back up a volume
docker run --rm -v volume_name:/data -v $(pwd):/backup ubuntu tar czf /backup/backup.tar.gz -C /data .
```

### Excel VBA Issues

#### Macro Security

```vb
' Enable macros in Excel:
' File > Options > Trust Center > Macro Settings
' Select the macro setting required by your security policy.

' Trust a specific folder:
' Add the project folder to Trusted Locations.
```

#### Common VBA Errors

```vb
' Handle missing references
On Error Resume Next
Set obj = CreateObject("Excel.Application")
If Err.Number <> 0 Then
    MsgBox "Excel is not available"
    Exit Sub
End If
On Error GoTo 0
```

## Performance Optimization

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
npm run build
npm run analyze
```

## References and Documentation

### PostgreSQL

- [PostgreSQL Official Documentation](https://www.postgresql.org/docs/)
- [pgAdmin](https://www.pgadmin.org/) - GUI for PostgreSQL database management
- [PostgREST](https://postgrest.org/) - Auto-generated REST API

### Oracle Database

- [Oracle Database Documentation](https://docs.oracle.com/en/database/)
- [Oracle SQL Developer](https://www.oracle.com/database/sqldeveloper/) - Official IDE
- [Oracle Live SQL](https://livesql.oracle.com/) - Online Oracle playground

### SQLite

- [SQLite Official Documentation](https://sqlite.org/docs.html)
- [SQLite Browser](https://sqlitebrowser.org/) - GUI tool
- [SQLite Tutorial](https://www.sqlitetutorial.net/) - Comprehensive tutorial

### MongoDB

- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB Compass](https://www.mongodb.com/products/compass) - Official GUI
- [MongoDB University](https://university.mongodb.com/) - Free courses

### Multi-Database Tools

- [DBeaver](https://dbeaver.io/) - Universal database tool
- [DataGrip](https://www.jetbrains.com/datagrip/) - JetBrains database IDE
- [DB Fiddle](https://www.db-fiddle.com/) - Online SQL playground
