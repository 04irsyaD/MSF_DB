"use client";

import LabShell from "../../components/LabShell";
import { getModule } from "../../modules";
import { DELL_SECTION } from "./sections";
import IntroSection from "./sections/IntroSection";
import PartsSection from "./sections/PartsSection";
import BootSection from "./sections/BootSection";
import IdracSection from "./sections/IdracSection";
import CommandsSection from "./sections/CommandsSection";
import RaidSection from "./sections/RaidSection";
import QuizSection from "./sections/QuizSection";

const MODULE = getModule("dell-poweredge");

/** Modul Dell PowerEdge. Urutan node harus sama dengan DELL_SECTIONS. */
export default function DellPowerEdgeLab() {
  return (
    <LabShell
      module={MODULE}
      badge="Simulasi · data fiktif"
      subtitle="Belajar dari dasar: kenali servernya, bagian-bagiannya, tombol saat boot, iDRAC, RAID, lalu hal yang wajib diperhatikan."
      finishMessage="Mantap! Modul Dell selesai."
      renderSections={(current) => [
        <IntroSection key="intro" />,
        <PartsSection key="parts" />,
        <BootSection key="boot" active={current === DELL_SECTION.boot} />,
        <IdracSection key="idrac" active={current === DELL_SECTION.idrac} />,
        <CommandsSection key="commands" />,
        <RaidSection key="raid" />,
        <QuizSection key="quiz" />,
      ]}
    />
  );
}
