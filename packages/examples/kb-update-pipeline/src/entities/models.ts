import {
  ScalarTypeEnum,
  defineEnum,
  defineSchemaModel,
} from '@lssm/lib.schema';

export const ChangeRiskLevelEnum = defineEnum('ChangeRiskLevel', [
  'low',
  'medium',
  'high',
]);

export const ReviewAssignedRoleEnum = defineEnum('ReviewAssignedRole', [
  'curator',
  'expert',
]);

export const ReviewDecisionEnum = defineEnum('ReviewDecision', [
  'approve',
  'reject',
]);

export const ChangeCandidateModel = defineSchemaModel({
  name: 'ChangeCandidate',
  description: 'Candidate change detected in a source document.',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    sourceDocumentId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    detectedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    diffSummary: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    riskLevel: { type: ChangeRiskLevelEnum, isOptional: false },
  },
});

export const ReviewTaskModel = defineSchemaModel({
  name: 'ReviewTask',
  description: 'Human verification task for a change candidate.',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    changeCandidateId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false }, // open|decided
    assignedRole: { type: ReviewAssignedRoleEnum, isOptional: false },
    decision: { type: ReviewDecisionEnum, isOptional: true },
    decidedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    decidedBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});
