import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineEvent } from '../../events';
import {
  CONTROL_PLANE_DOMAIN,
  CONTROL_PLANE_OWNERS,
  CONTROL_PLANE_STABILITY,
  CONTROL_PLANE_TAGS,
} from '../constants';

export const ControlPlaneSkillInstalledPayload = new SchemaModel({
  name: 'ControlPlaneSkillInstalledPayload',
  fields: {
    installationId: { type: ScalarTypeEnum.ID(), isOptional: false },
    skillKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    version: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    installedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    publisher: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

export const ControlPlaneSkillInstalledEvent = defineEvent({
  meta: {
    key: 'controlPlane.skill.installed',
    version: '1.0.0',
    description: 'Emitted when a skill artifact is verified and installed.',
    domain: CONTROL_PLANE_DOMAIN,
    owners: CONTROL_PLANE_OWNERS,
    tags: [...CONTROL_PLANE_TAGS, 'skills'],
    stability: CONTROL_PLANE_STABILITY,
  },
  payload: ControlPlaneSkillInstalledPayload,
});
