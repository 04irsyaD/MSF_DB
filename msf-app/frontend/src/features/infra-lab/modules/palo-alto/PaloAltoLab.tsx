"use client";

import LabShell from "../../components/LabShell";
import { getModule } from "../../modules";
import {
  CommandsSection,
  IntroSection,
  PartsSection,
  QuizSection,
} from "./sections/BasicSections";
import PolicySimSection from "./sections/PolicySimSection";
import TrafficLogSection from "./sections/TrafficLogSection";

const MODULE = getModule("palo-alto");

/** Modul Palo Alto Firewall. Urutan node harus sama dengan PALO_SECTIONS. */
export default function PaloAltoLab() {
  return (
    <LabShell
      module={MODULE}
      badge="Simulasi · data fiktif"
      subtitle="Kenali firewall Palo Alto dari dasar: zone dan security policy, bagian perangkat, perintah CLI, urutan rule dan commit, serta membaca traffic log."
      finishMessage="Mantap! Modul Palo Alto selesai."
      renderSections={() => [
        <IntroSection key="intro" />,
        <PartsSection key="parts" />,
        <CommandsSection key="commands" />,
        <PolicySimSection key="sim" />,
        <TrafficLogSection key="logs" />,
        <QuizSection key="quiz" />,
      ]}
    />
  );
}
