# Telegram SQL Docs Bot

Generate database documentation from SQL snippets sent through Telegram.

## Setup

### 1. Create a Telegram Bot

1. Open Telegram and search for `@BotFather`.
2. Send `/newbot`.
3. Follow the instructions.
4. Copy the bot token and store it only in your local `.env` or shell environment.

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Set the following local values:

```text
TELEGRAM_BOT_TOKEN=
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3:latest
```

Do not commit `.env`.

### 3. Install and Run

```bash
cd telegram-sql-docs
pip install -r requirements.txt

# Linux/macOS
export TELEGRAM_BOT_TOKEN="<your-telegram-bot-token>"

# Windows PowerShell
$env:TELEGRAM_BOT_TOKEN = "<your-telegram-bot-token>"

python bot.py
```

## Usage

Send SQL with `/docs`:

```text
/docs CREATE TABLE users (
  id serial PRIMARY KEY,
  name varchar(100),
  email varchar(255)
);
```

Or send a `CREATE TABLE` statement directly:

```sql
CREATE TABLE orders (
  id serial PRIMARY KEY,
  user_id integer,
  total numeric(10,2),
  status varchar(50)
);
```

## Output

The bot returns a table-oriented documentation summary with:

- Table name
- AI-assisted table description
- Column names
- Data types
- Short column descriptions

## Requirements

- Python
- `python-telegram-bot`
- Ollama running locally or through `OLLAMA_BASE_URL`
- A local Telegram bot token

## Security Notes

- Keep `TELEGRAM_BOT_TOKEN` out of Git.
- Do not paste real tokens into README files, screenshots, workflow JSON, or issue comments.
- Rotate the bot token if it was ever committed or shared publicly.
