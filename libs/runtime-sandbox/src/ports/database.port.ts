import type {
  DatabaseInitOptions,
  DbRow,
  DbValue,
  Migration,
  QueryResult,
  TransactionContext,
} from '../types/database.types';

/**
 * Database port interface for sandbox runtime.
 *
 * This interface abstracts the database layer, allowing:
 * - PGLite adapter for browser sandbox
 * - Prisma/Drizzle adapter for production
 * - Mock adapter for testing
 *
 * All implementations must be lazy-loadable to avoid bundle bloat.
 */
export interface DatabasePort {
  /**
   * Initialize the database connection and run migrations.
   */
  init(options?: DatabaseInitOptions): Promise<void>;

  /**
   * Close the database connection and release resources.
   */
  close(): Promise<void>;

  /**
   * Check if the database is initialized.
   */
  isInitialized(): boolean;

  /**
   * Execute a SELECT query and return rows.
   *
   * @param sql - SQL query string with $1, $2, etc. placeholders
   * @param params - Query parameters
   * @returns Query result with typed rows
   */
  query<T = DbRow>(sql: string, params?: DbValue[]): Promise<QueryResult<T>>;

  /**
   * Execute an INSERT/UPDATE/DELETE statement.
   *
   * @param sql - SQL statement with $1, $2, etc. placeholders
   * @param params - Statement parameters
   */
  execute(sql: string, params?: DbValue[]): Promise<void>;

  /**
   * Run a callback within a database transaction.
   * Automatically commits on success, rolls back on error.
   *
   * @param callback - Function to execute within transaction
   * @returns Result of the callback
   */
  transaction<T>(callback: (ctx: TransactionContext) => Promise<T>): Promise<T>;

  /**
   * Run schema migrations.
   *
   * @param migrations - Array of migrations to apply
   */
  migrate(migrations: Migration[]): Promise<void>;

  /**
   * Export the current database state as a binary blob.
   * Useful for backup/restore in browser context.
   */
  export(): Promise<Uint8Array>;
}

/**
 * Factory function type for creating database adapters.
 * Used for lazy-loading adapters.
 */
export type DatabaseAdapterFactory = (
  options?: DatabaseInitOptions
) => Promise<DatabasePort>;
