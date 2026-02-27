import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineQuery } from '../../operations';
import {
  CONTROL_PLANE_DOMAIN,
  CONTROL_PLANE_OWNERS,
  CONTROL_PLANE_STABILITY,
  CONTROL_PLANE_TAGS,
} from '../constants';

const ControlPlaneExecutionRecordModel = new SchemaModel({
  name: 'ControlPlaneExecutionRecord',
  fields: {
    executionId: { type: ScalarTypeEnum.ID(), isOptional: false },
    intentId: { type: ScalarTypeEnum.ID(), isOptional: true },
    planId: { type: ScalarTypeEnum.ID(), isOptional: true },
    runId: { type: ScalarTypeEnum.ID(), isOptional: true },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    riskTier: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    requiresApproval: { type: ScalarTypeEnum.Boolean(), isOptional: true },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    updatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const ControlPlaneExecutionGetInput = new SchemaModel({
  name: 'ControlPlaneExecutionGetInput',
  fields: {
    executionId: { type: ScalarTypeEnum.ID(), isOptional: false },
  },
});

const ControlPlaneExecutionGetOutput = new SchemaModel({
  name: 'ControlPlaneExecutionGetOutput',
  fields: {
    execution: { type: ControlPlaneExecutionRecordModel, isOptional: false },
  },
});

export const ControlPlaneExecutionGetQuery = defineQuery({
  meta: {
    key: 'controlPlane.execution.get',
    title: 'Get Execution',
    version: '1.0.0',
    description: 'Fetch the latest state for one execution.',
    goal: 'Provide operators and channels a deterministic execution view.',
    context:
      'Used by dashboards, CLI, and channel adapters to inspect one execution.',
    domain: CONTROL_PLANE_DOMAIN,
    owners: CONTROL_PLANE_OWNERS,
    tags: [...CONTROL_PLANE_TAGS, 'execution'],
    stability: CONTROL_PLANE_STABILITY,
  },
  capability: {
    key: 'control-plane.core',
    version: '1.0.0',
  },
  io: {
    input: ControlPlaneExecutionGetInput,
    output: ControlPlaneExecutionGetOutput,
  },
  policy: {
    auth: 'admin',
    pii: [],
  },
});
