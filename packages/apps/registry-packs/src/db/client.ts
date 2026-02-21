import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { Database } from 'bun:sqlite';
import { drizzle as drizzleSqlite } from 'drizzle-orm/bun-sqlite';
import { migrate as migrateSqlite } from 'drizzle-orm/bun-sqlite/migrator';
import * as schema from './schema.js';

/**
 * DB driver type — SQLite (default) or PostgreSQL.
 * Set via DB_DRIVER=pg to use PostgreSQL.
 */
export type DbDriver = 'sqlite' | 'pg';

const DATABASE_URL = process.env.DATABASE_URL ?? './data/registry.db';

/**
 * Database type exported for consumers.
 * Uses the SQLite type as the common interface — services use
 * the Drizzle query builder which is driver-agnostic.
 */
export type Db = ReturnType<typeof drizzleSqlite<typeof schema>>;

/**
 * SQLite database connection singleton using Bun's native driver.
 */
let _db: Db | null = null;

function createSqliteDb(): Db {
  // Ensure the directory for the SQLite file exists
  const dbPath = resolve(DATABASE_URL);
  mkdirSync(dirname(dbPath), { recursive: true });

  const sqlite = new Database(dbPath);
  sqlite.exec('PRAGMA journal_mode = WAL');
  sqlite.exec('PRAGMA foreign_keys = ON');

  const db = drizzleSqlite(sqlite, { schema });

  // Run pending migrations on startup
  const migrationsFolder = new URL('./migrations', import.meta.url).pathname;
  migrateSqlite(db, { migrationsFolder });

  return db;
}

/**
 * Create a PostgreSQL connection via drizzle-orm/node-postgres.
 * Requires `pg` package to be installed.
 * Uses connection pooling via pg.Pool.
 */
async function createPgDb(): Promise<Db> {
  // Dynamic import to avoid requiring pg when using SQLite
  const { drizzle: drizzlePg } = await import('drizzle-orm/node-postgres');
  const { default: pg } = await import('pg');

  const pool = new pg.Pool({
    connectionString: DATABASE_URL,
    max: Number(process.env.DB_POOL_MAX ?? 10),
    idleTimeoutMillis: Number(process.env.DB_POOL_IDLE_TIMEOUT ?? 30000),
    connectionTimeoutMillis: Number(
      process.env.DB_POOL_CONNECT_TIMEOUT ?? 5000
    ),
  });

  // Import PG schema (same column names, PG-native types)
  const schemaPg = await import('./schema-pg.js');
  const db = drizzlePg(pool, { schema: schemaPg });

  // Run PG migrations
  const { migrate: migratePg } =
    await import('drizzle-orm/node-postgres/migrator');
  const migrationsFolder = new URL('./migrations-pg', import.meta.url).pathname;

  try {
    await migratePg(db, { migrationsFolder });
  } catch {
    // migrations-pg folder may not exist yet if PG migrations haven't been generated
    console.warn(
      'PostgreSQL migrations folder not found — skipping auto-migrate'
    );
  }

  // Cast to Db — the Drizzle query builder API is compatible across drivers
  return db as unknown as Db;
}

/**
 * Get the active DB driver from environment.
 */
export function getDriver(): DbDriver {
  return process.env.DB_DRIVER === 'pg' ? 'pg' : 'sqlite';
}

/**
 * Get the database instance (singleton).
 */
export function getDb(): Db {
  if (!_db) {
    if (getDriver() === 'pg') {
      // For PG, we need async initialization.
      // In practice, call initDb() at startup before using getDb().
      throw new Error(
        'PostgreSQL DB not initialized. Call initDb() at startup.'
      );
    }
    _db = createSqliteDb();
  }
  return _db;
}

/**
 * Initialize the DB asynchronously (required for PostgreSQL).
 * For SQLite, this is a no-op since getDb() handles lazy init.
 */
export async function initDb(): Promise<Db> {
  if (_db) return _db;

  if (getDriver() === 'pg') {
    _db = await createPgDb();
  } else {
    _db = createSqliteDb();
  }

  return _db;
}

/**
 * Override the DB instance (for testing with in-memory databases).
 */
export function setDb(db: Db): void {
  _db = db;
}
