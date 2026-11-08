"use client";

import LabShell from "../../components/LabShell";
import { getModule } from "../../modules";
import {
  CommandsSection,
  IntroSection,
  PartsSection,
  QuizSection,
} from "./sections/BasicSections";
import PortSimSection from "./sections/PortSimSection";
import VlanSection from "./sections/VlanSection";

const MODULE = getModule("cisco");

/** Modul Cisco Switch. Urutan node harus sama dengan CISCO_SECTIONS. */
export default function CiscoSwitchLab() {
  return (
    <LabShell
      module={MODULE}
      badge="Simulasi · data fiktif"
      subtitle="Kenali switch Cisco dari dasar: peran dan bagian switch, mode CLI IOS, perintah show, troubleshooting port, dan VLAN."
      finishMessage="Mantap! Modul Cisco selesai."
      renderSections={() => [
        <IntroSection key="intro" />,
        <PartsSection key="parts" />,
        <CommandsSection key="commands" />,
        <PortSimSection key="sim" />,
        <VlanSection key="vlan" />,
        <QuizSection key="quiz" />,
      ]}
    />
  );
}
