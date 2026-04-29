import { describe, expect, it } from 'bun:test';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createNodeFsAdapter } from '../../adapters/fs.node';
import { createNoopLoggerAdapter } from '../../adapters/logger';
import {
	buildReleaseArtifacts,
	checkReleaseArtifacts,
} from './release-service';

const gitAdapter = {
	currentBranch: async () => 'main',
	showFile: async () => '',
	clean: async () => {},
	isGitRepo: async () => true,
	log: async () => [],
	diffFiles: async () => [],
};

const cleanGitAdapter = {
	...gitAdapter,
	statusFiles: async () => [],
	diffNameStatus: async () => [],
};

function getCheck(
	result: Awaited<ReturnType<typeof checkReleaseArtifacts>>,
	name: string
) {
	return result.checks.find((check) => check.name === name);
}

function seedWorkspaceRoot(prefix: string): string {
	const workspaceRoot = mkdtempSync(join(tmpdir(), prefix));
	mkdirSync(join(workspaceRoot, '.changeset'), { recursive: true });
	writeFileSync(
		join(workspaceRoot, 'package.json'),
		JSON.stringify(
			{ name: 'fixture', version: '1.0.0', private: true },
			null,
			2
		)
	);
	return workspaceRoot;
}

function seedReleaseWorkspace(): string {
	const dir = mkdtempSync(join(tmpdir(), 'contractspec-release-service-'));
	mkdirSync(join(dir, '.changeset'), { recursive: true });
	mkdirSync(join(dir, 'packages', 'libs', 'contracts-spec'), {
		recursive: true,
	});

	writeFileSync(
		join(dir, 'package.json'),
		JSON.stringify(
			{
				name: 'contractspec-fixture',
				version: '0.0.0',
				workspaces: ['packages/*/*'],
				private: true,
			},
			null,
			2
		)
	);
	writeFileSync(
		join(dir, '.contractsrc.json'),
		JSON.stringify(
			{
				release: {
					agentTargets: ['codex', 'claude-code'],
				},
			},
			null,
			2
		)
	);
	writeFileSync(
		join(dir, '.changeset', 'workflow-runtime.md'),
		`---
"@contractspec/lib.contracts-spec": patch
---

Fix workflow runtime packaging
`
	);
	writeFileSync(
		join(dir, '.changeset', 'workflow-runtime.release.yaml'),
		`schemaVersion: "1"
slug: workflow-runtime
summary: Fix workflow runtime packaging
isBreaking: false
packages:
  - name: "@contractspec/lib.contracts-spec"
    releaseType: patch
validation:
  commands:
    - contractspec release check --strict
  evidence:
    - local fixture
`
	);
	writeFileSync(
		join(dir, '.changeset', 'historical-release.release.yaml'),
		`schemaVersion: "1"
slug: historical-release
summary: Historical release
isBreaking: false
packages:
  - name: "@contractspec/lib.contracts-spec"
    releaseType: patch
    version: "5.0.4"
validation:
  commands:
    - contractspec release check --strict
  evidence:
    - historical fixture
`
	);
	writeFileSync(
		join(dir, 'packages', 'libs', 'contracts-spec', 'package.json'),
		JSON.stringify(
			{
				name: '@contractspec/lib.contracts-spec',
				version: '5.0.5',
			},
			null,
			2
		)
	);

	return dir;
}

