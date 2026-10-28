import { Suspense } from "react";
import SqlHelperPage from "@/features/sql-helper/components/SqlHelperPage";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs font-mono text-muted-foreground animate-pulse">
          Loading SQL Helper...
        </div>
      }
    >
      <SqlHelperPage />
    </Suspense>
  );
}
