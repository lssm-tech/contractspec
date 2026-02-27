import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineEvent } from '../../events';
import {
  CONTROL_PLANE_DOMAIN,
  CONTROL_PLANE_OWNERS,
  CONTROL_PLANE_STABILITY,
  CONTROL_PLANE_TAGS,
} from '../constants';

export const ControlPlaneIntentReceivedPayload = new SchemaModel({
  name: 'ControlPlaneIntentReceivedPayload',
  fields: {
    executionId: { type: ScalarTypeEnum.ID(), isOptional: false },
    intentId: { type: ScalarTypeEnum.ID(), isOptional: false },
    receivedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    actorId: { type: ScalarTypeEnum.ID(), isOptional: true },
    channelKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

export const ControlPlaneIntentReceivedEvent = defineEvent({
  meta: {
    key: 'controlPlane.intent.received',
    version: '1.0.0',
    description: 'Emitted when a new control plane intent is accepted.',
    domain: CONTROL_PLANE_DOMAIN,
    owners: CONTROL_PLANE_OWNERS,
    tags: [...CONTROL_PLANE_TAGS, 'intent'],
    stability: CONTROL_PLANE_STABILITY,
  },
  payload: ControlPlaneIntentReceivedPayload,
});
