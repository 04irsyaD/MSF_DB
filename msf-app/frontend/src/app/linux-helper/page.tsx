import { Suspense } from "react";
import LinuxHelperPage from "@/features/linux-helper/components/LinuxHelperPage";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs font-mono text-muted-foreground animate-pulse">
          Loading Linux Helper...
        </div>
      }
    >
      <LinuxHelperPage />
    </Suspense>
  );
}
