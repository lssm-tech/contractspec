// Hooks

// Components
export { BadgeDisplay, StreakCounter, ViewTabs, XpBar } from './components';
export { default as example } from './example';
export { useLearningProgress } from './hooks';

export * from './learning-journey-ui-shared.feature';
// Types
export type {
	BadgeDisplayProps,
	LearningMiniAppProps,
	LearningProgressState,
	LearningView,
	LearningViewProps,
	StreakCounterProps,
	ViewTabsProps,
	XpBarProps,
} from './types';
import './docs';
