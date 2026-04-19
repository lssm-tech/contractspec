import {
	defineEntity,
	defineEntityEnum,
	field,
	index,
} from '@contractspec/lib.schema';

export const JourneyStepStatusEnum = defineEntityEnum({
	name: 'JourneyStepStatus',
	values: [
		'LOCKED',
		'AVAILABLE',
		'COMPLETED',
		'MISSED',
		'SKIPPED',
		'BLOCKED',
	] as const,
	schema: 'lssm_learning',
	description: 'Adaptive runtime status of a journey step.',
});

export const JourneyTrackEntity = defineEntity({
	name: 'JourneyTrack',
	description: 'Adaptive journey track definition.',
	schema: 'lssm_learning',
	map: 'journey_track',
	fields: {
		id: field.id({ description: 'Unique track identifier' }),
		productId: field.string({ isOptional: true, description: 'Product scope' }),
		name: field.string({ description: 'Track name' }),
		description: field.string({
			isOptional: true,
			description: 'Track description',
		}),
		targetUserSegment: field.string({
			isOptional: true,
			description: 'Target learner segment',
		}),
		targetRole: field.string({
			isOptional: true,
			description: 'Target learner role',
		}),
		isActive: field.boolean({
			default: true,
			description: 'Whether the track is active',
		}),
		isRequired: field.boolean({
			default: false,
			description: 'Whether the track must be completed',
		}),
		canSkip: field.boolean({
			default: false,
			description: 'Whether steps can be skipped',
		}),
		totalXp: field.int({
			default: 0,
			description: 'Declared XP ceiling for the track',
		}),
		streakRule: field.json({
			isOptional: true,
			description: 'Tempo rule used for streak-based rewards',
		}),
		completionRewards: field.json({
			isOptional: true,
			description: 'Reward applied when the track is completed',
		}),
		metadata: field.json({
			isOptional: true,
			description: 'Additional track metadata',
		}),
		createdAt: field.createdAt(),
		updatedAt: field.updatedAt(),
		steps: field.hasMany('JourneyStep'),
		progress: field.hasMany('JourneyProgress'),
	},
	indexes: [
		index.on(['productId', 'isActive']),
		index.unique(['productId', 'targetUserSegment', 'targetRole'], {
			name: 'journey_track_target',
		}),
	],
});

export const JourneyStepEntity = defineEntity({
	name: 'JourneyStep',
	description: 'Adaptive journey step definition.',
	schema: 'lssm_learning',
	map: 'journey_step',
	fields: {
		id: field.id({ description: 'Unique step identifier' }),
		trackId: field.foreignKey({ description: 'Parent journey track' }),
		title: field.string({ description: 'Step title' }),
		description: field.string({
			isOptional: true,
			description: 'Step description',
		}),
		instructions: field.string({
			isOptional: true,
			description: 'How the learner should complete the step',
		}),
		helpUrl: field.string({
			isOptional: true,
			description: 'Help or destination URL',
		}),
		order: field.int({ default: 0, description: 'Display order' }),
		completion: field.json({
			description: 'Structured completion condition for this step',
		}),
		availability: field.json({
			isOptional: true,
			description: 'Unlock and due-window configuration',
		}),
		prerequisites: field.json({
			isOptional: true,
			description: 'Prerequisites that must be satisfied to unlock the step',
		}),
		prerequisiteMode: field.string({
			isOptional: true,
			description: 'How to combine prerequisites (all|any)',
		}),
		branches: field.json({
			isOptional: true,
			description: 'Branch outcomes evaluated when the step completes',
		}),
		reward: field.json({
			isOptional: true,
			description: 'Reward granted by this step',
		}),
		xpReward: field.int({
			isOptional: true,
			description: 'Legacy XP reward field',
		}),
		isRequired: field.boolean({
			default: true,
			description: 'Whether the step is required',
		}),
		canSkip: field.boolean({
			default: false,
			description: 'Whether the step can be skipped',
		}),
		actionUrl: field.string({
			isOptional: true,
			description: 'Manual completion action URL',
		}),
		actionLabel: field.string({
			isOptional: true,
			description: 'Manual action label',
		}),
		metadata: field.json({
			isOptional: true,
			description: 'Additional step metadata',
		}),
		createdAt: field.createdAt(),
		updatedAt: field.updatedAt(),
		track: field.belongsTo('JourneyTrack', ['trackId'], ['id'], {
			onDelete: 'Cascade',
		}),
	},
	indexes: [index.on(['trackId', 'order'])],
});

