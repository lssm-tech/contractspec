import type { WorkspaceAdapters } from '../../ports/logger';
import { assertConnectEnabled } from './config';
import type { ConnectControlPlaneRuntime } from './runtime-types';
import { resolveWorkspace } from './shared';
import { loadStoredDecision, resolveStoragePaths } from './storage';
import type { ConnectReplayResult, ConnectWorkspaceInput } from './types';

export async function replayConnectDecision(
	adapters: Pick<WorkspaceAdapters, 'fs'>,
	input: ConnectWorkspaceInput & { decisionId: string },
	controlPlane?: ConnectControlPlaneRuntime
): Promise<ConnectReplayResult> {
	const workspace = resolveWorkspace(input);
	assertConnectEnabled(workspace);

	const storage = resolveStoragePaths(workspace);
	const stored = await loadStoredDecision(
		adapters.fs,
		storage,
		input.decisionId
	);
	const lookup = {
		decisionId: stored.envelope?.runtimeLink?.decisionId,
		traceId: stored.envelope?.runtimeLink?.traceId,
	};
	const trace =
		controlPlane && (lookup.decisionId || lookup.traceId)
			? await controlPlane.getExecutionTrace(lookup)
			: null;
	const replay =
		controlPlane && trace
			? await controlPlane.replayExecutionTrace(lookup)
			: null;

	return {
		decisionId: input.decisionId,
		historyDir: stored.historyDir,
		contextPack: stored.contextPack,
		planPacket: stored.planPacket,
		patchVerdict: stored.patchVerdict,
		reviewPacket: stored.reviewPacket,
		trace: trace ?? undefined,
		replay: replay ?? undefined,
		source: trace ? 'local+control-plane' : 'local',
	};
}
