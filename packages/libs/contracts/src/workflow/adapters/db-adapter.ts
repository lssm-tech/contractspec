import type { StateStore } from '../state';

export interface DatabaseStateStoreOptions {
  /** Placeholder for connection string / client injection. */
  connection?: unknown;
}

/**
 * Placeholder factory to guide future database adapters (PostgreSQL, MongoDB, etc.).
 * Consumers should provide their own implementation that satisfies {@link StateStore}.
 */
export function createDatabaseStateStore(
  _options: DatabaseStateStoreOptions
): StateStore {
  throw new Error(
    'Database state store adapter not implemented. Provide a custom adapter that satisfies StateStore.'
  );
}

