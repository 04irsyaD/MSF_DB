import type {
  CommandCategory,
  LabCommand,
  RunResult,
  TermLine,
} from "../../../lib/types";
import { runCli, textBlock, type CliDef } from "../../../lib/cli";
import {
  FW_HOST,
  INITIAL_RULES,
  PORTAL_IP,
  USER_IP,
  evaluate,
  policyLines,
  testCommand,
  testOutput,
  type SecRule,
  type Zone,
} from "./policy";

export const PANOS_WELCOME: TermLine[] = [
  {
    tone: "dim",
    text: `Terhubung ke ${FW_HOST} (192.0.2.5) lewat SSH (simulasi). Ketik ? untuk daftar perintah.`,
  },
];

export const PANOS_CATEGORIES: CommandCategory[] = [
  { id: "info", label: "Info" },
  { id: "policy", label: "Policy & sesi" },
  { id: "ha", label: "HA" },
  { id: "change", label: "Perubahan" },
  { id: "danger", label: "Berbahaya" },
];

const PORTAL_TEST = testCommand({
  from: "trust",
  to: "dmz",
  source: USER_IP,
  destination: PORTAL_IP,
  port: 443,
  protocol: 6,
  application: "ssl",
});

export const PANOS_COMMANDS: LabCommand[] = [
  {
    id: "sysinfo",
    command: "show system info",
    label: "show system info",
    summary: "Info sistem",
    category: "info",
    risk: "safe",
    description:
      "Menampilkan hostname, IP manajemen, model, serial, versi PAN-OS, versi konten, dan uptime.",
    when: [
      "Membuka tiket ke vendor.",
      "Memastikan versi App-ID/threat ter-update.",
    ],
    reading: [
      { tag: "sw-version", tone: "info", text: "Versi PAN-OS." },
      {
        tag: "app/threat-version",
        tone: "info",
        text: "Versi database App-ID dan threat; seharusnya ter-update rutin.",
      },
      {
        tag: "uptime",
        tone: "info",
        text: "Lama firewall menyala sejak restart terakhir.",
      },
    ],
  },
  {
    id: "interface",
    command: "show interface all",
    label: "show interface all",
    summary: "Status port dan zone",
    category: "info",
    risk: "safe",
    description:
      "Menampilkan status fisik port serta zone dan IP setiap interface.",
    when: [
      "Ada laporan satu segmen jaringan tidak bisa lewat firewall.",
      "Setelah pekerjaan kabel.",
    ],
    reading: [
      { tag: "up", tone: "ok", text: "Link aktif." },
      {
        tag: "down",
        tone: "bad",
        text: "Tidak ada link: kabel, SFP, atau perangkat di ujung bermasalah.",
      },
      { tag: "zone", tone: "info", text: "Zone tempat interface itu berada." },
    ],
  },
  {
    id: "test",
    command: PORTAL_TEST,
    label: "test security-policy-match",
    summary: "Rule mana yang kena",
    category: "policy",
    risk: "safe",
    description:
      "Menguji trafik tertentu terhadap security policy yang berjalan dan menampilkan rule pertama yang cocok.",
    when: [
      "User melapor tidak bisa akses aplikasi.",
      "Sebelum dan sesudah mengubah policy.",
    ],
    reading: [
      {
        tag: "index",
        tone: "info",
        text: "Posisi rule dari atas. Rule pertama yang cocok yang dipakai.",
      },
      {
        tag: "action deny",
        tone: "bad",
        text: "Trafik ditolak oleh rule ini.",
      },
      { tag: "action allow", tone: "ok", text: "Trafik diizinkan." },
    ],
  },
  {
    id: "session",
    command: `show session all filter destination ${PORTAL_IP}`,
    label: "show session all filter",
    summary: "Sesi aktif",
    category: "policy",
    risk: "safe",
    description:
      "Menampilkan sesi yang sedang berjalan, bisa difilter per alamat atau port.",
    when: [
      "Memastikan trafik benar-benar lewat firewall.",
      "Melihat aplikasi yang terdeteksi untuk sebuah sesi.",
    ],
    reading: [
      { tag: "ACTIVE", tone: "ok", text: "Sesi sedang berjalan." },
      {
        tag: "tidak ada sesi",
        tone: "warn",
        text: "Trafik ditolak policy, atau tidak sampai ke firewall sama sekali.",
      },
    ],
  },
  {
    id: "rules",
    command: "show running security-policy",
    label: "show running security-policy",
    summary: "Urutan rule berjalan",
    category: "policy",
    risk: "safe",
    description:
      "Menampilkan security policy yang sedang dipakai, berurutan dari atas.",
    when: ["Memeriksa urutan rule dan rule yang nonaktif."],
    reading: [
      { tag: "index", tone: "info", text: "Urutan evaluasi." },
      {
        tag: "interzone-default",
        tone: "warn",
        text: "Rule bawaan di paling bawah: trafik antar zone yang tidak cocok rule mana pun ditolak.",
      },
    ],
  },
  {
    id: "counter",
    command: "show counter global filter delta yes severity drop",
    label: "show counter global ... drop",
    summary: "Penyebab paket dibuang",
    category: "policy",
    risk: "safe",
    description:
      "Menampilkan counter paket yang dibuang sejak pengecekan terakhir, beserta alasannya.",
    when: ["Trafik hilang tapi tidak jelas penyebabnya."],
    reading: [
      {
        tag: "flow_policy_deny",
        tone: "bad",
        text: "Ditolak security policy. Cek traffic log dan test security-policy-match.",
      },
      {
        tag: "flow_tcp_non_syn_drop",
        tone: "warn",
        text: "Paket TCP tanpa sesi yang cocok, sering karena routing asimetris.",
      },
    ],
  },
  {
    id: "ha",
    command: "show high-availability state",
    label: "show high-availability state",
    summary: "Status HA",
    category: "ha",
    risk: "safe",
    description:
      "Menampilkan peran firewall ini dan peer-nya di HA, serta status sinkronisasi konfigurasi.",
    when: ["Sebelum dan sesudah perubahan atau maintenance."],
    reading: [
      { tag: "active / passive", tone: "ok", text: "Pasangan HA normal." },
      {
        tag: "synchronized",
        tone: "ok",
        text: "Konfigurasi kedua firewall sama.",
      },
      {
        tag: "not synchronized",
        tone: "warn",
        text: "Konfigurasi berbeda; failover bisa membawa konfigurasi lama.",
      },
    ],
  },
  {
    id: "jobs",
    command: "show jobs all",
    label: "show jobs all",
    summary: "Riwayat commit",
    category: "change",
    risk: "safe",
    description:
      "Menampilkan job yang berjalan atau selesai: commit, update konten, dan lainnya.",
    when: [
      "Memastikan commit berhasil.",
      "Melihat kapan perubahan terakhir diterapkan.",
    ],
    reading: [
      { tag: "FIN OK", tone: "ok", text: "Job selesai dan berhasil." },
      {
        tag: "FAIL",
        tone: "bad",
        text: "Perubahan tidak diterapkan. Lihat detail dengan show jobs id <ID>.",
      },
    ],
  },
  {
    id: "configure",
    command: "configure",
    label: "configure",
    summary: "Masuk mode konfigurasi",
    category: "change",
    risk: "caution",
    description:
      "Masuk ke mode konfigurasi. Perubahan masuk ke candidate config.",
    when: ["Perubahan yang sudah direncanakan dan disetujui."],
    caution: "Perubahan baru aktif setelah commit. Catat apa yang kamu ubah.",
  },
  {
    id: "commit",
    command: "commit",
    label: "commit",
    summary: "Terapkan perubahan",
    category: "change",
    risk: "caution",
    description:
      "Menerapkan semua perubahan di candidate config menjadi running config.",
    when: ["Setelah perubahan direview (Preview Changes) dan sesuai MOP."],
    caution:
      "Commit menerapkan SEMUA perubahan candidate, termasuk perubahan orang lain yang belum di-commit.",
  },
  {
    id: "restart",
    command: "request restart system",
    label: "request restart system",
    summary: "Restart firewall, berbahaya",
    category: "danger",
    risk: "danger",
    description: "Me-restart firewall.",
    when: ["Hanya di maintenance window dengan MOP; di HA, lakukan berurutan."],
    caution:
      "Tanpa HA, semua trafik yang lewat firewall berhenti sampai firewall menyala lagi.",
  },
  {
    id: "clearsession",
    command: "clear session all",
    label: "clear session all",
    summary: "Putus semua sesi, berbahaya",
    category: "danger",
    risk: "danger",
    description: "Memutus semua sesi aktif yang lewat firewall.",
    when: [
      "Hampir tidak pernah. Lebih aman menghapus sesi tertentu dengan filter.",
    ],
    caution: "Semua koneksi user dan aplikasi terputus seketika.",
  },
];

