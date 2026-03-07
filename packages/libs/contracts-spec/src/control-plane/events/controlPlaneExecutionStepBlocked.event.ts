import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineEvent } from '../../events';
import {
  CONTROL_PLANE_DOMAIN,
  CONTROL_PLANE_OWNERS,
  CONTROL_PLANE_STABILITY,
  CONTROL_PLANE_TAGS,
} from '../constants';

export const ControlPlaneExecutionStepBlockedPayload = new SchemaModel({
  name: 'ControlPlaneExecutionStepBlockedPayload',
  fields: {
    executionId: { type: ScalarTypeEnum.ID(), isOptional: false },
    runId: { type: ScalarTypeEnum.ID(), isOptional: true },
    stepId: { type: ScalarTypeEnum.ID(), isOptional: true },
    blockedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    reason: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export const ControlPlaneExecutionStepBlockedEvent = defineEvent({
  meta: {
    key: 'controlPlane.execution.step.blocked',
    version: '1.0.0',
    description: 'Emitted when policy blocks an execution step.',
    domain: CONTROL_PLANE_DOMAIN,
    owners: CONTROL_PLANE_OWNERS,
    tags: [...CONTROL_PLANE_TAGS, 'execution', 'blocked'],
    stability: CONTROL_PLANE_STABILITY,
  },
  payload: ControlPlaneExecutionStepBlockedPayload,
});
