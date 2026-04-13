import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test';

const formData = {
	key: 'workspace.setup.form',
	version: '1.0.0',
	title: 'Workspace Setup',
	description: 'Collect workspace setup details.',
	domain: 'workspace',
	owners: ['@team-platform'],
	tags: ['form'],
	stability: 'beta' as const,
	primaryFieldKey: 'name',
	primaryFieldLabel: 'workspaceSetup.name.label',
	primaryFieldPlaceholder: 'workspaceSetup.name.placeholder',
	actionKey: 'submit',
	actionLabel: 'workspaceSetup.submit.label',
};

const formWizardMock = mock(async () => formData);
const writeSpecFileMock = mock(
	async () => 'generated/forms/workspace-setup-form.form.ts'
);

mock.module('./wizards/form', () => ({
	formWizard: formWizardMock,
}));

mock.module('./write-spec-file', () => ({
	writeSpecFile: writeSpecFileMock,
}));

const { createFormSpec } = await import('./create-form');

const originalConsoleLog = console.log;

describe('createFormSpec', () => {
	beforeEach(() => {
		formWizardMock.mockClear();
		writeSpecFileMock.mockClear();
		console.log = mock(() => {}) as typeof console.log;
	});

	afterEach(() => {
		console.log = originalConsoleLog;
	});

	it('writes a form spec using the canonical extension and folder type', async () => {
		await createFormSpec({} as never, {} as never);

		expect(formWizardMock).toHaveBeenCalledTimes(1);
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

		expect(typedArgs.specName).toBe(formData.key);
		expect(typedArgs.specType).toBe('form');
		expect(typedArgs.extension).toBe('.form.ts');
		expect(typedArgs.code).toContain('defineFormSpec({');
		expect(typedArgs.code).toContain('defineSchemaModel({');
	});
});
