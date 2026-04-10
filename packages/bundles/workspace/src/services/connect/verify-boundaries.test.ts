import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test';
import {
	mkdirSync,
	mkdtempSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from 'node:fs';
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

const { listConnectReviewPackets, verifyConnectMutation } = await import(
	'./index'
);
let tempDir: string | null = null;

describe('connect verify boundaries', () => {
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

	it('permits a safe scoped refactor and persists local evidence', async () => {
		const { fs, packageRoot } = createWorkspace();
		mockListSpecs.mockResolvedValue([
			createSpec(join(packageRoot, 'src', 'runtime', 'foo.ts'), 'runtime.foo'),
		]);

		const result = await verifyConnectMutation(
			createAdapters(fs),
			createFsInput(packageRoot, 'task-safe', 'src/runtime/foo.ts'),
			{
				runCommand: async (command) => ({
					command,
					exitCode: 0,
					stderr: '',
					stdout: 'ok',
				}),
			}
		);

		expect(result.patchVerdict.verdict).toBe('permit');
		expect(result.patchVerdict.controlPlane.verdict).toBe('autonomous');
		const auditRecord = readAuditRecords(packageRoot)[0]!;
		expect(auditRecord).toMatchObject({
			eventType: 'connect.verify',
			repoId: '@demo/connect-app',
			verdict: 'permit',
			tool: 'acp.fs.access',
			actor: {
				id: 'cli:task-safe',
				type: 'human',
			},
			adapter: {
				channel: 'cli',
				source: 'connect',
				tool: 'acp.fs.access',
			},
		});
		expect(auditRecord.refs.contextPack).toContain(
			`.contractspec/connect/decisions/${result.patchVerdict.decisionId}/context-pack.json`
		);
		expect(auditRecord.refs.planPacket).toContain(
			`.contractspec/connect/decisions/${result.patchVerdict.decisionId}/plan-packet.json`
		);
		expect(auditRecord.refs.patchVerdict).toContain(
			`.contractspec/connect/decisions/${result.patchVerdict.decisionId}/patch-verdict.json`
		);
	});

	it('requires review for protected paths and emits a review packet', async () => {
		const { fs, packageRoot } = createWorkspace();
		const config = createConfig({
			protectedPaths: ['packages/libs/contracts-spec/**'],
		});
		mockListSpecs.mockResolvedValue([
			createSpec(
				join(packageRoot, 'packages', 'libs', 'contracts-spec', 'index.ts'),
				'contracts.policy',
				'policy'
			),
		]);

		const result = await verifyConnectMutation(
			createAdapters(fs),
			createFsInput(
				packageRoot,
				'task-review',
				'packages/libs/contracts-spec/index.ts',
				'write',
				config
			)
		);
		const packets = await listConnectReviewPackets(
			{ fs },
			{
				config,
				cwd: packageRoot,
				packageRoot,
				workspaceRoot: packageRoot,
			}
		);

		expect(result.patchVerdict.verdict).toBe('require_review');
		expect(result.patchVerdict.controlPlane.verdict).toBe('assist');
		expect(result.patchVerdict.controlPlane.requiresApproval).toBe(true);
		expect(result.reviewPacket?.sourceDecisionId).toBe(
			result.patchVerdict.decisionId
		);
		expect(packets).toHaveLength(1);
		const auditRecord = readAuditRecords(packageRoot)[0]!;
		expect(auditRecord.refs.reviewPacket).toContain(
			`.contractspec/connect/decisions/${result.patchVerdict.decisionId}/review-packet.json`
		);
	});
});

function readAuditRecords(packageRoot: string): Array<Record<string, any>> {
	return readFileSync(
		join(packageRoot, '.contractspec', 'connect', 'audit.ndjson'),
		'utf8'
	)
		.trim()
		.split('\n')
		.filter(Boolean)
		.map((line) => JSON.parse(line) as Record<string, any>);
}

function createWorkspace() {
	tempDir = mkdtempSync(join(tmpdir(), 'contractspec-connect-verify-'));
	mkdirSync(join(tempDir, 'src', 'runtime'), { recursive: true });
	mkdirSync(join(tempDir, 'packages', 'libs', 'contracts-spec'), {
		recursive: true,
	});
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
	writeFileSync(
		join(tempDir, 'packages', 'libs', 'contracts-spec', 'index.ts'),
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
	operation = 'edit',
	config = createConfig()
) {
	return {
		config,
		cwd: packageRoot,
		operation,
		packageRoot,
		path,
		taskId,
		tool: 'acp.fs.access' as const,
		workspaceRoot: packageRoot,
	};
}

function createConfig(policyOverrides: { protectedPaths?: string[] } = {}) {
	return {
		...DEFAULT_CONTRACTSRC,
		connect: {
			...DEFAULT_CONTRACTSRC.connect,
			enabled: true,
			policy: {
				...DEFAULT_CONTRACTSRC.connect?.policy,
				...policyOverrides,
				smokeChecks: ['bun run typecheck'],
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
