import { defineEvent } from '@contractspec/lib.contracts-spec';
import { ScalarTypeEnum, defineSchemaModel } from '@contractspec/lib.schema';

const KbSourceIngestedPayload = defineSchemaModel({
  name: 'KbSourceIngestedPayload',
  description: 'Emitted when a source document is ingested.',
  fields: {
    sourceDocumentId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    jurisdiction: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    hash: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export const KbSourceIngestedEvent = defineEvent({
  meta: {
    key: 'kb.source.ingested',
    version: '1.0.0',
    description: 'Source document ingested (immutable).',
    stability: 'experimental',
    owners: ['@examples'],
    tags: ['knowledge'],
  },
  payload: KbSourceIngestedPayload,
});

const KbRuleVersionCreatedPayload = defineSchemaModel({
  name: 'KbRuleVersionCreatedPayload',
  description: 'Emitted when a rule version draft is created.',
  fields: {
    ruleVersionId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    ruleId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    jurisdiction: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export const KbRuleVersionCreatedEvent = defineEvent({
  meta: {
    key: 'kb.ruleVersion.created',
    version: '1.0.0',
    description: 'Rule version created (draft).',
    stability: 'experimental',
    owners: ['@examples'],
    tags: ['knowledge'],
  },
  payload: KbRuleVersionCreatedPayload,
});

const KbRuleVersionApprovedPayload = defineSchemaModel({
  name: 'KbRuleVersionApprovedPayload',
  description: 'Emitted when a rule version is approved.',
  fields: {
    ruleVersionId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    approver: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export const KbRuleVersionApprovedEvent = defineEvent({
  meta: {
    key: 'kb.ruleVersion.approved',
    version: '1.0.0',
    description: 'Rule version approved (human verified).',
    stability: 'experimental',
    owners: ['@examples'],
    tags: ['knowledge'],
  },
  payload: KbRuleVersionApprovedPayload,
});

const KbSnapshotPublishedPayload = defineSchemaModel({
  name: 'KbSnapshotPublishedPayload',
  description: 'Emitted when a KB snapshot is published.',
  fields: {
    snapshotId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    jurisdiction: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    includedRuleVersionsCount: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: false,
    },
  },
});

export const KbSnapshotPublishedEvent = defineEvent({
  meta: {
    key: 'kb.snapshot.published',
    version: '1.0.0',
    description: 'KB snapshot published.',
    stability: 'experimental',
    owners: ['@examples'],
    tags: ['knowledge'],
  },
  payload: KbSnapshotPublishedPayload,
});



