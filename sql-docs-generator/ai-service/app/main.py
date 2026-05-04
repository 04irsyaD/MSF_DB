"""
SQL Documentation Generator - AI Service
FastAPI backend dengan integrasi Ollama LLM
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict
import httpx
import json
import re

app = FastAPI(
    title="SQL Docs Generator API",
    description="Generate database documentation using AI",
    version="1.0.0"
)

# CORS untuk Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============== PYDANTIC MODELS ==============

class DatabaseConnection(BaseModel):
    host: str = "localhost"
    port: int = 5432
    database: str
    username: str
    password: str
    schema_name: str = "public"

class CustomTerm(BaseModel):
    term: str
    definition: str

class DocumentationRequest(BaseModel):
    sql_content: str = Field(..., description="SQL DDL content (CREATE TABLE statements)")
    project_name: Optional[str] = "Database Documentation"
    project_description: Optional[str] = None
    author: Optional[str] = None
    language: str = Field(default="Indonesian", description="Output language: Indonesian or English")
    output_format: str = Field(default="markdown", description="Output format: markdown, html")
    detail_level: str = Field(default="detailed", description="Detail level: simple, detailed, comprehensive")
    business_context: Optional[str] = None
    custom_terms: Optional[List[CustomTerm]] = None
    
class TableInfo(BaseModel):
    name: str
    columns: List[Dict]
    primary_key: Optional[str] = None
    foreign_keys: List[Dict] = []
    indexes: List[str] = []

class GenerationResponse(BaseModel):
    success: bool
    documentation: str
    tables_processed: int
    message: str

# ============== SQL PARSER ==============

class SQLParser:
    """Parse SQL DDL statements to extract table information"""
    
    @staticmethod
    def parse_create_table(sql: str) -> List[TableInfo]:
        """Extract table information from CREATE TABLE statements"""
        tables = []
        
        # Pattern untuk match CREATE TABLE
        table_pattern = r'CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:[\w"]+\.)?["\']?([\w]+)["\']?\s*\(([\s\S]*?)\);'
        
        matches = re.findall(table_pattern, sql, re.IGNORECASE)
        
        for match in matches:
            table_name = match[0]
            columns_str = match[1]
            
            columns = SQLParser._parse_columns(columns_str)
            pk = SQLParser._find_primary_key(columns_str)
            fks = SQLParser._find_foreign_keys(columns_str)
            
            tables.append(TableInfo(
                name=table_name,
                columns=columns,
                primary_key=pk,
                foreign_keys=fks
            ))
        
        return tables
    
    @staticmethod
    def _parse_columns(columns_str: str) -> List[Dict]:
        """Parse column definitions"""
        columns = []
        lines = columns_str.split(',')
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            # Skip constraint definitions
            if any(kw in line.upper() for kw in ['PRIMARY KEY', 'FOREIGN KEY', 'CONSTRAINT', 'UNIQUE', 'CHECK', 'INDEX']):
                continue
            
            # Parse column: name type [constraints]
            col_match = re.match(r'["\']?([\w]+)["\']?\s+([\w\(\),\s]+)', line)
            if col_match:
                col_name = col_match.group(1)
                col_rest = col_match.group(2)
                
                # Extract data type
                type_match = re.match(r'([\w]+(?:\([^)]+\))?)', col_rest)
                col_type = type_match.group(1) if type_match else "UNKNOWN"
                
                # Check constraints
                is_nullable = "NOT NULL" not in line.upper()
                is_pk = "PRIMARY KEY" in line.upper()
                has_default = "DEFAULT" in line.upper()
                is_unique = "UNIQUE" in line.upper()
                
                # Extract default value
                default_val = None
                default_match = re.search(r'DEFAULT\s+([^\s,]+)', line, re.IGNORECASE)
                if default_match:
                    default_val = default_match.group(1)
                
                columns.append({
                    "name": col_name,
                    "type": col_type,
                    "nullable": is_nullable,
                    "primary_key": is_pk,
                    "unique": is_unique,
                    "default": default_val
                })
        
        return columns
    
    @staticmethod
    def _find_primary_key(columns_str: str) -> Optional[str]:
        """Find primary key column"""
        pk_match = re.search(r'PRIMARY\s+KEY\s*\(\s*["\']?([\w]+)["\']?\s*\)', columns_str, re.IGNORECASE)
        if pk_match:
            return pk_match.group(1)
        return None
    
    @staticmethod
    def _find_foreign_keys(columns_str: str) -> List[Dict]:
        """Find foreign key relationships"""
        fks = []
        fk_pattern = r'FOREIGN\s+KEY\s*\(\s*["\']?([\w]+)["\']?\s*\)\s*REFERENCES\s+["\']?([\w]+)["\']?\s*\(\s*["\']?([\w]+)["\']?\s*\)'
        
        matches = re.findall(fk_pattern, columns_str, re.IGNORECASE)
        for match in matches:
            fks.append({
                "column": match[0],
                "references_table": match[1],
                "references_column": match[2]
            })
        
        return fks

# ============== OLLAMA CLIENT ==============

class OllamaClient:
    """Client untuk komunikasi dengan Ollama API"""
    
    def __init__(self, base_url: str = "http://localhost:11434"):
        self.base_url = base_url
        
    async def generate(self, prompt: str, model: str = "llama3") -> str:
        """Generate text using Ollama"""
        async with httpx.AsyncClient(timeout=120.0) as client:
            try:
                response = await client.post(
                    f"{self.base_url}/api/generate",
                    json={
                        "model": model,
                        "prompt": prompt,
                        "stream": False,
                        "options": {
                            "temperature": 0.7,
                            "top_p": 0.9
                        }
                    }
                )
                response.raise_for_status()
                result = response.json()
                return result.get("response", "")
            except httpx.ConnectError:
                raise HTTPException(
                    status_code=503,
                    detail="Ollama service tidak tersedia. Pastikan Ollama sudah running."
                )
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))
    
    async def check_health(self) -> bool:
        """Check if Ollama is running"""
        async with httpx.AsyncClient(timeout=5.0) as client:
            try:
                response = await client.get(f"{self.base_url}/api/tags")
                return response.status_code == 200
            except:
                return False

# ============== PROMPT BUILDER ==============

class PromptBuilder:
    """Build prompts for documentation generation"""
    
    @staticmethod
    def build_table_doc_prompt(
        table: TableInfo,
        language: str = "Indonesian",
        detail_level: str = "detailed",
        business_context: Optional[str] = None,
        custom_terms: Optional[List[CustomTerm]] = None
    ) -> str:
        """Build prompt for table documentation"""
        
        lang_instruction = "dalam Bahasa Indonesia" if language == "Indonesian" else "in English"
        
        # Format columns
        columns_text = ""
        for col in table.columns:
            nullable = "NULL" if col.get("nullable") else "NOT NULL"
            default = f", DEFAULT: {col.get('default')}" if col.get('default') else ""
            pk = " (PRIMARY KEY)" if col.get('primary_key') else ""
            unique = " (UNIQUE)" if col.get('unique') else ""
            columns_text += f"  - {col['name']}: {col['type']} {nullable}{default}{pk}{unique}\n"
        
        # Format foreign keys
        fk_text = ""
        if table.foreign_keys:
            for fk in table.foreign_keys:
                fk_text += f"  - {fk['column']} → {fk['references_table']}.{fk['references_column']}\n"
        else:
            fk_text = "  Tidak ada foreign key\n"
        
        # Custom terms section
        terms_text = ""
        if custom_terms:
            terms_text = "\nGlosarium istilah khusus:\n"
            for term in custom_terms:
                terms_text += f"  - {term.term}: {term.definition}\n"
        
        # Business context
        context_text = ""
        if business_context:
            context_text = f"\nKonteks Bisnis:\n{business_context}\n"
        
        prompt = f"""Kamu adalah seorang Database Documentation Expert. Buatkan dokumentasi {lang_instruction} untuk tabel database berikut:

