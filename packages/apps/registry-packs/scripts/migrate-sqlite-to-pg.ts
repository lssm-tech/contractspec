#!/usr/bin/env bun
/**
 * Migration script: SQLite → PostgreSQL.
 *
 * Reads all data from the local SQLite database and inserts it into
 * a PostgreSQL database. Intended for one-time production migration.
 *
 * Usage:
 *   DATABASE_URL=./data/registry.db PG_URL=postgres://... bun run scripts/migrate-sqlite-to-pg.ts
 */
import { Database } from 'bun:sqlite';
import { drizzle as drizzleSqlite } from 'drizzle-orm/bun-sqlite';
import * as sqliteSchema from '../src/db/schema.js';
import pg from 'pg';

const SQLITE_PATH = process.env.DATABASE_URL ?? './data/registry.db';
const PG_URL = process.env.PG_URL;

if (!PG_URL) {
  console.error('Error: PG_URL environment variable is required');
  process.exit(1);
}

async function main() {
  console.log(`Migrating from SQLite (${SQLITE_PATH}) to PostgreSQL...`);

  // Connect to SQLite
  const sqlite = new Database(SQLITE_PATH);
  sqlite.exec('PRAGMA foreign_keys = OFF'); // Disable for bulk reads
  const sqliteDb = drizzleSqlite(sqlite, { schema: sqliteSchema });

  // Connect to PostgreSQL
  const pool = new pg.Pool({ connectionString: PG_URL });
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Migrate packs
    const allPacks = await sqliteDb.select().from(sqliteSchema.packs);
    console.log(`  Migrating ${allPacks.length} packs...`);
    for (const pack of allPacks) {
      await client.query(
        `INSERT INTO packs (name, display_name, description, long_description,
          author_name, author_email, author_url, author_avatar_url, license,
          homepage, repository, tags, targets, features, dependencies, conflicts,
          downloads, weekly_downloads, average_rating, review_count, quality_score,
          featured, verified, created_at, updated_at)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25)
        ON CONFLICT (name) DO NOTHING`,
        [
          pack.name,
          pack.displayName,
          pack.description,
          pack.longDescription,
          pack.authorName,
          pack.authorEmail,
          pack.authorUrl,
          pack.authorAvatarUrl,
          pack.license,
          pack.homepage,
          pack.repository,
          JSON.stringify(pack.tags),
          JSON.stringify(pack.targets),
          JSON.stringify(pack.features),
          JSON.stringify(pack.dependencies),
          JSON.stringify(pack.conflicts),
          pack.downloads,
          pack.weeklyDownloads,
          pack.averageRating,
          pack.reviewCount,
          pack.qualityScore,
          pack.featured,
          pack.verified,
          pack.createdAt,
          pack.updatedAt,
        ]
      );
    }

    // 2. Migrate pack versions
    const allVersions = await sqliteDb.select().from(sqliteSchema.packVersions);
    console.log(`  Migrating ${allVersions.length} versions...`);
    for (const v of allVersions) {
      await client.query(
        `INSERT INTO pack_versions (pack_name, version, integrity, tarball_url,
          tarball_size, pack_manifest, file_count, feature_summary, changelog, created_at)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [
          v.packName,
          v.version,
          v.integrity,
          v.tarballUrl,
          v.tarballSize,
          JSON.stringify(v.packManifest),
          v.fileCount,
          JSON.stringify(v.featureSummary),
          v.changelog,
          v.createdAt,
        ]
      );
    }

    // 3. Migrate readmes
    const allReadmes = await sqliteDb.select().from(sqliteSchema.packReadmes);
    console.log(`  Migrating ${allReadmes.length} readmes...`);
    for (const r of allReadmes) {
      await client.query(
        `INSERT INTO pack_readmes (pack_name, content, rendered_html)
        VALUES ($1,$2,$3) ON CONFLICT (pack_name) DO NOTHING`,
        [r.packName, r.content, r.renderedHtml]
      );
    }

    // 4. Migrate auth tokens
    const allTokens = await sqliteDb.select().from(sqliteSchema.authTokens);
    console.log(`  Migrating ${allTokens.length} auth tokens...`);
    for (const t of allTokens) {
      await client.query(
        `INSERT INTO auth_tokens (token, username, scope, created_at, expires_at)
        VALUES ($1,$2,$3,$4,$5)`,
        [t.token, t.username, t.scope, t.createdAt, t.expiresAt]
      );
    }

    // 5. Migrate download stats
    const allStats = await sqliteDb.select().from(sqliteSchema.downloadStats);
    console.log(`  Migrating ${allStats.length} download stats...`);
    for (const s of allStats) {
      await client.query(
        `INSERT INTO download_stats (pack_name, date, count)
        VALUES ($1,$2,$3)`,
        [s.packName, s.date, s.count]
      );
    }

    // 6. Migrate reviews
    const allReviews = await sqliteDb.select().from(sqliteSchema.reviews);
    console.log(`  Migrating ${allReviews.length} reviews...`);
    for (const r of allReviews) {
      await client.query(
        `INSERT INTO reviews (pack_name, username, rating, comment, created_at, updated_at)
        VALUES ($1,$2,$3,$4,$5,$6)`,
        [r.packName, r.username, r.rating, r.comment, r.createdAt, r.updatedAt]
      );
    }

    // 7. Migrate organizations
    const allOrgs = await sqliteDb.select().from(sqliteSchema.organizations);
    console.log(`  Migrating ${allOrgs.length} organizations...`);
    for (const o of allOrgs) {
      await client.query(
        `INSERT INTO organizations (name, display_name, description, avatar_url, website, created_at, updated_at)
        VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (name) DO NOTHING`,
        [
          o.name,
          o.displayName,
          o.description,
          o.avatarUrl,
          o.website,
          o.createdAt,
          o.updatedAt,
        ]
      );
    }

    // 8. Migrate org members
    const allMembers = await sqliteDb.select().from(sqliteSchema.orgMembers);
    console.log(`  Migrating ${allMembers.length} org members...`);
    for (const m of allMembers) {
      await client.query(
        `INSERT INTO org_members (org_name, username, role, created_at)
        VALUES ($1,$2,$3,$4)`,
        [m.orgName, m.username, m.role, m.createdAt]
      );
    }

    await client.query('COMMIT');
    console.log('Migration complete!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
    sqlite.close();
  }
}

main();
