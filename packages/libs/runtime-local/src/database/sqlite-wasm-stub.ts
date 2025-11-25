/**
 * Browser-only stub for SQLite WASM
 * This file is used during SSR builds to avoid Node.js fs dependencies
 */

export type LocalDbValue =
  | string
  | number
  | boolean
  | null
  | Uint8Array
  | undefined;

export type LocalRow = Record<string, LocalDbValue>;

export class LocalSQLiteDatabase {
  constructor() {
    throw new Error(
      'LocalSQLiteDatabase can only be instantiated in the browser'
    );
  }

  async exec<T extends LocalRow = LocalRow>(
    _sql: string,
    _params: LocalDbValue[] = []
  ): Promise<T[]> {
    throw new Error('LocalSQLiteDatabase can only be used in the browser');
  }

  async run(_sql: string, _params: LocalDbValue[] = []): Promise<void> {
    throw new Error('LocalSQLiteDatabase can only be used in the browser');
  }

  async transaction<T>(
    _callback: (db: LocalSQLiteDatabase) => Promise<T>
  ): Promise<T> {
    throw new Error('LocalSQLiteDatabase can only be used in the browser');
  }

  async close(): Promise<void> {
    throw new Error('LocalSQLiteDatabase can only be used in the browser');
  }

  export(): Uint8Array {
    throw new Error('LocalSQLiteDatabase can only be used in the browser');
  }

  static async load(_data?: Uint8Array | null): Promise<LocalSQLiteDatabase> {
    throw new Error('LocalSQLiteDatabase can only be used in the browser');
  }
}







