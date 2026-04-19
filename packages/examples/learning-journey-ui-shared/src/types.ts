import type {
	JourneyProgressSnapshot,
	JourneyTrackSpec,
} from '@contractspec/module.learning-journey/track-spec';

/** View types for learning mini-apps */
export type LearningView = 'overview' | 'steps' | 'progress' | 'timeline';

/** Progress state projected from the canonical learning runtime */
export interface LearningProgressState extends JourneyProgressSnapshot {
	lastActivityDate: string | null;
}

/** Props for mini-app components */
export interface LearningMiniAppProps {
	track: JourneyTrackSpec;
	progress: LearningProgressState;
	onStepComplete?: (stepId: string) => void;
	onViewChange?: (view: LearningView) => void;
	initialView?: LearningView;
}

/** Props for view components */
export interface LearningViewProps {
	track: JourneyTrackSpec;
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
