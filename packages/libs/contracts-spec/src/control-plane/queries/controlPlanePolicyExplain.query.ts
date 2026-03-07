import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineQuery } from '../../operations';
import {
  CONTROL_PLANE_DOMAIN,
  CONTROL_PLANE_OWNERS,
  CONTROL_PLANE_STABILITY,
  CONTROL_PLANE_TAGS,
} from '../constants';

const ControlPlanePolicyExplainInput = new SchemaModel({
  name: 'ControlPlanePolicyExplainInput',
  fields: {
    executionId: { type: ScalarTypeEnum.ID(), isOptional: false },
    stepId: { type: ScalarTypeEnum.ID(), isOptional: true },
  },
});

const ControlPlanePolicyExplainOutput = new SchemaModel({
  name: 'ControlPlanePolicyExplainOutput',
  fields: {
    verdict: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    riskTier: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    reasons: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
      isArray: true,
    },
    policyVersion: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
  },
});

export const ControlPlanePolicyExplainQuery = defineQuery({
  meta: {
    key: 'controlPlane.policy.explain',
    title: 'Explain Policy Verdict',
    version: '1.0.0',
    description: 'Explain policy outcomes for an execution or step.',
    goal: 'Make governance decisions auditable and understandable.',
    context:
      'Used in operator UIs and incident review to inspect verdict rationale.',
    domain: CONTROL_PLANE_DOMAIN,
    owners: CONTROL_PLANE_OWNERS,
    tags: [...CONTROL_PLANE_TAGS, 'policy', 'audit'],
    stability: CONTROL_PLANE_STABILITY,
  },
  capability: {
    key: 'control-plane.audit',
    version: '1.0.0',
  },
  io: {
    input: ControlPlanePolicyExplainInput,
    output: ControlPlanePolicyExplainOutput,
  },
  policy: {
    auth: 'admin',
    pii: [],
  },
});
