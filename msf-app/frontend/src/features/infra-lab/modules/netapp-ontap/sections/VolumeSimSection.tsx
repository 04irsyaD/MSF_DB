"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Tone } from "../../../lib/types";
import { CARD, LABEL, chipClass } from "../../../lib/ui";
import Note from "../../../components/Note";
import SectionIntro from "../../../components/SectionIntro";
import { StatusPill } from "../../../components/StatusPill";
import TaskPanel, { type TaskMessage } from "../../../components/TaskPanel";
import TerminalInput from "../../../components/terminal/TerminalInput";
import TerminalScreen from "../../../components/terminal/TerminalScreen";
import {
  normalizeCommand,
  useTerminal,
} from "../../../components/terminal/useTerminal";
import { ONTAP_WELCOME } from "../data/commands";
import {
  INITIAL_ONTAP,
  ONTAP_PROMPT,
  TARGET_VOL,
  fmtSize,
  pctOf,
  runOntap,
  type OntapState,
} from "../data/ontap";

const STEPS = [
  "Baca alert di event log (event log show)",
  "Cek pemakaian volume (volume show)",
  "Cek ruang aggregate (storage aggregate show)",
  `Perbesar ${TARGET_VOL} sampai di bawah 90% (volume size)`,
  "Verifikasi dengan volume show",
];

const QUICK = [
  "event log show",
  "volume show",
  "storage aggregate show",
  "volume snapshot show -volume vol_app",
  "volume size -vserver svm_demo -volume vol_app -new-size +100g",
];

interface Sim {
  ontap: OntapState;
  done: boolean[];
  msg: TaskMessage | null;
}

const INITIAL: Sim = {
  ontap: INITIAL_ONTAP,
  done: STEPS.map(() => false),
  msg: null,
};

function pctTone(pct: number): Tone {
  return pct >= 90 ? "bad" : pct >= 80 ? "warn" : "ok";
}

