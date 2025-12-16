import { defineEvent, defineSchemaModel } from '@lssm/lib.contracts';
import { ScalarTypeEnum } from '@lssm/lib.schema';

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
  name: 'kb.source.ingested',
  version: 1,
  description: 'Source document ingested (immutable).',
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
  name: 'kb.ruleVersion.created',
  version: 1,
  description: 'Rule version created (draft).',
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
  name: 'kb.ruleVersion.approved',
  version: 1,
  description: 'Rule version approved (human verified).',
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
  name: 'kb.snapshot.published',
  version: 1,
  description: 'KB snapshot published.',
  payload: KbSnapshotPublishedPayload,
});
