import { NextRequest, NextResponse } from "next/server";
import mysqlShortcuts from "@/lib/data/shortcuts/mysql.json";
import pgShortcuts from "@/lib/data/shortcuts/postgresql.json";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const engine = searchParams.get("engine");
    const category = searchParams.get("category");
    const risk_level = searchParams.get("risk_level");
    const q = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    // Combine all shortcuts
    let shortcuts = [...mysqlShortcuts, ...pgShortcuts];

    // Filter by engine
    if (engine) {
      shortcuts = shortcuts.filter(s => s.engine.toLowerCase() === engine.toLowerCase());
    }

    // Filter by category
    if (category) {
      shortcuts = shortcuts.filter(s => s.category.toLowerCase() === category.toLowerCase());
    }

    // Filter by risk level
    if (risk_level) {
      shortcuts = shortcuts.filter(s => s.risk_level.toLowerCase() === risk_level.toLowerCase());
    }

    // Filter by search query q
    if (q) {
      const qLower = q.toLowerCase();
      shortcuts = shortcuts.filter(
        s =>
          s.title.toLowerCase().includes(qLower) ||
          s.description.toLowerCase().includes(qLower) ||
          s.tags.some(tag => tag.toLowerCase().includes(qLower))
      );
    }

    const total = shortcuts.length;
    const paginated = shortcuts.slice(offset, offset + limit);

    return NextResponse.json({
      total,
      items: paginated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { detail: `Gagal memuat shortcuts: ${error.message || error}` },
      { status: 500 }
    );
  }
}
