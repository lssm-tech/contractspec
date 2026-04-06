import type { CompletionBackendAdapter } from '../../adapters/types';
import { DEFAULT_ROLE_PROFILES } from '../../defaults';
import { createEvidenceGate } from '../../evidence/gate';
import { RoleProfileRegistry } from '../../registry/role-profile-registry';
import {
	assertLaneAuthority,
	type LaneAuthorityAction,
	type LaneAuthorityHooks,
} from '../../runtime/authority-hooks';
import { createRoleGuard } from '../../runtime/role-guard';
import type { LaneRuntimeStore } from '../../runtime/store';
import type {
	CompletionLoopSpec,
	CompletionLoopState,
	EvidenceGateResult,
} from '../../types';

export interface CompletionLoopDependencies {
	store: LaneRuntimeStore;
	backend?: CompletionBackendAdapter;
	hooks?: LaneAuthorityHooks;
	gate: ReturnType<typeof createEvidenceGate>;
	roleGuard: ReturnType<typeof createRoleGuard>;
}

export async function assertCompletionAuthority(
	dependencies: CompletionLoopDependencies,
	action: LaneAuthorityAction,
	runId: string,
	actorId?: string,
	input?: { reason?: string; metadata?: Record<string, unknown> }
) {
	await assertLaneAuthority(dependencies.hooks, {
		action,
		runId,
		lane: 'complete.persistent',
		actorId,
		reason: input?.reason,
		metadata: input?.metadata,
	});
}

export function assertCompletionRoles(
	roleGuard: ReturnType<typeof createRoleGuard>,
	spec: CompletionLoopSpec
) {
	roleGuard.assert({
		roleKey: spec.ownerRole,
		lane: 'complete.persistent',
		requiredTools: ['execute'],
	});
	for (const delegateRole of spec.delegateRoles) {
		if (delegateRole !== 'human') {
			roleGuard.assert({ roleKey: delegateRole, lane: 'complete.persistent' });
		}
	}
	if (spec.signoff.verifierRole !== 'human') {
		roleGuard.assert({
			roleKey: spec.signoff.verifierRole,
			lane: 'complete.persistent',
			requiredTools: ['review'],
		});
	}
}

export async function requireCompletionState(
	store: LaneRuntimeStore,
	runId: string
) {
	const state = await store.getCompletion(runId);
	if (!state) {
		throw new Error(`Completion loop not found: ${runId}`);
	}
	return state;
}

export async function persistCompletionArtifacts(
	store: LaneRuntimeStore,
	state: CompletionLoopState,
	progressSummary?: string
) {
	if (state.progressLedgerArtifactId) {
		await store.saveArtifact({
			id: state.progressLedgerArtifactId,
			runId: state.runId,
			artifactType: 'progress_ledger',
			createdAt: state.updatedAt,
			body: state.progressLedger,
			summary:
				progressSummary ??
				state.progressLedger.at(-1)?.message ??
				'Completion progress ledger.',
		});
	}
	if (state.loopStateArtifactId) {
		await store.saveArtifact({
			id: state.loopStateArtifactId,
			runId: state.runId,
			artifactType: 'loop_state',
			createdAt: state.updatedAt,
			body: state,
			summary: `Completion loop phase ${state.phase}.`,
		});
	}
}

export function requiredSignoffRoles(signoff: CompletionLoopSpec['signoff']) {
	return [
		signoff.verifierRole,
		...(signoff.requireArchitectReview ? ['architect'] : []),
		...(signoff.requireHumanApproval ? ['human'] : []),
	];
}

export function formatGateFailure(result: EvidenceGateResult) {
	return [
		result.missingEvidence.length > 0
			? `missing evidence: ${result.missingEvidence.join(', ')}`
			: undefined,
		result.staleEvidence.length > 0
			? `stale evidence: ${result.staleEvidence.join(', ')}`
			: undefined,
		result.missingApprovals.length > 0
			? `missing approvals: ${result.missingApprovals.join(', ')}`
			: undefined,
		result.blockingRisks.length > 0
			? `blocking risks: ${result.blockingRisks.join(', ')}`
			: undefined,
	]
		.filter((value): value is string => Boolean(value))
		.join('; ');
}

export function createDefaultRoleRegistry() {
	const registry = new RoleProfileRegistry();
	for (const profile of DEFAULT_ROLE_PROFILES) {
		registry.register(profile);
	}
	return registry;
}
