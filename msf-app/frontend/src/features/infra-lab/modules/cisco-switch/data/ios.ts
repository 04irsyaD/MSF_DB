import type { TermLine } from "../../../lib/types";
import { cliMatch, textBlock } from "../../../lib/cli";
import {
  BAD_PORT,
  SW_HOST,
  SW_MGMT_IP,
  SW_MODEL,
  SW_SERIAL,
  UPLINK_PORT,
} from "./device";

/**
 * Mesin CLI Cisco IOS simulasi. Fungsi murni: (input, state) -> state baru + output.
 * Dipakai bagian "Perintah show" (state tetap) dan "Simulasi port mati" (state berubah).
 */

export type IosMode = "user" | "priv" | "config" | "if";
export type PortStatus =
  "connected" | "notconnect" | "err-disabled" | "disabled";

export interface SwitchPort {
  name: string;
  full: string;
  desc: string;
  vlan: string;
  status: PortStatus;
  /** Status sebelum di-shutdown, untuk dikembalikan saat no shutdown. */
  before?: PortStatus;
  trunk?: boolean;
  ten?: boolean;
}

export interface IosState {
  mode: IosMode;
  current: string | null;
  ports: SwitchPort[];
  logs: string[];
  dirty: boolean;
  /** Sesi SSH terputus (uplink di-shutdown). */
  closed: boolean;
}

export type IosEvent =
  | "enable"
  | "status"
  | "logs"
  | "enterBad"
  | "bounced"
  | "noShutErr"
  | "userPortDown"
  | "userPortUp"
  | "uplinkDown"
  | "saved"
  | "danger";

export interface IosResult {
  state: IosState;
  lines: TermLine[];
  events: IosEvent[];
  commandId?: string;
  clear?: boolean;
  /** Port yang terkait event userPortDown / userPortUp. */
  port?: SwitchPort;
}

export const INITIAL_PORTS: SwitchPort[] = [
  {
    name: "Gi1/0/1",
    full: "GigabitEthernet1/0/1",
    desc: "PC-FINANCE-01",
    vlan: "10",
    status: "connected",
  },
  {
    name: "Gi1/0/2",
    full: "GigabitEthernet1/0/2",
    desc: "PC-FINANCE-02",
    vlan: "10",
    status: "connected",
  },
  {
    name: "Gi1/0/11",
    full: "GigabitEthernet1/0/11",
    desc: "AP-LT2",
    vlan: "20",
    status: "connected",
  },
  {
    name: BAD_PORT,
    full: "GigabitEthernet1/0/12",
    desc: "PC-HR-07",
    vlan: "10",
    status: "err-disabled",
  },
  {
    name: "Gi1/0/13",
    full: "GigabitEthernet1/0/13",
    desc: "PRINTER-LT2",
    vlan: "10",
    status: "notconnect",
  },
  {
    name: UPLINK_PORT,
    full: "TenGigabitEthernet1/1/1",
    desc: "UPLINK-CORE-A",
    vlan: "trunk",
    status: "connected",
    trunk: true,
    ten: true,
  },
];

const BASE_LOGS = [
  `*Nov  7 17:02:41.120: %SYS-5-CONFIG_I: Configured from console by ops-demo on vty0 (192.0.2.50)`,
  `*Nov  8 08:14:02.311: %PORT_SECURITY-2-PSECURE_VIOLATION: Security violation occurred, caused by MAC address 0200.5e00.0999 on port GigabitEthernet1/0/12.`,
  `*Nov  8 08:14:02.315: %PM-4-ERR_DISABLE: psecure-violation error detected on Gi1/0/12, putting Gi1/0/12 in err-disable state`,
  `*Nov  8 08:14:03.318: %LINK-3-UPDOWN: Interface GigabitEthernet1/0/12, changed state to down`,
];

export function initialIos(mode: IosMode = "user"): IosState {
  return {
    mode,
    current: null,
    ports: INITIAL_PORTS,
    logs: BASE_LOGS,
    dirty: false,
    closed: false,
  };
}

export function iosPrompt(s: IosState) {
  switch (s.mode) {
    case "user":
      return `${SW_HOST}>`;
    case "priv":
      return `${SW_HOST}#`;
    case "config":
      return `${SW_HOST}(config)#`;
    case "if":
      return `${SW_HOST}(config-if)#`;
  }
}

function stamp() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `*Nov  8 ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}.000`;
}

