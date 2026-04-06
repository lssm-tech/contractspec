import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DEFAULT_CONTRACTSRC } from '@contractspec/lib.contracts-spec/workspace-config';
import type {
	ImpactResult,
	SpecScanResult,
} from '@contractspec/module.workspace';
import { createNodeFsAdapter } from '../../adapters/fs.node';

const mockListSpecs = mock(async (): Promise<SpecScanResult[]> => []);
const mockDetectImpact = mock(
	async (): Promise<ImpactResult> => createImpactResult()
);

mock.module('../list', () => ({
	listSpecs: mockListSpecs,
}));

mock.module('../impact', () => ({
	detectImpact: mockDetectImpact,
}));

const { compileConnectPlanPacket } = await import('./index');

let tempDir: string | null = null;

describe('connect plan policy assessment', () => {
	beforeEach(() => {
		mockDetectImpact.mockReset();
		mockListSpecs.mockReset();
		mockDetectImpact.mockResolvedValue(createImpactResult());
	});

	afterEach(() => {
		if (tempDir) {
			rmSync(tempDir, { recursive: true, force: true });
			tempDir = null;
		}
	});

	it('marks safe scoped plans as approved', async () => {
		const { fs, packageRoot } = createWorkspace();
		mockListSpecs.mockResolvedValue([
			createSpec(join(packageRoot, 'src', 'runtime', 'foo.ts'), 'runtime.foo'),
		]);

		const result = await compileConnectPlanPacket(
			{ fs, git: createGitAdapter() },
			createPlanInput(packageRoot, {
				objective: 'Update runtime file',
				touchedPaths: ['src/runtime/foo.ts'],
			})
		);

		expect(result.planPacket.verificationStatus).toBe('approved');
		expect(result.planPacket.requiredApprovals).toEqual([]);
	});

	it('marks generated-path plans as revise', async () => {
		const { fs, packageRoot } = createWorkspace();
		mockListSpecs.mockResolvedValue([
			createSpec(join(packageRoot, 'src', 'runtime', 'foo.ts'), 'runtime.foo'),
		]);

		const result = await compileConnectPlanPacket(
			{ fs, git: createGitAdapter() },
			createPlanInput(
				packageRoot,
				{
					objective: 'Edit generated runtime file',
					steps: [
						{
							summary: 'Touch generated output',
							paths: ['src/runtime/foo.ts'],
						},
					],
				},
				{
					generatedPaths: ['src/runtime/**'],
					reviewThresholds: {
						contractDrift: 'rewrite',
					},
				}
			)
		);

		expect(result.planPacket.verificationStatus).toBe('revise');
	});

	it('marks protected-path plans as review and requires approval', async () => {
		const { fs, packageRoot } = createWorkspace();
		mockListSpecs.mockResolvedValue([
			createSpec(
				join(packageRoot, 'packages', 'libs', 'contracts-spec', 'index.ts'),
				'contracts.policy',
				'policy'
			),
		]);

		const result = await compileConnectPlanPacket(
			{ fs, git: createGitAdapter() },
			createPlanInput(
				packageRoot,
				{
					objective: 'Update protected contract',
					touchedPaths: ['packages/libs/contracts-spec/index.ts'],
				},
				{
					protectedPaths: ['packages/libs/contracts-spec/**'],
				}
			)
		);

		expect(result.planPacket.verificationStatus).toBe('review');
		expect(result.planPacket.requiredApprovals).toEqual([
			{
				capability: 'controlPlane.execution.approve',
				reason:
					'Protected path packages/libs/contracts-spec/index.ts requires human review.',
			},
		]);
	});

	it('marks unknown-impact plans as review', async () => {
		const { fs, packageRoot } = createWorkspace();
		mockListSpecs.mockResolvedValue([]);

		const result = await compileConnectPlanPacket(
			{ fs, git: createGitAdapter() },
			createPlanInput(packageRoot, {
				objective: 'Update unknown file',
				touchedPaths: ['src/unknown.ts'],
			})
		);

		expect(result.planPacket.verificationStatus).toBe('review');
	});

	it('marks denied commands and immutable paths as denied', async () => {
		const { fs, packageRoot } = createWorkspace();
		mockListSpecs.mockResolvedValue([
			createSpec(join(packageRoot, 'src', 'runtime', 'foo.ts'), 'runtime.foo'),
		]);

		const deniedCommand = await compileConnectPlanPacket(
			{ fs, git: createGitAdapter() },
			createPlanInput(
				packageRoot,
				{
					objective: 'Push changes',
					steps: [
						{
							summary: 'Push branch',
							commands: ['git push --force origin HEAD'],
						},
					],
				},
				{},
				{
					deny: ['git push --force'],
				}
			)
		);
		const immutablePath = await compileConnectPlanPacket(
			{ fs, git: createGitAdapter() },
			createPlanInput(
				packageRoot,
				{
					objective: 'Edit immutable file',
					touchedPaths: ['.changeset/entry.md'],
				},
				{
					immutablePaths: ['.changeset/**'],
				}
			)
		);

		expect(deniedCommand.planPacket.verificationStatus).toBe('denied');
		expect(immutablePath.planPacket.verificationStatus).toBe('denied');
	});
});

