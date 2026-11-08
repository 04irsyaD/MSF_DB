import type { TermLine } from "../../../lib/types";
import { cliMatch, textBlock } from "../../../lib/cli";

/**
 * Mesin CLI ONTAP simulasi. Fungsi murni: (input, state) -> state baru + output.
 * Semua nama, IP (RFC 5737), dan angka fiktif.
 */

export const CLUSTER = "cluster-demo";
export const SVM = "svm_demo";
export const ONTAP_PROMPT = `${CLUSTER}::>`;
export const TARGET_VOL = "vol_app";

export interface OntapVolume {
  name: string;
  sizeGB: number;
  usedGB: number;
}

export interface OntapSnapshot {
  name: string;
  sizeGB: number;
  /** Snapshot milik SnapMirror: tidak boleh dihapus. */
  busy?: boolean;
}

export interface OntapEvent {
  time: string;
  node: string;
  severity: "ALERT" | "ERROR" | "NOTICE" | "INFORMATIONAL";
  text: string;
}

export interface OntapState {
  volumes: OntapVolume[];
  aggrSizeGB: number;
  aggrAvailGB: number;
  snapshots: OntapSnapshot[];
  events: OntapEvent[];
}

export type OntapEventKind =
  | "events"
  | "volume"
  | "aggr"
  | "snapshots"
  | "resized"
  | "snapDeleted"
  | "snapBusy"
  | "sizeError"
  | "danger";

export interface OntapResult {
  state: OntapState;
  lines: TermLine[];
  events: OntapEventKind[];
  commandId?: string;
  clear?: boolean;
  /** Info tambahan event resized: Used% baru. */
  pct?: number;
}

export const INITIAL_ONTAP: OntapState = {
  volumes: [
    { name: TARGET_VOL, sizeGB: 500, usedGB: 475 },
    { name: "vol_db", sizeGB: 2048, usedGB: 1228 },
    { name: "vol_home", sizeGB: 1024, usedGB: 614 },
  ],
  aggrSizeGB: 10721,
  aggrAvailGB: 3195,
  snapshots: [
    { name: "weekly.2026-11-02_0015", sizeGB: 22.4 },
    { name: "daily.2026-11-06_0010", sizeGB: 14.6 },
    { name: "daily.2026-11-07_0010", sizeGB: 15.1 },
    { name: "daily.2026-11-08_0010", sizeGB: 16.3 },
    { name: "snapmirror.demo_dr.2026-11-08_060000", sizeGB: 9.8, busy: true },
  ],
  events: [
    {
      time: "11/8/2026 08:02:11",
      node: `${CLUSTER}-01`,
      severity: "ALERT",
      text: `monitor.volume.nearlyFull: Volume ${TARGET_VOL}@vserver:${SVM} is nearly full (using or reserving 95% of space and 0% of inodes).`,
    },
    {
      time: "11/8/2026 00:10:03",
      node: `${CLUSTER}-01`,
      severity: "NOTICE",
      text: `snapshot created: daily.2026-11-08_0010 on ${TARGET_VOL} (simulasi)`,
    },
    {
      time: "11/7/2026 22:40:51",
      node: `${CLUSTER}-02`,
      severity: "NOTICE",
      text: "callhome.weekly: AutoSupport mingguan terkirim (simulasi)",
    },
  ],
};

export const pctOf = (v: OntapVolume) =>
  Math.round((v.usedGB / v.sizeGB) * 100);

export function fmtSize(gb: number) {
  const r = (n: number) => String(Math.round(n * 100) / 100);
  return gb >= 1024 ? `${r(gb / 1024)}TB` : `${r(gb)}GB`;
}