describe('buildReleaseArtifacts', () => {
	it('should emit generated release files from changesets and capsules', async () => {
		const workspaceRoot = seedReleaseWorkspace();
		const fs = createNodeFsAdapter(workspaceRoot);

		const result = await buildReleaseArtifacts(
			{
				fs,
				git: gitAdapter,
				logger: createNoopLoggerAdapter(),
			},
			{ workspaceRoot }
		);

		expect(result.releasesBuilt).toBe(1);
		expect(await fs.exists(result.manifestPath)).toBe(true);
		expect(await fs.exists(result.upgradeManifestPath)).toBe(true);
		expect(await fs.exists(result.promptPaths['codex'] ?? '')).toBe(true);
		expect(result.manifest.releases[0]?.version).toBe('5.0.5');
		expect(result.manifest.releases.map((release) => release.slug)).toEqual([
			'workflow-runtime',
		]);
	});

	it('can explicitly emit full-history release artifacts', async () => {
		const workspaceRoot = seedReleaseWorkspace();
		const fs = createNodeFsAdapter(workspaceRoot);

		const result = await buildReleaseArtifacts(
			{
				fs,
				git: gitAdapter,
				logger: createNoopLoggerAdapter(),
			},
			{ workspaceRoot, scope: 'all' }
		);

		expect(result.releasesBuilt).toBe(2);
		expect(
			result.manifest.releases.map((release) => release.slug).sort()
		).toEqual(['historical-release', 'workflow-runtime']);
		expect(
			result.manifest.releases.find(
				(release) => release.slug === 'historical-release'
			)?.packages[0]?.version
		).toBe('5.0.4');
	});

	it('selects changed capsule-only releases after local versioning', async () => {
		const workspaceRoot = seedWorkspaceRoot(
			'contractspec-release-post-version-build-'
		);
		mkdirSync(join(workspaceRoot, 'packages', 'libs', 'contracts-spec'), {
			recursive: true,
		});
		writeFileSync(
			join(workspaceRoot, 'packages', 'libs', 'contracts-spec', 'package.json'),
			JSON.stringify(
				{
					name: '@contractspec/lib.contracts-spec',
					version: '5.0.6',
				},
				null,
				2
			)
		);
		writeFileSync(
			join(workspaceRoot, '.changeset', 'post-version.release.yaml'),
			`schemaVersion: "1"
slug: post-version
summary: Post-version release capsule
isBreaking: false
packages:
  - name: "@contractspec/lib.contracts-spec"
    releaseType: patch
validation:
  commands:
    - contractspec release check --strict
  evidence:
    - local fixture
`
		);
		writeFileSync(
			join(workspaceRoot, '.changeset', 'historical.release.yaml'),
			`schemaVersion: "1"
slug: historical
summary: Historical release capsule
isBreaking: false
packages:
  - name: "@contractspec/lib.contracts-spec"
    releaseType: patch
    version: "5.0.1"
validation:
  commands:
    - contractspec release check --strict
  evidence:
    - historical fixture
`
		);
		const fs = createNodeFsAdapter(workspaceRoot);

		const result = await buildReleaseArtifacts(
			{
				fs,
				git: {
					...gitAdapter,
					statusFiles: async () => [
						{ status: 'M', path: '.changeset/post-version.release.yaml' },
					],
				},
				logger: createNoopLoggerAdapter(),
			},
			{ workspaceRoot }
		);

		expect(result.manifest.releases.map((release) => release.slug)).toEqual([
			'post-version',
		]);
	});

	it('selects changed capsule-only releases from an explicit CI baseline', async () => {
		const workspaceRoot = seedWorkspaceRoot('contractspec-release-ci-build-');
		writeFileSync(
			join(workspaceRoot, '.changeset', 'ci-current.release.yaml'),
			`schemaVersion: "1"
slug: ci-current
summary: CI current release capsule
isBreaking: false
packages:
  - name: "fixture"
    releaseType: patch
validation:
  commands:
    - contractspec release check --strict
  evidence:
    - ci fixture
`
		);
		writeFileSync(
			join(workspaceRoot, '.changeset', 'ci-history.release.yaml'),
			`schemaVersion: "1"
slug: ci-history
summary: CI historical release capsule
isBreaking: false
packages:
  - name: "fixture"
    releaseType: patch
validation:
  commands:
    - contractspec release check --strict
  evidence:
    - historical fixture
`
		);
		const fs = createNodeFsAdapter(workspaceRoot);

		const result = await buildReleaseArtifacts(
			{
				fs,
				git: {
					...gitAdapter,
					diffNameStatus: async () => [
						{ status: 'A', path: '.changeset/ci-current.release.yaml' },
					],
				},
				logger: createNoopLoggerAdapter(),
			},
			{ workspaceRoot, baseline: 'event-base' }
		);

		expect(result.manifest.releases.map((release) => release.slug)).toEqual([
			'ci-current',
		]);
	});

	it('keeps generated timestamps stable across identical rebuilds', async () => {
		const workspaceRoot = seedReleaseWorkspace();
		const fs = createNodeFsAdapter(workspaceRoot);
		const adapters = {
			fs,
			git: cleanGitAdapter,
			logger: createNoopLoggerAdapter(),
		};

		await buildReleaseArtifacts(adapters, { workspaceRoot });
		const manifestPath = join(
			workspaceRoot,
			'generated',
			'releases',
			'manifest.json'
		);
		const first = await fs.readFile(manifestPath);
		await buildReleaseArtifacts(adapters, { workspaceRoot });
		const second = await fs.readFile(manifestPath);

		expect(JSON.parse(second).generatedAt).toBe(JSON.parse(first).generatedAt);
		expect(second).toBe(first);
	});
});

