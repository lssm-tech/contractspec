import { describe, expect, it } from 'bun:test';
import { GeneratedReleaseManifestSchema, ReleaseCapsuleSchema } from './schema';

describe('ReleaseCapsuleSchema', () => {
	it('should default optional release metadata collections', () => {
		const capsule = ReleaseCapsuleSchema.parse({
			slug: 'workflow-runtime-fix',
			summary: 'Fix workflow runtime packaging',
		});

		expect(capsule.schemaVersion).toBe('1');
		expect(capsule.packages).toEqual([]);
		expect(capsule.audiences).toEqual([]);
		expect(capsule.upgradeSteps).toEqual([]);
		expect(capsule.validation.commands).toEqual([]);
		expect(capsule.validation.evidence).toEqual([]);
	});
});

describe('GeneratedReleaseManifestSchema', () => {
	it('should parse manifest entries with a stable release version', () => {
		const manifest = GeneratedReleaseManifestSchema.parse({
			generatedAt: '2026-03-27T12:00:00.000Z',
			releases: [
				{
					slug: 'workflow-runtime-fix',
					version: '5.0.5',
					summary: 'Fix workflow runtime packaging',
					date: '2026-03-27',
					isBreaking: false,
					packages: [
						{
							name: '@contractspec/lib.contracts-spec',
							releaseType: 'patch',
							version: '5.0.5',
						},
					],
					affectedRuntimes: ['nextjs'],
					affectedFrameworks: ['vercel-workflow'],
					audiences: [],
					deprecations: [],
					migrationInstructions: [],
					upgradeSteps: [],
					validation: {
						commands: ['contractspec release check --strict'],
						evidence: ['CI green'],
					},
				},
			],
		});

		expect(manifest.releases[0]?.version).toBe('5.0.5');
		expect(manifest.releases[0]?.packages[0]?.name).toBe(
			'@contractspec/lib.contracts-spec'
		);
	});
});
