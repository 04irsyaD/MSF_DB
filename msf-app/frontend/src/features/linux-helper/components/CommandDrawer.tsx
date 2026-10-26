"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { GitBranch, Tag, X } from "lucide-react";
import { RiskBadge, CategoryBadge } from "@/features/sql-helper/components/Badges";
import ShellHighlight from "./ShellHighlight";
import RiskBanner from "./RiskBanner";
import { resolveCommand, hasDistroVariants } from "../lib/resolve";
import { LINUX_HELPER_LABELS as L } from "../lib/labels";
import type { Command, Distro } from "../lib/schema";

interface CommandDrawerProps {
  command: Command | null;
  distro: Distro;
  isOpen: boolean;
  onClose: () => void;
}

/** Drawer detail command: command penuh (distro-aware), penjelasan, risiko, catatan, tag. */
export default function CommandDrawer({ command, distro, isOpen, onClose }: CommandDrawerProps) {
  const [confirmed, setConfirmed] = useState(false);

  // Reset konfirmasi high-risk setiap ganti command / buka-tutup drawer.
  useEffect(() => {
    setConfirmed(false);
  }, [command, isOpen]);

  const resolved = command ? resolveCommand(command, distro) : "";
  const allowCopy = !command || command.risk !== "high" || confirmed;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-border bg-background shadow-xl focus:outline-none data-[state=open]:animate-in data-[state=open]:slide-in-from-right">
          {command && (
            <>
              <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-1.5">
                    <CategoryBadge category={command.category} />
                    <RiskBadge risk={command.risk} />
                    {hasDistroVariants(command) && (
                      <span className="inline-flex items-center gap-1 rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                        <GitBranch className="h-2.5 w-2.5" />
                        {L.variant.label}
                      </span>
                    )}
                  </div>
                  <Dialog.Title className="text-base font-semibold text-foreground">
                    {command.title}
                  </Dialog.Title>
                  {command.description && (
                    <Dialog.Description className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {command.description}
                    </Dialog.Description>
                  )}
                </div>
                <Dialog.Close
                  aria-label={L.drawer.close}
                  className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <X className="h-4 w-4" />
                </Dialog.Close>
              </div>

              <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
                <RiskBanner
                  risk={command.risk}
                  confirmed={confirmed}
                  onConfirmChange={setConfirmed}
                  showConfirmation={command.risk === "high"}
                />

                <section>
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {L.drawer.commandTitle}
                    </h3>
                    {hasDistroVariants(command) && (
                      <span className="text-[10px] text-muted-foreground">
                        {distro === "ubuntu" ? L.filter.ubuntu : L.filter.rhel}
                      </span>
                    )}
                  </div>
                  <ShellHighlight command={resolved} allowCopy={allowCopy} />
                </section>

                {command.explain.length > 0 && (
                  <section>
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {L.drawer.explainTitle}
                    </h3>
                    <ul className="space-y-2">
                      {command.explain.map((e, i) => (
                        <li key={i} className="flex flex-col gap-0.5">
                          <code className="w-fit rounded bg-muted px-1.5 py-0.5 font-mono text-xs font-semibold text-foreground">
                            {e.part}
                          </code>
                          <span className="text-xs leading-relaxed text-muted-foreground">
                            {e.meaning}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {command.note && (
                  <section>
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {L.drawer.noteTitle}
                    </h3>
                    <p className="text-xs leading-relaxed text-muted-foreground">{command.note}</p>
                  </section>
                )}

                {command.tags.length > 0 && (
                  <section>
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {L.drawer.tagsTitle}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {command.tags.map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center gap-1 rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
                        >
                          <Tag className="h-2.5 w-2.5" />
                          {t}
                        </span>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