const SYSTEM_INFO = `hostname: ${FW_HOST}
ip-address: 192.0.2.5
model: PA-3410 (simulasi)
serial: DEMO0001
sw-version: x.y.z (contoh)
app-version: xxxx-yyyy (contoh)
threat-version: xxxx-yyyy (contoh)
uptime: 120 days, 4:12:09`;

const INTERFACE_ALL = `name            id    speed/duplex/state         mac address
--------------------------------------------------------------------
ethernet1/1     16    1000/full/up               02:00:5e:10:00:01
ethernet1/2     17    1000/full/up               02:00:5e:10:00:02
ethernet1/3     18    1000/full/up               02:00:5e:10:00:03
ethernet1/4     19    ukn/ukn/down(autoneg)      02:00:5e:10:00:04

name            zone        forwarding   address
--------------------------------------------------------------------
ethernet1/1     untrust     vr:default   203.0.113.2/29
ethernet1/2     trust       vr:default   192.0.2.1/24
ethernet1/3     dmz         vr:default   198.51.100.1/24`;

const SESSION = `ID       Application  State   Type  Src[Sport]/Zone/Proto
Vsys                                 Dst[Dport]/Zone
---------------------------------------------------------------------
48211    ssl          ACTIVE  FLOW  192.0.2.31[51522]/trust/6
vsys1                                ${PORTAL_IP}[443]/dmz`;

