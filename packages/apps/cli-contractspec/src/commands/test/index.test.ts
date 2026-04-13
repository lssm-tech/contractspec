import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test';

const getAIProviderMock = mock(() => ({ provider: 'claude' }));
const validateProviderMock = mock(async () => ({ success: true }));
const loadAuthoredModuleExportsMock = mock(async () => ({
	SampleOperation: {
		kind: 'operation',
		meta: {
			key: 'workspace.setup',
			version: '1.0.0',
		},
	},
}));

const logger = {
	info: mock(() => {}),
	warn: mock(() => {}),
	error: mock(() => {}),
};

const createNodeAdaptersMock = mock(() => ({
	logger,
}));

const generatorGenerateMock = mock(async () => ({
	meta: { key: 'workspace.setup.test', version: '1.0.0' },
	target: {},
	fixtures: [],
	scenarios: [],
}));

const TestGeneratorServiceMock = mock(function (_logger, _model) {
	return {
		generateTests: generatorGenerateMock,
	};
});

mock.module('../../ai/providers', () => ({
	getAIProvider: getAIProviderMock,
	validateProvider: validateProviderMock,
}));

mock.module('@contractspec/bundle.workspace', () => ({
	createNodeAdapters: createNodeAdaptersMock,
	loadAuthoredModuleExports: loadAuthoredModuleExportsMock,
	listTests: mock(async () => []),
	runTestSpecs: mock(async () => ({ passed: true, results: [] })),
	TestGeneratorService: TestGeneratorServiceMock,
}));

const { testCommand } = await import('./index');

const originalConsoleLog = console.log;

describe('test --generate', () => {
	beforeEach(() => {
		getAIProviderMock.mockClear();
		validateProviderMock.mockClear();
		loadAuthoredModuleExportsMock.mockClear();
		createNodeAdaptersMock.mockClear();
		generatorGenerateMock.mockClear();
		TestGeneratorServiceMock.mockClear();
		logger.info.mockClear();
		logger.warn.mockClear();
		logger.error.mockClear();
		console.log = mock(() => {}) as typeof console.log;
	});

	afterEach(() => {
		console.log = originalConsoleLog;
	});

	it('uses the configured workspace provider instead of hardcoded OpenAI', async () => {
		const config = {
			aiProvider: 'claude',
			aiModel: 'claude-3-7-sonnet',
			customEndpoint: undefined,
		} as never;

		await testCommand(
			'contracts/sample.ts',
			{ generate: true, json: true },
			config
		);

		expect(validateProviderMock).toHaveBeenCalledWith(config);
		expect(getAIProviderMock).toHaveBeenCalledWith(config);
		expect(TestGeneratorServiceMock).toHaveBeenCalledWith(
			logger,
			expect.objectContaining({ provider: 'claude' })
		);
		expect(generatorGenerateMock).toHaveBeenCalledTimes(1);
	});
});
