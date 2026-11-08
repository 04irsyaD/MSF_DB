"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { TermLine, Tone } from "../../../lib/types";
import { CARD, FOCUS_RING, LABEL, TERM_LINE } from "../../../lib/ui";
import DeviceScreen from "../../../components/DeviceScreen";
import Note from "../../../components/Note";
import SectionIntro from "../../../components/SectionIntro";
import { TagBadge } from "../../../components/StatusPill";
import { SW_HOST } from "../data/device";
import { GUEST_VLAN, VLANS, VLAN_HOSTS } from "../data/vlan";

const SELECT = cn(
  "rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm text-foreground",
  FOCUS_RING,
);

const isGuestDevice = (device: string) => device.includes("TAMU");
const vlanName = (id: string) => VLANS.find((v) => v.id === id)?.name ?? id;

export default function VlanSection() {
  const [assign, setAssign] = useState<Record<string, string>>(
    Object.fromEntries(VLAN_HOSTS.map((h) => [h.port, h.vlan])),
  );
  const [a, setA] = useState(VLAN_HOSTS[0].port);
  const [b, setB] = useState(VLAN_HOSTS[3].port);

  const hostA = VLAN_HOSTS.find((h) => h.port === a)!;
  const hostB = VLAN_HOSTS.find((h) => h.port === b)!;
  const va = assign[a];
  const vb = assign[b];

  let result: { tone: Tone; text: string };
  if (a === b) {
    result = { tone: "info", text: "Pilih dua perangkat yang berbeda." };
  } else if (va === vb) {
    const officeInGuest =
      va === GUEST_VLAN &&
      (!isGuestDevice(hostA.device) || !isGuestDevice(hostB.device));
    result = officeInGuest
      ? {
          tone: "bad",
          text: `Bisa saling kirim, tapi ini berbahaya: perangkat kantor kini satu VLAN dengan tamu (VLAN ${GUEST_VLAN}). Kembalikan ke VLAN kantornya.`,
        }
      : {
          tone: "ok",
          text: `${hostA.device} dan ${hostB.device} sama-sama di VLAN ${va} (${vlanName(va)}): bisa langsung saling kirim data di Layer 2, tanpa router.`,
        };
  } else if (va === GUEST_VLAN || vb === GUEST_VLAN) {
    result = {
      tone: "warn",
      text: `Tidak bisa langsung. VLAN ${GUEST_VLAN} (TAMU) sengaja dipisah dari jaringan kantor, dan di router/firewall biasanya hanya diizinkan ke internet.`,
    };
  } else {
    result = {
      tone: "warn",
      text: `Tidak bisa langsung: ${hostA.device} di VLAN ${va}, ${hostB.device} di VLAN ${vb}. Trafik harus lewat routing (router atau SVI) dan diizinkan ACL/firewall.`,
    };
  }

  const changed = VLAN_HOSTS.filter((h) => assign[h.port] !== h.vlan);
  const screen: TermLine[] = [
    { tone: "ok", text: `${SW_HOST}# show vlan brief` },
    {
      tone: "dim",
      text: `${"VLAN".padEnd(4)} ${"Name".padEnd(12)} Status    Ports`,
    },
    {
      tone: "dim",
      text: `${"-".repeat(4)} ${"-".repeat(12)} --------- ------------------------------`,
    },
    ...VLANS.map((v): TermLine => ({
      tone: "plain",
      text: `${v.id.padEnd(4)} ${v.name.padEnd(12)} active    ${VLAN_HOSTS.filter(
        (h) => assign[h.port] === v.id,
      )
        .map((h) => h.port)
        .join(", ")}`,
    })),
    { tone: "plain", text: "" },
    { tone: "dim", text: "! Konfigurasi yang setara dengan perubahanmu:" },
    ...(changed.length === 0
      ? [{ tone: "dim" as const, text: "! (belum ada perubahan)" }]
      : changed.flatMap((h): TermLine[] => [
          { tone: "plain", text: `interface ${h.full}` },
          { tone: "plain", text: " switchport mode access" },
          { tone: "plain", text: ` switchport access vlan ${assign[h.port]}` },
        ])),
  ];

  return (
    <>
      <SectionIntro title="VLAN: memisahkan jaringan di satu switch">
        VLAN membagi satu switch menjadi beberapa jaringan terpisah. Ubah VLAN
        tiap port, lalu uji apakah dua perangkat bisa langsung saling kirim
        data.
      </SectionIntro>

      <div className={cn(CARD, "flex flex-col gap-3")}>
        <p className={LABEL}>Port dan VLAN</p>
        <ul className="flex flex-col gap-2">
          {VLAN_HOSTS.map((h) => {
            const v = assign[h.port];
            const risky = v === GUEST_VLAN && !isGuestDevice(h.device);
            return (
              <li
                key={h.port}
                className="flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-lg border border-border px-3 py-2"
              >
                <span className="w-16 font-mono text-xs font-semibold text-foreground">
                  {h.port}
                </span>
                {/* min-w: di HP dropdown turun ke baris bawah, bukan memeras nama perangkat. */}
                <span className="min-w-[7rem] flex-1 text-sm text-foreground">
                  {h.device}
                </span>
                {risky && (
                  <TagBadge tone="bad">Perangkat kantor di VLAN tamu</TagBadge>
                )}
                <label className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="sr-only">VLAN untuk {h.port}</span>
                  <select
                    value={v}
                    onChange={(e) =>
                      setAssign((prev) => ({
                        ...prev,
                        [h.port]: e.target.value,
                      }))
                    }
                    className={SELECT}
                  >
                    {VLANS.map((vl) => (
                      <option key={vl.id} value={vl.id}>
                        VLAN {vl.id} {vl.name}
                      </option>
                    ))}
                  </select>
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      <div className={cn(CARD, "flex flex-col gap-3")}>
        <p className={LABEL}>Uji komunikasi</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {(
            [
              ["Perangkat A", a, setA],
              ["Perangkat B", b, setB],
            ] as const
          ).map(([label, value, set]) => (
            <label
              key={label}
              className="flex flex-col gap-1 text-[13px] font-semibold text-muted-foreground"
            >
              {label}
              <select
                value={value}
                onChange={(e) => set(e.target.value)}
                className={SELECT}
              >
                {VLAN_HOSTS.map((h) => (
                  <option key={h.port} value={h.port}>
                    {h.device} ({h.port}, VLAN {assign[h.port]})
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
        <Note tone={result.tone}>{result.text}</Note>
      </div>

      <DeviceScreen label="Output show vlan brief">
        {screen.map((l, i) => (
          <div
            key={i}
            className={cn("min-h-[1.5em] whitespace-pre", TERM_LINE[l.tone])}
          >
            {l.text}
          </div>
        ))}
      </DeviceScreen>

      <Note tone="info">
        Port uplink (trunk) membawa semua VLAN ke switch lain. Antar VLAN,
        trafik harus lewat router atau SVI, dan biasanya dibatasi ACL atau
        firewall. Mengubah VLAN port berarti memindahkan perangkat ke jaringan
        lain: pastikan dulu perangkat apa yang ada di ujungnya.
      </Note>
    </>
  );
}
