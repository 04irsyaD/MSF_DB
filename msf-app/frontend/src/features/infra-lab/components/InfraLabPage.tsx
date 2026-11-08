"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Info,
  Lock,
  Server,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { INFRA_MODULES } from "../modules";
import { readProgress, type ModuleProgress } from "../lib/progress";
import type { InfraModule } from "../lib/types";
import { BTN_PRIMARY, CARD, FOCUS_RING, LABEL } from "../lib/ui";
import { TagBadge } from "./StatusPill";

function ModuleCard({
  mod,
  progress,
}: {
  mod: InfraModule;
  progress: ModuleProgress | null;
}) {
  const Icon = mod.icon;
  const active = mod.status === "active";
  const total = mod.sections.length;
  const visitedCount = progress ? new Set(progress.visited).size : 0;
  const last = progress ? mod.sections[progress.section] : undefined;

  return (
    <article
      aria-disabled={active ? undefined : true}
      className={cn(
        "flex flex-col gap-3.5 rounded-xl p-5",
        active
          ? "border border-accent/35 bg-card shadow-card"
          : "border border-dashed border-border bg-card/60",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg",
            active
              ? "bg-accent/10 text-accent"
              : "bg-muted text-muted-foreground",
          )}
        >
          <Icon aria-hidden className="h-5 w-5" />
        </div>
        {active ? (
          <TagBadge tone="ok">Tersedia</TagBadge>
        ) : (
          <TagBadge tone="info">Segera hadir</TagBadge>
        )}
      </div>

      <div>
        <h3
          className={cn(
            "text-base font-semibold",
            active ? "text-foreground" : "text-foreground/80",
          )}
        >
          {mod.title}
        </h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
          {mod.description}
        </p>
      </div>

      {mod.tags.length > 0 && (
        <ul className="flex flex-wrap gap-1.5" aria-label="Isi modul">
          {mod.tags.map((t) => (
            <li
              key={t}
              className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
            >
              {t}
            </li>
          ))}
        </ul>
      )}

      {active && last && (
        <div className="mt-auto space-y-1.5">
          <div className="flex justify-between gap-2 text-[11px] text-muted-foreground">
            <span>Terakhir dibuka</span>
            <span className="truncate font-mono text-foreground">
              {(progress?.section ?? 0) + 1} / {total} · {last.title}
            </span>
          </div>
          <div
            role="progressbar"
            aria-label="Bagian yang sudah dibuka"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={visitedCount}
            className="h-1 overflow-hidden rounded-full bg-muted"
          >
            <div
              className="h-full bg-accent"
              style={{ width: `${(visitedCount / total) * 100}%` }}
            />
          </div>
        </div>
      )}

      {active && mod.href ? (
        <Link href={mod.href} className={cn(BTN_PRIMARY, !last && "mt-auto")}>
          {last ? "Lanjutkan belajar" : "Mulai belajar"}
          <ArrowRight aria-hidden className="h-4 w-4" />
        </Link>
      ) : (
        <button
          type="button"
          disabled
          className="mt-auto inline-flex min-h-10 cursor-not-allowed items-center justify-center gap-1.5 rounded-lg border border-border bg-muted/50 px-3.5 text-sm font-medium text-muted-foreground"
        >
          <Lock aria-hidden className="h-4 w-4" />
          Segera hadir
        </button>
      )}
    </article>
  );
}

export default function InfraLabPage() {
  const [progress, setProgress] = useState<
    Record<string, ModuleProgress | null>
  >({});

  useEffect(() => {
    setProgress(
      Object.fromEntries(INFRA_MODULES.map((m) => [m.id, readProgress(m.id)])),
    );
  }, []);

  const activeModules = INFRA_MODULES.filter((m) => m.status === "active");
  const soonCount = INFRA_MODULES.length - activeModules.length;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 pb-8">
      <header className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
          <Server className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Infra Lab
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Simulasi dan materi interaktif perangkat data center, langsung di
            browser.
          </p>
        </div>
      </header>

      <div className="flex items-start gap-3 rounded-xl border border-accent/20 bg-accent/5 p-3.5">
        <Info aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
        <p className="text-xs leading-relaxed text-muted-foreground">
          <span className="font-semibold text-foreground">
            Belajar tanpa risiko.
          </span>{" "}
          Semua modul berjalan di browser, tanpa koneksi ke perangkat atau
          server mana pun. Data di dalamnya fiktif: IP 192.0.2.x, Service Tag
          DEMO123, host SRV-DEMO-01.
        </p>
      </div>

      <section aria-labelledby="infra-modules" className="flex flex-col gap-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="infra-modules" className={LABEL}>
            Pilih modul
          </h2>
          <span className="font-mono text-[11px] text-muted-foreground">
            {activeModules.length} tersedia
            {soonCount > 0 ? ` · ${soonCount} segera hadir` : ""}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {INFRA_MODULES.map((m) => (
            <ModuleCard key={m.id} mod={m} progress={progress[m.id] ?? null} />
          ))}
        </div>
      </section>

      <section aria-labelledby="infra-outline" className="flex flex-col gap-3">
        <h2 id="infra-outline" className={LABEL}>
          Isi modul
        </h2>
        {activeModules.map((m) => {
          const visited = progress[m.id]?.visited ?? [];
          const opened = new Set(visited).size;
          return (
            <details
              key={m.id}
              open={opened > 0 || undefined}
              className={cn(CARD, "group")}
            >
              <summary
                className={cn(
                  "flex cursor-pointer list-none flex-wrap items-center justify-between gap-2 rounded-md [&::-webkit-details-marker]:hidden",
                  FOCUS_RING,
                )}
              >
                <span className="flex items-center gap-2 text-[15px] font-semibold text-foreground">
                  <ChevronRight
                    aria-hidden
                    className="h-4 w-4 transition-transform group-open:rotate-90"
                  />
                  {m.title}
                </span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {opened} / {m.sections.length} bagian dibuka
                </span>
              </summary>
              <ol className="mt-4 grid grid-cols-1 gap-2.5 md:grid-cols-2">
                {m.sections.map((s, i) => {
                  const done = visited.includes(i);
                  return (
                    <li
                      key={s.title}
                      className={cn(
                        "flex gap-3 rounded-lg border p-3",
                        done
                          ? "border-emerald-500/30 bg-emerald-500/5"
                          : "border-border",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-semibold",
                          done
                            ? "bg-emerald-500 text-white"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {done ? (
                          <>
                            <Check
                              aria-hidden
                              className="h-3.5 w-3.5"
                              strokeWidth={3}
                            />
                            <span className="sr-only">sudah dibuka</span>
                          </>
                        ) : (
                          i + 1
                        )}
                      </span>
                      <span>
                        <span className="block text-[13px] font-semibold text-foreground">
                          {s.title}
                        </span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                          {s.summary}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ol>
            </details>
          );
        })}
      </section>
    </div>
  );
}
