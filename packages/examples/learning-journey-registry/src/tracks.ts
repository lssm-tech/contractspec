import type {
  LearningJourneyStepSpec,
  LearningJourneyTrackSpec,
  StepAvailabilitySpec,
  StepCompletionConditionSpec,
} from '@contractspec/module.learning-journey/track-spec';
import { crmLearningTracks } from '@contractspec/example.learning-journey-crm-onboarding/track';
import { drillTracks } from '@contractspec/example.learning-journey-duo-drills/track';
import { ambientCoachTracks } from '@contractspec/example.learning-journey-ambient-coach/track';
import { questTracks } from '@contractspec/example.learning-journey-quest-challenges/track';
import { platformLearningTracks } from '@contractspec/example.learning-journey-platform-tour/track';
import { studioLearningTracks } from '@contractspec/example.learning-journey-studio-onboarding/track';

export interface OnboardingStepDto {
  id: string;
  title: string;
  description?: string;
  completionEvent: string;
  completionCondition?: StepCompletionConditionSpec;
  xpReward?: number;
  isRequired?: boolean;
  canSkip?: boolean;
  actionUrl?: string;
  actionLabel?: string;
  availability?: StepAvailabilitySpec;
  metadata?: Record<string, unknown>;
}

export interface OnboardingTrackDto {
  id: string;
  name: string;
  description?: string;
  productId?: string;
  targetUserSegment?: string;
  targetRole?: string;
  totalXp?: number;
  streakRule?: LearningJourneyTrackSpec['streakRule'];
  completionRewards?: LearningJourneyTrackSpec['completionRewards'];
  steps: OnboardingStepDto[];
  metadata?: Record<string, unknown>;
}

const mapStep = (step: LearningJourneyStepSpec): OnboardingStepDto => ({
  id: step.id,
  title: step.title,
  description: step.description,
  completionEvent: step.completion.eventName,
  completionCondition: step.completion,
  xpReward: step.xpReward,
  isRequired: step.isRequired,
  canSkip: step.canSkip,
  actionUrl: step.actionUrl,
  actionLabel: step.actionLabel,
  availability: step.availability,
  metadata: step.metadata,
});

export const mapTrackSpecToDto = (
  track: LearningJourneyTrackSpec
): OnboardingTrackDto => ({
  id: track.id,
  name: track.name,
  description: track.description,
  productId: track.productId,
  targetUserSegment: track.targetUserSegment,
  targetRole: track.targetRole,
  totalXp: track.totalXp,
  streakRule: track.streakRule,
  completionRewards: track.completionRewards,
  steps: track.steps.map(mapStep),
  metadata: track.metadata,
});

export const learningJourneyTracks: LearningJourneyTrackSpec[] = [
  ...studioLearningTracks,
  ...platformLearningTracks,
  ...crmLearningTracks,
  ...drillTracks,
  ...ambientCoachTracks,
  ...questTracks,
];

export const onboardingTrackCatalog: OnboardingTrackDto[] =
  learningJourneyTracks.map(mapTrackSpecToDto);

export {
  studioLearningTracks,
  platformLearningTracks,
  crmLearningTracks,
  mapStep,
};
