import { describe, expect, it } from 'bun:test';
import type { HarnessScenarioSpec } from '@contractspec/lib.contracts-spec';
import { evaluateHarnessAssertions } from './engine';

describe('evaluateHarnessAssertions visual diffs', () => {
	it('passes when a visual diff artifact is inside thresholds', () => {
		const result = evaluateHarnessAssertions({
			scenario: createScenario({
				maxDiffBytes: 2,
				maxDiffRatio: 0.01,
			}),
			steps: [],
			artifacts: [
				{
					artifactId: 'artifact-1',
					kind: 'visual-diff',
					runId: 'run-1',
					stepId: 'compare-home',
					uri: 'memory://artifact-1',
					createdAt: '2026-04-23T10:00:00.000Z',
					metadata: {
						diffBytes: 1,
						diffRatio: 0.001,
					},
				},
			],
		});

		expect(result[0]).toMatchObject({
			assertionKey: 'visual-home-matches',
			status: 'passed',
		});
	});

	it('fails when no visual diff artifact satisfies thresholds', () => {
		const result = evaluateHarnessAssertions({
			scenario: createScenario({
				maxDiffBytes: 0,
				maxDiffRatio: 0,
			}),
			steps: [],
			artifacts: [
				{
					artifactId: 'artifact-1',
					kind: 'visual-diff',
					runId: 'run-1',
					stepId: 'compare-home',
					uri: 'memory://artifact-1',
					createdAt: '2026-04-23T10:00:00.000Z',
					metadata: {
						diffBytes: 5,
						diffRatio: 0.5,
					},
				},
			],
		});

		expect(result[0]?.status).toBe('failed');
	});
});

function createScenario(match: unknown): HarnessScenarioSpec {
	return {
		meta: {
			key: 'visual.test',
			version: '1.0.0',
			title: 'Visual test',
			description: 'Visual diff assertion test',
			domain: 'harness',
			owners: ['@contractspec-core'],
			tags: ['harness'],
			stability: 'experimental',
		},
		target: {},
		allowedModes: ['deterministic-browser'],
		steps: [],
		assertions: [
			{
				key: 'visual-home-matches',
				type: 'visual-diff',
				source: 'compare-home',
				match,
			},
		],
	};
}
