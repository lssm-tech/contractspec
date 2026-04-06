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

const { verifyConnectMutation } = await import('./index');
let tempDir: string | null = null;

describe('connect verify impact policy', () => {
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

	it('requires review for unknown impact and command-review policy', async () => {
		const { fs, packageRoot } = createWorkspace();
		mockListSpecs.mockResolvedValue([]);

		const unknownImpact = await verifyConnectMutation(
			createAdapters(fs),
			createFsInput(packageRoot, 'task-unknown', 'src/unknown.ts')
		);
		const commandReview = await verifyConnectMutation(createAdapters(fs), {
			config: createConfig({}, { review: ['git push'] }),
			cwd: packageRoot,
			packageRoot,
			taskId: 'task-command',
			tool: 'acp.terminal.exec',
			command: 'git push origin HEAD',
			touchedPaths: ['src/runtime/foo.ts'],
			workspaceRoot: packageRoot,
		});

		expect(unknownImpact.patchVerdict.verdict).toBe('require_review');
		expect(commandReview.patchVerdict.verdict).toBe('require_review');
	});

	it('requires review on breaking changes', async () => {
		const { fs, packageRoot } = createWorkspace();
		mockListSpecs.mockResolvedValue([
			createSpec(join(packageRoot, 'src', 'runtime', 'foo.ts'), 'runtime.foo'),
		]);
		mockDetectImpact.mockResolvedValue(
			createImpactResult({
				hasBreaking: true,
				status: 'breaking',
			})
		);

		const result = await verifyConnectMutation(createAdapters(fs), {
			...createFsInput(packageRoot, 'task-break', 'src/runtime/foo.ts'),
			baseline: 'origin/main',
		});

		expect(result.patchVerdict.verdict).toBe('require_review');
		expect(
			result.patchVerdict.checks.find((check) => check.id === 'impact-analysis')
				?.status
		).toBe('fail');
	});

	it('maps destructive commands through the configured review threshold', async () => {
		const { fs, packageRoot } = createWorkspace();
		mockListSpecs.mockResolvedValue([]);

		const result = await verifyConnectMutation(createAdapters(fs), {
			config: createConfig({
				reviewThresholds: {
					destructiveCommand: 'require_review',
				},
			}),
			cwd: packageRoot,
			packageRoot,
			taskId: 'task-destructive-review',
			tool: 'acp.terminal.exec',
			command: 'rm -rf generated',
			touchedPaths: [],
			workspaceRoot: packageRoot,
		});

		expect(result.patchVerdict.verdict).toBe('require_review');
		expect(result.patchVerdict.controlPlane).toMatchObject({
			verdict: 'assist',
			requiresApproval: true,
		});
		expect(
			result.patchVerdict.checks.find((check) => check.id === 'command-policy')
		).toMatchObject({
			detail: 'Command policy: destructive (rm -rf generated)',
			status: 'fail',
		});
	});
});

function createWorkspace() {
	tempDir = mkdtempSync(join(tmpdir(), 'contractspec-connect-verify-impact-'));
	mkdirSync(join(tempDir, 'src', 'runtime'), { recursive: true });
	writeFileSync(
		join(tempDir, 'package.json'),
		'{"name":"@demo/connect-app"}\n',
		'utf8'
	);
	writeFileSync(
		join(tempDir, 'src', 'runtime', 'foo.ts'),
		'export {};\n',
		'utf8'
	);
	return {
		fs: createNodeFsAdapter(tempDir),
		packageRoot: tempDir,
	};
}

function createAdapters(fs: ReturnType<typeof createNodeFsAdapter>) {
	return {
		fs,
		git: {
			clean: async () => {},
			currentBranch: async () => 'main',
			diffFiles: async () => [],
			isGitRepo: async () => true,
			log: async () => [],
			showFile: async () => '',
		},
		logger: {
			createProgress: () => ({
				fail: () => {},
				start: () => {},
				stop: () => {},
				succeed: () => {},
				update: () => {},
				warn: () => {},
			}),
			debug: () => {},
			error: () => {},
			info: () => {},
			warn: () => {},
		},
	};
}

function createFsInput(
	packageRoot: string,
	taskId: string,
	path: string,
	config = createConfig()
) {
	return {
		config,
		cwd: packageRoot,
		operation: 'edit',
		packageRoot,
		path,
		taskId,
		tool: 'acp.fs.access' as const,
		workspaceRoot: packageRoot,
	};
}

function createConfig(
	policyOverrides: {
		reviewThresholds?: {
			destructiveCommand?: 'permit' | 'rewrite' | 'require_review' | 'deny';
		};
	} = {},
	commandOverrides: {
		allow?: string[];
		deny?: string[];
		review?: string[];
	} = {}
) {
	return {
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
		timestamp: '2026-04-02T00:00:00.000Z',
		...overrides,
	};
}

function createSpec(filePath: string, key: string): SpecScanResult {
	return {
		filePath,
		hasContent: false,
		hasDefinition: true,
		hasIo: false,
		hasMeta: true,
		hasPayload: false,
		hasPolicy: false,
		key,
		kind: 'command',
		specType: 'operation',
		version: '1.0.0',
	};
}
