import {
	type DocBlock,
	registerDocBlocks,
} from '@contractspec/lib.contracts-spec/docs';
import { Command } from 'commander';
import {
	parseActorType,
	parseApprovalStatus,
	parseCapabilityGrants,
	parseIntOption,
	toApprovalListInput,
	toDecisionListInput,
} from './options';
import {
	formatApprovalList,
	formatDecision,
	formatTrace,
	formatTraceList,
	printOutput,
} from './output';
import { createControlPlaneRuntimeContext } from './runtime-context';

export const controlPlaneCommand = new Command('control-plane')
	.description('Inspect control-plane approvals, traces, and replay state')
	.addCommand(createApprovalCommand())
	.addCommand(createTraceCommand());

function createApprovalCommand(): Command {
	return new Command('approval')
		.description('Resolve and inspect approval queues')
		.addCommand(
			new Command('list')
				.description('List pending approvals from the configured runtime store')
				.option('--workspace-id <workspaceId>', 'Workspace id filter')
				.option('--provider-key <providerKey>', 'Provider key filter')
				.option('--limit <limit>', 'Maximum items', parseIntOption)
				.option('--json', 'Output JSON')
				.action(async (options) => {
					await withContext(async ({ approvalService }) => {
						const items = await approvalService.listPendingApprovals(
							toApprovalListInput(options)
						);
						printOutput(items, options.json, formatApprovalList);
					});
				})
		)
		.addCommand(createApprovalResolutionCommand('approve'))
		.addCommand(createApprovalResolutionCommand('reject'))
		.addCommand(
			new Command('expire')
				.description('Expire pending approvals whose timeout has elapsed')
				.option(
					'--actor-id <actorId>',
					'Actor resolving expiry',
					'system:timeout'
				)
				.option(
					'--actor-type <actorType>',
					'Actor type',
					parseActorType,
					'service'
				)
				.option('--capability-grants <grants>', 'Comma-separated grants')
				.option(
					'--capability-source <capabilitySource>',
					'Trusted capability source label'
				)
				.option('--session-id <sessionId>', 'Operator or automation session id')
				.option('--limit <limit>', 'Maximum items', parseIntOption)
				.option('--json', 'Output JSON')
				.action(async (options) => {
					await withContext(async ({ approvalService }) => {
						const result = await approvalService.expirePendingApprovals({
							actorId: options.actorId,
							actorType: options.actorType,
							capabilityGrants: parseCapabilityGrants(
								options.capabilityGrants,
								['control-plane.execution.expire']
							),
							capabilitySource: options.capabilitySource,
							sessionId: options.sessionId,
							limit: options.limit,
						});
						printOutput(result, options.json, formatApprovalList);
					});
				})
		);
}

function createApprovalResolutionCommand(
	action: 'approve' | 'reject'
): Command {
	const command = new Command(action)
		.argument('<decisionId>')
		.description(
			action === 'approve'
				? 'Approve a blocked decision and enqueue its side effect'
				: 'Reject a blocked decision and record the rejection reason'
		)
		.requiredOption(
			'--actor-id <actorId>',
			action === 'approve' ? 'Approver id' : 'Rejector id'
		)
		.option('--actor-type <actorType>', 'Actor type', parseActorType, 'human')
		.option('--capability-grants <grants>', 'Comma-separated grants')
		.option(
			'--capability-source <capabilitySource>',
			'Trusted capability source label'
		)
		.option('--session-id <sessionId>', 'Operator or automation session id')
		.option('--json', 'Output JSON');

	if (action === 'reject') {
		command.option('--reason <reason>', 'Human-readable rejection reason');
	}

	command.action(async (decisionId, options) => {
		await withContext(async ({ approvalService }) => {
			const capabilityGrants = parseCapabilityGrants(options.capabilityGrants, [
				action === 'approve'
					? 'control-plane.execution.approve'
					: 'control-plane.execution.reject',
			]);
			const result =
				action === 'approve'
					? await approvalService.approve({
							decisionId,
							approvedBy: options.actorId,
							actorType: options.actorType,
							capabilityGrants,
							capabilitySource: options.capabilitySource,
							sessionId: options.sessionId,
						})
					: await approvalService.reject({
							decisionId,
							rejectedBy: options.actorId,
							actorType: options.actorType,
							capabilityGrants,
							capabilitySource: options.capabilitySource,
							sessionId: options.sessionId,
							reason: options.reason,
						});
			printOutput(result, options.json, formatDecision);
		});
	});

	return command;
}

