# ai_writer_fixed.py
# Clean ai_writer implementation (used to avoid malformed original file)
import subprocess

def generate_table_description(table_name, columns, template_context=None, model='llama3'):
    base_prompt = f"Buat deskripsi singkat dan formal untuk tabel '{table_name}' dengan kolom: {', '.join(columns)}."
    if template_context:
        prompt = f"""
Berdasarkan analisis template dokumentasi ini:
{template_context}

{base_prompt}

Pastikan deskripsi sesuai dengan gaya dan format yang diharapkan template.
"""
    else:
        prompt = base_prompt

    print(f"   Memproses tabel: {table_name}")
    try:
        result = subprocess.run(
            ["ollama", "run", model],
            input=prompt,
            capture_output=True,
            text=True,
            check=True,
            timeout=30,
            encoding='utf-8', errors='replace'
        )
        response = result.stdout.strip()
        if response:
            return response
        return f"Deskripsi untuk tabel {table_name} dengan kolom: {', '.join(columns)}."
    except subprocess.TimeoutExpired:
        print(f"      ⚠️ Timeout untuk tabel {table_name}, menggunakan deskripsi default")
        return f"Tabel {table_name} berisi informasi dengan kolom: {', '.join(columns)}."
    except subprocess.CalledProcessError as e:
        print(f"      ⚠️ Error Ollama untuk tabel {table_name}: {e}")
        return f"Tabel {table_name} berisi data dengan kolom: {', '.join(columns)}."
    except Exception as e:
        print(f"      ⚠️ Unexpected error untuk tabel {table_name}: {e}")
        return f"Deskripsi default untuk tabel {table_name} (AI gagal dijalankan)."
