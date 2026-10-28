"""
Test suite untuk SQLParser — komponen paling kritis yang rentan regresi.
"""
import pytest
from app.services.sql_parser import SQLParser


class TestSQLParserBasic:
    """Test parsing DDL dasar."""

    def test_parse_single_table(self):
        sql = """
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) NOT NULL,
            email VARCHAR(255) UNIQUE
        );
        """
        tables = SQLParser.parse(sql)
        assert len(tables) == 1
        assert tables[0].name == "users"
        assert len(tables[0].columns) == 3

    def test_parse_multiple_tables(self):
        sql = """
        CREATE TABLE users (id SERIAL PRIMARY KEY);
        CREATE TABLE posts (id SERIAL PRIMARY KEY, user_id INT);
        CREATE TABLE comments (id SERIAL PRIMARY KEY);
        """
        tables = SQLParser.parse(sql)
        assert len(tables) == 3
        table_names = [t.name for t in tables]
        assert "users" in table_names
        assert "posts" in table_names
        assert "comments" in table_names

    def test_parse_empty_sql_returns_empty(self):
        tables = SQLParser.parse("")
        assert tables == []

    def test_parse_sql_without_create_table_returns_empty(self):
        sql = "SELECT * FROM users; INSERT INTO logs VALUES (1);"
        tables = SQLParser.parse(sql)
        assert tables == []


class TestSQLParserDialects:
    """Test berbagai SQL dialek."""

    def test_parse_mysql_backtick_identifiers(self):
        sql = """
        CREATE TABLE `users` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `username` VARCHAR(50) NOT NULL
        ) ENGINE=InnoDB;
        """
        tables = SQLParser.parse(sql)
        assert len(tables) == 1
        assert tables[0].name == "users"

    def test_parse_postgresql_serial_primary_key(self):
        sql = """
        CREATE TABLE products (
            id SERIAL PRIMARY KEY,
            name VARCHAR(200) NOT NULL,
            price NUMERIC(10,2) DEFAULT 0.00
        );
        """
        tables = SQLParser.parse(sql)
        assert len(tables) == 1
        assert tables[0].name == "products"
        pk_cols = [c for c in tables[0].columns if c.is_primary_key]
        assert len(pk_cols) >= 1

    def test_parse_sqlite_autoincrement(self):
        sql = """
        CREATE TABLE sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            token TEXT NOT NULL
        );
        """
        tables = SQLParser.parse(sql)
        assert len(tables) == 1
        assert tables[0].name == "sessions"


class TestSQLParserEdgeCases:
    """Test edge cases dan robustness."""

    def test_parse_sql_with_comments(self):
        sql = """
        -- Tabel untuk menyimpan user
        CREATE TABLE users (
            id SERIAL PRIMARY KEY, -- primary key
            /* email harus unique */
            email VARCHAR(255) UNIQUE NOT NULL
        );
        """
        tables = SQLParser.parse(sql)
        assert len(tables) == 1

    def test_parse_foreign_key_detected(self):
        sql = """
        CREATE TABLE posts (
            id SERIAL PRIMARY KEY,
            author_id INTEGER REFERENCES users(id) ON DELETE CASCADE
        );
        """
        tables = SQLParser.parse(sql)
        assert len(tables) == 1
        fk_cols = [c for c in tables[0].columns if c.is_foreign_key]
        assert len(fk_cols) >= 1

    def test_validate_sql_valid(self):
        sql = "CREATE TABLE test (id INT);"
        assert SQLParser.validate_sql(sql)["valid"] is True

    def test_validate_sql_invalid(self):
        assert SQLParser.validate_sql("")["valid"] is False
        assert SQLParser.validate_sql("SELECT * FROM users")["valid"] is False
        assert SQLParser.validate_sql("   ")["valid"] is False


class TestSQLParserColumnTypes:
    """Tipe data harus dibaca tepat setelah nama kolom, bukan dari potongan nama kolom."""

    @staticmethod
    def _types(sql: str) -> dict:
        return {c.name: c.data_type for c in SQLParser.parse(sql)[0].columns}

    def test_column_name_does_not_leak_into_type(self):
        # Regresi: "upDATEd_by_id" terbaca DATE, "SETtings" SET, "CHARge" CHAR, "REALm" REAL, "BITrate" BIT
        types = self._types("""
        CREATE TABLE t (
            updated_by_id uuid NULL,
            settings JSONB,
            charge_code VARCHAR(20),
            realm_id INT,
            bitrate INTEGER,
            date_open timestamptz(6) NOT NULL,
            time_down timestamptz(6) NULL
        );
        """)
        assert types == {
            "updated_by_id": "UUID",
            "settings": "JSONB",
            "charge_code": "VARCHAR(20)",
            "realm_id": "INT",
            "bitrate": "INTEGER",
            "date_open": "TIMESTAMPTZ(6)",
            "time_down": "TIMESTAMPTZ(6)",
        }

    def test_timestamp_is_not_time(self):
        types = self._types("""
        CREATE TABLE t (
            a TIMESTAMP NOT NULL,
            b TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            c timestamp(6) without time zone,
            d TIME,
            e DATE
        );
        """)
        assert types == {
            "a": "TIMESTAMP",
            "b": "TIMESTAMP WITH TIME ZONE",
            "c": "TIMESTAMP(6) WITHOUT TIME ZONE",
            "d": "TIME",
            "e": "DATE",
        }

    def test_multiword_custom_and_array_types(self):
        types = self._types("""
        CREATE TABLE t (
            a CHARACTER VARYING(255) NOT NULL,
            b DOUBLE PRECISION,
            c NUMERIC(10, 2),
            d INT(11) UNSIGNED NOT NULL,
            e public.status_enum DEFAULT 'new',
            f TEXT[],
            g int4 NULL,
            h NVARCHAR(MAX)
        );
        """)
        assert types == {
            "a": "CHARACTER VARYING(255)",
            "b": "DOUBLE PRECISION",
            "c": "NUMERIC(10, 2)",
            "d": "INT(11) UNSIGNED",
            "e": "PUBLIC.STATUS_ENUM",
            "f": "TEXT[]",
            "g": "INT4",
            "h": "NVARCHAR(MAX)",
        }

    def test_typeless_sqlite_column_defaults_to_text(self):
        types = self._types("CREATE TABLE t (id INTEGER PRIMARY KEY, note NOT NULL, extra DEFAULT 1);")
        assert types == {"id": "INTEGER", "note": "TEXT", "extra": "TEXT"}

    def test_max_length_read_from_type_only(self):
        cols = {c.name: c.max_length for c in SQLParser.parse(
            "CREATE TABLE t (name VARCHAR(100) NOT NULL, code CHARACTER VARYING(8), total INT, title NVARCHAR(50));"
        )[0].columns}
        assert cols == {"name": 100, "code": 8, "total": None, "title": 50}
