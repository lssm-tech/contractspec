import { SchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';
import { defineEvent } from '../events';
import { OwnersEnum, StabilityEnum, TagsEnum } from '../ownership';

const lifecycleOwnership = {
  title: 'Tenant App Config Lifecycle',
  description:
    'Events emitted when tenant app configurations move through lifecycle stages.',
  domain: 'app-config.lifecycle',
  owners: [OwnersEnum.PlatformSigil],
  tags: [TagsEnum.Hygiene],
  stability: StabilityEnum.Beta,
};

export const ConfigDraftCreatedEvent = defineEvent({
  meta: {
    ...lifecycleOwnership,
    key: 'app_config.draft_created',
    version: '1.0.0',
    description: 'A new tenant config draft was created.',
  },
  payload: new SchemaModel({
    name: 'ConfigDraftCreatedPayload',
    fields: {
      tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
      appId: { type: ScalarTypeEnum.ID(), isOptional: false },
      version: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
      blueprintName: {
        type: ScalarTypeEnum.String_unsecure(),
        isOptional: false,
      },
      blueprintVersion: {
        type: ScalarTypeEnum.String_unsecure(),
        isOptional: false,
      },
      createdBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
      clonedFrom: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    },
  }),
});

export const ConfigPromotedToPreviewEvent = defineEvent({
  meta: {
    ...lifecycleOwnership,
    key: 'app_config.promoted_to_preview',
    version: '1.0.0',
    description: 'A tenant config draft was promoted to preview.',
  },
  payload: new SchemaModel({
    name: 'ConfigPromotedToPreviewPayload',
    fields: {
      tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
      appId: { type: ScalarTypeEnum.ID(), isOptional: false },
      version: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
      promotedBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
      warnings: {
        type: ScalarTypeEnum.String_unsecure(),
        isOptional: true,
        isArray: true,
      },
    },
  }),
});

export const ConfigPublishedEvent = defineEvent({
  meta: {
    ...lifecycleOwnership,
    key: 'app_config.published',
    version: '1.0.0',
    description: 'A tenant config version was published to production.',
  },
  payload: new SchemaModel({
    name: 'ConfigPublishedPayload',
    fields: {
      tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
      appId: { type: ScalarTypeEnum.ID(), isOptional: false },
      version: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
      previousVersion: {
        type: ScalarTypeEnum.Int_unsecure(),
        isOptional: true,
      },
      publishedBy: {
        type: ScalarTypeEnum.String_unsecure(),
        isOptional: false,
      },
      changeSummary: {
        type: ScalarTypeEnum.String_unsecure(),
        isOptional: true,
      },
      changedSections: {
        type: ScalarTypeEnum.String_unsecure(),
        isOptional: true,
        isArray: true,
      },
    },
  }),
});

export const ConfigRolledBackEvent = defineEvent({
  meta: {
    ...lifecycleOwnership,
    key: 'app_config.rolled_back',
    version: '1.0.0',
    description: 'A tenant config was rolled back to a previous version.',
  },
  payload: new SchemaModel({
    name: 'ConfigRolledBackPayload',
    fields: {
      tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
      appId: { type: ScalarTypeEnum.ID(), isOptional: false },
      newVersion: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
      rolledBackFrom: {
        type: ScalarTypeEnum.Int_unsecure(),
        isOptional: false,
      },
      rolledBackTo: {
        type: ScalarTypeEnum.Int_unsecure(),
        isOptional: false,
      },
      rolledBackBy: {
        type: ScalarTypeEnum.String_unsecure(),
        isOptional: false,
      },
      reason: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    },
  }),
});
