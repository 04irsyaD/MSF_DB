import { TableMetadata, ColumnMetadata, ForeignKeyMetadata, IndexMetadata } from "../types";

export class SQLParser {
  // Regex to match CREATE TABLE blocks
  private static TABLE_PATTERN = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:[\w`"]+\.)?[`"']?([\w]+)[`"']?\s*\(([\s\S]*?)\)\s*(?:;|ENGINE|DEFAULT|COMMENT|$)/gi;

  // Regex to match data types
  private static DATA_TYPE_PATTERN = /(SERIAL|BIGSERIAL|SMALLSERIAL|INTEGER|INT|BIGINT|SMALLINT|TINYINT|NUMERIC|DECIMAL|FLOAT|DOUBLE\s+PRECISION|REAL|VARCHAR|CHARACTER\s+VARYING|CHAR|TEXT|CLOB|BOOLEAN|BOOL|BIT|DATE|TIME|TIMESTAMP|DATETIME|YEAR|UUID|JSON|JSONB|XML|BLOB|BYTEA|BINARY|VARBINARY|ENUM|SET|MONEY|INET|CIDR|MACADDR)(?:\s*\([^)]*\))?/i;

  /**
   * Entry point: parse SQL DDL string, return list of TableMetadata.
   */
  public static parse(sql: string): TableMetadata[] {
    const cleaned = this._removeComments(sql);
    const tables: TableMetadata[] = [];
    
    // Reset regex lastIndex just in case
    this.TABLE_PATTERN.lastIndex = 0;
    
    let match;
    while ((match = this.TABLE_PATTERN.exec(cleaned)) !== null) {
      const tableName = match[1];
      const body = match[2];
      
      const table = this._parseTableBody(tableName, body);
      tables.push(table);
    }
    
    return tables;
  }

