import { Suspense } from "react";
import NetAppLab from "@/features/infra-lab/modules/netapp-ontap/NetAppLab";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs font-mono text-muted-foreground animate-pulse">
          Loading NetApp ONTAP...
        </div>
      }
    >
      <NetAppLab />
    </Suspense>
  );
}
