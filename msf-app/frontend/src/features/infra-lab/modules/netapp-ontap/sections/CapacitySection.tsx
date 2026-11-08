"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CARD, FOCUS_RING } from "../../../lib/ui";
import Note from "../../../components/Note";
import SectionIntro from "../../../components/SectionIntro";

const SIZES = [500, 1000, 2000];

const SELECT = cn(
  "w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground",
  FOCUS_RING,
);
const RANGE = "h-10 w-full accent-[hsl(var(--accent))]";
const LBL = "mb-1 block text-[13px] font-semibold text-muted-foreground";

const fmt = (n: number) => String(Math.round(n * 10) / 10).replace(".", ",");

export default function CapacitySection() {
  const [size, setSize] = useState(1000);
  const [reserve, setReserve] = useState(5);
  const [data, setData] = useState(600);
  const [change, setChange] = useState(3);
  const [days, setDays] = useState(7);

  const reserveGB = (size * reserve) / 100;
  const dataSpace = size - reserveGB;
  const snapUse = (data * change * days) / 100;
  const spill = Math.max(0, snapUse - reserveGB);
  const used = data + spill;
  const pct = Math.round((used / dataSpace) * 100);
  const tone = pct >= 90 ? "bad" : pct >= 80 ? "warn" : "ok";

  const seg = (gb: number) =>
    `${Math.max(0, Math.min(100, (gb / size) * 100))}%`;

  return (
    <>
      <SectionIntro title="Snapshot & kapasitas">
        Snapshot hanya menyimpan blok yang berubah, tapi lama-lama ikut memakan
        ruang. Atur angka di bawah untuk melihat kapan snapshot mulai menekan
        ruang data.
      </SectionIntro>

      <div className={cn(CARD, "flex flex-col gap-4")}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label htmlFor="cap-size" className={LBL}>
              Ukuran volume
            </label>
            <select
              id="cap-size"
              value={size}
              onChange={(e) => {
                const s = Number(e.target.value);
                setSize(s);
                setData((d) => Math.min(d, s));
              }}
              className={SELECT}
            >
              {SIZES.map((s) => (
                <option key={s} value={s}>
                  {s >= 1000 ? `${s / 1000} TB` : `${s} GB`}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="cap-data" className={LBL}>
              Data aktif:{" "}
              <span className="font-mono text-foreground">{data} GB</span>
            </label>
            <input
              id="cap-data"
              type="range"
              min={0}
              max={size}
              step={10}
              value={data}
              onChange={(e) => setData(Number(e.target.value))}
              className={RANGE}
            />
          </div>
          <div>
            <label htmlFor="cap-reserve" className={LBL}>
              Snapshot reserve:{" "}
              <span className="font-mono text-foreground">{reserve}%</span>
            </label>
            <input
              id="cap-reserve"
              type="range"
              min={0}
              max={30}
              step={5}
              value={reserve}
              onChange={(e) => setReserve(Number(e.target.value))}
              className={RANGE}
            />
          </div>
          <div>
            <label htmlFor="cap-change" className={LBL}>
              Data berubah per hari:{" "}
              <span className="font-mono text-foreground">{change}%</span>
            </label>
            <input
              id="cap-change"
              type="range"
              min={1}
              max={10}
              value={change}
              onChange={(e) => setChange(Number(e.target.value))}
              className={RANGE}
            />
          </div>
          <div>
            <label htmlFor="cap-days" className={LBL}>
              Retensi snapshot harian:{" "}
              <span className="font-mono text-foreground">{days} hari</span>
            </label>
            <input
              id="cap-days"
              type="range"
              min={1}
              max={30}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className={RANGE}
            />
          </div>
        </div>

        <div>
          <div
            className="relative flex h-6 overflow-hidden rounded-md border border-border bg-muted"
            role="img"
            aria-label={`Data ${fmt(data)} GB, snapshot ${fmt(snapUse)} GB, dari volume ${size} GB`}
          >
            <div
              className="h-full bg-muted-foreground/50"
              style={{ width: seg(data) }}
            />
            <div
              className="h-full bg-blue-500/70"
              style={{ width: seg(snapUse) }}
            />
            <div
              className="absolute inset-y-0 border-l-2 border-dashed border-foreground/60"
              style={{ left: seg(dataSpace) }}
            />
          </div>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <li className="flex items-center gap-1.5">
              <span
                aria-hidden
                className="h-3 w-3 rounded-sm bg-muted-foreground/50"
              />
              data aktif
            </li>
            <li className="flex items-center gap-1.5">
              <span aria-hidden className="h-3 w-3 rounded-sm bg-blue-500/70" />
              snapshot
            </li>
            <li className="flex items-center gap-1.5">
              <span
                aria-hidden
                className="h-3 w-0 border-l-2 border-dashed border-foreground/60"
              />
              batas snapshot reserve
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {[
            [`${fmt(dataSpace)} GB`, "ruang untuk data"],
            [`${fmt(reserveGB)} GB`, "snapshot reserve"],
            [`${fmt(snapUse)} GB`, "perkiraan snapshot"],
            [`${pct}%`, "terpakai (Used%)"],
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

        <Note tone={tone}>
          {tone === "ok" && <strong>Aman. </strong>}
          {tone === "warn" && <strong>Mulai padat. </strong>}
          {tone === "bad" && <strong>Berisiko penuh. </strong>}
          Used% ruang data {pct}%.
          {spill > 0
            ? ` Snapshot melebihi reserve sebanyak ${fmt(spill)} GB dan ikut memakan ruang data.`
            : " Snapshot masih muat di dalam reserve."}
        </Note>

        <p className="text-[13px] text-muted-foreground">
          Perkiraan kasar: setiap hari {change}% data berubah, dan semua
          snapshot harian disimpan {days} hari. Angka asli dilihat dengan volume
          snapshot show dan volume show-space.
        </p>
      </div>
    </>
  );
}
