import type { TermLine } from "../../../lib/types";

/** Semua alamat memakai blok dokumentasi RFC 5737; nama fiktif. */
export const FW_HOST = "FW-DEMO-01";
export const FW_PROMPT = `admin@${FW_HOST}>`;
export const PORTAL_IP = "198.51.100.80";
export const USER_IP = "192.0.2.25";

export type Zone = "trust" | "untrust" | "dmz";

export interface SecRule {
  id: string;
  name: string;
  from: Zone;
  to: Zone;
  destination: string;
  application: string[];
  action: "allow" | "deny";
  enabled: boolean;
}

export const INITIAL_RULES: SecRule[] = [
  {
    id: "r1",
    name: "allow-dns",
    from: "trust",
    to: "untrust",
    destination: "any",
    application: ["dns"],
    action: "allow",
    enabled: true,
  },
  {
    id: "r2",
    name: "block-social",
    from: "trust",
    to: "untrust",
    destination: "any",
    application: ["facebook-base", "tiktok-base"],
    action: "deny",
    enabled: true,
  },
  {
    id: "r3",
    name: "allow-web",
    from: "trust",
    to: "untrust",
    destination: "any",
    application: ["web-browsing", "ssl"],
    action: "allow",
    enabled: true,
  },
  {
    id: "r4",
    name: "deny-trust-to-dmz",
    from: "trust",
    to: "dmz",
    destination: "any",
    application: ["any"],
    action: "deny",
    enabled: true,
  },
  {
    id: "r5",
    name: "allow-app-portal",
    from: "trust",
    to: "dmz",
    destination: PORTAL_IP,
    application: ["ssl"],
    action: "allow",
    enabled: true,
  },
];

export interface Flow {
  id: string;
  label: string;
  from: Zone;
  to: Zone;
  source: string;
  destination: string;
  port: number;
  protocol: number;
  application: string;
}

export const FLOWS: Flow[] = [
  {
    id: "portal",
    label: "User buka portal aplikasi (DMZ)",
    from: "trust",
    to: "dmz",
    source: USER_IP,
    destination: PORTAL_IP,
    port: 443,
    protocol: 6,
    application: "ssl",
  },
  {
    id: "ssh",
    label: "User SSH ke server portal (DMZ)",
    from: "trust",
    to: "dmz",
    source: USER_IP,
    destination: PORTAL_IP,
    port: 22,
    protocol: 6,
    application: "ssh",
  },
  {
    id: "web",
    label: "User browsing internet",
    from: "trust",
    to: "untrust",
    source: USER_IP,
    destination: "203.0.113.10",
    port: 443,
    protocol: 6,
    application: "ssl",
  },
  {
    id: "social",
    label: "User buka media sosial",
    from: "trust",
    to: "untrust",
    source: USER_IP,
    destination: "203.0.113.20",
    port: 443,
    protocol: 6,
    application: "facebook-base",
  },
  {
    id: "dns",
    label: "User query DNS",
    from: "trust",
    to: "untrust",
    source: USER_IP,
    destination: "203.0.113.53",
    port: 53,
    protocol: 17,
    application: "dns",
  },
];

export interface MatchResult {
  /** null = tidak ada rule cocok, jatuh ke interzone-default. */
  rule: SecRule | null;
  index: number;
  action: "allow" | "deny";
}

/** Dibaca dari atas; berhenti di rule aktif pertama yang cocok. */
export function evaluate(
  rules: SecRule[],
  flow: Omit<Flow, "id" | "label">,
): MatchResult {
  for (let i = 0; i < rules.length; i++) {
    const r = rules[i];
    if (!r.enabled) continue;
    if (r.from !== flow.from || r.to !== flow.to) continue;
    if (r.destination !== "any" && r.destination !== flow.destination) continue;
    if (
      !r.application.includes("any") &&
      !r.application.includes(flow.application)
    )
      continue;
    return { rule: r, index: i + 1, action: r.action };
  }
  return {
    rule: null,
    index: rules.length + 1,
    action: flow.from === flow.to ? "allow" : "deny",
  };
}

export function testCommand(f: Omit<Flow, "id" | "label">) {
  return `test security-policy-match from ${f.from} to ${f.to} source ${f.source} destination ${f.destination} destination-port ${f.port} protocol ${f.protocol} application ${f.application}`;
}

/** Output gaya PAN-OS untuk test security-policy-match (disederhanakan). */
export function testOutput(
  m: MatchResult,
  f: Omit<Flow, "id" | "label">,
): TermLine[] {
  const name = m.rule ? m.rule.name : "interzone-default";
  const tone: TermLine["tone"] = m.action === "allow" ? "ok" : "err";
  return [
    { tone, text: `"${name}; index: ${m.index}" {` },
    { tone: "plain", text: `        from ${m.rule?.from ?? f.from};` },
    { tone: "plain", text: "        source any;" },
    { tone: "plain", text: `        to ${m.rule?.to ?? f.to};` },
    {
      tone: "plain",
      text: `        destination ${m.rule?.destination ?? "any"};`,
    },
    {
      tone: "plain",
      text: `        application ${m.rule ? m.rule.application.join(" ") : "any"};`,
    },
    { tone, text: `        action ${m.action};` },
    { tone: "plain", text: "}" },
  ];
}

export function policyLines(rules: SecRule[]): TermLine[] {
  return [
    ...rules.map((r, i): TermLine => ({
      tone: r.enabled ? "plain" : "dim",
      text: `"${r.name}; index: ${i + 1}" { from ${r.from}; to ${r.to}; destination ${r.destination}; application ${r.application.join(" ")}; action ${r.action};${r.enabled ? "" : " disabled yes;"} }`,
    })),
    {
      tone: "dim",
      text: `"interzone-default; index: ${rules.length + 1}" { from any; to any; action deny; }`,
    },
  ];
}
