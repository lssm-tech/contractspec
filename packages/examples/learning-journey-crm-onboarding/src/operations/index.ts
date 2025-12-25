import { defineSchemaModel, ScalarTypeEnum } from '@lssm/lib.schema';
import { defineCommand, defineQuery } from '@lssm/lib.contracts';

import { crmFirstWinTrack } from '../track';

const OWNERS = ['examples.learning-journey.crm-onboarding'] as const;

const StepModel = defineSchemaModel({
  name: 'CrmOnboardingStep',
  description: 'Step metadata for CRM first win journey',
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

export const CrmOnboardingTrackModel = defineSchemaModel({
  name: 'CrmOnboardingTrack',
  description: 'CRM onboarding track definition',
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
  name: 'CrmOnboardingTrackResponse',
  description: 'Response wrapper for CRM onboarding track',
  fields: {
    track: { type: CrmOnboardingTrackModel, isOptional: false },
  },
});

const RecordDemoEventInput = defineSchemaModel({
  name: 'CrmOnboardingRecordEventInput',
  description: 'Emit a demo event to advance CRM onboarding steps',
  fields: {
    learnerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    eventName: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    payload: { type: ScalarTypeEnum.JSON(), isOptional: true },
    occurredAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
  },
});

const SuccessModel = defineSchemaModel({
  name: 'CrmOnboardingSuccess',
  description: 'Generic success response',
  fields: {
    success: { type: ScalarTypeEnum.Boolean(), isOptional: false },
  },
});

export const GetCrmOnboardingTrack = defineQuery({
  meta: {
    key: 'learningJourney.crmOnboarding.getTrack',
    version: 1,
    stability: 'experimental',
    owners: [...OWNERS],
    tags: ['learning', 'crm', 'onboarding'],
    description: 'Fetch CRM first win track definition.',
    goal: 'Expose track metadata to UIs and templates.',
    context: 'Called by Studio/Playground to render journey steps.',
  },
  io: {
    input: defineSchemaModel({
      name: 'CrmOnboardingTrackInput',
      description: 'Track input',
      fields: {},
    }),
    output: TrackResponseModel,
  },
  policy: { auth: 'user' },
});

export const RecordCrmOnboardingEvent = defineCommand({
  meta: {
    key: 'learningJourney.crmOnboarding.recordEvent',
    version: 1,
    stability: 'experimental',
    owners: [...OWNERS],
    tags: ['learning', 'crm', 'onboarding'],
    description: 'Record an event to advance CRM onboarding progress.',
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

export const crmOnboardingContracts = {
  GetCrmOnboardingTrack,
  RecordCrmOnboardingEvent,
  track: crmFirstWinTrack,
};
