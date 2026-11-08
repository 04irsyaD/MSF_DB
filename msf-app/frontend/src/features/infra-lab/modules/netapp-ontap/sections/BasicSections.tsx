"use client";

import ConceptExplorer from "../../../components/ConceptExplorer";
import Note from "../../../components/Note";
import PartsExplorer from "../../../components/PartsExplorer";
import { DoDont, Quiz } from "../../../components/Quiz";
import SectionIntro from "../../../components/SectionIntro";
import CommandConsole from "../../../components/terminal/CommandConsole";
import {
  ONTAP_CATEGORIES,
  ONTAP_COMMANDS,
  ONTAP_WELCOME,
  runOntapConsole,
} from "../data/commands";
import { ONTAP_CONCEPTS } from "../data/concepts";
import { ONTAP_PROMPT } from "../data/ontap";
import { NETAPP_PARTS } from "../data/parts";
import { NETAPP_QUIZ } from "../data/quiz";
import NetappSvg from "./NetappSvg";

/** Bagian modul NetApp yang tidak punya state simulasi sendiri. */

export function IntroSection() {
  return (
    <>
      <SectionIntro title="Apa itu NetApp ONTAP?">
        NetApp adalah storage yang menyediakan ruang data untuk server lewat
        jaringan: share file (NFS/SMB) atau disk blok (iSCSI/FC). Sistem
        operasinya bernama <strong className="text-foreground">ONTAP</strong>.
        Klik tiap lapisan untuk memahami susunannya, dari cluster sampai
        snapshot.
      </SectionIntro>
      <ConceptExplorer items={ONTAP_CONCEPTS} label="Hierarki ONTAP" />
      <Note tone="info">
        <strong>Analogi untuk programmer:</strong> aggregate = kolam disk,
        volume = folder/database dengan kuota sendiri, SVM = server virtual yang
        dilihat aplikasi, snapshot = commit read-only yang dibuat instan karena
        hanya menyimpan perubahan.
      </Note>
    </>
  );
}

export function PartsSection() {
  return (
    <>
      <SectionIntro title="Bagian perangkat">
        Klik bagian di gambar (atau pilih dari daftar) untuk melihat fungsinya,
        cara pakai, dan yang perlu diperhatikan. Gambar ini ilustrasi umum,
        bukan model tertentu.
      </SectionIntro>
      <PartsExplorer
        parts={NETAPP_PARTS}
        views={[
          {
            id: "controller",
            label: "Controller (belakang)",
            defaultPart: "ctrlA",
          },
          { id: "shelf", label: "Disk shelf (depan)", defaultPart: "drives" },
        ]}
        viewGroupLabel="Perangkat"
        listLabel="Daftar bagian perangkat"
        renderSvg={(view, selected, pick) => (
          <NetappSvg
            view={view as "controller" | "shelf"}
            selected={selected}
            onPick={pick}
          />
        )}
      />
    </>
  );
}

export function CommandsSection() {
  return (
    <>
      <SectionIntro title="Perintah ONTAP">
        CLI ONTAP diakses lewat SSH ke IP manajemen cluster. Klik salah satu
        perintah untuk melihat contoh output dan cara membacanya. Kata perintah
        boleh disingkat, mis. vol show.
      </SectionIntro>
      <CommandConsole
        commands={ONTAP_COMMANDS}
        categories={ONTAP_CATEGORIES}
        prompt={ONTAP_PROMPT}
        welcome={ONTAP_WELCOME}
        run={runOntapConsole}
        screenLabel="Layar contoh output ONTAP"
        inputPlaceholder="ketik perintah, mis. volume show"
        inputLabel="Perintah ONTAP"
      />
    </>
  );
}

const DO = [
  <>
    Cek <strong>storage failover show</strong> sebelum pekerjaan di salah satu
    node.
  </>,
  <>Pantau Used% volume dan aggregate; tindak lanjuti sejak 80%.</>,
  <>
    Cek ruang aggregate sebelum memperbesar volume, lalu tambah{" "}
    <strong>secukupnya</strong>.
  </>,
  <>
    Konfirmasi ke pemilik data sebelum mengubah retensi atau menghapus snapshot.
  </>,
  <>
    Lampirkan <strong>AutoSupport</strong> saat membuka kasus ke NetApp.
  </>,
  <>
    Setelah pekerjaan kabel, pastikan semua LIF kembali{" "}
    <strong>Is Home = true</strong>.
  </>,
];

const DONT = [
  "Menghapus snapshot snapmirror atau snapshot milik aplikasi backup.",
  "Offline atau menghapus volume tanpa permintaan tertulis pemilik data.",
  "Melakukan takeover/giveback di luar maintenance window.",
  "Mencabut kabel cluster interconnect atau kabel shelf sembarangan.",
  "Menganggap snapshot sebagai backup.",
  "Mengutak-atik aggr0 (root) atau masuk mode diag tanpa arahan support.",
];

export function QuizSection() {
  return (
    <>
      <SectionIntro title="Yang wajib diperhatikan">
        Aturan yang paling sering menyelamatkan dari kehilangan data saat pegang
        storage.
      </SectionIntro>
      <DoDont dos={DO} donts={DONT} />
      <Quiz items={NETAPP_QUIZ} idPrefix="netapp" />
    </>
  );
}
