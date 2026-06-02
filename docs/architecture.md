# Architecture

MSF_DB consists of several main parts:

1. Frontend Web App
- SQL shortcut explorer
- documentation generator UI
- search and filter interface

2. Backend/API Service
- receives SQL/schema input
- manages documentation generation request
- connects to AI service

3. AI Documentation Service
- generates table descriptions
- explains columns and relationships
- summarizes schema purpose

4. SQL Shortcut Library
- stores reusable database commands
- grouped by database engine and category
- includes risk level metadata

5. Automation Workflows
- n8n workflows
- Telegram bot integration
- optional documentation delivery workflow
