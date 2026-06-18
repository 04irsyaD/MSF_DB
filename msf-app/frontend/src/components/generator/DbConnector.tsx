"use client";

import { useState } from "react";
import { DBConnection, DBEngine } from "@/lib/types";
import { api } from "@/lib/api";
import { Link2, Play, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DbConnectorProps {
  connection: DBConnection;
  onChange: (conn: DBConnection) => void;
  onVerified: (isVerified: boolean) => void;
}

export default function DbConnector({ connection, onChange, onVerified }: DbConnectorProps) {
  const [useConnString, setUseConnString] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    server_version?: string;
    tables_count?: number;
  } | null>(null);

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
    onChange({
      ...connection,
      [key]: val,
    });
  };

  const handleEngineChange = (engine: DBEngine) => {
    onVerified(false);
    setTestResult(null);
    const selected = engines.find((e) => e.value === engine);
    onChange({
      ...connection,
      engine,
      port: selected?.defaultPort || undefined,
      host: engine === "sqlite" ? undefined : "localhost",
      // default path for sqlite if selected
      connection_string: engine === "sqlite" ? "sqlite:///data.db" : "",
    });
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await api.testDBConnection(connection);
      setTestResult({
        success: res.success,
        message: res.message,
        server_version: res.server_version,
        tables_count: res.tables_count,
      });

      if (res.success) {
        onVerified(true);
        toast.success("Koneksi database berhasil!");
      } else {
        onVerified(false);
        toast.error(`Koneksi gagal: ${res.message}`);
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || "Failed to reach backend api",
      });
      onVerified(false);
      toast.error(`Error: ${err.message}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6 bg-card/40 backdrop-blur-md border border-border p-6 rounded-2xl">
      <div>
        <h3 className="text-sm font-bold text-white mb-1">Live Database Connection</h3>
        <p className="text-xs text-muted-foreground leading-normal">
          Connect directly to a live running database to extract the schema metadata.
        </p>
      </div>

      {/* Engine Selection */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
          Database Engine
        </label>
        <div className="grid grid-cols-3 gap-2">
          {engines.map((e) => (
            <button
              key={e.value}
              type="button"
              onClick={() => handleEngineChange(e.value)}
              className={cn(
                "py-2 px-3 rounded-xl border font-semibold text-xs transition-all duration-200",
                connection.engine === e.value
                  ? "bg-indigo-600/10 border-indigo-500 text-indigo-400 shadow-md shadow-indigo-500/5"
                  : "bg-secondary/20 border-border hover:bg-secondary/40 text-muted-foreground hover:text-foreground"
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
              "px-4 py-2 font-semibold border-b-2 -mb-[2px] transition-all",
              !useConnString
                ? "border-indigo-500 text-indigo-400 font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            Manual Form
          </button>
          <button
            type="button"
            onClick={() => setUseConnString(true)}
            className={cn(
              "px-4 py-2 font-semibold border-b-2 -mb-[2px] transition-all",
              useConnString
                ? "border-indigo-500 text-indigo-400 font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            Connection String
          </button>
        </div>
      )}

      {/* Form Fields */}
      {connection.engine === "sqlite" ? (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
            SQLite Database File Path or Connection URL
          </label>
          <div className="relative">
            <Link2 className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground/60" />
            <input
              type="text"
              value={connection.connection_string || ""}
              onChange={(e) => handleFieldChange("connection_string", e.target.value)}
              placeholder="sqlite:///C:/path/to/data.db or sqlite:///data.db"
              className="w-full bg-secondary/20 border border-border focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/30 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-muted-foreground/60 focus:outline-none transition-all font-mono"
            />
          </div>
          <p className="text-[10px] text-muted-foreground/80 leading-normal">
            Gunakan format string SQLAlchemy standard `sqlite:///path/to/database.db`
          </p>
        </div>
      ) : useConnString ? (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
            Connection String URI
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
              className="w-full bg-secondary/20 border border-border focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/30 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-muted-foreground/60 focus:outline-none transition-all font-mono"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5 col-span-2 sm:col-span-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Host</label>
            <input
              type="text"
              value={connection.host || ""}
              onChange={(e) => handleFieldChange("host", e.target.value)}
              placeholder="localhost"
              className="w-full bg-secondary/20 border border-border focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/30 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5 col-span-2 sm:col-span-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Port</label>
            <input
              type="number"
              value={connection.port || ""}
              onChange={(e) => handleFieldChange("port", e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="5432"
              className="w-full bg-secondary/20 border border-border focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/30 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5 col-span-2 sm:col-span-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Database Name</label>
            <input
              type="text"
              value={connection.database || ""}
              onChange={(e) => handleFieldChange("database", e.target.value)}
              placeholder="my_database"
              className="w-full bg-secondary/20 border border-border focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/30 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none transition-all"
            />
          </div>

          {connection.engine === "postgresql" && (
            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Schema</label>
              <input
                type="text"
                value={connection.schema_name || ""}
                onChange={(e) => handleFieldChange("schema_name", e.target.value)}
                placeholder="public"
                className="w-full bg-secondary/20 border border-border focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/30 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none transition-all"
              />
            </div>
          )}

          <div className="space-y-1.5 col-span-2 sm:col-span-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Username</label>
            <input
              type="text"
              value={connection.username || ""}
              onChange={(e) => handleFieldChange("username", e.target.value)}
              placeholder="postgres"
              className="w-full bg-secondary/20 border border-border focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/30 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5 col-span-2 sm:col-span-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Password</label>
            <input
              type="password"
              value={connection.password || ""}
              onChange={(e) => handleFieldChange("password", e.target.value)}
              placeholder="••••••••"
              className="w-full bg-secondary/20 border border-border focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/30 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none transition-all"
            />
          </div>
        </div>
      )}

      {/* Action panel & Test results */}
      <div className="pt-2 flex flex-col gap-4 border-t border-border/60">
        <div className="flex justify-between items-center">
          <span className="text-[11px] text-muted-foreground font-semibold">
            {testResult?.success ? (
              <span className="text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> Ready to generate
              </span>
            ) : testResult ? (
              <span className="text-red-400 flex items-center gap-1.5">
                <XCircle className="h-4 w-4" /> Verification failed
              </span>
            ) : (
              <span>Not verified</span>
            )}
          </span>

          <button
            type="button"
            disabled={testing}
            onClick={handleTestConnection}
            className="px-4 py-2 rounded-xl bg-secondary/80 hover:bg-secondary border border-border hover:border-indigo-500/30 font-semibold text-xs text-white flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {testing ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Memverifikasi...</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 text-indigo-400" />
                <span>Test Koneksi</span>
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
                ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400/90"
                : "bg-red-500/5 border-red-500/20 text-red-400/90"
            )}
          >
            <div className="font-bold mb-1">
              {testResult.success ? "✅ Connection Successful" : "❌ Connection Failed"}
            </div>
            <div>{testResult.message}</div>
            {testResult.success && (
              <div className="mt-1.5 pt-1.5 border-t border-emerald-500/10 flex justify-between">
                <span>Version: {testResult.server_version || "Unknown"}</span>
                <span>Tables found: {testResult.tables_count ?? 0}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