export default function VolumeSimSection() {
  const [sim, setSim] = useState<Sim>(INITIAL);
  const term = useTerminal(ONTAP_WELCOME);
  const vol = sim.ontap.volumes.find((v) => v.name === TARGET_VOL)!;
  const pct = pctOf(vol);

  function run(raw: string) {
    const r = runOntap(raw, sim.ontap);
    if (!r) return;
    term.append(`${ONTAP_PROMPT} ${normalizeCommand(raw)}`, {
      lines: r.lines,
      clear: r.clear,
    });

    const done = [...sim.done];
    let msg = sim.msg;
    const newPct = pctOf(r.state.volumes.find((v) => v.name === TARGET_VOL)!);
    for (const e of r.events) {
      switch (e) {
        case "events":
          done[0] = true;
          break;
        case "volume":
          done[1] = true;
          if (done[3] && newPct < 90 && !done[4]) {
            done[4] = true;
            msg = {
              tone: "ok",
              body: (
                <>
                  <strong>Selesai!</strong> {TARGET_VOL} kini {newPct}%. Kabari
                  tim aplikasi, catat ukuran lama dan baru di tiket, lalu
                  rencanakan kapasitas jangka panjang bersama pemilik data.
                </>
              ),
            };
          }
          break;
        case "aggr":
          done[2] = true;
          break;
        case "snapshots":
          msg = {
            tone: "info",
            body: "Ada snapshot terjadwal (daily, weekly) dan satu snapshot SnapMirror. Menghapus snapshot hanya membebaskan sedikit ruang dan menghilangkan titik restore; solusi utamanya memperbesar volume.",
          };
          break;
        case "resized":
          if (newPct >= 90) {
            msg = {
              tone: "warn",
              body: `Ukuran bertambah, tapi Used% masih ${newPct}%. Tambah lagi sampai di bawah 90%.`,
            };
          } else {
            done[3] = true;
            if (!done[2]) {
              msg = {
                tone: "warn",
                body: (
                  <>
                    {TARGET_VOL} diperbesar ({newPct}%), tapi kamu belum
                    mengecek ruang aggregate. Biasakan jalankan{" "}
                    <strong>storage aggregate show</strong> sebelum menambah.
                  </>
                ),
              };
            } else if (newPct < 50) {
              msg = {
                tone: "warn",
                body: `Berhasil, tapi penambahannya terlalu besar (Used% kini ${newPct}%). Ruang aggregate dipakai bersama volume lain; targetkan sekitar 70-80%.`,
              };
            } else {
              msg = {
                tone: "ok",
                body: `${TARGET_VOL} diperbesar, Used% kini ${newPct}%. Verifikasi dengan volume show.`,
              };
            }
          }
          break;
        case "snapDeleted":
          msg = {
            tone: "warn",
            body: "Snapshot dihapus. Ruang bertambah sedikit, tapi titik restore hari itu hilang. Hapus snapshot hanya dengan persetujuan pemilik data.",
          };
          break;
        case "snapBusy":
          msg = {
            tone: "warn",
            body: "ONTAP menolak: snapshot itu milik SnapMirror (replikasi DR). Kalau dihapus paksa, replikasi bisa harus diulang dari awal.",
          };
          break;
        case "sizeError":
          msg = {
            tone: "warn",
            body: "Perintah gagal. Baca pesan error di layar, lalu coba lagi dengan ukuran yang masuk akal.",
          };
          break;
        case "danger":
          msg = {
            tone: "bad",
            body: "Perintah itu ditolak simulasi: bisa memutus layanan atau menghilangkan data.",
          };
          break;
      }
    }
    setSim({ ontap: r.state, done, msg });
  }

  function reset() {
    setSim(INITIAL);
    term.show();
  }

  return (
    <>
      <SectionIntro title="Simulasi: volume hampir penuh">
        Tangani alert kapasitas lewat CLI ONTAP. Pahami kondisinya dulu, lalu
        tambah ruang dengan aman tanpa menghapus data atau snapshot penting.
      </SectionIntro>

      <Note tone="info" title="Tiket">
        Tim aplikasi lapor upload file gagal sejak pagi. Monitoring menunjukkan
        volume {TARGET_VOL} di SVM svm_demo hampir penuh.
      </Note>

      <TaskPanel
        steps={STEPS}
        done={sim.done}
        onReset={reset}
        msg={sim.msg}
        idle="Mulai dari event log show untuk membaca alert-nya."
      />

      <div className={cn(CARD, "flex flex-col gap-3")}>
        <div>
          <p className={cn(LABEL, "mb-2")}>Monitoring</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-border p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-sm font-semibold text-foreground">
                  {TARGET_VOL}
                </span>
                <StatusPill tone={pctTone(pct)}>{pct}%</StatusPill>
              </div>
              <div
                role="progressbar"
                aria-label={`Pemakaian ${TARGET_VOL}`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={pct}
                className="mt-2 h-2 overflow-hidden rounded-full bg-muted"
              >
                <div
                  className={cn(
                    "h-full transition-[width]",
                    pct >= 90
                      ? "bg-rose-500"
                      : pct >= 80
                        ? "bg-amber-500"
                        : "bg-emerald-500",
                  )}
                  style={{ width: `${Math.min(100, pct)}%` }}
                />
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                {fmtSize(vol.usedGB)} terpakai dari {fmtSize(vol.sizeGB)}
              </p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <span className="font-mono text-sm font-semibold text-foreground">
                aggr1_01
              </span>
              <p className="mt-2 text-xl font-bold text-foreground">
                {fmtSize(sim.ontap.aggrAvailGB)}
              </p>
              <p className="text-xs text-muted-foreground">
                ruang kosong di aggregate
              </p>
            </div>
          </div>
        </div>

        <TerminalScreen lines={term.lines} label="Terminal CLI ONTAP" />
        <TerminalInput
          prompt={ONTAP_PROMPT}
          placeholder="ketik perintah, mis. event log show"
          label="Perintah ONTAP"
          onRun={run}
        />
        <div
          role="group"
          aria-label="Perintah cepat"
          className="flex flex-wrap gap-1.5"
        >
          {QUICK.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => run(c)}
              className={cn(chipClass(false), "break-all text-left font-mono")}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
