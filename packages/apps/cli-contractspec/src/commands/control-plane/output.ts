import type {
	ChannelDecisionRecord,
	ChannelExecutionTrace,
} from '@contractspec/integration.runtime/channel';

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
