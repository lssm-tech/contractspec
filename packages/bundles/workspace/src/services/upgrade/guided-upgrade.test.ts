import { describe, expect, it } from 'bun:test';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createNodeFsAdapter } from '../../adapters/fs.node';
import { createNoopLoggerAdapter } from '../../adapters/logger';
import { analyzeGuidedUpgrade, applyGuidedUpgrade } from './guided-upgrade';

function seedUpgradeWorkspace(): string {
	const dir = mkdtempSync(join(tmpdir(), 'contractspec-guided-upgrade-'));
	mkdirSync(join(dir, 'src'), { recursive: true });
	mkdirSync(join(dir, 'generated', 'releases'), { recursive: true });

	writeFileSync(
		join(dir, 'package.json'),
		JSON.stringify(
			{
				name: 'consumer-app',
				version: '1.0.0',
				dependencies: {
					'@contractspec/lib.contracts-spec': '5.0.4',
				},
			},
			null,
			2
		)
	);
	writeFileSync(join(dir, '.contractsrc.json'), JSON.stringify({}, null, 2));
	writeFileSync(
		join(dir, 'src', 'workflow.ts'),
		`import { defineWorkflow } from '@contractspec/lib.contracts-spec/workflow';\n`
	);
	writeFileSync(
		join(dir, 'generated', 'releases', 'upgrade-manifest.json'),
		JSON.stringify(
			{
				generatedAt: '2026-03-27T12:00:00.000Z',
				releases: [
					{
						slug: 'workflow-import-split',
						version: '5.0.5',
						summary: 'Split workflow imports into safe subpaths',
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
						upgradeSteps: [
							{
								id: 'rewrite-workflow-import',
								title: 'Rewrite workflow import',
								summary: 'Use the workflow/spec subpath.',
								level: 'auto',
								instructions: ['Rewrite workflow imports to workflow/spec'],
								autofixes: [
									{
										id: 'import-rewrite-1',
										kind: 'import-rewrite',
										title: 'Rewrite workflow import',
										summary: 'Use workflow/spec',
										from: '@contractspec/lib.contracts-spec/workflow',
										to: '@contractspec/lib.contracts-spec/workflow/spec',
									},
								],
							},
						],
						validation: {
							commands: ['contractspec release check --strict'],
							evidence: ['fixture manifest'],
						},
					},
				],
			},
			null,
			2
		)
	);

	return dir;
}

function seedNestedMonorepoUpgradeWorkspace(): string {
	const monorepoRoot = mkdtempSync(
		join(tmpdir(), 'contractspec-guided-upgrade-monorepo-')
	);
	const appRoot = join(monorepoRoot, 'apps', 'consumer-app');
	mkdirSync(appRoot, { recursive: true });
	mkdirSync(join(appRoot, 'generated', 'releases'), { recursive: true });
	writeFileSync(join(monorepoRoot, 'bun.lock'), '');
	writeFileSync(
		join(monorepoRoot, 'package.json'),
		JSON.stringify(
			{
				name: 'meta-repo',
				private: true,
				workspaces: ['apps/*'],
			},
			null,
			2
		)
	);
	writeFileSync(
		join(appRoot, 'package.json'),
		JSON.stringify(
			{
				name: 'consumer-app',
				version: '1.0.0',
				dependencies: {
					'@contractspec/lib.contracts-spec': '5.0.4',
				},
			},
			null,
			2
		)
	);
	writeFileSync(
		join(appRoot, '.contractsrc.json'),
		JSON.stringify({}, null, 2)
	);
	writeFileSync(
		join(appRoot, 'generated', 'releases', 'upgrade-manifest.json'),
		JSON.stringify(
			{
				generatedAt: '2026-03-27T12:00:00.000Z',
				releases: [
					{
						slug: 'workflow-import-split',
						version: '5.0.5',
						summary: 'Split workflow imports into safe subpaths',
						date: '2026-03-27',
						isBreaking: false,
						packages: [
							{
								name: '@contractspec/lib.contracts-spec',
								releaseType: 'patch',
								version: '5.0.5',
							},
						],
						audiences: [],
						deprecations: [],
						migrationInstructions: [],
						upgradeSteps: [],
						validation: {
							commands: ['contractspec release check --strict'],
							evidence: ['fixture manifest'],
						},
					},
				],
			},
			null,
			2
		)
	);

	return appRoot;
}

describe('analyzeGuidedUpgrade', () => {
	it('should resolve upgrade targets from the generated manifest', async () => {
		const workspaceRoot = seedUpgradeWorkspace();
		const result = await analyzeGuidedUpgrade(
			{
				fs: createNodeFsAdapter(workspaceRoot),
				logger: createNoopLoggerAdapter(),
			},
			{ workspaceRoot, agentTarget: 'codex' }
		);

		expect(result.plan.targetPackages[0]?.targetVersion).toBe('5.0.5');
		expect(
			result.humanChecklist.some((item) =>
				item.includes('Rewrite workflow import')
			)
		).toBe(true);
	});

	it('should resolve manifests relative to the current package root inside a parent monorepo', async () => {
		const workspaceRoot = seedNestedMonorepoUpgradeWorkspace();
		const result = await analyzeGuidedUpgrade(
			{
				fs: createNodeFsAdapter(workspaceRoot),
				logger: createNoopLoggerAdapter(),
			},
			{
				workspaceRoot,
				manifestPaths: ['generated/releases/upgrade-manifest.json'],
				agentTarget: 'codex',
			}
		);

		expect(result.manifestPath).toBe(
			join(workspaceRoot, 'generated', 'releases', 'upgrade-manifest.json')
		);
		expect(result.plan.targetPackages[0]?.targetVersion).toBe('5.0.5');
	});
});

describe('applyGuidedUpgrade', () => {
	it('should apply deterministic package, config, and import autofixes', async () => {
		const workspaceRoot = seedUpgradeWorkspace();
		const fs = createNodeFsAdapter(workspaceRoot);

		const result = await applyGuidedUpgrade(
			{
				fs,
				logger: createNoopLoggerAdapter(),
			},
			{ workspaceRoot, agentTarget: 'codex' }
		);

		const packageJson = JSON.parse(
			await fs.readFile(join(workspaceRoot, 'package.json'))
		) as { dependencies: Record<string, string> };
		const config = JSON.parse(
			await fs.readFile(join(workspaceRoot, '.contractsrc.json'))
		) as Record<string, unknown>;
		const workflowSource = await fs.readFile(
			join(workspaceRoot, 'src', 'workflow.ts')
		);

		expect(result.appliedAutofixes?.length).toBeGreaterThan(0);
		expect(packageJson.dependencies['@contractspec/lib.contracts-spec']).toBe(
			'5.0.5'
		);
		expect(config['$schema']).toBe(
			'./node_modules/contractspec/contractsrc.schema.json'
		);
		expect(config['release']).toBeDefined();
		expect(workflowSource).toContain(
			'@contractspec/lib.contracts-spec/workflow/spec'
		);
	});
});
