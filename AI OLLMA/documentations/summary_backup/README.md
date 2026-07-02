AI DB Documentation Generator - Ready-to-run (offline) project
============================================================

Contents:
- scripts/         : Python scripts (db_reader, ai_writer, doc_generator, main)
- template/        : Contains template_dokumentasi.docx (dummy template)
- output/          : Outputs will be written here
- requirements.txt : Python libraries required

Quick start (assumes Python, PostgreSQL, and Ollama are installed):
1. Create & activate a virtual environment (recommended):
   python -m venv venv
   venv\Scripts\activate    # Windows
   source venv/bin/activate   # Linux / macOS

2. Install Python dependencies:
   pip install -r requirements.txt

3. Put your real template file in the template/ folder (or use the provided dummy).
   Edit scripts/main.py DB config to match your PostgreSQL credentials.

4. Make sure Ollama is running and llama3 model is available:
   ollama pull llama3
   # Optionally test
   ollama run llama3

5. Run the main script:
   python scripts/main.py

6. Generated file will appear in the output/ folder (Dokumentasi_Auto.docx).
   If you enabled PDF conversion, a PDF will also be created.

Notes:
- The included template is a simple example. Replace it with your own .docx template if desired.
- The scripts assume PostgreSQL by default. You can adapt db_reader.py to other DBs (MySQL, MSSQL).
- This package uses Ollama CLI to call local models. Ensure `ollama` is in PATH.
