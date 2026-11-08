import type { LabSection } from "../../lib/types";

export const PALO_SECTIONS: readonly LabSection[] = [
  {
    title: "Kenalan",
    summary:
      "Zone, security policy, App-ID, NAT, commit, dan management vs data plane.",
  },
  {
    title: "Bagian firewall",
    summary:
      "Tampak depan dan belakang: MGT, port HA, port data, SFP, dan power.",
  },
  {
    title: "Perintah CLI",
    summary: "Perintah CLI PAN-OS penting, contoh output, dan cara membacanya.",
  },
  {
    title: "Simulasi policy",
    summary: "Cari rule yang menolak trafik, perbaiki urutannya, lalu commit.",
  },
  {
    title: "Baca traffic log",
    summary: "Pahami action, rule, dan session end reason di traffic log.",
  },
  {
    title: "Perhatian & kuis",
    summary: "Yang wajib dan yang dilarang, lalu kuis singkat.",
  },
];
