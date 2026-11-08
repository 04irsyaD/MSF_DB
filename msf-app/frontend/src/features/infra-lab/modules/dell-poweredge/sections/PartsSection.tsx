"use client";

import PartsExplorer from "../../../components/PartsExplorer";
import SectionIntro from "../../../components/SectionIntro";
import { DEFAULT_PART, PARTS, type ServerView } from "../data/parts";
import { FAILED_BAY } from "../data/idrac";
import ServerSvg from "./ServerSvg";

export default function PartsSection() {
  return (
    <>
      <SectionIntro title="Bagian-bagian server">
        Klik bagian di gambar (atau pilih dari daftar) untuk melihat fungsinya,
        cara pakai, dan yang perlu diperhatikan. Gambar ini ilustrasi umum 2U,
        bukan model tertentu.
      </SectionIntro>
      <PartsExplorer
        parts={PARTS}
        views={[
          {
            id: "front",
            label: "Tampak depan",
            defaultPart: DEFAULT_PART.front,
          },
          {
            id: "rear",
            label: "Tampak belakang",
            defaultPart: DEFAULT_PART.rear,
          },
        ]}
        viewGroupLabel="Sisi server"
        listLabel="Daftar bagian server"
        renderSvg={(view, selected, pick) => (
          <ServerSvg
            view={view as ServerView}
            selected={selected}
            onPick={pick}
            amberBay={FAILED_BAY}
          />
        )}
      />
    </>
  );
}
