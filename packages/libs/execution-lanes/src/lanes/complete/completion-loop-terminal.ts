import {
	syncLaneApprovalState,
	syncLaneRunFromCompletion,
} from '../../runtime/state-sync';
import type {
	ApprovalRecord,
	CompletionFailureClassInput,
	CompletionLoopState,
	CompletionRecord,
} from '../../types';
import { createId } from '../../utils/id';
import {
	assertCompletionAuthority,
	type CompletionLoopDependencies,
	formatGateFailure,
	persistCompletionArtifacts,
	requireCompletionState,
	requiredSignoffRoles,
} from './completion-loop-shared';
import { resolveCompletionFailure } from './failure-class';

export async function decideCompletionApproval(
	dependencies: CompletionLoopDependencies,
	runId: string,
	inputApproval: Omit<ApprovalRecord, 'id' | 'runId' | 'requestedAt'> & {
		requestedAt?: string;
	},
	actorId?: string
) {
	await assertCompletionAuthority(
		dependencies,
		'complete.decide_approval',
		runId,
		actorId,
		{ metadata: { role: inputApproval.role, state: inputApproval.state } }
	);
	const state = await requireCompletionState(dependencies.store, runId);
	const approval: ApprovalRecord = {
		id: createId('approval'),
		runId,
		role: inputApproval.role,
		verdict: inputApproval.verdict,
		state: inputApproval.state,
		comment: inputApproval.comment,
		requestedAt: inputApproval.requestedAt ?? new Date().toISOString(),
		decidedAt: inputApproval.decidedAt,
		decidedBy: inputApproval.decidedBy,
	};
	const next: CompletionLoopState = {
		...state,
		pendingApprovalRoles: state.pendingApprovalRoles.filter(
			(role) => role !== approval.role
		),
		lastFailureClass:
			approval.state === 'rejected'
				? 'approval_denied'
				: state.lastFailureClass,
		phase: approval.state === 'rejected' ? 'blocked' : 'awaiting_signoff',
		signoffArtifactId: state.signoffArtifactId ?? createId('signoff'),
		updatedAt: new Date().toISOString(),
	};
	await dependencies.store.saveApproval(approval);
	await syncLaneApprovalState(dependencies.store, approval);
	await dependencies.store.saveCompletion(next);
	await dependencies.store.saveArtifact({
		id: next.signoffArtifactId!,
		runId,
		artifactType: 'signoff_record',
		createdAt: next.updatedAt,
		body: approval,
		summary: `${approval.role} ${approval.state}.`,
	});
	await persistCompletionArtifacts(dependencies.store, next);
	await syncLaneRunFromCompletion(dependencies.store, next);
	return approval;
}

export async function recordCompletionFailure(
	dependencies: CompletionLoopDependencies,
	runId: string,
	classification: CompletionFailureClassInput,
	message: string,
	actorId?: string
) {
	await assertCompletionAuthority(
		dependencies,
		'complete.record_failure',
		runId,
		actorId,
		{ reason: message, metadata: { classification } }
	);
	const state = await requireCompletionState(dependencies.store, runId);
	const resolved = resolveCompletionFailure(classification);
	const next: CompletionLoopState = {
		...state,
		phase: resolved.phase,
		retryCount: resolved.retryable ? state.retryCount + 1 : state.retryCount,
		lastFailureClass: resolved.normalized,
		updatedAt: new Date().toISOString(),
	};
	await dependencies.store.saveCompletion(next);
	await persistCompletionArtifacts(dependencies.store, next, message);
	await dependencies.store.appendEvent({
		id: createId('event'),
		runId,
		type: 'completion.failure',
		createdAt: next.updatedAt,
		phase: next.phase,
		message,
		metadata: {
			classification: resolved.normalized,
			sourceClassification: classification,
		},
	});
	await syncLaneRunFromCompletion(dependencies.store, next);
	return next;
}

export async function finalizeCompletionLoop(
	dependencies: CompletionLoopDependencies,
	runId: string,
	inputFinalize: {
		status: CompletionRecord['status'];
		terminalReason?: string;
		approvalIds: string[];
		unresolvedRisks: string[];
	},
	actorId?: string
) {
	await assertCompletionAuthority(
		dependencies,
		'complete.finalize',
		runId,
		actorId,
		{
			reason: inputFinalize.terminalReason,
			metadata: { status: inputFinalize.status },
		}
	);
	const state = await requireCompletionState(dependencies.store, runId);
	const approvals = await dependencies.store.listApprovals(runId);
	if (inputFinalize.status === 'completed') {
		const result = dependencies.gate.evaluate({
			policy: state.spec.verificationPolicy,
			evidence: await dependencies.store.listEvidence(runId),
			approvals,
			blockingRisks: inputFinalize.unresolvedRisks,
		});
		if (!result.passed && result.conditionallyPassed !== true) {
			throw new Error(formatGateFailure(result));
		}
		for (const role of requiredSignoffRoles(state.spec.signoff)) {
			if (
				!approvals.some(
					(approval) => approval.role === role && approval.state === 'approved'
				)
			) {
				throw new Error(`Missing required sign-off for role ${role}.`);
			}
		}
	}
	const completedAt = new Date().toISOString();
	const next: CompletionLoopState = {
		...state,
		phase: inputFinalize.status,
		pendingApprovalRoles: [],
		terminalRecordArtifactId: createId('terminal'),
		updatedAt: completedAt,
	};
	const record: CompletionRecord = {
		runId,
		status: inputFinalize.status,
		completedAt,
		iterationCount: state.iteration,
		evidenceBundleIds: state.evidenceBundleIds,
		approvalIds: inputFinalize.approvalIds,
		unresolvedRisks: inputFinalize.unresolvedRisks,
		terminalReason: inputFinalize.terminalReason,
	};
	await dependencies.store.saveCompletion(next);
	await persistCompletionArtifacts(dependencies.store, next);
	await dependencies.store.saveArtifact({
		id: next.terminalRecordArtifactId!,
		runId,
		artifactType: 'completion_record',
		createdAt: completedAt,
		body: record,
		summary: record.terminalReason ?? `Completion loop ${record.status}.`,
	});
	await syncLaneRunFromCompletion(
		dependencies.store,
		next,
		inputFinalize.terminalReason
	);
	return record;
}
