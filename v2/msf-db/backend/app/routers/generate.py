"""Router: Generate dokumentasi — /api/generate/* dan /api/jobs/*"""

import asyncio
import os
from fastapi import APIRouter, HTTPException, BackgroundTasks, Request
from fastapi.responses import Response

from app.models.schemas import (
    GenerateFromDDLRequest, GenerateFromDBRequest,
    GenerateJobResponse, JobStatusResponse, JobStatus,
    ParseDDLRequest, TableMetadata,
)
from app.background.job_queue import job_queue
from app.services.sql_parser import SQLParser
from app.services.db_connector import DBConnector
from app.services.doc_generator import DocGenerator, get_provider
from app.services.exporters.docx_exporter import DocxExporter
from app.utils.errors import AppDetailedException
from app.utils.rate_limit import generate_limit, limiter
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

        if job.status == JobStatus.CANCELLED:
            raise RuntimeError("Job dibatalkan oleh pengguna.")

        requested_format = settings.get("output_format", "docx").lower()
        logger.info("Requested Format", format=requested_format)
        
        job.update(progress=92, current_table=None)
        
        safe_name = "".join(c if c.isalnum() or c in " -_" else "_" for c in settings["project_name"]).strip()
        filename = f"{safe_name}.{requested_format}"
        
        if requested_format == "pdf":
            logger.info("Export Engine", engine="pdf_exporter")
            
            from app.services.exporters.pdf_exporter import PdfExporter
            exporter = PdfExporter()
            result_bytes = exporter.export(
                markdown_content=markdown, 
                project_name=settings["project_name"], 
                author=settings.get("author")
            )
            
        else:
            logger.info("Export Engine", engine="docx_exporter")
            exporter = DocxExporter()
            result_bytes = exporter.export(
                markdown_content=markdown,
                project_name=settings["project_name"],
                author=settings.get("author"),
            )

        job.update(
            result_bytes=result_bytes,
            result_filename=filename,
            output_format=requested_format,
            preview_markdown=markdown[:2000],
            progress=100,
        )

        logger.info("Job selesai", job_id=job.job_id, tables=len(tables))

    except Exception as e:
        logger.error("Job gagal", job_id=job.job_id, error=str(e))
        job.update(error_message=str(e))
        raise


@router.post("/generate/parse-ddl", response_model=list[TableMetadata])
async def parse_ddl_endpoint(request: ParseDDLRequest):
    """
    Parse SQL DDL string dan kembalikan struktur TableMetadata.
    """
    try:
        tables = SQLParser.parse(request.sql_content, dialect=request.dialect)
        return tables
    except Exception as e:
        logger.error("Gagal parse DDL", error=str(e))
        raise HTTPException(status_code=400, detail=f"Gagal parse SQL DDL: {str(e)}")


@router.post("/generate/from-ddl", response_model=GenerateJobResponse)
@limiter.limit(generate_limit)
async def generate_from_ddl(
    request: Request,
    payload: GenerateFromDDLRequest,
    background_tasks: BackgroundTasks,
):
    """
    Generate dokumentasi dari SQL DDL yang di-paste.
    Return job_id — gunakan GET /api/jobs/{job_id} untuk cek status.

    Parameter request wajib bernama persis itu dan bertipe Request karena
    dekorator slowapi mencarinya berdasarkan nama; body pindah ke payload.
    """
    logger.info("Menerima request generate_from_ddl", payload=payload.model_dump() if hasattr(payload, 'model_dump') else payload.dict())
    # Gerbang antrean: cek jumlah job aktif di memori
    max_concurrent = int(os.getenv("MAX_CONCURRENT_JOBS", "3"))
    active_jobs = [j for j in job_queue.list_jobs() if j["status"] in ("queued", "processing")]
    if len(active_jobs) >= max_concurrent:
        raise AppDetailedException(
            detail=(
                f"Terlalu banyak job aktif ({len(active_jobs)}/{max_concurrent}). "
                "Tunggu job sebelumnya selesai."
            ),
            status_code=429,
            error_code="JOB_QUEUE_FULL",
        )
    # Validasi SQL
    validation = SQLParser.validate_sql(payload.sql_content)
    if not validation["valid"]:
        raise HTTPException(status_code=400, detail=validation["message"])

    # Parse tables
    tables = SQLParser.parse(payload.sql_content)

    max_tables = int(os.getenv("MAX_TABLES_PER_REQUEST", "50"))
    if len(tables) > max_tables:
        raise HTTPException(
            status_code=400,
            detail=f"Terlalu banyak tabel terdeteksi ({len(tables)} tabel). Maksimum yang diizinkan adalah {max_tables} tabel per request."
        )

    # Buat job
    job = job_queue.create_job(project_name=payload.project_name)
    job.update(ai_provider=payload.ai_provider, db_engine="ddl")

    settings = {
        "ai_provider": payload.ai_provider,
        "model": payload.model,
        "language": payload.language,
        "detail_level": payload.detail_level,
        "business_context": payload.business_context,
        "project_name": payload.project_name,
        "author": payload.author,
        "output_format": payload.output_format,
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
        access_code=job.access_code,
    )
    logger.info("Mengirim response generate_from_ddl", response=response.model_dump() if hasattr(response, 'model_dump') else response.dict())
    return response


