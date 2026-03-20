import { describe, expect, it } from 'bun:test';
import {
	createHarnessReplayBundle,
	summarizeHarnessReplayBundle,
} from './bundle';

describe('harness replay bundle', () => {
	it('creates a compact replay bundle and summary', () => {
		const bundle = createHarnessReplayBundle({
			run: {
				runId: 'run-1',
				status: 'completed',
				mode: 'deterministic-browser',
				target: {
					targetId: 'target-1',
					kind: 'preview',
					isolation: 'preview',
					environment: 'preview',
				},
				steps: [],
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			},
			assertions: [{ assertionKey: 'a', status: 'passed' }],
			artifacts: [
				{
					artifactId: 'artifact-1',
					kind: 'step-summary',
					runId: 'run-1',
					uri: 'artifact://1',
					createdAt: new Date().toISOString(),
				},
			],
		});

		expect(bundle.version).toBe('1');
		expect(summarizeHarnessReplayBundle(bundle).artifactCount).toBe(1);
	});
});
