import { ScalarTypeEnum, defineSchemaModel } from '@lssm/lib.schema';
import { defineCommand, defineQuery } from '@lssm/lib.contracts';

import { studioGettingStartedTrack } from '../track';

const OWNERS = ['examples.learning-journey.studio-onboarding'] as const;

const StepModel = defineSchemaModel({
  name: 'StudioOnboardingStep',
  description: 'Step metadata for Studio onboarding journey',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    title: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    completionEvent: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    sourceModule: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    xpReward: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    order: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
  },
});

export const StudioOnboardingTrackModel = defineSchemaModel({
  name: 'StudioOnboardingTrack',
  description: 'Studio onboarding track definition',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
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
    steps: { type: StepModel, isArray: true, isOptional: false },
  },
});

const TrackResponseModel = defineSchemaModel({
  name: 'StudioOnboardingTrackResponse',
  description: 'Response wrapper for studio onboarding track',
  fields: {
    track: { type: StudioOnboardingTrackModel, isOptional: false },
  },
});

const RecordDemoEventInput = defineSchemaModel({
  name: 'StudioOnboardingRecordEventInput',
  description: 'Emit a demo event to advance Studio onboarding steps',
  fields: {
    learnerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    eventName: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    payload: { type: ScalarTypeEnum.JSON(), isOptional: true },
    occurredAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
  },
});

const SuccessModel = defineSchemaModel({
  name: 'StudioOnboardingSuccess',
  description: 'Generic success response',
  fields: {
    success: { type: ScalarTypeEnum.Boolean(), isOptional: false },
  },
});

export const GetStudioOnboardingTrack = defineQuery({
  meta: {
    name: 'learningJourney.studioOnboarding.getTrack',
    version: 1,
    stability: 'experimental',
    owners: [...OWNERS],
    tags: ['learning', 'onboarding', 'studio'],
    description: 'Fetch the Studio onboarding track definition.',
    goal: 'Expose track metadata to UIs and templates.',
    context: 'Called by Studio/Playground to render journey steps.',
  },
  io: {
    input: defineSchemaModel({
      name: 'StudioOnboardingTrackInput',
      description: 'Track input',
      fields: {},
    }),
    output: TrackResponseModel,
  },
  policy: { auth: 'user' },
});

export const RecordStudioOnboardingEvent = defineCommand({
  meta: {
    name: 'learningJourney.studioOnboarding.recordEvent',
    version: 1,
    stability: 'experimental',
    owners: [...OWNERS],
    tags: ['learning', 'onboarding', 'studio'],
    description: 'Record an event to advance Studio onboarding progress.',
    goal: 'Advance steps via domain events in demo/sandbox contexts.',
    context:
      'Called by handlers or demo scripts to emit step completion events.',
  },
  io: {
    input: RecordDemoEventInput,
    output: SuccessModel,
  },
  policy: { auth: 'user' },
});

export const studioOnboardingContracts = {
  GetStudioOnboardingTrack,
  RecordStudioOnboardingEvent,
  track: studioGettingStartedTrack,
};


