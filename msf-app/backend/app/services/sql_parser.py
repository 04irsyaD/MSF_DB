"""
SQL DDL Parser — parse CREATE TABLE statements menjadi metadata terstruktur.
Support: PostgreSQL, MySQL, SQLite, SQL Server (best-effort)
"""

import re
from typing import List, Optional
from app.models.schemas import TableMetadata, ColumnMetadata, ForeignKeyMetadata, IndexMetadata


class SQLParser:
    """
    Parse SQL DDL (CREATE TABLE) menjadi list TableMetadata.
    Didesain untuk best-effort parsing — tidak perlu 100% sempurna,
    karena AI akan mengisi bagian yang tidak terparse.
    """

    # Pattern untuk menangkap seluruh blok CREATE TABLE
    TABLE_PATTERN = re.compile(
        r"CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?"
        r"(?:[\w`\"]+\.)?[`\"']?([\w]+)[`\"']?\s*\(([\s\S]*?)\)\s*(?:;|ENGINE|DEFAULT|COMMENT|$)",
        re.IGNORECASE | re.MULTILINE,
    )

    # Pattern untuk tipe data umum
    DATA_TYPE_PATTERN = re.compile(
        r"(SERIAL|BIGSERIAL|SMALLSERIAL|INTEGER|INT|BIGINT|SMALLINT|TINYINT|"
        r"NUMERIC|DECIMAL|FLOAT|DOUBLE\s+PRECISION|REAL|"
        r"VARCHAR|CHARACTER\s+VARYING|CHAR|TEXT|CLOB|"
        r"BOOLEAN|BOOL|BIT|"
        r"DATE|TIME|TIMESTAMP|DATETIME|YEAR|"
        r"UUID|JSON|JSONB|XML|"
        r"BLOB|BYTEA|BINARY|VARBINARY|"
        r"ENUM|SET|"
        r"MONEY|"
        r"INET|CIDR|MACADDR)"
        r"(?:\s*\([^)]*\))?",
        re.IGNORECASE,
    )

    @classmethod
    def parse(cls, sql: str) -> List[TableMetadata]:
        """
        Entry point: parse SQL DDL string, return list TableMetadata.
        """
        # Bersihkan komentar SQL
        sql = cls._remove_comments(sql)
        tables = []

        for match in cls.TABLE_PATTERN.finditer(sql):
            table_name = match.group(1)
            body = match.group(2)

            table = cls._parse_table_body(table_name, body)
            tables.append(table)

        return tables

    @classmethod
    def _remove_comments(cls, sql: str) -> str:
        """Hapus komentar SQL (-- single line dan /* multi line */)"""
        # Multi-line comments
        sql = re.sub(r"/\*[\s\S]*?\*/", "", sql)
        # Single-line comments
        sql = re.sub(r"--[^\n]*", "", sql)
        return sql

    @classmethod
    def _parse_table_body(cls, table_name: str, body: str) -> TableMetadata:
        """Parse isi dalam kurung CREATE TABLE"""
        columns: List[ColumnMetadata] = []
        primary_keys: List[str] = []
        foreign_keys: List[ForeignKeyMetadata] = []
        indexes: List[IndexMetadata] = []

        # Split per baris definisi kolom/constraint
        lines = cls._split_definitions(body)

        for line in lines:
            line = line.strip()
            if not line:
                continue

            upper = line.upper().lstrip()

            # PRIMARY KEY constraint (table-level)
            if upper.startswith("PRIMARY KEY"):
                cols = cls._extract_column_list(line)
                primary_keys.extend(cols)
                # Tandai kolom yang merupakan PK
                for col in columns:
                    if col.name in cols:
                        col.is_primary_key = True
                continue

            # FOREIGN KEY constraint
            if upper.startswith("FOREIGN KEY") or upper.startswith("CONSTRAINT"):
                fk = cls._parse_foreign_key(line)
                if fk:
                    foreign_keys.append(fk)
                    # Tandai kolom FK
                    for col in columns:
                        if col.name == fk.column:
                            col.is_foreign_key = True
                continue

            # UNIQUE constraint
            if upper.startswith("UNIQUE"):
                cols = cls._extract_column_list(line)
                if cols:
                    indexes.append(IndexMetadata(
                        name=f"uq_{'_'.join(cols)}",
                        columns=cols,
                        is_unique=True,
                    ))
                continue

            # INDEX
            if upper.startswith("INDEX") or upper.startswith("KEY"):
                cols = cls._extract_column_list(line)
                if cols:
                    indexes.append(IndexMetadata(
                        name=f"idx_{'_'.join(cols)}",
                        columns=cols,
                        is_unique=False,
                    ))
                continue

            # CHECK constraint — skip
            if upper.startswith("CHECK"):
                continue

            # Column definition
            col = cls._parse_column(line)
            if col:
                # Cek inline PRIMARY KEY
                if re.search(r"\bPRIMARY\s+KEY\b", line, re.IGNORECASE):
                    col.is_primary_key = True
                    primary_keys.append(col.name)
                # Cek inline REFERENCES (FK)
                if re.search(r"\bREFERENCES\b", line, re.IGNORECASE):
                    col.is_foreign_key = True
                    fk = cls._parse_inline_fk(col.name, line)
                    if fk:
                        foreign_keys.append(fk)
                columns.append(col)

        return TableMetadata(
            name=table_name,
            schema="public",
            columns=columns,
            primary_key=primary_keys,
            foreign_keys=foreign_keys,
            indexes=indexes,
        )

    @classmethod
    def _split_definitions(cls, body: str) -> List[str]:
        """
        Split definisi kolom/constraint berdasarkan koma,
        tapi abaikan koma di dalam tanda kurung.
        """
        result = []
        depth = 0
        current = []

        for char in body:
            if char == "(":
                depth += 1
                current.append(char)
            elif char == ")":
                depth -= 1
                current.append(char)
            elif char == "," and depth == 0:
                result.append("".join(current).strip())
                current = []
            else:
                current.append(char)

        if current:
            result.append("".join(current).strip())

        return result

    @classmethod
    def _parse_column(cls, line: str) -> Optional[ColumnMetadata]:
        """Parse satu definisi kolom"""
        # Ambil nama kolom (token pertama, hapus backtick/quote)
        name_match = re.match(r'[`"\'"]?([\w]+)[`"\'"]?\s+', line)
        if not name_match:
            return None

        col_name = name_match.group(1)

        # Skip jika nama kolom adalah keyword constraint
        reserved = {"PRIMARY", "FOREIGN", "UNIQUE", "CHECK", "INDEX", "KEY", "CONSTRAINT"}
        if col_name.upper() in reserved:
            return None

        # Cari tipe data
        data_type = "TEXT"  # default
        type_match = cls.DATA_TYPE_PATTERN.search(line)
        if type_match:
            data_type = type_match.group(0).strip().upper()

        # Cek NULL/NOT NULL
        is_nullable = True
        if re.search(r"\bNOT\s+NULL\b", line, re.IGNORECASE):
            is_nullable = False

        # Default value
        default_value = None
        default_match = re.search(r"\bDEFAULT\s+([^\s,]+)", line, re.IGNORECASE)
        if default_match:
            default_value = default_match.group(1)

        # Max length (dari VARCHAR(n))
        max_length = None
        len_match = re.search(r"(?:VARCHAR|CHAR|CHARACTER\s+VARYING)\s*\((\d+)\)", line, re.IGNORECASE)
        if len_match:
            max_length = int(len_match.group(1))

        return ColumnMetadata(
            name=col_name,
            data_type=data_type,
            is_nullable=is_nullable,
            default_value=default_value,
            max_length=max_length,
            is_primary_key=False,
            is_foreign_key=False,
        )

    @classmethod
    def _extract_column_list(cls, line: str) -> List[str]:
        """Ekstrak list nama kolom dari dalam tanda kurung"""
        match = re.search(r"\(([^)]+)\)", line)
        if not match:
            return []
        cols_str = match.group(1)
        return [
            c.strip().strip("`\"'")
            for c in cols_str.split(",")
            if c.strip()
        ]

    @classmethod
    def _parse_foreign_key(cls, line: str) -> Optional[ForeignKeyMetadata]:
        """Parse FOREIGN KEY constraint"""
        # FOREIGN KEY (col) REFERENCES table(ref_col)
        pattern = re.compile(
            r"FOREIGN\s+KEY\s*\(([^)]+)\)\s*REFERENCES\s+"
            r"(?:[\w`\"]+\.)?[`\"']?([\w]+)[`\"']?\s*\(([^)]+)\)"
            r"(?:\s+ON\s+DELETE\s+(\w+(?:\s+\w+)?))?"
            r"(?:\s+ON\s+UPDATE\s+(\w+(?:\s+\w+)?))?",
            re.IGNORECASE,
        )
        match = pattern.search(line)
        if not match:
            return None

        col = match.group(1).strip().strip("`\"'")
        ref_table = match.group(2).strip()
        ref_col = match.group(3).strip().strip("`\"'")
        on_delete = match.group(4) if match.group(4) else None
        on_update = match.group(5) if match.group(5) else None

        return ForeignKeyMetadata(
            column=col,
            references_table=ref_table,
            references_column=ref_col,
            on_delete=on_delete,
            on_update=on_update,
        )

    @classmethod
    def _parse_inline_fk(cls, col_name: str, line: str) -> Optional[ForeignKeyMetadata]:
        """Parse inline REFERENCES pada definisi kolom"""
        pattern = re.compile(
            r"REFERENCES\s+(?:[\w`\"]+\.)?[`\"']?([\w]+)[`\"']?\s*\(([^)]+)\)"
            r"(?:\s+ON\s+DELETE\s+(\w+(?:\s+\w+)?))?"
            r"(?:\s+ON\s+UPDATE\s+(\w+(?:\s+\w+)?))?",
            re.IGNORECASE,
        )
        match = pattern.search(line)
        if not match:
            return None

        ref_table = match.group(1).strip()
        ref_col = match.group(2).strip().strip("`\"'")
        on_delete = match.group(3) if match.group(3) else None
        on_update = match.group(4) if match.group(4) else None

        return ForeignKeyMetadata(
            column=col_name,
            references_table=ref_table,
            references_column=ref_col,
            on_delete=on_delete,
            on_update=on_update,
        )

    @classmethod
    def validate_sql(cls, sql: str) -> dict:
        """
        Validasi apakah SQL mengandung CREATE TABLE.
        Return: {"valid": bool, "table_count": int, "message": str}
        """
        cleaned = cls._remove_comments(sql)
        tables = cls.parse(cleaned)

        if not tables:
            return {
                "valid": False,
                "table_count": 0,
                "message": "Tidak ditemukan statement CREATE TABLE yang valid.",
            }

        return {
            "valid": True,
            "table_count": len(tables),
            "message": f"Ditemukan {len(tables)} tabel: {', '.join(t.name for t in tables)}",
        }
