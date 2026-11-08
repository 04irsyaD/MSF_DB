export interface VlanDef {
  id: string;
  name: string;
  note: string;
}

export const VLANS: VlanDef[] = [
  { id: "10", name: "KEUANGAN", note: "Perangkat tim keuangan" },
  { id: "20", name: "HR", note: "Perangkat tim HR" },
  {
    id: "30",
    name: "TAMU",
    note: "Wi-Fi dan laptop tamu, sengaja dipisah dari jaringan kantor",
  },
];

export interface LabHost {
  port: string;
  full: string;
  device: string;
  vlan: string;
}

export const VLAN_HOSTS: LabHost[] = [
  {
    port: "Gi1/0/1",
    full: "GigabitEthernet1/0/1",
    device: "PC-FIN-01",
    vlan: "10",
  },
  {
    port: "Gi1/0/2",
    full: "GigabitEthernet1/0/2",
    device: "PC-FIN-02",
    vlan: "10",
  },
  {
    port: "Gi1/0/3",
    full: "GigabitEthernet1/0/3",
    device: "PRINTER-FIN",
    vlan: "10",
  },
  {
    port: "Gi1/0/4",
    full: "GigabitEthernet1/0/4",
    device: "PC-HR-01",
    vlan: "20",
  },
  {
    port: "Gi1/0/5",
    full: "GigabitEthernet1/0/5",
    device: "PC-HR-02",
    vlan: "20",
  },
  {
    port: "Gi1/0/6",
    full: "GigabitEthernet1/0/6",
    device: "LAPTOP-TAMU",
    vlan: "30",
  },
];

export const GUEST_VLAN = "30";
