import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineCommand } from '../../operations';
import {
  CONTROL_PLANE_DOMAIN,
  CONTROL_PLANE_OWNERS,
  CONTROL_PLANE_STABILITY,
  CONTROL_PLANE_TAGS,
} from '../constants';

const ControlPlanePlanVerifyInput = new SchemaModel({
  name: 'ControlPlanePlanVerifyInput',
  fields: {
    executionId: { type: ScalarTypeEnum.ID(), isOptional: false },
    planId: { type: ScalarTypeEnum.ID(), isOptional: false },
    policyVersion: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
  },
});

const ControlPlanePlanVerifyOutput = new SchemaModel({
  name: 'ControlPlanePlanVerifyOutput',
  fields: {
    verdict: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    requiresApproval: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    blockedReasons: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
      isArray: true,
    },
    verifiedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const ControlPlanePlanVerifyCommand = defineCommand({
  meta: {
    key: 'controlPlane.plan.verify',
    title: 'Verify Plan',
    version: '1.0.0',
    description: 'Run policy and risk validation against a compiled plan.',
    goal: 'Gate execution using deterministic governance checks.',
    context:
      'Executed before runtime dispatch to decide autonomous, assist, or blocked mode.',
    domain: CONTROL_PLANE_DOMAIN,
    owners: CONTROL_PLANE_OWNERS,
    tags: [...CONTROL_PLANE_TAGS, 'plan', 'governance'],
    stability: CONTROL_PLANE_STABILITY,
  },
  capability: {
    key: 'control-plane.audit',
    version: '1.0.0',
  },
  io: {
    input: ControlPlanePlanVerifyInput,
    output: ControlPlanePlanVerifyOutput,
  },
  policy: {
    auth: 'admin',
    pii: [],
  },
});
