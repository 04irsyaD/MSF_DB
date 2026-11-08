"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Tone } from "../../../lib/types";
import { FOCUS_RING, LABEL, chipClass } from "../../../lib/ui";
import Note from "../../../components/Note";
import TaskPanel, { type TaskMessage } from "../../../components/TaskPanel";
import SectionIntro from "../../../components/SectionIntro";
import { StatusDot, StatusPill } from "../../../components/StatusPill";
import TerminalInput from "../../../components/terminal/TerminalInput";
import TerminalScreen from "../../../components/terminal/TerminalScreen";
import {
  normalizeCommand,
  useTerminal,
} from "../../../components/terminal/useTerminal";
import {
  RACADM_PROMPT,
  RACADM_WELCOME,
  runRacadm,
  type RacadmContext,
} from "../data/commands";
import {
  BASE_LOGS,
  BAY_COUNT,
  FAILED_BAY,
  IDRAC_HOST,
  IDRAC_IP,
  SERVICE_TAG,
  STEP_TEXT,
  simTimestamp,
  type DiskState,
  type LogEntry,
  type Severity,
} from "../data/idrac";

type IdracTab = "dash" | "storage" | "logs" | "term";

const TABS: { id: IdracTab; label: string }[] = [
  { id: "dash", label: "Dashboard" },
  { id: "storage", label: "Storage" },
  { id: "logs", label: "Logs" },
  { id: "term", label: "Terminal racadm" },
];

const QUICK_COMMANDS = [
  "racadm getsysinfo",
  "racadm getsel",
  "racadm storage get pdisks",
  "racadm getversion",
  "racadm techsupreport collect",
  "racadm serveraction powercycle",
];

const REBUILD_TICK_MS = 300;
const REBUILD_STEP = 5;

interface SimState {
  tab: IdracTab;
  dash: boolean;
  logs: boolean;
  blink: number | null;
  blinkedFailed: boolean;
  replaced: boolean;
  rebuild: number;
  done: boolean;
  lost: boolean;
  lostBay: number | null;
  msg: TaskMessage | null;
  /** Log tambahan dari aksi di simulasi, terbaru di depan. */
  events: LogEntry[];
}

const INITIAL: SimState = {
  tab: "dash",
  dash: false,
  logs: false,
  blink: null,
  blinkedFailed: false,
  replaced: false,
  rebuild: 0,
  done: false,
  lost: false,
  lostBay: null,
  msg: null,
  events: [],
};

const SEVERITY_TONE: Record<Severity, Tone> = {
  Critical: "bad",
  Warning: "warn",
  Info: "ok",
};
const DISK_TONE: Record<DiskState, Tone> = {
  Online: "ok",
  Rebuilding: "warn",
  Failed: "bad",
  Offline: "bad",
};

function diskStateOf(s: SimState, bay: number): DiskState {
  if (s.lost)
    return bay === FAILED_BAY || bay === s.lostBay ? "Failed" : "Offline";
  if (bay !== FAILED_BAY || s.done) return "Online";
  return s.replaced ? "Rebuilding" : "Failed";
}

function vdStateOf(s: SimState): [string, Tone] {
  if (s.lost) return ["Failed", "bad"];
  if (s.done) return ["Optimal", "ok"];
  if (s.replaced) return ["Rebuilding", "warn"];
  return ["Degraded", "warn"];
}

function Th({ children }: { children: ReactNode }) {
  return (
    <th
      scope="col"
      className={cn(LABEL, "border-b border-border px-3 py-2 text-left")}
    >
      {children}
    </th>
  );
}

