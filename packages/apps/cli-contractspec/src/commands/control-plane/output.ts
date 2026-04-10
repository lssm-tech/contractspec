import type {
	ChannelDecisionRecord,
	ChannelExecutionTrace,
} from '@contractspec/integration.runtime/channel';
import type {
	LaneRuntimeSnapshot,
	LaneStatusView,
} from '@contractspec/lib.execution-lanes';
import {
	buildCompletionStatusView as deriveCompletionStatusView,
	buildLaneStatusView as deriveLaneStatusView,
	buildTeamStatusView as deriveTeamStatusView,
} from '@contractspec/lib.execution-lanes';

export function printOutput<T>(
	value: T,
	asJson: boolean | undefined,
	formatText: (value: T) => string
): void {
	console.log(asJson ? JSON.stringify(value, null, 2) : formatText(value));
}

export function formatApprovalList(decisions: ChannelDecisionRecord[]): string {
	return decisions.length === 0
		? 'No matching approvals found.'
		: decisions.map(formatDecision).join('\n\n');
}

export function formatTraceList(traces: ChannelExecutionTrace[]): string {
	return traces.length === 0
		? 'No matching traces found.'
		: traces.map(formatTrace).join('\n\n');
}

export function formatDecision(decision: ChannelDecisionRecord): string {
	return [
		`Decision: ${decision.id}`,
		`Status: ${decision.approvalStatus}`,
		`Policy: ${decision.policyMode} / ${decision.riskTier}`,
		`Actor: ${decision.actionPlan.actor.type}:${decision.actionPlan.actor.id}`,
		`Summary: ${decision.actionPlan.intent.summary}`,
	].join('\n');
}

export function formatTrace(trace: ChannelExecutionTrace): string {
	return [
		`Decision: ${trace.decision.id}`,
		`Receipt: ${trace.receipt?.status ?? 'missing'}`,
		`Trace: ${trace.replay.traceId}`,
		`Plan: ${trace.replay.planId}`,
		`Approval: ${trace.replay.approvalStatus}`,
		`Actions: ${trace.actions.length}`,
	].join('\n');
}

export function formatLaneList(items: LaneStatusView[]): string {
	return items.length === 0
		? 'No execution-lane runs found.'
		: items
				.map((item) =>
					[
						`Run: ${item.runId}`,
						`Lane: ${item.lane}`,
						`Status: ${item.status} (${item.currentPhase})`,
						`Readiness: ${item.terminalReadiness}`,
						`Owner: ${item.ownerRole}`,
						`Objective: ${item.objective}`,
						`Missing artifacts: ${item.missingArtifacts.join(', ') || 'none'}`,
						`Pending approvals: ${item.pendingApprovals.join(', ') || 'none'}`,
						`Missing evidence: ${item.missingEvidence.join(', ') || 'none'}`,
						`Missing approvals: ${item.missingApprovals.join(', ') || 'none'}`,
						`Blocking risks: ${item.blockingRisks.join(', ') || 'none'}`,
						`Next lane: ${item.recommendedNextLane ?? 'none'}`,
					].join('\n')
				)
				.join('\n\n');
}

export function formatLane(
	snapshot: LaneRuntimeSnapshot | null | undefined
): string {
	if (!snapshot) {
		return 'Execution lane run not found.';
	}
	const lane = deriveLaneStatusView(snapshot);
	const team = deriveTeamStatusView(snapshot);
	const completion = deriveCompletionStatusView(snapshot);
	return [
		`Run: ${snapshot.run.runId}`,
		`Lane: ${snapshot.run.lane}`,
		`Status: ${snapshot.run.status}`,
		`Phase: ${snapshot.run.currentPhase}`,
		`Objective: ${snapshot.run.objective}`,
		`Readiness: ${lane.terminalReadiness}`,
		`Missing artifacts: ${lane.missingArtifacts.join(', ') || 'none'}`,
		`Pending approvals: ${lane.pendingApprovals.join(', ') || 'none'}`,
		`Missing evidence: ${lane.missingEvidence.join(', ') || 'none'}`,
		`Missing approvals: ${lane.missingApprovals.join(', ') || 'none'}`,
		`Blocking risks: ${lane.blockingRisks.join(', ') || 'none'}`,
		`Recommended next lane: ${lane.recommendedNextLane ?? 'none'}`,
		completion
			? `Completion: ${completion.phase} · retries=${completion.retryCount} · snapshot=${completion.snapshotRef} · pending=${completion.pendingApprovals.join(', ') || 'none'} · missing evidence=${completion.missingEvidence.join(', ') || 'none'}`
			: 'Completion: none',
		team
			? `Team: ${team.status} · completed tasks=${team.completedTasks}/${team.totalTasks} · stale workers=${team.staleWorkers} [${team.staleWorkerIds.join(', ') || 'none'}] · stale leases=${team.staleLeaseCount} · queue skew=${team.queueSkew} · pending evidence=${team.pendingEvidence} · verification ready=${team.verificationReady} · cleanup=${team.cleanupStatus}`
			: 'Team: none',
		`Approvals: ${snapshot.approvals.length}`,
		`Evidence: ${snapshot.evidence.length}`,
		`Artifacts: ${snapshot.artifacts.length}`,
		`Events: ${snapshot.events.length}`,
	].join('\n');
}

export function formatEvidenceExport(value: {
	runId: string;
	exportedAt: string;
	evidence: unknown[];
	approvals: unknown[];
	artifacts: unknown[];
	replayBundleUris: string[];
	primaryReplayBundleUri?: string;
}): string {
	return [
		`Run: ${value.runId}`,
		`Exported: ${value.exportedAt}`,
		`Evidence bundles: ${value.evidence.length}`,
		`Approvals: ${value.approvals.length}`,
		`Artifacts: ${value.artifacts.length}`,
		`Replay URIs: ${value.replayBundleUris.join(', ') || 'none'}`,
		`Primary replay: ${value.primaryReplayBundleUri ?? 'none'}`,
	].join('\n');
}

export function formatReplaySummary(value: {
	runId: string;
	replayBundleUris: string[];
	primaryReplayBundleUri?: string;
}): string {
	return [
		`Run: ${value.runId}`,
		`Primary replay: ${value.primaryReplayBundleUri ?? 'none'}`,
		`Replay URIs: ${value.replayBundleUris.join(', ') || 'none'}`,
	].join('\n');
}
