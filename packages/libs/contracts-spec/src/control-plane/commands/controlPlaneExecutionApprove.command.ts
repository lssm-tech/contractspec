import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineCommand } from '../../operations';
import {
  CONTROL_PLANE_DOMAIN,
  CONTROL_PLANE_OWNERS,
  CONTROL_PLANE_STABILITY,
  CONTROL_PLANE_TAGS,
} from '../constants';

const ControlPlaneExecutionApproveInput = new SchemaModel({
  name: 'ControlPlaneExecutionApproveInput',
  fields: {
    executionId: { type: ScalarTypeEnum.ID(), isOptional: false },
    stepId: { type: ScalarTypeEnum.ID(), isOptional: false },
    approvedBy: { type: ScalarTypeEnum.ID(), isOptional: false },
    note: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

const ControlPlaneExecutionApproveOutput = new SchemaModel({
  name: 'ControlPlaneExecutionApproveOutput',
  fields: {
    executionId: { type: ScalarTypeEnum.ID(), isOptional: false },
    stepId: { type: ScalarTypeEnum.ID(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    approvedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const ControlPlaneExecutionApproveCommand = defineCommand({
  meta: {
    key: 'controlPlane.execution.approve',
    title: 'Approve Execution Step',
    version: '1.0.0',
    description: 'Approve a pending execution step for continuation.',
    goal: 'Enable human-in-the-loop control for risky actions.',
    context:
      'Used in assist mode when a step requires explicit approval before dispatch.',
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
    input: ControlPlaneExecutionApproveInput,
    output: ControlPlaneExecutionApproveOutput,
  },
  policy: {
    auth: 'admin',
    pii: [],
  },
});
