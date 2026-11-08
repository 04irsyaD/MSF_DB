import { Suspense } from "react";
import InfraLabPage from "@/features/infra-lab/components/InfraLabPage";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs font-mono text-muted-foreground animate-pulse">
          Loading Infra Lab...
        </div>
      }
    >
      <InfraLabPage />
    </Suspense>
  );
}
