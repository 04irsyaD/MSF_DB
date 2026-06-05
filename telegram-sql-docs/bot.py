"""
Telegram Bot - SQL to Documentation Generator
Kirim SQL, dapat dokumentasi langsung!

Setup:
1. Buat bot di @BotFather, dapat TOKEN
2. Set TOKEN di environment atau langsung di bawah
3. Jalankan: python bot.py
"""

import os
import re
import json
import logging
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
import ollama

# ============== KONFIGURASI ==============
# Token must be provided through the local environment.
BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")

# Model Ollama
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3:latest")

# Logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# ============== SQL PARSER ==============
def parse_sql_tables(sql_text):
    """Parse CREATE TABLE statements dari SQL"""
    tables = []
    
    pattern = r'CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:public\.)?["\']?(\w+)["\']?\s*\(([\s\S]*?)\)(?:\s*;)?'
    matches = re.findall(pattern, sql_text, re.IGNORECASE)
    
    for match in matches:
        table_name = match[0]
        table_body = match[1]
        
        columns = []
        lines = table_body.split(',')
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            if any(kw in line.upper() for kw in ['CONSTRAINT', 'PRIMARY KEY(', 'FOREIGN KEY', 'UNIQUE(', 'CHECK(', 'INDEX']):
                continue
            
            col_match = re.match(r'^["\']?(\w+)["\']?\s+(\w+(?:\([^)]+\))?)', line)
            if col_match:
                columns.append({
                    'name': col_match.group(1),
                    'type': col_match.group(2)
                })
        
        if columns:
            tables.append({
                'name': table_name,
                'columns': columns
            })
    
    return tables

# ============== AI GENERATOR ==============
def generate_ai_description(table_name, columns):
    """Generate deskripsi menggunakan Ollama"""
    
    prompt = f"""Kamu adalah database documentation expert. Analisis PostgreSQL table berikut dan buat dokumentasi dalam Bahasa Indonesia.

NAMA TABLE: {table_name}

KOLOM-KOLOM:
{chr(10).join([f"- {c['name']} ({c['type']})" for c in columns])}

Buatkan dokumentasi dengan format JSON:
{{
  "table_description": "Deskripsi singkat 1 kalimat",
  "columns": {{
    "nama_kolom": "Deskripsi max 5 kata"
  }}
}}

PENTING: Jawab HANYA dalam format JSON yang valid."""

    try:
        response = ollama.chat(
            model=OLLAMA_MODEL,
            messages=[{'role': 'user', 'content': prompt}],
            options={'temperature': 0.3}
        )
        
        content = response['message']['content']
        json_match = re.search(r'\{[\s\S]*\}', content)
        if json_match:
            return json.loads(json_match.group())
    except Exception as e:
        logger.error(f"AI Error: {e}")
    
    return {
        'table_description': f'Tabel {table_name}',
        'columns': {c['name']: f"Field {c['name']}" for c in columns}
    }

# ============== FORMAT OUTPUT ==============
def format_documentation(tables):
    """Format hasil sebagai Telegram message"""
    
    if not tables:
        return "❌ Tidak ditemukan CREATE TABLE statement yang valid."
    
    output = "📚 *DOKUMENTASI DATABASE*\n"
    output += "━" * 25 + "\n\n"
    
    for i, table in enumerate(tables, 1):
        # Generate AI description
        ai_result = generate_ai_description(table['name'], table['columns'])
        
        output += f"*{i}. {table['name']}*\n"
        output += f"📝 {ai_result.get('table_description', 'Dokumentasi otomatis')}\n\n"
        output += "```\n"
        output += f"{'No':<3} {'Field':<20} {'Type':<15} Deskripsi\n"
        output += "-" * 60 + "\n"
        
        for j, col in enumerate(table['columns'], 1):
            desc = ai_result.get('columns', {}).get(col['name'], f"Field {col['name']}")
            # Truncate for telegram
            desc = desc[:25] + "..." if len(desc) > 25 else desc
            output += f"{j:<3} {col['name']:<20} {col['type']:<15} {desc}\n"
        
        output += "```\n\n"
    
    output += f"✅ Total: {len(tables)} table(s)"
    
    return output

# ============== TELEGRAM HANDLERS ==============
async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handler untuk /start"""
    welcome = """
👋 *Selamat datang di SQL Docs Bot!*

Saya bisa generate dokumentasi dari SQL query kamu.

*Cara Pakai:*
1️⃣ Kirim `/docs` + SQL query
2️⃣ Atau langsung kirim CREATE TABLE statement

