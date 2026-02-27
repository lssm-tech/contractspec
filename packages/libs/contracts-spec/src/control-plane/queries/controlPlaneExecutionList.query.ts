import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineQuery } from '../../operations';
import {
  CONTROL_PLANE_DOMAIN,
  CONTROL_PLANE_OWNERS,
  CONTROL_PLANE_STABILITY,
  CONTROL_PLANE_TAGS,
} from '../constants';

const ControlPlaneExecutionSummaryModel = new SchemaModel({
  name: 'ControlPlaneExecutionSummary',
  fields: {
    executionId: { type: ScalarTypeEnum.ID(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    riskTier: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    updatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const ControlPlaneExecutionListInput = new SchemaModel({
  name: 'ControlPlaneExecutionListInput',
  fields: {
    workspaceId: { type: ScalarTypeEnum.ID(), isOptional: true },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    limit: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    offset: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
  },
});

const ControlPlaneExecutionListOutput = new SchemaModel({
  name: 'ControlPlaneExecutionListOutput',
  fields: {
    items: {
      type: ControlPlaneExecutionSummaryModel,
      isOptional: false,
      isArray: true,
    },
    total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
  },
});

export const ControlPlaneExecutionListQuery = defineQuery({
  meta: {
    key: 'controlPlane.execution.list',
    title: 'List Executions',
    version: '1.0.0',
    description: 'List execution runs with filtering and pagination.',
    goal: 'Provide auditable execution inventory for operations teams.',
    context:
      'Used by dashboards and CLI status views to monitor runtime execution.',
    domain: CONTROL_PLANE_DOMAIN,
    owners: CONTROL_PLANE_OWNERS,
    tags: [...CONTROL_PLANE_TAGS, 'execution'],
    stability: CONTROL_PLANE_STABILITY,
  },
  capability: {
    key: 'control-plane.core',
    version: '1.0.0',
  },
  io: {
    input: ControlPlaneExecutionListInput,
    output: ControlPlaneExecutionListOutput,
  },
  policy: {
    auth: 'admin',
    pii: [],
  },
});
