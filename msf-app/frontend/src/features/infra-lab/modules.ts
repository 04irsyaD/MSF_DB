import { HardDrive, Network, Server, ShieldCheck } from "lucide-react";
import type { InfraModule } from "./lib/types";
import { CISCO_SECTIONS } from "./modules/cisco-switch/sections";
import { DELL_SECTIONS } from "./modules/dell-poweredge/sections";
import { NETAPP_SECTIONS } from "./modules/netapp-ontap/sections";
import { PALO_SECTIONS } from "./modules/palo-alto/sections";

/**
 * Daftar modul Infra Lab. Menambah modul baru:
 * 1. buat folder `modules/<folder>/` (sections.ts + komponen modul),
 * 2. tambah entri di sini dengan status "active" dan href,
 * 3. buat `src/app/infra-lab/<id>/page.tsx` yang merender komponen modul.
 */
export const INFRA_MODULES: InfraModule[] = [
  {
    id: "dell-poweredge",
    title: "Dell PowerEdge Server",
    description:
      "Kenali server rack, bagian depan dan belakang, tombol saat boot, iDRAC, perintah racadm, dan RAID lewat simulasi.",
    icon: Server,
    status: "active",
    href: "/infra-lab/dell-poweredge",
    tags: ["Simulasi iDRAC", "Perintah racadm", "Kalkulator RAID", "Kuis"],
    sections: DELL_SECTIONS,
  },
  {
    id: "netapp-ontap",
    title: "NetApp ONTAP",
    description:
      "Kenali storage ONTAP: cluster, aggregate, volume, dan snapshot, lalu tangani volume yang hampir penuh.",
    icon: HardDrive,
    status: "active",
    href: "/infra-lab/netapp-ontap",
    tags: [
      "Simulasi volume penuh",
      "Perintah ONTAP",
      "Kalkulator snapshot",
      "Kuis",
    ],
    sections: NETAPP_SECTIONS,
  },
  {
    id: "cisco",
    title: "Cisco Switch",
    description:
      "Kenali switch Cisco: mode CLI IOS, perintah show, troubleshooting port err-disabled, dan VLAN.",
    icon: Network,
    status: "active",
    href: "/infra-lab/cisco",
    tags: ["Simulasi CLI IOS", "Perintah show", "VLAN", "Kuis"],
    sections: CISCO_SECTIONS,
  },
  {
    id: "palo-alto",
    title: "Palo Alto Firewall",
    description:
      "Kenali firewall Palo Alto: zone, security policy, urutan rule dan commit, serta membaca traffic log.",
    icon: ShieldCheck,
    status: "active",
    href: "/infra-lab/palo-alto",
    tags: ["Simulasi policy", "Perintah PAN-OS", "Traffic log", "Kuis"],
    sections: PALO_SECTIONS,
  },
];

export function getModule(id: string): InfraModule {
  const mod = INFRA_MODULES.find((m) => m.id === id);
  if (!mod) throw new Error(`Modul Infra Lab tidak terdaftar: ${id}`);
  return mod;
}
