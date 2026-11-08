import type { Concept } from "../../../components/ConceptExplorer";

export const ONTAP_CONCEPTS: Concept[] = [
  {
    id: "cluster",
    title: "Cluster",
    summary: "Kumpulan node yang dikelola sebagai satu sistem.",
    detail:
      "Satu cluster ONTAP berisi dua node atau lebih. Semuanya dikelola dari satu IP manajemen cluster, lewat CLI (SSH) atau System Manager di browser.",
    points: [
      "Nama cluster muncul di prompt: cluster-demo::>",
      "cluster show menampilkan kesehatan tiap node.",
    ],
    example: "cluster-demo::> cluster show",
  },
  {
    id: "ha",
    title: "Node & HA pair",
    summary: "Dua controller yang saling menjadi cadangan.",
    detail:
      "Node = satu controller. Dua node membentuk HA pair: kalau satu node mati, pasangannya mengambil alih disk dan layanannya (takeover).",
    points: [
      "Cek kesiapan HA dengan storage failover show.",
      "Takeover dan giveback adalah pekerjaan terjadwal, bukan coba-coba.",
    ],
    example: "cluster-demo::> storage failover show",
  },
  {
    id: "aggr",
    title: "Aggregate",
    summary: "Kumpulan disk yang menjadi kolam kapasitas.",
    detail:
      "Disk dikelompokkan dalam RAID group (umumnya RAID-DP: dua disk paritas per group). Setiap aggregate dimiliki satu node, dan kapasitas volume diambil dari sini.",
    points: [
      "Aggregate penuh = semua volume di dalamnya terancam.",
      "aggr0 adalah aggregate root berisi sistem ONTAP; wajar kalau hampir penuh.",
    ],
    example: "cluster-demo::> storage aggregate show",
  },
  {
    id: "svm",
    title: "SVM (Storage VM)",
    summary: "Server storage virtual yang dilihat client.",
    detail:
      "SVM punya volume, alamat IP (LIF), dan protokol sendiri: NFS, SMB, atau iSCSI. Satu cluster bisa punya banyak SVM, mis. per aplikasi atau per tenant.",
    points: ["Banyak perintah volume butuh -vserver <nama SVM>."],
    example: "cluster-demo::> vserver show",
  },
  {
    id: "volume",
    title: "Volume",
    summary: "Wadah data dengan ukuran sendiri.",
    detail:
      "Volume dibuat di aggregate lalu dibagikan ke client lewat NFS/SMB, atau berisi LUN untuk iSCSI/FC. Ukurannya bisa diperbesar tanpa downtime.",
    points: [
      "Pantau Used%; di atas 90% aplikasi mulai berisiko gagal menulis.",
      "Thin provisioning: ukuran volume bisa melebihi ruang yang benar-benar terpakai di aggregate.",
    ],
    example: "cluster-demo::> volume show -vserver svm_demo",
  },
  {
    id: "lif",
    title: "LIF",
    summary: "Alamat IP tempat client terhubung.",
    detail:
      "LIF (logical interface) menempel di port fisik, tapi bisa pindah ke port atau node lain saat ada gangguan. Ada LIF data, manajemen, dan cluster.",
    points: ["Kolom Is Home = false berarti LIF sedang tidak di port asalnya."],
    example: "cluster-demo::> network interface show",
  },
  {
    id: "snapshot",
    title: "Snapshot",
    summary: "Salinan read-only volume pada satu waktu.",
    detail:
      "Snapshot dibuat instan karena hanya mencatat blok yang berubah. Makin banyak data berubah dan makin lama snapshot disimpan, makin besar ruang yang dipakai.",
    points: [
      "Snapshot reserve = bagian volume yang disisihkan untuk snapshot.",
      "Snapshot bukan backup: kalau aggregate rusak, snapshot ikut hilang.",
    ],
    example: "cluster-demo::> volume snapshot show -volume vol_app",
  },
];
