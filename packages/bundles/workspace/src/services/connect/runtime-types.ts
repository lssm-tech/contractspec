import type { ConnectResolvedWorkspace } from './shared';
import type {
	ConnectPatchVerdict,
	ConnectPlanPacket,
	ConnectRuntimeLink,
	ConnectVerdict,
	ConnectVerifyInput,
} from './types';

export interface ConnectTraceLookup {
	decisionId?: string;
	traceId?: string;
}

export interface ConnectReviewBridgeState {
	enabled: boolean;
	mode?: 'off' | 'review-bridge';
	endpoint?: string;
	queue?: string;
	status: 'disabled' | 'skipped' | 'synced' | 'failed';
	lastAttemptAt?: string;
	syncedAt?: string;
	reviewId?: string;
	laneRunId?: string;
	runtimeDecisionId?: string;
	traceId?: string;
	error?: string;
}

export interface ConnectDecisionEnvelope {
	connectDecisionId: string;
	taskId: string;
	verdict: ConnectVerdict;
	createdAt: string;
	artifacts: {
		contextPack: string;
		planPacket: string;
		patchVerdict: string;
		reviewPacket?: string;
		evaluationResult?: string;
		replayBundle?: string;
	};
	runtimeLink?: ConnectRuntimeLink;
	reviewBridge?: ConnectReviewBridgeState;
}

export interface ConnectControlPlaneRuntime {
	linkDecision(input: {
		connectDecisionId: string;
		input: ConnectVerifyInput;
		workspace: ConnectResolvedWorkspace;
		planPacket: ConnectPlanPacket;
		patchVerdict: ConnectPatchVerdict;
		createdAt: string;
	}): Promise<ConnectRuntimeLink | null>;
	getExecutionTrace(input: ConnectTraceLookup): Promise<unknown | null>;
	replayExecutionTrace(input: ConnectTraceLookup): Promise<unknown | null>;
}
