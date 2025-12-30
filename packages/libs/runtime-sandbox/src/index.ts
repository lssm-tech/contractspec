/**
 * @contractspec/lib.runtime-sandbox
 *
 * Sandbox runtime library providing database abstraction for browser environments.
 * Supports lazy-loading of PGLite for bundle optimization.
 */

// Core ports (interfaces)
export { type DatabaseAdapterFactory, type DatabasePort } from './ports';

// Types
export {
  type DatabaseInitOptions,
  type DbRow,
  type DbValue,
  type Migration,
  type QueryResult,
  type TransactionContext,
} from './types';

/**
 * Lazy-load the PGLite database adapter.
 *
 * This function dynamically imports PGLite and Drizzle only when called,
 * avoiding bundle bloat for consumers not using the sandbox runtime.
 *
 * @example
 * ```ts
 * const adapter = await createPGLiteAdapter();
 * await adapter.init();
 * const result = await adapter.query('SELECT * FROM users');
 * ```
 */
export async function createPGLiteAdapter(): Promise<
  import('./ports').DatabasePort
> {
  const { PGLiteDatabaseAdapter } = await import('./adapters/pglite');
  return new PGLiteDatabaseAdapter();
}