export default function IdracSection({ active }: { active: boolean }) {
  const [s, setS] = useState<SimState>(INITIAL);
  const term = useTerminal(RACADM_WELCOME);

  const logs = useMemo(() => [...s.events, ...BASE_LOGS], [s.events]);
  const ctx: RacadmContext = { diskState: (bay) => diskStateOf(s, bay), logs };
  const steps = [s.dash, s.logs, s.blinkedFailed, s.replaced, s.done];
  const [vdLabel, vdTone] = vdStateOf(s);

  // Langkah 1 selesai begitu Dashboard benar-benar dilihat.
  useEffect(() => {
    if (active && s.tab === "dash" && !s.dash)
      setS((p) => ({ ...p, dash: true }));
  }, [active, s.tab, s.dash]);

  // Rebuild berjalan sendiri setelah disk yang benar diganti.
  const rebuilding = s.replaced && !s.done && !s.lost;
  useEffect(() => {
    if (!rebuilding) return;
    const t = window.setInterval(() => {
      setS((p) => {
        const rebuild = Math.min(100, p.rebuild + REBUILD_STEP);
        if (rebuild < 100) return { ...p, rebuild };
        return {
          ...p,
          rebuild,
          done: true,
          msg: {
            tone: "ok",
            body: (
              <>
                <strong>Selesai!</strong> Rebuild 100%, Virtual Disk kembali
                Optimal. Langkah terakhir di dunia nyata: cek Dashboard sehat,
                catat di tiket, dan tutup pekerjaan sesuai SOP.
              </>
            ),
          },
          events: [
            {
              time: simTimestamp(),
              severity: "Info",
              message: "Rebuild selesai. Virtual Disk 0 kembali Optimal.",
            },
            ...p.events,
          ],
        };
      });
    }, REBUILD_TICK_MS);
    return () => window.clearInterval(t);
  }, [rebuilding]);

  function openTab(tab: IdracTab) {
    setS((p) => ({
      ...p,
      tab,
      dash: p.dash || tab === "dash",
      logs: p.logs || tab === "logs",
    }));
  }

  function toggleBlink(bay: number) {
    setS((p) => {
      const blink = p.blink === bay ? null : bay;
      if (blink === FAILED_BAY && !p.replaced && !p.lost) {
        return {
          ...p,
          blink,
          blinkedFailed: true,
          msg: {
            tone: "ok",
            body: (
              <>
                Lampu disk di <strong>bay {FAILED_BAY}</strong> sekarang
                berkedip. Di data center, cocokkan lampu ini dengan nomor bay,
                lalu ganti disknya.
              </>
            ),
          },
        };
      }
      if (blink !== null && blink !== FAILED_BAY) {
        return {
          ...p,
          blink,
          msg: {
            tone: "warn",
            body: (
              <>
                Kamu menyalakan Blink pada <strong>disk {blink}</strong>,
                padahal statusnya Online. Cek lagi tabel: disk mana yang Failed?
              </>
            ),
          },
        };
      }
      return { ...p, blink };
    });
  }

  function replaceBay(bay: number) {
    if (s.lost || s.replaced) {
      toast("Klik 'Ulangi simulasi' untuk mencoba lagi.");
      return;
    }
    if (bay !== FAILED_BAY) {
      setS((p) => ({
        ...p,
        lost: true,
        lostBay: bay,
        blink: null,
        msg: {
          tone: "bad",
          body: (
            <>
              <strong>Salah cabut!</strong> Disk di bay {bay} masih sehat. RAID
              5 sudah kehilangan disk {FAILED_BAY}, jadi sekarang 2 disk hilang
              dan <strong>Virtual Disk gagal, data hilang</strong>. Di dunia
              nyata ini incident besar. Pelajaran: selalu Blink dan cocokkan bay
              sebelum mencabut.
            </>
          ),
        },
        events: [
          {
            time: simTimestamp(),
            severity: "Critical",
            message: "Virtual Disk 0 gagal. Dua disk hilang dari RAID 5.",
          },
          ...p.events,
        ],
      }));
      return;
    }
    setS((p) => ({
      ...p,
      replaced: true,
      blink: null,
      blinkedFailed: true,
      msg: p.blinkedFailed
        ? {
            tone: "ok",
            body: `Benar. Disk di bay ${FAILED_BAY} diganti. Rebuild berjalan; selama rebuild RAID masih rentan, jadi hindari pekerjaan berat di server ini.`,
          }
        : {
            tone: "warn",
            body: (
              <>
                Bay-nya benar, tapi kamu belum menyalakan <strong>Blink</strong>
                . Kali ini beruntung. Di lapangan, biasakan Blink dulu supaya
                tidak salah slot.
              </>
            ),
          },
      events: [
        {
          time: simTimestamp(),
          severity: "Info",
          message: `Disk baru terpasang di bay ${FAILED_BAY}. Rebuild dimulai.`,
        },
        ...p.events,
      ],
    }));
  }

  function runCommand(raw: string) {
    const result = runRacadm(raw, ctx);
    if (!result) return;
    term.append(`${RACADM_PROMPT} ${normalizeCommand(raw)}`, result);
    if (result.readLogs) setS((p) => ({ ...p, logs: true }));
  }

  function reset() {
    setS(INITIAL);
    term.show();
  }

  const storageTile: [string, Tone] = s.lost
    ? ["Critical", "bad"]
    : s.done
      ? ["OK", "ok"]
      : s.replaced
        ? ["Rebuilding", "warn"]
        : ["Critical", "bad"];

  return (
    <>
      <SectionIntro title="Simulasi iDRAC: ganti disk rusak">
        iDRAC dibuka lewat browser di IP-nya sendiri. Di simulasi ini ada alert
        disk. Tugasmu: temukan disk yang rusak, nyalakan{" "}
        <strong className="text-foreground">Blink</strong>, ganti disk di bay
        yang benar, lalu tunggu rebuild.
      </SectionIntro>

      <TaskPanel
        steps={STEP_TEXT}
        done={steps}
        onReset={reset}
        msg={s.msg}
        idle={
          <>
            Mulai dari tab{" "}
            <strong className="text-foreground">Dashboard</strong>, lalu cari
            tahu komponen mana yang bermasalah.
          </>
        }
        extra={
          rebuilding && (
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground">
                Rebuild: {s.rebuild}%
              </p>
              <div
                role="progressbar"
                aria-label="Progres rebuild"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={s.rebuild}
                className="h-2.5 overflow-hidden rounded-md bg-muted"
              >
                <div
                  className="h-full bg-amber-500 transition-[width] duration-300 ease-linear"
                  style={{ width: `${s.rebuild}%` }}
                />
              </div>
            </div>
          )
        }
      />

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-2 bg-[#1f2933] px-4 py-2.5 text-[#e8edf1]">
          <span className="text-sm font-bold">iDRAC · {IDRAC_HOST}</span>
          <span className="font-mono text-[11px] text-[#a9b6c1]">
            https://{IDRAC_IP} · Service Tag {SERVICE_TAG} · simulasi
          </span>
        </div>
        <div
          role="tablist"
          aria-label="Menu iDRAC"
          className="flex overflow-x-auto border-b border-border bg-muted/50"
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`idrac-tab-${t.id}`}
              aria-selected={s.tab === t.id}
              aria-controls="idrac-panel"
              onClick={() => openTab(t.id)}
              className={cn(
                "whitespace-nowrap border-b-2 px-3.5 py-2.5 text-[13px] transition-colors sm:px-4",
                FOCUS_RING,
                "focus-visible:ring-offset-0",
                s.tab === t.id
                  ? "border-accent font-semibold text-foreground"
                  : "border-transparent font-medium text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div
          id="idrac-panel"
          role="tabpanel"
          aria-labelledby={`idrac-tab-${s.tab}`}
          className="flex flex-col gap-3.5 p-3.5 sm:p-4"
        >
          {s.tab === "dash" && (
            <>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {(
                  [
                    [
                      "System",
                      s.done ? "Healthy" : "Warning",
                      s.done ? "ok" : "warn",
                    ],
                    ["Storage", storageTile[0], storageTile[1]],
                    ["Power Supplies", "OK", "ok"],
                    ["Fans", "OK", "ok"],
                    ["Temperatures", "OK", "ok"],
                    ["Memory", "OK", "ok"],
                  ] as [string, string, Tone][]
                ).map(([name, st, tone]) => {
                  const body = (
                    <>
                      <span className="text-xs text-muted-foreground">
                        {name}
                      </span>
                      <span className="mt-1 flex items-center gap-1.5 text-[13px] font-bold text-foreground">
                        <StatusDot tone={tone} className="h-2.5 w-2.5" />
                        {st}
                      </span>
                    </>
                  );
                  return name === "Storage" ? (
                    <button
                      key={name}
                      type="button"
                      onClick={() => openTab("storage")}
                      aria-label={`Storage: ${st}. Buka tab Storage`}
                      className={cn(
                        "flex flex-col rounded-lg border border-border bg-card p-2.5 text-left transition-colors hover:border-accent/50",
                        FOCUS_RING,
                      )}
                    >
                      {body}
                    </button>
                  ) : (
                    <div
                      key={name}
                      className="flex flex-col rounded-lg border border-border bg-card p-2.5"
                    >
                      {body}
                    </div>
                  );
                })}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[13px]">
                  <tbody>
                    {[
                      ["Host name", IDRAC_HOST],
                      ["Model", "PowerEdge R760 (simulasi)"],
                      ["Service Tag", SERVICE_TAG],
                      ["Power", "ON"],
                      ["iDRAC IP", IDRAC_IP],
                    ].map(([k, v]) => (
                      <tr
                        key={k}
                        className="border-b border-border last:border-b-0"
                      >
                        <th
                          scope="row"
                          className={cn(LABEL, "w-36 px-2 py-2 text-left")}
                        >
                          {k}
                        </th>
                        <td className="px-2 py-2 text-foreground">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {s.done ? (
                <Note tone="ok">Semua komponen sehat.</Note>
              ) : (
                <Note tone="warn">
                  Ada alert di <strong>Storage</strong>. Klik tile Storage atau
                  buka tab Logs untuk detailnya.
                </Note>
              )}
            </>
          )}

          {s.tab === "storage" && (
            <>
              <p className="flex flex-wrap items-center gap-2 text-sm">
                <strong className="text-foreground">Virtual Disk 0</strong>
                <span className="text-muted-foreground">· RAID 5 ·</span>
                <StatusPill tone={vdTone}>{vdLabel}</StatusPill>
              </p>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full min-w-[380px] border-collapse text-[13px]">
                  <thead>
                    <tr className="bg-muted/60">
                      <Th>Disk</Th>
                      <Th>Tipe</Th>
                      <Th>Status</Th>
                      <Th>Aksi</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: BAY_COUNT }, (_, i) => {
                      const st = diskStateOf(s, i);
                      const blinking = s.blink === i;
                      return (
                        <tr
                          key={i}
                          className={cn(
                            "border-b border-border last:border-b-0",
                            st !== "Online" && "bg-rose-500/5",
                          )}
                        >
                          <td className="px-3 py-2 font-mono text-foreground">
                            Disk {i}
                          </td>
                          <td className="px-3 py-2 text-muted-foreground">
                            SSD 1,92 TB
                          </td>
                          <td className="px-3 py-2">
                            <StatusPill tone={DISK_TONE[st]}>{st}</StatusPill>
                          </td>
                          <td className="px-3 py-1.5">
                            <button
                              type="button"
                              onClick={() => toggleBlink(i)}
                              aria-pressed={blinking}
                              aria-label={
                                blinking
                                  ? `Hentikan Blink disk ${i}`
                                  : `Blink disk ${i}`
                              }
                              className={cn(
                                "min-h-8 rounded-md border px-2.5 text-xs font-medium transition-colors",
                                FOCUS_RING,
                                blinking
                                  ? "border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-300"
                                  : "border-border bg-card text-foreground hover:border-accent/50",
                              )}
                            >
                              {blinking ? "Stop Blink" : "Blink"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-foreground">
                  Tampak depan server (di data center)
                </h4>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Klik bay untuk{" "}
                  <strong className="text-foreground">
                    mencabut dan mengganti
                  </strong>{" "}
                  disk di slot itu.
                </p>
              </div>
              <div className="grid grid-cols-4 gap-1.5 rounded-lg bg-[#2b3036] p-2 sm:p-2.5">
                {Array.from({ length: BAY_COUNT }, (_, i) => {
                  const st = diskStateOf(s, i);
                  const fault = st === "Failed" || st === "Offline";
                  const activity = st === "Online" || st === "Rebuilding";
                  const blinking = s.blink === i;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => replaceBay(i)}
                      aria-label={`Cabut dan ganti disk di bay ${i}${blinking ? " (sedang Blink)" : ""}`}
                      className={cn(
                        "relative h-[54px] rounded-[5px] border bg-[#1c2025] pl-6 pr-1 text-left font-sans text-[11px] font-semibold text-[#b8c0c9] transition-colors sm:pl-7 sm:text-xs",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300",
                        blinking
                          ? "border-[#ffae1a]"
                          : "border-[#4a5159] hover:border-emerald-300/70",
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "absolute left-2 top-3 h-2 w-2 rounded-full sm:left-2.5",
                          activity
                            ? "bg-[#3ad06b] shadow-[0_0_6px_#3ad06b]"
                            : "bg-[#30363d]",
                        )}
                      />
                      <span
                        aria-hidden
                        className={cn(
                          "absolute left-2 top-[30px] h-2 w-2 rounded-full sm:left-2.5",
                          fault || blinking
                            ? "bg-[#ffae1a] shadow-[0_0_6px_#ffae1a]"
                            : "bg-[#30363d]",
                          blinking &&
                            "animate-pulse [animation-duration:700ms] motion-reduce:animate-none",
                        )}
                      />
                      Bay {i}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {s.tab === "logs" && (
            <>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full min-w-[460px] border-collapse text-[13px]">
                  <thead>
                    <tr className="bg-muted/60">
                      <Th>Waktu</Th>
                      <Th>Severity</Th>
                      <Th>Pesan</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((l, i) => (
                      <tr
                        key={`${l.time}-${i}`}
                        className="border-b border-border align-top last:border-b-0"
                      >
                        <td className="whitespace-nowrap px-3 py-2 font-mono text-xs text-muted-foreground">
                          {l.time}
                        </td>
                        <td className="px-3 py-2">
                          <StatusPill tone={SEVERITY_TONE[l.severity]}>
                            {l.severity}
                          </StatusPill>
                        </td>
                        <td className="px-3 py-2 text-foreground">
                          {l.message}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Note tone="info">
                Ini gabungan SEL dan Lifecycle Log. Catat waktu dan pesan error
                untuk laporan dan tiket ke Dell.
              </Note>
            </>
          )}

          {s.tab === "term" && (
            <>
              <TerminalScreen
                lines={term.lines}
                label="Terminal racadm iDRAC"
              />
              <TerminalInput
                prompt={RACADM_PROMPT}
                placeholder="ketik perintah, mis. racadm getsysinfo"
                label="Perintah racadm"
                onRun={runCommand}
              />
              <div
                role="group"
                aria-label="Perintah cepat"
                className="flex flex-wrap gap-1.5"
              >
                {QUICK_COMMANDS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => runCommand(c)}
                    className={cn(chipClass(false), "font-mono")}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
