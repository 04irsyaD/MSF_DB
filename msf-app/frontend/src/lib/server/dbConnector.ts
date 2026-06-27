import { Client } from "pg";
import mysql from "mysql2/promise";
import { DBConnection, DBTestConnectionResponse, DBMetadataResponse, TableMetadata, ColumnMetadata, ForeignKeyMetadata, IndexMetadata } from "../types";

export class DBConnector {
  /**
   * Test database connection.
   */
  public static async testConnection(connection: DBConnection): Promise<DBTestConnectionResponse> {
    const engine = connection.engine;

    if (engine === "postgresql") {
      let client: Client | null = null;
      try {
        const config = this._getPgConfig(connection);
        client = new Client(config);
        await client.connect();

        // Query version and tables count
        const versionRes = await client.query("SELECT version()");
        const schema = connection.schema_name || "public";
        const tablesRes = await client.query(
          "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = $1 AND table_type = 'BASE TABLE'",
          [schema]
        );

        const tablesCount = parseInt(tablesRes.rows[0].count, 10);
        return {
          success: true,
          message: "Koneksi ke PostgreSQL berhasil terhubung.",
          engine: "postgresql",
          server_version: versionRes.rows[0].version,
          tables_count: tablesCount,
        };
      } catch (err: any) {
        return {
          success: false,
          message: `Koneksi PostgreSQL gagal: ${this._cleanError(err.message || err)}`,
          engine: "postgresql",
        };
      } finally {
        if (client) await client.end().catch(() => {});
      }
    }

    if (engine === "mysql") {
      let conn: mysql.Connection | null = null;
      try {
        const config = this._getMysqlConfig(connection);
        conn = await mysql.createConnection(config);

        // Query version and tables count
        const [versionRows]: any = await conn.query("SELECT VERSION() as version");
        const [tablesRows]: any = await conn.query(
          "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = DATABASE() AND table_type = 'BASE TABLE'"
        );

        const serverVersion = versionRows[0]?.version || "Unknown";
        const tablesCount = parseInt(tablesRows[0]?.count || "0", 10);

        return {
          success: true,
          message: "Koneksi ke MySQL berhasil terhubung.",
          engine: "mysql",
          server_version: serverVersion,
          tables_count: tablesCount,
        };
      } catch (err: any) {
        return {
          success: false,
          message: `Koneksi MySQL gagal: ${this._cleanError(err.message || err)}`,
          engine: "mysql",
        };
      } finally {
        if (conn) await conn.end().catch(() => {});
      }
    }

    return {
      success: false,
      message: `Engine database '${engine}' tidak didukung di mode serverless. Silakan gunakan DDL SQL Paste.`,
      engine,
    };
  }

  /**
   * Fetch database metadata.
   */
  public static async fetchMetadata(
    connection: DBConnection,
    options: { schemaFilter?: string; includeViews?: boolean; includeFunctions?: boolean } = {}
  ): Promise<DBMetadataResponse> {
    const engine = connection.engine;

    if (engine === "postgresql") {
      let client: Client | null = null;
      try {
        const config = this._getPgConfig(connection);
        client = new Client(config);
        await client.connect();

        const schema = options.schemaFilter || connection.schema_name || "public";
        const tables = await this._inspectPostgres(client, schema);

        return {
          engine: "postgresql",
          database: connection.database || "postgres",
          schema,
          tables,
        };
      } catch (err: any) {
        throw new Error(`Gagal mengambil metadata PostgreSQL: ${this._cleanError(err.message || err)}`);
      } finally {
        if (client) await client.end().catch(() => {});
      }
    }

    if (engine === "mysql") {
      let conn: mysql.Connection | null = null;
      try {
        const config = this._getMysqlConfig(connection);
        conn = await mysql.createConnection(config);

        const tables = await this._inspectMysql(conn);

        return {
          engine: "mysql",
          database: connection.database || "mysql",
          schema: connection.database || "default",
          tables,
        };
      } catch (err: any) {
        throw new Error(`Gagal mengambil metadata MySQL: ${this._cleanError(err.message || err)}`);
      } finally {
        if (conn) await conn.end().catch(() => {});
      }
    }

    throw new Error(`Engine '${engine}' tidak didukung.`);
  }

  /**
   * Inspect PostgreSQL schema catalog
   */
  private static async _inspectPostgres(client: Client, schema: string): Promise<TableMetadata[]> {
    // 1. Get all base tables
    const tablesRes = await client.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = $1 AND table_type = 'BASE TABLE' ORDER BY table_name",
      [schema]
    );

    const tables: TableMetadata[] = [];

