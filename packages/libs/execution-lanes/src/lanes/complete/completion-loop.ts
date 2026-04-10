import type { CompletionBackendAdapter } from '../../adapters/types';
import { createEvidenceGate } from '../../evidence/gate';
import { RoleProfileRegistry } from '../../registry/role-profile-registry';
import {
	resolveVerificationPolicySource,
	VerificationPolicyRegistry,
} from '../../registry/verification-policy-registry';
import { createRoleGuard } from '../../runtime/role-guard';
import { syncLaneRunFromCompletion } from '../../runtime/state-sync';
import type { LaneRuntimeStore } from '../../runtime/store';
import type {
	ApprovalRecord,
	CompletionFailureClassInput,
	CompletionLoopSpec,
	CompletionLoopState,
	CompletionRecord,
	EvidenceBundleRef,
} from '../../types';
import { createId } from '../../utils/id';
import { assertValidCompletionLoopSpec } from '../../validation/completion-loop-spec';
import {
	addCompletionProgress,
	attachCompletionEvidence,
	evaluateCompletionEvidence,
	requestCompletionApproval,
	resumeCompletionLoop,
} from './completion-loop-progress';
import {
	assertCompletionAuthority,
	assertCompletionRoles,
	type CompletionLoopDependencies,
	createDefaultRoleRegistry,
	persistCompletionArtifacts,
	requireCompletionState,
	requiredSignoffRoles,
} from './completion-loop-shared';
import {
	decideCompletionApproval,
	finalizeCompletionLoop,
	recordCompletionFailure,
} from './completion-loop-terminal';

export function createCompletionLoop(
	store: LaneRuntimeStore,
	input?: {
		roleRegistry?: RoleProfileRegistry;
		policyRegistry?: VerificationPolicyRegistry;
		backend?: CompletionBackendAdapter;
		hooks?: CompletionLoopDependencies['hooks'];
	}
) {
	const dependencies: CompletionLoopDependencies = {
		store,
		backend: input?.backend,
		hooks: input?.hooks,
		gate: createEvidenceGate(),
		roleGuard: createRoleGuard(
			input?.roleRegistry ?? createDefaultRoleRegistry()
		),
	};

	return {
		async create(
			spec: CompletionLoopSpec,
			contextSnapshot?: Record<string, unknown>,
			actorId?: string
		) {
			await assertCompletionAuthority(
				dependencies,
				'complete.create',
				spec.id,
				actorId,
				{ metadata: { ownerRole: spec.ownerRole } }
			);
			assertValidCompletionLoopSpec(spec);
			const verificationPolicy = resolveVerificationPolicySource(
				spec.verificationPolicy,
				input?.policyRegistry
			);
			assertCompletionRoles(dependencies.roleGuard, spec);
			const now = new Date().toISOString();
			const state: CompletionLoopState = {
				runId: spec.id,
				spec: { ...spec, verificationPolicy },
				phase: 'initialized',
				iteration: 0,
				retryCount: 0,
				progressLedger: [],
				evidenceBundleIds: [],
				pendingApprovalRoles: requiredSignoffRoles(spec.signoff),
				contextSnapshotArtifactId: createId('context'),
				progressLedgerArtifactId: createId('ledger-artifact'),
				loopStateArtifactId: createId('loop-state'),
				createdAt: now,
				updatedAt: now,
			};
			await dependencies.backend?.createSnapshot(spec.id, spec.snapshotRef);
			await store.saveCompletion(state);
			await store.saveArtifact({
				id: state.contextSnapshotArtifactId!,
				runId: spec.id,
				artifactType: 'context_snapshot',
				createdAt: now,
				body: { spec: state.spec, contextSnapshot },
				summary: 'Initial completion loop context snapshot.',
			});
			await persistCompletionArtifacts(store, state);
			await syncLaneRunFromCompletion(store, state);
			return state;
		},
		addProgress(
			runId: string,
			message: string,
			classification?: CompletionFailureClassInput,
			actorId?: string
		) {
			return addCompletionProgress(
				dependencies,
				runId,
				message,
				classification,
				actorId
			);
		},
		attachEvidence(runId: string, bundle: EvidenceBundleRef, actorId?: string) {
			return attachCompletionEvidence(dependencies, runId, bundle, actorId);
		},
		requestApproval(runId: string, approval: ApprovalRecord, actorId?: string) {
			return requestCompletionApproval(dependencies, runId, approval, actorId);
		},
		evaluateEvidence(
			runId: string,
			blockingRisks?: string[],
			actorId?: string
		) {
			return evaluateCompletionEvidence(
				dependencies,
				runId,
				blockingRisks,
				actorId
			);
		},
		resume(runId: string, actorId?: string) {
			return resumeCompletionLoop(dependencies, runId, actorId);
		},
		decideApproval(
			runId: string,
			inputApproval: Omit<ApprovalRecord, 'id' | 'runId' | 'requestedAt'> & {
				requestedAt?: string;
			},
			actorId?: string
		) {
			return decideCompletionApproval(
				dependencies,
				runId,
				inputApproval,
				actorId
			);
		},
		recordFailure(
			runId: string,
			classification: CompletionFailureClassInput,
			message: string,
			actorId?: string
		) {
			return recordCompletionFailure(
				dependencies,
				runId,
				classification,
				message,
				actorId
			);
		},
		finalize(
			runId: string,
			inputFinalize: {
				status: CompletionRecord['status'];
				terminalReason?: string;
				approvalIds: string[];
				unresolvedRisks: string[];
			},
			actorId?: string
		) {
			return finalizeCompletionLoop(
				dependencies,
				runId,
				inputFinalize,
				actorId
			);
		},
		async getState(runId: string) {
			return requireCompletionState(store, runId);
		},
		async require(runId: string) {
			return requireCompletionState(store, runId);
		},
	};
}
