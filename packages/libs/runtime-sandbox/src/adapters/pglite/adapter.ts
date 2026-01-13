import { PGlite } from '@electric-sql/pglite';

import type { DatabasePort } from '../../ports/database.port';
import type {
  DatabaseInitOptions,
  DbRow,
  DbValue,
  Migration,
  QueryResult,
  TransactionContext,
} from '../../types/database.types';

/**
 * PGLite database adapter for browser sandbox runtime.
 *
 * Uses PGLite (PostgreSQL WASM) for in-browser database operations.
 * Supports in-memory or IndexedDB persistence.
 */
export class PGLiteDatabaseAdapter implements DatabasePort {
  private client: PGlite | null = null;
  private initialized = false;

  async init(options?: DatabaseInitOptions): Promise<void> {
    if (this.initialized) return;

    // Create PGLite instance
    // - undefined/empty = in-memory
    // - 'idb://dbname' = IndexedDB persistence
    const dataDir = options?.dataDir;
    this.client = dataDir ? new PGlite(`idb://${dataDir}`) : new PGlite();

    // Wait for PGLite to be ready
    await this.client.waitReady;
    this.initialized = true;
  }

  async close(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.initialized = false;
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  async query<T = DbRow>(
    sql: string,
    params?: DbValue[]
  ): Promise<QueryResult<T>> {
    const client = this.getClient();
    const normalizedParams = this.normalizeParams(params);
    const result = await client.query<T>(sql, normalizedParams);
    return {
      rows: result.rows,
      rowCount: result.rows.length,
    };
  }

  async execute(sql: string, params?: DbValue[]): Promise<void> {
    const client = this.getClient();
    const normalizedParams = this.normalizeParams(params);
    await client.query(sql, normalizedParams);
  }

  async transaction<T>(
    callback: (ctx: TransactionContext) => Promise<T>
  ): Promise<T> {
    const client = this.getClient();

    await client.query('BEGIN');
    try {
      const ctx: TransactionContext = {
        execute: async (sql: string, params?: DbValue[]) => {
          const normalizedParams = this.normalizeParams(params);
          await client.query(sql, normalizedParams);
        },
      };
      const result = await callback(ctx);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }
  }

  async migrate(migrations: Migration[]): Promise<void> {
    const client = this.getClient();

    // Create migrations tracking table if not exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS _sandbox_migrations (
        id TEXT PRIMARY KEY,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Apply each migration if not already applied
    for (const migration of migrations) {
      const existing = await client.query<{ id: string }>(
        'SELECT id FROM _sandbox_migrations WHERE id = $1',
        [migration.id]
      );

      if (existing.rows.length === 0) {
        await client.query(migration.sql);
        await client.query('INSERT INTO _sandbox_migrations (id) VALUES ($1)', [
          migration.id,
        ]);
      }
    }
  }

  async export(): Promise<Uint8Array> {
    this.getClient(); // Ensure initialized
    // PGLite doesn't support export the same way sql.js does
    // For now, return empty array - can be implemented with pg_dump style later
    return new Uint8Array();
  }

  /**
   * Get the initialized PGLite client.
   * Throws if not initialized.
   */
  private getClient(): PGlite {
    if (!this.client || !this.initialized) {
      throw new Error(
        'PGLiteDatabaseAdapter not initialized. Call init() first.'
      );
    }
    return this.client;
  }

  private normalizeParams(params?: DbValue[]): unknown[] {
    if (!params) return [];
    return params.map((value) => {
      if (typeof value === 'boolean') {
        return value;
      }
      if (value instanceof Date) {
        return value.toISOString();
      }
      if (value === undefined) {
        return null;
      }
      return value;
    });
  }
}
