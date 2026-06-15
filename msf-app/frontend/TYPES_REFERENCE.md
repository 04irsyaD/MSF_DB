# ==============================================================
# MSF-APP — TypeScript Types & Interfaces
# Semua type yang dipakai di seluruh frontend
# ==============================================================

# ---- GENERATE / JOB ----

type JobStatus = "queued" | "processing" | "done" | "error"

type DetailLevel = "simple" | "detailed" | "comprehensive"

type OutputLanguage = "Indonesian" | "English"

type InputMode = "ddl" | "database"

type AIProvider = "ollama" | "deepseek" | "openai"

type DBEngine = "postgresql" | "mysql" | "sqlite" | "sqlserver" | "mongodb"

type ExportFormat = "docx" | "pdf"

# ---- API REQUEST SHAPES ----

interface GenerateFromDDLRequest {
  sql_content: string
  project_name?: string
  project_description?: string
  author?: string
  language: OutputLanguage
  detail_level: DetailLevel
  business_context?: string
  ai_provider: AIProvider
  model: string
  output_format: ExportFormat
}

interface GenerateFromDBRequest {
  connection: DBConnection
  project_name?: string
  language: OutputLanguage
  detail_level: DetailLevel
  business_context?: string
  ai_provider: AIProvider
  model: string
  output_format: ExportFormat
  include_views?: boolean
  include_functions?: boolean
  schema_filter?: string       # Filter hanya schema tertentu
  table_filter?: string[]      # Filter hanya tabel tertentu
}

interface DBConnection {
  engine: DBEngine
  # Opsi A: Form manual
  host?: string
  port?: number
  database?: string
  username?: string
  password?: string
  schema_name?: string
  # Opsi B: Connection string
  connection_string?: string
}

# ---- API RESPONSE SHAPES ----

interface GenerateJobResponse {
  job_id: string
  status: JobStatus
  created_at: string
  estimated_seconds?: number
}

interface JobStatusResponse {
  job_id: string
  status: JobStatus
  progress: number             # 0-100
  tables_total: number
  tables_processed: number
  current_table?: string       # Tabel yang sedang diproses
  created_at: string
  updated_at: string
  completed_at?: string
  error_message?: string
  preview_markdown?: string    # Preview sebagian hasil (untuk display)
  download_url?: string        # URL download saat status=done
}

interface AIModelsResponse {
  provider: AIProvider
  models: AIModelInfo[]
  is_available: boolean
}

interface AIModelInfo {
  name: string
  size?: string
  modified_at?: string
}

interface ShortcutItem {
  id: string
  title: string
  engine: DBEngine
  category: string
  risk_level: "safe" | "read-only" | "caution" | "dangerous"
  sql: string
  description: string
  tags: string[]
  version_min?: string
  notes?: string
}

interface DBTestConnectionResponse {
  success: boolean
  message: string
  engine: DBEngine
  server_version?: string
  tables_count?: number
}

interface DBMetadataResponse {
  engine: DBEngine
  database: string
  schema: string
  tables: TableMetadata[]
  views?: ViewMetadata[]
  functions?: FunctionMetadata[]
}

interface TableMetadata {
  name: string
  schema: string
  columns: ColumnMetadata[]
  primary_key?: string[]
  foreign_keys: ForeignKeyMetadata[]
  indexes: IndexMetadata[]
  row_count?: number
  table_comment?: string
}

interface ColumnMetadata {
  name: string
  data_type: string
  is_nullable: boolean
  default_value?: string
  max_length?: number
  is_primary_key: boolean
  is_foreign_key: boolean
  column_comment?: string
}

interface ForeignKeyMetadata {
  column: string
  references_table: string
  references_column: string
  on_delete?: string
  on_update?: string
}

interface IndexMetadata {
  name: string
  columns: string[]
  is_unique: boolean
  index_type?: string
}

interface ViewMetadata {
  name: string
  schema: string
  definition?: string
}

interface FunctionMetadata {
  name: string
  schema: string
  language?: string
  return_type?: string
}

# ---- UI STATE ----

interface GeneratorSettings {
  language: OutputLanguage
  detail_level: DetailLevel
  ai_provider: AIProvider
  model: string
  output_format: ExportFormat
  business_context: string
  project_name: string
  author: string
}

interface ActiveJob {
  job_id: string
  project_name: string
  status: JobStatus
  started_at: string
}
