"use client";

import { useEffect, useMemo, useState } from "react";
import { shortcutsByLevel, commandsByLevel } from "../data";
import SshAccessPanel from "./SshAccessPanel";
import ShortcutCard from "./ShortcutCard";
import CommandCard from "./CommandCard";
import CommandDrawer from "./CommandDrawer";
import Pagination from "./Pagination";
import { LINUX_HELPER_LABELS as L } from "../lib/labels";
import type { Env, Distro } from "../lib/schema";

interface Level0ViewProps {
  envs: Env[];
  distro: Distro;
  search: string;
}

const PAGE_SIZE = 6;

function matchesEnv(itemEnvs: Env[], selected: Env[]) {
  return selected.length === 0 || selected.some((e) => itemEnvs.includes(e));
}

function pageCountOf(total: number) {
  return Math.max(1, Math.ceil(total / PAGE_SIZE));
}

export default function Level0View({ envs, distro, search }: Level0ViewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [scPage, setScPage] = useState(1);
  const [cmdPage, setCmdPage] = useState(1);
  const q = search.trim().toLowerCase();

  // Filter berubah -> kembali ke halaman 1 biar tidak nyangkut di halaman kosong.
  useEffect(() => {
    setScPage(1);
    setCmdPage(1);
  }, [q, envs]);

  const shortcuts = useMemo(
    () =>
      shortcutsByLevel("0").filter((s) => {
        if (!matchesEnv(s.env, envs)) return false;
        if (!q) return true;
        const haystack = [s.title, s.altCommand ?? "", s.keys.flat().join(" ")]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      }),
    [envs, q]
  );

  const commands = useMemo(
    () =>
      commandsByLevel("0").filter((c) => {
        if (!q) return true;
        return `${c.title} ${c.description} ${c.command}`.toLowerCase().includes(q);
      }),
    [q]
  );

  const scPageCount = pageCountOf(shortcuts.length);
  const cmdPageCount = pageCountOf(commands.length);
  const scSafePage = Math.min(scPage, scPageCount);
  const cmdSafePage = Math.min(cmdPage, cmdPageCount);

  const pagedShortcuts = shortcuts.slice(
    (scSafePage - 1) * PAGE_SIZE,
    scSafePage * PAGE_SIZE
  );
  const pagedCommands = commands.slice(
    (cmdSafePage - 1) * PAGE_SIZE,
    cmdSafePage * PAGE_SIZE
  );

  const selectedCommand = useMemo(
    () => commands.find((c) => c.id === selectedId) ?? null,
    [commands, selectedId]
  );

  const nothingFound = shortcuts.length === 0 && commands.length === 0;

  return (
    <div className="space-y-8">
      <SshAccessPanel />

      {shortcuts.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-foreground">{L.sections.shortcuts}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {pagedShortcuts.map((s) => (
              <ShortcutCard key={s.id} shortcut={s} />
            ))}
          </div>
          <Pagination page={scSafePage} pageCount={scPageCount} onPage={setScPage} />
        </section>
      )}

      {commands.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-foreground">{L.sections.commands}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {pagedCommands.map((c) => (
              <CommandCard
                key={c.id}
                command={c}
                distro={distro}
                onSelect={() => setSelectedId(c.id)}
              />
            ))}
          </div>
          <Pagination page={cmdSafePage} pageCount={cmdPageCount} onPage={setCmdPage} />
        </section>
      )}

      {nothingFound && (
        <p className="py-10 text-center text-sm text-muted-foreground">{L.empty.filtered}</p>
      )}

      <CommandDrawer
        command={selectedCommand}
        distro={distro}
        isOpen={selectedCommand !== null}
        onClose={() => setSelectedId(null)}
      />
    </div>
  );
}
