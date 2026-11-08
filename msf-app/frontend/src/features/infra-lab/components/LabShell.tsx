"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import type { InfraModule } from "../lib/types";
import { readProgress, writeProgress } from "../lib/progress";
import { BTN, BTN_PRIMARY } from "../lib/ui";
import { TagBadge } from "./StatusPill";
import LabStepper from "./LabStepper";

interface LabShellProps {
  module: InfraModule;
  subtitle: string;
  badge?: string;
  finishMessage: string;
  /** Dipanggil dengan indeks bagian aktif; harus mengembalikan satu node per bagian. */
  renderSections: (current: number) => ReactNode[];
}

/**
 * Kerangka satu modul: breadcrumb, header, stepper, isi bagian, pager.
 * Semua bagian tetap ter-mount (hanya disembunyikan) supaya state simulasi tidak hilang
 * saat pindah bagian, sama seperti prototipe aslinya.
 */
export default function LabShell({
  module,
  subtitle,
  badge,
  finishMessage,
  renderSections,
}: LabShellProps) {
  const total = module.sections.length;
  const [current, setCurrent] = useState(0);
  const [visited, setVisited] = useState<number[]>([0]);
  const [loaded, setLoaded] = useState(false);

  const clamp = useCallback(
    (i: number) => Math.max(0, Math.min(total - 1, i)),
    [total],
  );

  // Baca progres setelah mount (localStorage tidak ada saat render server).
  useEffect(() => {
    const saved = readProgress(module.id);
    if (saved) {
      const section = clamp(saved.section);
      const valid = saved.visited.filter((i) => i >= 0 && i < total);
      setCurrent(section);
      setVisited(valid.includes(section) ? valid : [...valid, section]);
    }
    setLoaded(true);
  }, [module.id, total, clamp]);

  useEffect(() => {
    if (loaded) writeProgress(module.id, { section: current, visited });
  }, [loaded, module.id, current, visited]);

  const go = useCallback(
    (i: number, scrollTop: boolean) => {
      const next = clamp(i);
      setCurrent(next);
      setVisited((v) => (v.includes(next) ? v : [...v, next]));
      if (scrollTop) window.scrollTo({ top: 0 });
    },
    [clamp],
  );

  const isLast = current === total - 1;
  const Icon = module.icon;
  const sections = renderSections(current);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 pb-8">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs text-muted-foreground"
      >
        <Link
          href="/infra-lab"
          className="rounded hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Infra Lab
        </Link>
        <ChevronRight aria-hidden className="h-3 w-3" />
        <span aria-current="page" className="text-foreground">
          {module.title}
        </span>
      </nav>

      <header className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              {module.title}
            </h1>
            {badge && <TagBadge tone="warn">{badge}</TagBadge>}
          </div>
          <p className="max-w-[70ch] text-sm text-muted-foreground">
            {subtitle}
          </p>
        </div>
      </header>

      <LabStepper
        sections={module.sections}
        current={current}
        visited={visited}
        onSelect={(i) => go(i, false)}
      />

      {sections.map((node, i) => (
        <section
          key={module.sections[i]?.title ?? i}
          hidden={i !== current}
          aria-label={module.sections[i]?.title}
          // Kelas `flex` mengalahkan atribut hidden, jadi display diatur lewat kelas.
          className={i === current ? "flex flex-col gap-4" : "hidden"}
        >
          {node}
        </section>
      ))}

      <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
        <button
          type="button"
          onClick={() => go(current - 1, true)}
          disabled={current === 0}
          className={BTN}
        >
          <ChevronLeft aria-hidden className="h-4 w-4" />
          Sebelumnya
        </button>
        <span className="font-mono text-[11px] text-muted-foreground">
          {current + 1} / {total}
        </span>
        <button
          type="button"
          onClick={() =>
            isLast ? toast.success(finishMessage) : go(current + 1, true)
          }
          className={BTN_PRIMARY}
        >
          {isLast ? "Selesai" : "Berikutnya"}
          {isLast ? (
            <Check aria-hidden className="h-4 w-4" />
          ) : (
            <ChevronRight aria-hidden className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}
