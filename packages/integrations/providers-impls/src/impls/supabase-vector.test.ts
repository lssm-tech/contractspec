import { describe, expect, it, vi } from 'bun:test';

import type { DatabaseProvider } from '../database';
import { SupabaseVectorProvider } from './supabase-vector';

describe('SupabaseVectorProvider', () => {
  it('creates table artifacts before first upsert', async () => {
    const mocks = createMockDatabase();
    const provider = new SupabaseVectorProvider({
      database: mocks.database,
      schema: 'public',
      table: 'tenant_vectors',
    });

    await provider.upsert({
      collection: 'knowledge',
      documents: [
        {
          id: 'doc-1',
          vector: [0.1, 0.2, 0.3],
          payload: { tenantId: 'tenant' },
        },
      ],
    });

    const statements = mocks.execute.mock.calls.map(([statement]) =>
      String(statement)
    );
    expect(
      statements.some((statement) =>
        statement.includes(
          'CREATE TABLE IF NOT EXISTS "public"."tenant_vectors"'
        )
      )
    ).toBe(true);
    expect(
      statements.some((statement) =>
        statement.includes('INSERT INTO "public"."tenant_vectors"')
      )
    ).toBe(true);
  });

  it('maps search results with cosine score', async () => {
    const mocks = createMockDatabase();
    mocks.query.mockResolvedValueOnce({
      rows: [
        {
          id: 'doc-1',
          payload: { tenantId: 'tenant' },
          namespace: 'default',
          distance: 0.01,
        },
      ],
      rowCount: 1,
    });

    const provider = new SupabaseVectorProvider({
      database: mocks.database,
      schema: 'public',
      table: 'tenant_vectors',
      createTableIfMissing: false,
    });

    const results = await provider.search({
      collection: 'knowledge',
      vector: [0.1, 0.2, 0.3],
      topK: 3,
      namespace: 'default',
    });

    expect(mocks.query).toHaveBeenCalledTimes(1);
    expect(results).toEqual([
      {
        id: 'doc-1',
        score: 0.99,
        payload: { tenantId: 'tenant' },
        namespace: 'default',
      },
    ]);
  });

  it('applies score threshold after mapping', async () => {
    const mocks = createMockDatabase();
    mocks.query.mockResolvedValueOnce({
      rows: [
        {
          id: 'doc-1',
          payload: null,
          namespace: null,
          distance: 0.2,
        },
      ],
      rowCount: 1,
    });

    const provider = new SupabaseVectorProvider({
      database: mocks.database,
      createTableIfMissing: false,
    });

    const results = await provider.search({
      collection: 'knowledge',
      vector: [0.1, 0.2, 0.3],
      topK: 5,
      scoreThreshold: 0.9,
    });

    expect(results).toEqual([]);
  });

  it('deletes vectors by collection, ids, and optional namespace', async () => {
    const mocks = createMockDatabase();
    const provider = new SupabaseVectorProvider({
      database: mocks.database,
      schema: 'public',
      table: 'tenant_vectors',
      createTableIfMissing: false,
    });

    await provider.delete({
      collection: 'knowledge',
      ids: ['doc-1', 'doc-2'],
      namespace: 'default',
    });

    expect(mocks.execute).toHaveBeenCalledWith(
      expect.stringContaining('DELETE FROM "public"."tenant_vectors"'),
      ['knowledge', ['doc-1', 'doc-2'], 'default']
    );
  });
});

function createMockDatabase() {
  const query = vi.fn(async () => ({ rows: [], rowCount: 0 }));
  const execute = vi.fn(async () => undefined);
  const close = vi.fn(async () => undefined);

  const database = {
    query: query as DatabaseProvider['query'],
    execute: execute as DatabaseProvider['execute'],
    transaction: (async <T>(run: (db: DatabaseProvider) => Promise<T>) =>
      run(database as DatabaseProvider)) as DatabaseProvider['transaction'],
    close,
  } satisfies DatabaseProvider;

  return {
    database,
    query,
    execute,
    close,
  };
}