/** "gi 1/0/12", "g1/0/12", "GigabitEthernet1/0/12", "te1/1/1" -> nama pendek, atau null. */
export function parseIf(arg: string): string | null {
  const m = arg.match(/^([a-z]+)(\d+\/\d+\/\d+)$/i);
  if (!m) return null;
  const kind = m[1].toLowerCase();
  if ("gigabitethernet".startsWith(kind)) return `Gi${m[2]}`;
  if ("tengigabitethernet".startsWith(kind)) return `Te${m[2]}`;
  return null;
}

const INVALID: TermLine[] = [
  { tone: "plain", text: "              ^" },
  { tone: "err", text: "% Invalid input detected at '^' marker." },
];

function lineTone(log: string): TermLine["tone"] {
  const sev = log.match(/%[A-Z_]+-(\d)-/)?.[1];
  if (sev === undefined) return "plain";
  if (Number(sev) <= 3) return "err";
  if (Number(sev) === 4) return "warn";
  return "plain";
}

const STATUS_PROTO: Record<PortStatus, [string, string]> = {
  connected: ["up", "up"],
  notconnect: ["down", "down"],
  "err-disabled": ["down", "down"],
  disabled: ["administratively down", "down"],
};

function ifStatusLines(ports: SwitchPort[]): TermLine[] {
  const head = `${"Port".padEnd(10)} ${"Name".padEnd(16)} ${"Status".padEnd(12)} ${"Vlan".padEnd(8)} Duplex  Speed Type`;
  return [
    { tone: "dim", text: head },
    ...ports.map((p): TermLine => {
      const up = p.status === "connected";
      const duplex = up ? (p.ten ? "  full" : "a-full") : "  auto";
      const speed = up ? (p.ten ? "   10G" : "a-1000") : "  auto";
      const type = p.ten ? "SFP-10GBase-SR" : "10/100/1000BaseTX";
      return {
        tone:
          p.status === "err-disabled"
            ? "err"
            : p.status === "disabled"
              ? "warn"
              : "plain",
        text: `${p.name.padEnd(10)} ${p.desc.padEnd(16)} ${p.status.padEnd(12)} ${p.vlan.padEnd(8)} ${duplex} ${speed} ${type}`,
      };
    }),
  ];
}

function ipBriefLines(ports: SwitchPort[]): TermLine[] {
  const row = (
    iface: string,
    ip: string,
    method: string,
    status: string,
    proto: string,
  ) =>
    `${iface.padEnd(24)} ${ip.padEnd(15)} YES ${method.padEnd(6)} ${status.padEnd(21)} ${proto}`;
  return [
    {
      tone: "dim",
      text: row(
        "Interface",
        "IP-Address",
        "Method",
        "Status",
        "Protocol",
      ).replace("YES", "OK?"),
    },
    {
      tone: "plain",
      text: row(
        "Vlan1",
        "unassigned",
        "unset",
        "administratively down",
        "down",
      ),
    },
    { tone: "plain", text: row("Vlan99", SW_MGMT_IP, "manual", "up", "up") },
    ...ports.map((p): TermLine => {
      const [st, pr] = STATUS_PROTO[p.status];
      return {
        tone: st === "up" ? "plain" : "warn",
        text: row(p.full, "unassigned", "unset", st, pr),
      };
    }),
  ];
}

function runConfigLines(p: SwitchPort): TermLine[] {
  const body = [
    `interface ${p.full}`,
    ` description ${p.desc}`,
    ...(p.trunk
      ? [" switchport mode trunk"]
      : [
          ` switchport access vlan ${p.vlan}`,
          " switchport mode access",
          " switchport port-security",
          " spanning-tree portfast",
        ]),
    ...(p.status === "disabled" ? [" shutdown"] : []),
    "end",
  ];
  return textBlock(
    "plain",
    `Building configuration...\n\nCurrent configuration : ${body.join("\n").length} bytes\n!\n${body.join("\n")}`,
  );
}

const SHOW_VERSION = `Cisco IOS XE Software, Version 17.x.x (contoh)
${SW_HOST} uptime is 41 weeks, 2 days, 3 hours, 12 minutes
System returned to ROM by power-on
Model Number                       : ${SW_MODEL}
System Serial Number               : ${SW_SERIAL}`;

