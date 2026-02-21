/**
 * Drizzle config for PostgreSQL.
 *
 * Usage:
 *   drizzle-kit generate --config=drizzle-pg.config.ts
 *   drizzle-kit migrate --config=drizzle-pg.config.ts
 */
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema-pg.ts',
  out: './src/db/migrations-pg',
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      'postgres://localhost:5432/agentpacks_registry',
  },
});
