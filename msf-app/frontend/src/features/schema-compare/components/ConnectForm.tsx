"use client";

import { useState } from "react";
import { Check, Copy, Loader2, ShieldCheck } from "lucide-react";
import { ApiError } from "@/lib/api";
import { copyToClipboard } from "@/lib/clipboard";
import { useT } from "../lib/i18n";
import type { Strings } from "../lib/i18n";
import { InvalidStructureError, fetchLiveSnapshot, readOnlyRoleSql } from "../lib/live";
import type { LiveConnection, LiveResult } from "../lib/live";

interface ConnectFormProps {
  defaultLabel: string;
  onConnected: (result: LiveResult) => void;
}

const FIELDS: { key: keyof LiveConnection; placeholder: string; wide?: boolean }[] = [
  { key: "host", placeholder: "db.example.com", wide: true },
  { key: "port", placeholder: "5432" },
  { key: "database", placeholder: "app" },
  { key: "schema", placeholder: "public" },
  { key: "username", placeholder: "schema_reader" },
  { key: "password", placeholder: "" },
  { key: "label", placeholder: "production" },
];

/** Pesan error sesuai bahasa aktif; error backend dipetakan dari `error_code`. */
function describeError(error: unknown, t: Strings["connect"]): string {
  if (error instanceof InvalidStructureError) return t.invalidStructure(error.errors.join("; "));
  if (error instanceof ApiError) {
    const code = error.errorCode ?? (error.status === 429 ? "HTTP_429" : undefined);
    return (code && t.errors[code]) || error.message || t.failed;
  }
  return t.failed;
}

/**
 * Form koneksi database (PostgreSQL). Tidak ada yang disimpan: state hilang saat form ditutup,
 * dan password dikosongkan begitu struktur berhasil diambil.
 */
export function ConnectForm({ defaultLabel, onConnected }: ConnectFormProps) {
  const t = useT();
  const [values, setValues] = useState<LiveConnection>({
    host: "",
    port: "5432",
    database: "",
    schema: "public",
    username: "",
    password: "",
    label: defaultLabel,
  });
  const [busy, setBusy] = useState(false);
  // Error mentah disimpan, pesannya dibuat saat render supaya ikut bahasa aktif.
  const [error, setError] = useState<unknown>(null);
  const [copied, setCopied] = useState(false);

  const set = (key: keyof LiveConnection, value: string) => setValues((prev) => ({ ...prev, [key]: value }));
  const ready = values.host.trim() && values.database.trim() && values.username.trim();
  const recipe = readOnlyRoleSql(values.database, values.schema, t.connect.sql);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!ready || busy) return;
    setBusy(true);
    setError(null);
    try {
      const result = await fetchLiveSnapshot(values);
      setValues((prev) => ({ ...prev, password: "" }));
      onConnected(result);
    } catch (err) {
      setError(err ?? new Error());
    } finally {
      setBusy(false);
    }
  };

  const copyRecipe = async () => {
    if (await copyToClipboard(recipe)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <form onSubmit={submit} autoComplete="off" className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {FIELDS.map((field) => (
          <label key={field.key} className={field.wide ? "col-span-2" : undefined}>
            <span className="block text-xs text-muted-foreground mb-0.5">{t.connect.fields[field.key]}</span>
            <input
              type={field.key === "password" ? "password" : field.key === "port" ? "number" : "text"}
              autoComplete={field.key === "password" ? "new-password" : "off"}
              spellCheck={false}
              value={values[field.key]}
              placeholder={field.placeholder}
              onChange={(event) => set(field.key, event.target.value)}
              className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm font-mono text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
        ))}
      </div>

      <button
        type="submit"
        disabled={!ready || busy}
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {busy ? t.connect.busy : t.connect.submit}
      </button>

      {error !== null && (
        <p role="alert" className="text-xs text-red-600 dark:text-red-400">
          {describeError(error, t.connect)}
        </p>
      )}

      <div className="flex items-start gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="h-4 w-4 mt-0.5 shrink-0 text-accent" aria-hidden="true" />
        <p>{t.connect.note}</p>
      </div>

      <details className="rounded-lg border border-border text-xs">
        <summary className="cursor-pointer px-3 py-2 text-foreground">{t.connect.recipeTitle}</summary>
        <div className="px-3 pb-3 space-y-2">
          <p className="text-muted-foreground">{t.connect.recipeBody}</p>
          <div className="rounded-md bg-muted">
            <div className="flex justify-end px-1.5 pt-1.5">
              <button
                type="button"
                onClick={copyRecipe}
                className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-background"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? t.connect.copied : t.connect.copy}
              </button>
            </div>
            <pre className="overflow-x-auto px-2.5 pb-2.5 font-mono text-[11px] text-foreground">{recipe}</pre>
          </div>
        </div>
      </details>
    </form>
  );
}
