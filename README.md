# MSF_DB

Open-source database productivity toolkit for SQL shortcuts, AI documentation, and DBA workflows.

## Overview

MSF_DB is a database productivity toolkit that combines a searchable SQL shortcut library, AI-assisted database documentation generation, and workflow support for DBA and data engineering tasks.

It is designed to help teams move faster when they need to inspect databases, explain SQL, document schemas, compare systems, or reuse safe query patterns across engines.

## Problem It Solves

Database work is often spread across notes, snippets, screenshots, and ad-hoc scripts. That makes it hard to:

- Find the right query quickly.
- Understand what a query does before running it.
- Turn schema definitions into readable documentation.
- Keep DBA and data engineering workflows consistent across databases.
- Reuse proven patterns without rebuilding them from scratch.

MSF_DB solves this by combining a shortcut explorer, documentation generator, and workflow-oriented reference layer in one repository.

## Core Features

- SQL Shortcut Library for MySQL, PostgreSQL, SQL Server, Oracle, MongoDB, Databricks, and Snowflake.
- AI Database Documentation Generator (DBDocs Gen) from SQL DDL, schema metadata, or ERD inputs.
- Query explanation and risk labeling for safer database operations.
- DBA and Data Engineer workflow patterns for inspection, monitoring, and documentation.
- Frontend-ready structure for search, filter, copy, and explain experiences.

## Architecture Overview

MSF_DB is organized as a monorepo-style toolkit:

- `apps/web/` for the frontend shortcut explorer and documentation UI.
- `apps/api/` for backend APIs that serve shortcuts, schema parsing, and generation endpoints.
- `packages/sql-shortcuts/` for machine-readable shortcut definitions.
- `packages/schema-parser/` for schema extraction and relationship detection.
- `packages/dbdocs-gen/` for documentation generation logic and prompt orchestration.
- `docs/` for project documentation, examples, and roadmap notes.
- `examples/` for database-specific sample inputs and outputs.

The current repository also contains legacy folders such as `Postgresql/`, `Mysql/`, `Databricks/`, `sql-docs-generator/`, and `sql-docs-app/`. These remain available as source material and can be mapped into the new structure over time.

## Tech Stack

- TypeScript and JavaScript for app and tool development.
- Next.js for the web interface.
- Python for parsing, automation, and AI-assisted tooling.
- SQL and JSON for shortcut and metadata definitions.
- Markdown for docs, examples, and generated outputs.
- Docker for local services and reproducible workflows.

## Project Structure

```text
MSF_DB/
|-- apps/
|   |-- web/
|   `-- api/
|-- packages/
|   |-- dbdocs-gen/
|   |-- sql-shortcuts/
|   `-- schema-parser/
|-- docs/
|   |-- getting-started.md
|   |-- architecture.md
|   |-- sample-output.md
|   `-- roadmap.md
|-- examples/
|   |-- mysql/
|   |-- postgresql/
|   |-- sqlserver/
|   |-- oracle/
|   |-- mongodb/
|   |-- databricks/
|   `-- snowflake/
|-- README.md
|-- CONTRIBUTING.md
|-- CODE_OF_CONDUCT.md
|-- SECURITY.md
|-- LICENSE
`-- CHANGELOG.md
```

Legacy folders such as `Postgresql/`, `Mysql/`, `Databricks/`, `sql-docs-generator/`, and `sql-docs-app/` remain in the repository during the transition and should be mapped into the new structure gradually.

## Getting Started

See [docs/getting-started.md](docs/getting-started.md) for setup instructions. In short:

1. Clone the repository.
2. Install the runtime you need for the part you want to use.
3. Run the web app, API, or shortcut catalog once the target package is available.
4. Open the documentation pages in `docs/` for architecture and examples.

## Usage Examples

### Explore SQL Shortcuts

Use the shortcut library to find engine-specific queries by database, category, or risk level. Example use cases include listing tables, checking table size, reviewing indexes, or inspecting active sessions.

### Generate Documentation

Paste SQL DDL or schema metadata into DBDocs Gen to create Markdown documentation, relationship summaries, and table dictionaries.

### Explain Queries

Use the AI-assisted layer to explain what a query does, what it touches, and what risk level it should carry before execution.

## SQL Shortcut Library

The shortcut library is a structured collection of reusable database queries.

Each shortcut should include:

- `id`
- `title`
- `database`
- `category`
- `risk_level`
- `description`
- `query`
- `explanation`
- `tags`

This structure makes shortcuts easy to search, filter, render, and copy from the frontend.

Example categories include:

- show databases
- show tables
- table size
- index info
- active sessions
- backup/checkpoint
- user privileges
- query performance

## AI Database Documentation Generator

DBDocs Gen is one of the core features of MSF_DB.

Input sources:

- SQL DDL
- schema metadata
- ERD diagrams
- exported database metadata

Process:

- parse tables and columns
- detect primary keys and foreign keys
- infer relationships
- generate AI-assisted descriptions
- build a readable documentation page

Output formats:

- Markdown documentation
- PDF export-ready content
- table dictionary
- relationship summary
- documentation pages for internal or public use

## Roadmap

See [docs/roadmap.md](docs/roadmap.md) for the current delivery plan.

## Contributing

Contributions are welcome for SQL shortcuts, documentation improvements, parsers, generator logic, and frontend features.

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## License

Licensed under the MIT License. See [LICENSE](LICENSE) for details.
