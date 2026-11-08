import type { QuizItem } from "../../../components/Quiz";

export const NETAPP_QUIZ: QuizItem[] = [
  {
    q: "Volume vol_app terpakai 95%. Apa langkah pertama yang tepat?",
    options: [
      "Hapus semua snapshot",
      "Cek event log dan ruang aggregate sebelum menambah ukuran volume",
      "Reboot node",
      "Pindahkan LIF ke node lain",
    ],
    answer: 1,
    explain:
      "Pahami dulu kondisinya. Ukuran volume diambil dari aggregate, jadi pastikan aggregate masih punya ruang.",
  },
  {
    q: "Apa itu HA pair?",
    options: [
      "Dua disk yang saling mirror",
      "Dua node yang saling mengambil alih saat salah satu mati",
      "Dua SVM dengan nama sama",
      "Dua aggregate di satu node",
    ],
    answer: 1,
    explain:
      "Kalau satu node mati, pasangannya mengambil alih disk dan layanannya (takeover).",
  },
  {
    q: "Di network interface show, kolom Is Home = false artinya?",
    options: [
      "LIF mati",
      "LIF sedang tidak di port asalnya, biasanya setelah failover",
      "LIF tidak punya IP",
      "LIF khusus untuk cluster",
    ],
    answer: 1,
    explain:
      "Setelah penyebabnya beres, kembalikan LIF ke port asalnya dengan network interface revert.",
  },
  {
    q: "Kenapa snapshot bukan pengganti backup?",
    options: [
      "Snapshot terlalu lambat dibuat",
      "Snapshot ada di storage yang sama; kalau aggregate rusak, snapshot ikut hilang",
      "Snapshot tidak bisa di-restore",
      "Snapshot hanya untuk LUN",
    ],
    answer: 1,
    explain:
      "Backup harus disimpan di tempat lain (mis. SnapMirror/SnapVault ke sistem lain, atau aplikasi backup).",
  },
  {
    q: "Ada snapshot bernama snapmirror.demo_dr... di volume. Sebaiknya?",
    options: [
      "Dihapus untuk menghemat ruang",
      "Dibiarkan, karena dipakai replikasi",
      "Di-rename",
      "Dipindah ke volume lain",
    ],
    answer: 1,
    explain:
      "Snapshot SnapMirror dipakai sebagai titik sinkron replikasi DR. ONTAP juga menolak menghapusnya (busy).",
  },
  {
    q: "storage failover show menampilkan Takeover Possible = false. Artinya?",
    options: [
      "Semua normal",
      "Redundansi HA sedang tidak siap; tunda maintenance node",
      "Node sudah di-takeover",
      "Disk penuh",
    ],
    answer: 1,
    explain:
      "Kalau satu node bermasalah saat HA tidak siap, layanan bisa berhenti.",
  },
  {
    q: "Aggregate aggr0_01 terpakai 95%. Perlu panik?",
    options: [
      "Ya, langsung hapus isinya",
      "Tidak, aggr0 adalah aggregate root ONTAP dan wajar hampir penuh",
      "Ya, reboot cluster",
      "Tidak, karena aggregate tidak bisa penuh",
    ],
    answer: 1,
    explain:
      "aggr0 hanya berisi volume root sistem. Yang perlu dipantau adalah aggregate data (aggr1 dan seterusnya).",
  },
];