  /**
   * Strip SQL comments (-- single line and /* multi line)
   */
  private static _removeComments(sql: string): string {
    // Multi-line comments /* ... */
    let cleaned = sql.replace(/\/\*[\s\S]*?\*\//g, "");
    // Single-line comments -- ...
    cleaned = cleaned.replace(/--[^\n]*/g, "");
    return cleaned;
  }

  /**
   * Parse the columns/constraints inside CREATE TABLE parentheses
   */
  private static _parseTableBody(tableName: string, body: string): TableMetadata {
    const columns: ColumnMetadata[] = [];
    const primaryKeys: string[] = [];
    const foreignKeys: ForeignKeyMetadata[] = [];
    const indexes: IndexMetadata[] = [];

    const lines = this._splitDefinitions(body);

    for (let line of lines) {
      line = line.trim();
      if (!line) continue;

      const upper = line.toUpperCase();

      // PRIMARY KEY constraint (table-level)
      if (upper.startsWith("PRIMARY KEY")) {
        const cols = this._extractColumnList(line);
        primaryKeys.push(...cols);
        // Mark columns as PK
        for (const col of columns) {
          if (cols.includes(col.name)) {
            col.is_primary_key = true;
          }
        }
        continue;
      }

      // FOREIGN KEY constraint (table-level)
      if (upper.startsWith("FOREIGN KEY") || upper.startsWith("CONSTRAINT")) {
        const fk = this._parseForeignKey(line);
        if (fk) {
          foreignKeys.push(fk);
          // Mark column as FK
          for (const col of columns) {
            if (col.name === fk.column) {
              col.is_foreign_key = true;
            }
          }
        }
        continue;
      }

      // UNIQUE constraint
      if (upper.startsWith("UNIQUE")) {
        const cols = this._extractColumnList(line);
        if (cols.length > 0) {
          indexes.push({
            name: `uq_${cols.join("_")}`,
            columns: cols,
            is_unique: true,
          });
        }
        continue;
      }

      // INDEX / KEY
      if (upper.startsWith("INDEX") || upper.startsWith("KEY")) {
        const cols = this._extractColumnList(line);
        if (cols.length > 0) {
          indexes.push({
            name: `idx_${cols.join("_")}`,
            columns: cols,
            is_unique: false,
          });
        }
        continue;
      }

      // CHECK constraint (skip)
      if (upper.startsWith("CHECK")) {
        continue;
      }

      // Column definition
      const col = this._parseColumn(line);
      if (col) {
        // Check inline PRIMARY KEY
        if (/\bPRIMARY\s+KEY\b/i.test(line)) {
          col.is_primary_key = true;
          primaryKeys.push(col.name);
        }
        // Check inline REFERENCES (FK)
        if (/\bREFERENCES\b/i.test(line)) {
          col.is_foreign_key = true;
          const fk = this._parseInlineFk(col.name, line);
          if (fk) {
            foreignKeys.push(fk);
          }
        }
        columns.push(col);
      }
    }

    return {
      name: tableName,
      schema: "public",
      columns,
      primary_key: primaryKeys,
      foreign_keys: foreignKeys,
      indexes,
    };
  }

  /**
   * Split column/constraint definitions by comma, ignoring commas inside parentheses
   */
  private static _splitDefinitions(body: string): string[] {
    const result: string[] = [];
    let depth = 0;
    let current: string[] = [];

    for (let i = 0; i < body.length; i++) {
      const char = body[i];
      if (char === "(") {
        depth++;
        current.push(char);
      } else if (char === ")") {
        depth--;
        current.push(char);
      } else if (char === "," && depth === 0) {
        result.push(current.join("").trim());
        current = [];
      } else {
        current.push(char);
      }
    }

    if (current.length > 0) {
      result.push(current.join("").trim());
    }

    return result;
  }

  /**
   * Parse a single column definition line
   */
  private static _parseColumn(line: string): ColumnMetadata | null {
    // Get column name (first token, strip quotes/backticks)
    const nameMatch = line.match(/^[`"']?([\w]+)[`"']?\s+/);
    if (!nameMatch) return null;

    const colName = nameMatch[1];

    // Skip if it matches SQL constraint keywords
    const reserved = new Set(["PRIMARY", "FOREIGN", "UNIQUE", "CHECK", "INDEX", "KEY", "CONSTRAINT"]);
    if (reserved.has(colName.toUpperCase())) {
      return null;
    }

    // Find data type
    let dataType = "TEXT";
    const typeMatch = line.match(this.DATA_TYPE_PATTERN);
    if (typeMatch) {
      dataType = typeMatch[0].trim().toUpperCase();
    }

    // Check NULL / NOT NULL
    let isNullable = true;
    if (/\bNOT\s+NULL\b/i.test(line)) {
      isNullable = false;
    }

    // Default value
    let defaultValue: string | undefined = undefined;
    const defaultMatch = line.match(/\bDEFAULT\s+([^\s,()]+)/i);
    if (defaultMatch) {
      defaultValue = defaultMatch[1];
    }

    // Max length (from VARCHAR(n) or CHAR(n))
    let maxLength: number | undefined = undefined;
    const lenMatch = line.match(/(?:VARCHAR|CHAR|CHARACTER\s+VARYING)\s*\((\d+)\)/i);
    if (lenMatch) {
      maxLength = parseInt(lenMatch[1], 10);
    }

    return {
      name: colName,
      data_type: dataType,
      is_nullable: isNullable,
      default_value: defaultValue,
      max_length: maxLength,
      is_primary_key: false,
      is_foreign_key: false,
    };
  }

  /**
   * Extract column list inside parentheses
   */
  private static _extractColumnList(line: string): string[] {
    const match = line.match(/\(([^)]+)\)/);
    if (!match) return [];
    
    return match[1]
      .split(",")
      .map(c => c.trim().replace(/[`"']/g, ""))
      .filter(c => c.length > 0);
  }

  /**
   * Parse table-level FOREIGN KEY constraint
   */
  private static _parseForeignKey(line: string): ForeignKeyMetadata | null {
    // FOREIGN KEY (col) REFERENCES table(ref_col)
    const pattern = /FOREIGN\s+KEY\s*\(([^)]+)\)\s*REFERENCES\s+(?:[\w`"]+\.)?[`"']?([\w]+)[`"']?\s*\(([^)]+)\)(?:\s+ON\s+DELETE\s+(\w+(?:\s+\w+)?))?(?:\s+ON\s+UPDATE\s+(\w+(?:\s+\w+)?))?/i;
    const match = line.match(pattern);
    if (!match) return null;

    const col = match[1].trim().replace(/[`"']/g, "");
    const refTable = match[2].trim();
    const refCol = match[3].trim().replace(/[`"']/g, "");
    const onDelete = match[4] ? match[4].trim() : undefined;
    const onUpdate = match[5] ? match[5].trim() : undefined;

    return {
      column: col,
      references_table: refTable,
      references_column: refCol,
      on_delete: onDelete,
      on_update: onUpdate,
    };
  }

  /**
   * Parse inline REFERENCES FK in column definition
   */
  private static _parseInlineFk(colName: string, line: string): ForeignKeyMetadata | null {
    const pattern = /REFERENCES\s+(?:[\w`"]+\.)?[`"']?([\w]+)[`"']?\s*\(([^)]+)\)(?:\s+ON\s+DELETE\s+(\w+(?:\s+\w+)?))?(?:\s+ON\s+UPDATE\s+(\w+(?:\s+\w+)?))?/i;
    const match = line.match(pattern);
    if (!match) return null;

    const refTable = match[1].trim();
    const refCol = match[2].trim().replace(/[`"']/g, "");
    const onDelete = match[3] ? match[3].trim() : undefined;
    const onUpdate = match[4] ? match[4].trim() : undefined;

    return {
      column: colName,
      references_table: refTable,
      references_column: refCol,
      on_delete: onDelete,
      on_update: onUpdate,
    };
  }

  /**
   * Validate if SQL contains a CREATE TABLE statement
   */
  public static validateSql(sql: string): { valid: boolean; table_count: number; message: string } {
    const cleaned = this._removeComments(sql);
    const tables = this.parse(cleaned);

    if (tables.length === 0) {
      return {
        valid: false,
        table_count: 0,
        message: "Tidak ditemukan statement CREATE TABLE yang valid.",
      };
    }

    return {
      valid: true,
      table_count: tables.length,
      message: `Ditemukan ${tables.length} tabel: ${tables.map(t => t.name).join(", ")}`,
    };
  }
}
