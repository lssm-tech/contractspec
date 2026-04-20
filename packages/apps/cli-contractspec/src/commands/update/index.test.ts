import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const AI_PROVIDERS_MODULE = new URL('../../ai/providers.ts', import.meta.url)
	.pathname;
const AI_AGENTS_MODULE = new URL('../../ai/agents/index.ts', import.meta.url)
	.pathname;
const actualAiProviders = await import(AI_PROVIDERS_MODULE);
const actualAiAgents = await import(AI_AGENTS_MODULE);
const inputMock = mock(async () => 'Rename the title and tighten wording.');
const confirmMock = mock(async () => true);
const updateSpecMock = mock(async () => ({
	updated: true,
	specPath: 'contracts/sample.ts',
	errors: [],
	warnings: [],
	specInfo: {},
}));
const validateProviderMock = mock(
	async (): Promise<{ success: boolean; error?: string }> => ({
		success: true,
	})
);
const refactorMock = mock(async () => ({
	success: true,
	code: '```ts\nexport const after = true;\n```',
}));

mock.module('@inquirer/prompts', () => ({
	input: inputMock,
	confirm: confirmMock,
}));

function loadUpdateCommandModule() {
	return import(`./index?test=${Date.now()}-${Math.random()}`);
}

const originalConsoleLog = console.log;
const originalCwd = process.cwd();

describe('update --ai', () => {
	let tempDir = '';

	beforeEach(() => {
		tempDir = '';
	});

	beforeEach(async () => {
		tempDir = await mkdtemp(join(tmpdir(), 'contractspec-update-command-'));
		await writeFile(
			join(tempDir, 'package.json'),
			JSON.stringify(
				{ name: 'update-command-fixture', type: 'module' },
				null,
				2
			)
		);
		await writeFile(
			join(tempDir, '.contractsrc.json'),
			JSON.stringify(
				{
					aiProvider: 'openai',
					aiModel: 'gpt-4.1',
					agentMode: 'simple',
					outputDir: 'src',
				},
				null,
				2
			)
		);
		await mkdir(join(tempDir, 'contracts'), { recursive: true });
		await writeFile(
			join(tempDir, 'contracts', 'sample.ts'),
			'export const before = true;\n'
		);
		process.chdir(tempDir);
		inputMock.mockClear();
		confirmMock.mockClear();
		updateSpecMock.mockClear();
		validateProviderMock.mockClear();
		refactorMock.mockClear();
		console.log = mock(() => {}) as typeof console.log;
	});

	afterEach(() => {
		process.chdir(originalCwd);
		console.log = originalConsoleLog;
		if (tempDir) {
			void rm(tempDir, { recursive: true, force: true });
		}
		mock.module('../../ai/providers', () => actualAiProviders);
		mock.module('../../ai/agents/index', () => actualAiAgents);
	});

	it('uses the merged config and applies a real AI edit', async () => {
		const { executeUpdateCommand } = await loadUpdateCommandModule();
		await executeUpdateCommand(
			'contracts/sample.ts',
			{ ai: true },
			{
				updateSpec: updateSpecMock as never,
				input: inputMock as never,
				confirm: confirmMock as never,
				validateProvider: validateProviderMock,
				AgentOrchestrator: class {
					refactor = refactorMock;
				} as never,
				log: mock(() => {}),
			}
		);

		expect(validateProviderMock).toHaveBeenCalledTimes(1);
		expect(refactorMock).toHaveBeenCalledTimes(1);
		expect(updateSpecMock).toHaveBeenCalledWith(
			'contracts/sample.ts',
			expect.any(Object),
			expect.objectContaining({
				content: 'export const after = true;\n',
			})
		);
	});

	it('fails fast when provider validation fails for simple-agent edits', async () => {
		const { executeUpdateCommand } = await loadUpdateCommandModule();
		validateProviderMock.mockResolvedValueOnce({
			success: false,
			error: 'OPENAI_API_KEY environment variable not set',
		});

		await expect(
			executeUpdateCommand(
				'contracts/sample.ts',
				{ ai: true },
				{
					updateSpec: updateSpecMock as never,
					input: inputMock as never,
					confirm: confirmMock as never,
					validateProvider: validateProviderMock,
					AgentOrchestrator: class {
						refactor = refactorMock;
					} as never,
					log: mock(() => {}),
				}
			)
		).rejects.toThrow(
			'AI provider unavailable: OPENAI_API_KEY environment variable not set'
		);
		expect(updateSpecMock).not.toHaveBeenCalled();
	});
});
