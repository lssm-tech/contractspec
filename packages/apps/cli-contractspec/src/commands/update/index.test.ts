import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test';

const inputMock = mock(async () => 'Rename the title and tighten wording.');
const confirmMock = mock(async () => true);
const loadConfigMock = mock(async () => ({
	aiProvider: 'openai',
	aiModel: 'gpt-4.1',
	agentMode: 'simple',
	outputDir: 'src',
	conventions: {},
}));
const mergeConfigMock = mock((_config, options) => ({
	aiProvider: 'openai',
	aiModel: 'gpt-4.1',
	agentMode: 'simple',
	outputDir: 'src',
	conventions: {},
	...options,
}));
const readFileMock = mock(async () => 'export const before = true;\n');
const createNodeAdaptersMock = mock((_options) => ({
	fs: {
		readFile: readFileMock,
	},
	logger: {},
}));
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

mock.module('../../utils/config', () => ({
	loadConfig: loadConfigMock,
	mergeConfig: mergeConfigMock,
}));

mock.module('@contractspec/bundle.workspace', () => ({
	createNodeAdapters: createNodeAdaptersMock,
	updateSpec: updateSpecMock,
}));

mock.module('../../ai/providers', () => ({
	validateProvider: validateProviderMock,
}));

mock.module('../../ai/agents/index', () => ({
	AgentOrchestrator: class {
		refactor = refactorMock;
	},
}));

const { executeUpdateCommand } = await import('./index');

const originalConsoleLog = console.log;

describe('update --ai', () => {
	beforeEach(() => {
		inputMock.mockClear();
		confirmMock.mockClear();
		loadConfigMock.mockClear();
		mergeConfigMock.mockClear();
		readFileMock.mockClear();
		createNodeAdaptersMock.mockClear();
		updateSpecMock.mockClear();
		validateProviderMock.mockClear();
		refactorMock.mockClear();
		console.log = mock(() => {}) as typeof console.log;
	});

	afterEach(() => {
		console.log = originalConsoleLog;
	});

	it('uses the merged config and applies a real AI edit', async () => {
		await executeUpdateCommand('contracts/sample.ts', { ai: true });

		expect(loadConfigMock).toHaveBeenCalledTimes(1);
		expect(mergeConfigMock).toHaveBeenCalledTimes(1);
		expect(createNodeAdaptersMock).toHaveBeenCalledWith({
			config: expect.objectContaining({
				aiProvider: 'openai',
				agentMode: 'simple',
			}),
		});
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
		validateProviderMock.mockResolvedValueOnce({
			success: false,
			error: 'OPENAI_API_KEY environment variable not set',
		});

		await expect(
			executeUpdateCommand('contracts/sample.ts', { ai: true })
		).rejects.toThrow(
			'AI provider unavailable: OPENAI_API_KEY environment variable not set'
		);
		expect(updateSpecMock).not.toHaveBeenCalled();
	});
});
