import {
	createClarifyLane,
	createLaneRuntime,
} from '@contractspec/lib.execution-lanes';
import { Command } from 'commander';
import { formatLane, printOutput } from '../control-plane/output';
import { createControlPlaneRuntimeContext } from '../control-plane/runtime-context';
import {
	createLaneRunState,
	laneRegistry,
	resolveAuthorityContext,
	roleGuard,
} from './shared';

export function createClarifyCommand(): Command {
	return new Command('clarify')
		.argument('<task>')
		.option('--objective <objective>', 'Objective override')
		.option('--constraint <constraint...>', 'Constraints')
		.option('--assumption <assumption...>', 'Assumptions')
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
				const runtime = createLaneRuntime(context.executionLaneStore, {
					laneRegistry,
				});
				const runId = `clarify-${Date.now()}`;
				roleGuard.assert({
					roleKey: 'planner',
					lane: 'clarify',
					requiredTools: ['read', 'analyze', 'review'],
					allowedWriteScopes: ['none', 'artifacts-only'],
				});
				const run = createLaneRunState({
					runId,
					lane: 'clarify',
					objective: task,
					sourceRequest: task,
					ownerRole: 'planner',
					scopeClass: 'medium',
					authorityContext: resolveAuthorityContext(options),
					options,
				});
				await runtime.startRun(run, options.actorId);
				const result = createClarifyLane().run({
					request: task,
					objective: options.objective,
					constraints: options.constraint,
					assumptions: options.assumption,
					authorityContext: run.authorityContext,
				});
				await runtime.appendArtifact(
					runId,
					{
						runId,
						artifactType: 'clarification_artifact',
						createdAt: result.meta.createdAt,
						body: result,
						summary: result.objective,
					},
					options.actorId
				);
				await runtime.handoffToLane(
					runId,
					result.meta.recommendedNextLane,
					'Clarification completed.',
					options.actorId
				);
				await runtime.markTerminal(
					runId,
					'completed',
					undefined,
					options.actorId
				);
				printOutput(await runtime.getSnapshot(runId), options.json, formatLane);
			} finally {
				await context.dispose();
			}
		});
}