@router.post("/generate/from-db", response_model=GenerateJobResponse)
@limiter.limit(generate_limit)
async def generate_from_db(
    request: Request,
    payload: GenerateFromDBRequest,
    background_tasks: BackgroundTasks,
):
    """
    Generate dokumentasi dari koneksi database langsung.

    Parameter request wajib bernama persis itu dan bertipe Request karena
    dekorator slowapi mencarinya berdasarkan nama; body pindah ke payload.
    """
    payload_dict = payload.model_dump() if hasattr(payload, 'model_dump') else payload.dict()
    if "connection" in payload_dict and isinstance(payload_dict["connection"], dict):
        if "password" in payload_dict["connection"] and payload_dict["connection"]["password"]:
            payload_dict["connection"] = payload_dict["connection"].copy()
            payload_dict["connection"]["password"] = "***"
    logger.info("Menerima request generate_from_db", payload=payload_dict)
    # Gerbang antrean: cek jumlah job aktif di memori
    max_concurrent = int(os.getenv("MAX_CONCURRENT_JOBS", "3"))
    active_jobs = [j for j in job_queue.list_jobs() if j["status"] in ("queued", "processing")]
    if len(active_jobs) >= max_concurrent:
        raise AppDetailedException(
            detail=(
                f"Terlalu banyak job aktif ({len(active_jobs)}/{max_concurrent}). "
                "Tunggu job sebelumnya selesai."
            ),
            status_code=429,
            error_code="JOB_QUEUE_FULL",
        )
    # Test koneksi dulu
    test_result = await DBConnector.test_connection(payload.connection)
    if not test_result.success:
        raise HTTPException(
            status_code=400,
            detail=f"Gagal konek ke database: {test_result.message}"
        )

    # Buat job
    job = job_queue.create_job(project_name=payload.project_name)
    job.update(ai_provider=payload.ai_provider, db_engine=payload.connection.engine)

    settings = {
        "ai_provider": payload.ai_provider,
        "model": payload.model,
        "language": payload.language,
        "detail_level": payload.detail_level,
        "business_context": payload.business_context,
        "project_name": payload.project_name,
        "author": payload.author,
        "output_format": payload.output_format,
    }

    async def _run_from_db(job, conn_request, gen_settings):
        # Ambil metadata dari DB
        if job.status == JobStatus.CANCELLED:
            raise RuntimeError("Job dibatalkan oleh pengguna.")
        metadata = await DBConnector.get_metadata(
            conn=conn_request.connection,
            schema_filter=conn_request.schema_filter,
            table_filter=conn_request.table_filter,
            include_views=conn_request.include_views,
            include_functions=conn_request.include_functions,
        )
        if job.status == JobStatus.CANCELLED:
            raise RuntimeError("Job dibatalkan oleh pengguna.")

        max_tables = int(os.getenv("MAX_TABLES_PER_REQUEST", "50"))
        if len(metadata.tables) > max_tables:
            raise ValueError(
                f"Terlalu banyak tabel terdeteksi ({len(metadata.tables)} tabel). "
                f"Maksimum yang diizinkan adalah {max_tables} tabel per request."
            )

        await _run_generate_job(job, metadata.tables, gen_settings)

    background_tasks.add_task(
        job_queue.run_job,
        job,
        _run_from_db,
        payload,
        settings,
    )

    response = GenerateJobResponse(
        job_id=job.job_id,
        status=JobStatus.QUEUED,
        created_at=job.created_at,
        estimated_seconds=60,
        access_code=job.access_code,
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


@router.get("/jobs/by-code/{access_code}", response_model=JobStatusResponse)
async def get_job_by_code(access_code: str):
    """Cek status job berdasarkan kode akses pelacakan"""
    job = job_queue.get_job_by_access_code(access_code)
    if not job:
        raise HTTPException(
            status_code=404, 
            detail=f"Pekerjaan dengan kode akses '{access_code}' tidak ditemukan atau sudah kedaluwarsa."
        )
    return JobStatusResponse(**job.to_dict())


@router.post("/jobs/{job_id}/cancel")
async def cancel_job(job_id: str):
    """Batalkan job generate"""
    success = await job_queue.cancel_job(job_id)
    if not success:
        raise HTTPException(
            status_code=400,
            detail=f"Gagal membatalkan job '{job_id}'. Job mungkin sudah selesai, gagal, atau tidak ditemukan."
        )
    return {"success": True, "message": "Job berhasil dibatalkan"}


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

    # Berkas sengaja dihapus penyapu retensi. Ini bukan kerusakan, sehingga
    # 500 menyesatkan; 410 menyatakan sumber daya pernah ada lalu hilang.
    if job.file_purged:
        raise AppDetailedException(
            detail=(
                "Berkas hasil sudah kedaluwarsa dan dihapus dari server. "
                "Silakan jalankan ulang proses generate."
            ),
            status_code=410,
            error_code="RESULT_EXPIRED",
        )

    if not job.result_filepath or not os.path.exists(job.result_filepath):
        raise HTTPException(status_code=500, detail="File hasil tidak tersedia")

    if job.output_format == "pdf":
        media_type = "application/pdf"
    else:
        media_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    filename = job.result_filename or ("dokumentasi.pdf" if job.output_format == "pdf" else "dokumentasi.docx")

    try:
        with open(job.result_filepath, "rb") as f:
            content = f.read()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal membaca file hasil: {str(e)}")

    return Response(
        content=content,
        media_type=media_type,
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Content-Length": str(len(content)),
        },
    )
