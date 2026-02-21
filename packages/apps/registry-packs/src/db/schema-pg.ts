/**
 * PostgreSQL schema — mirrors the SQLite schema for production use.
 *
 * Uses pgTable instead of sqliteTable, with PG-native types:
 * - text → text (same)
 * - integer → integer (same)
 * - boolean → boolean (native, not integer mode)
 * - json → jsonb (native)
 * - timestamps → text (ISO 8601 strings for consistency)
 */
import {
  pgTable,
  text,
  integer,
  boolean,
  jsonb,
  serial,
} from 'drizzle-orm/pg-core';

/* ─── Packs ─── */

export const packs = pgTable('packs', {
  name: text('name').primaryKey(),
  displayName: text('display_name').notNull(),
  description: text('description').notNull(),
  longDescription: text('long_description'),
  authorName: text('author_name').notNull(),
  authorEmail: text('author_email'),
  authorUrl: text('author_url'),
  authorAvatarUrl: text('author_avatar_url'),
  license: text('license').notNull().default('MIT'),
  homepage: text('homepage'),
  repository: text('repository'),
  tags: jsonb('tags').notNull().$type<string[]>().default([]),
  targets: jsonb('targets').notNull().$type<string[]>().default([]),
  features: jsonb('features').notNull().$type<string[]>().default([]),
  dependencies: jsonb('dependencies').notNull().$type<string[]>().default([]),
  conflicts: jsonb('conflicts').notNull().$type<string[]>().default([]),
  downloads: integer('downloads').notNull().default(0),
  weeklyDownloads: integer('weekly_downloads').notNull().default(0),
  averageRating: integer('average_rating'),
  reviewCount: integer('review_count').notNull().default(0),
  qualityScore: integer('quality_score'),
  featured: boolean('featured').notNull().default(false),
  verified: boolean('verified').notNull().default(false),
  createdAt: text('created_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

/* ─── Pack Versions ─── */

export const packVersions = pgTable('pack_versions', {
  id: serial('id').primaryKey(),
  packName: text('pack_name')
    .notNull()
    .references(() => packs.name, { onDelete: 'cascade' }),
  version: text('version').notNull(),
  integrity: text('integrity').notNull(),
  tarballUrl: text('tarball_url').notNull(),
  tarballSize: integer('tarball_size').notNull(),
  packManifest: jsonb('pack_manifest')
    .notNull()
    .$type<Record<string, unknown>>(),
  fileCount: integer('file_count').notNull().default(0),
  featureSummary: jsonb('feature_summary')
    .notNull()
    .$type<Record<string, unknown>>()
    .default({}),
  changelog: text('changelog'),
  createdAt: text('created_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

/* ─── Pack Readmes ─── */

export const packReadmes = pgTable('pack_readmes', {
  packName: text('pack_name')
    .primaryKey()
    .references(() => packs.name, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  renderedHtml: text('rendered_html'),
});

/* ─── Auth Tokens ─── */

export const authTokens = pgTable('auth_tokens', {
  id: serial('id').primaryKey(),
  token: text('token').notNull().unique(),
  username: text('username').notNull(),
  scope: text('scope').notNull().default('publish'),
  createdAt: text('created_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  expiresAt: text('expires_at'),
});

/* ─── Download Stats ─── */

export const downloadStats = pgTable('download_stats', {
  id: serial('id').primaryKey(),
  packName: text('pack_name')
    .notNull()
    .references(() => packs.name, { onDelete: 'cascade' }),
  date: text('date').notNull(),
  count: integer('count').notNull().default(0),
});

/* ─── Reviews ─── */

export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  packName: text('pack_name')
    .notNull()
    .references(() => packs.name, { onDelete: 'cascade' }),
  username: text('username').notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  createdAt: text('created_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

/* ─── Organizations ─── */

export const organizations = pgTable('organizations', {
  name: text('name').primaryKey(),
  displayName: text('display_name').notNull(),
  description: text('description'),
  avatarUrl: text('avatar_url'),
  website: text('website'),
  createdAt: text('created_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

/* ─── Organization Members ─── */

export const orgMembers = pgTable('org_members', {
  id: serial('id').primaryKey(),
  orgName: text('org_name')
    .notNull()
    .references(() => organizations.name, { onDelete: 'cascade' }),
  username: text('username').notNull(),
  role: text('role').notNull().default('member'),
  createdAt: text('created_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

/* ─── Webhooks ─── */

export const webhooks = pgTable('webhooks', {
  id: serial('id').primaryKey(),
  packName: text('pack_name')
    .notNull()
    .references(() => packs.name, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  secret: text('secret'),
  events: jsonb('events').notNull().$type<string[]>().default([]),
  active: boolean('active').notNull().default(true),
  username: text('username').notNull(),
  createdAt: text('created_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

/* ─── Webhook Deliveries ─── */

export const webhookDeliveries = pgTable('webhook_deliveries', {
  id: serial('id').primaryKey(),
  webhookId: integer('webhook_id')
    .notNull()
    .references(() => webhooks.id, { onDelete: 'cascade' }),
  event: text('event').notNull(),
  payload: jsonb('payload').notNull().$type<Record<string, unknown>>(),
  statusCode: integer('status_code'),
  responseBody: text('response_body'),
  success: boolean('success').notNull().default(false),
  attemptedAt: text('attempted_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});
