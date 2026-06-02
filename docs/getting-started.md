# Getting Started

MSF_DB is being organized as a database productivity toolkit. This guide explains the intended setup flow for the new monorepo-style structure while keeping the existing legacy folders available during migration.

## Prerequisites

- Node.js 20+ for the web app and most tooling.
- Python 3.11+ for parsing, automation, and AI-assisted scripts.
- Docker and Docker Compose for local services and optional AI/runtime dependencies.
- Git for cloning and contribution workflows.

## Recommended Setup

```bash
git clone <repository-url>
cd MSF_DB
```

If the new `apps/` and `packages/` folders have been scaffolded, install dependencies per package:

```bash
cd apps/web
npm install
npm run dev
```

```bash
cd apps/api
npm install
npm run dev
```

If you are still working from the legacy layout, these folders are the closest existing references:

- `sql-docs-generator/` for the documentation generator concept.
- `sql-docs-app/` for a lightweight documentation UI reference.
- `nextjs-website/` for frontend work.
- `Postgresql/`, `Mysql/`, and `Databricks/` for shortcut content.

## Environment Setup

Use placeholder values only when creating local configuration files:

```bash
# Example placeholders only
DATABASE_URL=postgresql://app_user:app_password@localhost:5432/app_database
OLLAMA_HOST=http://localhost:11434
```

Do not commit secrets, `.env` files, production connection strings, or private tokens.

## Running the Frontend

The frontend is intended to support:

- SQL Shortcut Explorer
- Filter by database
- Filter by category
- Search shortcut
- Copy query
- Explain query
- Risk label
- Generate documentation from schema

Once the web app is available, the expected flow is:

```bash
cd apps/web
npm run dev
```

## Running the Backend or API

The API layer is intended to provide:

- Shortcut search and retrieval
- Schema parsing endpoints
- DBDocs Gen orchestration
- Query explanation and metadata endpoints

Once the API app is available, the expected flow is:

```bash
cd apps/api
npm run dev
```

## Using DBDocs Gen

DBDocs Gen accepts:

- SQL DDL
- schema metadata
- ERD information
- exported database metadata

It then produces Markdown documentation, relationship summaries, and table dictionary output.

See [sample-output.md](sample-output.md) for an example of the expected result.

## Using the Shortcut Library

Shortcut records should live in `packages/sql-shortcuts/` and follow the shared metadata format documented in the package README.

Typical usage:

1. Pick the database engine.
2. Filter by category or tag.
3. Review the risk label.
4. Copy the query.
5. Read the explanation before executing it.

## Next Steps

- Add a real `package.json` to `apps/web/` and `apps/api/`.
- Wire the frontend to the shortcut catalog.
- Connect DBDocs Gen to the schema parser.
- Move the strongest legacy examples into the new package folders.
