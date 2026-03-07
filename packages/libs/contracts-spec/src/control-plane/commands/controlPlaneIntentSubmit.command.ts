import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineCommand } from '../../operations';
import {
  CONTROL_PLANE_DOMAIN,
  CONTROL_PLANE_OWNERS,
  CONTROL_PLANE_STABILITY,
  CONTROL_PLANE_TAGS,
} from '../constants';
import { ControlPlaneIntentReceivedEvent } from '../events/controlPlaneIntentReceived.event';

const ControlPlaneIntentSubmitInput = new SchemaModel({
  name: 'ControlPlaneIntentSubmitInput',
  fields: {
    workspaceId: { type: ScalarTypeEnum.ID(), isOptional: false },
    actorId: { type: ScalarTypeEnum.ID(), isOptional: true },
    channelKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    text: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    metadata: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
    traceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

const ControlPlaneIntentSubmitOutput = new SchemaModel({
  name: 'ControlPlaneIntentSubmitOutput',
  fields: {
    executionId: { type: ScalarTypeEnum.ID(), isOptional: false },
    intentId: { type: ScalarTypeEnum.ID(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    receivedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const ControlPlaneIntentSubmitCommand = defineCommand({
  meta: {
    key: 'controlPlane.intent.submit',
    title: 'Submit Intent',
    version: '1.0.0',
    description: 'Submit a natural-language intent to the control plane.',
    goal: 'Create a traceable, policy-governed entrypoint for agent requests.',
    context:
      'Used by channels and UIs to register user intent before planning and execution.',
    domain: CONTROL_PLANE_DOMAIN,
    owners: CONTROL_PLANE_OWNERS,
    tags: [...CONTROL_PLANE_TAGS, 'intent'],
    stability: CONTROL_PLANE_STABILITY,
  },
  capability: {
    key: 'control-plane.core',
    version: '1.0.0',
  },
  io: {
    input: ControlPlaneIntentSubmitInput,
    output: ControlPlaneIntentSubmitOutput,
  },
  policy: {
    auth: 'user',
    pii: ['text'],
  },
  sideEffects: {
    emits: [
      {
        ref: ControlPlaneIntentReceivedEvent.meta,
        when: 'Intent ingestion succeeds and a new execution is created.',
      },
    ],
  },
});
