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
import { BAD_PORT, SW_HOST, SW_MGMT_IP, UPLINK_PORT } from "../data/device";
import {
  initialIos,
  iosPrompt,
  runIos,
  type IosState,
  type PortStatus,
} from "../data/ios";

const STEPS = [
  "Masuk Privileged EXEC (enable)",
  "Cari port bermasalah (show interfaces status)",
  "Cari penyebabnya (show logging)",
  `Masuk ke interface ${BAD_PORT}`,
  "Pulihkan port: shutdown lalu no shutdown",
  "Simpan konfigurasi (write memory)",
];

const QUICK = [
  "enable",
  "show interfaces status",
  "show logging",
  "configure terminal",
  "interface gi1/0/12",
  "shutdown",
  "no shutdown",
  "end",
  "write memory",
];

const WELCOME = [
  {
    tone: "dim" as const,
    text: `Login SSH ke ${SW_MGMT_IP} sebagai ops-demo (simulasi). Ketik ? untuk bantuan.`,
  },
];

const PORT_TONE: Record<PortStatus, Tone> = {
  connected: "ok",
  notconnect: "warn",
  "err-disabled": "bad",
  disabled: "warn",
};

interface Sim {
  ios: IosState;
  done: boolean[];
  msg: TaskMessage | null;
}

const INITIAL: Sim = {
  ios: initialIos("user"),
  done: STEPS.map(() => false),
  msg: null,
};

