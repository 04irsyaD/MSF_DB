import { Suspense } from "react";
import PaloAltoLab from "@/features/infra-lab/modules/palo-alto/PaloAltoLab";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs font-mono text-muted-foreground animate-pulse">
          Loading Palo Alto...
        </div>
      }
    >
      <PaloAltoLab />
    </Suspense>
  );
}
