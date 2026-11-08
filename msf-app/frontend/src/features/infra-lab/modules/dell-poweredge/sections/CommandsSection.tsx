"use client";

import CommandConsole from "../../../components/terminal/CommandConsole";
import SectionIntro from "../../../components/SectionIntro";
import {
  DEFAULT_RACADM_CONTEXT,
  RACADM_CATEGORIES,
  RACADM_COMMANDS,
  RACADM_PROMPT,
  RACADM_WELCOME,
  runRacadm,
} from "../data/commands";

const run = (raw: string) => runRacadm(raw, DEFAULT_RACADM_CONTEXT);

export default function CommandsSection() {
  return (
    <>
      <SectionIntro title="Perintah racadm">
        racadm adalah perintah baris iDRAC, dijalankan lewat SSH ke IP iDRAC.
        Klik salah satu perintah di bawah layar untuk melihat contoh output dan
        cara membacanya.
      </SectionIntro>
      <CommandConsole
        commands={RACADM_COMMANDS}
        categories={RACADM_CATEGORIES}
        prompt={RACADM_PROMPT}
        welcome={RACADM_WELCOME}
        run={run}
        screenLabel="Layar contoh output racadm"
        inputPlaceholder="ketik perintah, mis. racadm getsysinfo"
        inputLabel="Perintah racadm"
      />
    </>
  );
}
