import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

/**
 * Packs table — core registry entries.
 */
export const packs = sqliteTable('packs', {
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
  tags: text('tags', { mode: 'json' }).notNull().$type<string[]>().default([]),
  targets: text('targets', { mode: 'json' })
    .notNull()
    .$type<string[]>()
    .default([]),
  features: text('features', { mode: 'json' })
    .notNull()
    .$type<string[]>()
    .default([]),
  dependencies: text('dependencies', { mode: 'json' })
    .notNull()
    .$type<string[]>()
    .default([]),
  conflicts: text('conflicts', { mode: 'json' })
    .notNull()
    .$type<string[]>()
    .default([]),
  downloads: integer('downloads').notNull().default(0),
  weeklyDownloads: integer('weekly_downloads').notNull().default(0),
  featured: integer('featured', { mode: 'boolean' }).notNull().default(false),
  verified: integer('verified', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

/**
 * Pack versions table — versioned releases.
 */
export const packVersions = sqliteTable('pack_versions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  packName: text('pack_name')
    .notNull()
    .references(() => packs.name, { onDelete: 'cascade' }),
  version: text('version').notNull(),
  integrity: text('integrity').notNull(),
  tarballUrl: text('tarball_url').notNull(),
  tarballSize: integer('tarball_size').notNull(),
  packManifest: text('pack_manifest', { mode: 'json' })
    .notNull()
    .$type<Record<string, unknown>>(),
  fileCount: integer('file_count').notNull().default(0),
  featureSummary: text('feature_summary', { mode: 'json' })
    .notNull()
    .$type<Record<string, unknown>>()
    .default({}),
  changelog: text('changelog'),
  createdAt: text('created_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

/**
 * Pack readmes table — README content.
 */
export const packReadmes = sqliteTable('pack_readmes', {
  packName: text('pack_name')
    .primaryKey()
    .references(() => packs.name, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  renderedHtml: text('rendered_html'),
});

/**
 * Auth tokens table — bearer tokens for publish.
 */
export const authTokens = sqliteTable('auth_tokens', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  token: text('token').notNull().unique(),
  username: text('username').notNull(),
  scope: text('scope').notNull().default('publish'),
  createdAt: text('created_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  expiresAt: text('expires_at'),
});

/**
 * Type exports for use in services.
 */
export type Pack = typeof packs.$inferSelect;
export type NewPack = typeof packs.$inferInsert;
export type PackVersion = typeof packVersions.$inferSelect;
export type NewPackVersion = typeof packVersions.$inferInsert;
export type PackReadme = typeof packReadmes.$inferSelect;
export type AuthToken = typeof authTokens.$inferSelect;
