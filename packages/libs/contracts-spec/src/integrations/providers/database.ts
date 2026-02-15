export type DatabaseStatementParam =
  | string
  | number
  | boolean
  | bigint
  | Date
  | Uint8Array
  | null
  | Record<string, unknown>
  | readonly unknown[];

export type DatabaseRow = Record<string, unknown>;

export interface DatabaseQueryResult<TRow extends DatabaseRow = DatabaseRow> {
  rows: TRow[];
  rowCount: number;
}

export interface DatabaseProvider {
  query<TRow extends DatabaseRow = DatabaseRow>(
    statement: string,
    params?: readonly DatabaseStatementParam[]
  ): Promise<DatabaseQueryResult<TRow>>;
  execute(
    statement: string,
    params?: readonly DatabaseStatementParam[]
  ): Promise<void>;
  transaction<T>(run: (database: DatabaseProvider) => Promise<T>): Promise<T>;
  close(): Promise<void>;
}
