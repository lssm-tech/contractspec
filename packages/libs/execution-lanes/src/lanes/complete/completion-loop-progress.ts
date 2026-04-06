import {
	syncLaneApprovalState,
	syncLaneRunFromCompletion,
} from '../../runtime/state-sync';
import type {
	ApprovalRecord,
	CompletionFailureClassInput,
	CompletionLoopState,
	EvidenceBundleRef,
} from '../../types';
import { normalizeExecutionLaneFailureClass } from '../../types';
import { createId } from '../../utils/id';
import {
	assertCompletionAuthority,
	type CompletionLoopDependencies,
	persistCompletionArtifacts,
	requireCompletionState,
} from './completion-loop-shared';

export async function addCompletionProgress(
	dependencies: CompletionLoopDependencies,
	runId: string,
	message: string,
	classification?: CompletionFailureClassInput,
	actorId?: string
) {
	await assertCompletionAuthority(
		dependencies,
		'complete.progress',
		runId,
		actorId,
		{ reason: message, metadata: { classification } }
	);
	const state = await requireCompletionState(dependencies.store, runId);
	const normalizedClassification = classification
		? normalizeExecutionLaneFailureClass(classification)
		: undefined;
	const next: CompletionLoopState = {
		...state,
		phase: 'working',
		iteration: state.iteration + 1,
		progressLedger: [
			...state.progressLedger,
			{
				id: createId('ledger'),
				iteration: state.iteration + 1,
				createdAt: new Date().toISOString(),
				message,
				classification: normalizedClassification,
			},
		],
		lastFailureClass: normalizedClassification,
		updatedAt: new Date().toISOString(),
	};
	await dependencies.store.saveCompletion(next);
	await persistCompletionArtifacts(dependencies.store, next, message);
	await dependencies.store.appendEvent({
		id: createId('event'),
		runId,
		type: 'completion.progress',
		createdAt: next.updatedAt,
		phase: next.phase,
		message,
	});
	await syncLaneRunFromCompletion(dependencies.store, next);
	return next;
}

export async function attachCompletionEvidence(
	dependencies: CompletionLoopDependencies,
	runId: string,
	bundle: EvidenceBundleRef,
	actorId?: string
) {
	await assertCompletionAuthority(
		dependencies,
		'complete.attach_evidence',
		runId,
		actorId,
		{ metadata: { classes: bundle.classes } }
	);
	const state = await requireCompletionState(dependencies.store, runId);
	const next: CompletionLoopState = {
		...state,
		phase: 'waiting_for_evidence',
		evidenceBundleIds: Array.from(
			new Set([...state.evidenceBundleIds, bundle.id])
		),
		updatedAt: new Date().toISOString(),
	};
	await dependencies.store.saveCompletion(next);
	await dependencies.store.saveEvidence(bundle);
	await dependencies.store.saveArtifact({
		id: createId('artifact'),
		runId,
		artifactType: 'evidence_bundle_ref',
		createdAt: next.updatedAt,
		body: bundle,
		summary: bundle.summary,
	});
	await persistCompletionArtifacts(dependencies.store, next);
	await syncLaneRunFromCompletion(dependencies.store, next);
	return next;
}

export async function requestCompletionApproval(
	dependencies: CompletionLoopDependencies,
	runId: string,
	approval: ApprovalRecord,
	actorId?: string
) {
	await assertCompletionAuthority(
		dependencies,
		'complete.request_approval',
		runId,
		actorId,
		{ metadata: { role: approval.role, state: approval.state } }
	);
	const state = await requireCompletionState(dependencies.store, runId);
	const next: CompletionLoopState = {
		...state,
		phase: 'awaiting_signoff',
		pendingApprovalRoles: Array.from(
			new Set([...state.pendingApprovalRoles, approval.role])
		),
		updatedAt: new Date().toISOString(),
	};
	await dependencies.store.saveCompletion(next);
	await dependencies.store.saveApproval(approval);
	await syncLaneApprovalState(dependencies.store, approval);
	await dependencies.store.saveArtifact({
		id: createId('artifact'),
		runId,
		artifactType: 'signoff_request',
		createdAt: next.updatedAt,
		body: approval,
		summary: `Requested ${approval.role} sign-off.`,
	});
	await persistCompletionArtifacts(dependencies.store, next);
	await syncLaneRunFromCompletion(dependencies.store, next);
	return next;
}

export async function evaluateCompletionEvidence(
	dependencies: CompletionLoopDependencies,
	runId: string,
	blockingRisks?: string[],
	actorId?: string
) {
	await assertCompletionAuthority(
		dependencies,
		'complete.evaluate_evidence',
		runId,
		actorId,
		{ metadata: { blockingRisks } }
	);
	const state = await requireCompletionState(dependencies.store, runId);
	const result = dependencies.gate.evaluate({
		policy: state.spec.verificationPolicy,
		evidence: await dependencies.store.listEvidence(runId),
		approvals: await dependencies.store.listApprovals(runId),
		blockingRisks,
	});
	const hasEvidenceGap =
		result.missingEvidence.length > 0 || result.staleEvidence.length > 0;
	const gateReady = result.passed || result.conditionallyPassed === true;
	const next: CompletionLoopState = {
		...state,
		phase:
			result.blockingRisks.length > 0
				? 'blocked'
				: gateReady
					? 'awaiting_signoff'
					: hasEvidenceGap
						? 'remediating'
						: result.missingApprovals.length > 0
							? 'awaiting_signoff'
							: 'remediating',
		lastGateResult: result,
		lastFailureClass: !gateReady
			? result.blockingRisks.length > 0
				? 'policy_blocked'
				: result.missingEvidence.length > 0
					? 'missing_evidence'
					: hasEvidenceGap
						? 'failing_evidence'
						: undefined
			: undefined,
		updatedAt: new Date().toISOString(),
	};
	await dependencies.store.saveCompletion(next);
	await persistCompletionArtifacts(dependencies.store, next);
	await dependencies.store.saveArtifact({
		id: createId('artifact'),
		runId,
		artifactType: 'evidence_gate_result',
		createdAt: next.updatedAt,
		body: result,
		summary: result.passed
			? 'Evidence gate passed.'
			: 'Evidence gate requires remediation.',
	});
	await syncLaneRunFromCompletion(dependencies.store, next);
	return result;
}

export async function resumeCompletionLoop(
	dependencies: CompletionLoopDependencies,
	runId: string,
	actorId?: string
) {
	await assertCompletionAuthority(
		dependencies,
		'complete.resume',
		runId,
		actorId
	);
	const state = await requireCompletionState(dependencies.store, runId);
	if (['completed', 'blocked', 'failed', 'aborted'].includes(state.phase)) {
		return state;
	}
	await dependencies.backend?.restoreSnapshot(runId, state.spec.snapshotRef);
	const next: CompletionLoopState = {
		...state,
		phase:
			state.phase === 'waiting_for_evidence' || state.phase === 'remediating'
				? 'remediating'
				: state.phase === 'awaiting_signoff'
					? 'awaiting_signoff'
					: 'working',
		updatedAt: new Date().toISOString(),
	};
	await dependencies.store.saveCompletion(next);
	await persistCompletionArtifacts(dependencies.store, next);
	await syncLaneRunFromCompletion(dependencies.store, next);
	return next;
}