function stamp() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `11/8/2026 ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

/** "+100g", "600GB", "1t", "+0.5T" -> GB. relative = diawali "+". */
export function parseSize(
  raw: string,
): { gb: number; relative: boolean } | null {
  const m = raw.trim().match(/^(\+)?(\d+(?:\.\d+)?)\s*([gt])b?$/i);
  if (!m) return null;
  const n = Number(m[2]) * (m[3].toLowerCase() === "t" ? 1024 : 1);
  return n > 0 ? { gb: n, relative: !!m[1] } : null;
}

interface Parsed {
  words: string;
  params: Record<string, string>;
}

/** Pisahkan kata perintah dan parameter "-nama nilai" (parameter tanpa nilai = "true"). */
function parse(input: string): Parsed {
  const tokens = input.split(" ");
  const words: string[] = [];
  const params: Record<string, string> = {};
  let i = 0;
  while (i < tokens.length && !tokens[i].startsWith("-"))
    words.push(tokens[i++]);
  while (i < tokens.length) {
    const t = tokens[i];
    if (t.startsWith("-")) {
      const next = tokens[i + 1];
      if (next !== undefined && !next.startsWith("-")) {
        params[t.slice(1).toLowerCase()] = next;
        i += 2;
      } else {
        params[t.slice(1).toLowerCase()] = "true";
        i += 1;
      }
    } else {
      i += 1;
    }
  }
  return { words: words.join(" "), params };
}

/** Ambil nilai parameter; nama boleh disingkat minimal 3 huruf (mis. -vol untuk -volume). */
function param(p: Parsed, name: string): string | undefined {
  for (const [k, v] of Object.entries(p.params)) {
    if (k === name || (k.length >= 3 && name.startsWith(k))) return v;
  }
  return undefined;
}

const NO_ENTRIES = textBlock(
  "plain",
  "There are no entries matching your query.",
);

function eventLines(events: OntapEvent[]): TermLine[] {
  return [
    {
      tone: "dim",
      text: `${"Time".padEnd(19)} ${"Node".padEnd(16)} ${"Severity".padEnd(13)} Event`,
    },
    {
      tone: "dim",
      text: `${"-".repeat(19)} ${"-".repeat(16)} ${"-".repeat(13)} ${"-".repeat(27)}`,
    },
    ...events.map((e): TermLine => ({
      tone: e.severity === "ALERT" || e.severity === "ERROR" ? "err" : "plain",
      text: `${e.time.padEnd(19)} ${e.node.padEnd(16)} ${e.severity.padEnd(13)} ${e.text}`,
    })),
  ];
}

function volumeLines(s: OntapState, only?: string): TermLine[] {
  const vols = only ? s.volumes.filter((v) => v.name === only) : s.volumes;
  if (vols.length === 0) return NO_ENTRIES;
  const row = (
    a: string,
    b: string,
    c: string,
    d: string,
    e: string,
    f: string,
    g: string,
    h: string,
  ) =>
    `${a.padEnd(9)} ${b.padEnd(12)} ${c.padEnd(12)} ${d.padEnd(10)} ${e.padEnd(4)} ${f.padStart(10)} ${g.padStart(10)} ${h.padStart(5)}`;
  return [
    {
      tone: "dim",
      text: row(
        "Vserver",
        "Volume",
        "Aggregate",
        "State",
        "Type",
        "Size",
        "Available",
        "Used%",
      ),
    },
    {
      tone: "dim",
      text: row(
        "-".repeat(9),
        "-".repeat(12),
        "-".repeat(12),
        "-".repeat(10),
        "----",
        "-".repeat(10),
        "-".repeat(10),
        "-----",
      ),
    },
    ...vols.map((v): TermLine => {
      const pct = pctOf(v);
      return {
        tone: pct >= 90 ? "err" : pct >= 80 ? "warn" : "plain",
        text: row(
          SVM,
          v.name,
          "aggr1_01",
          "online",
          "RW",
          fmtSize(v.sizeGB),
          fmtSize(v.sizeGB - v.usedGB),
          `${pct}%`,
        ),
      };
    }),
    {
      tone: "plain",
      text: `${vols.length} entr${vols.length === 1 ? "y was" : "ies were"} displayed.`,
    },
  ];
}

function aggrLines(s: OntapState): TermLine[] {
  const used = Math.round(
    ((s.aggrSizeGB - s.aggrAvailGB) / s.aggrSizeGB) * 100,
  );
  const row = (
    a: string,
    b: string,
    c: string,
    d: string,
    e: string,
    f: string,
    g: string,
    h: string,
  ) =>
    `${a.padEnd(9)} ${b.padStart(8)} ${c.padStart(9)} ${d.padStart(5)} ${e.padEnd(7)} ${f.padStart(5)} ${g.padEnd(16)} ${h}`;
  return [
    {
      tone: "dim",
      text: row(
        "Aggregate",
        "Size",
        "Available",
        "Used%",
        "State",
        "#Vols",
        "Nodes",
        "RAID Status",
      ),
    },
    {
      tone: "dim",
      text: row(
        "-".repeat(9),
        "-".repeat(8),
        "-".repeat(9),
        "-----",
        "-------",
        "-----",
        "-".repeat(16),
        "-".repeat(15),
      ),
    },
    {
      tone: "plain",
      text: row(
        "aggr0_01",
        "368.4GB",
        "17.86GB",
        "95%",
        "online",
        "1",
        `${CLUSTER}-01`,
        "raid_dp, normal",
      ),
    },
    {
      tone: used >= 90 ? "err" : used >= 80 ? "warn" : "plain",
      text: row(
        "aggr1_01",
        fmtSize(s.aggrSizeGB),
        fmtSize(s.aggrAvailGB),
        `${used}%`,
        "online",
        "3",
        `${CLUSTER}-01`,
        "raid_dp, normal",
      ),
    },
    { tone: "plain", text: "2 entries were displayed." },
  ];
}

function snapshotLines(s: OntapState, vol: string | undefined): TermLine[] {
  if (vol && vol !== TARGET_VOL) return NO_ENTRIES;
  const v = s.volumes.find((x) => x.name === TARGET_VOL)!;
  return [
    {
      tone: "dim",
      text: `${"Vserver".padEnd(8)} ${"Volume".padEnd(8)} ${"Snapshot".padEnd(38)} ${"Size".padStart(8)} Total%`,
    },
    {
      tone: "dim",
      text: `${"-".repeat(8)} ${"-".repeat(8)} ${"-".repeat(38)} ${"-".repeat(8)} ------`,
    },
    { tone: "plain", text: `${SVM.padEnd(8)} ${TARGET_VOL}` },
    ...s.snapshots.map((sn): TermLine => ({
      tone: sn.busy ? "warn" : "plain",
      text: `${"".padEnd(17)} ${sn.name.padEnd(38)} ${fmtSize(sn.sizeGB).padStart(8)} ${String(Math.round((sn.sizeGB / v.sizeGB) * 100)).padStart(5)}%`,
    })),
    { tone: "plain", text: `${s.snapshots.length} entries were displayed.` },
  ];
}

const CLUSTER_SHOW = `Node                  Health  Eligibility
--------------------- ------- ------------
${CLUSTER}-01       true    true
${CLUSTER}-02       true    true
2 entries were displayed.`;

const FAILOVER_SHOW = `                              Takeover
Node           Partner        Possible State Description
-------------- -------------- -------- -------------------------------------
${CLUSTER}-01
               ${CLUSTER}-02
                              true     Connected to ${CLUSTER}-02
