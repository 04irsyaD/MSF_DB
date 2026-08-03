# ADR-002 — Custom Regex SQL Parser

> **Status:** Accepted
> **Tanggal:** 2026-06-28

---

## Context

MSF-APP perlu mem-parse DDL SQL dari berbagai dialek (PostgreSQL, MySQL, SQLite) untuk mengekstrak nama tabel, kolom, tipe data, dan foreign key. Dibutuhkan parser yang bisa handle sintaks SQL yang bervariasi.

Constraint:
- Tidak boleh menambah dependency besar (sqlparse, antlr4 memiliki overhead signifikan)
- Harus bisa handle edge cases seperti nilai DEFAULT yang berisi tanda kurung bertingkat
- Performa parsing tidak kritis (hanya dijalankan sekali saat user input)

---

## Decision

Menggunakan **custom regex-based parser** di `backend/app/services/sql_parser.py` dengan algoritma **Parentheses Depth Counting** untuk menangani nested parentheses.

Alternatif yang ditolak:
- `sqlparse`: menghasilkan AST terlalu kompleks untuk kebutuhan sederhana ini
- `antlr4`: sangat overkill, memerlukan grammar file terpisah
- `sqlglot`: dependency besar, overhead untuk use case sederhana

---

## Consequences

### Positive

- Zero additional dependency
- Mudah di-extend untuk dialek baru
- Parsing cepat (pure Python regex)

### Trade-offs

- Tidak bisa handle SQL yang sangat kompleks (stored procedures, triggers, CTE bertingkat)
- Test coverage harus mencakup edge cases secara manual

### Risks

- Bug baru bisa muncul saat user paste DDL dengan sintaks tidak standar — dimitigasi dengan test suite (32 test cases)
