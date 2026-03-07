import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineEvent } from '../../events';
import {
  CONTROL_PLANE_DOMAIN,
  CONTROL_PLANE_OWNERS,
  CONTROL_PLANE_STABILITY,
  CONTROL_PLANE_TAGS,
} from '../constants';

export const ControlPlanePlanRejectedPayload = new SchemaModel({
  name: 'ControlPlanePlanRejectedPayload',
  fields: {
    executionId: { type: ScalarTypeEnum.ID(), isOptional: false },
    planId: { type: ScalarTypeEnum.ID(), isOptional: true },
    rejectedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    reasons: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
      isArray: true,
    },
  },
});

export const ControlPlanePlanRejectedEvent = defineEvent({
  meta: {
    key: 'controlPlane.plan.rejected',
    version: '1.0.0',
    description: 'Emitted when a plan fails verification or governance checks.',
    domain: CONTROL_PLANE_DOMAIN,
    owners: CONTROL_PLANE_OWNERS,
    tags: [...CONTROL_PLANE_TAGS, 'plan', 'governance'],
    stability: CONTROL_PLANE_STABILITY,
  },
  payload: ControlPlanePlanRejectedPayload,
});
