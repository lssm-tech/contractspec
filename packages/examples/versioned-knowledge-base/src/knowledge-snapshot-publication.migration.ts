import type { MigrationSpec } from '@contractspec/lib.contracts-spec/migrations';
import {
	OwnersEnum,
	StabilityEnum,
	TagsEnum,
} from '@contractspec/lib.contracts-spec/ownership';

export const KnowledgeSnapshotPublicationMigration: MigrationSpec = {
	meta: {
		key: 'versioned-knowledge-base.migration.snapshot-publication',
		version: '1.0.0',
		title: 'Knowledge Snapshot Publication Migration',
		description:
			'Adds publication audit fields and validation checks for published knowledge snapshots.',
		domain: 'knowledge',
		owners: [OwnersEnum.PlatformContent],
		tags: ['knowledge', 'migration', 'snapshots', TagsEnum.Hygiene],
		stability: StabilityEnum.Experimental,
	},
	dependencies: ['versioned-knowledge-base.migration.bootstrap'],
	plan: {
		up: [
			{
				kind: 'schema',
				description: 'Create the published snapshot audit table.',
				sql: `
CREATE TABLE kb_snapshot_publications (
  snapshot_id TEXT PRIMARY KEY,
  published_by TEXT NOT NULL,
  published_at TIMESTAMPTZ NOT NULL,
  source_count INTEGER NOT NULL,
  rule_version_count INTEGER NOT NULL
);`,
			},
			{
				kind: 'validation',
				description:
					'Ensure snapshots have at least one approved rule version.',
				assertion:
					'SELECT COUNT(*) = 0 FROM kb_snapshots WHERE array_length(included_rule_version_ids, 1) = 0',
			},
		],
		down: [
			{
				kind: 'schema',
				description: 'Remove the snapshot publication audit table.',
				sql: 'DROP TABLE IF EXISTS kb_snapshot_publications;',
			},
		],
	},
};
