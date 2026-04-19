import { describe, expect, it } from 'bun:test';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createNodeFsAdapter } from '../../adapters/fs.node';
import { createNoopLoggerAdapter } from '../../adapters/logger';
import {
	buildReleaseArtifacts,
	checkReleaseArtifacts,
	prepareReleaseAuthoring,
	saveReleaseDraft,
} from './index';

const gitAdapter = {
	currentBranch: async () => 'main',
	showFile: async () => '',
	clean: async () => {},
	isGitRepo: async () => true,
	log: async () => [],
	diffFiles: async () => [],
};

function seedWorkspace(prefix: string): string {
	const root = mkdtempSync(join(tmpdir(), prefix));
	mkdirSync(join(root, '.changeset'), { recursive: true });
	mkdirSync(join(root, 'packages', 'libs', 'knowledge'), { recursive: true });
	writeFileSync(
		join(root, 'package.json'),
		JSON.stringify(
			{ name: 'release-authoring-fixture', version: '0.0.0', private: true },
			null,
			2
		)
	);
	writeFileSync(
		join(root, 'packages', 'libs', 'knowledge', 'package.json'),
		JSON.stringify(
			{ name: '@contractspec/lib.knowledge', version: '2.3.4' },
			null,
			2
		)
	);
	return root;
}

describe('release authoring', () => {
	it('round-trips markdown-rich release content through canonical YAML output', async () => {
		const workspaceRoot = seedWorkspace('contractspec-release-authoring-');
		const fs = createNodeFsAdapter(workspaceRoot);

		await saveReleaseDraft(
			{ fs, git: gitAdapter, logger: createNoopLoggerAdapter() },
			{
				workspaceRoot,
				draft: {
					slug: 'knowledge-indexed-payload-hardening',
					summary:
						'Persist canonical `payload.text`, keep `metadata:text` optional, and document the new retrieval behavior.',
					releaseType: 'patch',
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
								'Consumers can stop maintaining the old `metadata.text` workaround.',
						},
					],
					deprecations: ['`metadata.text` backfill is no longer required.'],
					migrationInstructions: [
						{
							id: 'remove-workaround',
							title: 'Remove the metadata text shim',
							summary:
								'Delete any pre-upsert copy step that mirrors fragment text into `metadata.text`.',
							required: false,
							when: 'If downstream retrieval added the shim during ingestion.',
							steps: [
								'Upgrade to the patched `@contractspec/lib.knowledge` release.',
								'Delete the shim and rerun one indexing cycle.',
							],
						},
					],
					upgradeSteps: [
						{
							id: 'verify-payload',
							title: 'Verify payload text',
							summary:
								'Confirm vector payloads now expose canonical text without the shim.',
							level: 'manual',
							instructions: [
								'Inspect one stored payload.',
								'Confirm the retrieved snippet includes readable text.',
							],
						},
					],
					validation: {
						commands: ['bun test packages/libs/knowledge'],
						evidence: [
							'Payloads now keep `payload.text` even when metadata contains `notes:keep`.',
						],
					},
				},
			}
		);

		const built = await buildReleaseArtifacts(
			{ fs, git: gitAdapter, logger: createNoopLoggerAdapter() },
			{ workspaceRoot }
		);

		expect(built.manifest.releases[0]?.summary).toContain('`payload.text`');
		expect(
			built.manifest.releases[0]?.migrationInstructions[0]?.steps[0]
		).toContain('`@contractspec/lib.knowledge`');
		expect(built.manifest.releases[0]?.validation.evidence[0]).toContain(
			'`payload.text`'
		);

		const checked = await checkReleaseArtifacts(
			{ fs, git: gitAdapter, logger: createNoopLoggerAdapter() },
			{ workspaceRoot, strict: false }
		);
		expect(checked.success).toBe(true);
	});

	it('reports actionable parse errors for invalid release capsules', async () => {
		const workspaceRoot = seedWorkspace('contractspec-release-parse-error-');
		const fs = createNodeFsAdapter(workspaceRoot);
		writeFileSync(
			join(
				workspaceRoot,
				'.changeset',
				'knowledge-indexed-payload-hardening.md'
			),
			`---
"@contractspec/lib.knowledge": patch
---

Broken release capsule fixture
`
		);
		writeFileSync(
			join(
				workspaceRoot,
				'.changeset',
				'knowledge-indexed-payload-hardening.release.yaml'
			),
			`schemaVersion: "1"
slug: knowledge-indexed-payload-hardening
summary: Broken fixture
isBreaking: false
packages:
  - name: "@contractspec/lib.knowledge"
    releaseType: patch
validation:
  commands:
    - bun test packages/libs/knowledge
  evidence:
    - \`Payloads now keep readable text\`
    - second bullet
`
		);

		const checked = await checkReleaseArtifacts(
			{ fs, git: gitAdapter, logger: createNoopLoggerAdapter() },
			{ workspaceRoot, strict: false }
		);
		expect(checked.success).toBe(false);
		expect(checked.errors[0]).toContain(
			'knowledge-indexed-payload-hardening.release.yaml'
		);
		expect(checked.errors[0]).toContain(
			'contractspec release edit knowledge-indexed-payload-hardening'
		);

		await expect(
			buildReleaseArtifacts(
				{ fs, git: gitAdapter, logger: createNoopLoggerAdapter() },
				{ workspaceRoot }
			)
		).rejects.toThrow(
			'contractspec release edit knowledge-indexed-payload-hardening'
		);
	});

	it('loads the existing pending release slug automatically when only one exists', async () => {
		const workspaceRoot = seedWorkspace('contractspec-release-existing-');
		const fs = createNodeFsAdapter(workspaceRoot);
		writeFileSync(
			join(workspaceRoot, '.changeset', 'workflow-runtime.md'),
			`---
"@contractspec/lib.knowledge": patch
---

Fix workflow runtime packaging
`
		);
		writeFileSync(
			join(workspaceRoot, '.changeset', 'workflow-runtime.release.yaml'),
			`schemaVersion: "1"
slug: workflow-runtime
summary: Fix workflow runtime packaging
isBreaking: false
packages:
  - name: "@contractspec/lib.knowledge"
    releaseType: patch
validation:
  commands:
    - contractspec release check --strict
  evidence:
    - local fixture
`
		);

		const result = await prepareReleaseAuthoring(
			{ fs, git: gitAdapter, logger: createNoopLoggerAdapter() },
			{ workspaceRoot }
		);

		expect(result.source).toBe('existing');
		expect(result.draft.slug).toBe('workflow-runtime');
		expect(result.draft.summary).toBe('Fix workflow runtime packaging');
	});
});
