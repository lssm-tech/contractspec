import { createHash } from 'node:crypto';

import type {
	ChannelCompiledPlan,
	ChannelExecutionStartStep,
	ChannelInboundEvent,
	ChannelPlanDag,
	ChannelPlanStep,
	ChannelPlanStepIo,
	ChannelPlanTraceEntry,
	ChannelPolicyVerdict,
} from './types';

const CONTROL_PLANE_RUNTIME_SCHEMA_VERSION = '1.0.0';

export function deterministicId(...parts: string[]): string {
	return createHash('sha256')
		.update(parts.join(':'))
		.digest('hex')
		.slice(0, 24);
}

export function resolveEventTraceId(event: ChannelInboundEvent): string {
	return (
		event.traceId ??
		deterministicId(
			'trace',
			event.workspaceId,
			event.providerKey,
			event.externalEventId
		)
	);
}

export function summarizeIntent(event: ChannelInboundEvent): string {
	const text = event.message?.text?.trim();
	return text
		? text.slice(0, 240)
		: `Received ${event.eventType} via ${event.providerKey}.`;
}

export function buildChannelPlanDag(steps: ChannelPlanStep[]): ChannelPlanDag {
	const orderIndex = new Map<string, number>();
	for (const [index, step] of steps.entries()) {
		if (orderIndex.has(step.id)) {
			throw new Error(`Duplicate channel plan step id: ${step.id}`);
		}
		orderIndex.set(step.id, index);
	}

	const edges = steps.flatMap((step) =>
		step.dependsOn.map((dependencyId) => {
			const dependencyIndex = orderIndex.get(dependencyId);
			if (typeof dependencyIndex === 'undefined') {
				throw new Error(
					`Channel plan step ${step.id} depends on unknown step ${dependencyId}.`
				);
			}
			if (dependencyIndex >= orderIndex.get(step.id)!) {
				throw new Error(
					`Channel plan step ${step.id} must depend on an earlier deterministic step.`
				);
			}
			return {
				from: dependencyId,
				to: step.id,
			};
		})
	);

	const sourceIds = new Set(edges.map((edge) => edge.from));
	return {
		rootStepIds: steps
			.filter((step) => step.dependsOn.length === 0)
			.map((step) => step.id),
		terminalStepIds: steps
			.filter((step) => !sourceIds.has(step.id))
			.map((step) => step.id),
		topologicalOrder: steps.map((step) => step.id),
		edges,
	};
}

export function buildChannelPlanTrace(
	plan: ChannelCompiledPlan
): ChannelPlanTraceEntry[] {
	return plan.steps.map((step) => ({
		stepId: step.id,
		contractKey: step.contractKey,
		status: step.status,
		metadata: {
			planId: plan.id,
			actorType: plan.actor.type,
			requiresApproval: plan.approval.required,
			dagIndex: plan.dag.topologicalOrder.indexOf(step.id),
			dependencyCount: step.dependsOn.length,
			inputSchema: step.io.inputSchema.name,
			...(step.io.outputSchema
				? {
						outputSchema: step.io.outputSchema.name,
					}
				: {}),
			...(plan.policy
				? {
						verdict: plan.policy.verdict,
						riskTier: plan.policy.riskTier,
					}
				: {}),
		},
	}));
}

export function getExecutionStep(
	plan: ChannelCompiledPlan
): ChannelExecutionStartStep | undefined {
	return plan.steps.find(
		(step): step is ChannelExecutionStartStep =>
			step.contractKey === 'controlPlane.execution.start'
	);
}

export function getExecutionStatus(
	verdict: ChannelPolicyVerdict
): ChannelExecutionStartStep['status'] {
	return verdict === 'autonomous' ? 'completed' : 'blocked';
}

export function createStepIo(
	contractKey: string,
	inputSchemaName: string,
	outputSchemaName?: string
): ChannelPlanStepIo {
	return {
		contract: {
			key: contractKey,
			version: CONTROL_PLANE_RUNTIME_SCHEMA_VERSION,
		},
		inputSchema: {
			name: inputSchemaName,
		},
		outputSchema: outputSchemaName
			? {
					name: outputSchemaName,
				}
			: undefined,
	};
}