${CLUSTER}-02
               ${CLUSTER}-01
                              true     Connected to ${CLUSTER}-01
2 entries were displayed.`;

const LIF_SHOW = `            Logical      Status     Network            Current         Current Is
Vserver     Interface    Admin/Oper Address/Mask       Node            Port    Home
----------- ------------ ---------- ------------------ --------------- ------- ----
${CLUSTER}
            cluster_mgmt up/up      192.0.2.20/24      ${CLUSTER}-01 e0M     true
${SVM}
            lif_nfs_01   up/up      192.0.2.21/24      ${CLUSTER}-01 e0c     true
            lif_nfs_02   up/up      192.0.2.22/24      ${CLUSTER}-01 e0d     false
3 entries were displayed.`;

const HELP = `Perintah yang tersedia di simulasi:
  cluster show                         kesehatan node
  storage failover show                kesiapan HA
  storage aggregate show               kapasitas aggregate
  volume show                          kapasitas volume
  volume snapshot show -volume vol_app daftar snapshot
  network interface show               status LIF
  event log show                       event/alert
  storage disk show -broken            disk rusak
  volume size -vserver svm_demo -volume vol_app -new-size +100g
  volume snapshot delete -vserver svm_demo -volume vol_app -snapshot <nama>
  clear`;

/** Jalankan satu baris input. null = input kosong. */
export function runOntap(raw: string, s: OntapState): OntapResult | null {
  const input = raw.trim().replace(/\s+/g, " ");
  if (!input) return null;
  const p = parse(input);
  const w = (pattern: string) => cliMatch(p.words, pattern) !== null;
  const ok = (
    state: OntapState,
    lines: TermLine[],
    events: OntapEventKind[] = [],
    extra: Partial<OntapResult> = {},
  ): OntapResult => ({
    state,
    lines,
    events,
    ...extra,
  });

  if (w("clear")) return ok(s, [], [], { clear: true });
  if (input === "?" || w("help")) return ok(s, textBlock("plain", HELP));

  if (w("cl|uster show"))
    return ok(s, textBlock("plain", CLUSTER_SHOW), [], {
      commandId: "cluster",
    });
  if (w("stor|age fail|over show"))
    return ok(s, textBlock("plain", FAILOVER_SHOW), [], {
      commandId: "failover",
    });
  if (w("stor|age aggr|egate show") || w("aggr show"))
    return ok(s, aggrLines(s), ["aggr"], { commandId: "aggr" });
  if (w("vol|ume snap|shot show")) {
    return ok(s, snapshotLines(s, param(p, "volume")), ["snapshots"], {
      commandId: "snapshot",
    });
  }
  if (w("vol|ume show")) {
    const vol = param(p, "volume");
    return ok(
      s,
      volumeLines(s, vol),
      vol && vol !== TARGET_VOL ? [] : ["volume"],
      { commandId: "volume" },
    );
  }
  if (w("net|work int|erface show"))
    return ok(s, textBlock("plain", LIF_SHOW), [], { commandId: "lif" });
  if (w("ev|ent log show"))
    return ok(s, eventLines(s.events), ["events"], { commandId: "event" });
  if (w("stor|age disk show")) {
    return ok(
      s,
      param(p, "broken")
        ? NO_ENTRIES
        : textBlock(
            "dim",
            "(simulasi) Daftar disk panjang. Coba: storage disk show -broken",
          ),
      [],
      {
        commandId: "broken",
      },
    );
  }

  if (w("vol|ume size")) {
    const vol = param(p, "volume");
    const sizeRaw = param(p, "new-size");
    if (!vol || !sizeRaw) {
      return ok(
        s,
        textBlock(
          "err",
          "Error: Missing required parameters. Contoh: volume size -vserver svm_demo -volume vol_app -new-size +100g",
        ),
        [],
        {
          commandId: "volsize",
        },
      );
    }
    const v = s.volumes.find((x) => x.name === vol);
    if (!v)
      return ok(
        s,
        textBlock(
          "err",
          `Error: Volume "${vol}" tidak ditemukan di Vserver "${SVM}".`,
        ),
        [],
        { commandId: "volsize" },
      );
    const size = parseSize(sizeRaw);
    if (!size) {
      return ok(
        s,
        textBlock(
          "err",
          `Error: Ukuran "${sizeRaw}" tidak valid. Contoh: +100g, 600g, 1t.`,
        ),
        ["sizeError"],
        { commandId: "volsize" },
      );
    }
    const newSize = size.relative ? v.sizeGB + size.gb : size.gb;
    const delta = newSize - v.sizeGB;
    if (newSize <= v.usedGB) {
      return ok(
        s,
        textBlock(
          "err",
          `Error: command failed: Ukuran baru (${fmtSize(newSize)}) tidak boleh lebih kecil dari ruang terpakai (${fmtSize(v.usedGB)}).`,
        ),
        ["sizeError"],
        {
          commandId: "volsize",
        },
      );
    }
    if (delta > s.aggrAvailGB) {
      return ok(
        s,
        textBlock(
          "err",
          `Error: command failed: Penambahan ${fmtSize(delta)} melebihi ruang kosong aggregate aggr1_01 (${fmtSize(s.aggrAvailGB)}).`,
        ),
        ["sizeError"],
        {
          commandId: "volsize",
        },
      );
    }
    const resized = { ...v, sizeGB: newSize };
    const pct = pctOf(resized);
    const events =
      pct < 90 && pctOf(v) >= 90
        ? [
            {
              time: stamp(),
              node: `${CLUSTER}-01`,
              severity: "NOTICE" as const,
              text: `monitor.volume.ok: Volume ${vol}@vserver:${SVM} is no longer nearly full.`,
            },
            ...s.events,
          ]
        : s.events;
    const next: OntapState = {
      ...s,
      volumes: s.volumes.map((x) => (x.name === vol ? resized : x)),
      aggrAvailGB: s.aggrAvailGB - delta,
      events,
    };
    return ok(
      next,
      textBlock(
        "plain",
        `vol size: Volume "${SVM}:${vol}" size set to ${fmtSize(newSize).toLowerCase()}.`,
      ),
      ["resized"],
      {
        commandId: "volsize",
        pct,
      },
    );
  }

  if (w("vol|ume snap|shot del|ete")) {
    const snapName = param(p, "snapshot");
    const sn = s.snapshots.find((x) => x.name === snapName);
    if (!snapName || !sn) {
      return ok(
        s,
        textBlock(
          "err",
          `Error: Snapshot "${snapName ?? ""}" tidak ditemukan. Lihat daftar dengan volume snapshot show -volume vol_app.`,
        ),
        [],
        {
          commandId: "snapdelete",
        },
      );
    }
    if (sn.busy) {
      return ok(
        s,
        textBlock(
          "err",
          `Error: command failed: Snapshot copy "${sn.name}" is busy (owner: snapmirror).\nSnapshot ini dipakai replikasi DR; jangan dihapus.`,
        ),
        ["snapBusy"],
        { commandId: "snapdelete" },
      );
    }
    const next: OntapState = {
      ...s,
      snapshots: s.snapshots.filter((x) => x.name !== sn.name),
      volumes: s.volumes.map((x) =>
        x.name === TARGET_VOL
          ? { ...x, usedGB: Math.max(0, x.usedGB - sn.sizeGB) }
          : x,
      ),
    };
    return ok(
      next,
      textBlock("plain", `Snapshot "${sn.name}" dihapus (simulasi).`),
      ["snapDeleted"],
      { commandId: "snapdelete" },
    );
  }

  if (w("vol|ume del|ete") || w("vol|ume off|line")) {
    return ok(
      s,
      textBlock(
        "err",
        "DITOLAK (simulasi): offline/hapus volume memutus akses aplikasi dan bisa menghilangkan data.\nHanya dengan permintaan tertulis pemilik data dan MOP.",
      ),
      ["danger"],
      {
        commandId: "voldelete",
      },
    );
  }
  if (
    w("stor|age fail|over take|over") ||
    w("stor|age fail|over give|back") ||
    w("sys|tem node halt") ||
    w("sys|tem node reb|oot")
  ) {
    return ok(
      s,
      textBlock(
        "err",
        "DITOLAK (simulasi): takeover/halt/reboot node memindahkan atau menghentikan layanan storage.\nHanya di maintenance window dengan MOP dan cek storage failover show.",
      ),
      ["danger"],
      {
        commandId: "takeover",
      },
    );
  }

  return ok(
    s,
    textBlock("err", `Error: "${p.words}" is not a recognized command`),
  );
}
