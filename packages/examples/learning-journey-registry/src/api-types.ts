import type { LearningJourneyTrackSpec } from '@lssm/module.learning-journey/track-spec';

export interface LearningEvent {
  name: string;
  version?: number;
  sourceModule?: string;
  payload?: Record<string, unknown>;
  occurredAt?: Date;
  learnerId: string;
  trackId?: string;
}

export type StepStatus = 'PENDING' | 'COMPLETED';

export interface StepProgress {
  id: string;
  status: StepStatus;
  xpEarned: number;
  completedAt?: Date;
  triggeringEvent?: string;
  eventPayload?: Record<string, unknown>;
  occurrences?: number;
  counterStartedAt?: Date;
  availableAt?: Date;
  dueAt?: Date;
  masteryCount?: number;
}

export interface TrackProgress {
  learnerId: string;
  trackId: string;
  progress: number;
  isCompleted: boolean;
  xpEarned: number;
  startedAt?: Date;
  completedAt?: Date;
  lastActivityAt?: Date;
  steps: StepProgress[];
}

export type TrackResolver = (
  trackId: string
) => LearningJourneyTrackSpec | undefined;
