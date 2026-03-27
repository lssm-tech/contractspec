import { describe, expect, it } from 'bun:test';
import { OwnersEnum, StabilityEnum, TagsEnum } from '../ownership';
import { defineWorkflow, WorkflowRegistry } from './spec';

describe('defineWorkflow', () => {
	it('is available from workflow/spec for safe authoring', () => {
		const spec = defineWorkflow({
			meta: {
				key: 'workflow.spec.safe-authoring',
				version: '1.0.0',
				title: 'Safe Authoring Workflow',
				description: 'Workflow authored from the workflow/spec entry point.',
				domain: 'testing',
				owners: [OwnersEnum.PlatformSigil],
				tags: [TagsEnum.Auth],
				stability: StabilityEnum.Experimental,
			},
			definition: {
				entryStepId: 'start',
				steps: [{ id: 'start', type: 'automation', label: 'Start' }],
				transitions: [],
			},
		});
		const registry = new WorkflowRegistry([spec]);

		expect(spec.meta.key).toBe('workflow.spec.safe-authoring');
		expect(registry.get(spec.meta.key)).toEqual(spec);
	});
});
