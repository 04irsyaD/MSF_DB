"""
Multi-Database Connector — mengambil metadata dari database yang sedang berjalan.
Support: PostgreSQL, MySQL, SQLite (MVP). SQL Server & MongoDB di v2.1.
"""

from typing import List, Optional
import re
from urllib.parse import quote_plus
from sqlalchemy import create_engine, text, inspect
from sqlalchemy.exc import OperationalError, SQLAlchemyError
import structlog

from app.models.schemas import (
    DBConnection, DBEngine,
    TableMetadata, ColumnMetadata, ForeignKeyMetadata, IndexMetadata,
    ViewMetadata, FunctionMetadata, DBMetadataResponse,
    DBTestConnectionResponse,
)

logger = structlog.get_logger()

# Default ports per engine
DEFAULT_PORTS = {
    DBEngine.POSTGRESQL: 5432,
    DBEngine.MYSQL: 3306,
    DBEngine.SQLITE: None,
    DBEngine.SQLSERVER: 1433,
    DBEngine.MONGODB: 27017,
}


class DBConnector:
    """
    Koneksi ke berbagai database engine dan ambil metadata.
    """

    @staticmethod
    def build_connection_url(conn: DBConnection) -> str:
        """Buat SQLAlchemy connection URL dari DBConnection model"""
        if conn.connection_string:
            return conn.connection_string

        engine = conn.engine
        port = conn.port or DEFAULT_PORTS.get(engine)
        username_enc = quote_plus(conn.username) if conn.username else ""
        password_enc = quote_plus(conn.password) if conn.password else ""

        if engine == DBEngine.POSTGRESQL or engine == "postgresql":
            return (
                f"postgresql+psycopg2://{username_enc}:{password_enc}"
                f"@{conn.host}:{port}/{conn.database}"
            )
        elif engine == DBEngine.MYSQL or engine == "mysql":
            return (
                f"mysql+pymysql://{username_enc}:{password_enc}"
                f"@{conn.host}:{port}/{conn.database}"
                f"?charset=utf8mb4"
            )
        elif engine == DBEngine.SQLITE or engine == "sqlite":
            # Untuk SQLite, database adalah path file
            return f"sqlite:///{conn.database}"
        elif engine == DBEngine.SQLSERVER or engine == "sqlserver":
            return (
                f"mssql+pyodbc://{username_enc}:{password_enc}"
                f"@{conn.host}:{port}/{conn.database}"
                f"?driver=ODBC+Driver+17+for+SQL+Server"
            )
        else:
            raise ValueError(f"Engine tidak didukung: {engine}")

    @classmethod
    async def test_connection(cls, conn: DBConnection) -> DBTestConnectionResponse:
        """Test apakah koneksi ke database berhasil (async non-blocking)"""
        import asyncio
        return await asyncio.to_thread(cls.test_connection_sync, conn)

    @classmethod
    def test_connection_sync(cls, conn: DBConnection) -> DBTestConnectionResponse:
        """Test apakah koneksi ke database berhasil (blocking sync)"""
        try:
            url = cls.build_connection_url(conn)
            connect_args = {}
            if conn.engine == DBEngine.POSTGRESQL or conn.engine == "postgresql":
                connect_args = {"connect_timeout": 10}
            elif conn.engine == DBEngine.MYSQL or conn.engine == "mysql":
                connect_args = {"connect_timeout": 10}
            elif conn.engine == DBEngine.SQLSERVER or conn.engine == "sqlserver":
                connect_args = {"timeout": 10}
            engine = create_engine(url, connect_args=connect_args)

            with engine.connect() as connection:
                # Cek versi server
                version_query = cls._get_version_query(conn.engine)
                result = connection.execute(text(version_query))
                version = result.scalar()

                # Dapatkan daftar schema & tabel per schema
                inspector = inspect(engine)
                try:
                    raw_schemas = inspector.get_schema_names()
                except Exception:
                    raw_schemas = []
                
                filtered_schemas = cls._filter_system_schemas(raw_schemas, conn.engine)
                
                tables_by_schema = {}
                for s in filtered_schemas:
                    try:
                        tables_by_schema[s] = inspector.get_table_names(schema=s)
                    except Exception:
                        try:
                            tables_by_schema[s] = inspector.get_table_names()
                        except Exception:
                            tables_by_schema[s] = []

                active_schema = conn.schema_name or ("main" if conn.engine == "sqlite" else "public")
                if active_schema not in tables_by_schema and filtered_schemas:
                    active_schema = filtered_schemas[0]
                
                table_count = len(tables_by_schema.get(active_schema, []))

            engine.dispose()

            return DBTestConnectionResponse(
                success=True,
                message="Koneksi berhasil",
                engine=conn.engine,
                server_version=str(version)[:100] if version else None,
                tables_count=table_count,
                schemas=filtered_schemas,
                tables_by_schema=tables_by_schema,
            )

        except OperationalError as e:
            logger.error("DB connection failed", error=str(e))
            return DBTestConnectionResponse(
                success=False,
                message=f"Gagal konek: {cls._clean_error(str(e))}",
                engine=conn.engine,
            )
        except Exception as e:
            logger.error("Unexpected DB error", error=str(e))
            return DBTestConnectionResponse(
                success=False,
                message=f"Error: {cls._clean_error(str(e))}",
                engine=conn.engine,
            )

    @classmethod
    def _filter_system_schemas(cls, schemas: List[str], engine: str) -> List[str]:
        """Menyaring schema bawaan sistem agar tidak muncul di pilihan"""
        system_schemas = {
            "postgresql": ["information_schema", "pg_catalog", "pg_toast", "pg_temp_1", "pg_toast_temp_1"],
            "mysql": ["information_schema", "performance_schema", "sys", "mysql"],
            "sqlite": ["main"],
        }
        filtered = []
        for s in schemas:
            s_lower = s.lower()
            if engine == "postgresql" and (s_lower.startswith("pg_") or s_lower in system_schemas["postgresql"]):
                continue
            if engine == "mysql" and s_lower in system_schemas["mysql"]:
                continue
            filtered.append(s)
        
        # Jika SQLite atau kosong, kembalikan schema default
        if not filtered:
            filtered = ["main"] if engine == "sqlite" else ["public"]
        return filtered

    @classmethod
    async def get_metadata(
        cls,
        conn: DBConnection,
        schema_filter: Optional[str] = None,
        table_filter: Optional[List[str]] = None,
        include_views: bool = False,
        include_functions: bool = False,
    ) -> DBMetadataResponse:
        """Ambil metadata lengkap dari database (async non-blocking)"""
        import asyncio
        return await asyncio.to_thread(
            cls.get_metadata_sync,
            conn,
            schema_filter,
            table_filter,
            include_views,
            include_functions,
        )

    @classmethod
    def get_metadata_sync(
        cls,
        conn: DBConnection,
        schema_filter: Optional[str] = None,
        table_filter: Optional[List[str]] = None,
        include_views: bool = False,
        include_functions: bool = False,
    ) -> DBMetadataResponse:
        """Ambil metadata lengkap dari database (blocking sync)"""
        url = cls.build_connection_url(conn)
        schema = schema_filter or conn.schema_name or "public"
        db_name = conn.database or "main"

        db_engine = create_engine(url)
        inspector = inspect(db_engine)

        try:
            tables = cls._get_tables(
                inspector, db_engine, conn.engine, schema, table_filter
            )
            views = cls._get_views(inspector, schema) if include_views else []
            functions = (
                cls._get_functions(db_engine, conn.engine, schema)
                if include_functions
                else []
            )

            return DBMetadataResponse(
                engine=conn.engine,
                database=db_name,
                schema=schema,
                tables=tables,
                views=views,
                functions=functions,
            )
        finally:
            db_engine.dispose()

    @classmethod
    def _get_tables(
        cls,
        inspector,
        db_engine,
        engine_type: str,
        schema: str,
        table_filter: Optional[List[str]] = None,
    ) -> List[TableMetadata]:
        """Ambil semua tabel beserta metadata kolom, PK, FK, index"""
        try:
            all_tables = inspector.get_table_names(schema=schema)
        except Exception:
            all_tables = inspector.get_table_names()

        if table_filter:
            all_tables = [t for t in all_tables if t in table_filter]

        tables = []
        for table_name in all_tables:
            try:
                table = cls._get_single_table(
                    inspector, db_engine, engine_type, table_name, schema
                )
                tables.append(table)
            except Exception as e:
                logger.warning(f"Gagal baca tabel {table_name}", error=str(e))

        return tables

    @classmethod
    def _get_single_table(
        cls, inspector, db_engine, engine_type: str, table_name: str, schema: str
    ) -> TableMetadata:
        """Ambil metadata satu tabel"""
        # Kolom
        try:
            raw_columns = inspector.get_columns(table_name, schema=schema)
        except Exception:
            raw_columns = inspector.get_columns(table_name)

        columns = []
        for col in raw_columns:
            columns.append(ColumnMetadata(
                name=col["name"],
                data_type=str(col["type"]),
                is_nullable=col.get("nullable", True),
                default_value=str(col["default"]) if col.get("default") is not None else None,
                is_primary_key=False,
                is_foreign_key=False,
            ))

        # Primary Key
        try:
            pk_info = inspector.get_pk_constraint(table_name, schema=schema)
            pk_cols = pk_info.get("constrained_columns", [])
        except Exception:
            pk_cols = []

        for col in columns:
            if col.name in pk_cols:
                col.is_primary_key = True

        # Foreign Keys
        try:
            raw_fks = inspector.get_foreign_keys(table_name, schema=schema)
        except Exception:
            raw_fks = []

        foreign_keys = []
        fk_col_names = set()
        for fk in raw_fks:
            for local_col, ref_col in zip(
                fk.get("constrained_columns", []),
                fk.get("referred_columns", [])
            ):
                fk_col_names.add(local_col)
                foreign_keys.append(ForeignKeyMetadata(
                    column=local_col,
                    references_table=fk.get("referred_table", ""),
                    references_column=ref_col,
                    on_delete=fk.get("options", {}).get("ondelete"),
                    on_update=fk.get("options", {}).get("onupdate"),
                ))

        for col in columns:
            if col.name in fk_col_names:
                col.is_foreign_key = True

        # Indexes
        try:
            raw_indexes = inspector.get_indexes(table_name, schema=schema)
        except Exception:
            raw_indexes = []

        indexes = []
        for idx in raw_indexes:
            # PostgreSQL functional indexes might return None in column_names
            cols = [c for c in idx.get("column_names", []) if c is not None]
            if not cols and idx.get("expressions"):
                cols = [str(expr) for expr in idx.get("expressions", []) if expr is not None]

            indexes.append(IndexMetadata(
                name=idx.get("name", f"idx_{table_name}") or f"idx_{table_name}",
                columns=cols,
                is_unique=idx.get("unique", False),
            ))

        # Row count (best effort)
        row_count = None
        try:
            with db_engine.connect() as db_conn:
                if engine_type == DBEngine.POSTGRESQL or engine_type == "postgresql":
                    # PostgreSQL estimate query
                    query = text("""
                        SELECT reltuples::bigint
                        FROM pg_class c
                        JOIN pg_namespace n ON n.oid = c.relnamespace
                        WHERE n.nspname = :schema AND c.relname = :table
                    """)
                    result = db_conn.execute(query, {"schema": schema, "table": table_name})
                    row_count = result.scalar()
                    if row_count is not None and row_count < 0:
                        row_count = 0
                elif engine_type == DBEngine.MYSQL or engine_type == "mysql":
                    # MySQL estimate query
                    query = text("""
                        SELECT TABLE_ROWS
                        FROM information_schema.tables
                        WHERE TABLE_SCHEMA = :schema AND TABLE_NAME = :table
                    """)
                    result = db_conn.execute(query, {"schema": schema, "table": table_name})
                    row_count = result.scalar()

                # Fallback to SELECT COUNT(*) if not PostgreSQL/MySQL or estimate failed (e.g. returns None)
                if row_count is None:
                    if engine_type == DBEngine.MYSQL or engine_type == "mysql":
                        escaped_table = table_name.replace('`', '``')
                        escaped_schema = schema.replace('`', '``')
                        quoted_table = f"`{escaped_schema}`.`{escaped_table}`"
                    elif engine_type == DBEngine.POSTGRESQL or engine_type == "postgresql":
                        escaped_table = table_name.replace('"', '""')
                        escaped_schema = schema.replace('"', '""')
                        quoted_table = f'"{escaped_schema}"."{escaped_table}"'
                    else: # SQLite
                        escaped_table = table_name.replace('"', '""')
                        quoted_table = f'"{escaped_table}"'
                    
                    result = db_conn.execute(text(f"SELECT COUNT(*) FROM {quoted_table}"))
                    row_count = result.scalar()
        except Exception:
            pass

        return TableMetadata(
            name=table_name,
            schema=schema,
            columns=columns,
            primary_key=pk_cols,
            foreign_keys=foreign_keys,
            indexes=indexes,
            row_count=row_count,
        )

    @classmethod
    def _get_views(cls, inspector, schema: str) -> List[ViewMetadata]:
        """Ambil list view"""
        views = []
        try:
            view_names = inspector.get_view_names(schema=schema)
            for name in view_names:
                try:
                    definition = inspector.get_view_definition(name, schema=schema)
                except Exception:
                    definition = None
                views.append(ViewMetadata(name=name, schema=schema, definition=definition))
        except Exception as e:
            logger.warning("Gagal ambil views", error=str(e))
        return views

    @classmethod
    def _get_functions(
        cls, db_engine, engine_type: str, schema: str
    ) -> List[FunctionMetadata]:
        """Ambil list stored functions/procedures (PostgreSQL only untuk MVP)"""
        functions = []
        if engine_type != DBEngine.POSTGRESQL:
            return functions

        query = text("""
            SELECT
                routine_name,
                routine_schema,
                external_language,
                data_type
            FROM information_schema.routines
            WHERE routine_schema = :schema
              AND routine_type = 'FUNCTION'
            ORDER BY routine_name
            LIMIT 100
        """)

        try:
            with db_engine.connect() as conn:
                result = conn.execute(query, {"schema": schema})
                for row in result:
                    functions.append(FunctionMetadata(
                        name=row[0],
                        schema=row[1],
                        language=row[2],
                        return_type=row[3],
                    ))
        except Exception as e:
            logger.warning("Gagal ambil functions", error=str(e))

        return functions

    @staticmethod
    def _get_version_query(engine_type: str) -> str:
        if engine_type == DBEngine.POSTGRESQL:
            return "SELECT version()"
        elif engine_type == DBEngine.MYSQL:
            return "SELECT VERSION()"
        elif engine_type == DBEngine.SQLITE:
            return "SELECT sqlite_version()"
        else:
            return "SELECT @@VERSION"

    @staticmethod
    def _get_table_count_query(engine_type: str, schema: str) -> str:
        if engine_type == DBEngine.POSTGRESQL:
            return f"SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '{schema}' AND table_type = 'BASE TABLE'"
        elif engine_type == DBEngine.MYSQL:
            return "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE()"
        elif engine_type == DBEngine.SQLITE:
            return "SELECT COUNT(*) FROM sqlite_master WHERE type='table'"
        else:
            return "SELECT COUNT(*) FROM information_schema.tables"

    @staticmethod
    def _clean_error(error_msg: str) -> str:
        """Bersihkan pesan error dari info sensitif"""
        # Hilangkan password yang mungkin muncul di error message
        cleaned = re.sub(r"password=['\"]?[^'\"\s]+['\"]?", "password=***", error_msg, flags=re.IGNORECASE)
        # Batasi panjang
        return cleaned[:300]



