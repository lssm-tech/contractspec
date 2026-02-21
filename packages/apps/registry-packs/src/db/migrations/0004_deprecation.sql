ALTER TABLE packs ADD COLUMN deprecated integer NOT NULL DEFAULT 0;--> statement-breakpoint
ALTER TABLE packs ADD COLUMN deprecation_message text;
