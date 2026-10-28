"use client";

import { useEffect, useState } from "react";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/useLang";
import type { Snapshot } from "../core/types";
import { DEMO_REFERENCE, DEMO_TARGET } from "../lib/demo";
import { I18nProvider, STRINGS } from "../lib/i18n";
import { CompareResult } from "./CompareResult";
import { SnapshotSlot } from "./SnapshotSlot";

export default function SchemaComparePage() {
  const [lang, setLang] = useLang();
  const t = STRINGS[lang];
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
    <I18nProvider value={t}>
      <div className="space-y-4 pb-16 animate-fade-in-up max-w-6xl mx-auto px-2 sm:px-4">
        <div className="flex justify-end">
          <div role="group" aria-label={t.page.langLabel} className="flex items-center rounded-lg bg-muted p-0.5 text-xs">
            <Languages className="mx-1.5 h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
            {(["en", "id"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setLang(value)}
                aria-pressed={lang === value}
                className={cn(
                  "px-2 py-1 rounded-md font-semibold uppercase transition-colors",
                  lang === value ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <SnapshotSlot
            title={t.page.referenceTitle}
            hint={t.page.referenceHint}
            defaultLabel="staging"
            snapshot={reference}
            onChange={setReference}
          />
          <SnapshotSlot
            title={t.page.targetTitle}
            hint={t.page.targetHint}
            defaultLabel="production"
            snapshot={target}
            onChange={setTarget}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>
            {t.page.footer} <code className="font-mono">db-schema-compare</code>:{" "}
            <code className="font-mono">npm run snapshot -- --label production</code>
          </p>
          <button
            type="button"
            onClick={loadDemo}
            className="px-3 py-1.5 rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
          >
            {t.page.loadDemo}
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
            {t.page.empty}
          </div>
        )}
      </div>
    </I18nProvider>
  );
}
