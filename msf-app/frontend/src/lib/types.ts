export type JobStatus = "queued" | "processing" | "done" | "error" | "cancelled";

export type DetailLevel = "simple" | "detailed" | "comprehensive";

export type OutputLanguage = "Indonesian" | "English";

export type InputMode = "ddl" | "database";

export type AIProvider = "ollama" | "deepseek" | "openai";

export type DBEngine = "postgresql" | "mysql" | "sqlite" | "sqlserver" | "mongodb";

export type ExportFormat = "docx" | "pdf";

export interface GenerateFromDDLRequest {
  sql_content: string;
  project_name?: string;
  project_description?: string;
  author?: string;
  language: OutputLanguage;
  detail_level: DetailLevel;
  business_context?: string;
  ai_provider: AIProvider;
  model: string;
  output_format: ExportFormat;
}

export interface GenerateFromDBRequest {
  connection: DBConnection;
  project_name?: string;
  language: OutputLanguage;
  detail_level: DetailLevel;
  business_context?: string;
  ai_provider: AIProvider;
  model: string;
  output_format: ExportFormat;
  include_views?: boolean;
  include_functions?: boolean;
  schema_filter?: string;
  table_filter?: string[];
}

export interface DBConnection {
  engine: DBEngine;
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
  schema_name?: string;
  connection_string?: string;
}

export interface GenerateJobResponse {
  job_id: string;
  status: JobStatus;
  created_at: string;
  estimated_seconds?: number;
}

export interface JobStatusResponse {
  job_id: string;
  status: JobStatus;
  progress: number;
  tables_total: number;
  tables_processed: number;
  current_table?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  error_message?: string;
  preview_markdown?: string;
  download_url?: string;
  access_code?: string;
}

export interface AIModelsResponse {
  provider: AIProvider;
  models: AIModelInfo[];
  is_available: boolean;
}

export interface AIModelInfo {
  name: string;
  size?: string;
  modified_at?: string;
}

export interface ShortcutItem {
  id: string;
  title: string;
  engine: DBEngine;
  category: string;
  risk_level: "safe" | "read-only" | "caution" | "dangerous";
  sql: string;
  description: string;
  tags: string[];
  version_min?: string;
  notes?: string;
}

export interface ShortcutsResponse {
  total: number;
  items: ShortcutItem[];
}

export interface DBTestConnectionResponse {
  success: boolean;
  message: string;
  engine: DBEngine;
  server_version?: string;
  tables_count?: number;
  schemas?: string[];
  tables_by_schema?: Record<string, string[]>;
}

export interface DBMetadataResponse {
  engine: DBEngine;
  database: string;
  schema: string;
  tables: TableMetadata[];
  views?: ViewMetadata[];
  functions?: FunctionMetadata[];
}

export interface TableMetadata {
  name: string;
  schema: string;
  columns: ColumnMetadata[];
  primary_key?: string[];
  foreign_keys: ForeignKeyMetadata[];
  indexes: IndexMetadata[];
  row_count?: number;
  table_comment?: string;
}

export interface ColumnMetadata {
  name: string;
  data_type: string;
  is_nullable: boolean;
  default_value?: string;
  max_length?: number;
  is_primary_key: boolean;
  is_foreign_key: boolean;
  column_comment?: string;
}

export interface ForeignKeyMetadata {
  column: string;
  references_table: string;
  references_column: string;
  on_delete?: string;
  on_update?: string;
}

export interface IndexMetadata {
  name: string;
  columns: string[];
  is_unique: boolean;
  index_type?: string;
}

export interface ViewMetadata {
  name: string;
  schema: string;
  definition?: string;
}

export interface FunctionMetadata {
  name: string;
  schema: string;
  language?: string;
  return_type?: string;
}

export interface GeneratorSettings {
  language: OutputLanguage;
  detail_level: DetailLevel;
  ai_provider: AIProvider;
  model: string;
  output_format: ExportFormat;
  business_context: string;
  project_name: string;
  author: string;
}

export interface ActiveJob {
  job_id: string;
  project_name: string;
  status: JobStatus;
  started_at: string;
}

export interface TablePosition {
  id: string;
  x: number;
  y: number;
}

