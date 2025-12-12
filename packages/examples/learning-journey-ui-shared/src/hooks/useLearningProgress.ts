'use client';

import { useState, useCallback, useMemo } from 'react';
import type { LearningJourneyTrackSpec } from '@lssm/module.learning-journey/track-spec';
import type { LearningProgressState } from '../types';

/** Default progress state for a new track */
function createDefaultProgress(trackId: string): LearningProgressState {
  return {
    trackId,
    completedStepIds: [],
    currentStepId: null,
    xpEarned: 0,
    streakDays: 0,
    lastActivityDate: null,
    badges: [],
  };
}

/** Hook for managing learning progress state */
export function useLearningProgress(track: LearningJourneyTrackSpec) {
  const [progress, setProgress] = useState<LearningProgressState>(() =>
    createDefaultProgress(track.id)
  );

  const completeStep = useCallback(
    (stepId: string) => {
      const step = track.steps.find((s) => s.id === stepId);
      if (!step || progress.completedStepIds.includes(stepId)) return;

      setProgress((prev) => {
        const newCompletedIds = [...prev.completedStepIds, stepId];
        const xpReward = step.xpReward ?? 0;

        // Find next incomplete step
        const nextStep = track.steps.find(
          (s) => !newCompletedIds.includes(s.id)
        );

        // Check if track is complete
        const isTrackComplete = newCompletedIds.length === track.steps.length;
        const completionBonus = isTrackComplete
          ? (track.completionRewards?.xpBonus ?? 0)
          : 0;

        return {
          ...prev,
          completedStepIds: newCompletedIds,
          currentStepId: nextStep?.id ?? null,
          xpEarned: prev.xpEarned + xpReward + completionBonus,
          lastActivityDate: new Date().toISOString(),
          badges:
            isTrackComplete && track.completionRewards?.badgeKey
              ? [...prev.badges, track.completionRewards.badgeKey]
              : prev.badges,
        };
      });
    },
    [track, progress.completedStepIds]
  );

  const resetProgress = useCallback(() => {
    setProgress(createDefaultProgress(track.id));
  }, [track.id]);

  const incrementStreak = useCallback(() => {
    setProgress((prev) => ({
      ...prev,
      streakDays: prev.streakDays + 1,
      lastActivityDate: new Date().toISOString(),
    }));
  }, []);

  const stats = useMemo(() => {
    const totalSteps = track.steps.length;
    const completedSteps = progress.completedStepIds.length;
    const percentComplete =
      totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
    const totalXp =
      track.totalXp ??
      track.steps.reduce((sum, s) => sum + (s.xpReward ?? 0), 0) +
        (track.completionRewards?.xpBonus ?? 0);

    return {
      totalSteps,
      completedSteps,
      remainingSteps: totalSteps - completedSteps,
      percentComplete,
      totalXp,
      isComplete: completedSteps === totalSteps,
    };
  }, [track, progress.completedStepIds]);

  return {
    progress,
    stats,
    completeStep,
    resetProgress,
    incrementStreak,
  };
}

