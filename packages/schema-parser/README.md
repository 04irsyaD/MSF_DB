# Schema Parser

This package contains the parsing and normalization layer for schema input.

## Responsibilities

- Parse SQL DDL.
- Detect table definitions.
- Extract column metadata.
- Identify primary and foreign keys.
- Build relationship structures for DBDocs Gen.

## Expected Outputs

- Normalized table objects
- Column metadata lists
- Relationship graphs
- Schema summaries

## Notes

The parser should remain database-aware but output a consistent internal model so the frontend and documentation generator can work across engines.
