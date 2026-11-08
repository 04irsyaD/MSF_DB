"use client";

import ConceptExplorer from "../../../components/ConceptExplorer";
import Note from "../../../components/Note";
import PartsExplorer from "../../../components/PartsExplorer";
import { DoDont, Quiz } from "../../../components/Quiz";
import SectionIntro from "../../../components/SectionIntro";
import CommandConsole from "../../../components/terminal/CommandConsole";
import { CARD } from "../../../lib/ui";
import { CLI_MODES, SWITCH_ROLES } from "../data/concepts";
import {
  IOS_CATEGORIES,
  IOS_COMMANDS,
  IOS_CONSOLE_PROMPT,
  IOS_WELCOME,
  runIosConsole,
} from "../data/commands";
import { SWITCH_PARTS } from "../data/parts";
import { CISCO_QUIZ } from "../data/quiz";
import SwitchSvg from "./SwitchSvg";

/** Bagian modul Cisco yang tidak punya state simulasi sendiri. */

export function IntroSection() {
  return (
    <>
      <SectionIntro title="Apa itu switch Cisco?">
        Switch menyambungkan perangkat dalam satu jaringan: PC, server, printer,
        access point, sampai switch lain. Switch Cisco Catalyst dikelola lewat
        CLI bernama <strong className="text-foreground">IOS</strong> (atau IOS
        XE), biasanya lewat SSH.
      </SectionIntro>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {SWITCH_ROLES.map((r) => (
          <div key={r.title} className={CARD}>
            <h3 className="mb-1.5 text-[15px] font-semibold text-foreground">
              {r.title}
            </h3>
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              {r.body}
            </p>
          </div>
        ))}
      </div>
      <SectionIntro title="Mode CLI IOS">
        Prompt di CLI memberi tahu kamu sedang di mode apa, dan setiap mode
        punya perintah berbeda. Klik tiap mode untuk melihat penjelasannya.
      </SectionIntro>
      <ConceptExplorer items={CLI_MODES} label="Mode CLI IOS" />
      <Note tone="info">
        <strong>Analogi untuk programmer:</strong> running-config = state di
        memori yang langsung dipakai. startup-config = file konfigurasi yang
        dibaca saat boot. write memory = menyimpan state ke file, mirip commit.
      </Note>
    </>
  );
}

export function PartsSection() {
  return (
    <>
      <SectionIntro title="Bagian-bagian switch">
        Klik bagian di gambar (atau pilih dari daftar) untuk melihat fungsinya,
        cara pakai, dan yang perlu diperhatikan. Gambar ini ilustrasi umum
        switch 1U 48 port, bukan model tertentu.
      </SectionIntro>
      <PartsExplorer
        parts={SWITCH_PARTS}
        views={[
          { id: "front", label: "Tampak depan", defaultPart: "ports" },
          { id: "rear", label: "Tampak belakang", defaultPart: "console" },
        ]}
        viewGroupLabel="Sisi switch"
        listLabel="Daftar bagian switch"
        renderSvg={(view, selected, pick) => (
          <SwitchSvg
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
      <SectionIntro title="Perintah show">
        Perintah show hanya membaca kondisi switch, jadi aman untuk latihan.
        Klik salah satu perintah untuk melihat contoh output dan cara
        membacanya. Singkatan juga bisa diketik, mis. sh ip int br.
      </SectionIntro>
      <CommandConsole
        commands={IOS_COMMANDS}
        categories={IOS_CATEGORIES}
        prompt={IOS_CONSOLE_PROMPT}
        welcome={IOS_WELCOME}
        run={runIosConsole}
        screenLabel="Layar contoh output Cisco IOS"
        inputPlaceholder="ketik perintah, mis. show interfaces status"
        inputLabel="Perintah Cisco IOS"
      />
    </>
  );
}

const DO = [
  <>
    Jalankan <strong>show interfaces status</strong> dan{" "}
    <strong>show logging</strong> dulu sebelum mengubah apa pun.
  </>,
  <>
    Pastikan nomor port dari output dan label kabel, terutama di stack (
    <strong>Gi1/0/x</strong> vs <strong>Gi2/0/x</strong>).
  </>,
  <>
    Simpan hasil show running-config sebelum perubahan sebagai catatan kondisi
    awal.
  </>,
  <>
    Setelah perubahan diverifikasi, simpan dengan <strong>write memory</strong>.
  </>,
  <>Beri description di port yang diubah supaya rekan lain paham.</>,
  <>
    Ubah uplink, trunk, atau spanning-tree hanya di{" "}
    <strong>maintenance window</strong> dengan MOP.
  </>,
];

const DONT = [
  "Shutdown port uplink atau trunk, apalagi saat kamu SSH lewat port itu.",
  "Menjalankan reload atau write erase di jam kerja tanpa approval.",
  "Memulihkan port err-disabled sebelum penyebabnya dihilangkan.",
  "Memindahkan port ke VLAN lain tanpa tahu perangkat apa di ujungnya.",
  "Copy-paste konfigurasi dari internet langsung ke switch production.",
  "Berbagi password enable atau akun SSH.",
];

export function QuizSection() {
  return (
    <>
      <SectionIntro title="Yang wajib diperhatikan">
        Aturan yang paling sering menyelamatkan dari outage saat pegang switch.
      </SectionIntro>
      <DoDont dos={DO} donts={DONT} />
      <Quiz items={CISCO_QUIZ} idPrefix="cisco" />
    </>
  );
}