function vlanLines(ports: SwitchPort[]): TermLine[] {
  const access = (v: string) =>
    ports
      .filter((p) => !p.trunk && p.vlan === v)
      .map((p) => p.name)
      .join(", ");
  const row = (id: string, name: string, ps: string) =>
    `${id.padEnd(4)} ${name.padEnd(32)} active    ${ps}`;
  return [
    {
      tone: "dim",
      text: `${"VLAN".padEnd(4)} ${"Name".padEnd(32)} Status    Ports`,
    },
    {
      tone: "dim",
      text: `${"-".repeat(4)} ${"-".repeat(32)} --------- -------------------------------`,
    },
    { tone: "plain", text: row("1", "default", "Gi1/0/47, Gi1/0/48") },
    { tone: "plain", text: row("10", "USERS", access("10")) },
    { tone: "plain", text: row("20", "WIFI", access("20")) },
    { tone: "plain", text: row("99", "MGMT", "") },
  ];
}

const MAC_TABLE = `          Mac Address Table
-------------------------------------------
Vlan    Mac Address       Type        Ports
----    -----------       --------    -----
  10    0200.5e00.0101    DYNAMIC     Gi1/0/1
  10    0200.5e00.0102    DYNAMIC     Gi1/0/2
  20    0200.5e00.0201    DYNAMIC     Gi1/0/11
  10    0200.5e00.0aaa    DYNAMIC     Te1/1/1
Total Mac Addresses for this criterion: 4`;

const CDP = `Capability Codes: R - Router, S - Switch, P - Phone, T - Trans-Bridge
Device ID        Local Intrfce     Holdtme    Capability  Platform  Port ID
CORE-DEMO-01     Ten 1/1/1         142             R S    C9500     Ten 1/0/1
AP-LT2           Gig 1/0/11        121             T      AIR-AP    Gig 0`;

function findPort(s: IosState, name: string) {
  return (
    s.ports.find((p) => p.name.toLowerCase() === name.toLowerCase()) ?? null
  );
}

function updatePort(
  s: IosState,
  name: string,
  patch: Partial<SwitchPort>,
): IosState {
  return {
    ...s,
    ports: s.ports.map((p) => (p.name === name ? { ...p, ...patch } : p)),
  };
}

function addLogs(s: IosState, msgs: string[]): [IosState, TermLine[]] {
  const entries = msgs.map((m) => `${stamp()}: ${m}`);
  return [
    { ...s, logs: [...s.logs, ...entries] },
    entries.map((e) => ({ tone: "dim", text: e })),
  ];
}

type ShowResult = { lines: TermLine[]; events: IosEvent[]; commandId: string };

/** Perintah show (dari Privileged EXEC, atau dengan awalan do di mode config). */
function runShow(input: string, s: IosState): ShowResult | null {
  const m = (p: string) => cliMatch(input, p);
  if (m("sh|ow ver|sion"))
    return {
      lines: textBlock("plain", SHOW_VERSION),
      events: [],
      commandId: "version",
    };
  if (m("sh|ow ip int|erface br|ief"))
    return { lines: ipBriefLines(s.ports), events: [], commandId: "ipbrief" };
  if (m("sh|ow int|erfaces st|atus"))
    return {
      lines: ifStatusLines(s.ports),
      events: ["status"],
      commandId: "ifstatus",
    };
  if (m("sh|ow vl|an br|ief") || m("sh|ow vl|an"))
    return { lines: vlanLines(s.ports), events: [], commandId: "vlan" };
  if (m("sh|ow mac add|ress-table"))
    return {
      lines: textBlock("plain", MAC_TABLE),
      events: [],
      commandId: "mac",
    };
  if (m("sh|ow log|ging")) {
    return {
      lines: [
        { tone: "dim", text: "Log Buffer (8192 bytes):" },
        ...s.logs.map((l): TermLine => ({ tone: lineTone(l), text: l })),
      ],
      events: ["logs"],
      commandId: "logging",
    };
  }
  if (m("sh|ow cdp nei|ghbors"))
    return { lines: textBlock("plain", CDP), events: [], commandId: "cdp" };
  const run = m("sh|ow run|ning-config int|erface <if>");
  if (run) {
    const name = parseIf(run[0]);
    const p = name ? findPort(s, name) : null;
    if (!p)
      return {
        lines: textBlock(
          "err",
          "% Port ini tidak ada di skenario simulasi. Coba show interfaces status.",
        ),
        events: [],
        commandId: "runint",
      };
    return { lines: runConfigLines(p), events: [], commandId: "runint" };
  }
  if (m("sh|ow run|ning-config")) {
    return {
      lines: textBlock(
        "dim",
        "(simulasi) Konfigurasi lengkap terlalu panjang. Coba: show running-config interface gi1/0/12",
      ),
      events: [],
      commandId: "runint",
    };
  }
  return null;
}

