# API Service

This folder is the planned backend layer for MSF_DB.

## Purpose

The API should provide a clean interface for:

- Searching the shortcut catalog.
- Fetching shortcut metadata.
- Parsing schema input.
- Orchestrating DBDocs Gen.
- Returning explanation summaries for SQL.

## Suggested Endpoints

- `GET /shortcuts`
- `GET /shortcuts/:id`
- `GET /shortcuts?database=postgresql&category=performance`
- `POST /explain`
- `POST /parse-schema`
- `POST /generate-docs`

## Notes

Keep the service thin and focused. The source of truth for query examples should remain in the shortcut package, while the API handles search, parsing, and generation orchestration.
