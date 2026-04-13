import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test';

const featureData = {
	key: 'workspace.setup',
	version: '1.0.0',
	title: 'Workspace Setup',
	description: 'Guides workspace setup.',
	domain: 'workspace',
	owners: ['@team-platform'],
	tags: ['feature'],
	stability: 'beta' as const,
	operations: [],
	events: [],
	presentations: [],
	experiments: [],
};

const featureWizardMock = mock(async () => featureData);
const writeSpecFileMock = mock(
	async () => 'generated/features/workspace-setup.feature.ts'
);

mock.module('./wizards/feature', () => ({
	featureWizard: featureWizardMock,
}));

mock.module('./write-spec-file', () => ({
	writeSpecFile: writeSpecFileMock,
}));

const { createFeatureSpec } = await import('./create-feature');

const originalConsoleLog = console.log;

describe('createFeatureSpec', () => {
	beforeEach(() => {
		featureWizardMock.mockClear();
		writeSpecFileMock.mockClear();
		console.log = mock(() => {}) as typeof console.log;
	});

	afterEach(() => {
		console.log = originalConsoleLog;
	});

	it('writes a feature spec using the canonical extension and folder type', async () => {
		await createFeatureSpec({} as never, {} as never);

		expect(featureWizardMock).toHaveBeenCalledTimes(1);
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

		expect(typedArgs.specName).toBe(featureData.key);
		expect(typedArgs.specType).toBe('feature');
		expect(typedArgs.extension).toBe('.feature.ts');
		expect(typedArgs.code).toContain('defineFeature({');
		expect(typedArgs.code).toContain('meta: {');
	});
});
