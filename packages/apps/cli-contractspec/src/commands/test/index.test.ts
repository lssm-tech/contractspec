import {
	afterAll,
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	mock,
} from 'bun:test';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const BUNDLE_WORKSPACE_MODULE = new URL(
	'../../../../../bundles/workspace/src/index.ts',
	import.meta.url
).pathname;
const actualBundleWorkspace = await import(BUNDLE_WORKSPACE_MODULE);
const AI_PROVIDERS_MODULE = new URL('../../ai/providers.ts', import.meta.url)
	.pathname;
const actualAiProviders = await import(AI_PROVIDERS_MODULE);
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

function installTestCommandMocks() {
	mock.module('../../ai/providers', () => ({
		getAIProvider: getAIProviderMock,
		validateProvider: validateProviderMock,
	}));
	mock.module('@contractspec/bundle.workspace', () => ({
		...actualBundleWorkspace,
		loadAuthoredModuleExports: loadAuthoredModuleExportsMock,
		listTests: mock(async () => []),
		runTestSpecs: mock(async () => ({ passed: true, results: [] })),
		TestGeneratorService: TestGeneratorServiceMock,
	}));
}

function loadTestCommandModule() {
	return import(`./index?test=${Date.now()}-${Math.random()}`);
}

const originalConsoleLog = console.log;
const originalCwd = process.cwd();

describe('test --generate', () => {
	let tempDir = '';

	beforeEach(() => {
		tempDir = '';
		mock.restore();
		installTestCommandMocks();
	});

	beforeEach(async () => {
		tempDir = await mkdtemp(join(tmpdir(), 'contractspec-test-command-'));
		await writeFile(
			join(tempDir, 'package.json'),
			JSON.stringify({ name: 'test-command-fixture', type: 'module' }, null, 2)
		);
		await mkdir(join(tempDir, 'contracts'), { recursive: true });
		await writeFile(
			join(tempDir, 'contracts', 'sample.ts'),
			'export const SampleOperation = { kind: "operation", meta: { key: "workspace.setup", version: "1.0.0" } };\n'
		);
		process.chdir(tempDir);
		getAIProviderMock.mockClear();
		validateProviderMock.mockClear();
		loadAuthoredModuleExportsMock.mockClear();
		generatorGenerateMock.mockClear();
		TestGeneratorServiceMock.mockClear();
		logger.info.mockClear();
		logger.warn.mockClear();
		logger.error.mockClear();
		console.log = mock(() => {}) as typeof console.log;
	});

	afterEach(() => {
		process.chdir(originalCwd);
		console.log = originalConsoleLog;
		if (tempDir) {
			void rm(tempDir, { recursive: true, force: true });
		}
		mock.restore();
		mock.module('../../ai/providers', () => actualAiProviders);
		mock.module('@contractspec/bundle.workspace', () => actualBundleWorkspace);
	});

	it('uses the configured workspace provider instead of hardcoded OpenAI', async () => {
		const { testCommand } = await loadTestCommandModule();
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
			expect.objectContaining({
				info: expect.any(Function),
				warn: expect.any(Function),
				error: expect.any(Function),
			}),
			{ provider: 'claude' }
		);
		expect(generatorGenerateMock).toHaveBeenCalledTimes(1);
	});
});

afterAll(() => {
	mock.restore();
});
