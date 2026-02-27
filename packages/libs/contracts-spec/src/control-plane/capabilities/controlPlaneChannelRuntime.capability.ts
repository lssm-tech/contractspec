import { defineCapability } from '../../capabilities';
import {
  CONTROL_PLANE_DOMAIN,
  CONTROL_PLANE_OWNERS,
  CONTROL_PLANE_STABILITY,
  CONTROL_PLANE_TAGS,
} from '../constants';

export const ControlPlaneChannelRuntimeCapability = defineCapability({
  meta: {
    key: 'control-plane.channel-runtime',
    version: '1.0.0',
    kind: 'integration',
    title: 'Control Plane Channel Runtime',
    description: 'Channel-facing runtime surfaces for controlled execution.',
    domain: CONTROL_PLANE_DOMAIN,
    owners: CONTROL_PLANE_OWNERS,
    tags: [...CONTROL_PLANE_TAGS, 'channels'],
    stability: CONTROL_PLANE_STABILITY,
  },
  requires: [
    {
      key: 'control-plane.core',
      version: '1.0.0',
      reason: 'Channel runtime builds on core intent and execution contracts.',
    },
    {
      key: 'control-plane.audit',
      version: '1.0.0',
      reason: 'Channel interactions must remain traceable and replayable.',
    },
  ],
  provides: [
    {
      surface: 'event',
      key: 'controlPlane.execution.step.started',
      version: '1.0.0',
      description: 'Channel-linked step began.',
    },
    {
      surface: 'event',
      key: 'controlPlane.execution.step.completed',
      version: '1.0.0',
      description: 'Channel-linked step completed.',
    },
    {
      surface: 'event',
      key: 'controlPlane.execution.step.blocked',
      version: '1.0.0',
      description: 'Channel-linked step blocked.',
    },
  ],
});
