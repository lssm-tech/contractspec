import {
  ScalarTypeEnum,
  defineEnum,
  defineSchemaModel,
} from '@lssm/lib.schema';

export const AllowedScopeEnum = defineEnum('AllowedScope', [
  'education_only',
  'generic_info',
  'escalation_required',
]);

export const UserProfileModel = defineSchemaModel({
  name: 'UserProfile',
  description: 'User profile inputs used to derive regulatory context.',
  fields: {
    preferredLocale: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    residencyCountry: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    taxResidenceCountry: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    clientType: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

export const RegulatoryContextModel = defineSchemaModel({
  name: 'RegulatoryContext',
  description: 'Explicit regulatory context (no guessing).',
  fields: {
    jurisdiction: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    region: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    clientType: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    allowedScope: { type: AllowedScopeEnum, isOptional: false },
  },
});

export const LLMCallEnvelopeModel = defineSchemaModel({
  name: 'LLMCallEnvelope',
  description:
    'Mandatory envelope for assistant calls. All fields are explicit and required for policy gating.',
  fields: {
    traceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    locale: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    regulatoryContext: { type: RegulatoryContextModel, isOptional: false },
    kbSnapshotId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    allowedScope: { type: AllowedScopeEnum, isOptional: false },
  },
});

export const AssistantCitationModel = defineSchemaModel({
  name: 'AssistantCitation',
  description:
    'Citation referencing a KB snapshot + a specific item within it.',
  fields: {
    kbSnapshotId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    sourceType: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    sourceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    title: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    excerpt: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

export const AssistantAnswerSectionModel = defineSchemaModel({
  name: 'AssistantAnswerSection',
  description: 'Structured answer section.',
  fields: {
    heading: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    body: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export const AssistantAnswerIRModel = defineSchemaModel({
  name: 'AssistantAnswerIR',
  description:
    'Structured assistant answer with mandatory citations and explicit locale/jurisdiction.',
  fields: {
    locale: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    jurisdiction: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    allowedScope: { type: AllowedScopeEnum, isOptional: false },
    sections: {
      type: AssistantAnswerSectionModel,
      isArray: true,
      isOptional: false,
    },
    citations: {
      type: AssistantCitationModel,
      isArray: true,
      isOptional: false,
    },
    disclaimers: {
      type: ScalarTypeEnum.String_unsecure(),
      isArray: true,
      isOptional: true,
    },
    riskFlags: {
      type: ScalarTypeEnum.String_unsecure(),
      isArray: true,
      isOptional: true,
    },
    refused: { type: ScalarTypeEnum.Boolean(), isOptional: true },
    refusalReason: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});
