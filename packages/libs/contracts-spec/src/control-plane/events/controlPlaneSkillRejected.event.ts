import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineEvent } from '../../events';
import {
  CONTROL_PLANE_DOMAIN,
  CONTROL_PLANE_OWNERS,
  CONTROL_PLANE_STABILITY,
  CONTROL_PLANE_TAGS,
} from '../constants';

export const ControlPlaneSkillRejectedPayload = new SchemaModel({
  name: 'ControlPlaneSkillRejectedPayload',
  fields: {
    skillKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    version: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    rejectedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    reason: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export const ControlPlaneSkillRejectedEvent = defineEvent({
  meta: {
    key: 'controlPlane.skill.rejected',
    version: '1.0.0',
    description: 'Emitted when a skill install attempt is rejected.',
    domain: CONTROL_PLANE_DOMAIN,
    owners: CONTROL_PLANE_OWNERS,
    tags: [...CONTROL_PLANE_TAGS, 'skills', 'governance'],
    stability: CONTROL_PLANE_STABILITY,
  },
  payload: ControlPlaneSkillRejectedPayload,
});
