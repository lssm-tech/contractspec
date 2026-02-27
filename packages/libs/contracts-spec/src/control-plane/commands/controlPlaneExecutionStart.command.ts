import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineCommand } from '../../operations';
import {
  CONTROL_PLANE_DOMAIN,
  CONTROL_PLANE_OWNERS,
  CONTROL_PLANE_STABILITY,
  CONTROL_PLANE_TAGS,
} from '../constants';

const ControlPlaneExecutionStartInput = new SchemaModel({
  name: 'ControlPlaneExecutionStartInput',
  fields: {
    executionId: { type: ScalarTypeEnum.ID(), isOptional: false },
    planId: { type: ScalarTypeEnum.ID(), isOptional: false },
    mode: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

const ControlPlaneExecutionStartOutput = new SchemaModel({
  name: 'ControlPlaneExecutionStartOutput',
  fields: {
    runId: { type: ScalarTypeEnum.ID(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    startedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const ControlPlaneExecutionStartCommand = defineCommand({
  meta: {
    key: 'controlPlane.execution.start',
    title: 'Start Execution',
    version: '1.0.0',
    description: 'Start executing an approved compiled plan.',
    goal: 'Run deterministic plan steps through the governed runtime loop.',
    context:
      'Triggered after successful verification and optional approval decisions.',
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
    input: ControlPlaneExecutionStartInput,
    output: ControlPlaneExecutionStartOutput,
  },
  policy: {
    auth: 'admin',
    pii: [],
  },
});
