CREATE TABLE `auth_tokens` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`token` text NOT NULL,
	`username` text NOT NULL,
	`scope` text DEFAULT 'publish' NOT NULL,
	`created_at` text NOT NULL,
	`expires_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `auth_tokens_token_unique` ON `auth_tokens` (`token`);--> statement-breakpoint
CREATE TABLE `pack_readmes` (
	`pack_name` text PRIMARY KEY NOT NULL,
	`content` text NOT NULL,
	`rendered_html` text,
	FOREIGN KEY (`pack_name`) REFERENCES `packs`(`name`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `pack_versions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`pack_name` text NOT NULL,
	`version` text NOT NULL,
	`integrity` text NOT NULL,
	`tarball_url` text NOT NULL,
	`tarball_size` integer NOT NULL,
	`pack_manifest` text NOT NULL,
	`file_count` integer DEFAULT 0 NOT NULL,
	`feature_summary` text DEFAULT '{}' NOT NULL,
	`changelog` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`pack_name`) REFERENCES `packs`(`name`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `packs` (
	`name` text PRIMARY KEY NOT NULL,
	`display_name` text NOT NULL,
	`description` text NOT NULL,
	`long_description` text,
	`author_name` text NOT NULL,
	`author_email` text,
	`author_url` text,
	`author_avatar_url` text,
	`license` text DEFAULT 'MIT' NOT NULL,
	`homepage` text,
	`repository` text,
	`tags` text DEFAULT '[]' NOT NULL,
	`targets` text DEFAULT '[]' NOT NULL,
	`features` text DEFAULT '[]' NOT NULL,
	`dependencies` text DEFAULT '[]' NOT NULL,
	`conflicts` text DEFAULT '[]' NOT NULL,
	`downloads` integer DEFAULT 0 NOT NULL,
	`weekly_downloads` integer DEFAULT 0 NOT NULL,
	`featured` integer DEFAULT false NOT NULL,
	`verified` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
