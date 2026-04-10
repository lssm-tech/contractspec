import type {
	CompletionStatusView,
	LaneRuntimeSnapshot,
	LaneStatusView,
	TeamStatusView,
} from '@contractspec/lib.execution-lanes';
import {
	buildCompletionStatusView,
	buildLaneStatusView,
	buildTeamStatusView,
} from '@contractspec/lib.execution-lanes';
import {
	type ExecutionLaneOperatorDependencies,
	exportPersistenceBundle,
	type ListExecutionLaneRunsInput,
	requireSnapshot,
} from './execution-lanes-service-shared';

export async function listLaneRuns(
	dependencies: ExecutionLaneOperatorDependencies,
	input: ListExecutionLaneRunsInput = {}
): Promise<LaneStatusView[]> {
	const runs = await dependencies.store.listRuns();
	const filtered = runs
		.filter((run) => (input.lane ? run.lane === input.lane : true))
		.filter((run) => (input.status ? run.status === input.status : true))
		.slice(0, input.limit ?? 50);
	return Promise.all(
		filtered.map(async (run) =>
			buildLaneStatusView(await requireSnapshot(dependencies, run.runId))
		)
	);
}

export function getLaneRun(
	dependencies: ExecutionLaneOperatorDependencies,
	runId: string
): Promise<LaneRuntimeSnapshot | undefined> {
	return dependencies.store.getSnapshot(runId);
}

export async function exportLaneEvidence(
	dependencies: ExecutionLaneOperatorDependencies,
	runId: string
) {
	const snapshot = await requireSnapshot(dependencies, runId);
	return {
		runId,
		exportedAt: snapshot.run.updatedAt,
		bundle: exportPersistenceBundle(snapshot),
		evidence: snapshot.evidence,
		approvals: snapshot.approvals,
		artifacts: snapshot.artifacts,
		transitions: snapshot.transitions,
		replayBundleUris: snapshot.evidence
			.map((bundleRef) => bundleRef.replayBundleUri)
			.filter((value): value is string => Boolean(value)),
		primaryReplayBundleUri: snapshot.evidence.find(
			(bundleRef) => bundleRef.replayBundleUri
		)?.replayBundleUri,
	};
}

export async function openLaneReplay(
	dependencies: ExecutionLaneOperatorDependencies,
	runId: string,
	_actorId?: string
) {
	const exported = await exportLaneEvidence(dependencies, runId);
	return {
		runId,
		replayBundleUris: exported.replayBundleUris,
		primaryReplayBundleUri: exported.primaryReplayBundleUri,
	};
}

export async function getLaneTeamStatus(
	dependencies: ExecutionLaneOperatorDependencies,
	runId: string
): Promise<TeamStatusView | undefined> {
	const snapshot = await getLaneRun(dependencies, runId);
	return snapshot ? buildTeamStatusView(snapshot) : undefined;
}

export async function getLaneCompletionStatus(
	dependencies: ExecutionLaneOperatorDependencies,
	runId: string
): Promise<CompletionStatusView | undefined> {
	const snapshot = await getLaneRun(dependencies, runId);
	return snapshot ? buildCompletionStatusView(snapshot) : undefined;
}
