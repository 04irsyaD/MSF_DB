import { NextRequest, NextResponse } from "next/server";
import { PdfExporter } from "@/lib/server/pdfExporter";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { markdown, title } = body;

    if (!markdown) {
      return NextResponse.json(
        { detail: "Parameter markdown harus diisi." },
        { status: 400 }
      );
    }

    const buffer = await PdfExporter.export(markdown, title || "Database Documentation");

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="documentation.pdf"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { detail: `Gagal mengekspor ke PDF: ${error.message || error}` },
      { status: 500 }
    );
  }
}
