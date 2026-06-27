import { NextRequest, NextResponse } from "next/server";
import { DocxExporter } from "@/lib/server/docxExporter";

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

    const buffer = await DocxExporter.export(markdown, title || "Database Documentation");

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="documentation.docx"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { detail: `Gagal mengekspor ke Word: ${error.message || error}` },
      { status: 500 }
    );
  }
}