*Contoh:*
```
/docs CREATE TABLE users (
  id serial PRIMARY KEY,
  name varchar(100),
  email varchar(255)
);
```

*Commands:*
/start - Tampilkan pesan ini
/docs - Generate dokumentasi
/help - Bantuan

_Powered by Ollama AI_ 🤖
"""
    await update.message.reply_text(welcome, parse_mode='Markdown')

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handler untuk /help"""
    help_text = """
📖 *BANTUAN*

*Format SQL yang didukung:*
• CREATE TABLE statements
• Multiple tables sekaligus
• Dengan atau tanpa schema (public.)

*Tips:*
• Pastikan SQL valid
• Satu message bisa berisi banyak tables
• Hasil dalam Bahasa Indonesia

*Contoh Input:*
```sql
CREATE TABLE products (
  id serial PRIMARY KEY,
  name varchar(200),
  price numeric(10,2),
  stock integer
);
```

Ada pertanyaan? Hubungi admin.
"""
    await update.message.reply_text(help_text, parse_mode='Markdown')

async def docs_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handler untuk /docs"""
    # Get SQL from message (after /docs)
    sql_text = update.message.text.replace('/docs', '').strip()
    
    if not sql_text:
        await update.message.reply_text(
            "❌ Silakan kirim SQL setelah /docs\n\n"
            "Contoh:\n"
            "`/docs CREATE TABLE users (id serial, name varchar(100));`",
            parse_mode='Markdown'
        )
        return
    
    await process_sql(update, sql_text)

async def message_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handler untuk pesan biasa (tanpa command)"""
    sql_text = update.message.text
    
    # Check if it looks like SQL
    if 'CREATE TABLE' in sql_text.upper():
        await process_sql(update, sql_text)
    else:
        await update.message.reply_text(
            "🤔 Sepertinya bukan SQL query.\n\n"
            "Kirim CREATE TABLE statement atau gunakan /docs\n"
            "Ketik /help untuk bantuan."
        )

async def process_sql(update: Update, sql_text: str):
    """Process SQL dan generate docs"""
    
    # Send "typing" indicator
    await update.message.chat.send_action('typing')
    
    # Parse SQL
    tables = parse_sql_tables(sql_text)
    
    if not tables:
        await update.message.reply_text(
            "❌ Tidak ditemukan CREATE TABLE statement.\n\n"
            "Pastikan format SQL benar:\n"
            "```sql\n"
            "CREATE TABLE nama_table (\n"
            "  column1 type,\n"
            "  column2 type\n"
            ");\n"
            "```",
            parse_mode='Markdown'
        )
        return
    
    # Notify processing
    processing_msg = await update.message.reply_text(
        f"⏳ Processing {len(tables)} table(s)...\n"
        f"🤖 Generating AI descriptions..."
    )
    
    # Generate documentation
    try:
        result = format_documentation(tables)
        
        # Delete processing message
        await processing_msg.delete()
        
        # Send result (split if too long)
        if len(result) > 4000:
            # Split into chunks
            chunks = [result[i:i+4000] for i in range(0, len(result), 4000)]
            for chunk in chunks:
                await update.message.reply_text(chunk, parse_mode='Markdown')
        else:
            await update.message.reply_text(result, parse_mode='Markdown')
            
    except Exception as e:
        logger.error(f"Error: {e}")
        await processing_msg.edit_text(f"❌ Error: {str(e)}")

# ============== MAIN ==============
def main():
    """Start the bot"""
    
    if not BOT_TOKEN:
        print("=" * 50)
        print("❌ ERROR: Bot token belum diset!")
        print()
        print("Cara mendapatkan token:")
        print("1. Buka Telegram, cari @BotFather")
        print("2. Kirim /newbot")
        print("3. Ikuti instruksi, dapat token")
        print("4. Set TELEGRAM_BOT_TOKEN di environment lokal")
        print("=" * 50)
        return
    
    print("=" * 50)
    print("🤖 SQL Docs Telegram Bot")
    print("=" * 50)
    print(f"Model: {OLLAMA_MODEL}")
    print("Starting bot...")
    print()
    
    # Create application
    app = Application.builder().token(BOT_TOKEN).build()
    
    # Add handlers
    app.add_handler(CommandHandler("start", start_command))
    app.add_handler(CommandHandler("help", help_command))
    app.add_handler(CommandHandler("docs", docs_command))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, message_handler))
    
    # Start polling
    print("✅ Bot is running! Press Ctrl+C to stop.")
    print("📱 Buka Telegram dan chat dengan bot kamu.")
    print()
    
    app.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == '__main__':
    main()