    for (const row of tablesRes.rows) {
      const tableName = row.table_name;

      // 2. Fetch Columns
      const columnsRes = await client.query(
        `SELECT column_name, data_type, is_nullable, column_default, character_maximum_length 
         FROM information_schema.columns 
         WHERE table_schema = $1 AND table_name = $2 
         ORDER BY ordinal_position`,
        [schema, tableName]
      );

      // 3. Fetch Primary Keys
      const pkRes = await client.query(
        `SELECT kcu.column_name
         FROM information_schema.table_constraints tc
         JOIN information_schema.key_column_usage kcu
           ON tc.constraint_name = kcu.constraint_name
           AND tc.table_schema = kcu.table_schema
         WHERE tc.constraint_type = 'PRIMARY KEY'
           AND tc.table_schema = $1
           AND tc.table_name = $2`,
        [schema, tableName]
      );
      const pks = pkRes.rows.map((r: any) => r.column_name);

      // 4. Fetch Foreign Keys
      const fkRes = await client.query(
        `SELECT
             kcu.column_name AS column,
             ccu.table_name AS references_table,
             ccu.column_name AS references_column,
             rc.delete_rule AS on_delete,
             rc.update_rule AS on_update
         FROM information_schema.table_constraints tc
         JOIN information_schema.key_column_usage kcu
           ON tc.constraint_name = kcu.constraint_name
           AND tc.table_schema = kcu.table_schema
         JOIN information_schema.referential_constraints rc
           ON tc.constraint_name = rc.constraint_name
         JOIN information_schema.constraint_column_usage ccu
           ON rc.unique_constraint_name = ccu.constraint_name
           AND rc.unique_constraint_schema = ccu.table_schema
         WHERE tc.constraint_type = 'FOREIGN KEY'
           AND tc.table_schema = $1
           AND tc.table_name = $2`,
        [schema, tableName]
      );
      const fks: ForeignKeyMetadata[] = fkRes.rows.map((r: any) => ({
        column: r.column,
        references_table: r.references_table,
        references_column: r.references_column,
        on_delete: r.on_delete || undefined,
        on_update: r.on_update || undefined,
      }));

      // 5. Fetch Indexes
      const idxRes = await client.query(
        `SELECT
             ix.relname AS index_name,
             a.attname AS column_name,
             i.indisunique AS is_unique
         FROM pg_class t
         JOIN pg_index i ON t.oid = i.indrelid
         JOIN pg_class ix ON ix.oid = i.indexrelid
         JOIN pg_attribute a ON t.oid = a.attrelid AND a.attnum = ANY(i.indkey)
         JOIN pg_namespace n ON n.oid = t.relnamespace
         WHERE t.relkind = 'r'
           AND n.nspname = $1
           AND t.relname = $2`,
        [schema, tableName]
      );

      // Group index columns by index name
      const indexMap = new Map<string, { columns: string[]; isUnique: boolean }>();
      for (const idxRow of idxRes.rows) {
        const idxName = idxRow.index_name;
        const colName = idxRow.column_name;
        const isUnique = idxRow.is_unique;

        if (!indexMap.has(idxName)) {
          indexMap.set(idxName, { columns: [], isUnique });
        }
        indexMap.get(idxName)!.columns.push(colName);
      }

      const indexes: IndexMetadata[] = Array.from(indexMap.entries()).map(([name, val]) => ({
        name,
        columns: val.columns,
        is_unique: val.isUnique,
      }));

      // Compile columns metadata
      const columns: ColumnMetadata[] = columnsRes.rows.map((colRow: any) => {
        const colName = colRow.column_name;
        const isPk = pks.includes(colName);
        const isFk = fks.some(fk => fk.column === colName);

        return {
          name: colName,
          data_type: colRow.data_type.toUpperCase(),
          is_nullable: colRow.is_nullable === "YES",
          default_value: colRow.column_default || undefined,
          max_length: colRow.character_maximum_length || undefined,
          is_primary_key: isPk,
          is_foreign_key: isFk,
        };
      });

      // Get row count estimate
      const countRes = await client.query(
        `SELECT reltuples::bigint AS count FROM pg_class c
         JOIN pg_namespace n ON n.oid = c.relnamespace
         WHERE n.nspname = $1 AND c.relname = $2`,
        [schema, tableName]
      );
      const rowCount = countRes.rows[0] ? parseInt(countRes.rows[0].count, 10) : undefined;

      tables.push({
        name: tableName,
        schema,
        columns,
        primary_key: pks,
        foreign_keys: fks,
        indexes,
        row_count: rowCount !== undefined && rowCount >= 0 ? rowCount : undefined,
      });
    }

