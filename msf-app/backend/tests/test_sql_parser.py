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


def _cols(table):
    return {c.name: c.data_type for c in table.columns}


def _by_name(tables, name):
    return next(t for t in tables if t.name == name)


class TestSQLParserRegressions:
    """Regression test bug P-01 s/d P-08 (dev-docs/modules/diagram-canvas/PLAN.md)."""

    def test_type_not_matched_inside_column_name(self):
        # P-01: "showtime_id" dulu terbaca TIME, "settings" terbaca SET
        sql = "CREATE TABLE b (id INT PRIMARY KEY, showtime_id INT, settings JSON, points INT, offset_val BIGINT);"
        cols = _cols(SQLParser.parse(sql)[0])
        assert cols == {
            "id": "INT",
            "showtime_id": "INT",
            "settings": "JSON",
            "points": "INT",
            "offset_val": "BIGINT",
        }

    def test_longest_type_wins(self):
        # P-02: TIMESTAMP dulu terbaca TIME, DATETIME terbaca DATE
        sql = """CREATE TABLE t (
            a TIMESTAMP, b DATETIME, c DATE, d TIME, e INTEGER,
            f DOUBLE PRECISION, g CHARACTER VARYING(20),
            h TIMESTAMP WITH TIME ZONE, i NUMERIC(10,2), j VARCHAR(100)
        );"""
        cols = _cols(SQLParser.parse(sql)[0])
        assert cols == {
            "a": "TIMESTAMP",
            "b": "DATETIME",
            "c": "DATE",
            "d": "TIME",
            "e": "INTEGER",
            "f": "DOUBLE PRECISION",
            "g": "CHARACTER VARYING(20)",
            "h": "TIMESTAMP WITH TIME ZONE",
            "i": "NUMERIC(10,2)",
            "j": "VARCHAR(100)",
        }

    def test_unknown_type_kept_as_is(self):
        sql = "CREATE TABLE t (a NVARCHAR(50), b UNIQUEIDENTIFIER, c INT UNSIGNED, d TEXT[]);"
        cols = _cols(SQLParser.parse(sql)[0])
        assert cols == {
            "a": "NVARCHAR(50)",
            "b": "UNIQUEIDENTIFIER",
            "c": "INT UNSIGNED",
            "d": "TEXT[]",
        }

    def test_booking_template_types(self):
        sql = """
        CREATE TABLE showtimes (id INT PRIMARY KEY, start_time TIMESTAMP NOT NULL);
        CREATE TABLE bookings (
          id INT PRIMARY KEY,
          showtime_id INT REFERENCES showtimes(id),
          booking_date TIMESTAMP
        );"""
        bookings = _by_name(SQLParser.parse(sql), "bookings")
        assert _cols(bookings) == {"id": "INT", "showtime_id": "INT", "booking_date": "TIMESTAMP"}
        assert bookings.foreign_keys[0].references_table == "showtimes"

    def test_alter_table_foreign_key(self):
        # P-03: FK via ALTER TABLE (gaya pg_dump / MySQL Workbench)
        sql = """
        CREATE TABLE a (id INT PRIMARY KEY);
        CREATE TABLE b (id INT, a_id INT);
        ALTER TABLE b ADD CONSTRAINT fk_b_a FOREIGN KEY (a_id) REFERENCES a(id) ON DELETE CASCADE;
        """
        b = _by_name(SQLParser.parse(sql), "b")
        assert len(b.foreign_keys) == 1
        fk = b.foreign_keys[0]
        assert (fk.column, fk.references_table, fk.references_column) == ("a_id", "a", "id")
        assert fk.on_delete == "CASCADE"
        assert next(c for c in b.columns if c.name == "a_id").is_foreign_key

    def test_alter_table_pg_dump_style(self):
        sql = """
        CREATE TABLE public.a (id integer NOT NULL);
        CREATE TABLE public.b (id integer NOT NULL, a_id integer);
        ALTER TABLE ONLY public.a
            ADD CONSTRAINT a_pkey PRIMARY KEY (id);
        ALTER TABLE ONLY public.b
            ADD CONSTRAINT b_a_id_fkey FOREIGN KEY (a_id) REFERENCES public.a(id);
        """
        tables = SQLParser.parse(sql)
        a, b = _by_name(tables, "a"), _by_name(tables, "b")
        assert a.primary_key == ["id"]
        assert a.columns[0].is_primary_key
        assert b.foreign_keys[0].references_table == "a"

    def test_sqlserver_bracket_identifiers(self):
        # P-04 + P-06
        sql = "CREATE TABLE [dbo].[orders] ([id] INT PRIMARY KEY, [customer name] NVARCHAR(100));"
        tables = SQLParser.parse(sql, dialect="sqlserver")
        assert len(tables) == 1
        t = tables[0]
        assert t.name == "orders"
        assert t.schema == "dbo"
        assert _cols(t) == {"id": "INT", "customer name": "NVARCHAR(100)"}

    def test_table_modifiers(self):
        # P-04
        sql = """
        CREATE TEMPORARY TABLE tmp (id INT);
        CREATE UNLOGGED TABLE logs (id INT);
        CREATE TABLE IF NOT EXISTS cfg (id INT);
        CREATE GLOBAL TEMPORARY TABLE g (id INT);
        """
        assert [t.name for t in SQLParser.parse(sql)] == ["tmp", "logs", "cfg", "g"]

    def test_named_unique_constraint(self):
        # P-05
        sql = "CREATE TABLE c (id INT, email VARCHAR(100), CONSTRAINT uq_email UNIQUE (email));"
        t = SQLParser.parse(sql)[0]
        assert len(t.columns) == 2
        assert [(i.name, i.columns, i.is_unique) for i in t.indexes] == [("uq_email", ["email"], True)]

    def test_table_level_pk_before_columns(self):
        sql = "CREATE TABLE p (PRIMARY KEY (id), id INT, name TEXT);"
        t = SQLParser.parse(sql)[0]
        assert next(c for c in t.columns if c.name == "id").is_primary_key

    def test_schema_from_prefix_and_dialect_default(self):
        # P-06 + P-08
        sql = "CREATE TABLE s.users (id INT); CREATE TABLE t.users (id INT); CREATE TABLE plain (id INT);"
        tables = SQLParser.parse(sql)
        assert [(t.schema, t.name) for t in tables] == [("s", "users"), ("t", "users"), ("public", "plain")]
        assert SQLParser.parse("CREATE TABLE x (id INT);", dialect="mysql")[0].schema == ""
        assert SQLParser.parse("CREATE TABLE x (id INT);", dialect="sqlserver")[0].schema == "dbo"
        assert SQLParser.parse("CREATE TABLE x (id INT);", dialect="sqlite")[0].schema == "main"

    def test_string_literals_do_not_break_parsing(self):
        # P-07
        sql = """CREATE TABLE x (
            id INT,
            note VARCHAR(10) DEFAULT '--',
            st CHAR(1) CHECK (st IN ('a)', 'b'))
        );
        CREATE TABLE y (id INT);"""
        tables = SQLParser.parse(sql)
        assert [t.name for t in tables] == ["x", "y"]
        assert list(_cols(tables[0])) == ["id", "note", "st"]
        assert _cols(tables[0])["note"] == "VARCHAR(10)"

    def test_mysql_table_options_and_keys(self):
        sql = """
        CREATE TABLE `orders` (
          `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
          `user_id` INT NOT NULL,
          PRIMARY KEY (`id`),
          UNIQUE KEY `uq_user` (`user_id`),
          KEY `idx_user` (`user_id`),
          CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """
        t = SQLParser.parse(sql, dialect="mysql")[0]
        assert list(_cols(t)) == ["id", "user_id"]
        assert t.primary_key == ["id"]
        assert t.foreign_keys[0].references_table == "users"
        assert {i.name for i in t.indexes} == {"uq_user", "idx_user"}

    def test_self_reference_and_missing_target(self):
        sql = """CREATE TABLE employees (
            id INT PRIMARY KEY,
            manager_id INT REFERENCES employees(id),
            dept_id INT REFERENCES departments(id)
        );"""
        t = SQLParser.parse(sql)[0]
        assert [fk.references_table for fk in t.foreign_keys] == ["employees", "departments"]

    def test_sqlite_typeless_column(self):
        t = SQLParser.parse("CREATE TABLE s (id PRIMARY KEY, name);", dialect="sqlite")[0]
        assert list(_cols(t)) == ["id", "name"]
        assert t.columns[0].is_primary_key

    def test_column_names_starting_with_keywords(self):
        sql = "CREATE TABLE r (unique_code VARCHAR(10), check_in DATE, key_name TEXT, primary_flag BOOLEAN, index_no INT);"
        assert list(_cols(SQLParser.parse(sql)[0])) == ["unique_code", "check_in", "key_name", "primary_flag", "index_no"]
