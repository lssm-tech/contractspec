import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineCommand } from '../../operations';
import {
  CONTROL_PLANE_DOMAIN,
  CONTROL_PLANE_OWNERS,
  CONTROL_PLANE_STABILITY,
  CONTROL_PLANE_TAGS,
} from '../constants';
import { ControlPlaneSkillInstalledEvent } from '../events/controlPlaneSkillInstalled.event';

const ControlPlaneSkillInstallInput = new SchemaModel({
  name: 'ControlPlaneSkillInstallInput',
  fields: {
    skillKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    version: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    artifactDigest: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    signature: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    keyId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    publisher: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    metadata: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
  },
});

const ControlPlaneSkillInstallOutput = new SchemaModel({
  name: 'ControlPlaneSkillInstallOutput',
  fields: {
    installationId: { type: ScalarTypeEnum.ID(), isOptional: false },
    skillKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    version: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    verified: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    installedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const ControlPlaneSkillInstallCommand = defineCommand({
  meta: {
    key: 'controlPlane.skill.install',
    title: 'Install Skill Artifact',
    version: '1.0.0',
    description: 'Install a signed skill artifact after verification checks.',
    goal: 'Enforce trusted skill onboarding with provenance guarantees.',
    context:
      'Used by the control plane or marketplace workflows when enabling new skills.',
    domain: CONTROL_PLANE_DOMAIN,
    owners: CONTROL_PLANE_OWNERS,
    tags: [...CONTROL_PLANE_TAGS, 'skills'],
    stability: CONTROL_PLANE_STABILITY,
  },
  capability: {
    key: 'control-plane.skill-registry',
    version: '1.0.0',
  },
  io: {
    input: ControlPlaneSkillInstallInput,
    output: ControlPlaneSkillInstallOutput,
    errors: {
      SIGNATURE_INVALID: {
        description: 'The submitted artifact signature is invalid.',
        http: 400,
        when: 'Signature verification fails for the supplied artifact digest.',
      },
      COMPATIBILITY_MISMATCH: {
        description:
          'The skill is incompatible with runtime contract versions.',
        http: 409,
        when: 'Compatibility constraints do not match the active control plane version.',
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
        ref: ControlPlaneSkillInstalledEvent.meta,
        when: 'Skill validation and installation complete successfully.',
      },
    ],
  },
});
