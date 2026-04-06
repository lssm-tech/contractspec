import type {
	ExecutionLaneSpec,
	LaneRunState,
	LaneTerminalStatus,
} from '../types';
import type { LaneRuntimeOptions } from './lane-runtime-options';
import { evaluateLaneReadiness } from './readiness';
import type { LaneRuntimeStore } from './store';

export async function assertLaneTerminalReadiness(
	store: LaneRuntimeStore,
	runId: string,
	options: LaneRuntimeOptions
) {
	const snapshot = await store.getSnapshot(runId);
	if (!snapshot) {
		throw new Error(`Execution lane run ${runId} cannot be marked terminal.`);
	}
	const readiness = evaluateLaneReadiness(snapshot, {
		laneRegistry: options.laneRegistry,
		now: options.now,
	});
	if (readiness.terminalReadiness !== 'ready') {
		throw new Error(formatTerminalReadinessFailure(runId, readiness));
	}
}

export function assertTerminalTransition(
	run: LaneRunState,
	status: LaneTerminalStatus,
	options: LaneRuntimeOptions
) {
	if (status !== 'completed') {
		return;
	}
	if (options.allowTerminalForRun?.(run, status)) {
		return;
	}
	const spec = options.laneRegistry?.get(run.lane);
	const nextLane = run.recommendedNextLane;
	if (!spec) {
		return;
	}
	assertLaneFollowup(spec, run, nextLane);
}

function assertLaneFollowup(
	spec: ExecutionLaneSpec,
	run: LaneRunState,
	nextLane: LaneRunState['recommendedNextLane']
) {
	if (spec.allowedTransitions.length === 0) {
		if (nextLane) {
			throw new Error(
				`Execution lane run ${run.runId} cannot complete with a follow-up lane from "${run.lane}".`
			);
		}
		return;
	}
	if (!nextLane) {
		throw new Error(
			`Execution lane run ${run.runId} must record a next lane before completing "${run.lane}".`
		);
	}
	if (!spec.allowedTransitions.includes(nextLane)) {
		throw new Error(
			`Execution lane run ${run.runId} cannot complete with follow-up lane "${nextLane}" from "${run.lane}".`
		);
	}
}

function formatTerminalReadinessFailure(
	runId: string,
	readiness: ReturnType<typeof evaluateLaneReadiness>
) {
	return [
		`Execution lane run ${runId} is not ready for terminal completion.`,
		readiness.missingArtifacts.length > 0
			? `missing artifacts: ${readiness.missingArtifacts.join(', ')}`
			: undefined,
		readiness.missingEvidence.length > 0
			? `missing evidence: ${readiness.missingEvidence.join(', ')}`
			: undefined,
		readiness.missingApprovals.length > 0
			? `missing approvals: ${readiness.missingApprovals.join(', ')}`
			: undefined,
		readiness.blockingRisks.length > 0
			? `blocking risks: ${readiness.blockingRisks.join(', ')}`
			: undefined,
		readiness.missingNextLane ? 'recommended next lane is missing' : undefined,
	]
		.filter((value): value is string => Boolean(value))
		.join(' ');
}
