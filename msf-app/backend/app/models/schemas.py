"""
Pydantic schemas — semua request/response models untuk MSF-APP API
"""

from pydantic import BaseModel, Field, field_validator
from typing import Optional, List, Literal
from enum import Enum


# ================================================================
# ENUMS
# ================================================================

class OutputLanguage(str, Enum):
    INDONESIAN = "Indonesian"
    ENGLISH = "English"


class DetailLevel(str, Enum):
    SIMPLE = "simple"
    DETAILED = "detailed"
    COMPREHENSIVE = "comprehensive"


class AIProviderType(str, Enum):
    OLLAMA = "ollama"
    DEEPSEEK = "deepseek"
    OPENAI = "openai"


class DBEngine(str, Enum):
    POSTGRESQL = "postgresql"
    MYSQL = "mysql"
    SQLITE = "sqlite"
    SQLSERVER = "sqlserver"
    MONGODB = "mongodb"


class ExportFormat(str, Enum):
    DOCX = "docx"
    PDF = "pdf"


class JobStatus(str, Enum):
    QUEUED = "queued"
    PROCESSING = "processing"
    DONE = "done"
    ERROR = "error"


class RiskLevel(str, Enum):
    SAFE = "safe"
    READ_ONLY = "read-only"
    CAUTION = "caution"
    DANGEROUS = "dangerous"


# ================================================================
# DATABASE CONNECTION
# ================================================================

class DBConnection(BaseModel):
    engine: DBEngine
    # Opsi A: Form manual
    host: Optional[str] = "localhost"
    port: Optional[int] = None
    database: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None
    schema_name: Optional[str] = "public"
    # Opsi B: Connection string langsung
    connection_string: Optional[str] = None

    @field_validator("port", mode="before")
    @classmethod
    def set_default_port(cls, v, info):
        if v is not None:
            return v
        # Default port akan diset di db_connector berdasarkan engine
        return v

    model_config = {"use_enum_values": True}


class DBTestConnectionRequest(BaseModel):
    connection: DBConnection


class DBTestConnectionResponse(BaseModel):
    success: bool
    message: str
    engine: str
    server_version: Optional[str] = None
    tables_count: Optional[int] = None


# ================================================================
# METADATA MODELS
# ================================================================

class ColumnMetadata(BaseModel):
    name: str
    data_type: str
    is_nullable: bool = True
    default_value: Optional[str] = None
    max_length: Optional[int] = None
    is_primary_key: bool = False
    is_foreign_key: bool = False
    column_comment: Optional[str] = None


class ForeignKeyMetadata(BaseModel):
    column: str
    references_table: str
    references_column: str
    on_delete: Optional[str] = None
    on_update: Optional[str] = None


class IndexMetadata(BaseModel):
    name: str
    columns: List[str]
    is_unique: bool = False
    index_type: Optional[str] = None


class TableMetadata(BaseModel):
    name: str
    schema: str = "public"
    columns: List[ColumnMetadata] = []
    primary_key: List[str] = []
    foreign_keys: List[ForeignKeyMetadata] = []
    indexes: List[IndexMetadata] = []
    row_count: Optional[int] = None
    table_comment: Optional[str] = None


class ViewMetadata(BaseModel):
    name: str
    schema: str = "public"
    definition: Optional[str] = None


class FunctionMetadata(BaseModel):
    name: str
    schema: str = "public"
    language: Optional[str] = None
    return_type: Optional[str] = None
    description: Optional[str] = None


class DBMetadataResponse(BaseModel):
    engine: str
    database: str
    schema: str
    tables: List[TableMetadata] = []
    views: List[ViewMetadata] = []
    functions: List[FunctionMetadata] = []


# ================================================================
# GENERATE REQUEST / RESPONSE
# ================================================================

class GenerateSettings(BaseModel):
    language: OutputLanguage = OutputLanguage.INDONESIAN
    detail_level: DetailLevel = DetailLevel.DETAILED
    ai_provider: AIProviderType = AIProviderType.OLLAMA
    model: str = "llama3.2"
    output_format: ExportFormat = ExportFormat.DOCX
    project_name: str = Field(default="Database Documentation", max_length=200)
    project_description: Optional[str] = Field(default=None, max_length=1000)
    author: Optional[str] = Field(default=None, max_length=100)
    business_context: Optional[str] = Field(default=None, max_length=2000)

    model_config = {"use_enum_values": True}


class GenerateFromDDLRequest(GenerateSettings):
    sql_content: str = Field(..., min_length=10, description="SQL DDL (CREATE TABLE statements)")


class GenerateFromDBRequest(GenerateSettings):
    connection: DBConnection
    include_views: bool = False
    include_functions: bool = False
    schema_filter: Optional[str] = None
    table_filter: Optional[List[str]] = None


class GenerateJobResponse(BaseModel):
    job_id: str
    status: JobStatus
    created_at: str
    estimated_seconds: Optional[int] = None


class JobStatusResponse(BaseModel):
    job_id: str
    status: JobStatus
    progress: int = Field(default=0, ge=0, le=100)
    tables_total: int = 0
    tables_processed: int = 0
    current_table: Optional[str] = None
    created_at: str
    updated_at: str
    completed_at: Optional[str] = None
    error_message: Optional[str] = None
    preview_markdown: Optional[str] = None
    download_url: Optional[str] = None
    project_name: Optional[str] = None


# ================================================================
# AI PROVIDER
# ================================================================

class AIModelInfo(BaseModel):
    name: str
    size: Optional[str] = None
    modified_at: Optional[str] = None


class AIModelsResponse(BaseModel):
    provider: str
    is_available: bool
    models: List[AIModelInfo] = []
    error: Optional[str] = None


class AIProviderInfo(BaseModel):
    name: str
    label: str
    is_available: bool
    base_url: Optional[str] = None
    reason: Optional[str] = None


class AITestResponse(BaseModel):
    provider: str
    success: bool
    message: str
    latency_ms: Optional[float] = None


# ================================================================
# SHORTCUTS
# ================================================================

class ShortcutItem(BaseModel):
    id: str
    title: str
    engine: str
    category: str
    risk_level: RiskLevel
    sql: str
    description: str
    tags: List[str] = []
    version_min: Optional[str] = None
    notes: Optional[str] = None

    model_config = {"use_enum_values": True}


class ShortcutsResponse(BaseModel):
    total: int
    items: List[ShortcutItem]


# ================================================================
# EXPORT
# ================================================================

class ExportRequest(BaseModel):
    markdown_content: str = Field(..., min_length=1)
    project_name: str = Field(default="Database Documentation", max_length=200)
    author: Optional[str] = None
    language: OutputLanguage = OutputLanguage.INDONESIAN

    model_config = {"use_enum_values": True}


# ================================================================
# HEALTH CHECK
# ================================================================

class ServiceStatus(BaseModel):
    api: str = "up"
    ollama: str = "unknown"
    ollama_model: Optional[str] = None


class HealthResponse(BaseModel):
    status: Literal["healthy", "degraded", "down"]
    services: ServiceStatus
    version: str = "2.0.0"


# ================================================================
# ERROR
# ================================================================

class ErrorResponse(BaseModel):
    detail: str
    error_code: Optional[str] = None
    timestamp: Optional[str] = None
