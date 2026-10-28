"use client";

import { cn } from "@/lib/utils";
import { LINUX_HELPER_LABELS as L } from "../lib/labels";
import type { Env, Distro } from "../lib/schema";

interface EnvDistroFilterProps {
  envs: Env[];
  onToggleEnv: (env: Env) => void;
  distro: Distro;
  onSetDistro: (distro: Distro) => void;
  /** Distro hanya relevan saat ada command dengan varian (Level 1+). */
  showDistro?: boolean;
}

const ENV_OPTIONS: { value: Env; label: string }[] = [
  { value: "desktop", label: L.filter.desktop },
  { value: "ssh", label: L.filter.ssh },
];

const DISTRO_OPTIONS: { value: Distro; label: string }[] = [
  { value: "ubuntu", label: L.filter.ubuntu },
  { value: "rhel", label: L.filter.rhel },
];

function pillClass(active: boolean) {
  return cn(
    "rounded-full border px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
    active
      ? "border-accent bg-accent/10 text-accent"
      : "border-border bg-card text-muted-foreground hover:text-foreground"
  );
}

export default function EnvDistroFilter({
  envs,
  onToggleEnv,
  distro,
  onSetDistro,
  showDistro = true,
}: EnvDistroFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">{L.filter.envLabel}:</span>
        {ENV_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onToggleEnv(opt.value)}
            aria-pressed={envs.includes(opt.value)}
            className={pillClass(envs.includes(opt.value))}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {showDistro && (
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">{L.filter.distroLabel}:</span>
          {DISTRO_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onSetDistro(opt.value)}
              aria-pressed={distro === opt.value}
              className={pillClass(distro === opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
