import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test';
import { createImpactCommand, runImpactCommand } from './index';

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
const logMock = mock(() => {});
const exitMock = mock((code?: number) => {
	throw new Error(`exit:${code}`);
});

function deps() {
	return {
		createFs: () => ({}) as never,
		createGit: () => ({}) as never,
		createConsoleLogger: () => logger as never,
		createNoopLogger: () => logger as never,
		impactService: {
			detectImpact: detectImpactMock,
			formatJson: formatJsonMock,
			formatPrComment: formatPrCommentMock,
			formatCheckRun: formatCheckRunMock,
		} as never,
		log: logMock,
		exit: exitMock as never,
	};
}

describe('impact command', () => {
	beforeEach(() => {
		detectImpactMock.mockClear();
		formatJsonMock.mockClear();
		formatPrCommentMock.mockClear();
		formatCheckRunMock.mockClear();
		logger.error.mockClear();
		logMock.mockClear();
		exitMock.mockClear();
	});

	afterEach(() => {
		detectImpactMock.mockResolvedValue({
			hasBreaking: false,
			hasNonBreaking: false,
			summary: { breaking: 0, nonBreaking: 0, added: 0, removed: 0 },
			deltas: [],
		});
	});

	it('keeps the operator-facing flags on the command surface', () => {
		const command = createImpactCommand();
		expect(
			command.options.map((option: { long?: string }) => option.long)
		).toEqual([
			'--baseline',
			'--format',
			'--fail-on-breaking',
			'--pattern',
			'--quiet',
		]);
	});

	it('routes json and markdown output through the documented formatters', async () => {
		await runImpactCommand({ format: 'json' }, deps());
		await runImpactCommand({ format: 'markdown' }, deps());

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

		await expect(
			runImpactCommand({ failOnBreaking: true }, deps())
		).rejects.toThrow('exit:1');
		expect(logger.error).not.toHaveBeenCalled();
	});
});
