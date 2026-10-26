"use client";

import { TriangleAlert } from "lucide-react";
import Keycap from "./Keycap";
import { LINUX_HELPER_LABELS as L } from "../lib/labels";
import type { Shortcut, Env } from "../lib/schema";

interface ShortcutCardProps {
  shortcut: Shortcut;
}

function EnvBadge({ env }: { env: Env }) {
  return (
    <span className="inline-flex items-center rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
      {env === "desktop" ? L.filter.desktop : L.filter.ssh}
    </span>
  );
}

export default function ShortcutCard({ shortcut }: ShortcutCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-colors">
      <div className="flex flex-wrap items-center gap-1.5">
        {shortcut.keys.map((combo, i) => (
          <span key={i} className="inline-flex items-center gap-1.5">
            {i > 0 && (
              <span className="text-xs text-muted-foreground">{L.shortcut.altLabel}</span>
            )}
            <Keycap keys={combo} />
          </span>
        ))}
        {shortcut.altCommand && (
          <>
            <span className="text-xs text-muted-foreground">{L.shortcut.altLabel}</span>
            <code className="rounded bg-muted px-1.5 py-1 font-mono text-xs text-foreground">
              {shortcut.altCommand}
            </code>
          </>
        )}
      </div>

      <div>
        <p className="text-sm font-medium text-foreground">{shortcut.title}</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {shortcut.env.map((e) => (
            <EnvBadge key={e} env={e} />
          ))}
        </div>
        {shortcut.note && (
          <p className="mt-2 text-xs text-muted-foreground">{shortcut.note}</p>
        )}
        {shortcut.warning && (
          <p className="mt-1.5 flex items-start gap-1 text-xs text-amber-600 dark:text-amber-400">
            <TriangleAlert className="mt-0.5 h-3 w-3 shrink-0" />
            <span>
              <span className="font-semibold">{L.shortcut.warningPrefix}</span>{" "}
              {shortcut.warning}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
