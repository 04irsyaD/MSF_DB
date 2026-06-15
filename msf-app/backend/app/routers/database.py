"""Router: Database connection — /api/db/*"""

from fastapi import APIRouter, HTTPException
from app.models.schemas import (
    DBTestConnectionRequest, DBTestConnectionResponse,
    DBConnection, DBMetadataResponse,
)
from app.services.db_connector import DBConnector

router = APIRouter(prefix="/api/db", tags=["Database"])


@router.post("/test-connection", response_model=DBTestConnectionResponse)
async def test_connection(request: DBTestConnectionRequest):
    """Test koneksi ke database"""
    return await DBConnector.test_connection(request.connection)


@router.post("/metadata", response_model=DBMetadataResponse)
async def get_metadata(
    connection: DBConnection,
    schema_filter: str = None,
    include_views: bool = False,
    include_functions: bool = False,
):
    """Ambil metadata dari database (tabel, kolom, FK, index)"""
    # Test koneksi dulu
    test = await DBConnector.test_connection(connection)
    if not test.success:
        raise HTTPException(status_code=400, detail=test.message)

    return await DBConnector.get_metadata(
        conn=connection,
        schema_filter=schema_filter,
        include_views=include_views,
        include_functions=include_functions,
    )
