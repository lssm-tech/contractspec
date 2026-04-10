import type { TeamWorkerLaunchSpec } from '../types';
import type { TeamBackendAdapter } from './types';

export interface TmuxDriver {
	startPane(input: TeamWorkerLaunchSpec): Promise<void>;
	stopPane(runId: string, workerId: string): Promise<void>;
	pausePane?(runId: string, workerId: string): Promise<void>;
	resumePane?(runId: string, workerId: string): Promise<void>;
	sendKeys?(runId: string, workerId: string, message: string): Promise<void>;
}

export function createTmuxTeamBackend(driver: TmuxDriver): TeamBackendAdapter {
	return {
		key: 'tmux',
		startWorker(input) {
			return driver.startPane(input);
		},
		stopWorker: driver.stopPane,
		pauseWorker: driver.pausePane,
		resumeWorker: driver.resumePane,
		nudgeWorker: driver.sendKeys,
	};
}
