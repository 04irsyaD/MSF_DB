"use client";

import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { copyToClipboard } from "@/lib/clipboard";
import { cn } from "@/lib/utils";
import type {
  CommandCategory,
  LabCommand,
  RunResult,
  TermLine,
} from "../../lib/types";
import {
  CARD,
  FOCUS_RING,
  LABEL,
  RISK_BADGE,
  RISK_LABEL,
  RISK_TONE,
  TONE_SOFT,
  chipClass,
} from "../../lib/ui";
import Note from "../Note";
import { StatusDot, TagBadge } from "../StatusPill";
import TerminalInput from "./TerminalInput";
import TerminalScreen from "./TerminalScreen";
import { normalizeCommand, useTerminal } from "./useTerminal";

interface CommandConsoleProps {
  commands: LabCommand[];
  categories: CommandCategory[];
  /** Prompt yang digemakan di layar, mis. "racadm>" atau "SW-DEMO-01#". */
  prompt: string;
  welcome: TermLine[];
  run: (raw: string) => RunResult | null;
  screenLabel: string;
  inputPlaceholder: string;
  inputLabel: string;
}

const COPY_RESET_MS = 1500;

/**
 * Daftar perintah + layar contoh output. Pola sama dengan tombol boot: klik perintah,
 * layar menampilkan hasilnya, kartu di bawah menjelaskan cara membacanya.
 * Dipakai ulang semua modul; isi datanya dari `commands.ts` tiap modul.
 */
