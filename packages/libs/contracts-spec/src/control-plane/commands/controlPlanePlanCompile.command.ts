import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineCommand } from '../../operations';
import {
  CONTROL_PLANE_DOMAIN,
  CONTROL_PLANE_OWNERS,
  CONTROL_PLANE_STABILITY,
  CONTROL_PLANE_TAGS,
} from '../constants';
import { ControlPlanePlanCompiledEvent } from '../events/controlPlanePlanCompiled.event';

const ControlPlanePlanCompileInput = new SchemaModel({
  name: 'ControlPlanePlanCompileInput',
  fields: {
    executionId: { type: ScalarTypeEnum.ID(), isOptional: false },
    intentId: { type: ScalarTypeEnum.ID(), isOptional: false },
    plannerModel: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    draft: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
  },
});

const ControlPlanePlanCompileOutput = new SchemaModel({
  name: 'ControlPlanePlanCompileOutput',
  fields: {
    planId: { type: ScalarTypeEnum.ID(), isOptional: false },
    compiledAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    stepCount: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    deterministicHash: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
  },
});

export const ControlPlanePlanCompileCommand = defineCommand({
  meta: {
    key: 'controlPlane.plan.compile',
    title: 'Compile Plan',
    version: '1.0.0',
    description: 'Compile an intent into a deterministic plan DAG.',
    goal: 'Prevent freeform tool execution by requiring typed plan compilation.',
    context:
      'Executed after intent submission to produce executable, traceable steps.',
    domain: CONTROL_PLANE_DOMAIN,
    owners: CONTROL_PLANE_OWNERS,
    tags: [...CONTROL_PLANE_TAGS, 'plan'],
    stability: CONTROL_PLANE_STABILITY,
  },
  capability: {
    key: 'control-plane.core',
    version: '1.0.0',
  },
  io: {
    input: ControlPlanePlanCompileInput,
    output: ControlPlanePlanCompileOutput,
    errors: {
      INTENT_NOT_FOUND: {
        description: 'The referenced intent does not exist.',
        http: 404,
        when: 'intentId cannot be resolved for the execution context.',
      },
    },
  },
  policy: {
    auth: 'admin',
    pii: [],
  },
  sideEffects: {
    emits: [
      {
        ref: ControlPlanePlanCompiledEvent.meta,
        when: 'Plan compilation completes with a valid deterministic DAG.',
      },
    ],
  },
});