=== INFORMASI TABEL ===
Nama Tabel: {table.name}

Kolom-kolom:
{columns_text}

Primary Key: {table.primary_key or 'Tidak ada'}

Foreign Keys:
{fk_text}
{context_text}
{terms_text}

=== INSTRUKSI ===
Buatkan dokumentasi dengan format berikut:

## Tabel: {table.name}

### Deskripsi
[Jelaskan tujuan dan fungsi tabel ini dalam sistem]

### Kolom-kolom
| Kolom | Tipe Data | Nullable | Deskripsi |
|-------|-----------|----------|-----------|
[Untuk setiap kolom, jelaskan fungsi dan isi datanya]

### Relasi
[Jelaskan hubungan dengan tabel lain jika ada foreign key]

### Contoh Query
[Berikan 2-3 contoh query yang umum digunakan]

### Catatan
[Tambahan informasi penting jika ada]

Pastikan dokumentasi lengkap, jelas, dan mudah dipahami.
"""
        return prompt

# ============== DOCUMENTATION GENERATOR ==============

class DocumentationGenerator:
    """Main class untuk generate dokumentasi"""
    
    def __init__(self):
        self.ollama = OllamaClient()
        self.parser = SQLParser()
        self.prompt_builder = PromptBuilder()
    
    async def generate(self, request: DocumentationRequest) -> GenerationResponse:
        """Generate full documentation"""
        
        # Parse SQL
        tables = self.parser.parse_create_table(request.sql_content)
        
        if not tables:
            return GenerationResponse(
                success=False,
                documentation="",
                tables_processed=0,
                message="Tidak ditemukan CREATE TABLE statement dalam SQL yang diberikan."
            )
        
        # Generate header
        doc_parts = [self._generate_header(request, len(tables))]
        
        # Generate documentation for each table
        for table in tables:
            prompt = self.prompt_builder.build_table_doc_prompt(
                table=table,
                language=request.language,
                detail_level=request.detail_level,
                business_context=request.business_context,
                custom_terms=request.custom_terms
            )
            
            try:
                table_doc = await self.ollama.generate(prompt)
                doc_parts.append(table_doc)
                doc_parts.append("\n---\n")
            except HTTPException as e:
                # Fallback: generate basic documentation without AI
                basic_doc = self._generate_basic_doc(table)
                doc_parts.append(basic_doc)
                doc_parts.append("\n---\n")
        
        full_documentation = "\n".join(doc_parts)
        
        return GenerationResponse(
            success=True,
            documentation=full_documentation,
            tables_processed=len(tables),
            message=f"Berhasil generate dokumentasi untuk {len(tables)} tabel."
        )
    
    def _generate_header(self, request: DocumentationRequest, table_count: int) -> str:
        """Generate document header"""
        return f"""# {request.project_name}

