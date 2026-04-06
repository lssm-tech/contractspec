import type { TeamWorkerLaunchSpec } from '../types';
import type { TeamBackendAdapter } from './types';

export interface QueueDriver {
	enqueueWorker(input: TeamWorkerLaunchSpec): Promise<void>;
	cancelWorker(runId: string, workerId: string): Promise<void>;
}

export function createQueueTeamBackend(
	driver: QueueDriver
): TeamBackendAdapter {
	return {
		key: 'remote-queue',
		startWorker(input) {
			return driver.enqueueWorker(input);
		},
		stopWorker: driver.cancelWorker,
	};
}
