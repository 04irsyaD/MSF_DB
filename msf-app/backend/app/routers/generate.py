"""Router: Generate dokumentasi — /api/generate/* dan /api/jobs/*"""

import asyncio
from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import Response

from app.models.schemas import (
    GenerateFromDDLRequest, GenerateFromDBRequest,
    GenerateJobResponse, JobStatusResponse, JobStatus,
)
from app.background.job_queue import job_queue
from app.services.sql_parser import SQLParser
from app.services.db_connector import DBConnector
from app.services.doc_generator import DocGenerator, get_provider
from app.services.exporters.docx_exporter import DocxExporter
import structlog

logger = structlog.get_logger()

router = APIRouter(prefix="/api", tags=["Generate"])


async def _run_generate_job(job, tables, settings: dict):
    """Task yang berjalan di background untuk generate dokumentasi"""
    try:
        provider = get_provider(settings["ai_provider"])
        generator = DocGenerator(
            provider=provider,
            model=settings["model"],
            language=settings["language"],
            detail_level=settings["detail_level"],
            business_context=settings.get("business_context"),
        )

        # Generate Markdown
        markdown = await generator.generate_from_tables(
            tables=tables,
            project_name=settings["project_name"],
            job=job,
        )

        # Export ke DOCX
        job.update(progress=92, current_table=None)
        exporter = DocxExporter()
        docx_bytes = exporter.export(
            markdown_content=markdown,
            project_name=settings["project_name"],
            author=settings.get("author"),
        )

        # Simpan hasil di job
        safe_name = "".join(
            c if c.isalnum() or c in " -_" else "_"
            for c in settings["project_name"]
        ).strip()
        filename = f"{safe_name}.docx"

        job.update(
            result_bytes=docx_bytes,
            result_filename=filename,
            output_format="docx",
            preview_markdown=markdown[:800],
            progress=100,
        )

        logger.info("Job selesai", job_id=job.job_id, tables=len(tables))

    except Exception as e:
        logger.error("Job gagal", job_id=job.job_id, error=str(e))
        job.update(error_message=str(e))
        raise


@router.post("/generate/from-ddl", response_model=GenerateJobResponse)
async def generate_from_ddl(
    request: GenerateFromDDLRequest,
    background_tasks: BackgroundTasks,
):
    """
    Generate dokumentasi dari SQL DDL yang di-paste.
    Return job_id — gunakan GET /api/jobs/{job_id} untuk cek status.
    """
    logger.info("Menerima request generate_from_ddl", payload=request.model_dump() if hasattr(request, 'model_dump') else request.dict())
    # Validasi SQL
    validation = SQLParser.validate_sql(request.sql_content)
    if not validation["valid"]:
        raise HTTPException(status_code=400, detail=validation["message"])

    # Parse tables
    tables = SQLParser.parse(request.sql_content)

    # Buat job
    job = job_queue.create_job(project_name=request.project_name)

    settings = {
        "ai_provider": request.ai_provider,
        "model": request.model,
        "language": request.language,
        "detail_level": request.detail_level,
        "business_context": request.business_context,
        "project_name": request.project_name,
        "author": request.author,
        "output_format": request.output_format,
    }

    # Jalankan di background
    background_tasks.add_task(
        job_queue.run_job,
        job,
        _run_generate_job,
        tables,
        settings,
    )

    estimated = len(tables) * 15  # ~15 detik per tabel
    response = GenerateJobResponse(
        job_id=job.job_id,
        status=JobStatus.QUEUED,
        created_at=job.created_at,
        estimated_seconds=estimated,
    )
    logger.info("Mengirim response generate_from_ddl", response=response.model_dump() if hasattr(response, 'model_dump') else response.dict())
    return response


@router.post("/generate/from-db", response_model=GenerateJobResponse)
async def generate_from_db(
    request: GenerateFromDBRequest,
    background_tasks: BackgroundTasks,
):
    """
    Generate dokumentasi dari koneksi database langsung.
    """
    logger.info("Menerima request generate_from_db", payload=request.model_dump() if hasattr(request, 'model_dump') else request.dict())
    # Test koneksi dulu
    test_result = await DBConnector.test_connection(request.connection)
    if not test_result.success:
        raise HTTPException(
            status_code=400,
            detail=f"Gagal konek ke database: {test_result.message}"
        )

    # Buat job
    job = job_queue.create_job(project_name=request.project_name)

    settings = {
        "ai_provider": request.ai_provider,
        "model": request.model,
        "language": request.language,
        "detail_level": request.detail_level,
        "business_context": request.business_context,
        "project_name": request.project_name,
        "author": request.author,
        "output_format": request.output_format,
    }

    async def _run_from_db(job, conn_request, gen_settings):
        # Ambil metadata dari DB
        metadata = await DBConnector.get_metadata(
            conn=conn_request.connection,
            schema_filter=conn_request.schema_filter,
            table_filter=conn_request.table_filter,
            include_views=conn_request.include_views,
            include_functions=conn_request.include_functions,
        )
        await _run_generate_job(job, metadata.tables, gen_settings)

    background_tasks.add_task(
        job_queue.run_job,
        job,
        _run_from_db,
        request,
        settings,
    )

    response = GenerateJobResponse(
        job_id=job.job_id,
        status=JobStatus.QUEUED,
        created_at=job.created_at,
        estimated_seconds=60,  # estimasi kasar untuk live DB
    )
    logger.info("Mengirim response generate_from_db", response=response.model_dump() if hasattr(response, 'model_dump') else response.dict())
    return response


@router.get("/jobs/{job_id}", response_model=JobStatusResponse)
async def get_job_status(job_id: str):
    """Cek status job generate"""
    job = job_queue.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail=f"Job '{job_id}' tidak ditemukan")
    return JobStatusResponse(**job.to_dict())


@router.get("/jobs/{job_id}/download")
async def download_job_result(job_id: str):
    """Download hasil dokumentasi (DOCX/PDF)"""
    job = job_queue.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail=f"Job '{job_id}' tidak ditemukan")

    if job.status != JobStatus.DONE:
        raise HTTPException(
            status_code=400,
            detail=f"Job belum selesai. Status: {job.status}"
        )

    if not job.result_bytes:
        raise HTTPException(status_code=500, detail="File hasil tidak tersedia")

    media_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    filename = job.result_filename or "dokumentasi.docx"

    return Response(
        content=job.result_bytes,
        media_type=media_type,
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Content-Length": str(len(job.result_bytes)),
        },
    )
