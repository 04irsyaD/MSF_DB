"""
Telegram Bot - SQL Docs (Polling Mode)
Tidak perlu ngrok! Bot jalan di lokal, polling ke Telegram.
"""

import os
import re
import json
import logging
import asyncio
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
import ollama

# ============== CONFIG ==============
BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3:latest")

logging.basicConfig(format='%(asctime)s - %(levelname)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

# ============== PARSER ==============
def parse_tables(sql):
    tables = []
    pattern = r'CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:public\.)?["\']?(\w+)["\']?\s*\(([\s\S]*?)\)(?:\s*;)?'
    
    for match in re.finditer(pattern, sql, re.IGNORECASE):
        table_name, body = match.groups()
        columns = []
        
        for line in body.split(','):
            line = line.strip()
            if not line or re.match(r'^(CONSTRAINT|PRIMARY\s+KEY\(|FOREIGN|UNIQUE\(|CHECK\()', line, re.I):
                continue
            col = re.match(r'^["\']?(\w+)["\']?\s+(\w+(?:\([^)]+\))?)', line)
            if col:
                columns.append({'name': col.group(1), 'type': col.group(2)})
        
        if columns:
            tables.append({'name': table_name, 'columns': columns, 'sql': match.group(0)})
    
    return tables

# ============== AI ==============
def get_ai_docs(table_name, columns):
    prompt = f"""Database documentation expert. Table PostgreSQL, dokumentasi Bahasa Indonesia.

TABLE: {table_name}
COLUMNS: {', '.join([f"{c['name']} ({c['type']})" for c in columns])}

Response JSON only:
{{"description": "1 kalimat", "columns": {{"col_name": "max 5 kata"}}}}"""

    try:
        resp = ollama.chat(model=OLLAMA_MODEL, messages=[{'role': 'user', 'content': prompt}], options={'temperature': 0.3})
        content = resp['message']['content']
        m = re.search(r'\{[\s\S]*\}', content)
        if m:
            return json.loads(m.group())
    except Exception as e:
        logger.error(f"AI error: {e}")
    
    return {'description': f'Tabel {table_name}', 'columns': {c['name']: f"Field {c['name']}" for c in columns}}

# ============== FORMAT ==============
def format_docs(tables):
    if not tables:
        return "❌ Tidak ditemukan CREATE TABLE."
    
    out = "📚 *DOKUMENTASI*\n━━━━━━━━━━━━━━━\n\n"
    
    for i, t in enumerate(tables, 1):
        ai = get_ai_docs(t['name'], t['columns'])
        out += f"*{i}. {t['name']}*\n📝 {ai.get('description', '')}\n\n```\n"
        
        for j, c in enumerate(t['columns'], 1):
            desc = ai.get('columns', {}).get(c['name'], c['name'])[:30]
            out += f"{j}. {c['name']} ({c['type']})\n   → {desc}\n"
        
        out += "```\n\n"
    
    out += f"✅ Total: {len(tables)} table(s)"
    return out

# ============== HANDLERS ==============
async def start(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "👋 *SQL Docs Bot*\n\n"
        "Kirim CREATE TABLE, dapat dokumentasi!\n\n"
        "Contoh:\n`/docs CREATE TABLE users (id serial, name varchar(100));`",
        parse_mode='Markdown'
    )

async def docs(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    sql = update.message.text.replace('/docs', '').strip()
    if not sql:
        await update.message.reply_text("❌ Kirim SQL setelah /docs")
        return
    await process(update, sql)

async def message(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    text = update.message.text
    if 'CREATE TABLE' in text.upper():
        await process(update, text)
    else:
        await update.message.reply_text("🤔 Kirim CREATE TABLE atau /docs + SQL")

async def process(update: Update, sql: str):
    msg = await update.message.reply_text("⏳ Processing...")
    
    tables = parse_tables(sql)
    result = format_docs(tables)
    
    await msg.delete()
    
    # Split if too long
    if len(result) > 4000:
        for i in range(0, len(result), 4000):
            await update.message.reply_text(result[i:i+4000], parse_mode='Markdown')
    else:
        await update.message.reply_text(result, parse_mode='Markdown')

# ============== MAIN ==============
def main():
    if not BOT_TOKEN:
        print("❌ Set BOT_TOKEN dulu!")
        print("1. @BotFather → /newbot → dapat token")
        print("2. Set TELEGRAM_BOT_TOKEN di environment lokal")
        return
    
    print("🤖 SQL Docs Bot (Polling Mode)")
    print("✅ Tidak perlu ngrok!")
    print("📱 Buka Telegram, chat dengan bot kamu")
    print("-" * 40)
    
    app = Application.builder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("docs", docs))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, message))
    
    app.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == '__main__':
    main()