{request.project_description or 'Dokumentasi Database'}

- **Author**: {request.author or 'Auto-generated'}
- **Total Tabel**: {table_count}
- **Generated**: Auto-generated by SQL Docs Generator

---

"""
    
    def _generate_basic_doc(self, table: TableInfo) -> str:
        """Generate basic documentation without AI (fallback)"""
        doc = f"## Tabel: {table.name}\n\n"
        doc += "### Kolom-kolom\n\n"
        doc += "| Kolom | Tipe Data | Nullable | Keterangan |\n"
        doc += "|-------|-----------|----------|------------|\n"
        
        for col in table.columns:
            nullable = "Ya" if col.get("nullable") else "Tidak"
            keterangan = []
            if col.get("primary_key"):
                keterangan.append("Primary Key")
            if col.get("unique"):
                keterangan.append("Unique")
            if col.get("default"):
                keterangan.append(f"Default: {col.get('default')}")
            
            doc += f"| {col['name']} | {col['type']} | {nullable} | {', '.join(keterangan) or '-'} |\n"
        
        if table.foreign_keys:
            doc += "\n### Foreign Keys\n\n"
            for fk in table.foreign_keys:
                doc += f"- `{fk['column']}` → `{fk['references_table']}.{fk['references_column']}`\n"
        
        return doc

# ============== API ENDPOINTS ==============

generator = DocumentationGenerator()
ollama_client = OllamaClient()

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "SQL Docs Generator API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    """Check service health"""
    ollama_status = await ollama_client.check_health()
    return {
        "api": "healthy",
        "ollama": "connected" if ollama_status else "disconnected"
    }

@app.post("/api/generate", response_model=GenerationResponse)
async def generate_documentation(request: DocumentationRequest):
    """
    Generate database documentation from SQL DDL
    
    - **sql_content**: SQL CREATE TABLE statements
    - **project_name**: Name of the project/database
    - **language**: Output language (Indonesian/English)
    - **output_format**: markdown or html
    - **business_context**: Optional business context for better AI understanding
    - **custom_terms**: Optional list of domain-specific terms
    """
    return await generator.generate(request)

@app.post("/api/parse")
async def parse_sql(sql_content: str):
    """Parse SQL and return extracted table information"""
    parser = SQLParser()
    tables = parser.parse_create_table(sql_content)
    return {
        "tables_found": len(tables),
        "tables": [t.dict() for t in tables]
    }

@app.get("/api/models")
async def list_models():
    """List available Ollama models"""
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            response = await client.get("http://localhost:11434/api/tags")
            if response.status_code == 200:
                return response.json()
            return {"models": []}
        except:
            return {"models": [], "error": "Ollama not available"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
