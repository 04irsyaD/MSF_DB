
# ai_writer.py
# Uses Ollama CLI to run a local LLM (e.g. llama3). Adjust model name if needed.
import subprocess

def generate_table_description(table_name, columns, template_context=None, model='llama3'):
    # Buat prompt yang mempertimbangkan konteks template
    base_prompt = f"""Buat deskripsi singkat dan formal untuk tabel '{table_name}' dengan kolom: {', '.join(columns)}."""
    
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
    
    # Using ollama CLI to run model locally with better error handling
    try:
        # Add timeout and better encoding handling
        result = subprocess.run(
            ["ollama", "run", model, prompt], 
            capture_output=True, 
            text=True, 
            check=True,
            timeout=30,  # 30 second timeout
            encoding='utf-8',  # Force UTF-8 encoding
            errors='replace'   # Replace invalid characters
        )
        response = result.stdout.strip()
        if response:
            return response
        else:
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

if __name__ == '__main__':
    print(generate_table_description('customer', ['id','name','email']))
