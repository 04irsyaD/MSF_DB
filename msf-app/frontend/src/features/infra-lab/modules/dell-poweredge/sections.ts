import type { LabSection } from "../../lib/types";

/** Urutan bagian modul Dell. Indeks dipakai stepper dan progres di localStorage. */
export const DELL_SECTIONS: readonly LabSection[] = [
  {
    title: "Kenalan",
    summary: "Jenis server Rack, Tower, Modular, dan cara membaca nama model.",
  },
  {
    title: "Bagian server",
    summary:
      "Tampak depan dan belakang yang bisa diklik, lengkap dengan fungsi dan hal yang perlu diperhatikan.",
  },
  {
    title: "Tombol saat boot",
    summary: "Simulasi layar POST serta tombol F2, F10, F11, dan F12.",
  },
  {
    title: "iDRAC",
    summary:
      "Simulasi ganti disk rusak: Dashboard, Storage, Logs, dan Terminal racadm.",
  },
  {
    title: "Perintah racadm",
    summary: "Daftar perintah racadm, contoh output, dan cara membacanya.",
  },
  { title: "RAID", summary: "Kalkulator kapasitas dan simulasi disk rusak." },
  {
    title: "Perhatian & kuis",
    summary: "Yang wajib dan yang dilarang, lalu kuis singkat.",
  },
];

export const DELL_SECTION = {
  intro: 0,
  parts: 1,
  boot: 2,
  idrac: 3,
  commands: 4,
  raid: 5,
  quiz: 6,
} as const;
