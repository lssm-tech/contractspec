import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineCommand } from '../../operations';
import {
  CONTROL_PLANE_DOMAIN,
  CONTROL_PLANE_OWNERS,
  CONTROL_PLANE_STABILITY,
  CONTROL_PLANE_TAGS,
} from '../constants';

const ControlPlaneSkillDisableInput = new SchemaModel({
  name: 'ControlPlaneSkillDisableInput',
  fields: {
    skillKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    version: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    disabledBy: { type: ScalarTypeEnum.ID(), isOptional: false },
    reason: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

const ControlPlaneSkillDisableOutput = new SchemaModel({
  name: 'ControlPlaneSkillDisableOutput',
  fields: {
    skillKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    version: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    disabledAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const ControlPlaneSkillDisableCommand = defineCommand({
  meta: {
    key: 'controlPlane.skill.disable',
    title: 'Disable Skill Artifact',
    version: '1.0.0',
    description: 'Disable an installed skill in the control plane registry.',
    goal: 'Allow operators to revoke risky or obsolete skills quickly.',
    context:
      'Used for incident response, governance enforcement, and lifecycle cleanup.',
    domain: CONTROL_PLANE_DOMAIN,
    owners: CONTROL_PLANE_OWNERS,
    tags: [...CONTROL_PLANE_TAGS, 'skills', 'governance'],
    stability: CONTROL_PLANE_STABILITY,
  },
  capability: {
    key: 'control-plane.skill-registry',
    version: '1.0.0',
  },
  io: {
    input: ControlPlaneSkillDisableInput,
    output: ControlPlaneSkillDisableOutput,
  },
  policy: {
    auth: 'admin',
    pii: [],
  },
});
