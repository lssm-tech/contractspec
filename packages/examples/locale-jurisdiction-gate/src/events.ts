import { defineEvent } from '@contractspec/lib.contracts-spec';
import { ScalarTypeEnum, defineSchemaModel } from '@contractspec/lib.schema';

const AssistantAnswerRequestedPayload = defineSchemaModel({
  name: 'AssistantAnswerRequestedPayload',
  description: 'Emitted when an assistant answer is requested (pre-gate).',
  fields: {
    traceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    locale: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    jurisdiction: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    kbSnapshotId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    allowedScope: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export const AssistantAnswerRequestedEvent = defineEvent({
  meta: {
    key: 'assistant.answer.requested',
    version: '1.0.0',
    description: 'Assistant answer requested (policy gate will run).',
    stability: 'experimental',
    owners: ['@examples'],
    tags: ['assistant', 'policy'],
  },
  payload: AssistantAnswerRequestedPayload,
});

const AssistantAnswerBlockedPayload = defineSchemaModel({
  name: 'AssistantAnswerBlockedPayload',
  description: 'Emitted when a request is blocked by the gate.',
  fields: {
    traceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    reasonCode: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    reason: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export const AssistantAnswerBlockedEvent = defineEvent({
  meta: {
    key: 'assistant.answer.blocked',
    version: '1.0.0',
    description: 'Assistant answer blocked (fail-closed).',
    stability: 'experimental',
    owners: ['@examples'],
    tags: ['assistant', 'policy', 'blocked'],
  },
  payload: AssistantAnswerBlockedPayload,
});

const AssistantAnswerDeliveredPayload = defineSchemaModel({
  name: 'AssistantAnswerDeliveredPayload',
  description: 'Emitted when a structured, cited answer is delivered.',
  fields: {
    traceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    locale: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    jurisdiction: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    kbSnapshotId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    allowedScope: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    citationsCount: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
  },
});

export const AssistantAnswerDeliveredEvent = defineEvent({
  meta: {
    key: 'assistant.answer.delivered',
    version: '1.0.0',
    description:
      'Assistant answer delivered (must include KB snapshot citations).',
    stability: 'experimental',
    owners: ['@examples'],
    tags: ['assistant', 'policy', 'delivered'],
  },
  payload: AssistantAnswerDeliveredPayload,
});


