import {
	createCompletionLoop,
	createLaneRuntime,
} from '@contractspec/lib.execution-lanes';
import { Command } from 'commander';
import { formatLane, printOutput } from '../control-plane/output';
import { createControlPlaneRuntimeContext } from '../control-plane/runtime-context';
import { resolveCompletionLaunchPayload } from './input';
import {
	buildCompletionLoopSpecFromPlanPack,
	buildExecutionPlanPack,
} from './launch-specs';
import {
	createLaneRunState,
	laneRegistry,
	normalizeMode,
	resolveAuthorityContext,
	roleRegistry,
} from './shared';

export function createCompleteCommand(): Command {
	return new Command('complete')
		.argument('[task]')
		.option('--mode <mode>', 'Planning mode: short|deliberate', 'short')
		.option('--stdin', 'Read plan input from stdin')
		.option('--actor-id <actorId>', 'Execution actor id', 'local:executor')
		.option('--policy-ref <policyRef...>', 'Policy refs')
		.option('--rule-ref <ruleRef...>', 'Rule-context refs')
		.option('--approval-ref <approvalRef...>', 'Approval refs')
		.option('--session-id <sessionId>', 'Runtime session id')
		.option('--workflow-id <workflowId>', 'Runtime workflow id')
		.option('--trace-id <traceId>', 'Runtime trace id')
		.option('--json', 'Output JSON')
		.action(async (task, options) => {
			const context = await createControlPlaneRuntimeContext();
			try {
				const mode = normalizeMode(options.mode);
				const launch = await resolveCompletionLaunchPayload(task, options);
				const planPack =
					launch.planPack ??
					buildExecutionPlanPack({
						request: launch.task!,
						objective: launch.task!,
						constraints: [],
						assumptions: [],
						authorityContext: resolveAuthorityContext(options),
						mode,
						nextLane: 'complete.persistent',
					});
				const runId = `complete-${Date.now()}`;
				const completionSpec = buildCompletionLoopSpecFromPlanPack({
					runId,
					planPack,
					completionSpec: launch.completionSpec,
				});
				const runtime = createLaneRuntime(context.executionLaneStore, {
					laneRegistry,
				});
				await runtime.startRun(
					createLaneRunState({
						runId,
						lane: 'complete.persistent',
						objective: planPack.objective,
						sourceRequest: planPack.meta.sourceRequest,
						ownerRole: completionSpec.ownerRole,
						scopeClass: planPack.meta.scopeClass,
						authorityContext: planPack.authorityContext,
						options,
						verificationPolicyKey: completionSpec.verificationPolicy.key,
						blockingRisks: planPack.verification.blockingRisks,
						pendingApprovalRoles: [
							completionSpec.signoff.verifierRole,
							...(completionSpec.signoff.requireArchitectReview
								? ['architect']
								: []),
							...(completionSpec.signoff.requireHumanApproval ? ['human'] : []),
						],
					}),
					options.actorId
				);
				const loop = createCompletionLoop(context.executionLaneStore, {
					roleRegistry,
				});
				await loop.create(
					completionSpec,
					launch.contextSnapshot ?? { task: launch.task, planPack },
					options.actorId
				);
				await runtime.appendArtifact(
					runId,
					{
						runId,
						artifactType: 'plan_pack',
						createdAt: new Date().toISOString(),
						body: planPack,
						summary: planPack.objective,
					},
					options.actorId
				);
				await loop.resume(runId, options.actorId);
				printOutput(
					await context.executionLaneService.get(runId),
					options.json,
					formatLane
				);
			} finally {
				await context.dispose();
			}
		});
}
