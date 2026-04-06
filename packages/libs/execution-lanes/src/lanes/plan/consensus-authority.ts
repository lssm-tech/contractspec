import {
	assertLaneAuthority,
	type LaneAuthorityHooks,
} from '../../runtime/authority-hooks';
import type { ExecutionPlanPack } from '../../types';
import type {
	ConsensusPlanningArtifact,
	ConsensusPlanningMode,
} from './consensus';

export interface ConsensusPlanningAuthority {
	hooks?: LaneAuthorityHooks;
	runId?: string;
	actorId?: string;
}

export async function assertConsensusArtifactPersistence(
	authority: ConsensusPlanningAuthority | undefined,
	runId: string,
	artifactType: ConsensusPlanningArtifact['type']
) {
	await assertLaneAuthority(authority?.hooks, {
		action: 'append_artifact',
		runId,
		lane: 'plan.consensus',
		actorId: authority?.actorId,
		reason: `Persist ${artifactType}`,
		metadata: { artifactType },
	});
}

export async function assertConsensusPlanHandoff(
	authority: ConsensusPlanningAuthority | undefined,
	plan: ExecutionPlanPack,
	mode: ConsensusPlanningMode
) {
	await assertLaneAuthority(authority?.hooks, {
		action: 'handoff',
		runId: authority?.runId ?? plan.meta.id,
		lane: 'plan.consensus',
		actorId: authority?.actorId,
		reason: `Emit ${mode} consensus handoff`,
		metadata: { nextLane: plan.staffing.handoffRecommendation.nextLane },
	});
}
