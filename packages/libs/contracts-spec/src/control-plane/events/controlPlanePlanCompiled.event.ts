import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineEvent } from '../../events';
import {
  CONTROL_PLANE_DOMAIN,
  CONTROL_PLANE_OWNERS,
  CONTROL_PLANE_STABILITY,
  CONTROL_PLANE_TAGS,
} from '../constants';

export const ControlPlanePlanCompiledPayload = new SchemaModel({
  name: 'ControlPlanePlanCompiledPayload',
  fields: {
    executionId: { type: ScalarTypeEnum.ID(), isOptional: false },
    planId: { type: ScalarTypeEnum.ID(), isOptional: false },
    compiledAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    stepCount: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
  },
});

export const ControlPlanePlanCompiledEvent = defineEvent({
  meta: {
    key: 'controlPlane.plan.compiled',
    version: '1.0.0',
    description: 'Emitted when an intent is compiled into an executable plan.',
    domain: CONTROL_PLANE_DOMAIN,
    owners: CONTROL_PLANE_OWNERS,
    tags: [...CONTROL_PLANE_TAGS, 'plan'],
    stability: CONTROL_PLANE_STABILITY,
  },
  payload: ControlPlanePlanCompiledPayload,
});
