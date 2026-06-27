import { NextRequest, NextResponse } from "next/server";
import { DBConnector } from "@/lib/server/dbConnector";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { connection } = body;

    if (!connection) {
      return NextResponse.json(
        { detail: "Parameter connection harus diisi." },
        { status: 400 }
      );
    }

    const result = await DBConnector.testConnection(connection);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: `Gagal memverifikasi koneksi database: ${error.message || error}` },
      { status: 500 }
    );
  }
}
