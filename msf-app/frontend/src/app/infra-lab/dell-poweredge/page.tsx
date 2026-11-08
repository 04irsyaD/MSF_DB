import { Suspense } from "react";
import DellPowerEdgeLab from "@/features/infra-lab/modules/dell-poweredge/DellPowerEdgeLab";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs font-mono text-muted-foreground animate-pulse">
          Loading Dell PowerEdge...
        </div>
      }
    >
      <DellPowerEdgeLab />
    </Suspense>
  );
}