const HELP: Record<IosMode, string> = {
  user: "Perintah di User EXEC (simulasi):\n  enable                      naik ke Privileged EXEC",
  priv: `Perintah di Privileged EXEC (simulasi):
  show interfaces status      status semua port
  show ip interface brief     ringkasan interface dan IP
  show logging                log switch
  show vlan brief             daftar VLAN
  show mac address-table      MAC per port
  show cdp neighbors          perangkat tetangga
  show running-config interface <port>
  show version
  configure terminal          masuk mode konfigurasi
  write memory                simpan konfigurasi`,
  config: `Perintah di Global configuration (simulasi):
  interface <port>            mis. interface gi1/0/12
  do <perintah show>          jalankan show dari mode config
  end                         kembali ke Privileged EXEC`,
  if: `Perintah di Interface configuration (simulasi):
  shutdown                    matikan port
  no shutdown                 nyalakan port
  description <teks>          beri keterangan port
  end                         kembali ke Privileged EXEC
  exit                        kembali ke Global configuration`,
};

/** Jalankan satu baris input. null = input kosong. */
export function runIos(raw: string, s: IosState): IosResult | null {
  // "int gi 1/0/12" -> "int gi1/0/12"
  const input = raw
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b([a-z]+) (\d+\/\d+\/\d+)\b/gi, "$1$2");
  if (!input) return null;
  const m = (p: string) => cliMatch(input, p);
  const ok = (
    state: IosState,
    lines: TermLine[] = [],
    events: IosEvent[] = [],
    extra: Partial<IosResult> = {},
  ): IosResult => ({
    state,
    lines,
    events,
    ...extra,
  });

  if (s.closed) {
    return ok(
      s,
      textBlock(
        "err",
        "(sesi SSH terputus) Klik Ulangi simulasi untuk mencoba lagi.",
      ),
    );
  }
  if (m("clear") || m("cls")) return ok(s, [], [], { clear: true });
  if (input === "?" || m("help"))
    return ok(s, textBlock("plain", HELP[s.mode]));

  // Perintah berbahaya ditolak di mode mana pun.
  if (s.mode !== "user" && (m("rel|oad") || m("do rel|oad"))) {
    return ok(
      s,
      textBlock(
        "err",
        "DITOLAK (simulasi): reload me-restart switch dan memutus semua user di switch ini.\nHanya di maintenance window dengan MOP dan approval.",
      ),
      ["danger"],
      { commandId: "reload" },
    );
  }
  if (
    s.mode !== "user" &&
    (m("wr|ite er|ase") || m("do wr|ite er|ase") || m("era|se start|up-config"))
  ) {
    return ok(
      s,
      textBlock(
        "err",
        "DITOLAK (simulasi): write erase menghapus startup-config.\nSetelah reload berikutnya, switch kembali kosong tanpa konfigurasi.",
      ),
      ["danger"],
      { commandId: "wrerase" },
    );
  }

  if (s.mode === "user") {
    if (m("en|able")) return ok({ ...s, mode: "priv" }, [], ["enable"]);
    if (input.toLowerCase().startsWith("sh")) {
      return ok(
        s,
        textBlock(
          "warn",
          "% (simulasi) Perintah ini butuh Privileged EXEC. Ketik enable dulu.",
        ),
      );
    }
    return ok(s, INVALID);
  }

  if (s.mode === "priv") {
    const show = runShow(input, s);
    if (show)
      return ok(s, show.lines, show.events, { commandId: show.commandId });
    if (m("dis|able")) return ok({ ...s, mode: "user" });
    if (m("conf|igure t|erminal")) {
      return ok(
        { ...s, mode: "config" },
        textBlock(
          "plain",
          "Enter configuration commands, one per line.  End with CNTL/Z.",
        ),
        [],
        { commandId: "conft" },
      );
    }
    if (
      m("wr|ite") ||
      m("wr|ite mem|ory") ||
      m("copy run|ning-config start|up-config")
    ) {
      return ok(
        { ...s, dirty: false },
        textBlock("plain", "Building configuration...\n[OK]"),
        ["saved"],
        { commandId: "write" },
      );
    }
    if (m("exit") || m("logout")) {
      return ok(
        s,
        textBlock(
          "dim",
          "(simulasi) Sesi tetap dibuka supaya kamu bisa lanjut.",
        ),
      );
    }
    if (m("int|erface <if>")) {
      return ok(s, [
        ...INVALID,
        {
          tone: "dim",
          text: "(Masuk configure terminal dulu untuk mengubah interface.)",
        },
      ]);
    }
    return ok(s, INVALID);
  }

  // Mode config dan interface.
  const doCmd = input.match(/^do (.+)$/i);
  if (doCmd) {
    const show = runShow(doCmd[1], s);
    if (show)
      return ok(s, show.lines, show.events, { commandId: show.commandId });
    return ok(s, INVALID);
  }
  if (m("end")) {
    const [next, lines] = s.dirty
      ? addLogs(s, [
          "%SYS-5-CONFIG_I: Configured from console by ops-demo on vty0 (192.0.2.50)",
        ])
      : [s, []];
    return ok({ ...next, mode: "priv", current: null }, lines);
  }
  if (m("exit")) {
    if (s.mode === "if") return ok({ ...s, mode: "config", current: null });
    const [next, lines] = s.dirty
      ? addLogs(s, [
          "%SYS-5-CONFIG_I: Configured from console by ops-demo on vty0 (192.0.2.50)",
        ])
      : [s, []];
    return ok({ ...next, mode: "priv" }, lines);
  }
  const intf = m("int|erface <if>");
  if (intf) {
    const name = parseIf(intf[0]);
    if (!name) return ok(s, INVALID);
    const p = findPort(s, name);
    if (!p)
      return ok(
        s,
        textBlock(
          "warn",
          `% (simulasi) ${name} tidak dipakai di skenario ini. Cek show interfaces status.`,
        ),
      );
    return ok(
      { ...s, mode: "if", current: p.name },
      [],
      p.name === BAD_PORT ? ["enterBad"] : [],
    );
  }

  if (s.mode === "if" && s.current) {
    const p = findPort(s, s.current);
    if (!p) return ok(s, INVALID);

    if (m("shut|down")) {
      if (p.status === "disabled") return ok(s);
      let next = updatePort(s, p.name, {
        status: "disabled",
        before: p.status,
      });
      next = { ...next, dirty: true };
      const [logged, lines] = addLogs(next, [
        `%LINK-5-CHANGED: Interface ${p.full}, changed state to administratively down`,
        ...(p.status === "connected"
          ? [
              `%LINEPROTO-5-UPDOWN: Line protocol on Interface ${p.full}, changed state to down`,
            ]
          : []),
      ]);
      if (p.name === UPLINK_PORT) {
        return ok(
          { ...logged, closed: true },
          [
            ...lines,
            {
              tone: "err",
              text: `Connection to ${SW_MGMT_IP} closed by remote host.`,
            },
          ],
          ["uplinkDown"],
        );
      }
      if (p.name !== BAD_PORT && p.status === "connected")
        return ok(logged, lines, ["userPortDown"], { port: p });
      return ok(logged, lines);
    }

    if (m("no shut|down")) {
      if (p.status === "err-disabled") {
        return ok(
          s,
          textBlock(
            "dim",
            "(simulasi) Port masih err-disabled. Lakukan shutdown dulu, lalu no shutdown.",
          ),
          ["noShutErr"],
        );
      }
      if (p.status !== "disabled") return ok(s);
      const restored: PortStatus =
        p.before === "err-disabled" || p.before === "connected"
          ? "connected"
          : "notconnect";
      let next = updatePort(s, p.name, { status: restored, before: undefined });
      next = { ...next, dirty: true };
      const msgs = [
        `%LINK-3-UPDOWN: Interface ${p.full}, changed state to ${restored === "connected" ? "up" : "down"}`,
      ];
      if (restored === "connected")
        msgs.push(
          `%LINEPROTO-5-UPDOWN: Line protocol on Interface ${p.full}, changed state to up`,
        );
      const [logged, lines] = addLogs(next, msgs);
      if (p.name === BAD_PORT && p.before === "err-disabled")
        return ok(logged, lines, ["bounced"]);
      if (p.name !== BAD_PORT && restored === "connected")
        return ok(logged, lines, ["userPortUp"], { port: p });
      return ok(logged, lines);
    }

    const desc = input.match(
      /^desc(?:r|ri|rip|ript|ripti|riptio|ription)? (.+)$/i,
    );
    if (desc)
      return ok({
        ...updatePort(s, p.name, { desc: desc[1].slice(0, 16) }),
        dirty: true,
      });

    if (m("sw|itchport") || input.toLowerCase().startsWith("sw")) {
      return ok(
        s,
        textBlock(
          "dim",
          "(simulasi) Tidak perlu mengubah switchport untuk tugas ini.",
        ),
      );
    }
  }

  return ok(s, INVALID);
}
