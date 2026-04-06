import type { CompletionBackendAdapter, TeamBackendAdapter } from './types';

export function createInProcessCompletionBackend(): CompletionBackendAdapter {
	const snapshots = new Map<string, string>();
	return {
		key: 'in-process',
		async createSnapshot(runId, snapshotRef) {
			snapshots.set(runId, snapshotRef);
		},
		async restoreSnapshot(runId, snapshotRef) {
			const current = snapshots.get(runId);
			if (current !== snapshotRef) {
				throw new Error(
					`Missing in-process snapshot "${snapshotRef}" for run ${runId}.`
				);
			}
		},
	};
}

export function createInProcessTeamBackend(): TeamBackendAdapter {
	const workers = new Map<string, 'running' | 'paused'>();
	return {
		key: 'in-process',
		async startWorker(input) {
			workers.set(`${input.runId}:${input.workerId}`, 'running');
		},
		async stopWorker(runId, workerId) {
			workers.delete(`${runId}:${workerId}`);
		},
		async pauseWorker(runId, workerId) {
			const key = `${runId}:${workerId}`;
			if (!workers.has(key)) {
				throw new Error(`Worker ${workerId} is not running for run ${runId}.`);
			}
			workers.set(key, 'paused');
		},
		async resumeWorker(runId, workerId) {
			const key = `${runId}:${workerId}`;
			if (!workers.has(key)) {
				throw new Error(`Worker ${workerId} is not running for run ${runId}.`);
			}
			workers.set(key, 'running');
		},
		async nudgeWorker(runId, workerId) {
			const key = `${runId}:${workerId}`;
			if (!workers.has(key)) {
				throw new Error(`Worker ${workerId} is not running for run ${runId}.`);
			}
		},
	};
}

export const createInMemoryTeamBackend = createInProcessTeamBackend;
