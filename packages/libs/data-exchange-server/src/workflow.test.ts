import { describe, expect, it } from 'bun:test';
import { validateWorkflowSpec } from '@contractspec/lib.contracts-spec/workflow';
import { defineImportTemplate } from '@contractspec/lib.data-exchange-core';
import { createInterchangeWorkflowSpec } from './workflow';

describe('data-exchange-server workflow', () => {
	it('builds a valid interchange workflow graph', () => {
		const spec = createInterchangeWorkflowSpec({
			key: 'data.exchange.import',
			version: '1.0.0',
			title: 'Data exchange import',
			description:
				'Profiles, previews, approves, executes, and audits an import.',
			source: { kind: 'file', path: '/tmp/input.csv', format: 'csv' },
			target: { kind: 'memory', format: 'json' },
			template: defineImportTemplate({
				key: 'accounts.import',
				version: '1.0.0',
				columns: [
					{
						key: 'id',
						label: 'ID',
						targetField: 'id',
					},
				],
			}),
		});

		const issues = validateWorkflowSpec(spec);
		expect(issues.filter((issue) => issue.level === 'error')).toHaveLength(0);
		expect(spec.definition.entryStepId).toBe('profile-source');
		expect(spec.metadata?.templateKey).toBe('accounts.import');
	});
});
