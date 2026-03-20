import { describe, expect, test } from 'bun:test';
import {
	KnowledgeSnapshotPublicationMigration,
	VersionedKnowledgeBaseFeature,
} from './index';

describe('@contractspec/example.versioned-knowledge-base', () => {
	test('exports the canonical migration spec', () => {
		expect(KnowledgeSnapshotPublicationMigration.meta.key).toBe(
			'versioned-knowledge-base.migration.snapshot-publication'
		);
		expect(KnowledgeSnapshotPublicationMigration.plan.up).toHaveLength(2);
		expect(VersionedKnowledgeBaseFeature.meta.key).toBe(
			'versioned-knowledge-base'
		);
	});
});
