import type { Step, WorkflowSpec } from './spec';
import type { WorkflowValidationIssue } from './validation';
import type {
	JsonValue,
	WorkflowDevkitStepBehavior,
	WorkflowDevkitStepRuntimeConfig,
} from './workflow-devkit';

export function validateWorkflowDevkitConfig(
	spec: WorkflowSpec,
	issues: WorkflowValidationIssue[]
): void {
	const workflowDevkitEnabled = Boolean(
		spec.runtime?.workflowDevkit ||
			spec.runtime?.capabilities?.adapters?.['workflow-devkit']
	);
	if (!workflowDevkitEnabled) {
		return;
	}

	const workflowDevkit = spec.runtime?.workflowDevkit;
	if (!workflowDevkit) {
		issues.push({
			level: 'warning',
			message:
				'Workflow enables the workflow-devkit adapter without defining runtime.workflowDevkit.',
		});
		return;
	}

	validateStringConfig(
		workflowDevkit.runIdentity?.prefix,
		'runtime.workflowDevkit.runIdentity.prefix',
		issues
	);
	validateStringConfig(
		workflowDevkit.hookTokens?.prefix,
		'runtime.workflowDevkit.hookTokens.prefix',
		issues
	);

	const serializationMode = workflowDevkit.serialization?.mode ?? 'strict';
	if (serializationMode === 'strict') {
		if (
			(workflowDevkit.serialization?.enforceMetadata ?? true) &&
			spec.metadata !== undefined &&
			!isJsonValue(spec.metadata)
		) {
			pushJsonIssue(issues, 'Workflow metadata must be JSON-serializable.');
		}
		if (
			(workflowDevkit.serialization?.enforceMetadata ?? true) &&
			spec.annotations !== undefined &&
			!isJsonValue(spec.annotations)
		) {
			pushJsonIssue(issues, 'Workflow annotations must be JSON-serializable.');
		}
	}

	for (const step of spec.definition.steps) {
		validateWorkflowDevkitStep(step, serializationMode, issues);
	}
}

function validateWorkflowDevkitStep(
	step: Step,
	serializationMode: 'passthrough' | 'strict',
	issues: WorkflowValidationIssue[]
): void {
	const runtime = step.runtime?.workflowDevkit;
	if (!runtime) {
		if (step.type === 'human') {
			issues.push({
				level: 'warning',
				message: `Human step "${step.id}" does not define runtime.workflowDevkit wait behavior.`,
			});
		}
		return;
	}

	validateBehaviorConfig(step.id, runtime, issues);

	if (
		step.type === 'automation' &&
		step.retry &&
		(!runtime.idempotencyKey || runtime.idempotencyKey.trim().length === 0)
	) {
		issues.push({
			level: 'error',
			message: `Retrying automation step "${step.id}" must define runtime.workflowDevkit.idempotencyKey.`,
		});
	}

	if (
		runtime.idempotencyKey !== undefined &&
		runtime.idempotencyKey.trim().length === 0
	) {
		issues.push({
			level: 'error',
			message: `Step "${step.id}" defines an empty runtime.workflowDevkit.idempotencyKey.`,
		});
	}

	if (serializationMode === 'strict') {
		validateJsonExample(
			step.id,
			'runtime.workflowDevkit.stateExample',
			runtime.stateExample,
			issues
		);
		validateJsonExample(
			step.id,
			'runtime.workflowDevkit.hookWait.payloadExample',
			runtime.hookWait?.payloadExample,
			issues
		);
		validateJsonExample(
			step.id,
			'runtime.workflowDevkit.webhookWait.payloadExample',
			runtime.webhookWait?.payloadExample,
			issues
		);
		validateJsonExample(
			step.id,
			'runtime.workflowDevkit.approvalWait.payloadExample',
			runtime.approvalWait?.payloadExample,
			issues
		);
		validateJsonExample(
			step.id,
			'runtime.workflowDevkit.streamSession.initialState',
			runtime.streamSession?.initialState,
			issues
		);
	}
}

function validateBehaviorConfig(
	stepId: string,
	runtime: WorkflowDevkitStepRuntimeConfig,
	issues: WorkflowValidationIssue[]
): void {
	switch (runtime.behavior) {
		case 'sleep':
			if (!runtime.sleep?.duration.trim()) {
				pushBehaviorIssue(stepId, runtime.behavior, 'sleep.duration', issues);
			}
			return;
		case 'hookWait':
			if (runtime.hookWait?.resumeSource !== 'hook') {
				pushResumeSourceIssue(stepId, runtime.behavior, 'hook', issues);
			}
			return;
		case 'webhookWait':
			if (runtime.webhookWait?.resumeSource !== 'webhook') {
				pushResumeSourceIssue(stepId, runtime.behavior, 'webhook', issues);
			}
			return;
		case 'approvalWait':
			if (runtime.approvalWait?.resumeSource !== 'approval') {
				pushResumeSourceIssue(stepId, runtime.behavior, 'approval', issues);
			}
			return;
		case 'streamSession':
			if (runtime.streamSession?.resumeSource !== 'stream') {
				pushResumeSourceIssue(stepId, runtime.behavior, 'stream', issues);
			}
			return;
	}
}

function pushBehaviorIssue(
	stepId: string,
	behavior: WorkflowDevkitStepBehavior,
	field: string,
	issues: WorkflowValidationIssue[]
) {
	issues.push({
		level: 'error',
		message: `Step "${stepId}" configures ${behavior} but is missing ${field}.`,
	});
}

function pushJsonIssue(
	issues: WorkflowValidationIssue[],
	message: string
): void {
	issues.push({ level: 'error', message });
}

function pushResumeSourceIssue(
	stepId: string,
	behavior: WorkflowDevkitStepBehavior,
	expected: string,
	issues: WorkflowValidationIssue[]
): void {
	issues.push({
		level: 'error',
		message: `Step "${stepId}" configures ${behavior} but does not declare resumeSource "${expected}".`,
	});
}

function validateJsonExample(
	stepId: string,
	field: string,
	value: JsonValue | undefined,
	issues: WorkflowValidationIssue[]
): void {
	if (value === undefined) {
		return;
	}
	if (!isJsonValue(value)) {
		issues.push({
			level: 'error',
			message: `Step "${stepId}" field ${field} must be JSON-serializable.`,
		});
	}
}

function validateStringConfig(
	value: string | undefined,
	field: string,
	issues: WorkflowValidationIssue[]
): void {
	if (value !== undefined && value.trim().length === 0) {
		issues.push({
			level: 'error',
			message: `${field} must not be empty when provided.`,
		});
	}
}

function isJsonValue(
	value: unknown,
	visited = new Set<unknown>()
): value is JsonValue {
	if (
		value === null ||
		typeof value === 'boolean' ||
		typeof value === 'number' ||
		typeof value === 'string'
	) {
		return true;
	}

	if (
		typeof value === 'bigint' ||
		typeof value === 'function' ||
		typeof value === 'symbol' ||
		value === undefined
	) {
		return false;
	}

	if (visited.has(value)) {
		return false;
	}
	visited.add(value);

	if (Array.isArray(value)) {
		return value.every((item) => isJsonValue(item, visited));
	}

	if (Object.getPrototypeOf(value) !== Object.prototype) {
		return false;
	}

	return Object.values(value).every((item) => isJsonValue(item, visited));
}
