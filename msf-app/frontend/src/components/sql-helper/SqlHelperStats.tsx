"use client";

interface SqlHelperStatsProps {
  total: number;
  engine: string;
  lastUpdated?: string;
}

export default function SqlHelperStats({
  total,
  engine,
  lastUpdated = "Ready (Offline Client)",
}: SqlHelperStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
      {/* Total Scripts */}
      <div className="bg-white border border-border rounded-xl p-4 shadow-xs">
        <p className="text-[10px] text-muted-foreground font-mono font-bold uppercase tracking-wider mb-1">
          Total Scripts
        </p>
        <p className="text-2xl font-extrabold text-[#00bfa5] font-mono leading-none">
          {total}
        </p>
      </div>

      {/* Active Database Engine */}
      <div className="bg-white border border-border rounded-xl p-4 shadow-xs">
        <p className="text-[10px] text-muted-foreground font-mono font-bold uppercase tracking-wider mb-1">
          Database Engine
        </p>
        <p className="text-xl font-bold text-gray-800 font-mono leading-tight capitalize truncate">
          {engine === "ALL ENGINES" ? "Semua Engine" : engine}
        </p>
      </div>

      {/* Last Updated / Status */}
      <div className="bg-white border border-border rounded-xl p-4 shadow-xs">
        <p className="text-[10px] text-muted-foreground font-mono font-bold uppercase tracking-wider mb-1">
          Mode Status
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-sm font-bold text-gray-800 font-mono truncate">
            {lastUpdated}
          </p>
        </div>
      </div>
    </div>
  );
}
