import type { LearningJourneyTrackSpec } from '@contractspec/module.learning-journey/track-spec';

/** View types for learning mini-apps */
export type LearningView = 'overview' | 'steps' | 'progress' | 'timeline';

/** Progress state for a learning track */
export interface LearningProgressState {
  trackId: string;
  completedStepIds: string[];
  currentStepId: string | null;
  xpEarned: number;
  streakDays: number;
  lastActivityDate: string | null;
  badges: string[];
}

/** Props for mini-app components */
export interface LearningMiniAppProps {
  track: LearningJourneyTrackSpec;
  progress: LearningProgressState;
  onStepComplete?: (stepId: string) => void;
  onViewChange?: (view: LearningView) => void;
  initialView?: LearningView;
}

/** Props for view components */
export interface LearningViewProps {
  track: LearningJourneyTrackSpec;
  progress: LearningProgressState;
  onStepComplete?: (stepId: string) => void;
}

/** XP bar props */
export interface XpBarProps {
  current: number;
  max: number;
  level?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/** Streak counter props */
export interface StreakCounterProps {
  days: number;
  isActive?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/** Badge display props */
export interface BadgeDisplayProps {
  badges: string[];
  maxVisible?: number;
  size?: 'sm' | 'md' | 'lg';
}

/** View tabs props */
export interface ViewTabsProps {
  currentView: LearningView;
  onViewChange: (view: LearningView) => void;
  availableViews?: LearningView[];
}
