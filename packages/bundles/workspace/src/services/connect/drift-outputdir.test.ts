import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DEFAULT_CONTRACTSRC } from '@contractspec/lib.contracts-spec/workspace-config';
import type { SpecScanResult } from '@contractspec/module.workspace';
import { createNodeFsAdapter } from '../../adapters/fs.node';

const mockListSpecs = mock(async (): Promise<SpecScanResult[]> => []);

mock.module('../list', () => ({
	listSpecs: mockListSpecs,
}));

mock.module('../docs/index', () => ({
	generateDocsFromSpecs: mock(
		async (_specFiles: string[], input: { outputDir: string }) => {
			await mkdir(input.outputDir, { recursive: true });
			await writeFile(
				join(input.outputDir, 'connect.md'),
				'generated\n',
				'utf8'
			);
			return { blocks: [], count: 1 };
		}
	),
}));

const { analyzeConnectImpact, resolveWorkspace } = await import('./index');
let tempDir: string | null = null;

describe('connect drift roots', () => {
	beforeEach(() => {
		mockListSpecs.mockReset();
	});

	afterEach(() => {
		if (tempDir) {
			rmSync(tempDir, { recursive: true, force: true });
			tempDir = null;
		}
	});

	it('detects drift from outputDir-backed generated roots', async () => {
		const { fs, root } = createWorkspace();
		mockListSpecs.mockResolvedValue([
			createSpec(join(root, 'specs', 'connect.command.ts')),
		]);

		const result = await analyzeConnectImpact(
			{ fs, git: createGitAdapter() },
			{
				touchedPaths: ['generated/docs/connect.md'],
				workspace: resolveWorkspace({
					config: createConfig({
						generatedPaths: ['generated/docs/**'],
						outputDir: 'generated',
					}),
					cwd: root,
					packageRoot: root,
					workspaceRoot: root,
				}),
			}
		);

		expect(result.driftFiles).toEqual(['generated/docs/connect.md']);
	});

	it('detects drift for nested generated docs roots without placeholder sources', async () => {
		const { fs, root } = createWorkspace();
		mockListSpecs.mockResolvedValue([
			createSpec(join(root, 'specs', 'connect.command.ts')),
		]);

		const result = await analyzeConnectImpact(
			{ fs, git: createGitAdapter() },
			{
				touchedPaths: ['artifacts/docs/connect.md'],
				workspace: resolveWorkspace({
					config: createConfig({
						generatedPaths: ['artifacts/docs/**'],
					}),
					cwd: root,
					packageRoot: root,
					workspaceRoot: root,
				}),
			}
		);

		expect(result.driftFiles).toEqual(['artifacts/docs/connect.md']);
	});
});

function createWorkspace() {
	tempDir = mkdtempSync(join(tmpdir(), 'contractspec-connect-drift-'));
	mkdirSync(join(tempDir, 'specs'), { recursive: true });
	mkdirSync(join(tempDir, 'generated', 'docs'), { recursive: true });
	mkdirSync(join(tempDir, 'artifacts', 'docs'), { recursive: true });
	writeFileSync(
		join(tempDir, 'package.json'),
		'{"name":"@demo/connect-drift"}\n',
		'utf8'
	);
	writeFileSync(
		join(tempDir, 'specs', 'connect.command.ts'),
		"export const op = defineCommand({ meta: { key: 'connect.command', version: '1.0.0' } });\n",
		'utf8'
	);
	writeFileSync(
		join(tempDir, 'generated', 'docs', 'connect.md'),
		'outdated\n',
		'utf8'
	);
	writeFileSync(
		join(tempDir, 'artifacts', 'docs', 'connect.md'),
		'outdated\n',
		'utf8'
	);

	return {
		fs: createNodeFsAdapter(tempDir),
		root: tempDir,
	};
}

function createConfig(input: { outputDir?: string; generatedPaths: string[] }) {
	return {
		...DEFAULT_CONTRACTSRC,
		outputDir: input.outputDir ?? DEFAULT_CONTRACTSRC.outputDir,
		connect: {
			...DEFAULT_CONTRACTSRC.connect,
			enabled: true,
			policy: {
				...DEFAULT_CONTRACTSRC.connect?.policy,
				generatedPaths: input.generatedPaths,
				smokeChecks: [],
			},
		},
	};
}

function createGitAdapter() {
	return {
		clean: async () => {},
		currentBranch: async () => 'main',
		diffFiles: async () => [],
		isGitRepo: async () => true,
		log: async () => [],
		showFile: async () => '',
	};
}

function createSpec(filePath: string): SpecScanResult {
	return {
		filePath,
		hasContent: false,
		hasDefinition: true,
		hasIo: false,
		hasMeta: true,
		hasPayload: false,
		hasPolicy: false,
		key: 'connect.command',
		kind: 'command',
		specType: 'operation',
		version: '1.0.0',
	};
}
