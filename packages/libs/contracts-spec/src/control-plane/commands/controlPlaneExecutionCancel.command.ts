import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineCommand } from '../../operations';
import {
  CONTROL_PLANE_DOMAIN,
  CONTROL_PLANE_OWNERS,
  CONTROL_PLANE_STABILITY,
  CONTROL_PLANE_TAGS,
} from '../constants';

const ControlPlaneExecutionCancelInput = new SchemaModel({
  name: 'ControlPlaneExecutionCancelInput',
  fields: {
    executionId: { type: ScalarTypeEnum.ID(), isOptional: false },
    cancelledBy: { type: ScalarTypeEnum.ID(), isOptional: false },
    reason: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

const ControlPlaneExecutionCancelOutput = new SchemaModel({
  name: 'ControlPlaneExecutionCancelOutput',
  fields: {
    executionId: { type: ScalarTypeEnum.ID(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    cancelledAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const ControlPlaneExecutionCancelCommand = defineCommand({
  meta: {
    key: 'controlPlane.execution.cancel',
    title: 'Cancel Execution',
    version: '1.0.0',
    description: 'Cancel an execution run and transition to terminal state.',
    goal: 'Provide safe operator control to stop active runs.',
    context:
      'Used when execution must be halted due to policy, operator decision, or runtime error handling.',
    domain: CONTROL_PLANE_DOMAIN,
    owners: CONTROL_PLANE_OWNERS,
    tags: [...CONTROL_PLANE_TAGS, 'execution', 'approval'],
    stability: CONTROL_PLANE_STABILITY,
  },
  capability: {
    key: 'control-plane.core',
    version: '1.0.0',
  },
  io: {
    input: ControlPlaneExecutionCancelInput,
    output: ControlPlaneExecutionCancelOutput,
  },
  policy: {
    auth: 'admin',
    pii: [],
  },
});
