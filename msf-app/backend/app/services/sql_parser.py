"""
SQL DDL Parser — parse CREATE TABLE (dan ALTER TABLE ... ADD CONSTRAINT)
menjadi metadata terstruktur.
Support: PostgreSQL, MySQL, SQLite, SQL Server (best-effort)
"""

import re
from typing import Dict, List, Optional, Tuple
from app.models.schemas import TableMetadata, ColumnMetadata, ForeignKeyMetadata, IndexMetadata


# Identifier: `x`, "x", [x], atau kata biasa
IDENT = r'(?:`[^`]+`|"[^"]+"|\[[^\]]+\]|[\w$]+)'
QUALIFIED = rf"({IDENT}(?:\s*\.\s*{IDENT})*)"

DEFAULT_SCHEMA = {
    "postgresql": "public",
    "mysql": "",
    "mariadb": "",
    "sqlite": "main",
    "sqlserver": "dbo",
    "mssql": "dbo",
}

QUOTE_CHARS = ("'", '"', "`")


class SQLParser:
    """
    Parse SQL DDL menjadi list TableMetadata.
    Didesain untuk best-effort parsing — tidak perlu 100% sempurna,
    karena AI akan mengisi bagian yang tidak terparse.
    """

    CREATE_PATTERN = re.compile(
        r"CREATE\s+(?:OR\s+REPLACE\s+)?(?:(?:GLOBAL|LOCAL)\s+)?(?:(?:TEMPORARY|TEMP|UNLOGGED)\s+)?"
        rf"TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?{QUALIFIED}\s*\(",
        re.IGNORECASE,
    )

    ALTER_PATTERN = re.compile(
        rf"ALTER\s+TABLE\s+(?:IF\s+EXISTS\s+)?(?:ONLY\s+)?{QUALIFIED}",
        re.IGNORECASE,
    )

    # Tipe data dicocokkan di AWAL definisi (setelah nama kolom), bukan di seluruh baris
    TYPE_PATTERN = re.compile(
        r"(DOUBLE\s+PRECISION|NATIONAL\s+CHARACTER\s+VARYING|CHARACTER\s+VARYING|BIT\s+VARYING|[A-Za-z_]\w*)"
        r"(\s*\([^()]*\))?"
        r"((?:\s+(?:WITH|WITHOUT)\s+TIME\s+ZONE)?(?:\s+(?:UNSIGNED|ZEROFILL))*)"
        r"((?:\s*\[\s*\d*\s*\])*)",
        re.IGNORECASE,
    )

    # Kata yang menandakan kolom tanpa tipe (SQLite) — bukan nama tipe
    COLUMN_CONSTRAINT_WORDS = {
        "NOT", "NULL", "PRIMARY", "REFERENCES", "UNIQUE", "DEFAULT", "CHECK",
        "CONSTRAINT", "COLLATE", "GENERATED", "AUTO_INCREMENT", "AUTOINCREMENT",
    }

    LENGTH_TYPES = {"VARCHAR", "CHAR", "CHARACTER", "CHARACTER VARYING", "NVARCHAR", "NCHAR", "VARCHAR2"}

    @classmethod
    def parse(cls, sql: str, dialect: str = "postgresql") -> List[TableMetadata]:
        """Entry point: parse SQL DDL string, return list TableMetadata."""
        sql = cls._remove_comments(sql or "")
        default_schema = DEFAULT_SCHEMA.get((dialect or "postgresql").lower(), "public")
        states: List[dict] = []

        for match in cls.CREATE_PATTERN.finditer(sql):
            schema, name = cls._split_qualified(match.group(1), default_schema)
            end_idx = cls._find_closing_paren(sql, match.end())
            if end_idx == -1:
                continue
            state = cls._new_state(name, schema)
            for definition in cls._split_top_level(sql[match.end():end_idx], ","):
                cls._apply_definition(state, definition)
            states.append(state)

        cls._apply_alter_statements(sql, states, default_schema)
        return [cls._build_table(state, states) for state in states]

    # ------------------------------------------------------------------
    # Tokenizing helpers (sadar string literal)
    # ------------------------------------------------------------------

    @classmethod
    def _remove_comments(cls, sql: str) -> str:
        """Hapus komentar -- dan /* */ tanpa menyentuh isi string literal."""
        out: List[str] = []
        i, n, quote = 0, len(sql), None
        while i < n:
            ch = sql[i]
            if quote:
                out.append(ch)
                if ch == quote:
                    if i + 1 < n and sql[i + 1] == quote:
                        out.append(sql[i + 1])
                        i += 2
                        continue
                    quote = None
                i += 1
            elif ch in QUOTE_CHARS:
                quote = ch
                out.append(ch)
                i += 1
            elif sql.startswith("--", i):
                newline = sql.find("\n", i)
                i = n if newline == -1 else newline
            elif sql.startswith("/*", i):
                close = sql.find("*/", i + 2)
                out.append(" ")
                i = n if close == -1 else close + 2
            else:
                out.append(ch)
                i += 1
        return "".join(out)

    @classmethod
    def _scan(cls, text: str, start: int = 0):
        """Yield (index, char, depth) untuk karakter di luar string literal."""
        depth, quote, i, n = 0, None, start, len(text)
        while i < n:
            ch = text[i]
            if quote:
                if ch == quote:
                    if i + 1 < n and text[i + 1] == quote:
                        i += 2
                        continue
                    quote = None
            elif ch in QUOTE_CHARS:
                quote = ch
            else:
                if ch == "(":
                    depth += 1
                elif ch == ")":
                    depth -= 1
                yield i, ch, depth
            i += 1

    @classmethod
    def _find_closing_paren(cls, text: str, start: int) -> int:
        """Cari ')' penutup untuk '(' yang berakhir tepat sebelum `start`."""
        for idx, ch, depth in cls._scan(text, start):
            if ch == ")" and depth == -1:
                return idx
        return -1

    @classmethod
    def _split_top_level(cls, body: str, sep: str) -> List[str]:
        """Split berdasarkan `sep` di kedalaman 0, di luar string literal."""
        parts, last = [], 0
        for idx, ch, depth in cls._scan(body):
            if ch == sep and depth == 0:
                parts.append(body[last:idx].strip())
                last = idx + 1
        parts.append(body[last:].strip())
        return [p for p in parts if p]

    @staticmethod
    def _unquote(ident: str) -> str:
        ident = ident.strip()
        if len(ident) >= 2 and (ident[0], ident[-1]) in (("`", "`"), ('"', '"'), ("[", "]")):
            return ident[1:-1]
        return ident

    @classmethod
    def _split_qualified(cls, text: str, default_schema: str) -> Tuple[str, str]:
        parts = [cls._unquote(p) for p in re.findall(IDENT, text)]
        if len(parts) >= 2:
            return parts[-2], parts[-1]
        return default_schema, parts[-1]

    @classmethod
    def _column_list(cls, text: str) -> List[str]:
        """Ambil daftar kolom dari grup kurung pertama: (a, `b`, c(10) DESC)."""
        open_idx = text.find("(")
        if open_idx == -1:
            return []
        close_idx = cls._find_closing_paren(text, open_idx + 1)
        inner = text[open_idx + 1:close_idx if close_idx != -1 else len(text)]
        cols = []
        for item in cls._split_top_level(inner, ","):
            m = re.match(IDENT, item)
            if m:
                cols.append(cls._unquote(m.group(0)))
        return cols

    # ------------------------------------------------------------------
    # Table state
    # ------------------------------------------------------------------

    @staticmethod
    def _new_state(name: str, schema: str) -> dict:
        return {"name": name, "schema": schema, "columns": [], "pks": [], "fks": [], "indexes": []}

    @classmethod
    def _apply_definition(cls, state: dict, definition: str) -> None:
        """Proses satu definisi di dalam CREATE TABLE (kolom atau constraint)."""
        constraint_name = None
        m = re.match(rf"CONSTRAINT\s+({IDENT})\s+(.*)$", definition, re.IGNORECASE | re.DOTALL)
        if m:
            constraint_name = cls._unquote(m.group(1))
            definition = m.group(2)

        if cls._apply_constraint(state, definition, constraint_name):
            return
        if constraint_name:
            return  # CONSTRAINT lain (CHECK, EXCLUDE, dll.) — abaikan

        column = cls._parse_column(state, definition)
        if column:
            state["columns"].append(column)

    @classmethod
    def _apply_constraint(cls, state: dict, text: str, constraint_name: Optional[str]) -> bool:
        """Proses constraint tingkat tabel. Return True jika `text` adalah constraint."""
        upper = text.upper()

        if re.match(r"PRIMARY\s+KEY\b", upper):
            state["pks"].extend(cls._column_list(text))
            return True

        if re.match(r"FOREIGN\s+KEY\b", upper):
            fk_cols = cls._column_list(text)
            ref = cls._parse_references(text)
            if fk_cols and ref:
                ref_cols = ref["columns"] or [""]
                for idx, col in enumerate(fk_cols):
                    state["fks"].append(ForeignKeyMetadata(
                        column=col,
                        references_table=ref["table"],
                        references_column=ref_cols[min(idx, len(ref_cols) - 1)],
                        on_delete=ref["on_delete"],
                        on_update=ref["on_update"],
                    ))
            return True

        index_match = re.match(
            rf"(UNIQUE|FULLTEXT|SPATIAL)?\s*(?:KEY|INDEX)?\s*({IDENT})?\s*(?:USING\s+\w+\s*)?\(",
            text,
            re.IGNORECASE,
        )
        starts_index = re.match(r"(UNIQUE|FULLTEXT|SPATIAL|KEY|INDEX)\b", upper)
        if starts_index:
            cols = cls._column_list(text)
            is_unique = upper.startswith("UNIQUE")
            explicit = index_match.group(2) if index_match and index_match.group(2) else None
            if explicit and explicit.upper() in {"KEY", "INDEX"}:
                explicit = None
            if cols:
                prefix = "uq" if is_unique else "idx"
                state["indexes"].append(IndexMetadata(
                    name=constraint_name or (cls._unquote(explicit) if explicit else f"{prefix}_{'_'.join(cols)}"),
                    columns=cols,
                    is_unique=is_unique,
                ))
            return True

        if re.match(r"(CHECK|EXCLUDE|PERIOD)\b", upper):
            return True

        return False

    @classmethod
    def _parse_references(cls, text: str) -> Optional[dict]:
        """Parse 'REFERENCES [schema.]table [(cols)] [ON DELETE x] [ON UPDATE y]'."""
        m = re.search(rf"\bREFERENCES\s+{QUALIFIED}\s*(\([^)]*\))?", text, re.IGNORECASE)
        if not m:
            return None
        _, table = cls._split_qualified(m.group(1), "")
        columns = cls._column_list(m.group(2)) if m.group(2) else []
        action = r"(SET\s+NULL|SET\s+DEFAULT|NO\s+ACTION|CASCADE|RESTRICT)"
        on_delete = re.search(rf"\bON\s+DELETE\s+{action}", text, re.IGNORECASE)
        on_update = re.search(rf"\bON\s+UPDATE\s+{action}", text, re.IGNORECASE)
        return {
            "table": table,
            "columns": columns,
            "on_delete": re.sub(r"\s+", " ", on_delete.group(1).upper()) if on_delete else None,
            "on_update": re.sub(r"\s+", " ", on_update.group(1).upper()) if on_update else None,
        }

    @classmethod
    def _parse_type(cls, rest: str) -> str:
        """Ambil tipe data dari awal definisi kolom (setelah nama kolom)."""
        m = cls.TYPE_PATTERN.match(rest)
        if not m or m.group(1).upper() in cls.COLUMN_CONSTRAINT_WORDS:
            return "TEXT"  # kolom tanpa tipe (SQLite)
        base = re.sub(r"\s+", " ", m.group(1)).upper()
        args = re.sub(r"\s+", "", m.group(2)) if m.group(2) and "'" not in m.group(2) else (m.group(2) or "").strip()
        suffix = re.sub(r"\s+", " ", m.group(3)).upper()
        arrays = re.sub(r"\s+", "", m.group(4))
        return f"{base}{args}{suffix}{arrays}"

    @classmethod
    def _parse_column(cls, state: dict, line: str) -> Optional[ColumnMetadata]:
        """Parse satu definisi kolom."""
        m = re.match(rf"({IDENT})\s*(.*)$", line, re.DOTALL)
        if not m:
            return None
        col_name = cls._unquote(m.group(1))
        rest = m.group(2)

        data_type = cls._parse_type(rest)

        default_value = None
        default_match = re.search(
            r"\bDEFAULT\s+('(?:[^']|'')*'|\([^)]*\)|[^\s,]+)", rest, re.IGNORECASE
        )
        if default_match:
            default_value = default_match.group(1)

        max_length = None
        len_match = re.match(r"([A-Z ]+[A-Z2])\((\d+)\)", data_type)
        if len_match and len_match.group(1) in cls.LENGTH_TYPES:
            max_length = int(len_match.group(2))

        if re.search(r"\bPRIMARY\s+KEY\b", rest, re.IGNORECASE):
            state["pks"].append(col_name)

        ref = cls._parse_references(rest)
        if ref:
            state["fks"].append(ForeignKeyMetadata(
                column=col_name,
                references_table=ref["table"],
                references_column=ref["columns"][0] if ref["columns"] else "",
                on_delete=ref["on_delete"],
                on_update=ref["on_update"],
            ))

        return ColumnMetadata(
            name=col_name,
            data_type=data_type,
            is_nullable=not re.search(r"\bNOT\s+NULL\b", rest, re.IGNORECASE),
            default_value=default_value,
            max_length=max_length,
            is_primary_key=False,
            is_foreign_key=False,
        )

    @classmethod
    def _apply_alter_statements(cls, sql: str, states: List[dict], default_schema: str) -> None:
        """Proses 'ALTER TABLE x ADD [CONSTRAINT n] PRIMARY KEY/FOREIGN KEY/UNIQUE (...)'."""
        for match in cls.ALTER_PATTERN.finditer(sql):
            schema, name = cls._split_qualified(match.group(1), default_schema)
            state = cls._find_state(states, name, schema)
            if not state:
                continue
            body = sql[match.end():]
            end = next((idx for idx, ch, depth in cls._scan(body) if ch == ";" and depth == 0), len(body))
            for clause in cls._split_top_level(body[:end], ","):
                add = re.match(rf"ADD\s+(?:CONSTRAINT\s+({IDENT})\s+)?(.*)$", clause, re.IGNORECASE | re.DOTALL)
                if add:
                    cname = cls._unquote(add.group(1)) if add.group(1) else None
                    cls._apply_constraint(state, add.group(2), cname)

    @staticmethod
    def _find_state(states: List[dict], name: str, schema: Optional[str] = None) -> Optional[dict]:
        exact = next((s for s in states if s["name"] == name and s["schema"] == schema), None)
        return exact or next((s for s in states if s["name"] == name), None)

    @classmethod
    def _build_table(cls, state: dict, states: List[dict]) -> TableMetadata:
        pks = list(dict.fromkeys(state["pks"]))
        fk_cols = {fk.column for fk in state["fks"]}
        for col in state["columns"]:
            col.is_primary_key = col.name in pks
            col.is_foreign_key = col.name in fk_cols

        # REFERENCES tanpa kolom -> PK tabel tujuan (default PostgreSQL)
        for fk in state["fks"]:
            if not fk.references_column:
                target = cls._find_state(states, fk.references_table)
                target_pks = list(dict.fromkeys(target["pks"])) if target else []
                fk.references_column = target_pks[0] if target_pks else "id"

        return TableMetadata(
            name=state["name"],
            schema=state["schema"],
            columns=state["columns"],
            primary_key=pks,
            foreign_keys=state["fks"],
            indexes=state["indexes"],
        )

    @classmethod
    def validate_sql(cls, sql: str) -> dict:
        """
        Validasi apakah SQL mengandung CREATE TABLE.
        Return: {"valid": bool, "table_count": int, "message": str}
        """
        tables = cls.parse(sql)

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
