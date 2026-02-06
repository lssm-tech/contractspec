import type {
  DatabaseProvider,
  DatabaseRow,
  DatabaseStatementParam,
} from '../database';
import type {
  VectorDeleteRequest,
  VectorSearchQuery,
  VectorSearchResult,
  VectorStoreProvider,
  VectorUpsertRequest,
} from '../vector-store';
import {
  SupabasePostgresProvider,
  type SupabasePostgresSslMode,
} from './supabase-psql';
export type SupabaseVectorDistanceMetric = 'cosine' | 'l2' | 'inner_product';

export interface SupabaseVectorProviderOptions {
  connectionString?: string;
  database?: DatabaseProvider;
  schema?: string;
  table?: string;
  createTableIfMissing?: boolean;
  distanceMetric?: SupabaseVectorDistanceMetric;
  maxConnections?: number;
  sslMode?: SupabasePostgresSslMode;
}
interface SupabaseVectorSearchRow extends DatabaseRow {
  id: string;
  payload: unknown;
  namespace: string | null;
  distance: number | string;
}
export class SupabaseVectorProvider implements VectorStoreProvider {
  private readonly database: DatabaseProvider;
  private readonly createTableIfMissing: boolean;
  private readonly distanceMetric: SupabaseVectorDistanceMetric;
  private readonly quotedSchema: string;
  private readonly qualifiedTable: string;
  private readonly collectionIndex: string;
  private readonly namespaceIndex: string;
  private ensureTablePromise?: Promise<void>;

  constructor(options: SupabaseVectorProviderOptions) {
    this.database =
      options.database ??
      new SupabasePostgresProvider({
        connectionString: options.connectionString,
        maxConnections: options.maxConnections,
        sslMode: options.sslMode,
      });
    this.createTableIfMissing = options.createTableIfMissing ?? true;
    this.distanceMetric = options.distanceMetric ?? 'cosine';
    const schema = sanitizeIdentifier(options.schema ?? 'public', 'schema');
    const table = sanitizeIdentifier(
      options.table ?? 'contractspec_vectors',
      'table'
    );
    this.quotedSchema = quoteIdentifier(schema);
    this.qualifiedTable = `${this.quotedSchema}.${quoteIdentifier(table)}`;
    this.collectionIndex = quoteIdentifier(`${table}_collection_idx`);
    this.namespaceIndex = quoteIdentifier(`${table}_namespace_idx`);
  }

  async upsert(request: VectorUpsertRequest): Promise<void> {
    if (request.documents.length === 0) {
      return;
    }
    if (this.createTableIfMissing) {
      await this.ensureTable();
    }
    for (const document of request.documents) {
      await this.database.execute(
        `INSERT INTO ${this.qualifiedTable}
          (collection, id, embedding, payload, namespace, expires_at, updated_at)
         VALUES ($1, $2, $3::vector, $4::jsonb, $5, $6, now())
         ON CONFLICT (collection, id)
         DO UPDATE SET
           embedding = EXCLUDED.embedding,
           payload = EXCLUDED.payload,
           namespace = EXCLUDED.namespace,
           expires_at = EXCLUDED.expires_at,
           updated_at = now();`,
        [
          request.collection,
          document.id,
          toVectorLiteral(document.vector),
          document.payload ? JSON.stringify(document.payload) : null,
          document.namespace ?? null,
          document.expiresAt ?? null,
        ]
      );
    }
  }
  async search(query: VectorSearchQuery): Promise<VectorSearchResult[]> {
    const operator = this.distanceOperator;
    const results = await this.database.query<SupabaseVectorSearchRow>(
      `SELECT
         id,
         payload,
         namespace,
         (embedding ${operator} $3::vector) AS distance
       FROM ${this.qualifiedTable}
       WHERE collection = $1
         AND ($2::text IS NULL OR namespace = $2)
         AND (expires_at IS NULL OR expires_at > now())
         AND ($4::jsonb IS NULL OR payload @> $4::jsonb)
       ORDER BY embedding ${operator} $3::vector
       LIMIT $5;`,
      [
        query.collection,
        query.namespace ?? null,
        toVectorLiteral(query.vector),
        query.filter ? JSON.stringify(query.filter) : null,
        query.topK,
      ]
    );
    const mapped = results.rows.map((row) => {
      const distance = Number(row.distance);
      return {
        id: row.id,
        score: distanceToScore(distance, this.distanceMetric),
        payload: isRecord(row.payload)
          ? (row.payload as Record<string, unknown>)
          : undefined,
        namespace: row.namespace ?? undefined,
      } satisfies VectorSearchResult;
    });
    const scoreThreshold = query.scoreThreshold;
    if (scoreThreshold == null) {
      return mapped;
    }
    return mapped.filter((result) => result.score >= scoreThreshold);
  }
  async delete(request: VectorDeleteRequest): Promise<void> {
    if (request.ids.length === 0) {
      return;
    }
    const params: DatabaseStatementParam[] = [
      request.collection,
      request.ids,
      request.namespace ?? null,
    ];
    await this.database.execute(
      `DELETE FROM ${this.qualifiedTable}
       WHERE collection = $1
         AND id = ANY($2::text[])
         AND ($3::text IS NULL OR namespace = $3);`,
      params
    );
  }
  private async ensureTable(): Promise<void> {
    if (!this.ensureTablePromise) {
      this.ensureTablePromise = this.createTable();
    }
    await this.ensureTablePromise;
  }
  private async createTable(): Promise<void> {
    await this.database.execute('CREATE EXTENSION IF NOT EXISTS vector;');
    await this.database.execute(
      `CREATE SCHEMA IF NOT EXISTS ${this.quotedSchema};`
    );
    await this.database.execute(
      `CREATE TABLE IF NOT EXISTS ${this.qualifiedTable} (
         collection text NOT NULL,
         id text NOT NULL,
         embedding vector NOT NULL,
         payload jsonb,
         namespace text,
         expires_at timestamptz,
         created_at timestamptz NOT NULL DEFAULT now(),
         updated_at timestamptz NOT NULL DEFAULT now(),
         PRIMARY KEY (collection, id)
       );`
    );
    await this.database.execute(
      `CREATE INDEX IF NOT EXISTS ${this.collectionIndex}
         ON ${this.qualifiedTable} (collection);`
    );
    await this.database.execute(
      `CREATE INDEX IF NOT EXISTS ${this.namespaceIndex}
         ON ${this.qualifiedTable} (namespace);`
    );
  }
  private get distanceOperator(): '<=>' | '<->' | '<#>' {
    switch (this.distanceMetric) {
      case 'l2':
        return '<->';
      case 'inner_product':
        return '<#>';
      case 'cosine':
      default:
        return '<=>';
    }
  }
}

function sanitizeIdentifier(value: string, label: string): string {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(value)) {
    throw new Error(`SupabaseVectorProvider ${label} "${value}" is invalid.`);
  }
  return value;
}

function quoteIdentifier(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}

function toVectorLiteral(vector: number[]): string {
  if (vector.length === 0) {
    throw new Error('Supabase vectors must contain at least one dimension.');
  }
  for (const value of vector) {
    if (!Number.isFinite(value)) {
      throw new Error(
        `Supabase vectors must be finite numbers. Found "${value}".`
      );
    }
  }
  return `[${vector.join(',')}]`;
}
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function distanceToScore(
  distance: number,
  metric: SupabaseVectorDistanceMetric
): number {
  switch (metric) {
    case 'inner_product':
      return -distance;
    case 'l2':
      return 1 / (1 + distance);
    case 'cosine':
    default:
      return 1 - distance;
  }
}
