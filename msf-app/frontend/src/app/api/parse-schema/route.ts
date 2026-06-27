import { NextRequest, NextResponse } from "next/server";
import { SQLParser } from "@/lib/server/sqlParser";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sql_content } = body;

    if (!sql_content) {
      return NextResponse.json(
        { detail: "sql_content harus diisi." },
        { status: 400 }
      );
    }

    const validation = SQLParser.validateSql(sql_content);
    if (!validation.valid) {
      return NextResponse.json(
        { detail: validation.message },
        { status: 400 }
      );
    }

    const tables = SQLParser.parse(sql_content);

    return NextResponse.json({
      valid: true,
      tables: tables,
      table_count: tables.length,
      message: validation.message,
    });
  } catch (error: any) {
    return NextResponse.json(
      { detail: `Gagal memproses DDL SQL: ${error.message || error}` },
      { status: 500 }
    );
  }
}
