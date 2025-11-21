import type { StateStore } from '../state';

export interface FileStateStoreOptions {
  /** Absolute or relative path to the persistence file. */
  filePath: string;
}

/**
 * Placeholder for a file-backed state store adapter.
 * Implementations should manage locking/concurrency and JSON serialization.
 */
export function createFileStateStore(
  _options: FileStateStoreOptions
): StateStore {
  throw new Error(
    'File-backed state store adapter not implemented. Provide a custom adapter that satisfies StateStore.'
  );
}