export const JourneyProgressEntity = defineEntity({
	name: 'JourneyProgress',
	description: 'Persisted learner progress through an adaptive journey.',
	schema: 'lssm_learning',
	map: 'journey_progress',
	fields: {
		id: field.id({ description: 'Unique progress identifier' }),
		learnerId: field.foreignKey({
			description: 'Learner owning this journey state',
		}),
		trackId: field.foreignKey({ description: 'Journey track' }),
		progressPercent: field.int({
			default: 0,
			description: 'Completion percentage',
		}),
		isCompleted: field.boolean({
			default: false,
			description: 'Whether the track is completed',
		}),
		nextStepId: field.string({
			isOptional: true,
			description: 'Next actionable step projected by the engine',
		}),
		xpEarned: field.int({ default: 0, description: 'Total XP earned so far' }),
		badges: field.json({ default: '[]', description: 'Unlocked badge keys' }),
		streakState: field.json({
			default: '{}',
			description: 'Serialized streak engine state',
		}),
		eventLog: field.json({
			default: '[]',
			description: 'Recorded events used to evaluate adaptive progress',
		}),
		completionRewardApplied: field.boolean({
			default: false,
			description: 'Whether track completion rewards were already applied',
		}),
		startedAt: field.dateTime({
			isOptional: true,
			description: 'Track start timestamp',
		}),
		completedAt: field.dateTime({
			isOptional: true,
			description: 'Track completion timestamp',
		}),
		lastActivityAt: field.dateTime({
			isOptional: true,
			description: 'Latest event or manual advancement timestamp',
		}),
		createdAt: field.createdAt(),
		updatedAt: field.updatedAt(),
		learner: field.belongsTo('Learner', ['learnerId'], ['id'], {
			onDelete: 'Cascade',
		}),
		track: field.belongsTo('JourneyTrack', ['trackId'], ['id'], {
			onDelete: 'Cascade',
		}),
		stepProgress: field.hasMany('JourneyStepProgress'),
	},
	indexes: [
		index.unique(['learnerId', 'trackId'], { name: 'journey_progress_unique' }),
		index.on(['learnerId', 'isCompleted']),
		index.on(['trackId']),
	],
});

export const JourneyStepProgressEntity = defineEntity({
	name: 'JourneyStepProgress',
	description: 'Persisted step-level state for an adaptive journey.',
	schema: 'lssm_learning',
	map: 'journey_step_progress',
	fields: {
		id: field.id({ description: 'Unique step-progress identifier' }),
		progressId: field.foreignKey({
			description: 'Parent journey progress record',
		}),
		stepId: field.foreignKey({ description: 'Referenced journey step' }),
		status: field.enum('JourneyStepStatus', {
			description: 'Current step status',
		}),
		selectedBranchKey: field.string({
			isOptional: true,
			description: 'Selected branch outcome for this step',
		}),
		xpEarned: field.int({
			default: 0,
			description: 'XP earned from this step',
		}),
		occurrences: field.int({
			default: 0,
			description: 'Matching event occurrences',
		}),
		masteryCount: field.int({
			default: 0,
			description: 'Accumulated mastery hits',
		}),
		availableAt: field.dateTime({
			isOptional: true,
			description: 'When the step unlocked',
		}),
		dueAt: field.dateTime({
			isOptional: true,
			description: 'When the step expires',
		}),
		completedAt: field.dateTime({
			isOptional: true,
			description: 'When the step completed',
		}),
		skippedAt: field.dateTime({
			isOptional: true,
			description: 'When the step was skipped',
		}),
		blockedAt: field.dateTime({
			isOptional: true,
			description: 'When the step was blocked',
		}),
		missedAt: field.dateTime({
			isOptional: true,
			description: 'When the step was missed',
		}),
		triggeringEvent: field.string({
			isOptional: true,
			description: 'Event that completed the step',
		}),
		eventPayload: field.json({
			isOptional: true,
			description: 'Event payload snapshot',
		}),
		createdAt: field.createdAt(),
		updatedAt: field.updatedAt(),
		progress: field.belongsTo('JourneyProgress', ['progressId'], ['id'], {
			onDelete: 'Cascade',
		}),
		step: field.belongsTo('JourneyStep', ['stepId'], ['id'], {
			onDelete: 'Cascade',
		}),
	},
	indexes: [
		index.unique(['progressId', 'stepId'], {
			name: 'journey_step_progress_unique',
		}),
		index.on(['status']),
	],
});

export const journeyEntities = [
	JourneyTrackEntity,
	JourneyStepEntity,
	JourneyProgressEntity,
	JourneyStepProgressEntity,
];

export const journeyEnums = [JourneyStepStatusEnum];
