"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CARD, FOCUS_RING } from "../../../lib/ui";
import Note from "../../../components/Note";
import SectionIntro from "../../../components/SectionIntro";
import {
  DISK_MAX,
  DISK_MIN,
  DISK_SIZES,
  RAID_LEVELS,
  diskRole,
  fmtTb,
  invalidReason,
  isDataLost,
  raidInfo,
  type DiskRole,
  type RaidLevel,
} from "../data/raid";

/**
 * Warna peran disk sengaja netral/biru/ungu supaya tidak tertukar dengan warna status
 * (hijau OK, amber warning). Hanya disk rusak yang merah.
 */
const ROLE_CLASS: Record<DiskRole | "failed", string> = {
  data: "border-muted-foreground/40 bg-muted",
  parity: "border-blue-500/60 bg-blue-500/10",
  mirror: "border-purple-500/60 bg-purple-500/10",
  failed: "border-rose-500 bg-rose-500/10 line-through",
};

const LEGEND: { cls: string; label: string }[] = [
  { cls: ROLE_CLASS.data, label: "data" },
  { cls: ROLE_CLASS.parity, label: "porsi paritas" },
  { cls: ROLE_CLASS.mirror, label: "mirror" },
  { cls: ROLE_CLASS.failed, label: "rusak" },
];

const SELECT = cn(
  "w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground",
  FOCUS_RING,
);

export default function RaidSection() {
  const [level, setLevel] = useState<RaidLevel>(5);
  const [n, setN] = useState(6);
  const [size, setSize] = useState(1.92);
  const [failed, setFailed] = useState<number[]>([]);

  const info = raidInfo(level, n);
  const usable = info.usable * size;
  const raw = n * size;
  const lost = isDataLost(level, failed);

  function toggleDisk(i: number) {
    setFailed((f) => (f.includes(i) ? f.filter((x) => x !== i) : [...f, i]));
  }

  return (
    <>
      <SectionIntro title="Kalkulator dan simulasi RAID">
        Pilih level RAID dan jumlah disk. Lalu klik disk untuk
        &quot;merusaknya&quot; dan lihat apakah data masih aman.
      </SectionIntro>

      <div className={cn(CARD, "flex flex-col gap-4")}>
        <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-3">
          <div>
            <label
              htmlFor="raid-level"
              className="mb-1 block text-[13px] font-semibold text-muted-foreground"
            >
              Level RAID
            </label>
            <select
              id="raid-level"
              value={level}
              onChange={(e) => {
                setLevel(Number(e.target.value) as RaidLevel);
                setFailed([]);
              }}
              className={SELECT}
            >
              {RAID_LEVELS.map((l) => (
                <option key={l} value={l}>
                  RAID {l}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="raid-n"
              className="mb-1 block text-[13px] font-semibold text-muted-foreground"
            >
              Jumlah disk:{" "}
              <span className="font-mono text-foreground">{n}</span>
            </label>
            <input
              id="raid-n"
              type="range"
              min={DISK_MIN}
              max={DISK_MAX}
              value={n}
              onChange={(e) => {
                setN(Number(e.target.value));
                setFailed([]);
              }}
              className="h-10 w-full accent-[hsl(var(--accent))]"
            />
          </div>
          <div>
            <label
              htmlFor="raid-size"
              className="mb-1 block text-[13px] font-semibold text-muted-foreground"
            >
              Ukuran per disk
            </label>
            <select
              id="raid-size"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className={SELECT}
            >
              {DISK_SIZES.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Disk. Klik untuk merusak atau memperbaiki"
        >
          {Array.from({ length: n }, (_, i) => {
            const isFailed = failed.includes(i);
            const { role, label } = diskRole(level, n, i);
            return (
              <button
                key={i}
                type="button"
                onClick={() => toggleDisk(i)}
                aria-pressed={isFailed}
                aria-label={`Disk ${i}, ${isFailed ? "rusak" : label}`}
                className={cn(
                  "flex h-[76px] w-16 flex-col items-center justify-center gap-0.5 rounded-lg border-2 p-1 text-[11px] font-semibold text-foreground transition-colors",
                  FOCUS_RING,
                  ROLE_CLASS[isFailed ? "failed" : role],
                )}
              >
                Disk {i}
                <span className="text-center text-[10px] font-medium leading-tight text-muted-foreground">
                  {isFailed ? "rusak" : label}
                </span>
              </button>
            );
          })}
        </div>

        <ul
          className="flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-muted-foreground"
          aria-label="Keterangan warna disk"
        >
          {LEGEND.map((l) => (
            <li key={l.label} className="flex items-center gap-1.5">
              <span
                aria-hidden
                className={cn(
                  "inline-block h-3 w-3 rounded-[3px] border-2 no-underline",
                  l.cls,
                )}
              />
              {l.label}
            </li>
          ))}
        </ul>

        {info.ok ? (
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {[
              [`${fmtTb(usable)} TB`, "kapasitas terpakai"],
              [`${fmtTb(raw)} TB`, "total mentah"],
              [`${Math.round((usable / raw) * 100)}%`, "efisiensi"],
              [info.tolerance, "tahan rusak"],
            ].map(([v, k]) => (
              <div
                key={k}
                className="rounded-lg border border-border bg-card p-2.5"
              >
                <b className="block text-xl font-bold text-foreground">{v}</b>
                <span className="text-xs text-muted-foreground">{k}</span>
              </div>
            ))}
          </div>
        ) : (
          <Note tone="bad" title="Konfigurasi tidak valid">
            {invalidReason(level, info.min)}
          </Note>
        )}

        {info.ok &&
          (failed.length === 0 ? (
            <Note tone="ok">
              <strong>Optimal.</strong> Klik disk untuk mensimulasikan disk
              rusak.
            </Note>
          ) : lost ? (
            <Note tone="bad">
              <strong>Data hilang.</strong> {failed.length} disk rusak melebihi
              toleransi RAID {level}
              {level === 10
                ? " (dua disk dalam satu pasangan mirror rusak)."
                : "."}
            </Note>
          ) : (
            <Note tone="warn">
              <strong>Degraded.</strong> Data masih bisa diakses, tapi
              perlindungan berkurang. Segera ganti disk rusak dan tunggu
              rebuild.
            </Note>
          ))}

        <p className="text-[13px] text-muted-foreground">
          <strong className="text-foreground">RAID {level}:</strong> {info.note}{" "}
          Cocok untuk: {info.use}.
        </p>
      </div>
    </>
  );
}
