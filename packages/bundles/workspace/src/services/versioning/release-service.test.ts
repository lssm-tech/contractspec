import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'bun:test';
import { createNodeFsAdapter } from '../../adapters/fs.node';
import { createNoopLoggerAdapter } from '../../adapters/logger';
import { buildReleaseArtifacts, checkReleaseArtifacts } from './release-service';

const gitAdapter = {
	currentBranch: async () => 'main',
	showFile: async () => '',
	clean: async () => {},
	isGitRepo: async () => true,
	log: async () => [],
	diffFiles: async () => [],
};

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
	});
});

describe('checkReleaseArtifacts', () => {
	it('should report missing migration notes and evidence for incomplete capsules', async () => {
		const workspaceRoot = mkdtempSync(
			join(tmpdir(), 'contractspec-release-check-')
		);
		mkdirSync(join(workspaceRoot, '.changeset'), { recursive: true });
		writeFileSync(
			join(workspaceRoot, 'package.json'),
			JSON.stringify({ name: 'fixture', version: '1.0.0', private: true }, null, 2)
		);
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
		expect(result.errors.some((error) => error.includes('migration instructions'))).toBe(
			true
		);
		expect(result.errors.some((error) => error.includes('validation evidence'))).toBe(
			true
		);
	});
});
