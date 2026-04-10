import { describe, expect, it } from 'bun:test';
import type { LaneRuntimeSnapshot } from '@contractspec/lib.execution-lanes';
import { renderToStaticMarkup } from 'react-dom/server';
import { ExecutionLaneConsole } from './ExecutionLaneConsole';

describe('ExecutionLaneConsole', () => {
	it('renders readiness details and operator controls', () => {
		const snapshot: LaneRuntimeSnapshot = {
			run: {
				runId: 'run-1',
				lane: 'complete.persistent',
				objective: 'Close the task',
				sourceRequest: 'close it',
				scopeClass: 'medium',
				status: 'running',
				currentPhase: 'awaiting_signoff',
				ownerRole: 'executor',
				authorityContext: {
					policyRefs: ['policy.execution-lanes'],
					ruleContextRefs: ['rules.execution-lanes'],
				},
				verificationPolicyKey: 'completion',
				blockingRisks: [],
				pendingApprovalRoles: ['verifier'],
				evidenceBundleIds: ['evidence-1'],
				createdAt: '2026-04-06T12:00:00.000Z',
				updatedAt: '2026-04-06T12:05:00.000Z',
			},
			events: [],
			transitions: [],
			artifacts: [],
			evidence: [
				{
					id: 'evidence-1',
					runId: 'run-1',
					artifactIds: [],
					classes: ['verification_results'],
					createdAt: '2026-04-06T12:03:00.000Z',
					replayBundleUri: 'replay://run-1',
				},
			],
			approvals: [],
			completion: {
				runId: 'run-1',
				spec: {
					id: 'run-1',
					ownerRole: 'executor',
					snapshotRef: 'snapshot://run-1',
					delegateRoles: ['verifier'],
					progressLedgerRef: 'ledger://run-1',
					verificationPolicy: {
						key: 'completion',
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
			team: {
				runId: 'run-1',
				spec: {
					id: 'run-1',
					objective: 'Close the task',
					backendKey: 'tmux',
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
							title: 'Verify output',
							description: 'Check the final evidence package.',
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
						title: 'Verify output',
						description: 'Check the final evidence package.',
						dependencies: [],
						roleHint: 'verifier',
						status: 'running',
						claimedBy: 'worker-1',
						evidenceBundleIds: ['evidence-1'],
						retryHistory: [],
						lease: {
							workerId: 'worker-1',
							leasedAt: '2026-04-06T12:01:00.000Z',
							expiresAt: '2026-04-06T12:06:00.000Z',
							renewCount: 1,
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
						progressSummary: 'Packaging evidence',
					},
				],
				mailbox: [
					{
						id: 'mail-1',
						from: 'leader',
						to: 'worker-1',
						scope: 'leader-worker',
						createdAt: '2026-04-06T12:04:00.000Z',
						body: 'Finish verification.',
					},
				],
				heartbeatLog: [],
				cleanup: {
					status: 'not_requested',
					failures: [],
				},
				evidenceBundleIds: ['evidence-1'],
				createdAt: '2026-04-06T12:00:00.000Z',
				updatedAt: '2026-04-06T12:05:00.000Z',
			},
		};

		const html = renderToStaticMarkup(
			<ExecutionLaneConsole
				snapshot={snapshot}
				lane={{
					runId: 'run-1',
					lane: 'complete.persistent',
					objective: 'Close the task',
					status: 'running',
					currentPhase: 'awaiting_signoff',
					ownerRole: 'executor',
					evidenceCompleteness: 1,
					missingArtifacts: ['completion_record', 'signoff_record'],
					pendingApprovals: ['verifier'],
					missingEvidence: [],
					missingApprovals: ['verifier:approve'],
					blockingRisks: [],
					terminalReadiness: 'missing_approval',
					updatedAt: '2026-04-06T12:05:00.000Z',
				}}
				completion={{
					runId: 'run-1',
					phase: 'awaiting_signoff',
					iteration: 2,
					retryCount: 1,
					snapshotRef: 'snapshot://run-1',
					pendingApprovals: ['verifier'],
					evidenceBundles: 1,
					missingEvidence: [],
					terminalReadiness: 'missing_approval',
					updatedAt: '2026-04-06T12:05:00.000Z',
				}}
				team={{
					runId: 'run-1',
					status: 'running',
					totalTasks: 1,
					completedTasks: 0,
					activeWorkers: 1,
					staleWorkers: 0,
					staleLeaseCount: 0,
					staleWorkerIds: [],
					pendingEvidence: 0,
					queueSkew: 0,
					verificationReady: true,
					cleanupStatus: 'not_requested',
					updatedAt: '2026-04-06T12:05:00.000Z',
				}}
				onRequestApproval={() => {}}
				onExportEvidence={() => {}}
				onPause={() => {}}
				onResume={() => {}}
				onRetry={() => {}}
				onEscalate={() => {}}
				onOpenReplay={() => {}}
				onShutdown={() => {}}
				onNudgeWorker={() => {}}
				onAbort={() => {}}
			/>
		);

		expect(html).toContain('Readiness');
		expect(html).toContain('Missing artifacts');
		expect(html).toContain('completion_record, signoff_record');
		expect(html).toContain('snapshot://run-1');
		expect(html).toContain('Request Approval');
		expect(html).toContain('Export Evidence');
		expect(html).toContain('Pause');
		expect(html).toContain('Resume');
		expect(html).toContain('Retry');
		expect(html).toContain('Escalate');
		expect(html).toContain('Open Replay');
		expect(html).toContain('Shutdown');
		expect(html).toContain('Nudge');
		expect(html).toContain('Abort');
	});
});
