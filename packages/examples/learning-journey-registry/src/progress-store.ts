import type { LearningJourneyTrackSpec } from '@lssm/module.learning-journey/track-spec';

import type { TrackProgress } from './api-types';

export const progressStore = new Map<string, Map<string, TrackProgress>>();

export const getTrackResolver =
  (tracks: LearningJourneyTrackSpec[]) =>
  (trackId: string): LearningJourneyTrackSpec | undefined =>
    tracks.find((t) => t.id === trackId);

export const getLearnerTracks = (learnerId: string) => {
  const existing = progressStore.get(learnerId);
  if (existing) return existing;
  const map = new Map<string, TrackProgress>();
  progressStore.set(learnerId, map);
  return map;
};

export const initProgress = (
  learnerId: string,
  track: LearningJourneyTrackSpec
): TrackProgress => ({
  learnerId,
  trackId: track.id,
  progress: 0,
  isCompleted: false,
  xpEarned: 0,
  steps: track.steps.map((step) => ({
    id: step.id,
    status: 'PENDING',
    xpEarned: 0,
  })),
  startedAt: undefined,
  completedAt: undefined,
  lastActivityAt: undefined,
});
