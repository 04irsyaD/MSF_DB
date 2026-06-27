import { NextRequest, NextResponse } from "next/server";
import { DBConnector } from "@/lib/server/dbConnector";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { connection, schema_filter, include_views, include_functions } = body;

    if (!connection) {
      return NextResponse.json(
        { detail: "Parameter connection harus diisi." },
        { status: 400 }
      );
    }

    const metadata = await DBConnector.fetchMetadata(connection, {
      schemaFilter: schema_filter,
      includeViews: include_views,
      includeFunctions: include_functions,
    });

    return NextResponse.json(metadata);
  } catch (error: any) {
    return NextResponse.json(
      { detail: `Gagal memproses metadata database: ${error.message || error}` },
      { status: 500 }
    );
  }
}
