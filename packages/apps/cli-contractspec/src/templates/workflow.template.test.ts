import { describe, expect, it } from 'bun:test';
import type { WorkflowSpecData } from '../types';
import { generateWorkflowSpec } from './workflow.template';

describe('generateWorkflowSpec', () => {
	const baseData: WorkflowSpecData = {
		name: 'test.workflow',
		version: '1',
		description: 'Test workflow',
		owners: ['team-a'],
		tags: ['test'],
		stability: 'stable',
		title: 'Test Workflow',
		domain: 'test-domain',
		steps: [],
		transitions: [],
		policyFlags: [],
	};

	it('generates a workflow spec with the safe workflow spec import', () => {
		const code = generateWorkflowSpec(baseData);
		expect(code).toContain(
			"import { defineWorkflow } from '@contractspec/lib.contracts-spec/workflow/spec'"
		);
		expect(code).toContain('export const WorkflowWorkflow = defineWorkflow({');
	});
});
