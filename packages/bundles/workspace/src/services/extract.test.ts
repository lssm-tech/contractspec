import { afterAll, beforeEach, describe, expect, it, mock } from 'bun:test';
import type { WorkspaceAdapters } from '../ports/logger';

function installExtractMocks() {
	mock.module('./openapi/index', () => ({
		importFromOpenApiService: mock(() =>
			Promise.resolve({
				imported: 1,
				skipped: 0,
				errors: 0,
				files: [],
				skippedOperations: [],
				errorMessages: [],
			})
		),
	}));
}

function loadExtractModule() {
	return import(`./extract?test=${Date.now()}-${Math.random()}`);
}

describe('Extract Service', () => {
	const mockFs = {
		exists: mock(() => Promise.resolve(true)),
		resolve: mock((...args: string[]) => args.join('/')),
		join: mock((...args: string[]) => args.join('/')),
		readFile: mock(() => Promise.resolve('{}')),
	};

	const mockLogger = {
		info: mock(),
		warn: mock(),
		error: mock(),
		debug: mock(),
	};

	beforeEach(() => {
		mock.restore();
		installExtractMocks();
		mockFs.exists.mockClear();
		mockLogger.info.mockClear();
	});

	it('should extract contracts', async () => {
		const { extractContracts } = await loadExtractModule();
		const result = await extractContracts(
			{ fs: mockFs, logger: mockLogger } as unknown as WorkspaceAdapters,
			{ source: 'openapi.json', outputDir: 'contracts' },
			'/cwd'
		);

		expect(result.imported).toBe(1);
		expect(mockLogger.info).toHaveBeenCalled();
	});
});

afterAll(() => {
	mock.restore();
});
