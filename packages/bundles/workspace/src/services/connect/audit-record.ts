import type { ConnectDecisionEnvelope } from './runtime-types';
import type { ConnectResolvedWorkspace } from './shared';
import type {
	ConnectContextPack,
	ConnectReviewPacket,
	ConnectVerifyInput,
} from './types';

export function buildConnectAuditRecord(input: {
	contextPack: ConnectContextPack;
	createdAt: string;
	envelope: ConnectDecisionEnvelope;
	reviewPacket?: ConnectReviewPacket;
	verifyInput: ConnectVerifyInput;
	workspace: ConnectResolvedWorkspace;
}): Record<string, unknown> {
	return {
		timestamp: input.createdAt,
		eventType: 'connect.verify',
		decisionId: input.envelope.connectDecisionId,
		runtimeDecisionId: input.envelope.runtimeLink?.decisionId,
		taskId: input.verifyInput.taskId,
		verdict: input.envelope.verdict,
		tool: input.verifyInput.tool,
		traceId:
			input.envelope.runtimeLink?.traceId ?? input.contextPack.actor.traceId,
		actor: input.contextPack.actor,
		adapter: {
			channel: 'cli',
			source: 'connect',
			tool: input.verifyInput.tool,
		},
		repoId: input.workspace.repoId,
		refs: {
			...input.envelope.artifacts,
			reviewPacket:
				input.reviewPacket != null
					? input.envelope.artifacts.reviewPacket
					: undefined,
		},
	};
}
