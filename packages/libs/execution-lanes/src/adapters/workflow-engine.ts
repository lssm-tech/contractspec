import type { TeamWorkerLaunchSpec } from '../types';
import type { CompletionBackendAdapter, TeamBackendAdapter } from './types';

export interface WorkflowEngineDriver {
	startWorker(input: TeamWorkerLaunchSpec): Promise<void>;
	stopWorker(runId: string, workerId: string): Promise<void>;
	createSnapshot(runId: string, snapshotRef: string): Promise<void>;
	restoreSnapshot(runId: string, snapshotRef: string): Promise<void>;
}

export function createWorkflowEngineTeamBackend(
	driver: WorkflowEngineDriver
): TeamBackendAdapter {
	return {
		key: 'workflow-engine',
		startWorker(input) {
			return driver.startWorker(input);
		},
		stopWorker: driver.stopWorker,
	};
}

export function createWorkflowEngineCompletionBackend(
	driver: WorkflowEngineDriver
): CompletionBackendAdapter {
	return {
		key: 'workflow-engine',
		createSnapshot: driver.createSnapshot,
		restoreSnapshot: driver.restoreSnapshot,
	};
}
