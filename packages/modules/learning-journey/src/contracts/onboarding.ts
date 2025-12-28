import { ScalarTypeEnum, defineSchemaModel } from '@contractspec/lib.schema';
import { defineCommand, defineQuery } from '@contractspec/lib.contracts';

import { SuccessOutput } from './models';
import { LEARNING_JOURNEY_OWNERS } from './shared';

const OnboardingStepConditionModel = defineSchemaModel({
  name: 'OnboardingStepCondition',
  description: 'Structured completion condition for onboarding steps.',
  fields: {
    eventName: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    eventVersion: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    sourceModule: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    payloadFilter: { type: ScalarTypeEnum.JSON(), isOptional: true },
  },
});

export const OnboardingStepModel = defineSchemaModel({
  name: 'OnboardingStep',
  description: 'Declarative onboarding step definition.',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    trackId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    title: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    instructions: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    helpUrl: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    order: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    completionEvent: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    completionCondition: {
      type: OnboardingStepConditionModel,
      isOptional: true,
    },
    xpReward: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    isRequired: { type: ScalarTypeEnum.Boolean(), isOptional: true },
    canSkip: { type: ScalarTypeEnum.Boolean(), isOptional: true },
    actionUrl: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    actionLabel: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    metadata: { type: ScalarTypeEnum.JSON(), isOptional: true },
  },
});

export const OnboardingTrackModel = defineSchemaModel({
  name: 'OnboardingTrack',
  description: 'Onboarding track metadata and steps.',
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
    isActive: { type: ScalarTypeEnum.Boolean(), isOptional: true },
    isRequired: { type: ScalarTypeEnum.Boolean(), isOptional: true },
    canSkip: { type: ScalarTypeEnum.Boolean(), isOptional: true },
    totalXp: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    completionXpBonus: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: true,
    },
    completionBadgeKey: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    streakHoursWindow: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: true,
    },
    streakBonusXp: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    metadata: { type: ScalarTypeEnum.JSON(), isOptional: true },
    steps: { type: OnboardingStepModel, isArray: true, isOptional: false },
  },
});

export const OnboardingStepProgressModel = defineSchemaModel({
  name: 'OnboardingStepProgress',
  description: 'Progress for a specific onboarding step.',
  fields: {
    stepId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    xpEarned: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    triggeringEvent: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    eventPayload: { type: ScalarTypeEnum.JSON(), isOptional: true },
    completedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
  },
});

export const OnboardingProgressModel = defineSchemaModel({
  name: 'OnboardingProgress',
  description: 'Aggregated progress for an onboarding track.',
  fields: {
    learnerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    trackId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    progress: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    isCompleted: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    xpEarned: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    startedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    completedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    lastActivityAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    steps: {
      type: OnboardingStepProgressModel,
      isArray: true,
      isOptional: true,
    },
  },
});

const ListOnboardingTracksInput = defineSchemaModel({
  name: 'ListOnboardingTracksInput',
  description: 'Filters for listing onboarding tracks.',
  fields: {
    learnerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    productId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    trackIds: {
      type: ScalarTypeEnum.String_unsecure(),
      isArray: true,
      isOptional: true,
    },
    includeProgress: {
      type: ScalarTypeEnum.Boolean(),
      isOptional: true,
    },
  },
});

const ListOnboardingTracksOutput = defineSchemaModel({
  name: 'ListOnboardingTracksOutput',
  description: 'Available onboarding tracks with optional progress.',
  fields: {
    tracks: { type: OnboardingTrackModel, isArray: true, isOptional: false },
    progress: {
      type: OnboardingProgressModel,
      isArray: true,
      isOptional: true,
    },
  },
});

const GetOnboardingProgressInput = defineSchemaModel({
  name: 'GetOnboardingProgressInput',
  description: 'Input for fetching onboarding progress for a track.',
  fields: {
    trackId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    learnerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

const RecordOnboardingEventInput = defineSchemaModel({
  name: 'RecordOnboardingEventInput',
  description:
    'Record a domain event to advance onboarding progress via completion conditions.',
  fields: {
    learnerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    trackId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    eventName: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    eventVersion: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    eventPayload: { type: ScalarTypeEnum.JSON(), isOptional: true },
    occurredAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
  },
});

export const ListOnboardingTracksContract = defineQuery({
  meta: {
    key: 'learning.onboarding.listTracks',
    version: '1.0.0',
    stability: 'stable',
    owners: [...LEARNING_JOURNEY_OWNERS],
    tags: ['learning', 'onboarding', 'journey'],
    description: 'List onboarding tracks available to a learner or product.',
    goal: 'Expose track catalog for UI/API surfaces.',
    context: 'Called when showing onboarding/learning journey catalog.',
  },
  io: {
    input: ListOnboardingTracksInput,
    output: ListOnboardingTracksOutput,
  },
  policy: {
    auth: 'user',
  },
});

export const GetOnboardingProgressContract = defineQuery({
  meta: {
    key: 'learning.onboarding.getProgress',
    version: '1.0.0',
    stability: 'stable',
    owners: [...LEARNING_JOURNEY_OWNERS],
    tags: ['learning', 'onboarding', 'journey'],
    description: 'Fetch onboarding progress for a specific track.',
    goal: 'Display learner progress and remaining steps.',
    context: 'Called when rendering a track detail or widget.',
  },
  io: {
    input: GetOnboardingProgressInput,
    output: OnboardingProgressModel,
  },
  policy: {
    auth: 'user',
  },
});

export const RecordOnboardingEventContract = defineCommand({
  meta: {
    key: 'learning.onboarding.recordEvent',
    version: '1.0.0',
    stability: 'stable',
    owners: [...LEARNING_JOURNEY_OWNERS],
    tags: ['learning', 'onboarding', 'events'],
    description:
      'Record a domain event to evaluate onboarding step completion conditions.',
    goal: 'Advance onboarding automatically from product events.',
    context:
      'Called by event bus handlers when relevant product events fire (e.g., deal.created).',
  },
  io: {
    input: RecordOnboardingEventInput,
    output: SuccessOutput,
    errors: {
      TRACK_NOT_FOUND: {
        description: 'Track not found for event routing',
        http: 404,
        gqlCode: 'TRACK_NOT_FOUND',
        when: 'Track ID or routing context is invalid',
      },
      STEP_NOT_FOUND: {
        description: 'Step not found for completion condition',
        http: 404,
        gqlCode: 'STEP_NOT_FOUND',
        when: 'No step matches the incoming event',
      },
    },
  },
  policy: {
    auth: 'user',
  },
});
