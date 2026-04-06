import type { LanePersistenceBundle, LaneRuntimeSnapshot } from '../types';

export function createLanePersistenceBundle(
	snapshot: LaneRuntimeSnapshot
): LanePersistenceBundle {
	return {
		exportedAt: new Date().toISOString(),
		run: snapshot.run,
		state: {
			completion: snapshot.completion,
			team: snapshot.team,
		},
		events: snapshot.events,
		transitions: snapshot.transitions,
		artifacts: snapshot.artifacts,
		evidence: snapshot.evidence,
		approvals: snapshot.approvals,
	};
}
