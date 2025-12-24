import { describe, expect, it } from 'bun:test';
import { MigrationRegistry, type MigrationSpec } from './migrations';
import { StabilityEnum, type Tag, type Owner } from './ownership';

const baseMeta = {
  title: 'Add Users Table' as const,
  description: 'Create users table and backfill existing accounts.' as const,
  domain: 'core' as const,
  owners: ['@team.platform'] as Owner[],
  tags: ['migration', 'database'] as Tag[],
  stability: StabilityEnum.Experimental,
} as const;

const migration: MigrationSpec = {
  meta: {
    ...baseMeta,
    key: 'core.db.2025_01_add_users',
    version: 1,
  },
  plan: {
    up: [
      {
        kind: 'schema',
        description: 'Create users table',
        sql: 'CREATE TABLE users (id uuid PRIMARY KEY, email text UNIQUE NOT NULL);',
      },
      {
        kind: 'validation',
        description: 'Ensure table exists',
        assertion: "SELECT to_regclass('public.users') IS NOT NULL AS exists;",
      },
    ],
    down: [
      {
        kind: 'schema',
        description: 'Drop users table',
        sql: 'DROP TABLE IF EXISTS users;',
      },
    ],
  },
  dependencies: ['core.db.2024_12_create_accounts'],
};

describe('MigrationRegistry', () => {
  it('registers and retrieves migrations by name/version', () => {
    const registry = new MigrationRegistry();
    registry.register(migration);
    const stored = registry.get('core.db.2025_01_add_users', 1);
    expect(stored?.meta.key).toBe('core.db.2025_01_add_users');
    expect(stored?.plan.up).toHaveLength(2);
  });

  it('returns latest version when version omitted', () => {
    const registry = new MigrationRegistry();
    registry.register(migration);
    registry.register({
      ...migration,
      meta: { ...migration.meta, version: 2 },
    });
    const latest = registry.get('core.db.2025_01_add_users');
    expect(latest?.meta.version).toBe(2);
  });

  it('lists migrations in key order', () => {
    const registry = new MigrationRegistry();
    registry.register(migration);
    registry.register({
      ...migration,
      meta: { ...migration.meta, key: 'core.db.2025_02_add_roles' },
    });
    const list = registry.list();
    expect(list.map((m) => m.meta.key)).toEqual([
      'core.db.2025_01_add_users',
      'core.db.2025_02_add_roles',
    ]);
  });
});
