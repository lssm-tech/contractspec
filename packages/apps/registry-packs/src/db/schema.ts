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
  averageRating: integer('average_rating'), // 10x scaled (e.g. 42 = 4.2)
  reviewCount: integer('review_count').notNull().default(0),
  qualityScore: integer('quality_score'), // 0-100
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
 * Download stats table — daily download counts per pack.
 */
export const downloadStats = sqliteTable('download_stats', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  packName: text('pack_name')
    .notNull()
    .references(() => packs.name, { onDelete: 'cascade' }),
  date: text('date').notNull(), // YYYY-MM-DD
  count: integer('count').notNull().default(0),
});

/**
 * Reviews table — user ratings and comments for packs.
 */
export const reviews = sqliteTable('reviews', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  packName: text('pack_name')
    .notNull()
    .references(() => packs.name, { onDelete: 'cascade' }),
  username: text('username').notNull(),
  rating: integer('rating').notNull(), // 1-5
  comment: text('comment'),
  createdAt: text('created_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

/**
 * Organizations table — named groups that can own packs.
 */
export const organizations = sqliteTable('organizations', {
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

/**
 * Organization members table — maps users to organizations with roles.
 */
export const orgMembers = sqliteTable('org_members', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orgName: text('org_name')
    .notNull()
    .references(() => organizations.name, { onDelete: 'cascade' }),
  username: text('username').notNull(),
  role: text('role').notNull().default('member'), // 'owner' | 'admin' | 'member'
  createdAt: text('created_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
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
export type DownloadStat = typeof downloadStats.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;
export type OrgMember = typeof orgMembers.$inferSelect;
export type NewOrgMember = typeof orgMembers.$inferInsert;
