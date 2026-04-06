import { describe, expect, it } from 'bun:test';
import { createEvidenceBundle } from './bundle';

describe('createEvidenceBundle', () => {
	it('normalizes evidence classes, computes freshness, and clones metadata', () => {
		const now = new Date('2026-04-06T12:00:00.000Z');
		const metadata = {
			source: 'harness',
			nested: { retained: true },
		};

		const bundle = createEvidenceBundle({
			runId: 'run-1',
			classes: ['verification-results', 'tradeoff-record'],
			artifacts: [
				{ kind: 'app-log', summary: 'Verification logs' },
				{ kind: 'screenshot', summary: 'UI proof' },
			],
			freshForMinutes: 15,
			replayBundleUri: 'replay://run-1',
			metadata,
			now: () => now,
		});

		metadata.nested.retained = false;

		expect(bundle.classes).toEqual(['verification_results', 'tradeoff_record']);
		expect(bundle.artifactIds).toHaveLength(2);
		expect(bundle.createdAt).toBe('2026-04-06T12:00:00.000Z');
		expect(bundle.freshUntil).toBe('2026-04-06T12:15:00.000Z');
		expect(bundle.replayBundleUri).toBe('replay://run-1');
		expect(bundle.metadata).toEqual({
			source: 'harness',
			nested: { retained: true },
		});
	});
});
