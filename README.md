# MSF_DB — Database Productivity Toolkit

Open-source database productivity toolkit for SQL shortcuts, AI-powered database documentation, and DBA/Data Engineer workflows.

## Overview

MSF_DB is an early-stage open-source database productivity toolkit. It brings together practical SQL shortcuts, AI-assisted database documentation, SQL DDL to Markdown workflows, DBA/Data Engineer helper scripts, n8n automation, Telegram bot workflows, and multi-database references in one repository.

The project is designed for people who frequently work with database schemas, query snippets, operational notes, automation scripts, and documentation that needs to be easier to find, review, and reuse.

## Why MSF_DB?

Database knowledge is often scattered across query snippets, setup notes, manual documentation, local scripts, chat messages, and workflow automation. That makes it harder for teams to understand schema intent, safely reuse queries, document changes, and onboard new developers or data engineers.

MSF_DB tries to organize those pieces into a single toolkit:

- SQL shortcuts stay close to the database engine they support.
- Documentation workflows help turn schema definitions into readable Markdown.
- Automation examples show how database work can connect with n8n, Telegram, and AI services.
- Security and cleanup guidance helps keep the repository safe for open-source usage.

## Core Features

- SQL Shortcut Library
- AI-Powered Database Documentation
- SQL DDL to Markdown Documentation
- Multi-Database References
- DBA/Data Engineer Helper Scripts
- n8n and Telegram Workflow Automation
- Query Safety and Explanation, as a planned enhancement

## Main Components

- `sql-docs-generator/` - AI-assisted SQL documentation generator using a frontend, FastAPI service, and Ollama.
- `sql-docs-app/` - Lightweight SQL-to-docs application reference.
- `telegram-sql-docs/` - Telegram bot workflow for generating database documentation from SQL snippets.
- `n8n/` - Workflow automation for SQL-to-docs and notification pipelines.
- `Mysql/` - MySQL query shortcuts and references.
- `Postgresql/` - PostgreSQL scripts, table utilities, functions, triggers, and configuration examples.
- `Databricks/` - Databricks SQL and RBAC examples.
- `docs/` - Project documentation, roadmap, examples, and security cleanup guidance.

## Quick Start

```bash
git clone https://github.com/04irsyaD/MSF_DB.git
cd MSF_DB
```

Browse SQL shortcuts by opening the database folders:

```text
Mysql/
Postgresql/
Databricks/
```

Run the SQL Docs Generator from `sql-docs-generator/`:

```bash
cd sql-docs-generator
docker-compose up -d
```

Run n8n workflows from `n8n/`:

```bash
cd n8n
docker-compose up -d
```

Use `.env.example` files to document required environment variables. Keep real `.env` files local and out of Git.

## AI Database Documentation Workflow

MSF_DB includes workflows for generating database documentation from schema input.

Input:

- SQL DDL
- Database schema
- Table metadata
- Business context

Process:

- Parse schema definitions.
- Detect tables, columns, and relationships.
- Generate AI-assisted descriptions.
- Produce readable documentation for developers, DBAs, analysts, and data engineers.

Output:

- Markdown documentation
- Table dictionary
- Relationship summary
- Developer-friendly database docs

Example input SQL:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(150),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  total_amount NUMERIC(12,2) NOT NULL,
  status VARCHAR(30) DEFAULT 'pending'
);
```

Example output Markdown:

```markdown
# Table: users

## Purpose

Stores application user account information.

## Columns

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | serial | no | Primary user identifier |
| email | varchar(255) | no | Unique email used for account access |
| full_name | varchar(150) | yes | User display name |
| created_at | timestamp | yes | Account creation timestamp |

## Relationships

- Referenced by `orders.user_id`.
```

## Security Notice

Do not commit real credentials, API keys, database passwords, private keys, access tokens, or production connection strings. Use `.env.example` to document required environment variables and keep real `.env` files local.

Review SQL, workflow JSON, Docker Compose files, logs, screenshots, generated documentation, and exported data before committing them.

## Roadmap

- v0.1: Repository cleanup and documentation
- v0.2: SQL shortcut explorer
- v0.3: AI SQL explanation
- v0.4: DBDocs Gen from SQL DDL
- v0.5: Markdown/PDF export
- v1.0: Stable database productivity platform

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for SQL, documentation, workflow, and automation contribution guidelines.

Please follow [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) when participating in the project.

## Security

See [SECURITY.md](SECURITY.md) for vulnerability reporting guidance and [docs/security-cleanup.md](docs/security-cleanup.md) for the cleanup checklist.

## License

This project is licensed under the [MIT License](LICENSE).
