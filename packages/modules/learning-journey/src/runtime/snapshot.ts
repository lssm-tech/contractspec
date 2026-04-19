import type {
	JourneyProgressSnapshot,
	JourneyProgressState,
	JourneyStepProgressState,
	JourneyTrackSpec,
} from '../track-spec';
import {
	isJourneyPrerequisiteSatisfied,
	resolveJourneyAvailability,
} from './matchers';

const cloneSteps = (
	steps: JourneyStepProgressState[]
): JourneyStepProgressState[] => steps.map((step) => ({ ...step }));

const collectBlockedSteps = (
	track: JourneyTrackSpec,
	state: JourneyProgressState
) => {
	const blocked = new Map<
		string,
		{ blockedByBranchKey: string; blockedByStepId: string }
	>();

	for (const spec of track.steps) {
		const progress = state.steps.find((step) => step.stepId === spec.id);
		const branch = spec.branches?.find(
			(candidate) => candidate.key === progress?.selectedBranchKey
		);
		if (!branch?.blockStepIds?.length) continue;
		for (const stepId of branch.blockStepIds) {
			blocked.set(stepId, {
				blockedByBranchKey: branch.key,
				blockedByStepId: spec.id,
			});
		}
	}

	return blocked;
};

export const synchronizeJourneyProgressState = (
	track: JourneyTrackSpec,
	state: JourneyProgressState,
	options: { now?: Date } = {}
): JourneyProgressState => {
	const now = options.now ?? new Date();
	const nextState: JourneyProgressState = {
		...state,
		badges: [...state.badges],
		eventLog: [...state.eventLog],
		steps: cloneSteps(state.steps),
		streak: { ...state.streak },
	};
	const blocked = collectBlockedSteps(track, nextState);

	for (const spec of track.steps) {
		const progress = nextState.steps.find((step) => step.stepId === spec.id);
		if (!progress) continue;

		const { availableAt, dueAt } = resolveJourneyAvailability(
			spec.availability,
			nextState.startedAt
		);
		progress.availableAt = availableAt;
		progress.dueAt = dueAt;

		if (progress.status === 'COMPLETED' || progress.status === 'SKIPPED')
			continue;

		const blockedBy = blocked.get(spec.id);
		if (blockedBy) {
			progress.blockedAt ??= now;
			progress.blockedByBranchKey = blockedBy.blockedByBranchKey;
			progress.blockedByStepId = blockedBy.blockedByStepId;
			progress.status = 'BLOCKED';
			continue;
		}

		const prerequisites = spec.prerequisites ?? [];
		const predicate =
			spec.prerequisiteMode === 'any'
				? prerequisites.some((item) =>
						isJourneyPrerequisiteSatisfied(item, nextState)
					)
				: prerequisites.every((item) =>
						isJourneyPrerequisiteSatisfied(item, nextState)
					);
		const prerequisitesMet = prerequisites.length === 0 ? true : predicate;
		const isUnlocked =
			prerequisitesMet &&
			(!availableAt || now.getTime() >= availableAt.getTime());

		if (dueAt && now.getTime() > dueAt.getTime()) {
			progress.missedAt ??= now;
			progress.status = 'MISSED';
			continue;
		}

		progress.status = isUnlocked ? 'AVAILABLE' : 'LOCKED';
	}

	return nextState;
};

export const isJourneyComplete = (state: JourneyProgressState): boolean => {
	const activeSteps = state.steps.filter((step) => step.status !== 'BLOCKED');
	return (
		activeSteps.length > 0 &&
		activeSteps.every(
			(step) => step.status === 'COMPLETED' || step.status === 'SKIPPED'
		)
	);
};

export const buildJourneyProgressSnapshot = (
	track: JourneyTrackSpec,
	state: JourneyProgressState,
	options: { now?: Date } = {}
): JourneyProgressSnapshot => {
	const synced = synchronizeJourneyProgressState(track, state, options);
	const activeSteps = synced.steps.filter((step) => step.status !== 'BLOCKED');
	const completedSteps = synced.steps.filter(
		(step) => step.status === 'COMPLETED'
	);
	const availableStepIds = synced.steps
		.filter((step) => step.status === 'AVAILABLE')
		.map((step) => step.stepId);
	const blockedStepIds = synced.steps
		.filter((step) => step.status === 'BLOCKED')
		.map((step) => step.stepId);
	const missedStepIds = synced.steps
		.filter((step) => step.status === 'MISSED')
		.map((step) => step.stepId);
	const completedOrSkipped = activeSteps.filter(
		(step) => step.status === 'COMPLETED' || step.status === 'SKIPPED'
	).length;
	const progressPercent =
		activeSteps.length > 0
			? Math.round((completedOrSkipped / activeSteps.length) * 100)
			: 0;
	const nextStepId = availableStepIds[0] ?? null;

	return {
		activeStepCount: activeSteps.length,
		availableStepIds,
		badges: [...synced.badges],
		blockedStepIds,
		completedAt: synced.completedAt,
		completedStepCount: completedOrSkipped,
		completedStepIds: completedSteps.map((step) => step.stepId),
		currentStepId: nextStepId,
		isCompleted: isJourneyComplete(synced),
		lastActivityAt: synced.lastActivityAt,
		learnerId: synced.learnerId,
		missedStepIds,
		nextStepId,
		progressPercent,
		startedAt: synced.startedAt,
		steps: synced.steps,
		streakDays: synced.streak.currentStreak,
		totalSteps: track.steps.length,
		trackId: synced.trackId,
		xpEarned: synced.xpEarned,
	};
};