export default function CommandConsole({
  commands,
  categories,
  prompt,
  welcome,
  run,
  screenLabel,
  inputPlaceholder,
  inputLabel,
}: CommandConsoleProps) {
  const { lines, append, show } = useTerminal(welcome);
  const [category, setCategory] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const visible = useMemo(
    () =>
      category ? commands.filter((c) => c.category === category) : commands,
    [commands, category],
  );
  const selected = commands.find((c) => c.id === selectedId) ?? null;

  // Klik tombol: layar dibersihkan supaya contoh output terbaca jelas.
  function pick(cmd: LabCommand) {
    const result = run(cmd.command);
    if (!result) return;
    show(`${prompt} ${cmd.command}`, result);
    setSelectedId(cmd.id);
  }

  // Ketik sendiri: output ditambahkan seperti terminal biasa.
  function type(raw: string) {
    const result = run(raw);
    if (!result) return;
    append(`${prompt} ${normalizeCommand(raw)}`, result);
    if (result.commandId) setSelectedId(result.commandId);
  }

  async function copySelected() {
    if (!selected) return;
    const ok = await copyToClipboard(selected.command);
    if (!ok) {
      toast.error("Gagal menyalin perintah");
      return;
    }
    toast.success("Perintah disalin");
    setCopied(true);
    setTimeout(() => setCopied(false), COPY_RESET_MS);
  }

  return (
    <>
      <div className={cn(CARD, "flex flex-col gap-3.5")}>
        <TerminalScreen
          lines={lines}
          label={screenLabel}
          footer="Klik perintah di bawah, atau ketik sendiri"
        />

        <div
          role="group"
          aria-label="Filter kategori perintah"
          className="flex flex-wrap gap-2"
        >
          <button
            type="button"
            aria-pressed={category === null}
            onClick={() => setCategory(null)}
            className={chipClass(category === null)}
          >
            Semua
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={category === c.id}
              onClick={() => setCategory(c.id)}
              className={chipClass(category === c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-2 min-[400px]:grid-cols-2 lg:grid-cols-3">
          {visible.map((cmd) => {
            const tone = RISK_TONE[cmd.risk];
            const on = cmd.id === selectedId;
            return (
              <button
                key={cmd.id}
                type="button"
                aria-pressed={on}
                onClick={() => pick(cmd)}
                className={cn(
                  "flex min-h-[60px] flex-col items-start justify-center gap-1 rounded-lg border border-b-[3px] px-3 py-2 text-left transition-colors",
                  FOCUS_RING,
                  on
                    ? "border-accent bg-accent/10"
                    : cmd.risk === "safe"
                      ? "border-border bg-card hover:border-accent/50"
                      : cmd.risk === "caution"
                        ? "border-amber-500/40 bg-card hover:border-amber-500/70"
                        : "border-rose-500/40 bg-card hover:border-rose-500/70",
                )}
              >
                <span className="break-all font-mono text-[13px] font-bold text-foreground">
                  {cmd.label}
                </span>
                <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <StatusDot tone={tone} />
                  {cmd.summary}
                  <span className="sr-only">
                    , risiko {RISK_LABEL[cmd.risk]}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <TerminalInput
          prompt={prompt}
          placeholder={inputPlaceholder}
          label={inputLabel}
          onRun={type}
        />
      </div>

      <article aria-live="polite" className={cn(CARD, "flex flex-col gap-4")}>
        {selected ? (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <code className="break-all rounded-md border border-border bg-muted px-2.5 py-1 font-mono text-[13px] font-semibold text-foreground">
                {selected.command}
              </code>
              <TagBadge tone={RISK_TONE[selected.risk]}>
                {RISK_BADGE[selected.risk]}
              </TagBadge>
              <button
                type="button"
                onClick={copySelected}
                aria-label={copied ? "Perintah disalin" : "Salin perintah"}
                className={cn(
                  "ml-auto inline-flex min-h-8 items-center gap-1.5 rounded-md border border-border px-2.5 text-xs text-muted-foreground hover:text-foreground",
                  FOCUS_RING,
                )}
              >
                {copied ? (
                  <Check aria-hidden className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy aria-hidden className="h-3.5 w-3.5" />
                )}
                Salin
              </button>
            </div>
            <p className="text-sm leading-relaxed text-foreground">
              {selected.description}
            </p>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <p className={cn(LABEL, "mb-1.5")}>Kapan dipakai</p>
                <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-foreground">
                  {selected.when.map((w) => (
                    <li key={w}>{w}</li>
                  ))}
                </ul>
              </div>
              {selected.reading && selected.reading.length > 0 && (
                <div>
                  <p className={cn(LABEL, "mb-1.5")}>Cara baca output</p>
                  <ul className="space-y-2 text-sm leading-relaxed text-foreground">
                    {selected.reading.map((r) => (
                      <li key={r.tag} className="flex items-baseline gap-2">
                        <span
                          className={cn(
                            "shrink-0 whitespace-nowrap rounded-full border px-2 py-px font-mono text-[11px] font-bold",
                            TONE_SOFT[r.tone],
                          )}
                        >
                          {r.tag}
                        </span>
                        <span>{r.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {selected.caution && (
              <Note
                tone={selected.risk === "danger" ? "bad" : "warn"}
                title="Perhatikan:"
              >
                {selected.caution}
              </Note>
            )}
          </>
        ) : (
          <>
            <h3 className="text-[15px] font-semibold text-foreground">
              Penjelasan perintah
            </h3>
            <p className="text-sm text-muted-foreground">
              Klik salah satu perintah di atas untuk melihat contoh output dan
              cara membacanya di sini.
            </p>
          </>
        )}
      </article>

      <article className={cn(CARD, "flex flex-col gap-3")}>
        <h3 className="text-[15px] font-semibold text-foreground">
          Ringkasan perintah
        </h3>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[480px] border-collapse text-[13px]">
            <thead>
              <tr className="bg-muted/60">
                <th
                  scope="col"
                  className={cn(
                    LABEL,
                    "border-b border-border px-3 py-2 text-left",
                  )}
                >
                  Perintah
                </th>
                <th
                  scope="col"
                  className={cn(
                    LABEL,
                    "border-b border-border px-3 py-2 text-left",
                  )}
                >
                  Fungsi
                </th>
                <th
                  scope="col"
                  className={cn(
                    LABEL,
                    "border-b border-border px-3 py-2 text-left",
                  )}
                >
                  Risiko
                </th>
              </tr>
            </thead>
            <tbody>
              {commands.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-border last:border-b-0"
                >
                  <td className="px-3 py-2 font-mono text-foreground">
                    {c.command}
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {c.summary}
                  </td>
                  <td className="px-3 py-2">
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold text-foreground">
                      <StatusDot tone={RISK_TONE[c.risk]} />
                      {RISK_LABEL[c.risk]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </>
  );
}
