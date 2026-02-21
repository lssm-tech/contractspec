-- Phase 3: Community tables (reviews, organizations, org_members)
-- and new columns on packs for rating/quality caching.

ALTER TABLE `packs` ADD COLUMN `average_rating` integer;
--> statement-breakpoint
ALTER TABLE `packs` ADD COLUMN `review_count` integer NOT NULL DEFAULT 0;
--> statement-breakpoint
ALTER TABLE `packs` ADD COLUMN `quality_score` integer;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `reviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`pack_name` text NOT NULL,
	`username` text NOT NULL,
	`rating` integer NOT NULL,
	`comment` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`pack_name`) REFERENCES `packs`(`name`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_reviews_pack` ON `reviews` (`pack_name`);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `idx_reviews_pack_user` ON `reviews` (`pack_name`, `username`);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `organizations` (
	`name` text PRIMARY KEY NOT NULL,
	`display_name` text NOT NULL,
	`description` text,
	`avatar_url` text,
	`website` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `org_members` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`org_name` text NOT NULL,
	`username` text NOT NULL,
	`role` text DEFAULT 'member' NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`org_name`) REFERENCES `organizations`(`name`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `idx_org_members_org_user` ON `org_members` (`org_name`, `username`);
