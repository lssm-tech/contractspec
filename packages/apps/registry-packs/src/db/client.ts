import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
import * as schema from './schema.js';

const DATABASE_URL = process.env.DATABASE_URL ?? './data/registry.db';

/**
 * Database type exported for consumers.
 */
export type Db = ReturnType<typeof drizzle<typeof schema>>;

/**
 * SQLite database connection singleton using Bun's native driver.
 */
let _db: Db | null = null;

function createDb(): Db {
  // Ensure the directory for the SQLite file exists
  const dbPath = resolve(DATABASE_URL);
  mkdirSync(dirname(dbPath), { recursive: true });

  const sqlite = new Database(dbPath);
  sqlite.exec('PRAGMA journal_mode = WAL');
  sqlite.exec('PRAGMA foreign_keys = ON');

  const db = drizzle(sqlite, { schema });

  // Run pending migrations on startup
  const migrationsFolder = new URL('./migrations', import.meta.url).pathname;
  migrate(db, { migrationsFolder });

  return db;
}

/**
 * Get the database instance (singleton).
 */
export function getDb(): Db {
  if (!_db) {
    _db = createDb();
  }
  return _db;
}

/**
 * Override the DB instance (for testing with in-memory databases).
 */
export function setDb(db: Db): void {
  _db = db;
}
