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
