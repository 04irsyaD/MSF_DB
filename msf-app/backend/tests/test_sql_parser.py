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
