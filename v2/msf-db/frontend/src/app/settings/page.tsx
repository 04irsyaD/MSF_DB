"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SettingsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="h-6 w-6 rounded-full border-2 border-accent/20 border-t-accent animate-spin" />
    </div>
  );
}
