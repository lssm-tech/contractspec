import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DEFAULT_CONTRACTSRC } from '@contractspec/lib.contracts-spec/workspace-config';
import type { SpecScanResult } from '@contractspec/module.workspace';
import { createNodeFsAdapter } from '../../adapters/fs.node';

const mockListSpecs = mock(async (): Promise<SpecScanResult[]> => []);

mock.module('../list', () => ({
	listSpecs: mockListSpecs,
}));

const { buildConnectContextPack, compileConnectPlanPacket } = await import(
	'./index'
);
let tempDir: string | null = null;

describe('connect context and plan', () => {
	beforeEach(() => {
		mockListSpecs.mockReset();
	});

	afterEach(() => {
		if (tempDir) {
			rmSync(tempDir, { recursive: true, force: true });
			tempDir = null;
		}
	});

	it('projects repo context, actor metadata, and impacted contracts', async () => {
		const { fs, packageRoot } = createWorkspace();
		mockListSpecs.mockResolvedValue([
			createSpec(join(packageRoot, 'src', 'runtime', 'foo.ts'), 'runtime.foo'),
		]);

		const contextPack = await buildConnectContextPack(
			{ fs, git: createGitAdapter() },
			{
				config: createConfig(),
				cwd: packageRoot,
				packageRoot,
				paths: ['src/runtime/foo.ts'],
				taskId: 'task-1',
				workspaceRoot: packageRoot,
				actor: {
					id: 'agent-1',
					traceId: 'trace-1',
					type: 'agent',
				},
			}
		);

		expect(contextPack.repoId).toBe('@demo/connect-fixture');
		expect(contextPack.branch).toBe('main');
		expect(contextPack.actor.id).toBe('agent-1');
		expect(contextPack.impactedContracts.map((entry) => entry.key)).toEqual([
			'runtime.foo',
		]);
		expect(contextPack.affectedSurfaces).toEqual(['audit', 'runtime']);
		expect(contextPack.acceptanceChecks).toEqual(['bun run typecheck']);
	});

	it('normalizes plan candidates into a PlanPacket with control-plane refs', async () => {
		const { fs, packageRoot } = createWorkspace();
		mockListSpecs.mockResolvedValue([
			createSpec(join(packageRoot, 'src', 'runtime', 'foo.ts'), 'runtime.foo'),
		]);

		const result = await compileConnectPlanPacket(
			{ fs, git: createGitAdapter('release/connect') },
			{
				config: createConfig(),
				cwd: packageRoot,
				packageRoot,
				taskId: 'task-2',
				workspaceRoot: packageRoot,
				actor: {
					id: 'cli:task-2',
					traceId: 'trace-2',
					type: 'human',
				},
				candidate: {
					commands: ['bun test'],
					objective: 'Refactor runtime path',
					touchedPaths: ['src/runtime/foo.ts'],
				},
			}
		);

		expect(result.planPacket.branch).toBe('release/connect');
		expect(result.planPacket.acpActions).toEqual([
			'acp.fs.access',
			'acp.terminal.exec',
		]);
		expect(result.planPacket.controlPlane.intentSubmit.key).toBe(
			'controlPlane.intent.submit'
		);
		expect(result.planPacket.controlPlane.planCompile.key).toBe(
			'controlPlane.plan.compile'
		);
		expect(result.planPacket.controlPlane.planVerify.key).toBe(
			'controlPlane.plan.verify'
		);
		expect(result.planPacket.steps).toHaveLength(1);
		expect(result.planPacket.requiredChecks).toEqual(['bun run typecheck']);
		expect(result.planPacket.requiredApprovals).toEqual([]);
		expect(result.planPacket.riskScore).toBe(0.35);
		expect(result.planPacket.verificationStatus).toBe('approved');
	});
});

function createWorkspace() {
	tempDir = mkdtempSync(join(tmpdir(), 'contractspec-connect-projection-'));
	mkdirSync(join(tempDir, 'src', 'runtime'), { recursive: true });
	writeFileSync(
		join(tempDir, 'package.json'),
		'{"name":"@demo/connect-fixture"}\n',
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

function createConfig() {
	return {
		...DEFAULT_CONTRACTSRC,
		connect: {
			...DEFAULT_CONTRACTSRC.connect,
			enabled: true,
			policy: {
				...DEFAULT_CONTRACTSRC.connect?.policy,
				smokeChecks: ['bun run typecheck'],
			},
		},
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
