import {
	createConsensusPlanningLane,
	createLaneRuntime,
} from '@contractspec/lib.execution-lanes';
import { Command } from 'commander';
import { formatLane, printOutput } from '../control-plane/output';
import { createControlPlaneRuntimeContext } from '../control-plane/runtime-context';
import { resolvePlanCommandPayload } from './input';
import { buildExecutionPlanPack } from './launch-specs';
import {
	assertGitWorkspaceSnapshotUnchanged,
	captureGitWorkspaceSnapshot,
} from './read-only-guard';
import { createLaneRunState, laneRegistry, roleGuard } from './shared';

export function createPlanCommand(): Command {
	return new Command('plan')
		.argument('[task]')
		.option('--mode <mode>', 'Planning mode: short|deliberate', 'short')
		.option(
			'--next-lane <lane>',
			'Preferred next lane: complete.persistent|team.coordinated',
			'complete.persistent'
		)
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
				const planInput = await resolvePlanCommandPayload(task, options);
				const runtime = createLaneRuntime(context.executionLaneStore, {
					laneRegistry,
				});
				const runId = `plan-${Date.now()}`;
				await runtime.startRun(
					createLaneRunState({
						runId,
						lane: 'plan.consensus',
						objective: planInput.objective,
						sourceRequest: planInput.request,
						ownerRole: 'planner',
						scopeClass:
							planInput.mode === 'deliberate' ? 'high-risk' : 'medium',
						authorityContext: planInput.authorityContext,
						options,
					}),
					options.actorId
				);
				const lane = createConsensusPlanningLane({
					mode: planInput.mode,
					enforceReadOnly: true,
					artifactSink: {
						async persist(artifact) {
							await runtime.appendArtifact(
								runId,
								{
									runId,
									artifactType: artifact.type,
									createdAt: artifact.createdAt,
									body: artifact.body,
									summary: artifact.type,
								},
								options.actorId
							);
						},
					},
					purityGuard: {
						capture() {
							for (const roleKey of [
								'planner',
								'architect',
								'critic',
							] as const) {
								roleGuard.assert({
									roleKey,
									lane: 'plan.consensus',
									requiredTools: ['read', 'analyze', 'review'],
									allowedWriteScopes: ['none', 'artifacts-only'],
								});
							}
							return captureGitWorkspaceSnapshot(process.cwd());
						},
						assertUnchanged: assertGitWorkspaceSnapshotUnchanged,
					},
					planner: {
						async draft() {
							return buildExecutionPlanPack(planInput);
						},
						async revise({ currentPlan, iteration, reviews }) {
							return {
								...currentPlan,
								assumptions: [
									...currentPlan.assumptions,
									`revision-${iteration}`,
									...reviews.flatMap((review) => review.findings),
								],
							};
						},
					},
					architect: {
						async review() {
							return {
								reviewerRole: 'architect',
								verdict: 'approve',
								findings:
									planInput.mode === 'deliberate'
										? ['High-risk flow requires stronger rollback packaging.']
										: [],
								recommendedChanges: [],
								createdAt: new Date().toISOString(),
							};
						},
					},
					critic: {
						async review(plan) {
							return {
								reviewerRole: 'critic',
								verdict: plan.planSteps.every(
									(step) => step.acceptanceCriteria.length > 0
								)
									? 'approve'
									: 'revise',
								findings: [],
								recommendedChanges: [],
								createdAt: new Date().toISOString(),
							};
						},
					},
				});
				const result = await lane.run();
				await runtime.handoffToLane(
					runId,
					result.plan.staffing.handoffRecommendation.nextLane,
					'Consensus planning produced an execution handoff.',
					options.actorId
				);
				await runtime.markTerminal(
					runId,
					result.approved ? 'completed' : 'blocked',
					result.approved ? undefined : 'Consensus plan was not approved.',
					options.actorId
				);
				printOutput(await runtime.getSnapshot(runId), options.json, formatLane);
			} finally {
				await context.dispose();
			}
		});
}
