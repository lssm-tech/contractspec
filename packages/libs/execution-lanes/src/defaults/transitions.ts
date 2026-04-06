import type { LaneKey } from '../types';

export const DEFAULT_TRANSITIONS: Record<LaneKey, LaneKey[]> = {
	clarify: ['plan.consensus'],
	'plan.consensus': ['complete.persistent', 'team.coordinated'],
	'complete.persistent': [],
	'team.coordinated': ['complete.persistent'],
};