describe('checkReleaseArtifacts', () => {
	it('keeps the changesets check passing when paired markdown changesets exist', async () => {
		const workspaceRoot = seedReleaseWorkspace();
		const fs = createNodeFsAdapter(workspaceRoot);

		const result = await checkReleaseArtifacts(
			{
				fs,
				git: gitAdapter,
				logger: createNoopLoggerAdapter(),
			},
			{ workspaceRoot, strict: false }
		);

		expect(result.success).toBe(true);
		expect(getCheck(result, 'changesets')).toEqual({
			name: 'changesets',
			ok: true,
			message: 'Found 1 release changeset(s).',
		});
	});

	it('treats a capsules-only post-version state as valid', async () => {
		const workspaceRoot = seedWorkspaceRoot(
			'contractspec-release-post-version-'
		);
		writeFileSync(
			join(workspaceRoot, '.changeset', 'post-version.release.yaml'),
			`schemaVersion: "1"
slug: post-version
summary: Post-version release capsule
isBreaking: false
packages:
  - name: "@contractspec/lib.contracts-spec"
    releaseType: patch
validation:
  commands:
    - contractspec release check --strict
  evidence:
    - local fixture
`
		);
		const fs = createNodeFsAdapter(workspaceRoot);

		const result = await checkReleaseArtifacts(
			{
				fs,
				git: gitAdapter,
				logger: createNoopLoggerAdapter(),
			},
			{ workspaceRoot, strict: false }
		);

		expect(result.success).toBe(true);
		expect(getCheck(result, 'changesets')).toEqual({
			name: 'changesets',
			ok: true,
			message:
				'No pending release changesets found; release capsules are present.',
		});
		expect(
			result.warnings.includes('No pending release changesets were found.')
		).toBe(false);
	});

	it('still reports a missing changeset state when neither markdown nor capsules exist', async () => {
		const workspaceRoot = seedWorkspaceRoot('contractspec-release-empty-');
		const fs = createNodeFsAdapter(workspaceRoot);

		const result = await checkReleaseArtifacts(
			{
				fs,
				git: gitAdapter,
				logger: createNoopLoggerAdapter(),
			},
			{ workspaceRoot, strict: false }
		);

		expect(result.success).toBe(true);
		expect(getCheck(result, 'changesets')).toEqual({
			name: 'changesets',
			ok: false,
			message: 'No release changesets found.',
		});
		expect(result.warnings).toContain(
			'No pending release changesets were found.'
		);
	});

	it('should report missing migration notes and evidence for incomplete capsules', async () => {
		const workspaceRoot = seedWorkspaceRoot('contractspec-release-check-');
		writeFileSync(
			join(workspaceRoot, '.changeset', 'breaking-change.md'),
			`---
"@contractspec/lib.contracts-spec": major
---

Breaking runtime change
`
		);
		writeFileSync(
			join(workspaceRoot, '.changeset', 'breaking-change.release.yaml'),
			`schemaVersion: "1"
slug: breaking-change
summary: Breaking runtime change
isBreaking: true
packages:
  - name: "@contractspec/lib.contracts-spec"
    releaseType: major
validation:
  commands: []
  evidence: []
`
		);
		const fs = createNodeFsAdapter(workspaceRoot);

		const result = await checkReleaseArtifacts(
			{
				fs,
				git: gitAdapter,
				logger: createNoopLoggerAdapter(),
			},
			{ workspaceRoot, strict: false }
		);

		expect(result.success).toBe(false);
		expect(
			result.errors.some((error) => error.includes('migration instructions'))
		).toBe(true);
		expect(
			result.errors.some((error) => error.includes('validation evidence'))
		).toBe(true);
	});

	it('still fails incomplete capsules in a capsules-only post-version state', async () => {
		const workspaceRoot = seedWorkspaceRoot(
			'contractspec-release-incomplete-capsule-'
		);
		writeFileSync(
			join(workspaceRoot, '.changeset', 'capsule-only.release.yaml'),
			`schemaVersion: "1"
slug: capsule-only
summary: Capsule-only release
isBreaking: true
packages:
  - name: "@contractspec/lib.contracts-spec"
    releaseType: major
validation:
  commands: []
  evidence: []
`
		);
		const fs = createNodeFsAdapter(workspaceRoot);

		const result = await checkReleaseArtifacts(
			{
				fs,
				git: gitAdapter,
				logger: createNoopLoggerAdapter(),
			},
			{ workspaceRoot, strict: false }
		);

		expect(result.success).toBe(false);
		expect(getCheck(result, 'changesets')).toEqual({
			name: 'changesets',
			ok: true,
			message:
				'No pending release changesets found; release capsules are present.',
		});
		expect(
			result.errors.some((error) => error.includes('migration instructions'))
		).toBe(true);
		expect(
			result.errors.some((error) => error.includes('validation evidence'))
		).toBe(true);
	});
});
