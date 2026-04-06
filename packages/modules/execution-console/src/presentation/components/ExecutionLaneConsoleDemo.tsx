import type { LaneRuntimeSnapshot } from '@contractspec/lib.execution-lanes';
import {
	buildCompletionStatusView as deriveCompletionStatusView,
	buildLaneStatusView as deriveLaneStatusView,
	buildTeamStatusView as deriveTeamStatusView,
} from '@contractspec/lib.execution-lanes';
import { VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { ExecutionLaneCommandReference } from './ExecutionLaneCommandReference';
import { ExecutionLaneConsole } from './ExecutionLaneConsole';

export function ExecutionLaneConsoleDemo() {
	const snapshot: LaneRuntimeSnapshot = {
		run: {
			runId: 'demo-run',
			lane: 'team.coordinated',
			objective: 'Demo execution lane console',
			sourceRequest: 'demo',
			scopeClass: 'large',
			status: 'running',
			currentPhase: 'dispatch',
			ownerRole: 'planner',
			authorityContext: { policyRefs: ['policy.demo'], ruleContextRefs: [] },
			verificationPolicyKey: 'team',
			blockingRisks: [],
			pendingApprovalRoles: ['verifier'],
			evidenceBundleIds: ['evidence-1'],
			createdAt: '2026-04-06T12:00:00.000Z',
			updatedAt: '2026-04-06T12:05:00.000Z',
		},
		events: [
			{
				id: 'event-1',
				runId: 'demo-run',
				type: 'team.started',
				createdAt: '2026-04-06T12:01:00.000Z',
				message: 'Team run started.',
			},
		],
		transitions: [
			{
				id: 'transition-1',
				runId: 'demo-run',
				from: 'plan.consensus',
				to: 'team.coordinated',
				reason: 'Parallel execution selected.',
				createdAt: '2026-04-06T12:00:30.000Z',
			},
		],
		artifacts: [
			{
				id: 'artifact-1',
				runId: 'demo-run',
				artifactType: 'execution-plan-pack',
				createdAt: '2026-04-06T12:00:10.000Z',
				body: {},
				summary: 'Planning output attached.',
			},
		],
		evidence: [
			{
				id: 'evidence-1',
				runId: 'demo-run',
				artifactIds: ['artifact-1'],
				classes: ['verification_results'],
				createdAt: '2026-04-06T12:04:00.000Z',
				replayBundleUri: 'replay://demo-run',
				summary: 'Verification artifacts collected.',
			},
		],
		approvals: [
			{
				id: 'approval-1',
				runId: 'demo-run',
				role: 'verifier',
				verdict: 'approve',
				state: 'requested',
				requestedAt: '2026-04-06T12:03:00.000Z',
			},
		],
		team: {
			runId: 'demo-run',
			spec: {
				id: 'demo-run',
				objective: 'Demo execution lane console',
				backendKey: 'in-process',
				workers: [
					{
						workerId: 'worker-1',
						roleProfile: 'executor',
						concurrencyClass: 'parallel',
					},
				],
				backlog: [
					{
						taskId: 'task-1',
						title: 'Implement runtime',
						description: 'Finish execution-lane runtime.',
					},
				],
				coordination: {
					mailbox: true,
					taskLeasing: true,
					heartbeats: true,
					rebalancing: true,
				},
				verificationLane: { required: true, ownerRole: 'verifier' },
				shutdownPolicy: {
					requireTerminalTasks: true,
					requireEvidenceGate: true,
				},
			},
			status: 'running',
			tasks: [
				{
					taskId: 'task-1',
					title: 'Implement runtime',
					description: 'Finish execution-lane runtime.',
					roleHint: 'executor',
					dependencies: [],
					status: 'running',
					claimedBy: 'worker-1',
					evidenceBundleIds: ['evidence-1'],
					retryHistory: [],
					lease: {
						workerId: 'worker-1',
						leasedAt: '2026-04-06T12:02:00.000Z',
						expiresAt: '2026-04-06T12:06:00.000Z',
						renewCount: 2,
					},
				},
			],
			workers: [
				{
					workerId: 'worker-1',
					roleProfile: 'executor',
					status: 'running',
					currentTaskId: 'task-1',
					lastHeartbeatAt: '2026-04-06T12:04:30.000Z',
					progressSummary: 'Implementing lane runtime.',
				},
			],
			mailbox: [
				{
					id: 'mail-1',
					from: 'leader',
					to: 'worker-1',
					scope: 'leader-worker',
					createdAt: '2026-04-06T12:02:00.000Z',
					body: 'Focus on runtime persistence and tests.',
				},
			],
			heartbeatLog: [
				{
					id: 'heartbeat-1',
					workerId: 'worker-1',
					createdAt: '2026-04-06T12:04:30.000Z',
					currentTaskId: 'task-1',
					health: 'healthy',
					progressSummary: 'Implementing lane runtime.',
				},
			],
			cleanup: {
				status: 'not_requested',
				failures: [],
			},
			evidenceBundleIds: ['evidence-1'],
			createdAt: '2026-04-06T12:00:00.000Z',
			updatedAt: '2026-04-06T12:05:00.000Z',
		},
		completion: {
			runId: 'demo-run',
			spec: {
				id: 'demo-run',
				ownerRole: 'executor',
				snapshotRef: 'snapshot://demo-run',
				delegateRoles: ['verifier'],
				progressLedgerRef: 'ledger://demo-run',
				verificationPolicy: {
					key: 'demo',
					requiredEvidence: ['verification_results'],
					minimumApprovals: [{ role: 'verifier', verdict: 'approve' }],
					failOnMissingEvidence: true,
					allowConditionalCompletion: false,
				},
				signoff: {
					verifierRole: 'verifier',
					requireArchitectReview: false,
				},
				terminalConditions: ['done', 'blocked', 'failed', 'aborted'],
			},
			phase: 'awaiting_signoff',
			iteration: 2,
			retryCount: 1,
			progressLedger: [],
			evidenceBundleIds: ['evidence-1'],
			pendingApprovalRoles: ['verifier'],
			progressLedgerArtifactId: 'ledger-artifact-1',
			loopStateArtifactId: 'loop-state-1',
			createdAt: '2026-04-06T12:00:00.000Z',
			updatedAt: '2026-04-06T12:05:00.000Z',
		},
	};

	const lane = deriveLaneStatusView(snapshot);
	const team = deriveTeamStatusView(snapshot);
	const completion = deriveCompletionStatusView(snapshot);

	return (
		<VStack gap="xl" align="stretch">
			<ExecutionLaneCommandReference />
			<ExecutionLaneConsole
				snapshot={snapshot}
				lane={lane}
				team={team}
				completion={completion}
				onPause={() => {}}
				onResume={() => {}}
				onRetry={() => {}}
				onAbort={() => {}}
				onShutdown={() => {}}
				onRequestApproval={() => {}}
				onExportEvidence={() => {}}
				onEscalate={() => {}}
				onOpenReplay={() => {}}
			/>
		</VStack>
	);
}
