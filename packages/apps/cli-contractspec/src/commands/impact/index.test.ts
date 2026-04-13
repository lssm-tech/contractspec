import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test';

const detectImpactMock = mock(async () => ({
	hasBreaking: false,
	hasNonBreaking: false,
	summary: {
		breaking: 0,
		nonBreaking: 0,
		added: 0,
		removed: 0,
	},
	deltas: [],
}));

const formatJsonMock = mock(() => '{"format":"json"}');
const formatPrCommentMock = mock(() => '# markdown');
const formatCheckRunMock = mock(() => ({ status: 'check-run' }));
const logger = {
	error: mock(() => {}),
};

mock.module('@contractspec/bundle.workspace', () => ({
	createConsoleLoggerAdapter: () => logger,
	createNodeFsAdapter: () => ({}),
	createNodeGitAdapter: () => ({}),
	createNoopLoggerAdapter: () => logger,
	impact: {
		detectImpact: detectImpactMock,
		formatJson: formatJsonMock,
		formatPrComment: formatPrCommentMock,
		formatCheckRun: formatCheckRunMock,
	},
}));

const { createImpactCommand, runImpactCommand } = await import('./index');

const originalConsoleLog = console.log;
const originalExit = process.exit;

describe('impact command', () => {
	beforeEach(() => {
		detectImpactMock.mockClear();
		formatJsonMock.mockClear();
		formatPrCommentMock.mockClear();
		formatCheckRunMock.mockClear();
		logger.error.mockClear();
		console.log = mock(() => {}) as typeof console.log;
	});

	afterEach(() => {
		console.log = originalConsoleLog;
		process.exit = originalExit;
	});

	it('keeps the operator-facing flags on the command surface', () => {
		const command = createImpactCommand();
		expect(command.options.map((option) => option.long)).toEqual([
			'--baseline',
			'--format',
			'--fail-on-breaking',
			'--pattern',
			'--quiet',
		]);
	});

	it('routes json and markdown output through the documented formatters', async () => {
		await runImpactCommand({ format: 'json' });
		await runImpactCommand({ format: 'markdown' });

		expect(formatJsonMock).toHaveBeenCalledTimes(1);
		expect(formatPrCommentMock).toHaveBeenCalledTimes(1);
		expect(formatCheckRunMock).not.toHaveBeenCalled();
	});

	it('exits non-zero when --fail-on-breaking is used with breaking changes', async () => {
		detectImpactMock.mockResolvedValueOnce({
			hasBreaking: true,
			hasNonBreaking: false,
			summary: {
				breaking: 1,
				nonBreaking: 0,
				added: 0,
				removed: 0,
			},
			deltas: [],
		});
		process.exit = ((code?: number) => {
			throw new Error(`exit:${code}`);
		}) as typeof process.exit;

		await expect(runImpactCommand({ failOnBreaking: true })).rejects.toThrow(
			'exit:1'
		);
	});
});
