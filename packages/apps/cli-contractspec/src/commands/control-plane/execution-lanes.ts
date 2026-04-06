import type {
	LaneRuntimeSnapshot,
	LaneStatusView,
} from '@contractspec/lib.execution-lanes';
import { Command } from 'commander';
import {
	formatEvidenceExport,
	formatLane,
	formatLaneList,
	formatReplaySummary,
	printOutput,
} from './output';
import type { ControlPlaneRuntimeContext } from './runtime-context';

interface ExecutionLaneServiceContext {
	executionLaneService: ControlPlaneRuntimeContext['executionLaneService'];
}

export function createExecutionLaneCommand(
	withContext: (
		run: (ctx: ExecutionLaneServiceContext) => Promise<void>
	) => Promise<void>
): Command {
	return new Command('lane')
		.description('Inspect and control execution-lane runs')
		.addCommand(
			new Command('list')
				.option('--lane <lane>', 'Lane key filter')
				.option('--status <status>', 'Lane status filter')
				.option('--limit <limit>', 'Maximum items', Number.parseInt)
				.option('--json', 'Output JSON')
				.action(async (options) => {
					await withContext(async ({ executionLaneService }) => {
						const items: LaneStatusView[] = await executionLaneService.list({
							lane: options.lane,
							status: options.status,
							limit: options.limit,
						});
						printOutput(items, options.json, formatLaneList);
					});
				})
		)
		.addCommand(
			new Command('get')
				.argument('<runId>')
				.option('--json', 'Output JSON')
				.action(async (runId, options) => {
					await withContext(async ({ executionLaneService }) => {
						const run: LaneRuntimeSnapshot | undefined =
							await executionLaneService.get(runId);
						if (!run) {
							throw new Error(`Execution lane run ${runId} was not found.`);
						}
						printOutput(run, options.json, formatLane);
					});
				})
		)
		.addCommand(createLaneMutationCommand('pause', withContext))
		.addCommand(createLaneMutationCommand('resume', withContext))
		.addCommand(createLaneMutationCommand('retry', withContext))
		.addCommand(
			new Command('nudge')
				.argument('<runId>')
				.requiredOption('--message <message>', 'Nudge message')
				.option('--worker-id <workerId>', 'Worker id to nudge')
				.option('--actor-id <actorId>', 'Operator id', 'local:operator')
				.option('--json', 'Output JSON')
				.action(async (runId, options) => {
					await withContext(async ({ executionLaneService }) => {
						const result = await executionLaneService.nudge(runId, {
							workerId: options.workerId,
							message: options.message,
							actorId: options.actorId,
						});
						printOutput(result, options.json, formatLane);
					});
				})
		)
		.addCommand(
			new Command('abort')
				.argument('<runId>')
				.option('--reason <reason>', 'Abort reason')
				.option('--actor-id <actorId>', 'Operator id', 'local:operator')
				.option('--json', 'Output JSON')
				.action(async (runId, options) => {
					await withContext(async ({ executionLaneService }) => {
						const result = await executionLaneService.abort(
							runId,
							options.reason,
							options.actorId
						);
						printOutput(result, options.json, formatLane);
					});
				})
		)
		.addCommand(
			new Command('shutdown')
				.argument('<runId>')
				.option('--reason <reason>', 'Shutdown reason')
				.option('--actor-id <actorId>', 'Operator id', 'local:operator')
				.option('--json', 'Output JSON')
				.action(async (runId, options) => {
					await withContext(async ({ executionLaneService }) => {
						const result = await executionLaneService.shutdown(
							runId,
							options.reason,
							options.actorId
						);
						printOutput(result, options.json, formatLane);
					});
				})
		)
		.addCommand(
			new Command('request-approval')
				.argument('<runId>')
				.requiredOption('--role <role>', 'Role requiring approval')
				.option(
					'--verdict <verdict>',
					'Requested approval verdict: approve|acknowledge',
					'approve'
				)
				.option('--comment <comment>', 'Approval request comment')
				.option('--actor-id <actorId>', 'Operator id', 'local:operator')
				.option('--json', 'Output JSON')
				.action(async (runId, options) => {
					await withContext(async ({ executionLaneService }) => {
						const result = await executionLaneService.requestApproval(runId, {
							role: options.role,
							verdict: options.verdict,
							comment: options.comment,
							actorId: options.actorId,
						});
						printOutput(
							result,
							options.json,
							(value) =>
								`${value.role} approval requested (${value.verdict}) for ${value.runId}`
						);
					});
				})
		)
		.addCommand(
			new Command('escalate')
				.argument('<runId>')
				.requiredOption('--reason <reason>', 'Escalation reason')
				.option('--target <target>', 'Escalation target', 'human')
				.option('--actor-id <actorId>', 'Operator id', 'local:operator')
				.option('--json', 'Output JSON')
				.action(async (runId, options) => {
					await withContext(async ({ executionLaneService }) => {
						const result = await executionLaneService.escalate(runId, {
							reason: options.reason,
							target: options.target,
							actorId: options.actorId,
						});
						printOutput(result, options.json, formatLane);
					});
				})
		)
		.addCommand(
			new Command('evidence')
				.alias('export-evidence')
				.argument('<runId>')
				.option('--json', 'Output JSON')
				.action(async (runId, options) => {
					await withContext(async ({ executionLaneService }) => {
						const result = await executionLaneService.exportEvidence(runId);
						printOutput(result, options.json, formatEvidenceExport);
					});
				})
		)
		.addCommand(
			new Command('replay')
				.argument('<runId>')
				.option('--actor-id <actorId>', 'Operator id', 'local:operator')
				.option('--json', 'Output JSON')
				.action(async (runId, options) => {
					await withContext(async ({ executionLaneService }) => {
						const result = await executionLaneService.openReplay(
							runId,
							options.actorId
						);
						printOutput(result, options.json, formatReplaySummary);
					});
				})
		);
}

function createLaneMutationCommand(
	action: 'pause' | 'resume' | 'retry',
	withContext: (
		run: (ctx: ExecutionLaneServiceContext) => Promise<void>
	) => Promise<void>
): Command {
	return new Command(action)
		.argument('<runId>')
		.option('--actor-id <actorId>', 'Operator id', 'local:operator')
		.option('--json', 'Output JSON')
		.action(async (runId, options) => {
			await withContext(async ({ executionLaneService }) => {
				const result = await executionLaneService[action](
					runId,
					options.actorId
				);
				printOutput(result, options.json, formatLane);
			});
		});
}
