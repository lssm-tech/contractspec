import { describe, expect, it, vi } from 'bun:test';

import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import type { Sql } from 'postgres';
import { SupabasePostgresProvider } from './supabase-psql';

describe('SupabasePostgresProvider', () => {
  it('requires either connectionString or client', () => {
    expect(() => new SupabasePostgresProvider()).toThrowError(
      /connectionString or a client/
    );
  });

  it('runs query and returns rows with rowCount', async () => {
    const execute = vi.fn(async () => [{ id: 'row-1' }]);
    const provider = new SupabasePostgresProvider({
      client: createMockSqlClient(),
      db: createMockDb(execute),
    });

    const result = await provider.query<{ id: string }>(
      'SELECT $1::text AS id',
      ['row-1']
    );

    expect(execute).toHaveBeenCalledTimes(1);
    expect(result.rows).toEqual([{ id: 'row-1' }]);
    expect(result.rowCount).toBe(1);
  });

  it('throws when SQL placeholder index is out of bounds', async () => {
    const provider = new SupabasePostgresProvider({
      client: createMockSqlClient(),
      db: createMockDb(vi.fn(async () => [])),
    });

    await expect(provider.query('SELECT $2::text', ['row-1'])).rejects.toThrow(
      /out of bounds/
    );
  });

  it('runs transactions against transaction-bound drizzle db', async () => {
    const rootExecute = vi.fn(async () => []);
    const txExecute = vi.fn(async () => []);
    const txClient = createMockSqlClient();
    const begin = vi.fn(async (run: (client: Sql) => Promise<string>) =>
      run(txClient)
    );
    const rootClient = createMockSqlClient({ begin });

    const createDrizzle = vi.fn((client: Sql) => {
      if (client === txClient) {
        return createMockDb(txExecute);
      }
      return createMockDb(rootExecute);
    });

    const provider = new SupabasePostgresProvider({
      client: rootClient,
      db: createMockDb(rootExecute),
      createDrizzle,
    });

    const value = await provider.transaction(async (transactionalDb) => {
      await transactionalDb.execute('SELECT 1;');
      return 'ok';
    });

    expect(value).toBe('ok');
    expect(begin).toHaveBeenCalledTimes(1);
    expect(txExecute).toHaveBeenCalledTimes(1);
  });
});

function createMockDb(
  execute: ReturnType<typeof vi.fn>
): PostgresJsDatabase<Record<string, never>> {
  return {
    execute,
  } as unknown as PostgresJsDatabase<Record<string, never>>;
}

function createMockSqlClient(overrides?: {
  begin?: ReturnType<typeof vi.fn>;
  end?: ReturnType<typeof vi.fn>;
}): Sql {
  return {
    begin:
      overrides?.begin ??
      (vi.fn(async (run: (client: Sql) => Promise<unknown>) =>
        run(createMockSqlClient())
      ) as unknown as Sql['begin']),
    end:
      overrides?.end ?? (vi.fn(async () => undefined) as unknown as Sql['end']),
  } as unknown as Sql;
}
