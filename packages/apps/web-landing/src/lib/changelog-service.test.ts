import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

let manifestPath = '';
let cacheKey = '';

mock.module('@/lib/changelog-config', () => ({
	resolveChangelogConfig: () => ({
		monorepoRoot: '/tmp/contractspec-test-root',
		changelogGlob: '/tmp/contractspec-test-root/packages/*/*/CHANGELOG.md',
		generatedManifestPath: manifestPath,
		includeLayers: ['apps', 'bundles', 'integrations', 'libs', 'modules'],
		excludeLayers: ['examples', 'tools'],
		defaultPageSize: 20,
	}),
	changelogConfigToCacheKey: () => cacheKey,
}));

describe('changelog service', () => {
	let tempDir = '';
	let getChangelogManifest: typeof import('@/lib/changelog-service').getChangelogManifest;
	let getChangelogReleaseByVersion: typeof import('@/lib/changelog-service').getChangelogReleaseByVersion;

	beforeEach(async () => {
		tempDir = await mkdtemp(join(tmpdir(), 'contractspec-changelog-service-'));
		manifestPath = join(tempDir, 'generated', 'releases', 'manifest.json');
		cacheKey = manifestPath;
		await mkdir(join(tempDir, 'generated', 'releases'), { recursive: true });
		({ getChangelogManifest, getChangelogReleaseByVersion } = await import(
			'@/lib/changelog-service'
		));
	});

	afterEach(async () => {
		if (tempDir) {
			await rm(tempDir, { recursive: true, force: true });
		}
	});

	it('uses the generated release manifest as the only changelog source and groups entries by version', async () => {
		await writeFile(
			manifestPath,
			JSON.stringify(
				{
					generatedAt: '2026-04-19T10:00:00.000Z',
					releases: [
						{
							slug: 'knowledge-indexed-payload-hardening',
							version: '2.3.4',
							summary: 'Persist canonical payload text during indexing.',
							date: '2026-04-19',
							isBreaking: false,
							packages: [
								{
									name: '@contractspec/lib.knowledge',
									releaseType: 'patch',
									version: '2.3.4',
								},
							],
							affectedRuntimes: ['node'],
							affectedFrameworks: [],
							audiences: [
								{
									kind: 'customer',
									summary:
										'Customers can remove the old metadata text workaround.',
								},
							],
							deprecations: ['`metadata.text` backfill is no longer required.'],
							migrationInstructions: [
								{
									id: 'remove-workaround',
									title: 'Remove the workaround',
									summary: 'Delete the legacy metadata text shim.',
									required: false,
									steps: ['Upgrade the package.', 'Delete the shim.'],
								},
							],
							upgradeSteps: [
								{
									id: 'verify-payload',
									title: 'Verify payload text',
									summary: 'Confirm payload.text is present.',
									level: 'manual',
									instructions: ['Inspect one indexed payload.'],
								},
							],
							validation: { commands: [], evidence: [] },
						},
						{
							slug: 'context-storage-query-docs',
							version: '2.3.4',
							summary: 'Align the query docs with the storage adapters.',
							date: '2026-04-18',
							isBreaking: true,
							packages: [
								{
									name: '@contractspec/module.context-storage',
									releaseType: 'minor',
									version: '2.3.4',
								},
							],
							affectedRuntimes: ['node'],
							affectedFrameworks: [],
							audiences: [],
							deprecations: [],
							migrationInstructions: [],
							upgradeSteps: [],
							validation: { commands: [], evidence: [] },
						},
					],
				},
				null,
				2
			)
		);

		const manifest = await getChangelogManifest();
		const detail = await getChangelogReleaseByVersion('2.3.4');

		expect(manifest.totalReleases).toBe(1);
		expect(manifest.releases[0]?.releaseCount).toBe(2);
		expect(detail?.releaseCount).toBe(2);
		expect(detail?.releases.map((release) => release.slug)).toEqual([
			'context-storage-query-docs',
			'knowledge-indexed-payload-hardening',
		]);
		expect(detail?.deprecations).toContain(
			'`metadata.text` backfill is no longer required.'
		);
		expect(detail?.migrationInstructions[0]?.title).toBe(
			'Remove the workaround'
		);
		expect(detail?.upgradeSteps[0]?.title).toBe('Verify payload text');
	});

	it('fails if the canonical generated release manifest is missing', async () => {
		await expect(getChangelogManifest()).rejects.toThrow(
			'Run `contractspec release build` before building the website.'
		);
	});
});
