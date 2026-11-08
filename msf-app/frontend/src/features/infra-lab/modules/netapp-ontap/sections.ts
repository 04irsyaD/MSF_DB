import type { LabSection } from "../../lib/types";

export const NETAPP_SECTIONS: readonly LabSection[] = [
  {
    title: "Kenalan",
    summary:
      "Hierarki ONTAP: cluster, node, aggregate, SVM, volume, LIF, snapshot.",
  },
  {
    title: "Bagian perangkat",
    summary: "Controller (tampak belakang) dan disk shelf (tampak depan).",
  },
  {
    title: "Perintah ONTAP",
    summary: "Perintah CLI ONTAP penting, contoh output, dan cara membacanya.",
  },
  {
    title: "Simulasi volume penuh",
    summary: "Tangani volume yang hampir penuh tanpa menghapus data penting.",
  },
  {
    title: "Snapshot & kapasitas",
    summary: "Hitung ruang snapshot dan lihat kapan volume mulai berisiko.",
  },
  {
    title: "Perhatian & kuis",
    summary: "Yang wajib dan yang dilarang, lalu kuis singkat.",
  },
];