const COUNTER = `Elapsed time since last sampling: 10.012 seconds

name                       value  rate  severity  description
---------------------------------------------------------------------
flow_policy_deny              37     3  drop      Session setup: denied by policy
flow_tcp_non_syn_drop          4     0  drop      Packets dropped: non-SYN TCP without session match`;

const HA_STATE = `Group 1:
  Mode: Active-Passive
  Local Information:
    State: active (last 120 days)
  Peer Information:
    Connection status: up
    State: passive (last 120 days)
  Configuration Synchronization:
    Enabled: yes
    Running Configuration: synchronized`;

const JOBS = `Enqueued             ID    Type     Status  Result  Completed
---------------------------------------------------------------------
2026/11/07 22:10:04  1842  Commit   FIN     OK      22:11:31
2026/11/08 01:00:12  1851  Content  FIN     OK      01:03:40`;

const HELP = `Perintah yang tersedia di simulasi:
  show system info
  show interface all
  show running security-policy
  show session all filter destination <ip>
  show counter global filter delta yes severity drop
  show high-availability state
  show jobs all
  test security-policy-match from <zone> to <zone> source <ip>
       destination <ip> destination-port <port> protocol <6|17> application <app>
  clear`;

const ZONES: Zone[] = ["trust", "untrust", "dmz"];

