import type { Tone } from "../../../lib/types";
import { PORTAL_IP, USER_IP } from "./policy";

export interface TrafficLog {
  id: string;
  time: string;
  source: string;
  destination: string;
  application: string;
  port: number;
  rule: string;
  action: "allow" | "deny";
  endReason: EndReason;
}

export type EndReason =
  "policy-deny" | "tcp-fin" | "aged-out" | "tcp-rst-from-server" | "threat";

export const END_REASON: Record<EndReason, { tone: Tone; text: string }> = {
  "policy-deny": {
    tone: "bad",
    text: "Ditolak security policy. Kolom Rule menunjukkan rule yang menolak; cek dengan test security-policy-match.",
  },
  "tcp-fin": {
    tone: "ok",
    text: "Sesi selesai normal: kedua sisi menutup koneksi.",
  },
  "aged-out": {
    tone: "info",
    text: "Sesi habis waktu tanpa trafik. Normal untuk UDP seperti DNS; untuk TCP bisa berarti server tujuan tidak membalas.",
  },
  "tcp-rst-from-server": {
    tone: "warn",
    text: "Server tujuan yang memutus koneksi. Firewall sudah mengizinkan; masalahnya di sisi server atau aplikasi.",
  },
  threat: {
    tone: "bad",
    text: "Sesi diputus karena profil keamanan mendeteksi ancaman. Cek Threat log untuk detailnya.",
  },
};

export const TRAFFIC_LOGS: TrafficLog[] = [
  {
    id: "l1",
    time: "2026/11/08 09:01:12",
    source: USER_IP,
    destination: PORTAL_IP,
    application: "ssl",
    port: 443,
    rule: "deny-trust-to-dmz",
    action: "deny",
    endReason: "policy-deny",
  },
  {
    id: "l2",
    time: "2026/11/08 09:01:40",
    source: "192.0.2.31",
    destination: "203.0.113.10",
    application: "ssl",
    port: 443,
    rule: "allow-web",
    action: "allow",
    endReason: "tcp-fin",
  },
  {
    id: "l3",
    time: "2026/11/08 09:02:05",
    source: "192.0.2.44",
    destination: "203.0.113.20",
    application: "facebook-base",
    port: 443,
    rule: "block-social",
    action: "deny",
    endReason: "policy-deny",
  },
  {
    id: "l4",
    time: "2026/11/08 09:03:17",
    source: "192.0.2.31",
    destination: "203.0.113.53",
    application: "dns",
    port: 53,
    rule: "allow-dns",
    action: "allow",
    endReason: "aged-out",
  },
  {
    id: "l5",
    time: "2026/11/08 09:04:50",
    source: "192.0.2.52",
    destination: "203.0.113.10",
    application: "ssl",
    port: 443,
    rule: "allow-web",
    action: "allow",
    endReason: "tcp-rst-from-server",
  },
  {
    id: "l6",
    time: "2026/11/08 09:05:33",
    source: USER_IP,
    destination: PORTAL_IP,
    application: "ssh",
    port: 22,
    rule: "deny-trust-to-dmz",
    action: "deny",
    endReason: "policy-deny",
  },
  {
    id: "l7",
    time: "2026/11/08 09:06:10",
    source: "192.0.2.60",
    destination: "203.0.113.99",
    application: "web-browsing",
    port: 80,
    rule: "allow-web",
    action: "allow",
    endReason: "threat",
  },
  {
    id: "l8",
    time: "2026/11/08 09:07:45",
    source: "192.0.2.31",
    destination: "203.0.113.77",
    application: "incomplete",
    port: 443,
    rule: "allow-web",
    action: "allow",
    endReason: "aged-out",
  },
];
