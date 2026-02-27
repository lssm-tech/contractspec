import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineCommand } from '../../operations';
import {
  CONTROL_PLANE_DOMAIN,
  CONTROL_PLANE_OWNERS,
  CONTROL_PLANE_STABILITY,
  CONTROL_PLANE_TAGS,
} from '../constants';

const ControlPlaneExecutionRejectInput = new SchemaModel({
  name: 'ControlPlaneExecutionRejectInput',
  fields: {
    executionId: { type: ScalarTypeEnum.ID(), isOptional: false },
    stepId: { type: ScalarTypeEnum.ID(), isOptional: false },
    rejectedBy: { type: ScalarTypeEnum.ID(), isOptional: false },
    reason: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

const ControlPlaneExecutionRejectOutput = new SchemaModel({
  name: 'ControlPlaneExecutionRejectOutput',
  fields: {
    executionId: { type: ScalarTypeEnum.ID(), isOptional: false },
    stepId: { type: ScalarTypeEnum.ID(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    rejectedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const ControlPlaneExecutionRejectCommand = defineCommand({
  meta: {
    key: 'controlPlane.execution.reject',
    title: 'Reject Execution Step',
    version: '1.0.0',
    description: 'Reject a pending execution step.',
    goal: 'Allow operators to block unsafe or undesired actions.',
    context:
      'Used by approval workflows to stop execution when policy or operator criteria fail.',
    domain: CONTROL_PLANE_DOMAIN,
    owners: CONTROL_PLANE_OWNERS,
    tags: [...CONTROL_PLANE_TAGS, 'approval'],
    stability: CONTROL_PLANE_STABILITY,
  },
  capability: {
    key: 'control-plane.approval',
    version: '1.0.0',
  },
  io: {
    input: ControlPlaneExecutionRejectInput,
    output: ControlPlaneExecutionRejectOutput,
  },
  policy: {
    auth: 'admin',
    pii: [],
  },
});
