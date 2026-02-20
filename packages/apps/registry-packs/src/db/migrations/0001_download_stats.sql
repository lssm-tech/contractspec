CREATE TABLE IF NOT EXISTS `download_stats` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `pack_name` text NOT NULL REFERENCES `packs`(`name`) ON DELETE CASCADE,
  `date` text NOT NULL,
  `count` integer NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS `idx_download_stats_pack_date`
  ON `download_stats` (`pack_name`, `date`);
