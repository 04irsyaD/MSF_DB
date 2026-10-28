"use client";

import { useId, useState } from "react";
import { AlertTriangle, Download, FileJson, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SchemaCatalogAccess } from "@/lib/types";
import type { Snapshot } from "../core/types";
import { validateSnapshot } from "../core/validate";
import { useT } from "../lib/i18n";
import type { Strings } from "../lib/i18n";
import { downloadSnapshot } from "../lib/live";
import { ConnectForm } from "./ConnectForm";

const MAX_FILE_BYTES = 10 * 1024 * 1024;

type Mode = "upload" | "connect";

interface SnapshotSlotProps {
  title: string;
  hint: string;
  defaultLabel: string;
  snapshot: Snapshot | null;
  onChange: (snapshot: Snapshot | null) => void;
}

/**
 * Decode sesuai BOM. Windows PowerShell 5.1 menulis UTF-16LE saat `> file.json`;
 * PowerShell 7 dan shell lain menulis UTF-8. TextDecoder ikut membuang BOM-nya.
 */
function decodeText(bytes: Uint8Array): string {
  if (bytes[0] === 0xff && bytes[1] === 0xfe) return new TextDecoder("utf-16le").decode(bytes);
  if (bytes[0] === 0xfe && bytes[1] === 0xff) return new TextDecoder("utf-16be").decode(bytes);
  return new TextDecoder("utf-8").decode(bytes);
}

class SnapshotFileError extends Error {
  constructor(
    readonly kind: "tooBig" | "notJson" | "notSnapshot",
    readonly detail = "",
  ) {
    super(kind);
  }
}

/** Membaca file snapshot di browser. File tidak dikirim ke server. */
async function readSnapshot(file: File): Promise<Snapshot> {
  if (file.size > MAX_FILE_BYTES) {
    throw new SnapshotFileError("tooBig");
  }
  let json: unknown;
  try {
    json = JSON.parse(decodeText(new Uint8Array(await file.arrayBuffer())));
  } catch {
    throw new SnapshotFileError("notJson");
  }
  const result = validateSnapshot(json);
  if (!result.ok) {
    throw new SnapshotFileError("notSnapshot", result.errors.slice(0, 3).join("; "));
  }
  return result.snapshot;
}

function describeFileError(error: unknown, t: Strings["slot"]): string {
  if (!(error instanceof SnapshotFileError)) return t.errRead;
  if (error.kind === "tooBig") return t.errTooBig;
  if (error.kind === "notJson") return t.errNotJson;
  return t.errNotSnapshot(error.detail);
}

function accessWarning(access: SchemaCatalogAccess, t: Strings["slot"]): string | null {
  if (access.is_superuser) {
    return t.warnSuperuser(access.role ?? "");
  }
  if (access.readable_count > 0) {
    const more = access.readable_count - access.readable_sample.length;
    const names = access.readable_sample.join(", ") + (more > 0 ? `, ${t.more(more)}` : "");
    return t.warnReadable(access.readable_count, names);
  }
  return null;
}

export function SnapshotSlot({ title, hint, defaultLabel, snapshot, onChange }: SnapshotSlotProps) {
  const t = useT();
  const inputId = useId();
  const [mode, setMode] = useState<Mode>("connect");
  // Error mentah disimpan, pesannya dibuat saat render supaya ikut bahasa aktif.
  const [error, setError] = useState<unknown>(null);
  // Hak akses akun dari koneksi database; diikat ke snapshot-nya supaya tidak menempel
  // ke snapshot lain yang dipasang dari luar (misal tombol contoh).
  const [live, setLive] = useState<{ snapshotId: string; access: SchemaCatalogAccess } | null>(null);
  const access = live && snapshot && live.snapshotId === snapshot.snapshot_id ? live.access : null;

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      onChange(await readSnapshot(file));
      setLive(null);
      setError(null);
    } catch (err) {
      setError(err ?? new Error());
    }
  };

  const clear = () => {
    onChange(null);
    setLive(null);
  };

  const warning = access ? accessWarning(access, t.slot) : null;

  return (
    <div className="min-w-0 rounded-xl border border-border bg-card p-4 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-foreground">{title}</div>
          <div className="text-xs text-muted-foreground">{hint}</div>
        </div>
        {!snapshot && (
          <div role="tablist" aria-label={t.slot.sourceLabel(title)} className="flex shrink-0 rounded-lg bg-muted p-0.5 text-xs">
            {(["connect", "upload"] as const).map((value) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={mode === value}
                onClick={() => setMode(value)}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-colors",
                  mode === value ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {value === "connect" ? t.slot.tabConnect : t.slot.tabUpload}
              </button>
            ))}
          </div>
        )}
      </div>

      {snapshot ? (
        <>
          <div className="flex items-start gap-3 rounded-lg bg-muted px-3 py-2.5">
            <FileJson className="h-4 w-4 mt-0.5 shrink-0 text-accent" aria-hidden="true" />
            <div className="min-w-0 flex-1 text-sm">
              <div className="font-semibold text-foreground truncate">{snapshot.source.label}</div>
              <div className="text-xs text-muted-foreground truncate">
                {snapshot.source.database}.{snapshot.source.schema} · {t.slot.tables(Object.keys(snapshot.objects.tables).length)} ·{" "}
                {access ? t.slot.liveSource : snapshot.captured_at.slice(0, 10)}
              </div>
            </div>
            {access && (
              <button
                type="button"
                onClick={() => downloadSnapshot(snapshot)}
                aria-label={t.slot.download}
                title={t.slot.downloadTitle}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-background"
              >
                <Download className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={clear}
              aria-label={t.slot.remove(snapshot.source.label)}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-background"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {warning && (
            <div className="flex items-start gap-2 rounded-lg px-3 py-2 text-xs bg-amber-100 text-amber-900 dark:bg-amber-500/15 dark:text-amber-200">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" aria-hidden="true" />
              <span>{warning}</span>
            </div>
          )}
        </>
      ) : mode === "connect" ? (
        <ConnectForm
          defaultLabel={defaultLabel}
          onConnected={(result) => {
            onChange(result.snapshot);
            setLive({ snapshotId: result.snapshot.snapshot_id, access: result.access });
            setError(null);
          }}
        />
      ) : (
        <label
          htmlFor={inputId}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            handleFile(event.dataTransfer.files[0]);
          }}
          className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border px-3 py-5 text-sm text-muted-foreground cursor-pointer hover:border-accent hover:text-foreground transition-colors focus-within:ring-2 focus-within:ring-ring"
        >
          <Upload className="h-4 w-4" aria-hidden="true" />
          <span>{t.slot.dropHint}</span>
          <input
            id={inputId}
            type="file"
            accept=".json,application/json"
            className="sr-only"
            onChange={(event) => {
              handleFile(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
        </label>
      )}

      {error !== null && mode === "upload" && (
        <p role="alert" className="text-xs text-red-600 dark:text-red-400">
          {describeFileError(error, t.slot)}
        </p>
      )}
    </div>
  );
}