function createTraceCommand(): Command {
	return new Command('trace')
		.description('Inspect execution traces and deterministic replay results')
		.addCommand(
			new Command('get')
				.argument('<decisionId>')
				.description('Fetch one persisted execution trace by decision id')
				.option('--json', 'Output JSON')
				.action(async (decisionId, options) => {
					await withContext(async ({ traceService }) => {
						const trace = await traceService.getExecutionTrace(decisionId);
						if (!trace)
							throw new Error(`Decision ${decisionId} was not found.`);
						printOutput(trace, options.json, formatTrace);
					});
				})
		)
		.addCommand(
			new Command('list')
				.description('List execution traces with operator-friendly filters')
				.option('--workspace-id <workspaceId>', 'Workspace id filter')
				.option('--provider-key <providerKey>', 'Provider key filter')
				.option('--trace-id <traceId>', 'Trace id filter')
				.option('--receipt-id <receiptId>', 'Receipt id filter')
				.option(
					'--external-event-id <externalEventId>',
					'External event id filter'
				)
				.option(
					'--approval-status <approvalStatus>',
					'Approval status filter',
					parseApprovalStatus
				)
				.option('--actor-id <actorId>', 'Actor id filter')
				.option('--session-id <sessionId>', 'Session id filter')
				.option('--workflow-id <workflowId>', 'Workflow id filter')
				.option(
					'--created-after <createdAfter>',
					'ISO lower bound for creation time'
				)
				.option(
					'--created-before <createdBefore>',
					'ISO upper bound for creation time'
				)
				.option('--limit <limit>', 'Maximum items', parseIntOption)
				.option('--json', 'Output JSON')
				.action(async (options) => {
					await withContext(async ({ traceService }) => {
						const traces = await traceService.listExecutionTraces(
							toDecisionListInput(options)
						);
						printOutput(traces, options.json, formatTraceList);
					});
				})
		)
		.addCommand(
			new Command('replay')
				.argument('<decisionId>')
				.description('Verify deterministic replay for one persisted decision')
				.option('--json', 'Output JSON')
				.action(async (decisionId, options) => {
					await withContext(async ({ traceService }) => {
						const replay = await traceService.replayExecutionTrace(decisionId);
						if (!replay)
							throw new Error(`Decision ${decisionId} was not found.`);
						printOutput(replay, options.json, (value) =>
							JSON.stringify(value, null, 2)
						);
					});
				})
		);
}

async function withContext(
	run: (
		ctx: Awaited<ReturnType<typeof createControlPlaneRuntimeContext>>
	) => Promise<void>
): Promise<void> {
	const context = await createControlPlaneRuntimeContext();
	try {
		await run(context);
	} finally {
		await context.dispose();
	}
}

export const controlPlaneCommandDocBlock = {
	id: 'cli.control-plane',
	title: 'contractspec control-plane Command',
	kind: 'usage',
	visibility: 'public',
	route: '/docs/cli/control-plane',
	tags: ['cli', 'control-plane', 'operators'],
	body: '# contractspec control-plane\n\nOperate the deterministic control-plane runtime from the CLI. Supported storage modes are `memory` and `postgres`, and invalid `CHANNEL_RUNTIME_STORAGE` values fail fast.\n\n```bash\ncontractspec control-plane approval list --workspace-id workspace-1\ncontractspec control-plane approval approve <decisionId> --actor-id operator-1 --capability-grants control-plane.execution.approve\ncontractspec control-plane trace replay <decisionId>\n```',
} satisfies DocBlock;
registerDocBlocks([controlPlaneCommandDocBlock]);