    return tables;
  }

  /**
   * Inspect MySQL schema catalog
   */
  private static async _inspectMysql(connection: mysql.Connection): Promise<TableMetadata[]> {
    // 1. Get all base tables
    const [tablesRows]: any = await connection.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE() AND table_type = 'BASE TABLE' ORDER BY table_name"
    );

    const tables: TableMetadata[] = [];

    for (const row of tablesRows) {
      const tableName = row.table_name || row.TABLE_NAME;

      // 2. Fetch Columns
      const [columnsRows]: any = await connection.query(
        `SELECT column_name, data_type, is_nullable, column_default, character_maximum_length, column_key
         FROM information_schema.columns 
         WHERE table_schema = DATABASE() AND table_name = ? 
         ORDER BY ordinal_position`,
        [tableName]
      );

      // 3. Fetch Foreign Keys
      const [fkRows]: any = await connection.query(
        `SELECT
             kcu.column_name AS \`column\`,
             kcu.referenced_table_name AS references_table,
             kcu.referenced_column_name AS references_column,
             rc.delete_rule AS on_delete,
             rc.update_rule AS on_update
         FROM information_schema.key_column_usage kcu
         JOIN information_schema.referential_constraints rc
           ON kcu.constraint_name = rc.constraint_name
           AND kcu.table_schema = rc.constraint_schema
         WHERE kcu.table_schema = DATABASE()
           AND kcu.table_name = ?
           AND kcu.referenced_table_name IS NOT NULL`,
        [tableName]
      );
      const fks: ForeignKeyMetadata[] = fkRows.map((r: any) => ({
        column: r.column || r.COLUMN,
        references_table: r.references_table || r.REFERENCES_TABLE,
        references_column: r.references_column || r.REFERENCES_COLUMN,
        on_delete: r.on_delete || undefined,
        on_update: r.on_update || undefined,
      }));

      // 4. Fetch Indexes
      const [idxRows]: any = await connection.query(
        `SELECT
             index_name,
             column_name,
             non_unique = 0 AS is_unique
         FROM information_schema.statistics
         WHERE table_schema = DATABASE()
           AND table_name = ?`,
        [tableName]
      );

      // Group indexes
      const indexMap = new Map<string, { columns: string[]; isUnique: boolean }>();
      for (const idxRow of idxRows) {
        const idxName = idxRow.index_name || idxRow.INDEX_NAME;
        const colName = idxRow.column_name || idxRow.COLUMN_NAME;
        const isUnique = parseInt(idxRow.is_unique || idxRow.IS_UNIQUE, 10) === 1;

        if (idxName === "PRIMARY") continue; // Handled separately via column key

        if (!indexMap.has(idxName)) {
          indexMap.set(idxName, { columns: [], isUnique });
        }
        indexMap.get(idxName)!.columns.push(colName);
      }

      const indexes: IndexMetadata[] = Array.from(indexMap.entries()).map(([name, val]) => ({
        name,
        columns: val.columns,
        is_unique: val.isUnique,
      }));

      // Compile columns & find Primary Keys
      const pks: string[] = [];
      const columns: ColumnMetadata[] = columnsRows.map((colRow: any) => {
        const colName = colRow.column_name || colRow.COLUMN_NAME;
        const colKey = colRow.column_key || colRow.COLUMN_KEY;
        const isPk = colKey === "PRI";
        const isFk = fks.some(fk => fk.column === colName);

        if (isPk) {
          pks.push(colName);
        }

        return {
          name: colName,
          data_type: (colRow.data_type || colRow.DATA_TYPE).toUpperCase(),
          is_nullable: (colRow.is_nullable || colRow.IS_NULLABLE) === "YES",
          default_value: colRow.column_default || colRow.COLUMN_DEFAULT || undefined,
          max_length: colRow.character_maximum_length || colRow.CHARACTER_MAXIMUM_LENGTH || undefined,
          is_primary_key: isPk,
          is_foreign_key: isFk,
        };
      });

      // Get row count estimate
      const [countRows]: any = await connection.query(
        "SELECT TABLE_ROWS as count FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = ?",
        [tableName]
      );
      const rowCount = countRows[0] ? parseInt(countRows[0].count, 10) : undefined;

      tables.push({
        name: tableName,
        schema: "default",
        columns,
        primary_key: pks,
        foreign_keys: fks,
        indexes,
        row_count: rowCount !== undefined && rowCount >= 0 ? rowCount : undefined,
      });
    }

    return tables;
  }

  /**
   * Get PG Connection configuration
   */
  private static _getPgConfig(connection: DBConnection): any {
    if (connection.connection_string) {
      return { connectionString: connection.connection_string };
    }
    return {
      host: connection.host || "localhost",
      port: connection.port || 5432,
      database: connection.database || "postgres",
      user: connection.username || "postgres",
      password: connection.password || "",
      ssl: connection.connection_string?.includes("sslmode=require") ? { rejectUnauthorized: false } : false,
    };
  }

  /**
   * Get MySQL Connection configuration
   */
  private static _getMysqlConfig(connection: DBConnection): any {
    if (connection.connection_string) {
      return connection.connection_string; // Uri connection string
    }
    return {
      host: connection.host || "localhost",
      port: connection.port || 3306,
      database: connection.database || "",
      user: connection.username || "root",
      password: connection.password || "",
    };
  }

  /**
   * Clean passwords from error messages
   */
  private static _cleanError(errStr: string): string {
    // Strips password parameters from standard URLs or connection strings
    return errStr.replace(/(:\/\/[\w_\-]+:)([^@]+)(@)/g, "$1******$3");
  }
}
