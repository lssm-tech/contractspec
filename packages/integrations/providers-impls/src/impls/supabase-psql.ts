import { Buffer } from 'node:buffer';

import { sql as drizzleSql, type SQL } from 'drizzle-orm';
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres, { type Sql } from 'postgres';

import type {
  DatabaseProvider,
  DatabaseQueryResult,
  DatabaseRow,
  DatabaseStatementParam,
} from '../database';

export type SupabasePostgresSslMode = 'require' | 'allow' | 'prefer';

export interface SupabasePostgresProviderOptions {
  connectionString?: string;
  maxConnections?: number;
  sslMode?: SupabasePostgresSslMode;
  client?: Sql;
  db?: PostgresJsDatabase<Record<string, never>>;
  createDrizzle?: (client: Sql) => PostgresJsDatabase<Record<string, never>>;
}

export class SupabasePostgresProvider implements DatabaseProvider {
  private readonly client: Sql;
  private readonly db: PostgresJsDatabase<Record<string, never>>;
  private readonly ownsClient: boolean;
  private readonly createDrizzle: (
    client: Sql
  ) => PostgresJsDatabase<Record<string, never>>;

  constructor(options: SupabasePostgresProviderOptions = {}) {
    this.createDrizzle = options.createDrizzle ?? ((client) => drizzle(client));

    if (options.db) {
      if (!options.client) {
        throw new Error(
          'SupabasePostgresProvider requires a postgres client when db is provided.'
        );
      }
      this.client = options.client;
      this.db = options.db;
      this.ownsClient = false;
      return;
    }

    if (options.client) {
      this.client = options.client;
      this.ownsClient = false;
    } else {
      if (!options.connectionString) {
        throw new Error(
          'SupabasePostgresProvider requires either a connectionString or a client.'
        );
      }
      this.client = postgres(options.connectionString, {
        max: options.maxConnections,
        prepare: false,
        ssl: resolveSslMode(options.sslMode),
      });
      this.ownsClient = true;
    }

    this.db = this.createDrizzle(this.client);
  }

  async query<TRow extends DatabaseRow = DatabaseRow>(
    statement: string,
    params: readonly DatabaseStatementParam[] = []
  ): Promise<DatabaseQueryResult<TRow>> {
    const query = buildParameterizedSql(statement, params);
    const result = await this.db.execute(query);
    const rows = asRows<TRow>(result);
    return {
      rows,
      rowCount: rows.length,
    };
  }

  async execute(
    statement: string,
    params: readonly DatabaseStatementParam[] = []
  ): Promise<void> {
    const query = buildParameterizedSql(statement, params);
    await this.db.execute(query);
  }

  async transaction<T>(
    run: (database: DatabaseProvider) => Promise<T>
  ): Promise<T> {
    const transactionResult = this.client.begin(async (transactionClient) => {
      // TransactionSql is a strict subset of Sql (omits close/end/listen etc.)
      // but is fully compatible for query and execute operations within a transaction.
      const transactionalProvider = new SupabasePostgresProvider({
        client: transactionClient as unknown as Sql,
        db: this.createDrizzle(transactionClient as unknown as Sql),
        createDrizzle: this.createDrizzle,
      });
      return run(transactionalProvider);
    });
    return transactionResult as unknown as Promise<T>;
  }

  async close(): Promise<void> {
    if (this.ownsClient) {
      await this.client.end({ timeout: 5 });
    }
  }
}

function buildParameterizedSql(
  statement: string,
  params: readonly DatabaseStatementParam[]
): SQL {
  const segments: SQL[] = [];
  const pattern = /\$(\d+)/g;
  let cursor = 0;

  for (const match of statement.matchAll(pattern)) {
    const token = match[0];
    const indexPart = match[1];
    const start = match.index;
    if (indexPart == null || start == null) continue;

    const parameterIndex = Number(indexPart) - 1;
    if (
      !Number.isInteger(parameterIndex) ||
      parameterIndex < 0 ||
      parameterIndex >= params.length
    ) {
      throw new Error(
        `SQL placeholder ${token} is out of bounds for ${params.length} parameter(s).`
      );
    }

    const staticSegment = statement.slice(cursor, start);
    if (staticSegment.length > 0) {
      segments.push(drizzleSql.raw(staticSegment));
    }

    const parameterValue = params[parameterIndex];
    if (parameterValue === undefined) {
      throw new Error(`SQL placeholder ${token} is missing a parameter value.`);
    }

    const normalizedValue = normalizeParam(parameterValue);
    segments.push(drizzleSql`${normalizedValue}`);

    cursor = start + token.length;
  }

  const tailSegment = statement.slice(cursor);
  if (tailSegment.length > 0) {
    segments.push(drizzleSql.raw(tailSegment));
  }

  if (segments.length === 0) {
    return drizzleSql.raw('');
  }

  return drizzleSql.join(segments);
}

function normalizeParam(value: DatabaseStatementParam): unknown {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  if (value instanceof Uint8Array) {
    return Buffer.from(value);
  }
  if (isPlainObject(value)) {
    return JSON.stringify(value);
  }
  return value;
}

function asRows<TRow extends DatabaseRow>(result: unknown): TRow[] {
  if (!Array.isArray(result)) {
    return [];
  }
  return result as TRow[];
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value == null || typeof value !== 'object') {
    return false;
  }
  if (Array.isArray(value)) {
    return false;
  }
  if (value instanceof Date) {
    return false;
  }
  if (value instanceof Uint8Array) {
    return false;
  }
  return true;
}

function resolveSslMode(
  mode?: SupabasePostgresSslMode
): false | 'prefer' | 'require' {
  switch (mode) {
    case 'allow':
      return false;
    case 'prefer':
      return 'prefer';
    case 'require':
    default:
      return 'require';
  }
}
