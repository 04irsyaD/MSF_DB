"use client";

import ConceptExplorer from "../../../components/ConceptExplorer";
import Note from "../../../components/Note";
import PartsExplorer from "../../../components/PartsExplorer";
import { DoDont, Quiz } from "../../../components/Quiz";
import SectionIntro from "../../../components/SectionIntro";
import CommandConsole from "../../../components/terminal/CommandConsole";
import {
  PANOS_CATEGORIES,
  PANOS_COMMANDS,
  PANOS_WELCOME,
  runPanosConsole,
} from "../data/commands";
import { PALO_CONCEPTS } from "../data/concepts";
import { PALO_PARTS } from "../data/parts";
import { FW_PROMPT } from "../data/policy";
import { PALO_QUIZ } from "../data/quiz";
import FirewallSvg from "./FirewallSvg";

/** Bagian modul Palo Alto yang tidak punya state simulasi sendiri. */

export function IntroSection() {
  return (
    <>
      <SectionIntro title="Apa itu firewall Palo Alto?">
        Firewall menjaga batas antar jaringan: kantor, internet, dan DMZ. Palo
        Alto (PAN-OS) mengatur trafik berdasarkan zone, aplikasi, dan user, lalu
        mencatat semuanya di log. Klik tiap konsep untuk memahaminya.
      </SectionIntro>
      <ConceptExplorer items={PALO_CONCEPTS} label="Konsep dasar Palo Alto" />
      <Note tone="info">
        <strong>Analogi untuk programmer:</strong> security policy seperti
        rantai if-else yang dicek berurutan: kondisi pertama yang cocok menang,
        sisanya tidak dibaca. Commit seperti deploy: kode (candidate) belum
        jalan sebelum di-deploy.
      </Note>
    </>
  );
}

export function PartsSection() {
  return (
    <>
      <SectionIntro title="Bagian-bagian firewall">
        Klik bagian di gambar (atau pilih dari daftar) untuk melihat fungsinya,
        cara pakai, dan yang perlu diperhatikan. Gambar ini ilustrasi umum
        firewall 1U, bukan model tertentu.
      </SectionIntro>
      <PartsExplorer
        parts={PALO_PARTS}
        views={[
          { id: "front", label: "Tampak depan", defaultPart: "data" },
          { id: "rear", label: "Tampak belakang", defaultPart: "psu1" },
        ]}
        viewGroupLabel="Sisi firewall"
        listLabel="Daftar bagian firewall"
        renderSvg={(view, selected, pick) => (
          <FirewallSvg
            view={view as "front" | "rear"}
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
      <SectionIntro title="Perintah CLI PAN-OS">
        CLI dibuka lewat SSH ke IP MGT. Klik salah satu perintah untuk melihat
        contoh output dan cara membacanya. Di CLI asli perintah dilengkapi
        dengan Tab; di simulasi ini ketik perintah lengkap.
      </SectionIntro>
      <CommandConsole
        commands={PANOS_COMMANDS}
        categories={PANOS_CATEGORIES}
        prompt={FW_PROMPT}
        welcome={PANOS_WELCOME}
        run={runPanosConsole}
        screenLabel="Layar contoh output PAN-OS"
        inputPlaceholder="ketik perintah, mis. show system info"
        inputLabel="Perintah PAN-OS"
      />
    </>
  );
}

const DO = [
  <>
    Pakai <strong>traffic log</strong> dan{" "}
    <strong>test security-policy-match</strong> untuk mencari rule yang menolak.
  </>,
  <>Buat rule sespesifik mungkin: zone, alamat tujuan, dan aplikasi.</>,
  <>
    Review perubahan (Preview Changes) sebelum <strong>commit</strong>, dan
    commit sesuai MOP.
  </>,
  <>Beri nama dan deskripsi rule yang jelas, plus nomor tiket.</>,
  <>
    Pastikan HA sinkron (<strong>show high-availability state</strong>) sebelum
    dan sesudah perubahan.
  </>,
  <>Simpan backup konfigurasi sebelum perubahan besar.</>,
];

const DONT = [
  'Membuat rule any-any-allow untuk "sekadar mengetes".',
  "Commit di jam sibuk tanpa approval.",
  "Menaruh rule allow yang luas di atas rule deny yang spesifik.",
  "Menjalankan clear session all atau restart di production tanpa MOP.",
  "Membuka akses MGT ke internet.",
  "Mencabut kabel HA atau port data tanpa tahu zone-nya.",
];

export function QuizSection() {
  return (
    <>
      <SectionIntro title="Yang wajib diperhatikan">
        Aturan yang paling sering menyelamatkan dari outage dan celah keamanan
        saat pegang firewall.
      </SectionIntro>
      <DoDont dos={DO} donts={DONT} />
      <Quiz items={PALO_QUIZ} idPrefix="palo" />
    </>
  );
}
