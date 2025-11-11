/**
 * Shared base contracts for onboarding flows across verticals.
 * These operations are reusable for any app that needs multi-step onboarding with draft persistence.
 */
import { defineCommand, defineQuery } from './spec';
import { ScalarTypeEnum, SchemaModel } from '@lssm/lib.schema';
import { OwnersEnum, StabilityEnum } from './ownership';

/** Save/update onboarding draft (auto-save during flow) */
export const SaveOnboardingDraftInput = new SchemaModel({
  name: 'SaveOnboardingDraftInput',
  description: 'Input for saving onboarding draft',
  fields: {
    data: { type: ScalarTypeEnum.JSON(), isOptional: false },
  },
});

export const SaveOnboardingDraftOutput = new SchemaModel({
  name: 'SaveOnboardingDraftOutput',
  description: 'Output for saving onboarding draft',
  fields: {
    id: { type: ScalarTypeEnum.ID(), isOptional: false },
    organizationId: { type: ScalarTypeEnum.ID(), isOptional: false },
  },
});

export const SaveOnboardingDraftBaseSpec = defineCommand({
  meta: {
    name: 'base.onboarding.saveDraft',
    version: 1,
    stability: StabilityEnum.Beta,
    owners: [OwnersEnum.PlatformSigil],
    tags: ['onboarding', 'draft'],
    description: 'Save or update onboarding draft for active organization',
    goal: 'Persist onboarding progress incrementally for resumption and safety',
    context:
      'Auto-saves every few seconds during onboarding; enables users to leave and resume',
  },
  io: {
    input: SaveOnboardingDraftInput,
    output: SaveOnboardingDraftOutput,
  },
  policy: {
    auth: 'user',
    escalate: null,
  },
  transport: {
    gql: { field: 'saveOnboardingDraft' },
    rest: { method: 'POST' },
  },
});

/** Get current onboarding draft (on mount/restore) */
export const GetOnboardingDraftOutput = new SchemaModel({
  name: 'GetOnboardingDraftOutput',
  description: 'Onboarding draft payload',
  fields: {
    id: { type: ScalarTypeEnum.ID(), isOptional: true },
    organizationId: { type: ScalarTypeEnum.ID(), isOptional: true },
    data: { type: ScalarTypeEnum.JSON(), isOptional: true },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    updatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
  },
});

export const GetOnboardingDraftBaseSpec = defineQuery({
  meta: {
    name: 'base.onboarding.getDraft',
    version: 1,
    stability: StabilityEnum.Beta,
    owners: [OwnersEnum.PlatformSigil],
    tags: ['onboarding', 'draft'],
    description: 'Get onboarding draft for active organization',
    goal: 'Retrieve saved onboarding progress',
    context: 'Called on mount to restore in-progress onboarding',
  },
  io: {
    input: null,
    output: GetOnboardingDraftOutput,
  },
  policy: {
    auth: 'user',
    escalate: null,
  },
  transport: {
    gql: { field: 'getOnboardingDraft' },
    rest: { method: 'GET' },
  },
});

/** Delete onboarding draft (cleanup after completion or cancel) */
export const DeleteOnboardingDraftOutput = new SchemaModel({
  name: 'DeleteOnboardingDraftOutput',
  description: 'Result of delete operation',
  fields: {
    ok: { type: ScalarTypeEnum.Boolean(), isOptional: false },
  },
});

export const DeleteOnboardingDraftBaseSpec = defineCommand({
  meta: {
    name: 'base.onboarding.deleteDraft',
    version: 1,
    stability: StabilityEnum.Beta,
    owners: [OwnersEnum.PlatformSigil],
    tags: ['onboarding', 'draft'],
    description: 'Delete onboarding draft for active organization',
    goal: 'Clear draft after completion or if user wants to restart',
    context: 'Called after successful onboarding or explicit user reset',
  },
  io: {
    input: null,
    output: DeleteOnboardingDraftOutput,
  },
  policy: {
    auth: 'user',
    escalate: null,
  },
  transport: {
    gql: { field: 'deleteOnboardingDraft' },
    rest: { method: 'POST' },
  },
});

/** Complete onboarding (final submit, creates entities) */
export const CompleteOnboardingBaseInput = new SchemaModel({
  name: 'CompleteOnboardingBaseInput',
  description: 'Input for completing onboarding',
  fields: {
    data: { type: ScalarTypeEnum.JSON(), isOptional: false },
  },
});

export const CompleteOnboardingBaseOutput = new SchemaModel({
  name: 'CompleteOnboardingBaseOutput',
  description: 'Result of onboarding completion',
  fields: {
    success: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    userId: { type: ScalarTypeEnum.ID(), isOptional: true },
    organizationId: { type: ScalarTypeEnum.ID(), isOptional: true },
  },
});

export const CompleteOnboardingBaseSpec = defineCommand({
  meta: {
    name: 'base.onboarding.complete',
    version: 1,
    stability: StabilityEnum.Beta,
    owners: [OwnersEnum.PlatformSigil],
    tags: ['onboarding'],
    description: 'Complete onboarding and finalize user/organization setup',
    goal: 'Transition from draft to active profile',
    context:
      'Validates all required fields, creates/updates entities, marks onboarding complete',
  },
  io: {
    input: CompleteOnboardingBaseInput,
    output: CompleteOnboardingBaseOutput,
  },
  policy: {
    auth: 'user',
    escalate: null,
  },
  transport: {
    gql: { field: 'completeOnboarding' },
    rest: { method: 'POST' },
  },
});
