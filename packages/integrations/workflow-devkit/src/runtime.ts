import type { WorkflowSpec } from '@contractspec/lib.contracts-spec/workflow/spec';
import {
	inferWorkflowDevkitBehavior,
	mergeWorkflowDevkitData,
	resolveWorkflowDevkitEntryStepId,
	resolveWorkflowDevkitNextStepId,
	resolveWorkflowDevkitWaitToken,
} from './helpers';
import type {
	WorkflowDevkitExecutionRecord,
	WorkflowDevkitHookLike,
	WorkflowDevkitPrimitives,
	WorkflowDevkitRunResult,
	WorkflowDevkitRuntimeBridge,
	WorkflowDevkitRuntimeStepContext,
} from './types';

export interface RunWorkflowSpecWithWorkflowDevkitOptions {
	bridge?: WorkflowDevkitRuntimeBridge;
	initialData?: Record<string, unknown>;
	primitives: WorkflowDevkitPrimitives;
	runIdentity?: string;
	spec: WorkflowSpec;
}

export async function runWorkflowSpecWithWorkflowDevkit(
	options: RunWorkflowSpecWithWorkflowDevkitOptions
): Promise<WorkflowDevkitRunResult> {
	const history: WorkflowDevkitExecutionRecord[] = [];
	let currentStepId: string | null = resolveWorkflowDevkitEntryStepId(
		options.spec
	);
	let data = { ...(options.initialData ?? {}) };
	let input: unknown = options.initialData;

	while (currentStepId) {
		const step = lookupStep(options.spec, currentStepId);
		const runtime = step.runtime?.workflowDevkit;
		const context: WorkflowDevkitRuntimeStepContext = {
			data,
			input,
			runIdentity: options.runIdentity,
			runtime,
			spec: options.spec,
			step,
		};
		const behavior = inferWorkflowDevkitBehavior(step);
		const token = resolveWorkflowDevkitWaitToken(
			options.spec,
			step,
			options.runIdentity
		);
		const output = await executeWorkflowDevkitBehavior(
			behavior,
			context,
			token,
			options.bridge,
			options.primitives
		);

		history.push({
			behavior,
			input,
			output,
			stepId: step.id,
			token,
		});
		data = mergeWorkflowDevkitData(data, input, output);

		const nextStepId = resolveWorkflowDevkitNextStepId(
			options.spec,
			step,
			data,
			input,
			output
		);
		if (!nextStepId) {
			return {
				currentStep: null,
				data,
				history,
				status: 'completed',
			};
		}

		currentStepId = nextStepId;
		input = output;
	}

	return {
		currentStep: null,
		data,
		history,
		status: 'completed',
	};
}

async function executeWorkflowDevkitBehavior(
	behavior: ReturnType<typeof inferWorkflowDevkitBehavior>,
	context: WorkflowDevkitRuntimeStepContext,
	token: string | undefined,
	bridge: WorkflowDevkitRuntimeBridge | undefined,
	primitives: WorkflowDevkitPrimitives
): Promise<unknown> {
	switch (behavior) {
		case 'sleep':
			if (!context.runtime?.sleep?.duration) {
				throw new Error(`Step "${context.step.id}" is missing sleep.duration.`);
			}
			await primitives.sleep(context.runtime.sleep.duration);
			return { sleptFor: context.runtime.sleep.duration };
		case 'hookWait':
			return awaitExternalWait(
				context,
				token,
				bridge?.onExternalWait,
				primitives.createHook
			);
		case 'webhookWait':
			return awaitExternalWait(
				context,
				token,
				bridge?.onExternalWait,
				primitives.createWebhook ?? primitives.createHook,
				context.runtime?.webhookWait?.path,
				context.runtime?.webhookWait?.method
			);
		case 'approvalWait':
			return awaitExternalWait(
				context,
				token,
				bridge?.onApprovalRequested,
				primitives.createHook
			);
		case 'streamSession':
			return awaitExternalWait(
				context,
				token,
				bridge?.onStreamSession,
				primitives.createHook
			);
		case 'automation':
			if (!bridge?.executeAutomationStep) {
				throw new Error(
					'Workflow DevKit bridge requires executeAutomationStep for automation steps.'
				);
			}
			return bridge.executeAutomationStep(context);
		case 'human':
			if (!bridge?.awaitHumanInput) {
				throw new Error(
					'Workflow DevKit bridge requires awaitHumanInput for human steps without explicit wait behavior.'
				);
			}
			return bridge.awaitHumanInput(context);
		case 'decision':
			return bridge?.executeDecisionStep
				? bridge.executeDecisionStep(context)
				: context.input;
	}
}

async function awaitExternalWait(
	context: WorkflowDevkitRuntimeStepContext,
	token: string | undefined,
	notifier:
		| WorkflowDevkitRuntimeBridge['onApprovalRequested']
		| WorkflowDevkitRuntimeBridge['onExternalWait']
		| WorkflowDevkitRuntimeBridge['onStreamSession'],
	factory: (options?: {
		method?: string;
		path?: string;
		token?: string;
	}) => WorkflowDevkitHookLike<unknown>,
	path?: string,
	method?: string
) {
	if (!token) {
		throw new Error(
			`Step "${context.step.id}" requires a Workflow DevKit wait token.`
		);
	}

	const behavior = context.runtime?.behavior;
	if (
		behavior !== 'approvalWait' &&
		behavior !== 'hookWait' &&
		behavior !== 'streamSession' &&
		behavior !== 'webhookWait'
	) {
		throw new Error(
			`Step "${context.step.id}" is not configured with an external wait behavior.`
		);
	}

	const waitContext = {
		...context,
		behavior,
		token,
	};
	await notifier?.(waitContext);

	const hook = factory({ method, path, token });
	try {
		return await hook;
	} finally {
		await hook.dispose?.();
	}
}

function lookupStep(spec: WorkflowSpec, stepId: string) {
	const step = spec.definition.steps.find(
		(candidate) => candidate.id === stepId
	);
	if (!step) {
		throw new Error(
			`Step "${stepId}" not found in workflow ${spec.meta.key}.v${spec.meta.version}.`
		);
	}
	return step;
}
