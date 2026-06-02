# DBDocs Gen

This package holds the logic for generating database documentation from schema input.

## Responsibilities

- Accept SQL DDL, schema metadata, or ERD input.
- Parse tables, columns, keys, and relationships.
- Generate human-readable descriptions.
- Build Markdown documentation drafts.
- Support PDF-ready output or export pipelines.

## Input Types

- SQL DDL
- schema metadata
- relationship exports
- database catalog data

## Output Types

- Markdown documentation
- table dictionaries
- relationship summaries
- documentation pages

## Notes

This package should stay focused on transformation and generation logic. UI concerns belong in `apps/web/` and transport concerns belong in `apps/api/`.
