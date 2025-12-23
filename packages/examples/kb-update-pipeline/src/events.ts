import { defineEvent, defineSchemaModel } from '@lssm/lib.contracts';
import { ScalarTypeEnum } from '@lssm/lib.schema';

const KbChangeDetectedPayload = defineSchemaModel({
  name: 'KbChangeDetectedPayload',
  description: 'Emitted when a source change is detected.',
  fields: {
    changeCandidateId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    sourceDocumentId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    riskLevel: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export const KbChangeDetectedEvent = defineEvent({
  name: 'kb.change.detected',
  version: 1,
  description: 'KB source change detected.',
  payload: KbChangeDetectedPayload,
});

const KbChangeSummarizedPayload = defineSchemaModel({
  name: 'KbChangeSummarizedPayload',
  description: 'Emitted when a change summary is produced.',
  fields: {
    changeCandidateId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    summary: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    riskLevel: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export const KbChangeSummarizedEvent = defineEvent({
  name: 'kb.change.summarized',
  version: 1,
  description: 'KB change summarized.',
  payload: KbChangeSummarizedPayload,
});

const KbPatchProposedPayload = defineSchemaModel({
  name: 'KbPatchProposedPayload',
  description: 'Emitted when draft rule patches are proposed.',
  fields: {
    changeCandidateId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    proposedRuleVersionIds: {
      type: ScalarTypeEnum.String_unsecure(),
      isArray: true,
      isOptional: false,
    },
  },
});

export const KbPatchProposedEvent = defineEvent({
  name: 'kb.patch.proposed',
  version: 1,
  description: 'KB rule patch proposed (draft versions created).',
  payload: KbPatchProposedPayload,
});

const KbReviewRequestedPayload = defineSchemaModel({
  name: 'KbReviewRequestedPayload',
  description: 'Emitted when a review is requested.',
  fields: {
    reviewTaskId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    changeCandidateId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    assignedRole: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export const KbReviewRequestedEvent = defineEvent({
  name: 'kb.review.requested',
  version: 1,
  description: 'KB review requested.',
  payload: KbReviewRequestedPayload,
});

const KbReviewDecidedPayload = defineSchemaModel({
  name: 'KbReviewDecidedPayload',
  description: 'Emitted when a review task is decided.',
  fields: {
    reviewTaskId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    decision: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    decidedBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export const KbReviewDecidedEvent = defineEvent({
  name: 'kb.review.decided',
  version: 1,
  description: 'KB review decided.',
  payload: KbReviewDecidedPayload,
});
