import { describe, expect, it } from 'bun:test';
import { type FormSpecParams, generateFormSpec } from './form.template';

describe('generateFormSpec', () => {
	it('generates a minimal form scaffold', () => {
		const params: FormSpecParams = {
			key: 'workspace.setup.form',
			version: '1.0.0',
			title: 'Workspace Setup',
			description: 'Collect setup details.',
			domain: 'workspace',
			owners: ['@team-platform'],
			tags: ['form', 'workspace'],
			primaryFieldKey: 'name',
			primaryFieldLabel: 'workspaceSetup.name.label',
			primaryFieldPlaceholder: 'workspaceSetup.name.placeholder',
			actionKey: 'submit',
			actionLabel: 'workspaceSetup.submit.label',
		};

		const code = generateFormSpec(params);

		expect(code).toContain('import { defineFormSpec }');
		expect(code).toContain('defineSchemaModel({');
		expect(code).toContain("key: 'workspace.setup.form'");
		expect(code).toContain("name: 'name'");
		expect(code).toContain("key: 'submit'");
		expect(code).toContain("form: 'react-hook-form'");
	});

	it('falls back to default stability and placeholder text', () => {
		const params: FormSpecParams = {
			key: 'workspace.setup.form',
			version: '1.0.0',
			title: 'Workspace Setup',
			domain: 'workspace',
			owners: [],
			tags: [],
			primaryFieldKey: 'name',
			primaryFieldLabel: 'workspaceSetup.name.label',
			actionKey: 'submit',
			actionLabel: 'workspaceSetup.submit.label',
		};

		const code = generateFormSpec(params);

		expect(code).toContain("stability: 'beta'");
		expect(code).toContain("placeholderI18n: 'TODO.placeholder'");
	});
});