export default function PortSimSection() {
  const [sim, setSim] = useState<Sim>(INITIAL);
  const term = useTerminal(WELCOME);

  function run(raw: string) {
    const r = runIos(raw, sim.ios);
    if (!r) return;
    term.append(`${iosPrompt(sim.ios)} ${normalizeCommand(raw)}`, {
      lines: r.lines,
      clear: r.clear,
    });

    const done = [...sim.done];
    let msg = sim.msg;
    for (const e of r.events) {
      switch (e) {
        case "enable":
          done[0] = true;
          break;
        case "status":
          if (!done[1]) {
            msg = {
              tone: "ok",
              body: (
                <>
                  Ketemu: <strong>{BAD_PORT}</strong> (PC-HR-07) berstatus
                  err-disabled. Sebelum menyalakan ulang, cari tahu penyebabnya
                  di show logging.
                </>
              ),
            };
          }
          done[1] = true;
          break;
        case "logs":
          if (!done[2]) {
            msg = {
              tone: "ok",
              body: (
                <>
                  Penyebabnya <strong>port-security</strong>: ada MAC asing
                  (0200.5e00.0999) di port itu, kemungkinan user memasang switch
                  kecil atau laptop pribadi. Di dunia nyata, pastikan perangkat
                  asing sudah dicabut dulu, lalu pulihkan port.
                </>
              ),
            };
          }
          done[2] = true;
          break;
        case "enterBad":
          done[3] = true;
          break;
        case "noShutErr":
          msg = {
            tone: "warn",
            body: "Port err-disabled tidak pulih hanya dengan no shutdown. Jalankan shutdown dulu, lalu no shutdown.",
          };
          break;
        case "bounced":
          done[4] = true;
          msg = done[2]
            ? {
                tone: "ok",
                body: `${BAD_PORT} kembali connected. Verifikasi dengan show interfaces status, lalu simpan dengan write memory.`,
              }
            : {
                tone: "warn",
                body: (
                  <>
                    Port kembali up, tapi kamu belum mengecek penyebabnya di{" "}
                    <strong>show logging</strong>. Kalau perangkat asing masih
                    tercolok, port akan err-disabled lagi.
                  </>
                ),
              };
          break;
        case "saved":
          if (done[4]) {
            done[5] = true;
            msg = {
              tone: "ok",
              body: (
                <>
                  <strong>Selesai!</strong> Port pulih dan konfigurasi
                  tersimpan. Catat di tiket: penyebab (port-security, MAC asing)
                  dan tindakanmu.
                </>
              ),
            };
          }
          break;
        case "userPortDown":
          msg = {
            tone: "warn",
            body: (
              <>
                Kamu mematikan <strong>{r.port?.name}</strong> ({r.port?.desc})
                yang sedang dipakai. User di port itu ikut putus! Masuk ke
                interface itu lagi dan jalankan no shutdown.
              </>
            ),
          };
          break;
        case "userPortUp":
          msg = {
            tone: "ok",
            body: `${r.port?.name} kembali connected. Cek nomor port sebelum shutdown.`,
          };
          break;
        case "uplinkDown":
          msg = {
            tone: "bad",
            body: (
              <>
                <strong>Insiden!</strong> {UPLINK_PORT} adalah uplink ke core.
                Semua user di switch ini terputus, dan sesi SSH kamu (lewat IP
                manajemen {SW_MGMT_IP} di VLAN 99) ikut putus. Pemulihan harus
                ke data center pakai kabel console. Pelajaran: cek description
                dan show interfaces status sebelum shutdown.
              </>
            ),
          };
          break;
        case "danger":
          msg = {
            tone: "warn",
            body: "Perintah itu ditolak simulasi: berdampak ke semua user di switch dan butuh MOP.",
          };
          break;
      }
    }
    setSim({ ios: r.state, done, msg });
  }

  function reset() {
    setSim(INITIAL);
    term.show();
  }

  return (
    <>
      <SectionIntro title="Simulasi: port user mati">
        Latihan troubleshooting lewat CLI. Cari port yang bermasalah, cari
        penyebabnya, pulihkan port yang benar, lalu simpan. Perintah boleh
        disingkat seperti di switch asli (mis. en, sh int status, conf t, int
        gi1/0/12, shut).
      </SectionIntro>

      <Note tone="info" title="Tiket">
        User PC-HR-07 (lantai 2) tidak bisa terhubung ke jaringan sejak pagi.
        Port-nya ada di {SW_HOST}. Kamu login lewat SSH ke IP manajemen{" "}
        {SW_MGMT_IP}.
      </Note>

      <TaskPanel
        steps={STEPS}
        done={sim.done}
        onReset={reset}
        msg={sim.msg}
        idle="Mulai dengan enable, lalu cari port yang bermasalah."
      />

      <div className={cn(CARD, "flex flex-col gap-3")}>
        <div>
          <p className={cn(LABEL, "mb-2")}>Kondisi port (dari monitoring)</p>
          <ul className="grid grid-cols-1 gap-1.5 min-[480px]:grid-cols-2 lg:grid-cols-3">
            {sim.ios.ports.map((p) => (
              <li
                key={p.name}
                className="flex items-center justify-between gap-2 rounded-lg border border-border px-2.5 py-1.5"
              >
                <span className="min-w-0 truncate text-xs">
                  <span className="font-mono font-semibold text-foreground">
                    {p.name}
                  </span>{" "}
                  <span className="text-muted-foreground">{p.desc}</span>
                </span>
                <StatusPill tone={sim.ios.closed ? "bad" : PORT_TONE[p.status]}>
                  {sim.ios.closed && p.name !== UPLINK_PORT
                    ? "putus"
                    : p.status}
                </StatusPill>
              </li>
            ))}
          </ul>
        </div>

        <TerminalScreen lines={term.lines} label={`Terminal SSH ${SW_HOST}`} />
        <TerminalInput
          prompt={iosPrompt(sim.ios)}
          placeholder={
            sim.ios.closed ? "sesi SSH terputus" : "ketik perintah, mis. enable"
          }
          label="Perintah Cisco IOS"
          onRun={run}
          disabled={sim.ios.closed}
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
              disabled={sim.ios.closed}
              onClick={() => run(c)}
              className={cn(
                chipClass(false),
                "font-mono disabled:cursor-not-allowed disabled:opacity-50",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
