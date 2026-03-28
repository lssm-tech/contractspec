import { describe, expect, it } from 'bun:test';
import {
	dedupeUpgradePlanSteps,
	sortReleaseManifest,
} from './release-utils';

describe('sortReleaseManifest', () => {
	it('should prefer newer release dates and versions first', () => {
		const releases = sortReleaseManifest({
			generatedAt: '2026-03-27T12:00:00.000Z',
			releases: [
				{
					slug: 'older',
					version: '4.9.9',
					summary: 'Older release',
					date: '2026-03-20',
					isBreaking: false,
					packages: [],
					affectedRuntimes: [],
					affectedFrameworks: [],
					audiences: [],
					deprecations: [],
					migrationInstructions: [],
					upgradeSteps: [],
					validation: { commands: [], evidence: [] },
				},
				{
					slug: 'newer',
					version: '5.0.0',
					summary: 'Newer release',
					date: '2026-03-27',
					isBreaking: false,
					packages: [],
					affectedRuntimes: [],
					affectedFrameworks: [],
					audiences: [],
					deprecations: [],
					migrationInstructions: [],
					upgradeSteps: [],
					validation: { commands: [], evidence: [] },
				},
			],
		});

		expect(releases[0]?.slug).toBe('newer');
	});
});

describe('dedupeUpgradePlanSteps', () => {
	it('should merge instructions and autofixes for matching step ids', () => {
		const steps = dedupeUpgradePlanSteps([
			{
				id: 'rewrite-imports',
				title: 'Rewrite imports',
				summary: 'Move imports to the new subpath.',
				level: 'auto',
				instructions: ['Update runtime imports'],
				autofixes: [
					{
						id: 'import-1',
						kind: 'import-rewrite',
						title: 'Rewrite workflow import',
						summary: 'Use workflow/spec',
						from: '@contractspec/lib.contracts-spec/workflow',
						to: '@contractspec/lib.contracts-spec/workflow/spec',
					},
				],
			},
			{
				id: 'rewrite-imports',
				title: 'Rewrite imports',
				summary: 'Move imports to the new subpath.',
				level: 'auto',
				instructions: ['Update generated templates'],
				autofixes: [
					{
						id: 'import-2',
						kind: 'import-rewrite',
						title: 'Rewrite template import',
						summary: 'Use workflow/spec',
						from: '@contractspec/lib.contracts-spec/workflow',
						to: '@contractspec/lib.contracts-spec/workflow/spec',
					},
				],
			},
		]);

		expect(steps).toHaveLength(1);
		expect(steps[0]?.instructions).toEqual([
			'Update runtime imports',
			'Update generated templates',
		]);
		expect(steps[0]?.autofixes).toHaveLength(2);
	});
});
