import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineEvent } from '../../events';
import {
  CONTROL_PLANE_DOMAIN,
  CONTROL_PLANE_OWNERS,
  CONTROL_PLANE_STABILITY,
  CONTROL_PLANE_TAGS,
} from '../constants';

export const ControlPlaneExecutionStepStartedPayload = new SchemaModel({
  name: 'ControlPlaneExecutionStepStartedPayload',
  fields: {
    executionId: { type: ScalarTypeEnum.ID(), isOptional: false },
    runId: { type: ScalarTypeEnum.ID(), isOptional: false },
    stepId: { type: ScalarTypeEnum.ID(), isOptional: false },
    startedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const ControlPlaneExecutionStepStartedEvent = defineEvent({
  meta: {
    key: 'controlPlane.execution.step.started',
    version: '1.0.0',
    description: 'Emitted when an execution step starts.',
    domain: CONTROL_PLANE_DOMAIN,
    owners: CONTROL_PLANE_OWNERS,
    tags: [...CONTROL_PLANE_TAGS, 'execution'],
    stability: CONTROL_PLANE_STABILITY,
  },
  payload: ControlPlaneExecutionStepStartedPayload,
});
