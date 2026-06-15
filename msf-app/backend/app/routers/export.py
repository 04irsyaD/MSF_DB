"""Router: Export — /api/export/*"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from app.models.schemas import ExportRequest
from app.services.exporters.docx_exporter import DocxExporter

router = APIRouter(prefix="/api/export", tags=["Export"])


@router.post("/docx")
async def export_to_docx(request: ExportRequest):
    """Konversi Markdown ke Word (.docx) dan return file"""
    try:
        exporter = DocxExporter()
        docx_bytes = exporter.export(
            markdown_content=request.markdown_content,
            project_name=request.project_name,
            author=request.author,
        )

        safe_name = "".join(
            c if c.isalnum() or c in " -_" else "_"
            for c in request.project_name
        ).strip()
        filename = f"{safe_name}.docx"

        return Response(
            content=docx_bytes,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'},
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Export gagal: {str(e)}")


@router.post("/pdf")
async def export_to_pdf(request: ExportRequest):
    """Export ke PDF — tersedia di v2.2"""
    raise HTTPException(
        status_code=501,
        detail="Export PDF belum tersedia. Akan dirilis di v2.2. Gunakan export DOCX untuk sekarang."
    )
