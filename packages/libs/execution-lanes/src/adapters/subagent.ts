import type { TeamWorkerLaunchSpec } from '../types';
import type { TeamBackendAdapter } from './types';

export interface SubagentDriver {
	spawnWorker(input: TeamWorkerLaunchSpec): Promise<void>;
	stopWorker(runId: string, workerId: string): Promise<void>;
	pauseWorker?(runId: string, workerId: string): Promise<void>;
	resumeWorker?(runId: string, workerId: string): Promise<void>;
	nudgeWorker?(runId: string, workerId: string, message: string): Promise<void>;
}

export function createSubagentTeamBackend(
	driver: SubagentDriver
): TeamBackendAdapter {
	return {
		key: 'subagent',
		startWorker(input) {
			return driver.spawnWorker(input);
		},
		stopWorker: driver.stopWorker,
		pauseWorker: driver.pauseWorker,
		resumeWorker: driver.resumeWorker,
		nudgeWorker: driver.nudgeWorker,
	};
}
