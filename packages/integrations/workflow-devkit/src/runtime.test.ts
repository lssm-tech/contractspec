import { describe, expect, it } from 'bun:test';
import type { WorkflowSpec } from '@contractspec/lib.contracts-spec/workflow/spec';
import { runWorkflowSpecWithWorkflowDevkit } from './runtime';
import type { WorkflowDevkitHookLike } from './types';

const sampleSpec = {
	meta: {
		key: 'workflow.devkit.runtime',
		version: '1.0.0',
		title: 'Runtime Workflow',
		description: 'Runtime execution test',
		domain: 'testing',
		owners: ['platform'],
		tags: [],
		stability: 'experimental',
	},
	definition: {
		entryStepId: 'sleep-step',
		steps: [
			{
				id: 'sleep-step',
				label: 'Sleep',
				type: 'automation',
				runtime: {
					workflowDevkit: {
						behavior: 'sleep',
						sleep: {
							duration: '5m',
						},
					},
				},
			},
			{
				id: 'approval-step',
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
			{
				id: 'finish',
				label: 'Finish',
				type: 'automation',
			},
		],
		transitions: [
			{ from: 'sleep-step', to: 'approval-step' },
			{ from: 'approval-step', to: 'finish' },
		],
	},
	runtime: {
		capabilities: {
			adapters: {
				'workflow-devkit': true,
			},
		},
		workflowDevkit: {
			hookTokens: {
				strategy: 'deterministic',
			},
		},
	},
} as WorkflowSpec;

describe('runWorkflowSpecWithWorkflowDevkit', () => {
	it('executes sleep, waits, and automation steps through injected primitives', async () => {
		const waits: string[] = [];
		const result = await runWorkflowSpecWithWorkflowDevkit({
			bridge: {
				async executeAutomationStep({ step }) {
					return { [step.id]: 'done' };
				},
				onApprovalRequested({ token }) {
					waits.push(token);
				},
			},
			initialData: { started: true },
			primitives: {
				createHook<T = unknown>(options?: { token?: string }) {
					return createResolvedHook(options?.token ?? 'missing', {
						approved: true,
					} as T);
				},
				sleep: async (duration) => {
					waits.push(duration);
				},
			},
			spec: sampleSpec,
		});

		expect(waits).toEqual(['5m', 'workflow.devkit.runtime:approval-step']);
		expect(result.status).toBe('completed');
		expect(result.data).toMatchObject({
			started: true,
			approved: true,
			finish: 'done',
		});
		expect(result.history.map((entry) => entry.behavior)).toEqual([
			'sleep',
			'approvalWait',
			'automation',
		]);
	});
});

function createResolvedHook<T>(
	token: string,
	payload: T
): WorkflowDevkitHookLike<T> {
	const promise = Promise.resolve(payload);
	return {
		then: promise.then.bind(promise),
		token,
		async *[Symbol.asyncIterator]() {
			yield payload;
		},
	};
}
