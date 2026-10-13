"use client";

import { useEffect, useState } from "react";
import type { Snapshot } from "../core/types";
import { DEMO_REFERENCE, DEMO_TARGET } from "../lib/demo";
import { CompareResult } from "./CompareResult";
import { SnapshotSlot } from "./SnapshotSlot";

export default function SchemaComparePage() {
  const [reference, setReference] = useState<Snapshot | null>(null);
  const [target, setTarget] = useState<Snapshot | null>(null);

  const loadDemo = () => {
    setReference(DEMO_REFERENCE);
    setTarget(DEMO_TARGET);
  };

  // /schema-compare?demo=1 langsung membuka contoh, berguna untuk tautan demo.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("demo") === "1") {
      setReference(DEMO_REFERENCE);
      setTarget(DEMO_TARGET);
    }
  }, []);

  return (
    <div className="space-y-4 pb-16 animate-fade-in-up max-w-6xl mx-auto px-2 sm:px-4">
      <div className="grid gap-4 md:grid-cols-2">
        <SnapshotSlot
          title="Acuan"
          hint="Struktur yang diharapkan aplikasi, biasanya staging."
          snapshot={reference}
          onChange={setReference}
        />
        <SnapshotSlot
          title="Target"
          hint="Database yang diperiksa, biasanya production."
          snapshot={target}
          onChange={setTarget}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <p>
          File diproses di browser dan tidak dikirim ke server. Snapshot dibuat dengan CLI{" "}
          <code className="font-mono">db-schema-compare</code>:{" "}
          <code className="font-mono">npm run snapshot -- --label production</code>
        </p>
        <button
          type="button"
          onClick={loadDemo}
          className="px-3 py-1.5 rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
        >
          Muat contoh
        </button>
      </div>

      {reference && target ? (
        // Key memastikan pilihan tabel dan posisi kembali ke awal saat snapshot diganti.
        <CompareResult
          key={`${reference.snapshot_id}:${target.snapshot_id}`}
          reference={reference}
          target={target}
        />
      ) : (
        <div className="rounded-2xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
          Pilih snapshot acuan dan target untuk melihat perbedaannya, atau muat contoh.
        </div>
      )}
    </div>
  );
}
