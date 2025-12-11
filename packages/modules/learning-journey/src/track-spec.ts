export interface StepCompletionConditionSpec {
  eventName: string;
  eventVersion?: number;
  sourceModule?: string;
  payloadFilter?: Record<string, unknown>;
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
