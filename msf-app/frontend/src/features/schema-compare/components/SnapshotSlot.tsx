"use client";

import { useId, useState } from "react";
import { FileJson, Upload, X } from "lucide-react";
import type { Snapshot } from "../core/types";
import { validateSnapshot } from "../core/validate";

const MAX_FILE_BYTES = 10 * 1024 * 1024;

interface SnapshotSlotProps {
  title: string;
  hint: string;
  snapshot: Snapshot | null;
  onChange: (snapshot: Snapshot | null) => void;
}

/** Membaca file snapshot di browser. File tidak dikirim ke server. */
async function readSnapshot(file: File): Promise<Snapshot> {
  if (file.size > MAX_FILE_BYTES) {
    throw new Error("Ukuran file melebihi 10 MB.");
  }
  let json: unknown;
  try {
    // BOM dibuang: PowerShell menambahkannya saat redirect ke file.
    json = JSON.parse((await file.text()).replace(/^﻿/, ""));
  } catch {
    throw new Error("File bukan JSON yang sah.");
  }
  const result = validateSnapshot(json);
  if (!result.ok) {
    throw new Error(`File bukan snapshot yang sah: ${result.errors.slice(0, 3).join("; ")}`);
  }
  return result.snapshot;
}

export function SnapshotSlot({ title, hint, snapshot, onChange }: SnapshotSlotProps) {
  const inputId = useId();
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      onChange(await readSnapshot(file));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "File tidak bisa dibaca.");
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-2">
      <div>
        <div className="text-sm font-semibold text-foreground">{title}</div>
        <div className="text-xs text-muted-foreground">{hint}</div>
      </div>

      {snapshot ? (
        <div className="flex items-start gap-3 rounded-lg bg-muted px-3 py-2.5">
          <FileJson className="h-4 w-4 mt-0.5 shrink-0 text-accent" aria-hidden="true" />
          <div className="min-w-0 flex-1 text-sm">
            <div className="font-semibold text-foreground truncate">{snapshot.source.label}</div>
            <div className="text-xs text-muted-foreground truncate">
              {snapshot.source.database}.{snapshot.source.schema} · {Object.keys(snapshot.objects.tables).length} tabel ·{" "}
              {snapshot.captured_at.slice(0, 10)}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label={`Lepas snapshot ${snapshot.source.label}`}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-background"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
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
          <span>Pilih atau seret file .snapshot.json</span>
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

      {error && (
        <p role="alert" className="text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
