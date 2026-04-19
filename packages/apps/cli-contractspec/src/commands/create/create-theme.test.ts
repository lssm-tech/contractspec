import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test';

const themeData = {
	key: 'design.console',
	version: '1.0.0',
	title: 'Console Theme',
	description: 'Theme used by the console.',
	domain: 'design-system',
	owners: ['@team-design'],
	tags: ['theme'],
	stability: 'experimental' as const,
	scopes: ['tenant'] as const,
};

const themeWizardMock = mock(async () => themeData);
const writeSpecFileMock = mock(
	async () => 'generated/themes/design-console.theme.ts'
);

mock.module('./wizards/theme', () => ({
	themeWizard: themeWizardMock,
}));

mock.module('./write-spec-file', () => ({
	writeSpecFile: writeSpecFileMock,
}));

const { createThemeSpec } = await import('./create-theme');

const originalConsoleLog = console.log;

describe('createThemeSpec', () => {
	beforeEach(() => {
		themeWizardMock.mockClear();
		writeSpecFileMock.mockClear();
		console.log = mock(() => {}) as typeof console.log;
	});

	afterEach(() => {
		console.log = originalConsoleLog;
	});

	it('writes a theme spec using the canonical extension and folder type', async () => {
		await createThemeSpec({} as never, {} as never);

		expect(themeWizardMock).toHaveBeenCalledTimes(1);
		expect(writeSpecFileMock).toHaveBeenCalledTimes(1);

		const args = (
			writeSpecFileMock.mock.calls as unknown as Array<[unknown]>
		)[0]?.[0];
		expect(args).toBeDefined();
		const typedArgs = args as unknown as {
			specName: string;
			specType: string;
			extension: string;
			code: string;
		};

		expect(typedArgs.specName).toBe(themeData.key);
		expect(typedArgs.specType).toBe('theme');
		expect(typedArgs.extension).toBe('.theme.ts');
		expect(typedArgs.code).toContain('defineTheme({');
		expect(typedArgs.code).toContain("key: 'design.console'");
	});
});
