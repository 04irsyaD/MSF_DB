"""Router: Database connection — /api/db/*"""

from fastapi import APIRouter, HTTPException
from app.models.schemas import (
    DBTestConnectionRequest, DBTestConnectionResponse,
    DBConnection, DBMetadataResponse, DBMetadataRequest,
)
from app.services.db_connector import DBConnector

router = APIRouter(prefix="/api/db", tags=["Database"])


@router.post("/test-connection", response_model=DBTestConnectionResponse)
async def test_connection(request: DBTestConnectionRequest):
    """Test koneksi ke database"""
    return await DBConnector.test_connection(request.connection)


@router.post("/metadata", response_model=DBMetadataResponse)
async def get_metadata(request: DBMetadataRequest):
    """Ambil metadata dari database (tabel, kolom, FK, index)"""
    # Test koneksi dulu
    test = await DBConnector.test_connection(request.connection)
    if not test.success:
        raise HTTPException(status_code=400, detail=test.message)

    return await DBConnector.get_metadata(
        conn=request.connection,
        schema_filter=request.schema_filter,
        include_views=request.include_views,
        include_functions=request.include_functions,
    )
