'use client';

import {
	completeJourneyStep,
	createJourneyProgressState,
	projectJourneyProgress,
	recordJourneyEvent,
} from '@contractspec/module.learning-journey/runtime';
import type {
	JourneyProgressState,
	JourneyTrackSpec,
} from '@contractspec/module.learning-journey/track-spec';
import { useCallback, useMemo, useState } from 'react';
import type { LearningProgressState } from '../types';

export const projectLearningProgressState = (
	track: JourneyTrackSpec,
	state: JourneyProgressState
): LearningProgressState => {
	const projected = projectJourneyProgress(track, state);
	return {
		...projected,
		completedStepIds: projected.steps
			.filter(
				(step) =>
					step.status === 'BLOCKED' ||
					step.status === 'COMPLETED' ||
					step.status === 'SKIPPED'
			)
			.map((step) => step.stepId),
		lastActivityDate: state.lastActivityAt?.toISOString() ?? null,
	};
};

/** Hook for managing learning progress state through the module runtime */
export function useLearningProgress(track: JourneyTrackSpec) {
	const [state, setState] = useState<JourneyProgressState>(() =>
		createJourneyProgressState(track)
	);

	const progress = useMemo(
		() => projectLearningProgressState(track, state),
		[state, track]
	);

	const completeStep = useCallback(
		(stepId: string) => {
			setState((prev) => completeJourneyStep(track, prev, stepId));
		},
		[track]
	);

	const resetProgress = useCallback(() => {
		setState(createJourneyProgressState(track));
	}, [track]);

	const incrementStreak = useCallback(() => {
		setState((prev) =>
			recordJourneyEvent(track, prev, {
				name: 'journey.streak.pulse',
			})
		);
	}, [track]);

	const stats = useMemo(() => {
		const totalXp =
			track.totalXp ??
			track.steps.reduce(
				(sum, step) => sum + (step.reward?.xp ?? step.xpReward ?? 0),
				0
			) + (track.completionRewards?.xp ?? 0);

		return {
			completedSteps: progress.completedStepIds.length,
			isComplete: progress.isCompleted,
			percentComplete: progress.progressPercent,
			remainingSteps: Math.max(
				track.steps.length - progress.completedStepIds.length,
				0
			),
			totalSteps: track.steps.length,
			totalXp,
		};
	}, [progress, track]);

	return {
		completeStep,
		incrementStreak,
		progress,
		resetProgress,
		stats,
	};
}
