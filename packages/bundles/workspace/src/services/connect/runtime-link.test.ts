import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
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
	loadStoredDecision,
	replayConnectDecision,
	resolveStoragePaths,
	resolveWorkspace,
	verifyConnectMutation,
} = await import('./index');

let tempDir: string | null = null;

describe('connect runtime link', () => {
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

	it('persists a real control-plane decision and replays it', async () => {
		const { fs, packageRoot } = createWorkspace();
		mockListSpecs.mockResolvedValue([
			createSpec(join(packageRoot, 'src', 'runtime', 'foo.ts'), 'runtime.foo'),
		]);
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
				taskId: 'task-runtime',
				tool: 'acp.fs.access',
				workspaceRoot: packageRoot,
			},
			{ controlPlane }
		);
		const workspace = resolveWorkspace({
			config: createConfig(),
			cwd: packageRoot,
			packageRoot,
			workspaceRoot: packageRoot,
		});
		const stored = await loadStoredDecision(
			fs,
			resolveStoragePaths(workspace),
			verified.patchVerdict.decisionId
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

		expect(verified.patchVerdict.controlPlane.decisionId).toBeDefined();
		expect(verified.patchVerdict.controlPlane.approvalStatus).toBe(
			'not_required'
		);
		expect(stored.envelope?.runtimeLink?.decisionId).toBe(
			verified.patchVerdict.controlPlane.decisionId
		);
		expect(replay.source).toBe('local+control-plane');
		const runtimeDecisionId = verified.patchVerdict.controlPlane.decisionId;
		expect(runtimeDecisionId).toBeDefined();
		expect((replay.trace as { decision: { id: string } }).decision.id).toBe(
			runtimeDecisionId!
		);
	});
});

function createWorkspace() {
	tempDir = mkdtempSync(join(tmpdir(), 'contractspec-connect-runtime-link-'));
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
		timestamp: '2026-04-05T00:00:00.000Z',
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
