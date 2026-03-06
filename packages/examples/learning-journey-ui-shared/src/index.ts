// Hooks
export { useLearningProgress } from './hooks';

// Components
export { XpBar, StreakCounter, BadgeDisplay, ViewTabs } from './components';

// Types
export type {
  LearningView,
  LearningProgressState,
  LearningMiniAppProps,
  LearningViewProps,
  XpBarProps,
  StreakCounterProps,
  BadgeDisplayProps,
  ViewTabsProps,
} from './types';

export * from './learning-journey-ui-shared.feature';
export { default as example } from './example';
import './docs';
