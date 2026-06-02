# Contributing

Thanks for helping improve this database query and documentation toolkit. Contributions are welcome for SQL scripts, database documentation workflows, automation tools, examples, and project docs.

## Ways to Contribute

- Add or improve SQL queries for PostgreSQL, MySQL, Oracle, SQLite, MongoDB, or Databricks.
- Improve database documentation examples and SQL-to-docs workflows.
- Add migration examples, table utilities, index helpers, or troubleshooting scripts.
- Improve Docker, n8n, Telegram, AI/Ollama, Laravel, Next.js, Python, or Excel automation examples.
- Fix typos, broken links, unclear setup steps, or outdated documentation.

## Before You Start

- Check the existing folder structure and place files in the closest matching directory.
- Keep changes focused. Avoid mixing unrelated SQL, app, and documentation edits in one pull request.
- Do not commit real credentials, `.env` files, production data, customer data, private tokens, API keys, or internal connection strings.
- Use sample names and values such as `app_user`, `app_database`, `example.com`, or `localhost`.

## Repository Structure Guide

- `Postgresql/` - PostgreSQL scripts, table utilities, functions, triggers, and configuration.
- `Mysql/` - MySQL queries and configuration references.
- `Databricks/` - Databricks SQL and RBAC examples.
- `Migration/` - Database migration scripts and schema change references.
- `sql-docs-generator/` - SQL documentation generator using Next.js, FastAPI, and Ollama.
- `sql-docs-app/` - Lightweight SQL-to-documentation app reference.
- `n8n/workflows/` - Automation workflows for documentation and notification pipelines.
- `telegram-sql-docs/` - Telegram bot workflow for SQL documentation.
- `query dokumen/` - Additional query documentation and examples.

## SQL Contribution Guidelines

- Add a short header comment explaining the purpose of the query.
- Include the target database engine and version when it matters.
- Prefer safe, readable SQL over clever one-liners.
- Use clear aliases and consistent indentation.
- For destructive statements such as `DELETE`, `DROP`, `TRUNCATE`, or mass `UPDATE`, include a warning comment and a preview `SELECT` where possible.
- Avoid hard-coded production schema names, real hostnames, real usernames, or business-sensitive table names unless they are already public examples.
- If a query depends on extensions, permissions, or system catalogs, document that requirement.

Example:

```sql
-- Purpose: Find tables that contain a column name pattern.
-- Database: PostgreSQL 12+
-- Safety: Read-only query.
SELECT table_schema, table_name, column_name
FROM information_schema.columns
WHERE column_name ILIKE '%email%'
ORDER BY table_schema, table_name, column_name;
```

## Documentation Guidelines

- Use English for root-level project documentation.
- Keep Markdown headings clear and consistent.
- Add examples that can be copied safely.
- When documenting database tables, include purpose, columns, relationships, indexes, common queries, and security notes.
- Review AI-generated documentation before committing it.
- Keep generated output and reviewed final documentation separate when possible.

## Application and Automation Guidelines

- Keep app-specific changes inside the related app folder.
- Document required environment variables with placeholder values only.
- For Docker or n8n changes, include startup commands and expected local URLs.
- For Python scripts, include dependencies, usage examples, and safe sample input.
- For workflow files, avoid embedding tokens or private webhook URLs.

## Pull Request Checklist

Before opening a pull request, confirm:

- The change is placed in the correct directory.
- SQL examples are safe and do not expose private data.
- Documentation is updated when behavior, setup, or workflow changes.
- New scripts include usage notes or comments.
- Formatting is readable and consistent with nearby files.
- No generated cache, virtual environment, dependency folder, or secret file is included.

## Security

If your contribution fixes or reports a security issue, do not publish sensitive details in a public issue or pull request. Follow [SECURITY.md](SECURITY.md).

## Code of Conduct

All contributors are expected to follow [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
