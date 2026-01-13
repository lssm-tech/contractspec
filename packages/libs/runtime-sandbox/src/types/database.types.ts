/**
 * Database value types supported by the sandbox runtime
 */
export type DbValue =
  | string
  | number
  | boolean
  | null
  | Uint8Array
  | Date
  | undefined;

/**
 * Generic row type for database results
 */
export type DbRow = Record<string, DbValue>;

/**
 * Options for initializing a database adapter
 */
export interface DatabaseInitOptions {
  /**
   * Data directory for persistence (optional).
   * - Browser: uses IndexedDB when specified
   * - Node/Bun: uses file system when specified
   * - If omitted, uses in-memory storage
   */
  dataDir?: string;
}

/**
 * Query builder result type
 */
export interface QueryResult<T = DbRow> {
  rows: T[];
  rowCount: number;
}

/**
 * Transaction context for atomic operations
 */
export interface TransactionContext {
  /**
   * Execute raw SQL within the transaction
   */
  execute(sql: string, params?: DbValue[]): Promise<void>;
}

/**
 * Migration definition
 */
export interface Migration {
  id: string;
  sql: string;
}
