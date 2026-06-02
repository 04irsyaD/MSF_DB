# MSF_DB — Database Productivity Toolkit

Open-source database productivity toolkit for SQL shortcuts, AI-powered database documentation, and DBA/Data Engineer workflows.

MSF_DB is early-stage and actively developed. The repository is being shaped into a clean open-source toolkit for database shortcuts, documentation, and workflow automation.

## Overview

MSF_DB combines a SQL shortcut library, AI-assisted database documentation, and workflow automation into one repository.

## Why MSF_DB?

Database work is often spread across SQL snippets, manual documentation, setup notes, and automation scripts. MSF_DB brings those pieces together so the workflow is easier to reuse and review.

- SQL snippets and shortcuts stay organized by engine and purpose.
- Database documentation can be generated from SQL DDL and schema metadata.
- DBA and Data Engineer helpers live alongside the documentation flow.
- n8n and Telegram workflows can deliver documentation or automate common tasks.
- Multi-database references make the repository easier to browse as a toolkit.

## Core Features

- SQL Shortcut Library
- AI-Powered Database Documentation
- SQL DDL to Markdown Documentation
- Multi-Database References
- DBA/Data Engineer Helper Scripts
- n8n and Telegram Workflow Automation
- Query Safety and Explanation, as a planned enhancement

## Main Components

- [sql-docs-generator/](sql-docs-generator/)
- [sql-docs-app/](sql-docs-app/)
- [telegram-sql-docs/](telegram-sql-docs/)
- [n8n/](n8n/)
- [Mysql/](Mysql/)
- [Postgresql/](Postgresql/)
- [Databricks/](Databricks/)
- [docs/](docs/)
- [AI OLLMA/](AI%20OLLMA/)

## Quick Start

```bash
git clone https://github.com/04irsyaD/MSF_DB.git
cd MSF_DB
```

### Run SQL Docs Generator

```bash
cd sql-docs-generator
docker-compose up -d
```

### Browse SQL Shortcuts

Open the engine folders to browse shortcuts and reference material:

- [Mysql/](Mysql/)
- [Postgresql/](Postgresql/)
- [Databricks/](Databricks/)

### Run n8n Workflow

```bash
cd n8n
docker-compose up -d
```

## Usage Examples

- Search a shortcut query by database engine and risk level before running it.
- Paste SQL DDL into the documentation flow to generate Markdown output.
- Use n8n or Telegram automation to move documentation output into a sharing workflow.

## AI Database Documentation Workflow

DBDocs Gen is the documentation workflow in MSF_DB.

**Input**

- SQL DDL
- database schema
- table metadata
- business context

**Process**

- parse schema
- detect tables, columns, and relationships
- generate AI-assisted descriptions
- produce readable documentation

**Output**

- Markdown documentation
- table dictionary
- relationship summary
- developer-friendly database docs

Example input:

```sql
CREATE TABLE customers (
  customer_id INT PRIMARY KEY,
  customer_name VARCHAR(100),
  segment VARCHAR(50)
);

CREATE TABLE orders (
  order_id INT PRIMARY KEY,
  customer_id INT,
  order_date DATE,
  total_amount DECIMAL(12,2),
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);
```

Example output:

```md
# Database Documentation

## Table: customers
Purpose: Stores customer master data.

### Columns
| Column | Type | Description |
|---|---|---|
| customer_id | INT | Unique customer identifier |
| customer_name | VARCHAR(100) | Customer full name |
| segment | VARCHAR(50) | Customer business segment |

## Table: orders
Purpose: Stores customer order transactions.

### Relationships
- orders.customer_id references customers.customer_id
```

## Roadmap

- v0.1: repository cleanup and documentation
- v0.2: SQL shortcut explorer
- v0.3: AI SQL explanation
- v0.4: DBDocs Gen from SQL DDL
- v0.5: Markdown/PDF export
- v0.6: multi-database comparison
- v1.0: stable database productivity platform

See [docs/roadmap.md](docs/roadmap.md) for the working roadmap.

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## Security

Please read [SECURITY_NOTICE.md](SECURITY_NOTICE.md) before sharing data, credentials, or security-sensitive findings.
For manual follow-up steps, see [docs/security-cleanup.md](docs/security-cleanup.md).

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).