import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineQuery } from '../../operations';
import {
  CONTROL_PLANE_DOMAIN,
  CONTROL_PLANE_OWNERS,
  CONTROL_PLANE_STABILITY,
  CONTROL_PLANE_TAGS,
} from '../constants';

const ControlPlaneTraceEntryModel = new SchemaModel({
  name: 'ControlPlaneTraceEntry',
  fields: {
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    stage: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    actorId: { type: ScalarTypeEnum.ID(), isOptional: true },
    metadata: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
  },
});

const ControlPlaneTraceGetInput = new SchemaModel({
  name: 'ControlPlaneTraceGetInput',
  fields: {
    executionId: { type: ScalarTypeEnum.ID(), isOptional: false },
    includePayloads: { type: ScalarTypeEnum.Boolean(), isOptional: true },
  },
});

const ControlPlaneTraceGetOutput = new SchemaModel({
  name: 'ControlPlaneTraceGetOutput',
  fields: {
    executionId: { type: ScalarTypeEnum.ID(), isOptional: false },
    entries: {
      type: ControlPlaneTraceEntryModel,
      isOptional: false,
      isArray: true,
    },
  },
});

export const ControlPlaneTraceGetQuery = defineQuery({
  meta: {
    key: 'controlPlane.trace.get',
    title: 'Get Execution Trace',
    version: '1.0.0',
    description: 'Return the replayable trace timeline for one execution.',
    goal: 'Support audits, debugging, and deterministic replay.',
    context:
      'Used by operator surfaces when inspecting policy and tool execution history.',
    domain: CONTROL_PLANE_DOMAIN,
    owners: CONTROL_PLANE_OWNERS,
    tags: [...CONTROL_PLANE_TAGS, 'trace', 'audit'],
    stability: CONTROL_PLANE_STABILITY,
  },
  capability: {
    key: 'control-plane.audit',
    version: '1.0.0',
  },
  io: {
    input: ControlPlaneTraceGetInput,
    output: ControlPlaneTraceGetOutput,
  },
  policy: {
    auth: 'admin',
    pii: [],
  },
});
