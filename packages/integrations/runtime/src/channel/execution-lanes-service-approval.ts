import type {
	ApprovalRecord,
	CompletionLoopState,
} from '@contractspec/lib.execution-lanes';
import {
	assertAction,
	type EscalateExecutionLaneInput,
	type ExecutionLaneOperatorDependencies,
	now,
	type RequestExecutionLaneApprovalInput,
	recordOperatorAction,
	requireSnapshot,
	saveApproval,
	syncCompletionState,
} from './execution-lanes-service-shared';

export async function requestLaneApproval(
	dependencies: ExecutionLaneOperatorDependencies,
	runId: string,
	input: RequestExecutionLaneApprovalInput
) {
	await assertAction(
		dependencies,
		runId,
		'request_approval',
		input.actorId,
		input.comment,
		{ role: input.role }
	);
	const approval: ApprovalRecord = {
		id: `approval-${Date.now()}`,
		runId,
		role: input.role,
		verdict: input.verdict ?? 'approve',
		state: 'requested',
		comment: input.comment,
		requestedAt: now(dependencies),
		decidedBy: input.actorId,
	};
	await saveApproval(dependencies, approval);
	const completion = await dependencies.store.getCompletion(runId);
	if (completion) {
		await syncCompletionState(dependencies, {
			...completion,
			phase: 'awaiting_signoff',
			pendingApprovalRoles: Array.from(
				new Set([...completion.pendingApprovalRoles, input.role])
			),
			updatedAt: now(dependencies),
		} as CompletionLoopState);
	}
	await recordOperatorAction(dependencies, runId, 'request_approval', {
		actorId: input.actorId,
		reason: input.comment,
		metadata: { role: input.role, verdict: approval.verdict },
		summary: `Approval requested from ${input.role}.`,
	});
	return approval;
}

export async function escalateLaneRun(
	dependencies: ExecutionLaneOperatorDependencies,
	runId: string,
	input: EscalateExecutionLaneInput
) {
	await assertAction(
		dependencies,
		runId,
		'escalate',
		input.actorId,
		input.reason,
		{ target: input.target ?? 'human' }
	);
	await recordOperatorAction(dependencies, runId, 'escalate', {
		actorId: input.actorId,
		reason: input.reason,
		metadata: { target: input.target ?? 'human' },
		summary: `Escalated to ${input.target ?? 'human'}.`,
	});
	return requireSnapshot(dependencies, runId);
}
