# SQL Shortcut Library

This package stores structured SQL shortcuts for multiple databases.

## Goal

The shortcut library should be easy for the frontend to search, filter, render, and copy.

## Required Metadata

Each shortcut should follow a shape like this:

```json
{
  "id": "postgres-show-table-size",
  "title": "Show table size",
  "database": "postgresql",
  "category": "performance",
  "risk_level": "read_only",
  "description": "Shows table size information in PostgreSQL.",
  "query": "...",
  "explanation": "This query helps identify large tables.",
  "tags": ["performance", "storage", "table-size"]
}
```

## Risk Levels

- `safe`
- `read_only`
- `admin_only`
- `destructive`
- `needs_backup`

## Target Layout

- `mysql/`
- `postgresql/`
- `sqlserver/`
- `oracle/`
- `mongodb/`
- `databricks/`
- `snowflake/`

Each folder can contain JSON shortcut files grouped by category.
