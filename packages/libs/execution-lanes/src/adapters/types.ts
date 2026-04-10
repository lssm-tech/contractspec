import type { TeamWorkerLaunchSpec } from '../types';

export interface CompletionBackendAdapter {
	key: string;
	createSnapshot(runId: string, snapshotRef: string): Promise<void>;
	restoreSnapshot(runId: string, snapshotRef: string): Promise<void>;
}

export interface TeamBackendAdapter {
	key: string;
	startWorker(input: TeamWorkerLaunchSpec): Promise<void>;
	stopWorker(runId: string, workerId: string): Promise<void>;
	pauseWorker?(runId: string, workerId: string): Promise<void>;
	resumeWorker?(runId: string, workerId: string): Promise<void>;
	nudgeWorker?(runId: string, workerId: string, message: string): Promise<void>;
}

export function createCompletionBackendAdapter(
	adapter: CompletionBackendAdapter
): CompletionBackendAdapter {
	assertAdapterKey(adapter.key, 'completion');
	return adapter;
}

export function createTeamBackendAdapter(
	adapter: TeamBackendAdapter
): TeamBackendAdapter {
	assertAdapterKey(adapter.key, 'team');
	return adapter;
}

function assertAdapterKey(
	key: string,
	kind: 'completion' | 'team'
): asserts key is string {
	if (!key.trim()) {
		throw new Error(`Execution-lanes ${kind} backend adapters require a key.`);
	}
}
