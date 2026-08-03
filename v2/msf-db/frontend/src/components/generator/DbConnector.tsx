"use client";

import { useState } from "react";
import { DBConnection, DBEngine, DBTestConnectionResponse } from "@/lib/types";
import { api, getFriendlyErrorMessage } from "@/lib/api";
import { Link2, Play, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DbConnectorProps {
  connection: DBConnection;
  onChange: (conn: DBConnection) => void;
  onVerified: (isVerified: boolean) => void;
  schemaFilter?: string;
  onSchemaFilterChange?: (schema: string) => void;
  tableFilter?: string[];
  onTableFilterChange?: (tables: string[]) => void;
}

export default function DbConnector({
  connection,
  onChange,
  onVerified,
  schemaFilter = "",
  onSchemaFilterChange,
  tableFilter = [],
  onTableFilterChange,
}: DbConnectorProps) {
  const [useConnString, setUseConnString] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<DBTestConnectionResponse | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const engines: { label: string; value: DBEngine; defaultPort: number }[] = [
    { label: "PostgreSQL", value: "postgresql", defaultPort: 5432 },
    { label: "MySQL / MariaDB", value: "mysql", defaultPort: 3306 },
    { label: "SQLite (Local File)", value: "sqlite", defaultPort: 0 },
    { label: "SQL Server", value: "sqlserver", defaultPort: 1433 },
    { label: "MongoDB", value: "mongodb", defaultPort: 27017 },
  ];

  const handleFieldChange = (key: keyof DBConnection, val: any) => {
    onVerified(false);
    setTestResult(null);
    onSchemaFilterChange?.("");
    onTableFilterChange?.([]);
    setSearchTerm("");
    onChange({
      ...connection,
      [key]: val,
    });
  };

  const handleEngineChange = (engine: DBEngine) => {
    onVerified(false);
    setTestResult(null);
    onSchemaFilterChange?.("");
    onTableFilterChange?.([]);
    setSearchTerm("");
    const selected = engines.find((e) => e.value === engine);
    onChange({
      ...connection,
      engine,
      port: selected?.defaultPort || undefined,
      host: engine === "sqlite" ? undefined : "localhost",
      connection_string: engine === "sqlite" ? "sqlite:///data.db" : "",
    });
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await api.testDBConnection(connection);
      setTestResult(res);

      if (res.success) {
        onVerified(true);
        toast.success("Koneksi database berhasil!");
        
        const defaultSchema = res.schemas && res.schemas.length > 0
          ? (res.schemas.includes(connection.schema_name || "") ? connection.schema_name || "" : res.schemas[0])
          : (connection.schema_name || "public");
        
        onSchemaFilterChange?.(defaultSchema);
        onTableFilterChange?.([]);
      } else {
        onVerified(false);
        toast.error(`Koneksi gagal: ${res.message}`);
      }
    } catch (err: any) {
      const friendlyMsg = getFriendlyErrorMessage(err);
      setTestResult({
        success: false,
        message: friendlyMsg,
        engine: connection.engine,
      });
      onVerified(false);
      toast.error(`Error: ${friendlyMsg}`);
    } finally {
      setTesting(false);
    }
  };

  const currentSchema = schemaFilter || connection.schema_name || (testResult?.schemas && testResult.schemas.length > 0 ? testResult.schemas[0] : "public");
  const tablesInSchema = testResult?.tables_by_schema?.[currentSchema] || [];
  const filteredTables = tablesInSchema.filter((table) =>
    table.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 bg-white border border-border p-6 rounded-2xl shadow-sm">
      <div>
        <h3 className="text-xs font-mono font-bold text-gray-900 uppercase tracking-widest mb-1">
          LIVE DATABASE CONNECTION
        </h3>
        <p className="text-xs text-muted-foreground leading-normal">
          Connect directly to a live running database to extract the schema metadata.
        </p>
      </div>

      {/* Engine Selection */}
      <div className="space-y-2">
        <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest block">
          DATABASE ENGINE
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {engines.map((e) => (
            <button
              key={e.value}
              type="button"
              onClick={() => handleEngineChange(e.value)}
              className={cn(
                "py-2 px-3 rounded-xl border font-mono font-semibold text-xs transition-colors duration-150 text-center",
                connection.engine === e.value
                  ? "bg-accent/10 border-accent text-accent"
                  : "bg-gray-50 border-border hover:border-accent/40 text-muted-foreground hover:text-gray-900"
              )}
            >
              {e.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs: Manual vs Connection String */}
      {connection.engine !== "sqlite" && (
        <div className="flex border-b border-border text-xs shrink-0">
          <button
            type="button"
            onClick={() => setUseConnString(false)}
            className={cn(
              "px-4 py-2 font-mono font-semibold border-b-2 -mb-[2px] transition-all duration-150",
              !useConnString
                ? "border-accent text-accent font-bold"
                : "border-transparent text-muted-foreground hover:text-gray-900"
            )}
          >
            MANUAL FORM
          </button>
          <button
            type="button"
            onClick={() => setUseConnString(true)}
            className={cn(
              "px-4 py-2 font-mono font-semibold border-b-2 -mb-[2px] transition-all duration-150",
              useConnString
                ? "border-accent text-accent font-bold"
                : "border-transparent text-muted-foreground hover:text-gray-900"
            )}
          >
            CONNECTION STRING
          </button>
        </div>
      )}

      {/* Form Fields */}
      {connection.engine === "sqlite" ? (
        <div className="space-y-2">
          <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest block">
            SQLITE DATABASE FILE PATH
          </label>
          <div className="relative">
            <Link2 className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground/60" />
            <input
              type="text"
              value={connection.connection_string || ""}
              onChange={(e) => handleFieldChange("connection_string", e.target.value)}
              placeholder="sqlite:///C:/path/to/data.db or sqlite:///data.db"
              className="w-full bg-gray-50/50 border-l-2 border-b border-t-0 border-r-0 border-border focus:border-l-accent focus:border-b-accent rounded-none py-2.5 pl-10 pr-4 text-xs text-gray-900 placeholder-muted-foreground/60 focus:outline-none transition-colors duration-150 font-mono"
            />
          </div>
          <p className="text-[10px] text-muted-foreground/80 leading-normal font-mono">
            Gunakan format string SQLAlchemy standard `sqlite:///path/to/database.db`
          </p>
        </div>
      ) : useConnString ? (
        <div className="space-y-2">
          <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest block">
            CONNECTION STRING URI
          </label>
          <div className="relative">
            <Link2 className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground/60" />
            <input
              type="text"
              value={connection.connection_string || ""}
              onChange={(e) => handleFieldChange("connection_string", e.target.value)}
              placeholder={
                connection.engine === "postgresql"
                  ? "postgresql://user:password@localhost:5432/dbname"
                  : "mysql+pymysql://user:password@localhost:3306/dbname"
              }
              className="w-full bg-gray-50/50 border-l-2 border-b border-t-0 border-r-0 border-border focus:border-l-accent focus:border-b-accent rounded-none py-2.5 pl-10 pr-4 text-xs text-gray-900 placeholder-muted-foreground/60 focus:outline-none transition-colors duration-150 font-mono"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5 col-span-2 sm:col-span-1">
            <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest block">HOST</label>
            <input
              type="text"
              value={connection.host || ""}
              onChange={(e) => handleFieldChange("host", e.target.value)}
              placeholder="localhost"
              className="w-full bg-gray-50/50 border-l-2 border-b border-t-0 border-r-0 border-border focus:border-l-accent focus:border-b-accent rounded-none py-2.5 px-3.5 text-xs text-gray-900 focus:outline-none transition-colors duration-150 font-mono"
            />
          </div>

          <div className="space-y-1.5 col-span-2 sm:col-span-1">
            <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest block">PORT</label>
            <input
              type="number"
              value={connection.port || ""}
              onChange={(e) => handleFieldChange("port", e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="5432"
              className="w-full bg-gray-50/50 border-l-2 border-b border-t-0 border-r-0 border-border focus:border-l-accent focus:border-b-accent rounded-none py-2.5 px-3.5 text-xs text-gray-900 focus:outline-none transition-colors duration-150 font-mono"
            />
          </div>

          <div className="space-y-1.5 col-span-2 sm:col-span-1">
            <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest block">DATABASE NAME</label>
            <input
              type="text"
              value={connection.database || ""}
              onChange={(e) => handleFieldChange("database", e.target.value)}
              placeholder="my_database"
              className="w-full bg-gray-50/50 border-l-2 border-b border-t-0 border-r-0 border-border focus:border-l-accent focus:border-b-accent rounded-none py-2.5 px-3.5 text-xs text-gray-900 focus:outline-none transition-colors duration-150 font-mono"
            />
          </div>

          {connection.engine === "postgresql" && (
            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest block">SCHEMA</label>
              <input
                type="text"
                value={connection.schema_name || ""}
                onChange={(e) => handleFieldChange("schema_name", e.target.value)}
                placeholder="public"
                className="w-full bg-gray-50/50 border-l-2 border-b border-t-0 border-r-0 border-border focus:border-l-accent focus:border-b-accent rounded-none py-2.5 px-3.5 text-xs text-gray-900 focus:outline-none transition-colors duration-150 font-mono"
              />
            </div>
          )}

          <div className="space-y-1.5 col-span-2 sm:col-span-1">
            <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest block">USERNAME</label>
            <input
              type="text"
              value={connection.username || ""}
              onChange={(e) => handleFieldChange("username", e.target.value)}
              placeholder="postgres"
              className="w-full bg-gray-50/50 border-l-2 border-b border-t-0 border-r-0 border-border focus:border-l-accent focus:border-b-accent rounded-none py-2.5 px-3.5 text-xs text-gray-900 focus:outline-none transition-colors duration-150 font-mono"
            />
          </div>

          <div className="space-y-1.5 col-span-2 sm:col-span-1">
            <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest block">PASSWORD</label>
            <input
              type="password"
              value={connection.password || ""}
              onChange={(e) => handleFieldChange("password", e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-50/50 border-l-2 border-b border-t-0 border-r-0 border-border focus:border-l-accent focus:border-b-accent rounded-none py-2.5 px-3.5 text-xs text-gray-900 focus:outline-none transition-colors duration-150 font-mono"
            />
          </div>
        </div>
      )}

      {/* Action panel & Test results */}
      <div className="pt-4 flex flex-col gap-4 border-t border-border">
        <div className="flex justify-between items-center">
          <span className="text-[11px] text-muted-foreground font-mono uppercase tracking-wider">
            {testResult?.success ? (
              <span className="text-accent flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="h-4 w-4 text-accent" /> READY TO GENERATE
              </span>
            ) : testResult ? (
              <span className="text-red-600 flex items-center gap-1.5 font-bold">
                <XCircle className="h-4 w-4 text-red-600" /> VERIFICATION FAILED
              </span>
            ) : (
              <span className="font-semibold text-gray-600">NOT VERIFIED</span>
            )}
          </span>

          <button
            type="button"
            disabled={testing}
            onClick={handleTestConnection}
            className="px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-border hover:border-accent/40 font-mono font-bold text-xs text-gray-700 flex items-center gap-2 transition-colors duration-150 disabled:opacity-50 shadow-sm"
          >
            {testing ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>VERIFYING...</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 text-accent" />
                <span>TEST CONNECTION</span>
              </>
            )}
          </button>
        </div>

        {/* Diagnosis details */}
        {testResult && (
          <div
            className={cn(
              "p-3.5 rounded-xl border text-[11px] font-medium leading-relaxed font-mono",
              testResult.success
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-red-50 border-red-200 text-red-800"
            )}
          >
            <div className="font-bold mb-1">
              {testResult.success ? "✅ CONNECTION SUCCESSFUL" : "❌ CONNECTION FAILED"}
            </div>
            <div>{testResult.message}</div>
            {testResult.success && (
              <div className="mt-1.5 pt-1.5 border-t border-emerald-200 flex justify-between">
                <span>VERSION: {testResult.server_version || "Unknown"}</span>
                <span>TABLES FOUND: {testResult.tables_count ?? 0}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Schema and Table selection checklist */}
      {testResult?.success && (
        <div className="space-y-4 pt-4 border-t border-border">
          <div className="flex flex-col gap-1">
            <h4 className="text-xs font-mono font-bold text-gray-900 uppercase tracking-widest">
              FILTER METADATA
            </h4>
            <p className="text-[10px] text-muted-foreground leading-normal">
              Pilih schema dan tabel spesifik yang ingin didokumentasikan untuk mempercepat proses generator.
            </p>
          </div>

          {/* Schema Selector */}
          {testResult.schemas && testResult.schemas.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest block">
                PILIH SCHEMA
              </label>
              <select
                value={currentSchema}
                onChange={(e) => {
                  const newSchema = e.target.value;
                  onSchemaFilterChange?.(newSchema);
                  onTableFilterChange?.([]);
                  setSearchTerm("");
                }}
                className="w-full bg-white border-l-2 border-b border-t-0 border-r-0 border-border focus:border-l-accent focus:border-b-accent rounded-none py-2 px-3 text-xs text-gray-900 focus:outline-none transition-colors duration-150 font-mono cursor-pointer font-bold"
              >
                {testResult.schemas.map((schema) => (
                  <option key={schema} value={schema} className="bg-white text-gray-900">
                    {schema}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Table Checklist */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest block">
                PILIH TABEL ({tableFilter?.length || 0} TERPILIH)
              </label>
              <div className="text-[10px] text-muted-foreground font-mono">
                TOTAL: {tablesInSchema.length} TABEL
              </div>
            </div>

            {tablesInSchema.length > 0 ? (
              <div className="space-y-2.5">
                {/* Search & Select Actions */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cari nama tabel..."
                    className="flex-1 bg-gray-50/50 border-l-2 border-b border-t-0 border-r-0 border-border focus:border-l-accent focus:border-b-accent rounded-none py-1.5 px-3 text-xs text-gray-900 placeholder-muted-foreground/60 focus:outline-none transition-colors duration-150 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      onTableFilterChange?.([...tablesInSchema]);
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-gray-50 border border-border font-mono font-bold text-[10px] text-accent hover:text-accent/80 transition-colors duration-150 shadow-sm"
                  >
                    ALL
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onTableFilterChange?.([]);
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-gray-50 border border-border font-mono font-bold text-[10px] text-muted-foreground hover:text-gray-900 transition-colors duration-150 shadow-sm"
                  >
                    CLEAR
                  </button>
                </div>

                {/* Table List Container */}
                <div className="max-h-52 overflow-y-auto space-y-0.5 border border-border rounded-xl p-1.5 bg-gray-50/30 scrollbar-thin scrollbar-thumb-accent/20">
                  {filteredTables.length > 0 ? (
                    filteredTables.map((table) => {
                      const isChecked = tableFilter?.includes(table) || false;
                      return (
                        <label
                           key={table}
                           className={cn(
                             "flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer transition-colors duration-150 text-xs font-mono",
                             isChecked
                               ? "bg-accent/10 text-accent font-semibold"
                               : "text-muted-foreground hover:text-gray-900 hover:bg-gray-100/50"
                           )}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                                if (e.target.checked) {
                                  onTableFilterChange?.([...(tableFilter || []), table]);
                                } else {
                                  onTableFilterChange?.(
                                    (tableFilter || []).filter((t) => t !== table)
                                  );
                                }
                            }}
                            className="rounded border-border text-accent focus:ring-accent/30 h-3.5 w-3.5 cursor-pointer accent-accent"
                          />
                          <span className="truncate">{table}</span>
                        </label>
                      );
                    })
                  ) : (
                    <div className="py-8 text-center text-xs text-muted-foreground font-mono font-semibold">
                      TIDAK ADA TABEL YANG COCOK.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-muted-foreground/80 border border-dashed border-border rounded-xl font-mono font-semibold">
                TIDAK ADA TABEL DI SCHEMA "{currentSchema}".
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
