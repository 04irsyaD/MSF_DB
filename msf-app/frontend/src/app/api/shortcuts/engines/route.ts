import { NextResponse } from "next/server";
import mysqlShortcuts from "@/lib/data/shortcuts/mysql.json";
import pgShortcuts from "@/lib/data/shortcuts/postgresql.json";

export async function GET() {
  try {
    const shortcuts = [...mysqlShortcuts, ...pgShortcuts];
    const engines = Array.from(new Set(shortcuts.map(s => s.engine).filter(Boolean))).sort();
    return NextResponse.json({ engines });
  } catch (error: any) {
    return NextResponse.json(
      { detail: `Gagal memuat list engines: ${error.message || error}` },
      { status: 500 }
    );
  }
}
