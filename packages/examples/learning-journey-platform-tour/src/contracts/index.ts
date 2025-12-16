import { ScalarTypeEnum, defineSchemaModel } from '@lssm/lib.schema';
import { defineCommand, defineQuery } from '@lssm/lib.contracts';

import { platformPrimitivesTourTrack } from '../track';

const OWNERS = ['examples.learning-journey.platform-tour'] as const;

const StepModel = defineSchemaModel({
  name: 'PlatformTourStep',
  description: 'Step metadata for platform primitives tour',
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

export const PlatformTourTrackModel = defineSchemaModel({
  name: 'PlatformTourTrack',
  description: 'Platform primitives tour track definition',
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
  name: 'PlatformTourTrackResponse',
  description: 'Response wrapper for platform tour track',
  fields: {
    track: { type: PlatformTourTrackModel, isOptional: false },
  },
});

const RecordDemoEventInput = defineSchemaModel({
  name: 'PlatformTourRecordEventInput',
  description: 'Emit a demo event to advance platform tour steps',
  fields: {
    learnerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    eventName: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    payload: { type: ScalarTypeEnum.JSON(), isOptional: true },
    occurredAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
  },
});

const SuccessModel = defineSchemaModel({
  name: 'PlatformTourSuccess',
  description: 'Generic success response',
  fields: {
    success: { type: ScalarTypeEnum.Boolean(), isOptional: false },
  },
});

export const GetPlatformTourTrack = defineQuery({
  meta: {
    name: 'learningJourney.platformTour.getTrack',
    version: 1,
    stability: 'experimental',
    owners: [...OWNERS],
    tags: ['learning', 'platform', 'tour'],
    description: 'Fetch platform primitives tour track definition.',
    goal: 'Expose track metadata to UIs and templates.',
    context: 'Called by Studio/Playground to render journey steps.',
  },
  io: {
    input: defineSchemaModel({
      name: 'PlatformTourTrackInput',
      description: 'Track input',
      fields: {},
    }),
    output: TrackResponseModel,
  },
  policy: { auth: 'user' },
});

export const RecordPlatformTourEvent = defineCommand({
  meta: {
    name: 'learningJourney.platformTour.recordEvent',
    version: 1,
    stability: 'experimental',
    owners: [...OWNERS],
    tags: ['learning', 'platform', 'tour'],
    description: 'Record an event to advance platform tour progress.',
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

export const platformTourContracts = {
  GetPlatformTourTrack,
  RecordPlatformTourEvent,
  track: platformPrimitivesTourTrack,
};



