import type { LabSection } from "../../lib/types";

export const CISCO_SECTIONS: readonly LabSection[] = [
  {
    title: "Kenalan",
    summary: "Peran switch di jaringan dan mode CLI Cisco IOS.",
  },
  {
    title: "Bagian switch",
    summary:
      "Tampak depan dan belakang: port akses, uplink, console, dan power.",
  },
  {
    title: "Perintah show",
    summary: "Perintah show penting, contoh output, dan cara membacanya.",
  },
  {
    title: "Simulasi port mati",
    summary: "Cari port user yang err-disabled lalu pulihkan tanpa salah port.",
  },
  {
    title: "VLAN",
    summary:
      "Atur VLAN tiap port dan lihat perangkat mana yang bisa saling bicara.",
  },
  {
    title: "Perhatian & kuis",
    summary: "Yang wajib dan yang dilarang, lalu kuis singkat.",
  },
];

export const CISCO_SECTION = {
  intro: 0,
  parts: 1,
  commands: 2,
  sim: 3,
  vlan: 4,
  quiz: 5,
} as const;
