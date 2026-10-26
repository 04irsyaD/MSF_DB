"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Fuse from "fuse.js";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { allShortcuts, allCommands, allRunbooks } from "../data";
import { LINUX_HELPER_LABELS as L } from "../lib/labels";
import type { Level } from "../lib/schema";

interface PaletteItem {
  key: string;
  label: string;
  sublabel: string;
  type: string;
  level: Level;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (level: Level, query: string) => void;
}

const MAX_RESULTS = 8;

function buildIndex(): PaletteItem[] {
  return [
    ...allShortcuts.map((s) => ({
      key: s.id,
      label: s.title,
      sublabel: L.palette.typeShortcut,
      type: L.palette.typeShortcut,
      level: s.level,
    })),
    ...allCommands.map((c) => ({
      key: c.id,
      label: c.title,
      sublabel: `${L.palette.typeCommand} · ${c.command}`,
      type: L.palette.typeCommand,
      level: c.level,
    })),
    ...allRunbooks.map((r) => ({
      key: r.id,
      label: r.title,
      sublabel: L.palette.typeRunbook,
      type: L.palette.typeRunbook,
      level: "3" as Level,
    })),
  ];
}

export default function CommandPalette({ open, onClose, onNavigate }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const index = useMemo(buildIndex, []);
  const fuse = useMemo(
    () => new Fuse(index, { keys: ["label", "sublabel"], threshold: 0.4, ignoreLocation: true }),
    [index]
  );

  const results = useMemo(() => {
    const q = query.trim();
    const list = q ? fuse.search(q).map((r) => r.item) : index;
    return list.slice(0, MAX_RESULTS);
  }, [query, fuse, index]);

  // Reset saat dibuka.
  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
    }
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  function choose(item: PaletteItem) {
    onNavigate(item.level, item.label);
    onClose();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      choose(results[active]);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in" />
        <Dialog.Content
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            inputRef.current?.focus();
          }}
          className="fixed left-1/2 top-24 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-background shadow-xl focus:outline-none"
        >
          <Dialog.Title className="sr-only">{L.palette.open}</Dialog.Title>
          <div className="flex items-center gap-2 border-b border-border px-3">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={L.palette.placeholder}
              className="w-full bg-transparent py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>

          {results.length > 0 ? (
            <ul className="max-h-80 overflow-y-auto py-1">
              {results.map((item, i) => (
                <li key={item.key}>
                  <button
                    type="button"
                    onClick={() => choose(item)}
                    onMouseEnter={() => setActive(i)}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 px-3 py-2 text-left",
                      i === active ? "bg-accent/10" : "hover:bg-muted/50"
                    )}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm text-foreground">{item.label}</span>
                      <span className="block truncate font-mono text-[11px] text-muted-foreground">
                        {item.sublabel}
                      </span>
                    </span>
                    <span className="shrink-0 rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                      L{item.level}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">{L.palette.empty}</p>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
