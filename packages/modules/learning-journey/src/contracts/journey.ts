import { defineCommand, defineQuery } from '@contractspec/lib.contracts-spec';
import { defineSchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';
import { LEARNING_JOURNEY_OWNERS } from './shared';

const JourneyConditionModel = defineSchemaModel({
	name: 'JourneyCondition',
	description: 'Adaptive completion condition for a journey step.',
	fields: {
		kind: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		eventName: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		eventVersion: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
		sourceModule: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		payloadFilter: { type: ScalarTypeEnum.JSON(), isOptional: true },
		atLeast: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
		withinHours: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
		withinHoursOfStart: {
			type: ScalarTypeEnum.Int_unsecure(),
			isOptional: true,
		},
		availableAfterHours: {
			type: ScalarTypeEnum.Int_unsecure(),
			isOptional: true,
		},
		skillIdField: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		masteryField: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		minimumMastery: { type: ScalarTypeEnum.Float_unsecure(), isOptional: true },
		requiredCount: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
	},
});

const JourneyRewardModel = defineSchemaModel({
	name: 'JourneyReward',
	description: 'XP and badge rewards for journey outcomes.',
	fields: {
		badgeKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		xp: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
	},
});

const JourneyStepModel = defineSchemaModel({
	name: 'JourneyStep',
	description: 'Adaptive learning journey step definition.',
	fields: {
		id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		title: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		instructions: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		helpUrl: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		order: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
		completion: { type: JourneyConditionModel, isOptional: false },
		availability: { type: ScalarTypeEnum.JSON(), isOptional: true },
		prerequisites: { type: ScalarTypeEnum.JSON(), isOptional: true },
		prerequisiteMode: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: true,
		},
		branches: { type: ScalarTypeEnum.JSON(), isOptional: true },
		reward: { type: JourneyRewardModel, isOptional: true },
		xpReward: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
		isRequired: { type: ScalarTypeEnum.Boolean(), isOptional: true },
		canSkip: { type: ScalarTypeEnum.Boolean(), isOptional: true },
		actionUrl: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		actionLabel: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		metadata: { type: ScalarTypeEnum.JSON(), isOptional: true },
	},
});

export const JourneyTrackModel = defineSchemaModel({
	name: 'JourneyTrack',
	description: 'Headless adaptive journey track definition.',
	fields: {
		id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		productId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		targetUserSegment: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: true,
		},
		targetRole: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		totalXp: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
		isActive: { type: ScalarTypeEnum.Boolean(), isOptional: true },
		isRequired: { type: ScalarTypeEnum.Boolean(), isOptional: true },
		canSkip: { type: ScalarTypeEnum.Boolean(), isOptional: true },
		streakRule: { type: ScalarTypeEnum.JSON(), isOptional: true },
		completionRewards: { type: JourneyRewardModel, isOptional: true },
		metadata: { type: ScalarTypeEnum.JSON(), isOptional: true },
		steps: { type: JourneyStepModel, isArray: true, isOptional: false },
	},
});

const JourneyStepProgressModel = defineSchemaModel({
	name: 'JourneyStepProgress',
	description: 'Persisted and projected state for a journey step.',
	fields: {
		stepId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		xpEarned: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
		selectedBranchKey: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: true,
		},
		availableAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
		dueAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
		completedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
		skippedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
		blockedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
		missedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
		triggeringEvent: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: true,
		},
		eventPayload: { type: ScalarTypeEnum.JSON(), isOptional: true },
		occurrences: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
		masteryCount: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
	},
});

export const JourneyProgressModel = defineSchemaModel({
	name: 'JourneyProgress',
	description: 'Projected adaptive journey progress snapshot.',
	fields: {
		learnerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		trackId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		progressPercent: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
		isCompleted: { type: ScalarTypeEnum.Boolean(), isOptional: false },
		xpEarned: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
		streakDays: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
		badges: {
			type: ScalarTypeEnum.String_unsecure(),
			isArray: true,
			isOptional: false,
		},
		activeStepCount: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
		completedStepCount: {
			type: ScalarTypeEnum.Int_unsecure(),
			isOptional: false,
		},
		nextStepId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		currentStepId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		startedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
		completedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
		lastActivityAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
		steps: { type: JourneyStepProgressModel, isArray: true, isOptional: false },
	},
});

const JourneyTrackListInput = defineSchemaModel({
	name: 'JourneyTrackListInput',
	description: 'Filters for listing adaptive journey tracks.',
	fields: {
		learnerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		productId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		trackIds: {
			type: ScalarTypeEnum.String_unsecure(),
			isArray: true,
			isOptional: true,
		},
		includeProgress: { type: ScalarTypeEnum.Boolean(), isOptional: true },
	},
});

const JourneyTrackListOutput = defineSchemaModel({
	name: 'JourneyTrackListOutput',
	description: 'Adaptive journey catalog with optional progress snapshots.',
	fields: {
		tracks: { type: JourneyTrackModel, isArray: true, isOptional: false },
		progress: { type: JourneyProgressModel, isArray: true, isOptional: true },
	},
});

const JourneyProgressInput = defineSchemaModel({
	name: 'JourneyProgressInput',
	description: 'Input for fetching projected progress for one track.',
	fields: {
		learnerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		trackId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
	},
});

const JourneyRecordEventInput = defineSchemaModel({
	name: 'JourneyRecordEventInput',
	description: 'Domain event used to advance an adaptive journey.',
	fields: {
		learnerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		trackId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		eventName: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		eventVersion: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
		sourceModule: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		eventPayload: { type: ScalarTypeEnum.JSON(), isOptional: true },
		occurredAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
	},
});

export const ListJourneyTracksContract = defineQuery({
	meta: {
		key: 'learning.journey.listTracks',
		version: '1.0.0',
		stability: 'stable',
		owners: [...LEARNING_JOURNEY_OWNERS],
		tags: ['adaptive-learning', 'journey', 'learning'],
		description: 'List adaptive learning journeys for a learner or product.',
		goal: 'Expose the adaptive journey catalog to UI and API surfaces.',
		context: 'Called when rendering journey lists, launchers, or registries.',
	},
	io: { input: JourneyTrackListInput, output: JourneyTrackListOutput },
	policy: { auth: 'user' },
});

export const GetJourneyProgressContract = defineQuery({
	meta: {
		key: 'learning.journey.getProgress',
		version: '1.0.0',
		stability: 'stable',
		owners: [...LEARNING_JOURNEY_OWNERS],
		tags: ['adaptive-learning', 'journey', 'progress'],
		description: 'Project the latest adaptive journey progress for one track.',
		goal: 'Render next-step, branch, and reward state consistently.',
		context: 'Called by widgets, journey detail pages, and adaptive shells.',
	},
	io: { input: JourneyProgressInput, output: JourneyProgressModel },
	policy: { auth: 'user' },
});

export const RecordJourneyEventContract = defineCommand({
	meta: {
		key: 'learning.journey.recordEvent',
		version: '1.0.0',
		stability: 'stable',
		owners: [...LEARNING_JOURNEY_OWNERS],
		tags: ['adaptive-learning', 'journey', 'events'],
		description: 'Record a domain event and re-evaluate an adaptive journey.',
		goal: 'Advance branch-aware journey progress from product activity.',
		context:
			'Called by event handlers when product activity may unlock or complete steps.',
	},
	io: { input: JourneyRecordEventInput, output: JourneyProgressModel },
	policy: { auth: 'user' },
});
