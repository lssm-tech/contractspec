import type {
	ExecutionLaneSpec,
	LaneRunState,
	LaneTerminalStatus,
} from '../types';
import type { LaneAuthorityHooks } from './authority-hooks';

export interface LaneRuntimeOptions {
	hooks?: LaneAuthorityHooks;
	laneRegistry?: {
		get(key: LaneRunState['lane']): ExecutionLaneSpec | undefined;
		canTransition(
			from: LaneRunState['lane'],
			to: LaneRunState['lane']
		): boolean;
	};
	allowTerminalForRun?(run: LaneRunState, status: LaneTerminalStatus): boolean;
	now?: () => Date;
}
