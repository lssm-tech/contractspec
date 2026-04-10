import {
	createInMemoryTeamBackend,
	createLaneRuntime,
	createTeamRun,
} from '@contractspec/lib.execution-lanes';
import { Command } from 'commander';
import { formatLane, printOutput } from '../control-plane/output';
import { createControlPlaneRuntimeContext } from '../control-plane/runtime-context';
import { resolveTeamLaunchPayload } from './input';
import {
	buildExecutionPlanPack,
	buildTeamRunSpecFromPlanPack,
} from './launch-specs';
import {
	createLaneRunState,
	laneRegistry,
	normalizeMode,
	resolveAuthorityContext,
	roleRegistry,
} from './shared';

export function createTeamCommand(): Command {
	return new Command('team')
		.argument('[task]')
		.option('--mode <mode>', 'Planning mode: short|deliberate', 'short')
		.option('--stdin', 'Read plan input from stdin')
		.option('--actor-id <actorId>', 'Execution actor id', 'local:planner')
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
				const launch = await resolveTeamLaunchPayload(task, options);
				const planPack =
					launch.planPack ??
					buildExecutionPlanPack({
						request: launch.task!,
						objective: launch.task!,
						constraints: [],
						assumptions: [],
						authorityContext: resolveAuthorityContext(options),
						mode,
						nextLane: 'team.coordinated',
					});
				const runId = `team-${Date.now()}`;
				const teamSpec = buildTeamRunSpecFromPlanPack({
					runId,
					planPack,
					teamSpec: launch.teamSpec,
				});
				const runtime = createLaneRuntime(context.executionLaneStore, {
					laneRegistry,
				});
				await runtime.startRun(
					createLaneRunState({
						runId,
						lane: 'team.coordinated',
						objective: planPack.objective,
						sourceRequest: planPack.meta.sourceRequest,
						ownerRole: 'planner',
						scopeClass: planPack.meta.scopeClass,
						authorityContext: planPack.authorityContext,
						options,
						blockingRisks: planPack.verification.blockingRisks,
						pendingApprovalRoles: planPack.verification.requiredApprovals,
					}),
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
				const team = createTeamRun(
					context.executionLaneStore,
					createInMemoryTeamBackend(),
					{ roleRegistry }
				);
				await team.create(teamSpec, options.actorId);
				await team.start(runId, options.actorId);
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
