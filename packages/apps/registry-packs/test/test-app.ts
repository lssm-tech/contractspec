/**
 * Test app builder — creates an in-memory test DB and injects it
 * via `setDb()` so all route handlers and middleware use it.
 */
import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
import * as schema from '../src/db/schema.js';
import { setDb, type Db } from '../src/db/client.js';

/**
 * Create a fresh in-memory test DB and wire it into the app.
 * Returns the DB instance for direct use in test setup/assertions.
 */
export function setupTestDb(): Db {
  const sqlite = new Database(':memory:');
  sqlite.exec('PRAGMA foreign_keys = ON');

  const db = drizzle(sqlite, { schema });

  const migrationsFolder = new URL('../src/db/migrations', import.meta.url)
    .pathname;
  migrate(db, { migrationsFolder });

  // Inject into the singleton so all getDb() calls return this DB
  setDb(db);

  return db;
}
