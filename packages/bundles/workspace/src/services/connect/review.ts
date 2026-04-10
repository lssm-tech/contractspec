import type { WorkspaceAdapters } from '../../ports/logger';
import { assertConnectEnabled } from './config';
import { resolveWorkspace } from './shared';
import { listStoredReviewPackets, resolveStoragePaths } from './storage';
import type { ConnectReviewListItem, ConnectWorkspaceInput } from './types';

export async function listConnectReviewPackets(
	adapters: Pick<WorkspaceAdapters, 'fs'>,
	input: ConnectWorkspaceInput = {}
): Promise<ConnectReviewListItem[]> {
	const workspace = resolveWorkspace(input);
	assertConnectEnabled(workspace);

	return listStoredReviewPackets(adapters.fs, resolveStoragePaths(workspace));
}
