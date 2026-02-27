import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineEvent } from '../../events';
import {
  CONTROL_PLANE_DOMAIN,
  CONTROL_PLANE_OWNERS,
  CONTROL_PLANE_STABILITY,
  CONTROL_PLANE_TAGS,
} from '../constants';

export const ControlPlaneExecutionFailedPayload = new SchemaModel({
  name: 'ControlPlaneExecutionFailedPayload',
  fields: {
    executionId: { type: ScalarTypeEnum.ID(), isOptional: false },
    runId: { type: ScalarTypeEnum.ID(), isOptional: true },
    failedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    errorCode: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    errorMessage: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

export const ControlPlaneExecutionFailedEvent = defineEvent({
  meta: {
    key: 'controlPlane.execution.failed',
    version: '1.0.0',
    description: 'Emitted when an execution run fails.',
    domain: CONTROL_PLANE_DOMAIN,
    owners: CONTROL_PLANE_OWNERS,
    tags: [...CONTROL_PLANE_TAGS, 'execution', 'failure'],
    stability: CONTROL_PLANE_STABILITY,
  },
  payload: ControlPlaneExecutionFailedPayload,
});