/** Parse "test security-policy-match key value ..." menjadi flow. */
function runTest(input: string, rules: SecRule[]): TermLine[] {
  const tokens = input.split(" ").slice(2);
  const kv: Record<string, string> = {};
  for (let i = 0; i + 1 < tokens.length; i += 2)
    kv[tokens[i].toLowerCase()] = tokens[i + 1];
  const from = kv.from as Zone;
  const to = kv.to as Zone;
  if (!ZONES.includes(from) || !ZONES.includes(to) || !kv.destination) {
    return textBlock(
      "err",
      "Error: butuh minimal from <zone> to <zone> destination <ip>. Zone: trust, untrust, dmz.",
    );
  }
  const flow = {
    from,
    to,
    source: kv.source ?? "any",
    destination: kv.destination,
    port: Number(kv["destination-port"] ?? 0),
    protocol: Number(kv.protocol ?? 6),
    application: (kv.application ?? "any").toLowerCase(),
  };
  return testOutput(evaluate(rules, flow), flow);
}

function defs(rules: SecRule[]): CliDef[] {
  return [
    { patterns: ["clear"], out: () => "clear" },
    { patterns: ["?", "help"], out: () => textBlock("plain", HELP) },
    {
      id: "sysinfo",
      patterns: ["show system info"],
      out: () => textBlock("plain", SYSTEM_INFO),
    },
    {
      id: "interface",
      patterns: ["show interface all"],
      out: () => textBlock("plain", INTERFACE_ALL),
    },
    {
      id: "rules",
      patterns: ["show running security-policy"],
      out: () => policyLines(rules),
    },
    {
      id: "session",
      patterns: [
        "show session all filter destination <ip>",
        "show session all",
      ],
      out: ([ip]) =>
        ip && ip !== PORTAL_IP
          ? textBlock("plain", "No Active Sessions")
          : textBlock("plain", SESSION),
    },
    {
      id: "counter",
      patterns: ["show counter global filter delta yes severity drop"],
      out: () => textBlock("plain", COUNTER),
    },
    {
      id: "ha",
      patterns: ["show high-availability state"],
      out: () => textBlock("plain", HA_STATE),
    },
    {
      id: "jobs",
      patterns: ["show jobs all"],
      out: () => textBlock("plain", JOBS),
    },
    {
      id: "configure",
      patterns: ["configure"],
      out: () =>
        textBlock(
          "plain",
          `Entering configuration mode\n[edit]\nadmin@${FW_HOST}# (simulasi: tetap di mode operasional)`,
        ),
    },
    {
      id: "commit",
      patterns: ["commit"],
      out: () =>
        textBlock(
          "warn",
          "DITAHAN (simulasi): commit menerapkan semua perubahan candidate ke firewall.\nLakukan setelah review perubahan dan sesuai MOP.",
        ),
    },
    {
      id: "restart",
      patterns: ["request restart system"],
      out: () =>
        textBlock(
          "err",
          "DITOLAK (simulasi): restart menghentikan trafik yang lewat firewall.\nHanya di maintenance window dengan MOP.",
        ),
    },
    {
      id: "clearsession",
      patterns: ["clear session all"],
      out: () =>
        textBlock(
          "err",
          "DITOLAK (simulasi): semua sesi aktif user dan aplikasi akan terputus.",
        ),
    },
  ];
}

export function runPanos(raw: string, rules: SecRule[]): RunResult | null {
  const input = raw.trim().replace(/\s+/g, " ");
  if (!input) return null;
  if (input.toLowerCase().startsWith("test security-policy-match")) {
    return { lines: runTest(input, rules), commandId: "test" };
  }
  return runCli(
    input,
    defs(rules),
    textBlock(
      "err",
      `Unknown command: ${input.split(" ")[0]}\nKetik ? untuk daftar perintah simulasi.`,
    ),
  );
}

/** Bagian "Perintah CLI": selalu memakai policy awal. */
export function runPanosConsole(raw: string): RunResult | null {
  return runPanos(raw, INITIAL_RULES);
}
