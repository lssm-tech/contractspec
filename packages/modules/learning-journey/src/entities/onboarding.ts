import { defineEntity, defineEntityEnum, field, index } from '@lssm/lib.schema';

/**
 * Onboarding step status enum.
 */
export const OnboardingStepStatusEnum = defineEntityEnum({
  name: 'OnboardingStepStatus',
  values: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED'] as const,
  schema: 'lssm_learning',
  description: 'Status of an onboarding step.',
});

/**
 * OnboardingTrack entity - defines an onboarding journey.
 */
export const OnboardingTrackEntity = defineEntity({
  name: 'OnboardingTrack',
  description: 'An onboarding track for a product.',
  schema: 'lssm_learning',
  map: 'onboarding_track',
  fields: {
    id: field.id({ description: 'Unique track identifier' }),

    // Basic info
    productId: field.string({ description: 'Product this track is for' }),
    name: field.string({ description: 'Track name' }),
    description: field.string({
      isOptional: true,
      description: 'Track description',
    }),

    // Targeting
    targetUserSegment: field.string({
      isOptional: true,
      description: 'Target user segment',
    }),
    targetRole: field.string({
      isOptional: true,
      description: 'Target user role',
    }),

    // Display
    welcomeTitle: field.string({
      isOptional: true,
      description: 'Welcome message title',
    }),
    welcomeMessage: field.string({
      isOptional: true,
      description: 'Welcome message',
    }),
    completionTitle: field.string({
      isOptional: true,
      description: 'Completion message title',
    }),
    completionMessage: field.string({
      isOptional: true,
      description: 'Completion message',
    }),

    // Settings
    isActive: field.boolean({
      default: true,
      description: 'Whether track is active',
    }),
    isRequired: field.boolean({
      default: false,
      description: 'Whether track is required',
    }),
    canSkip: field.boolean({
      default: true,
      description: 'Whether steps can be skipped',
    }),

    // XP
    totalXp: field.int({
      default: 100,
      description: 'Total XP for completing track',
    }),
    completionXpBonus: field.int({
      isOptional: true,
      description: 'Bonus XP for completing track',
    }),
    completionBadgeKey: field.string({
      isOptional: true,
      description: 'Badge awarded on completion',
    }),

    // Streak/tempo rules
    streakHoursWindow: field.int({
      isOptional: true,
      description: 'Hours window to finish for streak bonus',
    }),
    streakBonusXp: field.int({
      isOptional: true,
      description: 'Bonus XP if completed within streak window',
    }),

    // Organization scope
    orgId: field.string({
      isOptional: true,
      description: 'Organization scope',
    }),

    // Metadata
    metadata: field.json({
      isOptional: true,
      description: 'Additional metadata',
    }),

    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),

    // Relations
    steps: field.hasMany('OnboardingStep'),
    progress: field.hasMany('OnboardingProgress'),
  },
  indexes: [
    index.on(['productId', 'isActive']),
    index.on(['orgId']),
    index.unique(['productId', 'targetUserSegment', 'targetRole'], {
      name: 'onboarding_track_target',
    }),
  ],
});

/**
 * OnboardingStep entity - a step in an onboarding track.
 */
export const OnboardingStepEntity = defineEntity({
  name: 'OnboardingStep',
  description: 'A step in an onboarding track.',
  schema: 'lssm_learning',
  map: 'onboarding_step',
  fields: {
    id: field.id({ description: 'Unique step identifier' }),
    trackId: field.foreignKey({ description: 'Parent track' }),

    // Basic info
    title: field.string({ description: 'Step title' }),
    description: field.string({
      isOptional: true,
      description: 'Step description',
    }),

    // Instructions
    instructions: field.string({
      isOptional: true,
      description: 'How to complete the step',
    }),
    helpUrl: field.string({
      isOptional: true,
      description: 'Link to help documentation',
    }),

    // Ordering
    order: field.int({ default: 0, description: 'Display order' }),

    // Event-driven completion
    triggerEvent: field.string({
      isOptional: true,
      description: 'Event that triggers step start',
    }),
    completionEvent: field.string({
      description: 'Event that completes the step',
    }),
    completionEventVersion: field.int({
      isOptional: true,
      description: 'Version of the completion event',
    }),
    completionSourceModule: field.string({
      isOptional: true,
      description: 'Module emitting the completion event',
    }),
    completionEventFilter: field.json({
      isOptional: true,
      description: 'Filter for completion event',
    }),

    // Alternative completion
    actionUrl: field.string({
      isOptional: true,
      description: 'URL to navigate to complete',
    }),
    actionLabel: field.string({
      isOptional: true,
      description: 'Action button label',
    }),

    // UI hints
    highlightSelector: field.string({
      isOptional: true,
      description: 'CSS selector to highlight',
    }),
    tooltipPosition: field.string({
      isOptional: true,
      description: 'Tooltip position',
    }),

    // XP
    xpReward: field.int({ default: 10, description: 'XP for completing step' }),

    // Settings
    isRequired: field.boolean({
      default: true,
      description: 'Whether step is required',
    }),
    canSkip: field.boolean({
      default: true,
      description: 'Whether step can be skipped',
    }),

    // Metadata
    metadata: field.json({
      isOptional: true,
      description: 'Additional metadata',
    }),

    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),

    // Relations
    track: field.belongsTo('OnboardingTrack', ['trackId'], ['id'], {
      onDelete: 'Cascade',
    }),
  },
  indexes: [index.on(['trackId', 'order']), index.on(['completionEvent'])],
});

