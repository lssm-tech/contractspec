import type { LaneKey, LaneRunStatus } from '@contractspec/lib.execution-lanes';
import type { ChannelApprovalStatus } from './base-types';

export interface ConnectReviewActor {
	id: string;
	type: 'human' | 'agent' | 'service' | 'tool';
	sessionId?: string;
	traceId?: string;
}

export interface ConnectReviewContractRef {
	key: string;
	version: string;
	kind?: string;
}

export interface ConnectReviewContextPack {
	id: string;
	taskId: string;
	repoId: string;
	branch: string;
	actor: ConnectReviewActor;
	knowledge: Array<{
		spaceKey: string;
		category: 'canonical' | 'operational' | 'external' | 'ephemeral';
		trustLevel: 'high' | 'medium' | 'low';
		source: string;
		digest?: string;
	}>;
	impactedContracts: ConnectReviewContractRef[];
	affectedSurfaces: string[];
	policyBindings: Array<{
		key: string;
		version: string;
		source: string;
		authority: string;
	}>;
	configRefs: Array<{
		kind: string;
		ref: string;
	}>;
	acceptanceChecks: string[];
}

export interface ConnectReviewPlanPacket {
	id: string;
	taskId: string;
	repoId: string;
	branch: string;
	actor: ConnectReviewActor;
	objective: string;
	steps: Array<{
		id: string;
		summary: string;
		paths?: string[];
		commands?: string[];
		contractRefs?: string[];
	}>;
	requiredApprovals: Array<{ capability: string; reason: string }>;
	riskScore: number;
	verificationStatus: 'approved' | 'revise' | 'review' | 'denied';
	controlPlane?: {
		decisionId?: string;
		traceId?: string;
	};
}

export interface ConnectReviewPatchVerdict {
	decisionId: string;
	verdict: 'permit' | 'rewrite' | 'require_review' | 'deny';
	controlPlane: {
		decisionId?: string;
		approvalStatus?: ChannelApprovalStatus;
		traceId?: string;
		requiresApproval?: boolean;
	};
}

export interface ConnectReviewPacket {
	id: string;
	sourceDecisionId: string;
	objective: string;
	reason: string;
	summary: {
		paths: string[];
		impactedContracts: ConnectReviewContractRef[];
		affectedSurfaces: string[];
		requiredChecks: string[];
	};
	evidence: Array<{
		type: string;
		ref: string;
	}>;
	requiredApprovals: Array<{ capability: string; reason: string }>;
	controlPlane: {
		decisionId?: string;
		approvalStatus?: ChannelApprovalStatus;
		traceId?: string;
	};
	studio?: {
		enabled?: boolean;
		mode?: 'off' | 'review-bridge';
		queue?: string;
	};
}

export interface ConnectReviewDecisionEnvelope {
	connectDecisionId: string;
	taskId: string;
	verdict: 'permit' | 'rewrite' | 'require_review' | 'deny';
	createdAt: string;
	runtimeLink?: {
		decisionId?: string;
		approvalStatus?: ChannelApprovalStatus;
		traceId?: string;
	};
	reviewBridge?: Record<string, unknown>;
}

export interface ConnectReviewQueueRecord {
	id: string;
	workspaceId: string;
	queue: string;
	sourceDecisionId: string;
	runtimeDecisionId?: string;
	traceId?: string;
	laneRunId?: string;
	nextLane?: LaneKey;
	canonPackRefs: string[];
	knowledge: ConnectReviewContextPack['knowledge'];
	configRefs: ConnectReviewContextPack['configRefs'];
	reviewPacket: ConnectReviewPacket;
	contextPack?: ConnectReviewContextPack;
	planPacket?: ConnectReviewPlanPacket;
	patchVerdict?: ConnectReviewPatchVerdict;
	decisionEnvelope?: ConnectReviewDecisionEnvelope;
	createdAt: string;
	updatedAt: string;
	syncedAt: string;
}

export type ConnectReviewQueueStatus =
	| 'pending'
	| 'approved'
	| 'rejected'
	| 'expired'
	| 'completed'
	| 'blocked';

export interface ConnectReviewQueueItem extends ConnectReviewQueueRecord {
	status: ConnectReviewQueueStatus;
	approvalStatus?: ChannelApprovalStatus;
	laneStatus?: LaneRunStatus;
}

export interface ConnectReviewIngestInput {
	queue?: string;
	reviewPacket: ConnectReviewPacket;
	contextPack?: ConnectReviewContextPack;
	planPacket?: ConnectReviewPlanPacket;
	patchVerdict?: ConnectReviewPatchVerdict;
	decisionEnvelope?: ConnectReviewDecisionEnvelope;
}

export interface ListConnectReviewQueueItemsInput {
	queue?: string;
	sourceDecisionId?: string;
	status?: ConnectReviewQueueStatus;
	limit?: number;
}

export interface ConnectReviewSweepInput {
	actorId?: string;
	limit?: number;
	nudgeMessage?: string;
	staleAfterMs: number;
}

export interface ConnectReviewSweepResult {
	scanned: number;
	nudged: string[];
	requestedApproval: string[];
	skipped: string[];
}
