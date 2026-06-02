# n8n Workflow Automation

Automation workflows for SQL-to-documentation pipelines, Telegram notifications, and Google Drive publishing.

## Quick Start

1. Copy the example environment file and fill local values:

```bash
cp .env.example .env
```

2. Start n8n:

```bash
cd n8n
docker-compose up -d
```

3. Open n8n:

```text
http://localhost:5678
```

Use the username and password configured in your local `.env` file:

- `N8N_BASIC_AUTH_USER`
- `N8N_BASIC_AUTH_PASSWORD`

## Import a Workflow

1. Open n8n in the browser.
2. Choose Import from File.
3. Select a workflow from `workflows/`.
4. Configure required credentials in n8n.
5. Activate the workflow after reviewing every node.

## Available Workflows

```text
n8n/
|-- docker-compose.yml
|-- .env.example
`-- workflows/
    |-- sql_to_docs_direct_input.json
    |-- sql_table_to_docs_workflow.json
    |-- telegram_drive_sql_docs.json
    `-- github_postgresql_telegram.json
```

## Direct SQL Input Workflow

Send SQL to the webhook endpoint:

```bash
curl -X POST http://localhost:5678/webhook/sql-to-docs \
  -H "Content-Type: application/json" \
  -d '{"sql": "CREATE TABLE users (id serial PRIMARY KEY, name varchar(100));"}'
```

## Telegram and Google Drive Workflow

The `telegram_drive_sql_docs.json` workflow can receive SQL from Telegram, generate documentation, send the result back to Telegram, and upload Markdown output to Google Drive.

Required credentials are configured inside n8n:

- Telegram bot token
- Google Drive account
- Optional external webhook URL

Use `N8N_WEBHOOK_URL` in `.env` when exposing n8n through a public URL or tunneling service.

## Requirements

- Docker and Docker Compose
- Ollama running for AI-assisted documentation workflows
- Local `.env` file created from `.env.example`

## Commands

```bash
# Start n8n
docker-compose up -d

# Stop n8n
docker-compose down

# View logs
docker-compose logs -f n8n

# Restart n8n
docker-compose restart n8n
```

## Security Notes

- Do not commit `.env`.
- Do not paste real tokens into workflow JSON files.
- Configure secrets through n8n credentials or local environment variables.
- Review workflow exports before committing them.
