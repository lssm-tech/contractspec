export interface BaseEventConditionSpec {
  /**
   * Required event name to satisfy the condition.
   */
  eventName: string;
  /**
   * Optional event version to match.
   */
  eventVersion?: number;
  /**
   * Optional source module to match (for disambiguation).
   */
  sourceModule?: string;
  /**
   * Optional payload filter (shallow equality on keys).
   */
  payloadFilter?: Record<string, unknown>;
}

export interface EventCompletionConditionSpec extends BaseEventConditionSpec {
  kind?: 'event';
}

export interface CountCompletionConditionSpec extends BaseEventConditionSpec {
  kind: 'count';
  /**
   * Minimum number of matching events required to complete the step.
   */
  atLeast: number;
  /**
   * Optional time window (hours) from track start for counting.
   */
  withinHours?: number;
}

export interface TimeWindowCompletionConditionSpec extends BaseEventConditionSpec {
  kind: 'time_window';
  /**
   * Must be completed within this window (hours) from track start.
   */
  withinHoursOfStart?: number;
  /**
   * Optional additional delay before the step becomes available (hours).
   */
  availableAfterHours?: number;
}

export interface SrsMasteryCompletionConditionSpec {
  kind: 'srs_mastery';
  /**
   * Event carrying mastery info (defaults to drill/flashcard mastery events).
   */
  eventName: string;
  /**
   * Payload key containing skill identifier; defaults to `skillId`.
   */
  skillIdField?: string;
  /**
   * Payload key containing mastery value; defaults to `mastery`.
   */
  masteryField?: string;
  /**
   * Minimum mastery value required (e.g., 0-1 or a numeric level).
   */
  minimumMastery: number;
  /**
   * Optional number of mastered cards required to complete step.
   */
  requiredCount?: number;
  /**
   * Optional payload filter.
   */
  payloadFilter?: Record<string, unknown>;
}

export type StepCompletionConditionSpec =
  | EventCompletionConditionSpec
  | CountCompletionConditionSpec
  | TimeWindowCompletionConditionSpec
  | SrsMasteryCompletionConditionSpec;

export interface StepAvailabilitySpec {
  /**
   * Unlock step after a delay (hours) from track start.
   */
  unlockAfterHours?: number;
  /**
   * Unlock on a specific day from track start (day 1 = start day).
   */
  unlockOnDay?: number;
  /**
   * Optional due window (hours) from unlock; if exceeded, step is considered missed.
   */
  dueWithinHours?: number;
}

export interface StreakRuleSpec {
  hoursWindow?: number;
  bonusXp?: number;
}

export interface CompletionRewardsSpec {
  xpBonus?: number;
  badgeKey?: string;
}

export interface LearningJourneyStepSpec {
  id: string;
  title: string;
  description?: string;
  instructions?: string;
  helpUrl?: string;
  order?: number;
  completion: StepCompletionConditionSpec;
  availability?: StepAvailabilitySpec;
  xpReward?: number;
  isRequired?: boolean;
  canSkip?: boolean;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, unknown>;
}

export interface LearningJourneyTrackSpec {
  id: string;
  productId?: string;
  name: string;
  description?: string;
  targetUserSegment?: string;
  targetRole?: string;
  totalXp?: number;
  isActive?: boolean;
  isRequired?: boolean;
  canSkip?: boolean;
  streakRule?: StreakRuleSpec;
  completionRewards?: CompletionRewardsSpec;
  steps: LearningJourneyStepSpec[];
  metadata?: Record<string, unknown>;
}
