"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CARD, FOCUS_RING, LABEL, chipClass } from "../../../lib/ui";
import Note from "../../../components/Note";
import SectionIntro from "../../../components/SectionIntro";
import { StatusPill } from "../../../components/StatusPill";
import { END_REASON, TRAFFIC_LOGS } from "../data/logs";

type Filter = "all" | "allow" | "deny";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "Semua" },
  { id: "allow", label: "allow" },
  { id: "deny", label: "deny" },
];

export default function TrafficLogSection() {
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedId, setSelectedId] = useState(TRAFFIC_LOGS[0].id);

  const rows = TRAFFIC_LOGS.filter(
    (l) => filter === "all" || l.action === filter,
  );
  const sel = TRAFFIC_LOGS.find((l) => l.id === selectedId) ?? TRAFFIC_LOGS[0];
  const reason = END_REASON[sel.endReason];

  return (
    <>
      <SectionIntro title="Baca traffic log">
        Traffic log mencatat setiap sesi: siapa ke mana, aplikasi apa, rule mana
        yang dipakai, dan kenapa sesi berakhir. Pilih satu baris untuk melihat
        cara membacanya.
      </SectionIntro>

      <div className={cn(CARD, "flex flex-col gap-3")}>
        <div
          role="group"
          aria-label="Filter action"
          className="flex flex-wrap gap-2"
        >
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={chipClass(filter === f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[720px] border-collapse text-[13px]">
            <thead>
              <tr className="bg-muted/60">
                {[
                  "",
                  "Waktu",
                  "Source",
                  "Destination",
                  "Aplikasi",
                  "Rule",
                  "Action",
                  "End reason",
                ].map((h) => (
                  <th
                    key={h}
                    scope="col"
                    className={cn(
                      LABEL,
                      "border-b border-border px-3 py-2 text-left",
                    )}
                  >
                    {h || <span className="sr-only">Pilih</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((l) => {
                const on = l.id === sel.id;
                return (
                  <tr
                    key={l.id}
                    className={cn(
                      "border-b border-border last:border-b-0",
                      on && "bg-accent/10",
                    )}
                  >
                    <td className="px-2 py-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedId(l.id)}
                        aria-pressed={on}
                        aria-label={`Lihat log ${l.time} ${l.application} ${l.action}`}
                        className={cn(
                          "min-h-8 rounded-md border px-2 text-xs font-medium",
                          FOCUS_RING,
                          on
                            ? "border-accent text-foreground"
                            : "border-border text-muted-foreground hover:text-foreground",
                        )}
                      >
                        Lihat
                      </button>
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 font-mono text-xs text-muted-foreground">
                      {l.time.slice(11)}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-foreground">
                      {l.source}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-foreground">
                      {l.destination}:{l.port}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-foreground">
                      {l.application}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-foreground">
                      {l.rule}
                    </td>
                    <td className="px-3 py-2">
                      <StatusPill tone={l.action === "allow" ? "ok" : "bad"}>
                        {l.action}
                      </StatusPill>
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-foreground">
                      {l.endReason}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <article aria-live="polite" className={cn(CARD, "flex flex-col gap-3")}>
        <h3 className="text-[15px] font-semibold text-foreground">
          {sel.application} dari {sel.source} ke {sel.destination}:{sel.port}
        </h3>
        <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
          <div>
            <dt className={LABEL}>Rule</dt>
            <dd className="mt-1 font-mono text-foreground">{sel.rule}</dd>
          </div>
          <div>
            <dt className={LABEL}>Action</dt>
            <dd className="mt-1">
              <StatusPill tone={sel.action === "allow" ? "ok" : "bad"}>
                {sel.action}
              </StatusPill>
            </dd>
          </div>
          <div>
            <dt className={LABEL}>Session end reason</dt>
            <dd className="mt-1 font-mono text-foreground">{sel.endReason}</dd>
          </div>
        </dl>
        <Note tone={reason.tone} title="Cara baca:">
          {reason.text}
          {sel.application === "incomplete" &&
            " Aplikasi incomplete berarti handshake TCP tidak selesai, jadi firewall belum sempat mengenali aplikasinya; biasanya server tujuan tidak merespons."}
        </Note>
      </article>

      <Note tone="info">
        Di GUI: <strong>Monitor &gt; Logs &gt; Traffic</strong>. Contoh filter
        untuk tiket portal:{" "}
        <code className="rounded bg-muted px-1 font-mono text-xs">
          ( addr.dst in 198.51.100.80 ) and ( action eq deny )
        </code>
      </Note>
    </>
  );
}
