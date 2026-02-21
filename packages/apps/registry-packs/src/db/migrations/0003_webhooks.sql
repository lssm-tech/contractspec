-- Phase 3b: Webhooks for pack publish/update/delete events.

CREATE TABLE IF NOT EXISTS `webhooks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`pack_name` text NOT NULL,
	`url` text NOT NULL,
	`secret` text,
	`events` text DEFAULT '[]' NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`username` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`pack_name`) REFERENCES `packs`(`name`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `webhook_deliveries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`webhook_id` integer NOT NULL,
	`event` text NOT NULL,
	`payload` text NOT NULL,
	`status_code` integer,
	`response_body` text,
	`success` integer DEFAULT false NOT NULL,
	`attempted_at` text NOT NULL,
	FOREIGN KEY (`webhook_id`) REFERENCES `webhooks`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_webhooks_pack` ON `webhooks` (`pack_name`);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_deliveries_webhook` ON `webhook_deliveries` (`webhook_id`);
