import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineQuery } from '../../operations';
import {
  CONTROL_PLANE_DOMAIN,
  CONTROL_PLANE_OWNERS,
  CONTROL_PLANE_STABILITY,
  CONTROL_PLANE_TAGS,
} from '../constants';

const ControlPlaneSkillVerifyInput = new SchemaModel({
  name: 'ControlPlaneSkillVerifyInput',
  fields: {
    skillKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    version: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    artifactDigest: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    signature: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    keyId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

const ControlPlaneSkillVerifyOutput = new SchemaModel({
  name: 'ControlPlaneSkillVerifyOutput',
  fields: {
    verified: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    reason: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    verifiedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const ControlPlaneSkillVerifyQuery = defineQuery({
  meta: {
    key: 'controlPlane.skill.verify',
    title: 'Verify Skill Artifact',
    version: '1.0.0',
    description: 'Verify skill signature and compatibility constraints.',
    goal: 'Make skill trust checks explicit and queryable.',
    context:
      'Used by install pipelines and operators before enabling skill artifacts.',
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
    input: ControlPlaneSkillVerifyInput,
    output: ControlPlaneSkillVerifyOutput,
  },
  policy: {
    auth: 'admin',
    pii: [],
  },
});
