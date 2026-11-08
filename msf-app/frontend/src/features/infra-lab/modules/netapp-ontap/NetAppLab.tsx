"use client";

import LabShell from "../../components/LabShell";
import { getModule } from "../../modules";
import {
  CommandsSection,
  IntroSection,
  PartsSection,
  QuizSection,
} from "./sections/BasicSections";
import CapacitySection from "./sections/CapacitySection";
import VolumeSimSection from "./sections/VolumeSimSection";

const MODULE = getModule("netapp-ontap");

/** Modul NetApp ONTAP. Urutan node harus sama dengan NETAPP_SECTIONS. */
export default function NetAppLab() {
  return (
    <LabShell
      module={MODULE}
      badge="Simulasi · data fiktif"
      subtitle="Kenali storage NetApp ONTAP dari dasar: hierarki cluster sampai snapshot, bagian controller dan disk shelf, perintah CLI, dan penanganan volume penuh."
      finishMessage="Mantap! Modul NetApp selesai."
      renderSections={() => [
        <IntroSection key="intro" />,
        <PartsSection key="parts" />,
        <CommandsSection key="commands" />,
        <VolumeSimSection key="sim" />,
        <CapacitySection key="capacity" />,
        <QuizSection key="quiz" />,
      ]}
    />
  );
}
