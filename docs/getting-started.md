# Getting Started

This guide gives a short, repository-relative setup flow for the current MSF_DB structure.

## Prerequisites

- Docker and Docker Compose
- Python 3.11+ for automation and documentation scripts
- Node.js 20+ for frontend tooling when the web app is used

## Clone the Repository

```bash
git clone https://github.com/04irsyaD/MSF_DB.git
cd MSF_DB
```

## SQL Docs Generator

```bash
cd sql-docs-generator
docker-compose up -d
```

If you need more detail, see [sql-docs-generator/README.md](../sql-docs-generator/README.md).

## n8n Automation

```bash
cd n8n
docker-compose up -d
```

See [n8n/README.md](../n8n/README.md) for workflow setup.

## Shortcut Library

Browse the engine folders directly to inspect shortcut examples and legacy references:

- [Mysql/](../Mysql/)
- [Postgresql/](../Postgresql/)
- [Databricks/](../Databricks/)

## Documentation Workflow

Use the documentation pages in this folder when you want the intended project direction:

- [architecture.md](architecture.md)
- [sample-output.md](sample-output.md)
- [roadmap.md](roadmap.md)

The repository is still early-stage, so some folders remain legacy references while the newer structure is being expanded.
