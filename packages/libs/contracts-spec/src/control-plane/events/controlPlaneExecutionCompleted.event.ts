import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineEvent } from '../../events';
import {
  CONTROL_PLANE_DOMAIN,
  CONTROL_PLANE_OWNERS,
  CONTROL_PLANE_STABILITY,
  CONTROL_PLANE_TAGS,
} from '../constants';

export const ControlPlaneExecutionCompletedPayload = new SchemaModel({
  name: 'ControlPlaneExecutionCompletedPayload',
  fields: {
    executionId: { type: ScalarTypeEnum.ID(), isOptional: false },
    runId: { type: ScalarTypeEnum.ID(), isOptional: false },
    completedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    outcome: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

export const ControlPlaneExecutionCompletedEvent = defineEvent({
  meta: {
    key: 'controlPlane.execution.completed',
    version: '1.0.0',
    description: 'Emitted when an execution run finishes successfully.',
    domain: CONTROL_PLANE_DOMAIN,
    owners: CONTROL_PLANE_OWNERS,
    tags: [...CONTROL_PLANE_TAGS, 'execution'],
    stability: CONTROL_PLANE_STABILITY,
  },
  payload: ControlPlaneExecutionCompletedPayload,
});
