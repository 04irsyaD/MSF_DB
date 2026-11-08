import { Suspense } from "react";
import CiscoSwitchLab from "@/features/infra-lab/modules/cisco-switch/CiscoSwitchLab";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs font-mono text-muted-foreground animate-pulse">
          Loading Cisco Switch...
        </div>
      }
    >
      <CiscoSwitchLab />
    </Suspense>
  );
}
