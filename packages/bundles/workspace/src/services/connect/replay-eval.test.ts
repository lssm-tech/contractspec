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
import {
	ChannelTraceService,
	InMemoryChannelRuntimeStore,
} from '@contractspec/integration.runtime/channel';
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

const {
	createConnectControlPlaneRuntime,
	evaluateConnectDecision,
	replayConnectDecision,
	verifyConnectMutation,
} = await import('./index');
let tempDir: string | null = null;

describe('connect replay and eval', () => {
	beforeEach(() => {
		mockDetectImpact.mockReset();
		mockListSpecs.mockReset();
	});

	afterEach(() => {
		if (tempDir) {
			rmSync(tempDir, { recursive: true, force: true });
			tempDir = null;
		}
	});

	it('reconstructs a review-required decision and injects harness context', async () => {
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
		const store = new InMemoryChannelRuntimeStore();
		const controlPlane = createConnectControlPlaneRuntime({
			store,
			traceService: new ChannelTraceService(store),
			now: () => new Date('2026-04-05T10:00:00.000Z'),
		});

		const verified = await verifyConnectMutation(
			createAdapters(fs),
			{
				config: createConfig(),
				cwd: packageRoot,
				operation: 'edit',
				packageRoot,
				path: 'src/runtime/foo.ts',
				taskId: 'task-break',
				tool: 'acp.fs.access',
				baseline: 'origin/main',
				workspaceRoot: packageRoot,
			},
			{
				controlPlane,
			}
		);
		const replay = await replayConnectDecision(
			{ fs },
			{
				config: createConfig(),
				cwd: packageRoot,
				decisionId: verified.patchVerdict.decisionId,
				packageRoot,
				workspaceRoot: packageRoot,
			},
			controlPlane
		);
		let capturedContext: Record<string, unknown> | undefined;
		const evaluation = await evaluateConnectDecision(
			{ fs },
			{
				config: createConfig(),
				cwd: packageRoot,
				decisionId: verified.patchVerdict.decisionId,
				packageRoot,
				scenarioKey: 'connect.safe-refactor',
				workspaceRoot: packageRoot,
			},
			{
				runScenarioEvaluation: async ({ context }) => {
					capturedContext = context;
					return { ok: true };
				},
				runSuiteEvaluation: async () => ({ ok: false }),
			}
		);

		const runtimeDecisionId = verified.patchVerdict.controlPlane.decisionId;
		expect(runtimeDecisionId).toBeDefined();
		expect(verified.patchVerdict.verdict).toBe('require_review');
		expect(replay.source).toBe('local+control-plane');
		expect((replay.trace as { decision: { id: string } }).decision.id).toBe(
			runtimeDecisionId!
		);
		expect(capturedContext?.controlPlanePlanId).toBe(
			(replay.trace as { decision: { actionPlan: { id: string } } }).decision
				.actionPlan.id
		);
		expect(capturedContext?.controlPlaneExecutionId).toBe(runtimeDecisionId!);
		expect(capturedContext?.metadata).toEqual({
			approvalStatus: 'pending',
			branch: 'main',
			decisionId: verified.patchVerdict.decisionId,
			taskId: 'task-break',
		});
		expect(evaluation.evaluation).toEqual({ ok: true });
		expect(
			readFileSync(join(verified.historyDir, 'evaluation-result.json'), 'utf8')
		).toContain('"ok": true');
	});
});

function createWorkspace() {
	tempDir = mkdtempSync(join(tmpdir(), 'contractspec-connect-replay-'));
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

function createConfig() {
	return {
		...DEFAULT_CONTRACTSRC,
		connect: {
			...DEFAULT_CONTRACTSRC.connect,
			enabled: true,
			policy: {
				...DEFAULT_CONTRACTSRC.connect?.policy,
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
