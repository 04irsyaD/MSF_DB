import { NextResponse } from "next/server";
import mysqlShortcuts from "@/lib/data/shortcuts/mysql.json";
import pgShortcuts from "@/lib/data/shortcuts/postgresql.json";

export async function GET() {
  try {
    const shortcuts = [...mysqlShortcuts, ...pgShortcuts];
    const categories = Array.from(new Set(shortcuts.map(s => s.category).filter(Boolean))).sort();
    return NextResponse.json({ categories });
  } catch (error: any) {
    return NextResponse.json(
      { detail: `Gagal memuat list kategori: ${error.message || error}` },
      { status: 500 }
    );
  }
}
