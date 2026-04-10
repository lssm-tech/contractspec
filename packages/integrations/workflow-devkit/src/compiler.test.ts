import { describe, expect, it } from 'bun:test';
import type { WorkflowSpec } from '@contractspec/lib.contracts-spec/workflow/spec';
import { compileWorkflowSpecToWorkflowDevkit } from './compiler';

const sampleSpec = {
	meta: {
		key: 'workflow.devkit.sample',
		version: '1.0.0',
		title: 'Sample Workflow',
		description: 'Workflow DevKit sample',
		domain: 'testing',
		owners: ['platform'],
		tags: [],
		stability: 'experimental',
	},
	definition: {
		entryStepId: 'start',
		steps: [
			{
				id: 'start',
				label: 'Start',
				type: 'automation',
				action: {
					operation: { key: 'sigil.start', version: '1.0.0' },
				},
			},
			{
				id: 'approval',
				label: 'Approval',
				type: 'human',
				runtime: {
					workflowDevkit: {
						behavior: 'approvalWait',
						approvalWait: {
							resumeSource: 'approval',
						},
					},
				},
			},
		],
		transitions: [{ from: 'start', to: 'approval' }],
	},
	runtime: {
		capabilities: {
			adapters: {
				'workflow-devkit': true,
			},
		},
		workflowDevkit: {
			hostTarget: 'next',
			hookTokens: {
				strategy: 'deterministic',
			},
			integrationMode: 'generated',
			runIdentity: {
				strategy: 'meta-key-version',
			},
		},
	},
} as WorkflowSpec;

describe('compileWorkflowSpecToWorkflowDevkit', () => {
	it('produces a deterministic manifest for a workflow spec', () => {
		const compilation = compileWorkflowSpecToWorkflowDevkit(sampleSpec);

		expect(compilation).toEqual({
			entryStepId: 'start',
			hostTarget: 'next',
			hookTokenStrategy: 'deterministic',
			integrationMode: 'generated',
			runIdentityStrategy: 'meta-key-version',
			specKey: 'workflow.devkit.sample',
			specVersion: '1.0.0',
			steps: [
				{
					behavior: 'automation',
					id: 'start',
					label: 'Start',
					operationRef: 'sigil.start.v1.0.0',
					runtime: undefined,
					transitions: [{ condition: undefined, to: 'approval' }],
					type: 'automation',
					waitToken: undefined,
				},
				{
					behavior: 'approvalWait',
					id: 'approval',
					label: 'Approval',
					operationRef: undefined,
					runtime: {
						behavior: 'approvalWait',
						approvalWait: {
							resumeSource: 'approval',
						},
					},
					transitions: [],
					type: 'human',
					waitToken: 'workflow.devkit.sample:approval',
				},
			],
		});
	});
});
