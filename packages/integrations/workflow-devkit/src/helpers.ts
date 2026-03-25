import type {
	Step,
	WorkflowSpec,
} from '@contractspec/lib.contracts-spec/workflow';
import { evaluateExpression } from '@contractspec/lib.contracts-spec/workflow';

export function inferWorkflowDevkitBehavior(step: Step) {
	return step.runtime?.workflowDevkit?.behavior ?? step.type;
}

export function resolveWorkflowDevkitEntryStepId(spec: WorkflowSpec): string {
	const entryStepId =
		spec.definition.entryStepId ?? spec.definition.steps[0]?.id;
	if (!entryStepId) {
		throw new Error(
			`Workflow ${spec.meta.key}.v${spec.meta.version} does not define an entry step.`
		);
	}
	return entryStepId;
}

export function resolveWorkflowDevkitRunIdentity(
	spec: WorkflowSpec,
	runIdentity?: string
): string {
	if (runIdentity) {
		return runIdentity;
	}

	const strategy =
		spec.runtime?.workflowDevkit?.runIdentity?.strategy ?? 'meta-key-version';
	const prefix = spec.runtime?.workflowDevkit?.runIdentity?.prefix;
	const baseIdentity =
		strategy === 'meta-key-version'
			? `${spec.meta.key}.v${spec.meta.version}`
			: `${spec.meta.key}.v${spec.meta.version}`;
	return prefix ? `${prefix}:${baseIdentity}` : baseIdentity;
}

export function resolveWorkflowDevkitWaitToken(
	spec: WorkflowSpec,
	step: Step,
	runIdentity?: string
): string | undefined {
	const runtime = step.runtime?.workflowDevkit;
	if (!runtime) {
		return undefined;
	}

	const explicitToken =
		runtime.hookWait?.token ??
		runtime.webhookWait?.token ??
		runtime.approvalWait?.token ??
		runtime.streamSession?.followUpToken;
	if (explicitToken) {
		return explicitToken;
	}

	const tokenStrategy =
		spec.runtime?.workflowDevkit?.hookTokens?.strategy ?? 'deterministic';
	const prefix =
		spec.runtime?.workflowDevkit?.hookTokens?.prefix ?? spec.meta.key;
	const stableStepId = sanitizeIdentifier(step.id);
	if (tokenStrategy === 'session-scoped') {
		const resolvedRunIdentity = sanitizeIdentifier(
			resolveWorkflowDevkitRunIdentity(spec, runIdentity)
		);
		return `${prefix}:${resolvedRunIdentity}:${stableStepId}`;
	}
	if (tokenStrategy === 'step-scoped') {
		return `${prefix}:v${spec.meta.version}:${stableStepId}`;
	}
	return `${prefix}:${stableStepId}`;
}

export function resolveWorkflowDevkitNextStepId(
	spec: WorkflowSpec,
	step: Step,
	data: Record<string, unknown>,
	input?: unknown,
	output?: unknown
): string | null {
	const transitions = spec.definition.transitions.filter(
		(transition) => transition.from === step.id
	);
	for (const transition of transitions) {
		if (
			evaluateExpression(transition.condition, {
				data,
				input,
				output,
			})
		) {
			return transition.to;
		}
	}
	return null;
}

export function mergeWorkflowDevkitData(
	current: Record<string, unknown>,
	input?: unknown,
	output?: unknown
): Record<string, unknown> {
	const next = { ...current };
	if (isRecord(input)) {
		Object.assign(next, input);
	}
	if (isRecord(output)) {
		Object.assign(next, output);
	}
	return next;
}

export function sanitizeIdentifier(value: string): string {
	return value.replace(/[^a-zA-Z0-9_-]+/g, '-');
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return value != null && typeof value === 'object' && !Array.isArray(value);
}
