import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineQuery } from '../../operations';
import {
  CONTROL_PLANE_DOMAIN,
  CONTROL_PLANE_OWNERS,
  CONTROL_PLANE_STABILITY,
  CONTROL_PLANE_TAGS,
} from '../constants';

const ControlPlaneSkillSummaryModel = new SchemaModel({
  name: 'ControlPlaneSkillSummary',
  fields: {
    skillKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    version: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    verified: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    installedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
  },
});

const ControlPlaneSkillListInput = new SchemaModel({
  name: 'ControlPlaneSkillListInput',
  fields: {
    includeDisabled: { type: ScalarTypeEnum.Boolean(), isOptional: true },
    limit: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    offset: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
  },
});

const ControlPlaneSkillListOutput = new SchemaModel({
  name: 'ControlPlaneSkillListOutput',
  fields: {
    items: {
      type: ControlPlaneSkillSummaryModel,
      isOptional: false,
      isArray: true,
    },
    total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
  },
});

export const ControlPlaneSkillListQuery = defineQuery({
  meta: {
    key: 'controlPlane.skill.list',
    title: 'List Skills',
    version: '1.0.0',
    description: 'List installed and available skill artifacts.',
    goal: 'Provide a governed inventory of skill availability and state.',
    context:
      'Used by operators and marketplace tooling to inspect active skill sets.',
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
    input: ControlPlaneSkillListInput,
    output: ControlPlaneSkillListOutput,
  },
  policy: {
    auth: 'admin',
    pii: [],
  },
});
