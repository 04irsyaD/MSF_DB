"""
Test Pydantic schema validation — memastikan business rules di-enforce.
"""
import pytest
from pydantic import ValidationError
from app.models.schemas import (
    GenerateFromDDLRequest,
    DBConnection,
    DBEngine,
    OutputLanguage,
    DetailLevel,
    ExportFormat,
)


class TestGenerateFromDDLRequest:

    def test_valid_request(self):
        req = GenerateFromDDLRequest(
            sql_content="CREATE TABLE users (id INT);",
            language=OutputLanguage.INDONESIAN,
            detail_level=DetailLevel.DETAILED,
            ai_provider="ollama",
            model="llama3.2:latest",
            output_format=ExportFormat.DOCX,
        )
        assert req.sql_content == "CREATE TABLE users (id INT);"

    def test_sql_content_too_short(self):
        with pytest.raises(ValidationError) as exc_info:
            GenerateFromDDLRequest(
                sql_content="abc",  # kurang dari min_length=10
                language=OutputLanguage.INDONESIAN,
                detail_level=DetailLevel.DETAILED,
                ai_provider="ollama",
                model="llama3.2",
                output_format=ExportFormat.DOCX,
            )
        assert "min_length" in str(exc_info.value).lower() or "at least" in str(exc_info.value).lower()

    def test_sql_content_too_long(self):
        """Test bahwa sql_content > 500KB ditolak."""
        with pytest.raises(ValidationError):
            GenerateFromDDLRequest(
                sql_content="x" * 500_001,
                language=OutputLanguage.INDONESIAN,
                detail_level=DetailLevel.DETAILED,
                ai_provider="ollama",
                model="llama3.2",
                output_format=ExportFormat.DOCX,
            )


class TestDBConnection:

    def test_valid_postgresql_connection(self):
        conn = DBConnection(
            engine=DBEngine.POSTGRESQL,
            host="localhost",
            port=5432,
            database="mydb",
            username="admin",
            password="secret",
        )
        assert conn.engine == DBEngine.POSTGRESQL

    def test_invalid_port_too_high(self):
        with pytest.raises(ValidationError):
            DBConnection(
                engine=DBEngine.POSTGRESQL,
                host="localhost",
                port=99999,  # invalid
                database="mydb",
            )

    def test_port_none_is_valid(self):
        """Port None harus valid — db_connector set default."""
        conn = DBConnection(
            engine=DBEngine.POSTGRESQL,
            host="localhost",
            port=None,
            database="mydb",
        )
        assert conn.port is None

    def test_xor_validation_invalid(self):
        """Test jika SQLite tidak diisi ataupun DB manual / connection_string tidak diisi."""
        with pytest.raises(ValidationError):
            DBConnection(
                engine=DBEngine.POSTGRESQL,
                host=None,
                database=None,
                connection_string=None,
            )