/**
 * OnboardingProgress entity - tracks user progress through onboarding.
 */
export const OnboardingProgressEntity = defineEntity({
  name: 'OnboardingProgress',
  description: 'Tracks user progress through an onboarding track.',
  schema: 'lssm_learning',
  map: 'onboarding_progress',
  fields: {
    id: field.id({ description: 'Unique progress identifier' }),
    learnerId: field.foreignKey({ description: 'Learner' }),
    trackId: field.foreignKey({ description: 'Onboarding track' }),

    // Progress
    currentStepId: field.string({
      isOptional: true,
      description: 'Current step ID',
    }),
    completedSteps: field.json({
      default: '[]',
      description: 'Array of completed step IDs',
    }),
    skippedSteps: field.json({
      default: '[]',
      description: 'Array of skipped step IDs',
    }),

    // Status
    progress: field.int({
      default: 0,
      description: 'Completion percentage (0-100)',
    }),
    isCompleted: field.boolean({
      default: false,
      description: 'Whether track is completed',
    }),

    // XP
    xpEarned: field.int({ default: 0, description: 'XP earned from track' }),

    // Timeline
    startedAt: field.dateTime({ description: 'When user started' }),
    completedAt: field.dateTime({
      isOptional: true,
      description: 'When user completed',
    }),
    lastActivityAt: field.dateTime({
      isOptional: true,
      description: 'Last activity',
    }),

    // Dismissal
    isDismissed: field.boolean({
      default: false,
      description: 'Whether user dismissed onboarding',
    }),
    dismissedAt: field.dateTime({
      isOptional: true,
      description: 'When dismissed',
    }),

    // Metadata
    metadata: field.json({
      isOptional: true,
      description: 'Additional metadata',
    }),

    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),

    // Relations
    learner: field.belongsTo('Learner', ['learnerId'], ['id'], {
      onDelete: 'Cascade',
    }),
    track: field.belongsTo('OnboardingTrack', ['trackId'], ['id'], {
      onDelete: 'Cascade',
    }),
  },
  indexes: [
    index.unique(['learnerId', 'trackId'], {
      name: 'onboarding_progress_unique',
    }),
    index.on(['learnerId', 'isCompleted']),
    index.on(['trackId']),
  ],
  enums: [OnboardingStepStatusEnum],
});

/**
 * OnboardingStepCompletion entity - individual step completions.
 */
export const OnboardingStepCompletionEntity = defineEntity({
  name: 'OnboardingStepCompletion',
  description: 'Individual step completion record.',
  schema: 'lssm_learning',
  map: 'onboarding_step_completion',
  fields: {
    id: field.id({ description: 'Unique completion identifier' }),
    progressId: field.foreignKey({ description: 'Parent progress record' }),
    stepId: field.foreignKey({ description: 'Completed step' }),

    // Status
    status: field.enum('OnboardingStepStatus', {
      description: 'Completion status',
    }),

    // XP
    xpEarned: field.int({ default: 0, description: 'XP earned' }),

    // Event that triggered completion
    triggeringEvent: field.string({
      isOptional: true,
      description: 'Event that triggered completion',
    }),
    eventPayload: field.json({
      isOptional: true,
      description: 'Event payload',
    }),

    // Timestamps
    completedAt: field.dateTime({ description: 'When completed' }),
    createdAt: field.createdAt(),

    // Relations
    progress: field.belongsTo('OnboardingProgress', ['progressId'], ['id'], {
      onDelete: 'Cascade',
    }),
    step: field.belongsTo('OnboardingStep', ['stepId'], ['id'], {
      onDelete: 'Cascade',
    }),
  },
  indexes: [
    index.unique(['progressId', 'stepId'], { name: 'step_completion_unique' }),
    index.on(['completedAt']),
  ],
});

export const onboardingEntities = [
  OnboardingTrackEntity,
  OnboardingStepEntity,
  OnboardingProgressEntity,
  OnboardingStepCompletionEntity,
];

export const onboardingEnums = [OnboardingStepStatusEnum];