function createWorkspace() {
	tempDir = mkdtempSync(join(tmpdir(), 'contractspec-connect-plan-policy-'));
	mkdirSync(join(tempDir, 'src', 'runtime'), { recursive: true });
	mkdirSync(join(tempDir, 'generated', 'docs'), { recursive: true });
	mkdirSync(join(tempDir, 'packages', 'libs', 'contracts-spec'), {
		recursive: true,
	});
	mkdirSync(join(tempDir, '.changeset'), { recursive: true });
	writeFileSync(
		join(tempDir, 'package.json'),
		'{"name":"@demo/connect-plan"}\n',
		'utf8'
	);
	writeFileSync(
		join(tempDir, 'src', 'runtime', 'foo.ts'),
		'export {};\n',
		'utf8'
	);
	writeFileSync(
		join(tempDir, 'generated', 'docs', 'connect.md'),
		'generated\n',
		'utf8'
	);
	writeFileSync(
		join(tempDir, 'packages', 'libs', 'contracts-spec', 'index.ts'),
		'export {};\n',
		'utf8'
	);
	writeFileSync(join(tempDir, '.changeset', 'entry.md'), 'note\n', 'utf8');
	return {
		fs: createNodeFsAdapter(tempDir),
		packageRoot: tempDir,
	};
}

function createGitAdapter(branch = 'main') {
	return {
		clean: async () => {},
		currentBranch: async () => branch,
		diffFiles: async () => [],
		isGitRepo: async () => true,
		log: async () => [],
		showFile: async () => '',
	};
}

function createPlanInput(
	packageRoot: string,
	candidate: {
		objective: string;
		steps?: Array<{
			summary: string;
			paths?: string[];
			commands?: string[];
		}>;
		touchedPaths?: string[];
	},
	policyOverrides: {
		generatedPaths?: string[];
		immutablePaths?: string[];
		protectedPaths?: string[];
		reviewThresholds?: {
			contractDrift?: 'rewrite' | 'require_review' | 'deny' | 'permit';
		};
	} = {},
	commandOverrides: {
		allow?: string[];
		deny?: string[];
		review?: string[];
	} = {}
) {
	return {
		candidate,
		config: {
			...DEFAULT_CONTRACTSRC,
			connect: {
				...DEFAULT_CONTRACTSRC.connect,
				enabled: true,
				commands: commandOverrides,
				policy: {
					...DEFAULT_CONTRACTSRC.connect?.policy,
					...policyOverrides,
					smokeChecks: [],
				},
			},
		},
		cwd: packageRoot,
		packageRoot,
		taskId: 'task-plan',
		workspaceRoot: packageRoot,
	};
}

function createImpactResult(
	overrides: Partial<ImpactResult> = {}
): ImpactResult {
	return {
		addedSpecs: [],
		deltas: [],
		hasBreaking: false,
		hasNonBreaking: false,
		removedSpecs: [],
		status: 'no-impact',
		summary: {
			added: 0,
			breaking: 0,
			info: 0,
			nonBreaking: 0,
			removed: 0,
		},
		timestamp: '2026-04-06T00:00:00.000Z',
		...overrides,
	};
}

function createSpec(
	filePath: string,
	key: string,
	kind: SpecScanResult['kind'] = 'command'
): SpecScanResult {
	return {
		filePath,
		hasContent: false,
		hasDefinition: true,
		hasIo: false,
		hasMeta: true,
		hasPayload: false,
		hasPolicy: kind === 'policy',
		key,
		kind,
		specType: kind === 'policy' ? 'policy' : 'operation',
		version: '1.0.0',
	};
}
