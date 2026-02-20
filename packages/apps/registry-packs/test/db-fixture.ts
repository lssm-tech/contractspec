/**
 * Test fixture — creates an in-memory SQLite database with migrated schema.
 */
import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
import * as schema from '../src/db/schema.js';

export type TestDb = ReturnType<typeof drizzle<typeof schema>>;

/**
 * Create a fresh in-memory database for testing.
 * Each call returns an isolated instance.
 */
export function createTestDb(): TestDb {
  const sqlite = new Database(':memory:');
  sqlite.exec('PRAGMA foreign_keys = ON');

  const db = drizzle(sqlite, { schema });

  // Run migrations
  const migrationsFolder = new URL('../src/db/migrations', import.meta.url)
    .pathname;
  migrate(db, { migrationsFolder });

  return db;
}
