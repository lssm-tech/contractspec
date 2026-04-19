import type { StreakState } from './engines/streak';

export interface JourneyBaseEventConditionSpec {
	eventName: string;
	eventVersion?: number;
	sourceModule?: string;
	payloadFilter?: Record<string, unknown>;
}

export interface JourneyEventConditionSpec
	extends JourneyBaseEventConditionSpec {
	kind?: 'event';
}

export interface JourneyCountConditionSpec
	extends JourneyBaseEventConditionSpec {
	kind: 'count';
	atLeast: number;
	withinHours?: number;
}

export interface JourneyTimeWindowConditionSpec
	extends JourneyBaseEventConditionSpec {
	kind: 'time_window';
	withinHoursOfStart?: number;
	availableAfterHours?: number;
}

export interface JourneyMasteryConditionSpec {
	kind: 'mastery';
	eventName: string;
	skillIdField?: string;
	masteryField?: string;
	minimumMastery: number;
	requiredCount?: number;
	payloadFilter?: Record<string, unknown>;
}

export type JourneyConditionSpec =
	| JourneyCountConditionSpec
	| JourneyEventConditionSpec
	| JourneyMasteryConditionSpec
	| JourneyTimeWindowConditionSpec;

export interface JourneyAvailabilitySpec {
	unlockAfterHours?: number;
	unlockOnDay?: number;
	dueWithinHours?: number;
}

export interface JourneyRewardSpec {
	badgeKey?: string;
	xp?: number;
}

export interface JourneyPrerequisiteSpec {
	kind: 'branch_selected' | 'step_completed';
	branchKey?: string;
	stepId: string;
}

export interface JourneyBranchSpec {
	key: string;
	blockStepIds?: string[];
	label?: string;
	metadata?: Record<string, unknown>;
	reward?: JourneyRewardSpec;
	when?: JourneyConditionSpec;
}

export interface JourneyStreakRuleSpec {
	bonusXp?: number;
	hoursWindow?: number;
}

export interface JourneyStepSpec {
	actionLabel?: string;
	actionUrl?: string;
	availability?: JourneyAvailabilitySpec;
	branches?: JourneyBranchSpec[];
	canSkip?: boolean;
	completion: JourneyConditionSpec;
	description?: string;
	helpUrl?: string;
	id: string;
	instructions?: string;
	isRequired?: boolean;
	metadata?: Record<string, unknown>;
	order?: number;
	prerequisiteMode?: 'all' | 'any';
	prerequisites?: JourneyPrerequisiteSpec[];
	reward?: JourneyRewardSpec;
	title: string;
	xpReward?: number;
}

export interface JourneyTrackSpec {
	canSkip?: boolean;
	completionRewards?: JourneyRewardSpec;
	description?: string;
	id: string;
	isActive?: boolean;
	isRequired?: boolean;
	metadata?: Record<string, unknown>;
	name: string;
	productId?: string;
	steps: JourneyStepSpec[];
	streakRule?: JourneyStreakRuleSpec;
	targetRole?: string;
	targetUserSegment?: string;
	totalXp?: number;
}

export interface JourneyEvent {
	learnerId?: string;
	name: string;
	occurredAt?: Date;
	payload?: Record<string, unknown>;
	sourceModule?: string;
	trackId?: string;
	version?: number;
}

export type JourneyStepStatus =
	| 'AVAILABLE'
	| 'BLOCKED'
	| 'COMPLETED'
	| 'LOCKED'
	| 'MISSED'
	| 'SKIPPED';

export interface JourneyStepProgressState {
	availableAt?: Date;
	blockedAt?: Date;
	blockedByBranchKey?: string;
	blockedByStepId?: string;
	completedAt?: Date;
	dueAt?: Date;
	eventPayload?: Record<string, unknown>;
	manual?: boolean;
	masteryCount: number;
	missedAt?: Date;
	occurrences: number;
	selectedBranchKey?: string;
	skippedAt?: Date;
	status: JourneyStepStatus;
	stepId: string;
	triggeringEvent?: string;
	xpEarned: number;
}

export interface JourneyProgressState {
	badges: string[];
	completedAt?: Date;
	completionRewardApplied: boolean;
	eventLog: JourneyEvent[];
	lastActivityAt?: Date;
	learnerId?: string;
	startedAt?: Date;
	steps: JourneyStepProgressState[];
	streak: StreakState;
	trackId: string;
	xpEarned: number;
}

export interface JourneyProgressSnapshot {
	activeStepCount: number;
	availableStepIds: string[];
	badges: string[];
	blockedStepIds: string[];
	completedAt?: Date;
	completedStepCount: number;
	completedStepIds: string[];
	currentStepId: string | null;
	isCompleted: boolean;
	lastActivityAt?: Date;
	learnerId?: string;
	missedStepIds: string[];
	nextStepId: string | null;
	progressPercent: number;
	startedAt?: Date;
	steps: JourneyStepProgressState[];
	streakDays: number;
	totalSteps: number;
	trackId: string;
	xpEarned: number;
}
